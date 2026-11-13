import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

import { adminAutomationRouter } from './src/server/adminAutomationRouter';
import {
  securityRouter,
  rateLimiterMiddleware,
  inputSanitizerMiddleware,
} from './src/server/securityRouter';
import { sharedAiCache } from './src/server/sharedAiCache';
import { generateCurriculumLessonFallback } from './curriculumLessonFallback';
import { requireAuth, requireSuperAdmin, isPremiumActive, isPremiumLearningActive } from './src/server/authMiddleware';
import { CURRICULUM_DATA } from './src/data/curriculum';
import { paymentsRouter, VERIFIED_PAYMENT_ACCOUNTS, getPricing } from './src/server/paymentsApi';
import { aiContextMiddleware, consumeAiQuota } from './src/server/aiQuota';
import { adminDb } from './src/server/adminDb';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(inputSanitizerMiddleware);
app.use('/api', (req, res, next) => (req.path === '/health' || req.path === '/payment/config' ? next() : requireAuth(req, res, next)));
app.use('/api', rateLimiterMiddleware);
app.use('/api', aiContextMiddleware);
app.use('/api/payment', paymentsRouter);
app.use('/api/admin', requireSuperAdmin, adminAutomationRouter);
app.use('/api/security', (req, res, next) => (req.method === 'POST' && req.path === '/audit-logs') ? next() : requireSuperAdmin(req, res, next), securityRouter);

// Resilient Gemini AI client initialization
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback model list prioritized for speed, quota resilience, and reasoning
const RESILIENT_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-4-argon',
];

interface CallGeminiOptions {
  systemInstruction?: string;
  responseMimeType?: string;
  temperature?: number;
  parts?: Array<any>;
}

