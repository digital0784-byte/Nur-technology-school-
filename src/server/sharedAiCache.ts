import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface CacheEntry<T = any> {
  key: string;
  category: 'tutor' | 'ocr-solve' | 'lesson' | 'exam-gen' | 'grade-assignment' | 'search';
  payload: T;
  modelUsed?: string;
  hitCount: number;
  firstGeneratedAt: string;
  lastRetrievedAt: string;
  meta?: Record<string, any>;
}

class SharedAiCacheManager {
  private cache = new Map<string, CacheEntry>();
  private cacheFilePath: string;
  private saveTimeout: NodeJS.Timeout | null = null;
  private totalHits = 0;

  constructor() {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (e) {
        console.warn('Could not create data directory for AI cache:', e);
      }
    }
    this.cacheFilePath = path.join(dataDir, 'shared_ai_knowledge_cache.json');
    this.loadFromDisk();
  }

  private normalizeText(str: string): string {
    if (!str || typeof str !== 'string') return '';
    return str
      .toLowerCase()
      .trim()
      // Normalize Ethiopian and standard punctuation
      .replace(/[?.,!;:"'“”‘’።፡፣፤፥፦፧\-_/\\]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private hashData(str: string): string {
    return crypto.createHash('sha256').update(str).digest('hex').slice(0, 24);
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.cacheFilePath)) {
        const raw = fs.readFileSync(this.cacheFilePath, 'utf-8');
        const items: CacheEntry[] = JSON.parse(raw);
        if (Array.isArray(items)) {
          for (const item of items) {
            if (item && item.key) {
              this.cache.set(item.key, item);
              this.totalHits += item.hitCount || 0;
            }
          }
          console.log(`[SharedAiCache] Loaded ${this.cache.size} shared AI knowledge items from disk.`);
        }
      }
    } catch (err) {
      console.warn('[SharedAiCache] Failed to load cache from disk:', err);
    }
  }

  private scheduleSave() {
    if (this.saveTimeout) return;
    this.saveTimeout = setTimeout(() => {
      this.saveTimeout = null;
      this.saveToDisk();
    }, 1000);
  }

  private saveToDisk() {
    try {
      const dataDir = path.dirname(this.cacheFilePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const list = Array.from(this.cache.values());
      const tempPath = `${this.cacheFilePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(list, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.cacheFilePath);
    } catch (err) {
      console.warn('[SharedAiCache] Error saving cache to disk:', err);
    }
  }

  // TUTOR CACHE
  getTutorReply(params: {
    grade: string;
    subject: string;
    unit?: string;
    topic?: string;
    message: string;
    language: string;
  }): { reply: string; modelUsed?: string; hitCount: number } | null {
    const key = `tutor:${params.grade}:${this.normalizeText(params.subject)}:${this.normalizeText(params.topic || '')}:${this.normalizeText(params.message)}:${params.language || 'am'}`;
    const entry = this.cache.get(key);
    if (entry) {
      entry.hitCount = (entry.hitCount || 0) + 1;
      entry.lastRetrievedAt = new Date().toISOString();
      this.totalHits++;
      this.scheduleSave();
      return { reply: entry.payload, modelUsed: entry.modelUsed, hitCount: entry.hitCount };
    }
    return null;
  }

  setTutorReply(
    params: {
      grade: string;
      subject: string;
      unit?: string;
      topic?: string;
      message: string;
      language: string;
    },
    reply: string,
    modelUsed?: string
  ) {
    if (!reply || reply.length < 5) return;
    const key = `tutor:${params.grade}:${this.normalizeText(params.subject)}:${this.normalizeText(params.topic || '')}:${this.normalizeText(params.message)}:${params.language || 'am'}`;
    const entry: CacheEntry<string> = {
      key,
      category: 'tutor',
      payload: reply,
      modelUsed,
      hitCount: 1,
      firstGeneratedAt: new Date().toISOString(),
      lastRetrievedAt: new Date().toISOString(),
      meta: { grade: params.grade, subject: params.subject, topic: params.topic },
    };
    this.cache.set(key, entry);
    this.scheduleSave();
  }

  // LESSON CACHE
  getLesson(params: {
    subjectCode?: string;
    subjectName?: string;
    grade: string;
    topicId?: string;
    topicTitle?: string;
    language: string;
  }): { lesson: any; grounded: boolean; sources: any[]; modelUsed?: string; hitCount: number } | null {
    const lang = params.language || 'am';
    const sub = this.normalizeText(params.subjectCode || params.subjectName || '');
    const cleanTitle = (params.topicTitle || '').replace(/^\d+(\.\d+)*\s*/, '').trim();

    const candidateKeys: string[] = [];
    if (params.topicId) {
      const normId = this.normalizeText(params.topicId);
      candidateKeys.push(`lesson:${sub}:${params.grade}:${normId}:${lang}`);
      candidateKeys.push(`lesson:any:${params.grade}:${normId}:${lang}`);
    }
    if (params.topicTitle) {
      const normTitle = this.normalizeText(params.topicTitle);
      candidateKeys.push(`lesson:${sub}:${params.grade}:${normTitle}:${lang}`);
      candidateKeys.push(`lesson:any:${params.grade}:${normTitle}:${lang}`);
    }
    if (cleanTitle) {
      const normClean = this.normalizeText(cleanTitle);
      candidateKeys.push(`lesson:${sub}:${params.grade}:${normClean}:${lang}`);
    }

    for (const key of candidateKeys) {
      const entry = this.cache.get(key);
      if (entry && entry.payload?.lesson) {
        entry.hitCount = (entry.hitCount || 0) + 1;
        entry.lastRetrievedAt = new Date().toISOString();
        this.totalHits++;
        this.scheduleSave();
        return {
          lesson: entry.payload.lesson,
          grounded: !!entry.payload.grounded,
          sources: entry.payload.sources || [],
          modelUsed: entry.modelUsed,
          hitCount: entry.hitCount,
        };
      }
    }
    return null;
  }

  setLesson(
    params: {
      subjectCode?: string;
      subjectName?: string;
      grade: string;
      topicId?: string;
      topicTitle?: string;
      language: string;
    },
    lesson: any,
    grounded: boolean,
    sources: any[],
    modelUsed?: string
  ) {
    if (!lesson) return;
    const lang = params.language || 'am';
    const sub = this.normalizeText(params.subjectCode || params.subjectName || '');
    const cleanTitle = (params.topicTitle || '').replace(/^\d+(\.\d+)*\s*/, '').trim();

    const primaryTopic = this.normalizeText(params.topicId || params.topicTitle || '');
    const primaryKey = `lesson:${sub}:${params.grade}:${primaryTopic}:${lang}`;

    const entry: CacheEntry = {
      key: primaryKey,
      category: 'lesson',
      payload: { lesson, grounded, sources },
      modelUsed,
      hitCount: 1,
      firstGeneratedAt: new Date().toISOString(),
      lastRetrievedAt: new Date().toISOString(),
      meta: { grade: params.grade, subject: params.subjectName || params.subjectCode, topic: params.topicTitle },
    };

    this.cache.set(primaryKey, entry);

    // Also index under secondary aliases so other queries hit the cache 100%
    if (params.topicTitle) {
      const titleKey = `lesson:${sub}:${params.grade}:${this.normalizeText(params.topicTitle)}:${lang}`;
      if (titleKey !== primaryKey) {
        this.cache.set(titleKey, entry);
      }
    }
    if (cleanTitle) {
      const cleanKey = `lesson:${sub}:${params.grade}:${this.normalizeText(cleanTitle)}:${lang}`;
      if (cleanKey !== primaryKey) {
        this.cache.set(cleanKey, entry);
      }
    }

    this.scheduleSave();
  }

  // OCR PROBLEM SOLVER CACHE
  getOcrSolve(params: {
    grade: string;
    subject?: string;
    questionPrompt?: string;
    imageBase64?: string;
    language: string;
  }): { solution: string; modelUsed?: string; hitCount: number } | null {
    const promptHash = params.questionPrompt ? this.normalizeText(params.questionPrompt) : '';
    const imgHash = params.imageBase64 ? this.hashData(params.imageBase64) : 'no_img';
    const sub = this.normalizeText(params.subject || 'science');
    const key = `ocr:${params.grade}:${sub}:${promptHash}:${imgHash}:${params.language || 'am'}`;
    const entry = this.cache.get(key);
    if (entry) {
      entry.hitCount = (entry.hitCount || 0) + 1;
      entry.lastRetrievedAt = new Date().toISOString();
      this.totalHits++;
      this.scheduleSave();
      return { solution: entry.payload, modelUsed: entry.modelUsed, hitCount: entry.hitCount };
    }
    return null;
  }

  setOcrSolve(
    params: {
      grade: string;
      subject?: string;
      questionPrompt?: string;
      imageBase64?: string;
      language: string;
    },
    solution: string,
    modelUsed?: string
  ) {
    if (!solution || solution.length < 5) return;
    const promptHash = params.questionPrompt ? this.normalizeText(params.questionPrompt) : '';
    const imgHash = params.imageBase64 ? this.hashData(params.imageBase64) : 'no_img';
    const sub = this.normalizeText(params.subject || 'science');
    const key = `ocr:${params.grade}:${sub}:${promptHash}:${imgHash}:${params.language || 'am'}`;
    const entry: CacheEntry<string> = {
      key,
      category: 'ocr-solve',
      payload: solution,
      modelUsed,
      hitCount: 1,
      firstGeneratedAt: new Date().toISOString(),
      lastRetrievedAt: new Date().toISOString(),
      meta: { grade: params.grade, subject: params.subject },
    };
    this.cache.set(key, entry);
    this.scheduleSave();
  }

  // EXAM GENERATOR CACHE
  getExamGen(params: {
    grade: string;
    subject: string;
    chapter?: string;
    count?: number;
    difficulty?: string;
    language: string;
  }): { questions: any[]; modelUsed?: string; hitCount: number } | null {
    const sub = this.normalizeText(params.subject);
    const ch = this.normalizeText(params.chapter || 'all');
    const diff = (params.difficulty || 'standard').toLowerCase();
    const count = params.count || 5;
    const key = `exam:${params.grade}:${sub}:${ch}:${count}:${diff}:${params.language || 'am'}`;
    const entry = this.cache.get(key);
    if (entry && Array.isArray(entry.payload) && entry.payload.length > 0) {
      entry.hitCount = (entry.hitCount || 0) + 1;
      entry.lastRetrievedAt = new Date().toISOString();
      this.totalHits++;
      this.scheduleSave();
      return { questions: entry.payload, modelUsed: entry.modelUsed, hitCount: entry.hitCount };
    }
    return null;
  }

  setExamGen(
    params: {
      grade: string;
      subject: string;
      chapter?: string;
      count?: number;
      difficulty?: string;
      language: string;
    },
    questions: any[],
    modelUsed?: string
  ) {
    if (!Array.isArray(questions) || questions.length === 0) return;
    const sub = this.normalizeText(params.subject);
    const ch = this.normalizeText(params.chapter || 'all');
    const diff = (params.difficulty || 'standard').toLowerCase();
    const count = params.count || 5;
    const key = `exam:${params.grade}:${sub}:${ch}:${count}:${diff}:${params.language || 'am'}`;
    const entry: CacheEntry<any[]> = {
      key,
      category: 'exam-gen',
      payload: questions,
      modelUsed,
      hitCount: 1,
      firstGeneratedAt: new Date().toISOString(),
      lastRetrievedAt: new Date().toISOString(),
      meta: { grade: params.grade, subject: params.subject, chapter: params.chapter },
    };
    this.cache.set(key, entry);
    this.scheduleSave();
  }

  // ASSIGNMENT GRADING CACHE
  getGradeAssignment(params: {
    grade: string;
    subject: string;
    assignmentTitle: string;
    studentSubmission: string;
    language: string;
  }): { evaluation: any; modelUsed?: string; hitCount: number } | null {
    const sub = this.normalizeText(params.subject);
    const title = this.normalizeText(params.assignmentTitle);
    const subHash = this.hashData(this.normalizeText(params.studentSubmission));
    const key = `grade:${params.grade}:${sub}:${title}:${subHash}:${params.language || 'am'}`;
    const entry = this.cache.get(key);
    if (entry && entry.payload) {
      entry.hitCount = (entry.hitCount || 0) + 1;
      entry.lastRetrievedAt = new Date().toISOString();
      this.totalHits++;
      this.scheduleSave();
      return { evaluation: entry.payload, modelUsed: entry.modelUsed, hitCount: entry.hitCount };
    }
    return null;
  }

  setGradeAssignment(
    params: {
      grade: string;
      subject: string;
      assignmentTitle: string;
      studentSubmission: string;
      language: string;
    },
    evaluation: any,
    modelUsed?: string
  ) {
    if (!evaluation) return;
    const sub = this.normalizeText(params.subject);
    const title = this.normalizeText(params.assignmentTitle);
    const subHash = this.hashData(this.normalizeText(params.studentSubmission));
    const key = `grade:${params.grade}:${sub}:${title}:${subHash}:${params.language || 'am'}`;
    const entry: CacheEntry = {
      key,
      category: 'grade-assignment',
      payload: evaluation,
      modelUsed,
      hitCount: 1,
      firstGeneratedAt: new Date().toISOString(),
      lastRetrievedAt: new Date().toISOString(),
    };
    this.cache.set(key, entry);
    this.scheduleSave();
  }

  // SEARCH CACHE
  getSearch(params: {
    query: string;
    grade?: string;
    language: string;
  }): { results: any[]; modelUsed?: string; hitCount: number } | null {
    const q = this.normalizeText(params.query);
    const gr = params.grade || 'all';
    const key = `search:${gr}:${q}:${params.language || 'am'}`;
    const entry = this.cache.get(key);
    if (entry && Array.isArray(entry.payload) && entry.payload.length > 0) {
      entry.hitCount = (entry.hitCount || 0) + 1;
      entry.lastRetrievedAt = new Date().toISOString();
      this.totalHits++;
      this.scheduleSave();
      return { results: entry.payload, modelUsed: entry.modelUsed, hitCount: entry.hitCount };
    }
    return null;
  }

  setSearch(
    params: {
      query: string;
      grade?: string;
      language: string;
    },
    results: any[],
    modelUsed?: string
  ) {
    if (!Array.isArray(results) || results.length === 0) return;
    const q = this.normalizeText(params.query);
    const gr = params.grade || 'all';
    const key = `search:${gr}:${q}:${params.language || 'am'}`;
    const entry: CacheEntry<any[]> = {
      key,
      category: 'search',
      payload: results,
      modelUsed,
      hitCount: 1,
      firstGeneratedAt: new Date().toISOString(),
      lastRetrievedAt: new Date().toISOString(),
    };
    this.cache.set(key, entry);
    this.scheduleSave();
  }

  // STATS & METRICS
  getStats() {
    const entries = Array.from(this.cache.values());
    const totalEntries = entries.length;
    let totalHits = 0;
    const categoryCounts: Record<string, number> = {};

    for (const e of entries) {
      totalHits += (e.hitCount || 1) - 1; // Saved requests beyond original 1
      categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
    }

    // Estimate: ~1,500 tokens per request saved, ~0.08 ETB equivalent per request
    const savedTokens = totalHits * 1500;
    const estimatedCostSavedBirr = Math.round(totalHits * 2.5 * 100) / 100;

    return {
      success: true,
      totalEntries,
      savedApiCalls: totalHits,
      categoryCounts,
      estimatedTokensSaved: savedTokens,
      estimatedCostSavedBirr,
      storageFile: this.cacheFilePath,
    };
  }
}

export const sharedAiCache = new SharedAiCacheManager();
