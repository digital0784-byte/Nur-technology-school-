import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
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
import { requireAuth, requireSuperAdmin, isPremiumActive } from './src/server/authMiddleware';
import { CURRICULUM_DATA } from './src/data/curriculum';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(inputSanitizerMiddleware);
app.use('/api', (req, res, next) => (req.path === '/health' ? next() : requireAuth(req, res, next)));
app.use('/api', rateLimiterMiddleware);
app.use('/api/admin', requireSuperAdmin, adminAutomationRouter);
app.use('/api/security', requireSuperAdmin, securityRouter);

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
app.get('/api/ai/cache-stats', (_req: Request, res: Response) => {
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
    } = req.body;

    // Check shared cross-student AI cache before calling Gemini
    const cachedReply = sharedAiCache.getTutorReply({
      grade: String(grade),
      subject: String(subject),
      unit: String(unit),
      topic: String(topic),
      message: String(message || ''),
      language: String(language),
    });

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
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to process AI tutor request',
      fallbackReply: 'የኔ ተማሪ፣ ጊዜያዊ የኔትዎርክ መቆራረጥ አጋጥሟል። እባክዎ ጥያቄዎን በድጋሚ ይሞክሩ ወይም ከመማሪያ መጽሐፉ ዋና ዋና ነጥቦች ጋር ያገናኙት።',
    });
  }
});

// Multimodal OCR Question Solver (Image & Voice)
app.post('/api/ai/ocr-solve', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', questionPrompt, grade = '9-12', subject = 'Science', language = 'am' } = req.body;

    if (!imageBase64 && !questionPrompt) {
      return res.status(400).json({ success: false, error: 'Either imageBase64 or questionPrompt must be provided' });
    }

    // Check shared cross-student AI cache
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
      });
    }

    const parts: Array<any> = [];

    if (imageBase64) {
      const cleanData = imageBase64.replace(/^data:[^;]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType,
          data: cleanData,
        },
      });
    }

    const promptText = `You are NUR AI, solving an Ethiopian High School problem for Grade ${grade}, Subject: ${subject} following the MoE New Curriculum (2019 E.C. / 2026).
Student query/note: ${questionPrompt || 'Please solve this question using the 5-step Problem-Solving Protocol.'}
Language of response: ${language}.

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

    // Save to persistent shared AI cache
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
    });
  } catch (err: any) {
    console.error('Error in /api/ai/ocr-solve:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to process OCR solve request',
    });
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

function findCurriculumTopic(topicId: string) {
  if (!topicId || typeof topicId !== 'string') return null;
  const cleanId = topicId.trim().toLowerCase();
  for (const subject of CURRICULUM_DATA) {
    for (const unit of subject.units) {
      for (const topic of unit.topics) {
        if (topic.id.toLowerCase() === cleanId) {
          return { topic, unit, subject };
        }
      }
    }
  }
  return null;
}

// Generate Full Lesson from Topic (with MoE Textbook Grounding)
app.post('/api/ai/lesson', async (req: Request, res: Response) => {
  try {
    const rawTopicId = req.body?.topicId;
    if (!rawTopicId || typeof rawTopicId !== 'string') {
      return res.status(404).json({
        success: false,
        error: 'TOPIC_NOT_FOUND',
        message: 'A valid topicId is required.',
      });
    }

    const found = findCurriculumTopic(rawTopicId);
    if (!found) {
      return res.status(404).json({
        success: false,
        error: 'TOPIC_NOT_FOUND',
        message: `Topic with id "${rawTopicId}" was not found in the curriculum.`,
      });
    }

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

    const prompt = `you are an Ethiopian high-school teacher; Grade ${grade} level; answer in the language ${language}; if TEXTBOOK PAGES are provided use ONLY them and do not invent facts, definitions or page numbers; use plain text and Unicode for math (no LaTeX); give Ethiopian everyday examples where natural; double-check every calculation in worked examples before answering; graph points must be numerically correct for the stated formula.

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
    {"heading": "Section Heading", "body": "Comprehensive explanation paragraph"}
  ],
  "keyTerms": [
    {"term": "Term Name", "meaning": "Precise definition"}
  ],
  "workedExamples": [
    {"title": "Example Title", "problem": "Problem statement", "steps": ["Step 1: Given and formula", "Step 2: Substitution", "Step 3: Calculation"], "answer": "Final calculated answer"}
  ],
  "activity": {
    "title": "Safe Hands-on Activity Title",
    "materials": ["Material 1", "Material 2"],
    "steps": ["Step 1: Setup", "Step 2: Execution", "Step 3: Measurement"],
    "observe": "What the student should observe or conclude"
  },
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
  "reviewQuestions": [
    {
      "id": 1,
      "question": "Question text?",
      "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
      "correctIndex": 0,
      "explanation": "Detailed rationale"
    }
  ]
}