async function callResilientGemini(promptText: string, options: CallGeminiOptions = {}) {
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  // Enforces the per-user daily cap on real (non-cached) Gemini calls.
  await consumeAiQuota();

  let lastError: any = null;

  for (const model of RESILIENT_MODELS) {
    try {
      const contents = options.parts && options.parts.length > 0
        ? { parts: options.parts }
        : promptText;

      const config: any = {};
      if (options.systemInstruction) {
        config.systemInstruction = options.systemInstruction;
      }
      if (options.responseMimeType) {
        config.responseMimeType = options.responseMimeType;
      }
      if (typeof options.temperature === 'number') {
        config.temperature = options.temperature;
      }

      const response = await ai.models.generateContent({
        model,
        contents,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      return {
        text: response.text || '',
        modelUsed: model,
      };
    } catch (err: any) {
      console.warn(`Model ${model} failed, trying next fallback:`, err?.message || err);
      lastError = err;
      const msg = String(err?.message || '');
      if (err?.status === 429 || msg.includes('429') || msg.includes('Quota exceeded') || msg.includes('RESOURCE_EXHAUSTED')) {
        console.warn('Gemini Free Tier quota exhausted for project, breaking fallback loop immediately.');
        break;
      }
    }
  }

  throw new Error(`All Gemini fallback models exhausted. Last error: ${lastError?.message || 'Unknown error'}`);
}

// Shared AI Knowledge Cache Statistics & Savings Endpoint
app.get('/api/ai/cache-stats', requireSuperAdmin, (_req: Request, res: Response) => {
  res.json(sharedAiCache.getStats());
});

// AI Socratic Tutor endpoint
app.post('/api/ai/tutor', async (req: Request, res: Response) => {
  try {
    const {
      message,
      history,
      grade = '9-12',
      subject = 'Mathematics & Science',
      unit = 'Core Unit',
      topic = 'Competency Standard',
      contextExcerpts,
      diagnosticContext_weakAreas,
      language = 'am',
      is_premium,
      isPremium,
    } = req.body;

    const isVip = isPremiumActive(req.user);

    const vipTutorPrompt = isVip
      ? `\n[VIP SOCRATIC TUTOR INSTRUCTION]
You are NUR AI, the private VIP Tutor for an Ethiopian High School student.
- Deep Socratic Reasoning: Do not merely give flat answers. Break complex concepts into intuitive 3-step insights:
  1. The Real-World Intuition (relate physics/chemistry/math to Ethiopian daily life or technology).
  2. The Rigorous Formula & LaTeX Derivation (show step-by-step cancellation and unit conversions).
  3. The EUEE Exam Trap Alert (highlight common mistakes Ethiopian students make on this exact question in national exams).
- Multimodal OCR Solver: If an image is provided, extract all printed/handwritten equations accurately, identify the diagram, and solve with complete working.
- Multilingual Voice Adaptation: Format output with clear pacing, bold mathematical markers, and natural sentence structures suitable for Text-to-Speech (TTS) synthesis in the student's selected language:
  Amharic (አማርኛ), Afaan Oromoo, Tigrinya (ትግርኛ), Arabic (العربية), Somali (Soomaali), or English.\n`
      : '';

    // Check shared cross-student AI cache before calling Gemini (skip cache if VIP to provide personalized Socratic reasoning)
    const cachedReply = !isVip
      ? sharedAiCache.getTutorReply({
          grade: String(grade),
          subject: String(subject),
          unit: String(unit),
          topic: String(topic),
          message: String(message || ''),
          language: String(language),
        })
      : null;

    if (cachedReply) {
      return res.json({
        success: true,
        reply: cachedReply.reply,
        modelUsed: cachedReply.modelUsed || 'shared-community-cache',
        cached: true,
        source: 'SHARED_COMMUNITY_CACHE',
        hitCount: cachedReply.hitCount,
      });
    }

    const languageInstructions: Record<string, string> = {
      am: 'በግልጽ እና በሚያበረታታ አማርኛ መልስ ስጥ። ቁልፍ ሳይንሳዊ እና የሂሳብ ቃላትን በእንግሊዝኛ በቅንፍ ውስጥ አካትት። (e.g., ፍጥንጥነት (Acceleration), ገደብ (Limit), ስብስብ (Set))።',
      om: 'Afaan Oromootiin deebii ifaa fi jajjabeessaa kenni. Jechoota teeknikaa Ingiliffaan boqonnaa keessatti dabalii (e.g., Saffisa (Velocity), Daangaa (Limit), Tuuta (Set)).',
      ti: 'ብትግርኛ ንጹርን ዘተባብዕን መልሲ ሃብ። ቴክኒካዊ ቃላት ብእንግሊዝኛ ኣብ ቅንፊ ኣእቱ (e.g., ቅልጣፈ (Acceleration), ገደብ (Limit))።',
      ar: 'أجب بلغة عربية فصحى مشجعة وواضحة، مع ذكر المصطلحات العلمية بالإنجليزية بين قوسين (مثل: التسارع (Acceleration)، النهاية (Limit)).',
      so: 'Ku jawaab af Soomaali cad oo dhiirigelin leh, adoo ereyada sayniska ku qoraya Ingiriis marka loo baahdo (e.g., Xawaaraha (Velocity), Xadka (Limit)).',
      en: 'Respond in clear, professional, pedagogically sound English with encouraging scholarly tone and step-by-step guidance.',
    };

    const systemPrompt = `You are an elite, caring Ethiopian High School Personal AI Teacher and Tutor (NUR AI). You serve as the student's personal instructor, guiding them through the Ethiopian New Secondary Curriculum (Grades 9-12) without needing human intervention.

Classroom Context:
- Subject: ${subject}
- Grade: ${grade}
- Unit/Topic: ${unit} - ${topic}
- Official MoE Textbook Excerpt: ${contextExcerpts || 'FDRE Ministry of Education New Curriculum (2019 E.C. / 2026) Official Framework.'}

Student Diagnostic Context:
${diagnosticContext_weakAreas || 'Student is actively studying this unit; guide them through any conceptual hurdles.'}
${vipTutorPrompt}
TEACHING RULES & PEDAGOGICAL CONSTRAINTS:
1. Search and use the provided textbook excerpts as your PRIMARY knowledge source.
2. Every textbook-based answer MUST cite: [Grade ${grade}, Subject: ${subject}, Unit: ${unit}, Topic: ${topic}, and Textbook Page Number].
3. STRICT FACTUALITY: NEVER invent facts or textbook content. If the excerpts do not contain the answer, say clearly: "ይህ መረጃ በክፍል ${grade} የ${subject} ይፋዊ የአዲሱ ስርዓተ-ትምህርት የመማሪያ መጽሐፍ ውስጥ አልተካተተም። (This information is not available in the current curriculum source.)"
4. Do NOT copy long copyrighted passages word-for-word. Summarize them with mathematical, scientific, and grammatical precision.
5. Problem-Solving Protocol (for Math, Physics, Chemistry):
   - Step 1: 📝 Given & Required (የተሰጡ እና የሚፈለጉ መጠኖች)
   - Step 2: 📐 Governing Law / Formula (ዋናው የመማሪያ መጽሐፍ ቀመር)
   - Step 3: 🔄 Unit Consistency & SI conversion (መለኪያዎችን ወደ SI መቀየር)
   - Step 4: 🔢 Step-by-Step Calculation (ደረጃ በደረጃ ስሌት)
   - Step 5: ✅ Sanity Check & Final Answer (የውጤቱ ትክክለኛነት ማረጋገጫ)
6. Ethiopian Contextual Analogies: Explain concepts using real Ethiopian examples:
   - Energy/Physics: Grand Ethiopian Renaissance Dam (GERD) hydropower, Abbay river discharge, Tekeze hydro turbines.
   - Geology/Geography: Ethiopian Great Rift Valley topography, Erta Ale, Afar depression, Entoto mountain inclines.
   - Biology/Botany: Endemic fauna (Walia Ibex, Gelada Baboon), Flora (Coffea Arabica, Teff Eragrostis tef, Ensete).
   - Telecommunications/Waves: Ethio Telecom fiber optic national trunk lines and cellular dispersion.
   - Economics/Math: Commercial Bank of Ethiopia (CBE), Ethiopian Commodity Exchange (ECX), traditional Equb (እቁብ) savings rotation.
7. Multilingual Instruction:
8. 3-Level Pedagogical Hint Scaffolding (when asked for hints):
   - Level 1 (Conceptual Nudge): Provide ONLY an intuitive concept reminder and broad scientific law or theorem without formulas.
   - Level 2 (Formula & Variable Clue): Provide the governing equation and ask the student to identify which variable they already know.
   - Level 3 (Strategic Roadmap): Guide the algebraic setup and isolation of the unknown variable, but STRICTLY DO NOT calculate or reveal the final numerical answer. Encourage the student to compute the final answer themselves!
9. Socratic Method: Encourage the student, ask thoughtful checking questions, and build deep understanding.`;

    const chatContext = Array.isArray(history) && history.length > 0
      ? history.map((m: any) => `${m.role === 'user' ? 'Student' : 'NUR AI'}: ${m.content}`).join('\n') + `\nStudent: ${message}`
      : `Student: ${message}`;

    const result = await callResilientGemini(chatContext, {
      systemInstruction: systemPrompt,
      temperature: 0.6,
    });

    // Save to shared AI knowledge cache so any student asking same question later gets free instant response
    sharedAiCache.setTutorReply(
      {
        grade: String(grade),
        subject: String(subject),
        unit: String(unit),
        topic: String(topic),
        message: String(message || ''),
        language: String(language),
      },
      result.text,
      result.modelUsed
    );

    res.json({
      success: true,
      reply: result.text,
      modelUsed: result.modelUsed,
      cached: false,
    });
  } catch (err: any) {
    console.error('Error in /api/ai/tutor:', err);
    res.status(err?.statusCode === 429 ? 429 : 500).json({
      success: false,
      error: err?.message || 'Failed to process AI tutor request',
      fallbackReply: 'የኔ ተማሪ፣ ጊዜያዊ የኔትዎርክ መቆራረጥ አጋጥሟል። እባክዎ ጥያቄዎን በድጋሚ ይሞክሩ ወይም ከመማሪያ መጽሐፉ ዋና ዋና ነጥቦች ጋር ያገናኙት።',
    });
  }
});

// Multimodal OCR Question Solver (Image & Voice)
app.post('/api/ai/ocr-solve', async (req: Request, res: Response) => {
  if (!isPremiumLearningActive(req.user)) {
    return res.status(402).json({
      success: false,
      code: 'PREMIUM_LEARNING_REQUIRED',
      error: 'ፎቶና ቪዲዮ ሶልቨርን ለመጠቀም የፕሪሚየም ትምህርት ፈቃድ (57 ETB/month) ያስፈልጋል። እባክዎ ክፍያ ይፈጽሙ። / Premium Learning plan (57 ETB/month) required.',
    });
  }

  const parts: Array<any> = [];
  let hadImage = false;
  try {
    const { imageBase64, mimeType = 'image/jpeg', questionPrompt, grade = '9-12', subject = 'Science', language = 'am' } = req.body;
    hadImage = Boolean(imageBase64);

    const isVip = isPremiumLearningActive(req.user);

    if (!imageBase64 && !questionPrompt) {
      return res.status(400).json({ success: false, error: 'Either imageBase64 or questionPrompt must be provided' });
    }

    // Check shared AI knowledge cache for identical or similar questions
    const cachedOcr = sharedAiCache.getOcrSolve({
      grade: String(grade),
      subject: String(subject),
      questionPrompt: questionPrompt ? String(questionPrompt) : undefined,
      imageBase64: imageBase64 ? String(imageBase64) : undefined,
      language: String(language),
    });

    if (cachedOcr) {
      return res.json({
        success: true,
        solution: cachedOcr.solution,
        modelUsed: cachedOcr.modelUsed || 'shared-community-cache',
        cached: true,
        source: 'SHARED_COMMUNITY_CACHE',
        hitCount: cachedOcr.hitCount,
        fileDeleted: hadImage,
      });
    }

    if (imageBase64) {
      const cleanData = imageBase64.replace(/^data:[^;]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType,
          data: cleanData,
        },
      });
    }

    const vipOcrInstruction = isVip
      ? `\n[VIP SOCRATIC TUTOR INSTRUCTION]
You are NUR AI, the private VIP Tutor for an Ethiopian High School student.
- Deep Socratic Reasoning: Do not merely give flat answers. Break complex concepts into intuitive 3-step insights:
  1. The Real-World Intuition (relate physics/chemistry/math to Ethiopian daily life or technology).
  2. The Rigorous Formula & LaTeX Derivation (show step-by-step cancellation and unit conversions).
  3. The EUEE Exam Trap Alert (highlight common mistakes Ethiopian students make on this exact question in national exams).
- Multimodal OCR Solver: If an image is provided, extract all printed/handwritten equations accurately, identify the diagram, and solve with complete working.
- Multilingual Voice Adaptation: Format output with clear pacing, bold mathematical markers, and natural sentence structures suitable for Text-to-Speech (TTS) synthesis in the student's selected language:
  Amharic (አማርኛ), Afaan Oromoo, Tigrinya (ትግርኛ), Arabic (العربية), Somali (Soomaali), or English.\n`
      : '';

    const promptText = `You are NUR AI, solving an Ethiopian High School problem for Grade ${grade}, Subject: ${subject} following the MoE New Curriculum (2019 E.C. / 2026).
Student query/note: ${questionPrompt || 'Please solve this question using the 5-step Problem-Solving Protocol.'}
Language of response: ${language}.
${vipOcrInstruction}
Format your response strictly using the Ethiopian High School 5-Step Problem-Solving Protocol:
📖 [MoE Textbook Citation: Grade ${grade}, ${subject}, Curriculum Standard 2019 E.C.]

Step 1: 📝 Given & Required (የተሰጡ እና የሚፈለጉ መጠኖች)
Step 2: 📐 Governing Law / Formula (ዋናው የመማሪያ መጽሐፍ ቀመር)
Step 3: 🔄 Unit Consistency & SI conversion (መለኪያዎችን ወደ SI መቀየር)
Step 4: 🔢 Step-by-Step Calculation (ደረጃ በደረጃ ስሌት)
Step 5: ✅ Sanity Check & Final Answer (የውጤቱ ትክክለኛነት ማረጋገጫ)

💡 Ethiopian Context & Textbook Connection (ከኢትዮጵያ ነባራዊ ሁኔታ ጋር ያለው ትስስር)`;

    parts.push({ text: promptText });

    const result = await callResilientGemini(promptText, {
      parts,
      temperature: 0.3,
    });

    // Save answer automatically to persistent shared AI cache (only hash is used; raw image is NOT stored)
    sharedAiCache.setOcrSolve(
      {
        grade: String(grade),
        subject: String(subject),
        questionPrompt: questionPrompt ? String(questionPrompt) : undefined,
        imageBase64: imageBase64 ? String(imageBase64) : undefined,
        language: String(language),
      },
      result.text,
      result.modelUsed
    );

    res.json({
      success: true,
      solution: result.text,
      modelUsed: result.modelUsed,
      cached: false,
      answerSaved: true,
      fileDeleted: hadImage,
    });
  } catch (err: any) {
    console.error('Error in /api/ai/ocr-solve:', err);
    res.status(err?.statusCode === 429 ? 429 : 500).json({
      success: false,
      error: err?.message || 'Failed to process OCR solve request',
    });
  } finally {
    // Automatically discard uploaded image payload from memory immediately after processing
    if (req.body && 'imageBase64' in req.body) {
      delete req.body.imageBase64;
    }
    parts.length = 0;
  }
});

