import { GradeLevel, Language } from './index';

export type PremiumHubTab = 
  | 'videos'       // Hub 1: HD Video Masterclasses
  | 'animations'   // Hub 2: 2D & 3D Interactive Educational Animations
  | 'exam_engine'  // Hub 3: Advanced National Exam Simulator
  | 'stem_lab'     // Hub 4: Virtual Interactive STEM Science Lab
  | 'audio_hub'    // Hub 5: High-Yield Audio Revision Hub
  | 'study_plan';  // Hub 6: AI Personalized Study Timetable & Diagnostic Planner

export type STEMSubject = 
  | 'mathematics' 
  | 'physics' 
  | 'chemistry' 
  | 'biology' 
  | 'ict' 
  | 'social_science';

// ================= HUB 1: VIDEO MASTERCLASSES =================
export interface VideoChapter {
  id: string;
  timeSeconds: number;
  timeFormatted: string; // "04:15"
  title: Record<Language, string>;
  keyTakeaway: Record<Language, string>;
}

export interface VideoQuizCheckpoint {
  id: string;
  timeSeconds: number;
  question: Record<Language, string>;
  options: Record<Language, string[]>;
  correctIndex: number;
  explanation: Record<Language, string>;
}

export interface VideoMasterclassItem {
  id: string;
  grade: GradeLevel;
  subject: STEMSubject;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  instructor: {
    name: string;
    role: string;
    avatarUrl?: string;
    credentials: string;
  };
  durationFormatted: string;
  durationSeconds: number;
  badge: string;
  thumbnailGradient: string;
  youtubeId?: string;
  chapters: VideoChapter[];
  checkpoints: VideoQuizCheckpoint[];
  summaryPoints: Record<Language, string[]>;
  formulaCheatsheet?: string[];
  singlePriceETB: number;
}

// ================= HUB 2: 2D & 3D ANIMATIONS =================
export type SimulationType = 
  | 'projectile_motion' 
  | 'vsepr_molecules' 
  | 'riemann_integrals' 
  | 'cell_membrane_transport'
  | 'dna_replication'
  | 'quadratic_surfaces';

export interface InteractiveSimulationItem {
  id: string;
  type: SimulationType;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  subject: STEMSubject;
  grade: GradeLevel;
  dimension: '2D' | '3D' | 'Interactive Math';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced (EUEE)';
  keyFormulas: string[];
  description: Record<Language, string>;
  badge: string;
}

// ================= HUB 3: NATIONAL EXAM SIMULATOR =================
export type CognitiveSkillLevel = 'Knowledge' | 'Application' | 'Reasoning_Analysis';

export interface ExamQuestionDistractor {
  optionText: string;
  isCorrect: boolean;
  distractorTrapExplanation: Record<Language, string>;
}

export interface ExamSimulatorQuestion {
  id: string;
  questionNumber: number;
  unit: string;
  cognitiveLevel: CognitiveSkillLevel;
  text: Record<Language, string>;
  equationLatex?: string;
  figureUrl?: string;
  options: ExamQuestionDistractor[];
  detailedPedagogicalSolution: Record<Language, string>;
  referenceBookSection: string;
}

export interface NationalExamPaper {
  id: string;
  title: Record<Language, string>;
  examType: 'EUEE_NATIONAL' | 'ESSLCE_MODEL' | 'REGIONAL_STEM';
  targetGrade: GradeLevel;
  yearSession: string;
  durationMinutes: number;
  totalMarks: number;
  passingScorePercent: number;
  subjectsCovered: STEMSubject[];
  questions: ExamQuestionDistractor[]; // summary or direct questions
  questionItems: ExamSimulatorQuestion[];
}

export interface ExamDiagnosticReport {
  totalQuestions: number;
  score: number;
  percentage: number;
  timeSpentSeconds: number;
  unitPerformance: {
    unit: string;
    total: number;
    correct: number;
    percent: number;
  }[];
  cognitiveBreakdown: {
    level: CognitiveSkillLevel;
    total: number;
    correct: number;
  }[];
  securityAlertsCount: number;
  recommendations: Record<Language, string[]>;
}

// ================= HUB 4: VIRTUAL STEM LAB =================
export type LabType = 'titration' | 'optics_bench' | 'dc_circuits' | 'photosynthesis';

export interface VirtualExperimentItem {
  id: string;
  type: LabType;
  title: Record<Language, string>;
  grade: GradeLevel;
  subject: STEMSubject;
  curriculumCode: string; // e.g. "MoE-G10-CHEM-EXP3"
  safetyCaution: Record<Language, string>;
  objective: Record<Language, string>;
  materials: Record<Language, string[]>;
  standardTheoreticalOutcome: string;
}

// ================= HUB 5: AUDIO REVISION HUB =================
export interface HighYieldAudioItem {
  id: string;
  title: Record<Language, string>;
  topic: Record<Language, string>;
  subject: STEMSubject;
  grade: GradeLevel;
  durationMinutes: number;
  audioDurationSeconds: number;
  highYieldFormulas: string[];
  keyMnemonics: Record<Language, string>;
  transcripts: Record<Language, string>;
}

// ================= HUB 6: AI STUDY TIMETABLE =================
export interface DailyStudyTask {
  id: string;
  dayNumber: number;
  unit: string;
  title: Record<Language, string>;
  subject: STEMSubject;
  durationMinutes: number;
  xpReward: number;
  isCompleted: boolean;
  priority: 'High' | 'Medium' | 'Critical';
}

export interface AdaptiveStudyPlan {
  id: string;
  studentGrade: GradeLevel;
  targetExamYear: string;
  targetScore: number;
  dailyGoalHours: number;
  totalDays: number;
  completedDays: number;
  currentStreak: number;
  focusSubjects: STEMSubject[];
  tasks: DailyStudyTask[];
}