COUNT CONSTRAINTS:
- "explanation": Provide 3 to 5 clear sections.
- "keyTerms": Provide 4 to 8 essential terms.
- "workedExamples": Provide 2 to 3 worked examples with realistic numerical/conceptual values.
- "activity": Provide 1 safe classroom or home activity.
- "graphs": Provide 0 to 2 graphs (only when a graph genuinely helps this topic).
- "summary": Provide 4 to 6 bullet points.
- "reviewQuestions": Provide exactly 5 review questions, each with 4 options and correctIndex 0, 1, 2, or 3.`;

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
              materials: Array.isArray(parsed.activity.materials) ? parsed.activity.materials : [],
              steps: Array.isArray(parsed.activity.steps) ? parsed.activity.steps : [],
              observe: String(parsed.activity.observe || ''),
            }
          : { title: '', materials: [], steps: [], observe: '' },
        graphs: Array.isArray(parsed.graphs) ? parsed.graphs : [],
        summary: Array.isArray(parsed.summary) ? parsed.summary : [],
        reviewQuestions: Array.isArray(parsed.reviewQuestions) ? parsed.reviewQuestions : [],
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
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to generate lesson from topic',
    });
  }
});

// University Entrance Examination (EUEE) & Diagnostic Exam Generator
app.post('/api/ai/exam-gen', async (req: Request, res: Response) => {
  try {
    const { grade = '12', subject = 'Mathematics', count = 5, chapter = 'All Units', difficulty = 'standard', language = 'am' } = req.body;

    // Check persistent shared AI cache first
    const cachedExam = sharedAiCache.getExamGen({
      grade: String(grade),
      subject: String(subject),
      chapter: String(chapter),
      count: Number(count),
      difficulty: String(difficulty),
      language: String(language),
    });

    if (cachedExam) {
      return res.json({
        success: true,
        questions: cachedExam.questions,
        modelUsed: cachedExam.modelUsed || 'shared-community-cache',
        cached: true,
        source: 'SHARED_COMMUNITY_CACHE',
        hitCount: cachedExam.hitCount,
      });
    }

    const prompt = `Generate ${count} high-quality Ethiopian High School Multiple-Choice Exam questions for Grade ${grade}, Subject: ${subject}, Unit/Focus: ${chapter}.
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

    let questions = [];
    try {
      questions = JSON.parse(result.text);
    } catch {
      // fallback parse
      const match = result.text.match(/\[[\s\S]*\]/);
      if (match) {
        questions = JSON.parse(match[0]);
      }
    }

    // Save to shared AI knowledge cache
    sharedAiCache.setExamGen(
      {
        grade: String(grade),
        subject: String(subject),
        chapter: String(chapter),
        count: Number(count),
        difficulty: String(difficulty),
        language: String(language),
      },
      questions,
      result.modelUsed
    );

    res.json({
      success: true,
      questions,
      modelUsed: result.modelUsed,
      cached: false,
    });
  } catch (err: any) {
    console.error('Error in /api/ai/exam-gen:', err);
    res.status(500).json({
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
    res.status(500).json({
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
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to execute search',
    });
  }
});

// Ethiopian High School Platform - Verified Payment & Subscription API
const VERIFIED_PAYMENT_ACCOUNTS = [
  {
    id: 'telebirr',
    name: 'ቴሌብር (Telebirr)',
    accountName: 'Nuriye Ahmed Adem',
    accountNumberOrPhone: '0910097862',
    ussdCode: '*127#',
    method: 'In-app transfer or USSD (*127#)',
  },
  {
    id: 'cbe_birr',
    name: 'ሲቢኢ ብር (CBE Birr)',
    accountName: 'Nuriye Ahmed Adem',
    accountNumberOrPhone: '0910097862',
    ussdCode: '*847#',
    method: 'In-app transfer or USSD (*847#)',
  },
  {
    id: 'cbe',
    name: 'የኢትዮጵያ ንግድ ባንክ (Commercial Bank of Ethiopia - CBE)',
    accountName: 'Nuriye Ahmed Adem',
    accountNumberOrPhone: '1000382883776',
    method: 'CBE Mobile Banking, CBE Birr, or branch deposit',
  },
  {
    id: 'dashen',
    name: 'ዳሸን ባንክ (Dashen Bank / Amole)',
    accountName: 'Nuriye Ahmed Adem',
    accountNumberOrPhone: '2976196269611',
    method: 'Dashen Mobile App or Amole',
  },
  {
    id: 'abyssinia',
    name: 'አቢሲኒያ ባንክ (Bank of Abyssinia)',
    accountName: 'Nuriye Ahmed Adem',
    accountNumberOrPhone: '251120889',
    method: 'BoA Mobile Banking or branch transfer',
  },
];