// In-memory cache for generated lessons keyed by `${topicId}:${language}`
const LESSON_MEMORY_CACHE = new Map<string, { lesson: any; grounded: boolean; sources: any[]; modelUsed?: string }>();

function parsePageRange(ref?: string): [number, number] | null {
  if (!ref || typeof ref !== 'string') return null;
  const matchRange = ref.match(/(\d+)\s*[-–—to]+\s*(\d+)/i);
  if (matchRange) {
    const start = parseInt(matchRange[1], 10);
    const end = parseInt(matchRange[2], 10);
    if (!isNaN(start) && !isNaN(end)) {
      return [Math.min(start, end), Math.max(start, end)];
    }
  }
  const matchSingle = ref.match(/(\d+)/);
  if (matchSingle) {
    const p = parseInt(matchSingle[1], 10);
    if (!isNaN(p)) return [p, p];
  }
  return null;
}

function findTextbookPages(subjectCode: string, subjectName: string, grade: any): any[] | null {
  const dataDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) return null;

  const sName = (subjectName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const sCode = (subjectCode || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const gStr = String(grade || '').replace(/[^0-9]/g, '');

  try {
    const files = fs.readdirSync(dataDir);
    for (const f of files) {
      if (!f.endsWith('.json')) continue;
      const lower = f.toLowerCase();
      const hasGrade = lower.includes(`grade${gStr}`) || lower.includes(`g${gStr}`) || (gStr && lower.includes(gStr));
      const hasSub = (sName && lower.includes(sName)) || (sCode && lower.includes(sCode));
      if (hasGrade && hasSub) {
        const fullPath = path.join(dataDir, f);
        const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        if (Array.isArray(parsed.pages)) {
          return parsed.pages;
        }
      }
    }
  } catch (err) {
    console.warn('Error reading textbook data directory:', err);
  }
  return null;
}

function findCurriculumTopic(
  topicId?: string,
  topicTitle?: string,
  subjectCode?: string,
  grade?: string | number,
  extra?: { summary?: string; pageReference?: string; objectives?: string[]; unitTitle?: string; subjectName?: string }
) {
  const cleanId = (topicId || '').trim().toLowerCase();
  const cleanTitle = (topicTitle || '').trim().toLowerCase();
  const cleanSub = (subjectCode || '').trim().toLowerCase();
  const cleanGrade = grade ? String(grade).trim() : '';

  // 1. Direct ID match
  if (cleanId) {
    for (const subject of CURRICULUM_DATA) {
      for (const unit of subject.units) {
        for (const topic of unit.topics) {
          if (topic.id.toLowerCase() === cleanId) {
            return { topic, unit, subject };
          }
        }
      }
    }
  }

  // 2. Title & Subject match
  if (cleanTitle) {
    for (const subject of CURRICULUM_DATA) {
      if (cleanSub && !subject.code.toLowerCase().includes(cleanSub) && !subject.id.toLowerCase().includes(cleanSub)) {
        continue;
      }
      if (cleanGrade && String(subject.grade) !== cleanGrade) {
        continue;
      }
      for (const unit of subject.units) {
        for (const topic of unit.topics) {
          const tLower = topic.title.toLowerCase();
          if (tLower === cleanTitle || tLower.includes(cleanTitle) || cleanTitle.includes(tLower)) {
            return { topic, unit, subject };
          }
        }
      }
    }
  }

  // 3. Fallback title match anywhere across curriculum
  if (cleanTitle) {
    for (const subject of CURRICULUM_DATA) {
      for (const unit of subject.units) {
        for (const topic of unit.topics) {
          if (topic.title.toLowerCase() === cleanTitle) {
            return { topic, unit, subject };
          }
        }
      }
    }
  }

  // 4. Synthesize valid MoE Curriculum Topic on demand if not explicitly listed in static dataset
  const fallbackTitle = topicTitle || topicId || 'Curriculum Topic';
  const fallbackSubCode = subjectCode || 'GEN-10';
  const fallbackSubName = extra?.subjectName || fallbackSubCode;
  const fallbackGrade = grade ? Number(grade) : 10;
  return {
    topic: {
      id: topicId || `dyn-${Date.now()}`,
      title: fallbackTitle,
      competencyObjectives: extra?.objectives || [],
      summary: extra?.summary || '',
      content: '',
      pageReference: extra?.pageReference || `MoE Standard Textbook Grade ${fallbackGrade}`,
    },
    unit: {
      id: `unit-dyn`,
      unitNumber: 1,
      title: extra?.unitTitle || 'Curriculum Core Unit',
      description: 'MoE Core Unit',
      topics: [],
    },
    subject: {
      id: `sub-${fallbackSubCode.toLowerCase()}`,
      code: fallbackSubCode,
      grade: fallbackGrade as any,
      icon: 'BookOpen',
      color: 'emerald',
      name: { am: fallbackSubName, en: fallbackSubName, om: fallbackSubName, ti: fallbackSubName, ar: fallbackSubName, so: fallbackSubName },
      units: [],
    },
  };
}

// Generate Full Lesson from Topic (with MoE Textbook Grounding)
app.post('/api/ai/lesson', async (req: Request, res: Response) => {
  try {
    const rawTopicId = req.body?.topicId;
    const rawTopicTitle = req.body?.topicTitle;
    const rawSubjectCode = req.body?.subjectCode;
    const rawGrade = req.body?.grade;

    if (!rawTopicId && !rawTopicTitle) {
      return res.status(400).json({
        success: false,
        error: 'TOPIC_REQUIRED',
        message: 'A valid topicId or topicTitle is required.',
      });
    }

    const found = findCurriculumTopic(rawTopicId, rawTopicTitle, rawSubjectCode, rawGrade, {
      summary: req.body?.topicContext,
      pageReference: req.body?.pageReference,
      objectives: req.body?.objectives,
      unitTitle: req.body?.unitTitle,
      subjectName: req.body?.subjectName,
    })!;

    // Validate language strictly to only allow ['am', 'om', 'ti', 'ar', 'so', 'en']
    const ALLOWED_LANGUAGES = ['am', 'om', 'ti', 'ar', 'so', 'en'] as const;
    type AllowedLanguage = (typeof ALLOWED_LANGUAGES)[number];
    const language: AllowedLanguage = (
      typeof req.body?.language === 'string' && (ALLOWED_LANGUAGES as readonly string[]).includes(req.body.language)
    )
      ? (req.body.language as AllowedLanguage)
      : 'am';

    // ONLY use server-side topic data
    const serverTopic = found.topic;
    const serverUnit = found.unit;
    const serverSubject = found.subject;

    const topicId = serverTopic.id;
    const topicTitle = serverTopic.title;
    const unitTitle = serverUnit.title;
    const pageReference = serverTopic.pageReference || '';
    const objectives = serverTopic.competencyObjectives || [];
    const subjectCode = serverSubject.code;
    const subjectName = serverSubject.name[language] || serverSubject.name['en'] || serverSubject.name['am'] || serverSubject.code;
    const grade = String(serverSubject.grade);

    // Check cross-student persistent AI cache first
    const cachedLesson = sharedAiCache.getLesson({
      subjectCode,
      subjectName,
      grade,
      topicId,
      topicTitle,
      language,
    });

    if (cachedLesson) {
      return res.json({
        success: true,
        lesson: cachedLesson.lesson,
        grounded: cachedLesson.grounded,
        sources: cachedLesson.sources,
        cached: true,
        source: 'SHARED_COMMUNITY_CACHE',
        hitCount: cachedLesson.hitCount,
        modelUsed: cachedLesson.modelUsed,
      });
    }

    const cacheKey = `${topicId}:${language}`;
    if (LESSON_MEMORY_CACHE.has(cacheKey)) {
      const cachedEntry = LESSON_MEMORY_CACHE.get(cacheKey)!;
      return res.json({
        success: true,
        lesson: cachedEntry.lesson,
        grounded: cachedEntry.grounded,
        sources: cachedEntry.sources,
        cached: true,
        modelUsed: cachedEntry.modelUsed,
      });
    }

    let grounded = false;
    let sources: Array<{ printedPage: number; unit: any }> = [];
    let textbookPagesText = '';

    const allPages = findTextbookPages(subjectCode, subjectName, grade);
    if (allPages && allPages.length > 0) {
      const range = parsePageRange(pageReference);
      let matchedPages: any[] = [];

      if (range) {
        matchedPages = allPages.filter(
          (p: any) => typeof p.printedPage === 'number' && p.printedPage >= range[0] && p.printedPage <= range[1]
        );
      }

      if (matchedPages.length === 0) {
        // Pick 4 pages with the best keyword match on topicTitle
        const keywords = topicTitle
          .toLowerCase()
          .split(/[\s,.:;()/-]+/)
          .filter((w: string) => w.length > 2);

        const scored = allPages.map((p: any) => {
          const text = `${p.unitTitle || ''} ${p.text || ''}`.toLowerCase();
          let score = 0;
          for (const kw of keywords) {
            if (text.includes(kw)) score += 1;
          }
          return { page: p, score };
        });

        scored.sort((a: any, b: any) => b.score - a.score);
        matchedPages = scored.slice(0, 4).map((s: any) => s.page);
      }

      // Put up to 6 of those pages (max 12000 characters total)
      const selected = matchedPages.slice(0, 6);
      let totalChars = 0;
      const finalPages: any[] = [];
      for (const p of selected) {
        const snippet = `[Printed Page ${p.printedPage}, Unit: ${p.unit ?? ''} - ${p.unitTitle || ''}]\n${p.text || ''}\n\n`;
        if (totalChars + snippet.length > 12000 && finalPages.length > 0) break;
        textbookPagesText += snippet;
        totalChars += snippet.length;
        finalPages.push(p);
      }

      if (finalPages.length > 0) {
        grounded = true;
        sources = finalPages.map((p: any) => ({
          printedPage: p.printedPage,
          unit: p.unit,
        }));
      }
    }

    const sourceSection = grounded && textbookPagesText
      ? `TEXTBOOK PAGES:\n${textbookPagesText}`
      : `TOPIC CONTEXT:\n${subjectName} Grade ${grade} - ${topicTitle}\n${serverTopic.summary || ''}\n${serverTopic.content || ''}`;

    const prompt = `you are a master Ethiopian high-school teacher and textbook author; Grade ${grade} level; answer in the language ${language}; if TEXTBOOK PAGES are provided use them faithfully; use plain text and Unicode for math (no LaTeX); give Ethiopian everyday examples where natural; double-check every calculation in worked examples and review questions before answering; write detailed, complete step-by-step procedures for activities and step-by-step solutions for review questions.

Curriculum Details:
- Subject: ${subjectName} (${subjectCode})
- Grade: ${grade}
- Unit: ${unitTitle}
- Topic: ${topicTitle}
- Objectives: ${objectives.join('; ')}
- Page Reference: ${pageReference}

${sourceSection}

Respond ONLY with valid JSON following this exact shape:
{
  "explanation": [
    {"heading": "Section Heading", "body": "Comprehensive pedagogical explanation paragraph"}
  ],
  "keyTerms": [
    {"term": "Term Name", "meaning": "Precise definition"}
  ],
  "workedExamples": [
    {
      "title": "Example Title",
      "problem": "Problem statement",
      "steps": ["Step 1: Given and formula", "Step 2: Substitution", "Step 3: Calculation and unit verification"],
      "answer": "Final calculated answer with standard units"
    }
  ],
  "activity": {
    "title": "MoE Textbook Practical Activity / Lab Experiment",
    "type": "lab_experiment",
    "materials": ["Material 1", "Material 2", "Material 3"],
    "steps": ["Step 1: Setup", "Step 2: Execution", "Step 3: Measurement", "Step 4: Recording"],
    "observe": "What the student should observe or conclude",
    "answer": "Step-by-step textbook activity worked solution and pedagogical conclusion",
    "stepByStepSolution": ["Step 1: Procedure setup", "Step 2: Empirical observation analysis", "Step 3: Verification against curriculum theory"]
  },
  "illustrations": [
    {
      "title": "Visual Conceptual Diagram",
      "caption": "Pedagogical caption describing the diagram",
      "svg": "<svg viewBox='0 0 500 220' xmlns='http://www.w3.org/2000/svg' class='w-full h-auto max-h-60 rounded-2xl bg-slate-900 border border-slate-700/60 p-2'><text x='250' y='110' fill='#ffffff' text-anchor='middle'>Educational Model</text></svg>",
      "type": "diagram"
    }
  ],
  "graphs": [
    {
      "title": "Graph Title",
      "type": "line",
      "xLabel": "X Axis Label",
      "yLabel": "Y Axis Label",
      "series": [
        {"name": "Series Name", "points": [{"x": 0, "y": 0}, {"x": 1, "y": 2}, {"x": 2, "y": 4}]}
      ],
      "caption": "Short explanation of the curve or chart"
    }
  ],
  "summary": [
    "Key takeaway point 1",
    "Key takeaway point 2",
    "Key takeaway point 3",
    "Key takeaway point 4"
  ],
  "realLifeConnection": {
    "title": "Everyday Life Practical Applications",
    "summary": "Core overview of how this concept affects daily human life",
    "dailyScenarios": [
      {
        "title": "Daily Scenario 1",
        "scenario": "Concrete situation encountered in everyday life (home, transport, health, food)",
        "practicalTakeaway": "Practical tip or action based on this science"
      },
      {
        "title": "Daily Scenario 2",
        "scenario": "Another practical situation",
        "practicalTakeaway": "Practical takeaway"
      }
    ],
    "ethiopianContext": "Specific real-world connection to Ethiopian industries, agriculture, or national infrastructure"
  },
  "programmingAndAiConnection": {
    "title": "Connection to Programming, Algorithms & Artificial Intelligence",
    "algorithmicThinking": "How computer scientists formulate this principle as an algorithm or mathematical model",
    "codeSnippet": {
      "language": "python",
      "code": "# Runnable Python code demonstrating the principle\ndef calculate_metric():\n    pass",
      "explanation": "Clear explanation of how the code models the topic"
    },
    "aiApplications": [
      {
        "area": "Specific AI/Machine Learning Application",
        "description": "How modern AI models, neural networks, or computer vision utilize this principle"
      }
    ],
    "futureSkillsTip": "Guidance on how learning this equips students for high-tech computing and AI careers"
  },
  "reviewQuestions": [
    {
      "id": 1,
      "question": "Question text?",
      "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
      "correctIndex": 0,
      "explanation": "Detailed rationale",
      "stepByStepSolution": [
        "Step 1: Identify given quantities and textbook concept",
        "Step 2: Apply the governing formula or logic",
        "Step 3: Conclude why the correct option is the exact answer"
      ]
    }
  ]
}

COUNT CONSTRAINTS:
- "explanation": Provide 4 to 6 clear, deep sections.
- "keyTerms": Provide 4 to 8 essential terms.
- "workedExamples": Provide 2 to 3 worked examples with realistic numerical/conceptual values and step-by-step procedures.
- "activity": Provide 1 safe classroom or laboratory activity WITH step-by-step solution/findings ("answer" and "stepByStepSolution").
- "illustrations": Provide 1 visual SVG diagram for the concept.
- "graphs": Provide 0 to 2 graphs.
- "summary": Provide 4 to 6 bullet points.
- "realLifeConnection": Provide detailed everyday real-life scenarios with Ethiopian context.
- "programmingAndAiConnection": Provide clear algorithmic thinking, a Python code snippet, and 2 modern AI applications.
- "reviewQuestions": Provide exactly 5 review questions, each with 4 options, correctIndex, explanation, AND "stepByStepSolution" array.`;

    let lesson: any = null;
    let modelUsed = 'gemini-3.8-flash';

    try {
      const result = await callResilientGemini(prompt, {
        responseMimeType: 'application/json',
        temperature: 0.4,
      });
      modelUsed = result.modelUsed;

      // Parse JSON safely (strip code fences, fall back to the first {...} block)
      let parsed: any = null;
      let raw = (result.text || '').trim();
      raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
      try {
        parsed = JSON.parse(raw);
      } catch {
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error('Failed to parse valid JSON from AI response');
        }
      }

      lesson = {
        explanation: Array.isArray(parsed.explanation) && parsed.explanation.length > 0 ? parsed.explanation : [],
        keyTerms: Array.isArray(parsed.keyTerms) ? parsed.keyTerms : [],
        workedExamples: Array.isArray(parsed.workedExamples) ? parsed.workedExamples : [],
        activity: parsed.activity && typeof parsed.activity === 'object'
          ? {
              title: String(parsed.activity.title || ''),
              type: String(parsed.activity.type || 'lab_experiment'),
              materials: Array.isArray(parsed.activity.materials) ? parsed.activity.materials : [],
              steps: Array.isArray(parsed.activity.steps) ? parsed.activity.steps : [],
              observe: String(parsed.activity.observe || ''),
              answer: String(parsed.activity.answer || ''),
              stepByStepSolution: Array.isArray(parsed.activity.stepByStepSolution) ? parsed.activity.stepByStepSolution : [],
            }
          : { title: '', materials: [], steps: [], observe: '', answer: '', stepByStepSolution: [] },
        illustrations: Array.isArray(parsed.illustrations) && parsed.illustrations.length > 0 ? parsed.illustrations : [],
        graphs: Array.isArray(parsed.graphs) ? parsed.graphs : [],
        summary: Array.isArray(parsed.summary) ? parsed.summary : [],
        realLifeConnection: parsed.realLifeConnection && typeof parsed.realLifeConnection === 'object'
          ? {
              title: String(parsed.realLifeConnection.title || ''),
              summary: String(parsed.realLifeConnection.summary || ''),
              dailyScenarios: Array.isArray(parsed.realLifeConnection.dailyScenarios)
                ? parsed.realLifeConnection.dailyScenarios
                : [],
              ethiopianContext: String(parsed.realLifeConnection.ethiopianContext || ''),
            }
          : undefined,
        programmingAndAiConnection: parsed.programmingAndAiConnection && typeof parsed.programmingAndAiConnection === 'object'
          ? {
              title: String(parsed.programmingAndAiConnection.title || ''),
              algorithmicThinking: String(parsed.programmingAndAiConnection.algorithmicThinking || ''),
              codeSnippet: parsed.programmingAndAiConnection.codeSnippet
                ? {
                    language: String(parsed.programmingAndAiConnection.codeSnippet.language || 'python'),
                    code: String(parsed.programmingAndAiConnection.codeSnippet.code || ''),
                    explanation: String(parsed.programmingAndAiConnection.codeSnippet.explanation || ''),
                  }
                : undefined,
              aiApplications: Array.isArray(parsed.programmingAndAiConnection.aiApplications)
                ? parsed.programmingAndAiConnection.aiApplications
                : [],
              futureSkillsTip: String(parsed.programmingAndAiConnection.futureSkillsTip || ''),
            }
          : undefined,
        reviewQuestions: Array.isArray(parsed.reviewQuestions)
          ? parsed.reviewQuestions.map((q: any, qIdx: number) => ({
              id: q.id ?? (qIdx + 1),
              question: String(q.question || ''),
              options: Array.isArray(q.options) ? q.options : [],
              correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
              explanation: String(q.explanation || ''),
              stepByStepSolution: Array.isArray(q.stepByStepSolution) ? q.stepByStepSolution : [],
            }))
          : [],
      };

      if (!lesson.explanation.length) {
        throw new Error('Incomplete explanation parsed from Gemini model');
      }
    } catch (genAiError: any) {
      console.warn('Gemini API exhausted or rate-limited; generating MoE curriculum grounded lesson:', genAiError?.message || genAiError);
      modelUsed = 'moe-curriculum-engine';
      lesson = generateCurriculumLessonFallback({
        subjectCode,
        subjectName,
        grade,
        unitTitle,
        topicId,
        topicTitle,
        objectives,
        topicContext: serverTopic.summary || '',
        pageReference,
        language,
        textbookExcerpt: textbookPagesText,
      });
    }

    // Automated Quality & Completeness Check
    if (
      lesson &&
      (!lesson.illustrations ||
        lesson.illustrations.length === 0 ||
        !lesson.realLifeConnection ||
        !lesson.programmingAndAiConnection)
    ) {
      const fb = generateCurriculumLessonFallback({
        subjectCode,
        subjectName,
        grade,
        unitTitle,
        topicId,
        topicTitle,
        language,
      });
      if (!lesson.illustrations || lesson.illustrations.length === 0) {
        lesson.illustrations = fb.illustrations || [];
      }
      if (!lesson.realLifeConnection) {
        lesson.realLifeConnection = fb.realLifeConnection;
      }
      if (!lesson.programmingAndAiConnection) {
        lesson.programmingAndAiConnection = fb.programmingAndAiConnection;
      }
    }

    LESSON_MEMORY_CACHE.set(cacheKey, {
      lesson,
      grounded,
      sources,
      modelUsed,
    });

    // Save to persistent shared AI cache across all students
    sharedAiCache.setLesson(
      {
        subjectCode,
        subjectName,
        grade,
        topicId,
        topicTitle,
        language,
      },
      lesson,
      grounded,
      sources,
      modelUsed
    );

    res.json({
      success: true,
      lesson,
      grounded,
      sources,
      cached: false,
      modelUsed,
    });
  } catch (err: any) {
    console.error('Unhandled error in /api/ai/lesson:', err);
    res.status(err?.statusCode === 429 ? 429 : 500).json({
      success: false,
      error: err?.message || 'Failed to generate lesson from topic',
    });
  }
});

