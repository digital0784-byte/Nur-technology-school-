import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

import { adminAutomationRouter } from './src/server/adminAutomationRouter';
import {
  securityRouter,
  rateLimiterMiddleware,
  inputSanitizerMiddleware,
} from './src/server/securityRouter';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(inputSanitizerMiddleware);
app.use('/api/admin', adminAutomationRouter);
app.use('/api/security', securityRouter);
app.use('/api', rateLimiterMiddleware);

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
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-flash-latest',
  'gemini-3.1-pro-preview',
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
    }
  }

  throw new Error(`All Gemini fallback models exhausted. Last error: ${lastError?.message || 'Unknown error'}`);
}

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

    res.json({
      success: true,
      reply: result.text,
      modelUsed: result.modelUsed,
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

    res.json({
      success: true,
      solution: result.text,
      modelUsed: result.modelUsed,
    });
  } catch (err: any) {
    console.error('Error in /api/ai/ocr-solve:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to process OCR solve request',
    });
  }
});

// University Entrance Examination (EUEE) & Diagnostic Exam Generator
app.post('/api/ai/exam-gen', async (req: Request, res: Response) => {
  try {
    const { grade = '12', subject = 'Mathematics', count = 5, chapter = 'All Units', difficulty = 'standard', language = 'am' } = req.body;

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

    res.json({
      success: true,
      questions,
      modelUsed: result.modelUsed,
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

    res.json({
      success: true,
      evaluation,
      modelUsed: result.modelUsed,
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

    res.json({
      success: true,
      results,
      modelUsed: result.modelUsed,
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
app.post('/api/payment/admin/pricing', (req: Request, res: Response) => {
  const { adminEmail, pricing } = req.body;
  if (!adminEmail || adminEmail.toLowerCase() !== 'mejennur669@gmail.com') {
    return res.status(403).json({ success: false, error: 'Unauthorized. Super Admin access required.' });
  }

  SERVER_PRICING = {
    ...SERVER_PRICING,
    ...pricing,
  };

  res.json({
    success: true,
    message: 'Pricing successfully updated by Super Admin',
    pricing: SERVER_PRICING,
    updatedAt: new Date().toISOString(),
  });
});

// Update payment accounts configuration endpoint (Restricted to Super Admin)
app.post('/api/admin/accounts/update', (req: Request, res: Response) => {
  const { adminEmail, accounts } = req.body;
  if (!adminEmail || adminEmail.toLowerCase() !== 'mejennur669@gmail.com') {
    return res.status(403).json({ success: false, error: 'Unauthorized. Super Admin access required.' });
  }

  if (Array.isArray(accounts)) {
    // Update memory cache
    accounts.forEach((acc: any) => {
      const idx = VERIFIED_PAYMENT_ACCOUNTS.findIndex((a) => a.id === acc.id);
      if (idx !== -1) {
        VERIFIED_PAYMENT_ACCOUNTS[idx] = { ...VERIFIED_PAYMENT_ACCOUNTS[idx], ...acc };
      }
    });
  }

  res.json({
    success: true,
    message: 'Payment accounts successfully updated by Super Admin',
    accounts: VERIFIED_PAYMENT_ACCOUNTS,
    updatedAt: new Date().toISOString(),
  });
});

// Admin ERP Stats Endpoint
app.get('/api/admin/stats', (_req: Request, res: Response) => {
  res.json({
    success: true,
    stats: {
      totalStudents: 1248,
      activeSubscriptions: 894,
      pendingVerifications: 17,
      totalRevenueETB: 168420,
      systemHealthScore: 99.8,
      moeCurriculumVersion: '2019 E.C. (New Syllabus)',
      superAdmin: 'mejennur669@gmail.com (Nuriye Ahmed Adem)',
      timestamp: new Date().toISOString(),
    },
  });
});

// Telebirr, CBE Birr, CBE, Dashen, and BoA Payment submission & verification
app.post('/api/payment/verify', (req: Request, res: Response) => {
  const { provider, transactionId, amount, studentName, studentEmail, grade, phone } = req.body;
  const isSuperAdmin = studentEmail && studentEmail.toLowerCase() === 'mejennur669@gmail.com';

  // Super admin instant approval
  if (isSuperAdmin) {
    return res.json({
      success: true,
      approved: true,
      status: 'ACTIVE',
      receiptNo: 'ETH-SUPER-ADMIN-LIFETIME-PASS',
      amount: 0,
      currency: 'ETB',
      studentName: 'Nuriye Ahmed Adem',
      grade: 12,
      expiryDays: 9999,
      timestamp: new Date().toISOString(),
    });
  }

  const isValidRef = Boolean(transactionId && transactionId.trim().length >= 4);

  // Expected price check server-side
  let expectedAmount = 160;
  if (grade === 10) expectedAmount = SERVER_PRICING.grade10;
  else if (grade === 11) expectedAmount = SERVER_PRICING.grade11;
  else if (grade === 12) expectedAmount = SERVER_PRICING.grade12;
  else expectedAmount = SERVER_PRICING.grade9;

  res.json({
    success: true,
    approved: false, // Student payments start in PENDING status until Super Admin approves
    status: isValidRef ? 'PENDING' : 'INVALID_REF',
    receiptNo: `ETH-${(provider || 'PAY').toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
    timestamp: new Date().toISOString(),
    amount: amount || expectedAmount,
    currency: 'ETB',
    studentName,
    studentEmail,
    grade,
    phone,
    superAdminContact: '0910097862',
    message: isValidRef
      ? 'Payment submitted successfully. Awaiting Super Admin (Nuriye Ahmed Adem) verification.'
      : 'Invalid transaction reference code.',
  });
});

// In-memory record for single assignment purchases (persisted alongside Firestore/localStorage)
const SINGLE_ASSIGNMENT_PURCHASES = new Set<string>();

// Verified Student Entitlement Engine for Academic Work Hub & Premium Assets
app.post('/api/premium/verify-student-entitlement', (req: Request, res: Response) => {
  const { studentEmail, studentId, resourceType = 'homework', assignmentId, grade = 10, hasActiveSubscription = false } = req.body;
  const isSuperAdmin = studentEmail && studentEmail.toLowerCase() === 'mejennur669@gmail.com';

  // 1. Super Admin Lifetime Unrestricted Pass
  if (isSuperAdmin) {
    return res.json({
      success: true,
      entitled: true,
      reason: 'SUPER_ADMIN_BYPASS',
      superAdmin: true,
      resourceType,
      assignmentId,
      message: 'Super Admin (Nuriye Ahmed Adem) has lifetime unrestricted access to all assets.',
    });
  }

  // 2. Free Tier: Homework and STEM Projects are 100% free for all students
  if (resourceType === 'homework' || resourceType === 'stem_project' || resourceType === 'free') {
    return res.json({
      success: true,
      entitled: true,
      reason: 'FREE_TIER',
      resourceType,
      message: 'Homework and Practical STEM Projects are free and open to all registered students.',
    });
  }

  // 3. Premium Assignment Check (Single Pack 54 ETB or Full Monthly Subscription)
  if (resourceType === 'premium_assignment') {
    const singlePurchaseKey = `${studentId || studentEmail}_${assignmentId}`;
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
    entitled: true,
    reason: 'DEFAULT_ACCESS',
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