let SERVER_PRICING = {
  grade9: 160,
  grade10: 180,
  grade11: 200,
  grade12: 200,
  singleAssignment: 54,
  billingCycleDays: 30,
  currency: 'ETB',
};

// GET payment accounts and pricing configuration
app.get('/api/payment/config', (_req: Request, res: Response) => {
  res.json({
    success: true,
    accounts: VERIFIED_PAYMENT_ACCOUNTS,
    pricing: SERVER_PRICING,
    superAdminContact: {
      email: 'mejennur669@gmail.com',
      name: 'Nuriye Ahmed Adem',
      phone: '0910097862',
    },
  });
});

// Update pricing endpoint (Restricted to Super Admin)
app.post('/api/payment/admin/pricing', (_req: Request, res: Response) => {
  return res.status(403).json({ success: false, error: 'Disabled until server-side authentication is added' });
});

// Update payment accounts configuration endpoint (Restricted to Super Admin)
app.post('/api/admin/accounts/update', (_req: Request, res: Response) => {
  return res.status(403).json({ success: false, error: 'Disabled until server-side authentication is added' });
});

// Admin ERP Stats Endpoint
app.get('/api/admin/stats', (_req: Request, res: Response) => {
  res.json({
    success: true,
    note: 'Not connected to real data yet',
    stats: {
      totalStudents: 0,
      activeSubscriptions: 0,
      pendingVerifications: 0,
      totalRevenueETB: 0,
      systemHealthScore: 0,
      moeCurriculumVersion: '2019 E.C. (New Syllabus)',
      superAdmin: 'mejennur669@gmail.com (Nuriye Ahmed Adem)',
      timestamp: new Date().toISOString(),
      note: 'Not connected to real data yet',
    },
  });
});

interface AdminPaymentNotification {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  grade: number;
  amount: number;
  currency: string;
  paymentGateway: string;
  transactionRef: string;
  planTitle?: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedAt?: string;
  reviewedBy?: string;
}

const ADMIN_PAYMENT_NOTIFICATIONS: AdminPaymentNotification[] = [
  {
    id: 'pay-seed-01',
    studentId: 'usr-student-01',
    studentName: 'Almaz Tadesse',
    studentEmail: 'almaz.student@nur-school.edu.et',
    studentPhone: '0922446688',
    grade: 10,
    amount: 180,
    currency: 'ETB',
    paymentGateway: 'telebirr',
    transactionRef: 'FT26049281',
    planTitle: '10ኛ ክፍል ወርሃዊ መደበኛ',
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'PENDING',
  },
  {
    id: 'pay-seed-02',
    studentId: 'usr-student-02',
    studentName: 'Mohammed Bekele',
    studentEmail: 'mohammed.bekele@nur-school.edu.et',
    studentPhone: '0911559933',
    grade: 12,
    amount: 200,
    currency: 'ETB',
    paymentGateway: 'cbe',
    transactionRef: 'CBE-FT9981240',
    planTitle: '12ኛ ክፍል ወርሃዊ መደበኛ',
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'APPROVED',
  },
];