const FREE_HOMEWORK_LIMIT_PER_CHAPTER = 5;
const HOMEWORK_USAGE_FILE = path.resolve(process.cwd(), '.data/homework_usage.json');

function getHomeworkUsageDocId(uid: string, grade: string, subject: string, chapter: string): string {
  const normalized = `${uid}::${grade.trim()}::${subject.trim().toLowerCase()}::${chapter.trim().toLowerCase()}`;
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 40);
}

async function getHomeworkChapterUsage(docId: string): Promise<number> {
  try {
    const snap = await adminDb.collection('homework_usage').doc(docId).get();
    if (snap.exists) {
      return Number(snap.data()?.count || 0);
    }
  } catch {
    // Fallback to local .data file when adminDb is unavailable
  }
  try {
    if (fs.existsSync(HOMEWORK_USAGE_FILE)) {
      const store = JSON.parse(fs.readFileSync(HOMEWORK_USAGE_FILE, 'utf-8'));
      return Number(store[docId]?.count || 0);
    }
  } catch {
    // ignore read error
  }
  return 0;
}

async function incrementHomeworkChapterUsage(docId: string, delta: number, meta: Record<string, any>): Promise<number> {
  if (delta <= 0) return await getHomeworkChapterUsage(docId);
  let nextCount = delta;
  try {
    const ref = adminDb.collection('homework_usage').doc(docId);
    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const current = Number(snap.data()?.count || 0);
      nextCount = current + delta;
      tx.set(ref, { ...meta, count: nextCount, updatedAt: new Date().toISOString() }, { merge: true });
    });
    return nextCount;
  } catch {
    // Fallback to local .data file when adminDb is unavailable
  }
  try {
    const dir = path.dirname(HOMEWORK_USAGE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const store = fs.existsSync(HOMEWORK_USAGE_FILE)
      ? JSON.parse(fs.readFileSync(HOMEWORK_USAGE_FILE, 'utf-8'))
      : {};
    const current = Number(store[docId]?.count || 0);
    nextCount = current + delta;
    store[docId] = { ...meta, count: nextCount, updatedAt: new Date().toISOString() };
    fs.writeFileSync(HOMEWORK_USAGE_FILE, JSON.stringify(store, null, 2));
  } catch {
    // ignore write error
  }
  return nextCount;
}

