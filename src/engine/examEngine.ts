import { QuizQuestion, GradeLevel } from '../types';

export interface ExamSessionState {
  examId: string;
  grade: GradeLevel;
  subject: string;
  totalTimeMinutes: number;
  timeRemainingSeconds: number;
  questions: QuizQuestion[];
  userAnswers: Record<number, number>; // questionIndex -> selectedIndex
  isSubmitted: boolean;
}

export class ExamEngine {
  static evaluateExam(questions: QuizQuestion[], userAnswers: Record<number, number>) {
    let correctCount = 0;
    const itemAnalysis: Array<{
      questionId: string;
      userAnswer: number | null;
      correctAnswer: number;
      isCorrect: boolean;
      explanation: string;
    }> = [];

    questions.forEach((q, idx) => {
      const userChoice = userAnswers[idx] ?? null;
      const isCorrect = userChoice === q.correctIndex;
      if (isCorrect) correctCount++;

      itemAnalysis.push({
        questionId: q.id,
        userAnswer: userChoice,
        correctAnswer: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
      });
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const percentile = Math.min(99, Math.max(10, Math.round(scorePercentage * 0.95 + 4)));

    let performanceTier: 'Exceptional' | 'Pass With Distinction' | 'Satisfactory' | 'Needs Review' = 'Satisfactory';
    if (scorePercentage >= 90) performanceTier = 'Exceptional';
    else if (scorePercentage >= 75) performanceTier = 'Pass With Distinction';
    else if (scorePercentage < 60) performanceTier = 'Needs Review';

    return {
      totalQuestions: questions.length,
      correctCount,
      scorePercentage,
      percentile,
      performanceTier,
      itemAnalysis,
    };
  }
}
