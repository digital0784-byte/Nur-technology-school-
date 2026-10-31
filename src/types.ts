export type Language = 'am' | 'om' | 'ti' | 'ar' | 'so' | 'en';

export type GradeLevel = 9 | 10 | 11 | 12;
export type Grade = GradeLevel;

export type UserRole = 'student' | 'super_admin' | 'admin' | 'teacher' | 'parent';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  grade: GradeLevel;
  stream?: 'Natural Science' | 'Social Science';
  isGradeLocked: boolean;
  avatarUrl?: string;
  enrolledAt: string;
  xp: number;
  streakDays: number;
  completedLessonsCount: number;
  quizzesTakenCount: number;
  averageScore: number;
  isPremium: boolean;
  premiumExpiresAt?: string;
  completedLessonIds?: string[];
  streakFreezeAvailable?: boolean;
  streakFreezeActive?: boolean;
  gracePeriodActive?: boolean;
  unlockedBadges?: string[];
  dailyQuizzesPassed?: number;
  stemExperimentsCompleted?: number;
  eueeHighScore?: number;
  completedUnits?: string[];
}

export type ModuleCategory =
  | 'core_learning'
  | 'exams_assessment'
  | 'ai_smart_tools'
  | 'growth_payment'
  | 'admin_security';

export type ModuleId =
  // Category 1: 📚 ዋና መማሪያ እና መጽሐፍት (Core Learning & Books)
  | 'lesson'
  | 'curriculum_engine'
  | 'textbook'
  | 'supplementary'
  | 'video_learning'
  // Category 2: 📝 ፈተና እና ምዘና (Exams & Assessment)
  | 'assessment_engine'
  | 'entrance_prep'
  | 'objectives_exam'
  | 'quiz'
  | 'flashcards'
  | 'academic_work_hub'
  // Category 3: 🤖 AI እና ስማርት ረዳቶች (AI & Smart Tools)
  | 'ai_tutor'
  | 'photo_voice_tutor'
  | 'smart_search'
  | 'student_review'
  | 'student_app'
  // Category 4: 🌟 እድገት፣ ማዕከልና ክፍያ (Growth, Premium & Payment)
  | 'gamification'
  | 'career_pathways'
  | 'premium_learning_center'
  | 'subscription_payment'
  | 'system_feedback'
  // Category 5: 🛡️ አስተዳደርና ደህንነት (Administration & Security - Admin Only)
  | 'admin_dashboard'
  | 'security_fortress'
  | 'system_integration';

export type ActiveTab = ModuleId;

export interface ModuleItem {
  id: ModuleId;
  category: ModuleCategory;
  iconName: string;
  adminOnly?: boolean;
}

export interface CurriculumTopic {
  id: string;
  title: string;
  competencyObjectives: string[];
  summary: string;
  content: string;
  ethiopianExample?: string;
  estimatedStudyMinutes: number;
  pageReference: string;
}

export type Topic = CurriculumTopic;

export interface CurriculumUnit {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  topics: CurriculumTopic[];
}

export interface CurriculumSubject {
  id: string;
  code: string;
  name: Record<Language, string>;
  grade: GradeLevel;
  icon: string;
  color: string;
  units: CurriculumUnit[];
}

export type Subject = CurriculumSubject;

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topicRef: string;
  grade?: GradeLevel;
  subject?: string;
}

export interface FlashcardItem {
  id: string;
  subject: string;
  grade: GradeLevel;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
}

export type Flashcard = FlashcardItem;

export interface HomeworkAssignment {
  id: string;
  title: string;
  subject: string;
  grade: GradeLevel;
  unit: string;
  dueDate: string;
  totalMarks: number;
  description: string;
  questionsPrompt: string;
  status: 'pending' | 'submitted' | 'graded';
  submissionText?: string;
  gradeResult?: {
    score: number;
    feedback: string;
    gradedAt: string;
  };
}

export interface PaymentTransaction {
  id: string;
  studentId: string;
  studentName: string;
  grade: GradeLevel;
  provider: 'Telebirr' | 'CBE' | 'Commercial Bank of Ethiopia';
  amount: number;
  transactionRef: string;
  slipUrl?: string;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
  planDuration: '1 Month' | 'Full Academic Semester' | 'Yearly Pass';
}

export interface AuditLog {
  id?: string;
  logId: string;
  actorId: string;
  actorRole: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'SYSTEM';
  action: string;
  resourceType: string;
  resourceId: string;
  result: 'success' | 'denied';
  ip: string;
  timestamp: string;
  details?: string;
}

export interface DeviceSession {
  deviceId: string;
  studentId: string;
  studentEmail: string;
  deviceName: string;
  browser: string;
  os: string;
  ip: string;
  registeredAt: string;
  lastActive: string;
  status: 'ACTIVE' | 'FLAGGED_CONCURRENT' | 'REVOKED';
  isTrusted: boolean;
}

export interface SecurityUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'teacher' | 'student';
  grade: GradeLevel;
  isGradeLocked: boolean;
  activeDevicesCount: number;
  lastLogin: string;
  status: 'ACTIVE' | 'SUSPENDED';
}