// University Entrance Examination (EUEE) & Diagnostic Exam Generator
app.post('/api/ai/exam-gen', async (req: Request, res: Response) => {
  try {
    const {
      grade = '12',
      subject = 'Mathematics',
      count = 5,
      chapter = 'All Units',
      difficulty = 'standard',
      language = 'am',
      purpose = 'exam',
      staticCountInChapter = 0,
    } = req.body;

    const isHomeworkRequest = String(purpose) === 'homework';
    const isPremiumMember = isPremiumLearningActive(req.user);
    const uid = req.user?.uid || 'anonymous';
    const hwDocId = getHomeworkUsageDocId(uid, String(grade), String(subject), String(chapter));

    let requestedCount = Math.max(1, Math.min(Number(count) || 2, 20));
    let usedInChapter = 0;

    if (isHomeworkRequest && !isPremiumMember) {
      const serverAiUsed = await getHomeworkChapterUsage(hwDocId);
      const safeStaticCount = Math.max(0, Math.min(Number(staticCountInChapter) || 0, FREE_HOMEWORK_LIMIT_PER_CHAPTER));
      usedInChapter = serverAiUsed + safeStaticCount;
      const remaining = FREE_HOMEWORK_LIMIT_PER_CHAPTER - usedInChapter;

      if (remaining <= 0) {
        return res.status(402).json({
          success: false,
          code: 'HOMEWORK_CHAPTER_LIMIT_REACHED',
          limit: FREE_HOMEWORK_LIMIT_PER_CHAPTER,
          used: usedInChapter,
          error: 'ነፃ የቤት ስራ በአንድ ቻፕተር ውስጥ 5 ጥያቄ ብቻ ነው። ከአምስት በተጨማሪ መጠቀም ከፈለጉ የPremium አባል መሆን አለብዎት (57 ETB/ወር)።',
        });
      }
      requestedCount = Math.min(requestedCount, remaining);
    }

    // Check persistent shared AI cache first
    const cachedExam = sharedAiCache.getExamGen({
      grade: String(grade),
      subject: String(subject),
      chapter: String(chapter),
      count: requestedCount,
      difficulty: String(difficulty),
      language: String(language),
    });

    if (cachedExam) {
      const cachedQuestions = Array.isArray(cachedExam.questions)
        ? cachedExam.questions.slice(0, requestedCount)
        : [];
      if (isHomeworkRequest && !isPremiumMember && cachedQuestions.length > 0) {
        await incrementHomeworkChapterUsage(hwDocId, cachedQuestions.length, {
          uid,
          grade: String(grade),
          subject: String(subject),
          chapter: String(chapter),
        });
      }
      return res.json({
        success: true,
        questions: cachedQuestions,
        modelUsed: cachedExam.modelUsed || 'shared-community-cache',
        cached: true,
        source: 'SHARED_COMMUNITY_CACHE',
        hitCount: cachedExam.hitCount,
      });
    }

    const prompt = `Generate ${requestedCount} high-quality Ethiopian High School Multiple-Choice Exam questions for Grade ${grade}, Subject: ${subject}, Unit/Focus: ${chapter}.
Format: Strict JSON array.
Difficulty: ${difficulty} (aligned with Ethiopian National Educational Assessment & Examinations Agency (EAES) / MoE Entrance Standards).
Target language: ${language}.

Output MUST be a valid JSON array of objects with keys:
- id (number)
- question (string)
- options (array of 4 strings: ["A. ...", "B. ...", "C. ...", "D. ..."])
- correctIndex (0, 1, 2, or 3)
- explanation (detailed step-by-step explanation grounded in the Ethiopian textbook)
- competenceTopic (string)`;

    const result = await callResilientGemini(prompt, {
      responseMimeType: 'application/json',
      temperature: 0.5,
    });

    let questions: any[] = [];
    try {
      questions = JSON.parse(result.text);
    } catch {
      // fallback parse
      const match = result.text.match(/\[[\s\S]*\]/);
      if (match) {
        questions = JSON.parse(match[0]);
      }
    }

    if (Array.isArray(questions) && questions.length > requestedCount) {
      questions = questions.slice(0, requestedCount);
    }

    // Save to shared AI knowledge cache
    sharedAiCache.setExamGen(
      {
        grade: String(grade),
        subject: String(subject),
        chapter: String(chapter),
        count: requestedCount,
        difficulty: String(difficulty),
        language: String(language),
      },
      questions,
      result.modelUsed
    );

    if (isHomeworkRequest && !isPremiumMember && Array.isArray(questions) && questions.length > 0) {
      await incrementHomeworkChapterUsage(hwDocId, questions.length, {
        uid,
        grade: String(grade),
        subject: String(subject),
        chapter: String(chapter),
      });
    }

    res.json({
      success: true,
      questions,
      modelUsed: result.modelUsed,
      cached: false,
    });
  } catch (err: any) {
    console.error('Error in /api/ai/exam-gen:', err);
    res.status(err?.statusCode === 429 ? 429 : 500).json({
      success: false,
      error: err?.message || 'Failed to generate exam questions',
    });
  }
});

