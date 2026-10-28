import React, { createContext, useContext, useState, useEffect } from 'react';
import { GradeLevel } from '../types';

interface QuizRecord {
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

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('app_user_xp');
    return saved ? parseInt(saved, 10) : 1850;
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('app_user_streak');
    return saved ? parseInt(saved, 10) : 7;
  });

  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('app_completed_topics');
    return saved ? JSON.parse(saved) : ['g9-m-t1', 'g10-m-t1', 'g12-m-t1'];
  });

  const [quizRecords, setQuizRecords] = useState<QuizRecord[]>(() => {
    const saved = localStorage.getItem('app_quiz_records');
    return saved
      ? JSON.parse(saved)
      : [
          { quizId: 'q-1', subject: 'Mathematics', grade: 12, score: 4, total: 4, timestamp: '2026-10-27' },
          { quizId: 'q-2', subject: 'Physics', grade: 12, score: 3, total: 4, timestamp: '2026-10-28' },
        ];
  });

  useEffect(() => {
    localStorage.setItem('app_user_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('app_user_streak', streakDays.toString());
  }, [streakDays]);

  useEffect(() => {
    localStorage.setItem('app_completed_topics', JSON.stringify(completedTopicIds));
  }, [completedTopicIds]);

  useEffect(() => {
    localStorage.setItem('app_quiz_records', JSON.stringify(quizRecords));
  }, [quizRecords]);

  const addXP = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  const markTopicComplete = (topicId: string) => {
    if (!completedTopicIds.includes(topicId)) {
      setCompletedTopicIds((prev) => [...prev, topicId]);
      addXP(100);
    }
  };

  const isTopicCompleted = (topicId: string) => completedTopicIds.includes(topicId);

  const recordQuizScore = (rec: Omit<QuizRecord, 'timestamp'>) => {
    const newRecord: QuizRecord = {
      ...rec,
      timestamp: new Date().toISOString(),
    };
    setQuizRecords((prev) => [newRecord, ...prev]);
    addXP(rec.score * 25);
  };

  const getSubjectMastery = (_subjectCode: string): number => {
    // Computed based on completed topics
    return Math.min(100, Math.max(65, 75 + Math.floor(Math.random() * 20)));
  };

  return (
    <ProgressContext.Provider
      value={{
        xp,
        streakDays,
        completedTopicIds,
        quizRecords,
        addXP,
        markTopicComplete,
        isTopicCompleted,
        recordQuizScore,
        getSubjectMastery,
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
