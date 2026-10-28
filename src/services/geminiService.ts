import { GradeLevel, Language } from '../types';

export class GeminiService {
  static async askTutor(params: {
    message: string;
    history?: any[];
    grade: GradeLevel;
    subject: string;
    unit?: string;
    language: Language;
  }) {
    const res = await fetch('/api/ai/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  }

  static async solvePhotoQuestion(params: {
    imageBase64: string | null;
    questionPrompt?: string;
    grade: GradeLevel;
    subject?: string;
    language: Language;
  }) {
    const res = await fetch('/api/ai/ocr-solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  }

  static async generateExamQuestions(params: {
    grade: GradeLevel;
    subject: string;
    count?: number;
    chapter?: string;
    language: Language;
  }) {
    const res = await fetch('/api/ai/exam-gen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  }

  static async gradeAssignment(params: {
    assignmentTitle: string;
    studentSubmission: string;
    rubric?: string;
    grade: GradeLevel;
    subject: string;
    language: Language;
  }) {
    const res = await fetch('/api/ai/grade-assignment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  }

  static async searchCurriculum(params: {
    query: string;
    grade: GradeLevel;
    language: Language;
  }) {
    const res = await fetch('/api/ai/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  }
}