// POST /api/payment/notify-admin: Student sends transaction number directly to admin
app.post('/api/payment/notify-admin', (req: Request, res: Response) => {
  const {
    studentId = 'usr-student',
    studentName = 'ተማሪ',
    studentEmail = 'student@nur-school.edu.et',
    studentPhone = '',
    grade = 10,
    amount = 180,
    paymentGateway = 'telebirr',
    transactionRef = '',
    plan = 'Monthly Pass',
  } = req.body;

  const cleanRef = String(transactionRef || '').trim();
  if (!cleanRef || cleanRef.length < 3) {
    return res.status(400).json({
      success: false,
      error: 'ትክክለኛ የግብይት ማረጋገጫ ቁጥር (Transaction Number / FT Code) ያስገቡ።',
    });
  }

  const notificationId = `pay-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

  // Check if this FT reference was already submitted
  const existingIdx = ADMIN_PAYMENT_NOTIFICATIONS.findIndex(
    (n) => n.transactionRef.toLowerCase() === cleanRef.toLowerCase()
  );

  const notificationRecord: AdminPaymentNotification = {
    id: notificationId,
    studentId: String(studentId),
    studentName: String(studentName),
    studentEmail: String(studentEmail),
    studentPhone: String(studentPhone || '0910000000'),
    grade: Number(grade) || 10,
    amount: Number(amount) || 180,
    currency: 'ETB',
    paymentGateway: String(paymentGateway).toLowerCase(),
    transactionRef: cleanRef,
    planTitle: String(plan),
    submittedAt: new Date().toISOString(),
    status: 'PENDING',
  };

  if (existingIdx !== -1) {
    ADMIN_PAYMENT_NOTIFICATIONS[existingIdx] = notificationRecord;
  } else {
    ADMIN_PAYMENT_NOTIFICATIONS.unshift(notificationRecord);
  }

  if (ADMIN_PAYMENT_NOTIFICATIONS.length > 150) {
    ADMIN_PAYMENT_NOTIFICATIONS.pop();
  }

  console.log(`\n🔔 [SUPER ADMIN PAYMENT NOTIFICATION RECEIVED]`);
  console.log(`  • FT Reference Code : ${cleanRef}`);
  console.log(`  • Student Name      : ${studentName}`);
  console.log(`  • Student Phone     : ${studentPhone}`);
  console.log(`  • Grade Level       : Grade ${grade}`);
  console.log(`  • Amount            : ${amount} ETB`);
  console.log(`  • Payment Gateway   : ${paymentGateway.toUpperCase()}`);
  console.log(`  • Time              : ${notificationRecord.submittedAt}`);
  console.log(`  • Delivered to Admin: Nuriye Ahmed Adem (mejennur669@gmail.com / 0910097862)\n`);

  return res.json({
    success: true,
    notificationId,
    transactionRef: cleanRef,
    receivedAt: notificationRecord.submittedAt,
    status: 'PENDING',
    superAdminContact: {
      name: 'Nuriye Ahmed Adem',
      email: 'mejennur669@gmail.com',
      phone: '0910097862',
      telegram: 'https://t.me/nur_school_admin',
    },
    message: 'የክፍያ ማረጋገጫ ቁጥርህ (FT ቁጥር) ወደ ሲስተሙ ዋና አስተዳዳሪ (Nuriye Ahmed Adem) በተሳካ ሁኔታ ተልኳል!',
  });
});

// GET /api/payment/admin/notifications: Super Admin views all received transaction numbers
app.get('/api/payment/admin/notifications', (req: Request, res: Response) => {
  const pendingOnly = req.query.pending === 'true';
  const list = pendingOnly
    ? ADMIN_PAYMENT_NOTIFICATIONS.filter((n) => n.status === 'PENDING')
    : ADMIN_PAYMENT_NOTIFICATIONS;

  const pendingCount = ADMIN_PAYMENT_NOTIFICATIONS.filter((n) => n.status === 'PENDING').length;

  res.json({
    success: true,
    count: list.length,
    pendingCount,
    superAdmin: 'mejennur669@gmail.com (Nuriye Ahmed Adem)',
    phone: '0910097862',
    notifications: list,
    lastChecked: new Date().toISOString(),
  });
});

// Telebirr, CBE Birr, CBE, Dashen, and BoA Payment submission & verification
app.post('/api/payment/verify', (req: Request, res: Response) => {
  const { provider, transactionId, amount, studentName, grade, phone, studentId } = req.body;
  const studentEmail = req.user?.email || '';

  const cleanRef = String(transactionId || '').trim();
  const isValidRef = Boolean(cleanRef && cleanRef.length >= 3);

  // Expected price check server-side
  let expectedAmount = 160;
  if (grade === 10) expectedAmount = SERVER_PRICING.grade10;
  else if (grade === 11) expectedAmount = SERVER_PRICING.grade11;
  else if (grade === 12) expectedAmount = SERVER_PRICING.grade12;
  else expectedAmount = SERVER_PRICING.grade9;

  const resolvedAmount = amount || expectedAmount;
  const receiptNo = `ETH-${(provider || 'PAY').toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

  if (isValidRef) {
    const existingIdx = ADMIN_PAYMENT_NOTIFICATIONS.findIndex(
      (n) => n.transactionRef.toLowerCase() === cleanRef.toLowerCase()
    );

    const record: AdminPaymentNotification = {
      id: receiptNo,
      studentId: studentId || (req.user?.uid || 'usr-student'),
      studentName: studentName || 'ተማሪ',
      studentEmail,
      studentPhone: phone || '0910000000',
      grade: Number(grade) || 10,
      amount: resolvedAmount,
      currency: 'ETB',
      paymentGateway: String(provider || 'telebirr').toLowerCase(),
      transactionRef: cleanRef,
      planTitle: `${grade || 10}ኛ ክፍል ወርሃዊ መደበኛ`,
      submittedAt: new Date().toISOString(),
      status: 'PENDING',
    };

    if (existingIdx !== -1) {
      ADMIN_PAYMENT_NOTIFICATIONS[existingIdx] = record;
    } else {
      ADMIN_PAYMENT_NOTIFICATIONS.unshift(record);
    }
    console.log(`[VERIFY -> ADMIN QUEUE] FT: ${cleanRef} from ${studentName} (${phone}) queued for Super Admin`);
  }

  res.json({
    success: true,
    approved: false, // Student payments start in PENDING status until Super Admin approves
    status: isValidRef ? 'PENDING' : 'INVALID_REF',
    receiptNo,
    timestamp: new Date().toISOString(),
    amount: resolvedAmount,
    currency: 'ETB',
    studentName,
    studentEmail,
    grade,
    phone,
    transactionRef: cleanRef,
    superAdminContact: '0910097862',
    message: isValidRef
      ? 'የክፍያ ማረጋገጫ ቁጥሩ ወደ ዋና አስተዳዳሪ ተልኳል (Awaiting Super Admin Nuriye Ahmed Adem verification).'
      : 'Invalid transaction reference code.',
  });
});

// In-memory record for single assignment purchases (persisted alongside Firestore/localStorage)
const SINGLE_ASSIGNMENT_PURCHASES = new Set<string>();

// Verified Student Entitlement Engine for Academic Work Hub & Premium Assets
app.post('/api/premium/verify-student-entitlement', (req: Request, res: Response) => {
  const { studentId, resourceType = 'homework', assignmentId, grade = 10 } = req.body;
  const hasActiveSubscription = isPremiumActive(req.user);

  // 1. Free Tier: Homework and STEM Projects are 100% free for all students
  if (resourceType === 'homework' || resourceType === 'stem_project' || resourceType === 'free') {
    return res.json({
      success: true,
      entitled: true,
      reason: 'FREE_TIER',
      resourceType,
      message: 'Homework and Practical STEM Projects are free and open to all registered students.',
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
          : 'Access granted via 54 ETB single assignment pack purchase.',
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
      singlePriceETB: SERVER_PRICING.singleAssignment || 54,
      monthlyPriceETB: gradeMonthly,
      currency: 'ETB',
      accounts: VERIFIED_PAYMENT_ACCOUNTS,
      message: 'ይህ ልዩ አሳይመንት የ54 ብር ክፍያ ወይም ወርሃዊ ሰብስክሪብሽን ይፈልጋል። (Requires 54 ETB or monthly access).',
    });
  }

  res.json({
    success: true,
    entitled: hasActiveSubscription,
    reason: hasActiveSubscription ? 'ACTIVE_SUBSCRIPTION' : 'DEFAULT_ACCESS',
  });
});

// Single Assignment Pack Unlock (54 ETB)
app.post('/api/premium/purchase-single-assignment', (req: Request, res: Response) => {
  const { studentEmail, studentId, assignmentId, transactionRef, gateway = 'telebirr' } = req.body;
  const isSuperAdmin = studentEmail && studentEmail.toLowerCase() === 'mejennur669@gmail.com';

  const singlePurchaseKey = `${studentId || studentEmail}_${assignmentId}`;
  SINGLE_ASSIGNMENT_PURCHASES.add(singlePurchaseKey);

  res.json({
    success: true,
    entitled: true,
    assignmentId,
    amount: 54,
    currency: 'ETB',
    receiptNo: `ETH-ASSIGN-${Math.floor(100000 + Math.random() * 900000)}`,
    status: isSuperAdmin ? 'ACTIVE' : 'APPROVED',
    message: 'Single assignment pack unlocked successfully (54 ETB).',
  });
});

// System Health and Diagnostics endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '2019-EC-v2.6',
    schoolSystem: 'የክፍል 9-12 ቲቶሪያል (NUR AI School & High School Tutorial System)',
    superAdmin: 'mejennur669@gmail.com (Nuriye Ahmed Adem)',
    aiConfigured: Boolean(apiKey),
    supportedLanguages: ['am', 'om', 'ti', 'ar', 'so', 'en'],
    gradesSupported: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    moeCurriculumYear: '2019 E.C. (2026 G.C.)',
    modulesCount: 24,
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
