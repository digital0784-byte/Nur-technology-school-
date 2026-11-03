import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { GradeLevel } from '../types';

export interface QuizRecord {
  quizId: string;
  subject: string;
  grade: GradeLevel;
  score: number;
  total: number;
  timestamp: string;
}

interface ProgressContextType {
  xp: number;
  streakDays: number;
  completedTopicIds: string[];
  quizRecords: QuizRecord[];
  addXP: (amount: number) => void;
  markTopicComplete: (topicId: string) => void;
  isTopicCompleted: (topicId: string) => boolean;
  recordQuizScore: (record: Omit<QuizRecord, 'timestamp'>) => void;
  getSubjectMastery: (subjectCode: string) => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Thin wrapper over AuthContext: progress lives in the user's Firestore profile.
// No localStorage and no sample data.
export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateUserXP, markLessonCompleted, completedLessons } = useAuth();

  return (
    <ProgressContext.Provider
      value={{
        xp: currentUser.xp,
        streakDays: currentUser.streakDays,
        completedTopicIds: completedLessons,
        quizRecords: [],
        addXP: updateUserXP,
        markTopicComplete: markLessonCompleted,
        isTopicCompleted: (id) => completedLessons.includes(id),
        recordQuizScore: (rec) => {
          const total = Math.max(1, rec.total);
          const score = Math.max(0, Math.min(rec.score, total));
          updateUserXP(score * 25);
        },
        getSubjectMastery: () => 0,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