// Automated Homework / Assignment Grading with Structured MoE Rubric
app.post('/api/ai/grade-assignment', async (req: Request, res: Response) => {
  try {
    const { assignmentTitle, rubric, studentSubmission, grade, subject, language = 'am' } = req.body;

    // Check shared AI cache for identical submission evaluations
    const cachedGrade = sharedAiCache.getGradeAssignment({
      grade: String(grade),
      subject: String(subject),
      assignmentTitle: String(assignmentTitle || ''),
      studentSubmission: String(studentSubmission || ''),
      language: String(language),
    });

    if (cachedGrade) {
      return res.json({
        success: true,
        evaluation: cachedGrade.evaluation,
        modelUsed: cachedGrade.modelUsed || 'shared-community-cache',
        cached: true,
        source: 'SHARED_COMMUNITY_CACHE',
        hitCount: cachedGrade.hitCount,
      });
    }

    const prompt = `You are a Senior Ethiopian High School Department Examiner for Grade ${grade}, Subject: ${subject}.
Evaluate the following student submission for the assignment: "${assignmentTitle}".
Structured Evaluation Rubric:
1. Comprehension (25%): Deep understanding of core concepts, identifying what is given and what is required.
2. Methodology (35%): Proper formula derivation, step-by-step logic, correct units/SI conventions, algebraic rigor.
3. Factual Accuracy (25%): Mathematical correctness, scientific precision, correct final solution.
4. Presentation (15%): Logical structuring, clarity, neat notations, Ethiopian context awareness.

Student Submission:
"""
${studentSubmission}
"""

Language: ${language}.
Provide evaluation in JSON format with fields:
- scoreOutOf100: number (0-100)
- gradeLetter: string ("A+", "A", "B", "C", "D", "F")
- rubricBreakdown: object with:
    - comprehension: { score: number (0-25), maxScore: 25, notes: string }
    - methodology: { score: number (0-35), maxScore: 35, notes: string }
    - factualAccuracy: { score: number (0-25), maxScore: 25, notes: string }
    - presentation: { score: number (0-15), maxScore: 15, notes: string }
- strengths: array of strings (what the student did well)
- areasForImprovement: array of strings (concepts to review)
- detailedFeedback: string (encouraging and constructive feedback in ${language})
- suggestedReviewUnit: string (unit from Ethiopian MoE syllabus to re-read)
- textbookCitation: string (e.g. "[Grade ${grade} ${subject}, MoE New Curriculum 2019 E.C., Unit Review]")`;

    const result = await callResilientGemini(prompt, {
      responseMimeType: 'application/json',
      temperature: 0.3,
    });

    let evaluation: any = {};
    try {
      evaluation = JSON.parse(result.text);
    } catch {
      const match = result.text.match(/\{[\s\S]*\}/);
      if (match) evaluation = JSON.parse(match[0]);
    }

    // Ensure fallback rubric breakdown if model omitted fields
    if (!evaluation.rubricBreakdown) {
      const total = evaluation.scoreOutOf100 || 85;
      evaluation.rubricBreakdown = {
        comprehension: { score: Math.round(total * 0.25), maxScore: 25, notes: 'ፅንሰ-ሃሳቡን በሚገባ መረዳት' },
        methodology: { score: Math.round(total * 0.35), maxScore: 35, notes: 'ቀመር እና የደረጃ በደረጃ ስሌት' },
        factualAccuracy: { score: Math.round(total * 0.25), maxScore: 25, notes: 'የሳይንሳዊ መረጃዎች እና መልሶች ትክክለኛነት' },
        presentation: { score: Math.round(total * 0.15), maxScore: 15, notes: 'የአቀራረብ ጥራትና ግልጽነት' },
      };
    }

    // Save to shared AI cache
    sharedAiCache.setGradeAssignment(
      {
        grade: String(grade),
        subject: String(subject),
        assignmentTitle: String(assignmentTitle || ''),
        studentSubmission: String(studentSubmission || ''),
        language: String(language),
      },
      evaluation,
      result.modelUsed
    );

    res.json({
      success: true,
      evaluation,
      modelUsed: result.modelUsed,
      cached: false,
    });
  } catch (err: any) {
    console.error('Error in /api/ai/grade-assignment:', err);
    res.status(err?.statusCode === 429 ? 429 : 500).json({
      success: false,
      error: err?.message || 'Failed to grade assignment',
    });
  }
});

