import { GradeLevel } from './index';

export type AcademicWorkHubTab = 'homework' | 'premium_assignment' | 'stem_project' | 'portfolio';

export type HomeworkQuestionType = 'mcq' | 'numerical' | 'short_answer';

export interface HomeworkHintScaffolding {
  level1Nudge: string;     // Conceptual intuitive reminder without formulas
  level2FormulaClue: string; // Governing equation and variable identification
  level3Setup: string;       // Algebraic roadmap without giving the final number
}

export interface HomeworkQuestion {
  id: string;
  grade: GradeLevel;
  subject: string;
  unit: string;
  chapter: string;
  topic: string;
  type: HomeworkQuestionType;
  prompt: string;
  options?: string[]; // For MCQ
  correctOptionIndex?: number;
  correctNumericalAnswer?: number;
  numericalTolerance?: number; // e.g. 0.05
  unitOfMeasure?: string; // e.g. "m/s", "ETB", "mol/L", "N"
  expectedKeyTerms?: string[]; // For short answer
  sampleSolution: string;
  stepByStepDerivation: string[];
  textbookCitation: {
    grade: GradeLevel;
    subject: string;
    unit: string;
    pageNumber: string;
    edition: string;
  };
  hints: HomeworkHintScaffolding;
  points: number;
}

export interface RubricCriterion {
  score: number;
  maxScore: number;
  notes: string;
}

export interface AssignmentRubricBreakdown {
  comprehension: RubricCriterion;   // 25%
  methodology: RubricCriterion;     // 35%
  factualAccuracy: RubricCriterion; // 25%
  presentation: RubricCriterion;    // 15%
}

export interface PremiumAssignment {
  id: string;
  grade: GradeLevel;
  subject: string;
  unit: string;
  chapter: string;
  title: string;
  subtitle: string;
  rigorLevel: 'Standard MoE' | 'Advanced Entrance (EUEE)' | 'University Preparatory' | 'STEM Honors';
  priceETB: number; // 54 ETB
  problemStatement: string;
  starterTemplate: string;
  guidingQuestions: string[];
  formulaReference: string[];
  rubricGuidelines: {
    comprehensionFocus: string;
    methodologyFocus: string;
    factualAccuracyFocus: string;
    presentationFocus: string;
  };
  textbookCitation: string;
  estimatedTimeMinutes: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  grade: GradeLevel;
  subject: string;
  submissionText: string;
  submittedAt: string;
  scoreOutOf100?: number;
  gradeLetter?: string;
  rubricBreakdown?: AssignmentRubricBreakdown;
  strengths?: string[];
  areasForImprovement?: string[];
  detailedFeedback?: string;
  textbookCitation?: string;
  // Teacher Override Controls
  teacherOverrideScore?: number;
  teacherFeedbackNotes?: string;
  teacherName?: string;
  teacherReviewedAt?: string;
  isTeacherReviewed?: boolean;
}

export interface StemProjectPhase {
  phaseNumber: 1 | 2 | 3;
  title: string;
  titleAmharic: string;
  objective: string;
  deliverables: string[];
  checklistItems: string[];
  studentInputPrompt: string;
  placeholderText: string;
}

export interface StemProject {
  id: string;
  grade: GradeLevel;
  subject: string;
  title: string;
  titleAmharic: string;
  theme: string;
  ethiopianContext: string;
  summary: string;
  badgeName: string;
  badgeIcon: string;
  phases: [StemProjectPhase, StemProjectPhase, StemProjectPhase];
  estimatedDuration: string;
}

export interface StemProjectSubmission {
  id: string;
  projectId: string;
  projectTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  grade: GradeLevel;
  currentPhase: 1 | 2 | 3 | 4; // 4 means completed
  phase1Submission?: {
    content: string;
    completedAt: string;
    checklistDone: string[];
  };
  phase2Submission?: {
    content: string;
    measurementsTable?: { variable: string; measuredValue: string; unit: string }[];
    completedAt: string;
    checklistDone: string[];
  };
  phase3Submission?: {
    content: string;
    conclusion: string;
    communityApplication: string;
    completedAt: string;
  };
  isCompleted: boolean;
  awardedBadge?: string;
  scoreOutOf100?: number;
  teacherNotes?: string;
  updatedAt: string;
}

export interface StudentAcademicPortfolio {
  studentId: string;
  studentName: string;
  studentEmail: string;
  grade: GradeLevel;
  completedHomeworkCount: number;
  homeworkTotalScore: number;
  completedAssignmentsCount: number;
  assignmentAverageScore: number;
  completedStemProjectsCount: number;
  badgesEarned: string[];
  subjectMastery: {
    subject: string;
    percentage: number;
    tasksCount: number;
  }[];
  recentSubmissions: {
    id: string;
    title: string;
    category: 'homework' | 'premium_assignment' | 'stem_project';
    subject: string;
    score: number;
    submittedAt: string;
    status: string;
  }[];
}