// Semantic Knowledge Search
app.post('/api/ai/search', async (req: Request, res: Response) => {
  try {
    const { query, grade, language = 'am' } = req.body;

    // Check shared AI cache for identical curriculum search queries
    const cachedSearch = sharedAiCache.getSearch({
      query: String(query || ''),
      grade: grade ? String(grade) : undefined,
      language: String(language),
    });

    if (cachedSearch) {
      return res.json({
        success: true,
        results: cachedSearch.results,
        modelUsed: cachedSearch.modelUsed || 'shared-community-cache',
        cached: true,
        source: 'SHARED_COMMUNITY_CACHE',
        hitCount: cachedSearch.hitCount,
      });
    }

    const prompt = `Search the Ethiopian Ministry of Education High School Curriculum (Grade ${grade || '9-12'}) for: "${query}".
Return a JSON array of up to 4 most relevant topics/competencies matching the search query.
Each item must have:
- title: string
- subject: string
- grade: string
- unit: string
- summary: brief explanation (2-3 sentences) in ${language}
- textbookPageRef: estimated page or section reference
- examImportance: "High" | "Medium" | "Core Entrance Topic"`;

    const result = await callResilientGemini(prompt, {
      responseMimeType: 'application/json',
      temperature: 0.3,
    });

    let results = [];
    try {
      results = JSON.parse(result.text);
    } catch {
      const match = result.text.match(/\[[\s\S]*\]/);
      if (match) results = JSON.parse(match[0]);
    }

    // Save to shared AI cache
    sharedAiCache.setSearch(
      {
        query: String(query || ''),
        grade: grade ? String(grade) : undefined,
        language: String(language),
      },
      results,
      result.modelUsed
    );

    res.json({
      success: true,
      results,
      modelUsed: result.modelUsed,
      cached: false,
    });
  } catch (err: any) {
    console.error('Error in /api/ai/search:', err);
    res.status(err?.statusCode === 429 ? 429 : 500).json({
      success: false,
      error: err?.message || 'Failed to execute search',
    });
  }
});





// In-memory record for single assignment purchases (persisted alongside Firestore/localStorage)
const SINGLE_ASSIGNMENT_PURCHASES = new Set<string>();

// Verified Student Entitlement Engine for Academic Work Hub & Premium Assets
app.post('/api/premium/verify-student-entitlement', async (req: Request, res: Response) => {
  const SERVER_PRICING = await getPricing();
  const { studentId, resourceType = 'homework', assignmentId, grade = 10 } = req.body;
  const hasActiveSubscription = isPremiumLearningActive(req.user);

  // 1. Homework (5 free questions per chapter; >5 requires Premium) and Free STEM Projects
  if (resourceType === 'homework') {
    const chapterQuestionCount = Number(req.body.chapterQuestionCount || 0);
    if (hasActiveSubscription || chapterQuestionCount < FREE_HOMEWORK_LIMIT_PER_CHAPTER) {
      return res.json({
        success: true,
        entitled: true,
        reason: hasActiveSubscription ? 'ACTIVE_SUBSCRIPTION' : 'FREE_TIER',
        resourceType,
        freeLimitPerChapter: FREE_HOMEWORK_LIMIT_PER_CHAPTER,
        message: hasActiveSubscription
          ? 'Unlimited homework access active via Premium Learning subscription.'
          : `Free tier allows up to ${FREE_HOMEWORK_LIMIT_PER_CHAPTER} homework questions per chapter.`,
      });
    }
    return res.json({
      success: true,
      entitled: false,
      reason: 'HOMEWORK_CHAPTER_LIMIT_REACHED',
      resourceType,
      freeLimitPerChapter: FREE_HOMEWORK_LIMIT_PER_CHAPTER,
      singlePriceETB: SERVER_PRICING.singleAssignment || 57,
      currency: 'ETB',
      accounts: VERIFIED_PAYMENT_ACCOUNTS,
      message: 'ነፃ የቤት ስራ በአንድ ቻፕተር ውስጥ 5 ጥያቄ ብቻ ነው። ከአምስት በተጨማሪ መጠቀም ከፈለጉ የPremium አባል መሆን አለብዎት (57 ETB/ወር)።',
    });
  }

  if (resourceType === 'stem_project' || resourceType === 'free') {
    return res.json({
      success: true,
      entitled: true,
      reason: 'FREE_TIER',
      resourceType,
      message: 'Practical STEM Projects are free and open to all registered students.',
    });
  }

  // 2. Premium Assignment Check (Single Pack 54 ETB or Full Monthly Subscription)
  if (resourceType === 'premium_assignment') {
    const singlePurchaseKey = `${studentId || req.user?.email || req.user?.uid}_${assignmentId}`;
    const hasSinglePurchase = SINGLE_ASSIGNMENT_PURCHASES.has(singlePurchaseKey);

    if (hasActiveSubscription || hasSinglePurchase) {
      return res.json({
        success: true,
        entitled: true,
        reason: hasActiveSubscription ? 'ACTIVE_SUBSCRIPTION' : 'SINGLE_PAYMENT_ACTIVE',
        resourceType,
        assignmentId,
        message: hasActiveSubscription
          ? 'Access granted via full active monthly grade subscription.'
          : 'Access granted via 57 ETB premium access pack purchase.',
      });
    }

    let gradeMonthly = SERVER_PRICING.grade10;
    if (grade === 9) gradeMonthly = SERVER_PRICING.grade9;
    if (grade === 11) gradeMonthly = SERVER_PRICING.grade11;
    if (grade === 12) gradeMonthly = SERVER_PRICING.grade12;

    return res.json({
      success: true,
      entitled: false,
      reason: 'PAYMENT_REQUIRED',
      resourceType,
      assignmentId,
      singlePriceETB: SERVER_PRICING.singleAssignment || 57,
      monthlyPriceETB: gradeMonthly,
      currency: 'ETB',
      accounts: VERIFIED_PAYMENT_ACCOUNTS,
      message: 'ይህ ልዩ ማዕከል/አሳይመንት በወር የ57 ብር ክፍያ ወይም ወርሃዊ ሰብስክሪብሽን ይፈልጋል። (Requires 57 ETB/month or monthly access).',
    });
  }

  res.json({
    success: true,
    entitled: hasActiveSubscription,
    reason: hasActiveSubscription ? 'ACTIVE_SUBSCRIPTION' : 'DEFAULT_ACCESS',
  });
});

// Single Assignment / Premium Hub Pack Unlock (57 ETB)
app.post('/api/premium/purchase-single-assignment', (req: Request, res: Response) => {
  const { assignmentId, transactionRef, gateway = 'telebirr' } = req.body;
  const studentId = req.user?.uid;

  res.json({
    success: true,
    entitled: false,
    status: 'PENDING',
    assignmentId,
    amount: 57,
    currency: 'ETB',
    receiptNo: `ETH-ASSIGN-${Math.floor(100000 + Math.random() * 900000)}`,
    message: 'Payment request received. Access is unlocked after an admin verifies your payment.',
  });
});

// Open https://<your-app>/api/health in a browser to see whether the server can reach Firestore.
// Only a coarse status is exposed (never error details). Cached for 30s so it cannot be used to hammer Firestore.
let healthCache: { at: number; firestore: string; reason?: string } | null = null;
app.get('/api/health', async (_req: Request, res: Response) => {
  if (!healthCache || Date.now() - healthCache.at > 30_000) {
    let firestore = 'ok';
    let reason: string | undefined;
    try {
      await Promise.race([
        adminDb.collection('app_config').doc('payment').get(),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000)),
      ]);
    } catch (e: any) {
      firestore = 'error';
      const m = String(e?.message || '');
      reason = /default credentials/i.test(m)
        ? 'no_credentials'
        : e?.code === 7 || /PERMISSION_DENIED|insufficient permission/i.test(m)
        ? 'permission_denied'
        : /timeout/i.test(m)
        ? 'timeout'
        : 'other';
    }
    healthCache = { at: Date.now(), firestore, reason };
  }
  res.json({
    status: healthCache.firestore === 'ok' ? 'ok' : 'degraded',
    firestore: healthCache.firestore,
    firestoreReason: healthCache.reason,
    aiConfigured: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Vite middleware or static serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NUR AI School Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
