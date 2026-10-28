import React, { createContext, useContext, useState, useEffect } from 'react';
import { GradeLevel, UserProfile, UserRole } from '../types';

interface AuthContextType {
  currentUser: UserProfile;
  activeGrade: GradeLevel;
  setActiveGrade: (grade: GradeLevel) => void;
  isSuperAdmin: boolean;
  isGradeLocked: boolean;
  hasCompletedOnboarding: boolean;
  completeOnboarding: (selectedGrade: GradeLevel, name?: string) => void;
  loginAsSuperAdmin: () => void;
  loginAsStudent: (grade: GradeLevel, name?: string) => void;
  updateUserXP: (additionalXP: number) => void;
  markLessonCompleted: (lessonId: string) => void;
  completedLessons: string[];
}

const SUPER_ADMIN_EMAIL = 'mejennur669@gmail.com';
const SUPER_ADMIN_NAME = 'Nuriye Ahmed Adem';

const DEFAULT_SUPER_ADMIN_PROFILE: UserProfile = {
  id: 'usr-super-admin-01',
  name: SUPER_ADMIN_NAME,
  email: SUPER_ADMIN_EMAIL,
  role: 'super_admin',
  grade: 12,
  isGradeLocked: false,
  enrolledAt: '2026-01-01',
  xp: 14500,
  streakDays: 48,
  completedLessonsCount: 65,
  quizzesTakenCount: 92,
  averageScore: 98.4,
  isPremium: true,
};

const DEFAULT_STUDENT_PROFILE: UserProfile = {
  id: 'usr-student-01',
  name: 'Almaz Tadesse',
  email: 'almaz.student@nur-school.edu.et',
  role: 'student',
  grade: 10,
  isGradeLocked: true,
  enrolledAt: '2026-09-01',
  xp: 1850,
  streakDays: 7,
  completedLessonsCount: 14,
  quizzesTakenCount: 18,
  averageScore: 84.5,
  isPremium: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('app_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore parse error
      }
    }
    return DEFAULT_STUDENT_PROFILE;
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('app_onboarding_completed') === 'true';
  });

  const [activeGrade, setActiveGradeState] = useState<GradeLevel>(() => {
    return currentUser.grade;
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('app_completed_lessons');
    return saved ? JSON.parse(saved) : ['g9-m-t1', 'g10-m-t1'];
  });

  const isSuperAdmin = currentUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() || currentUser.role === 'super_admin';
  const isGradeLocked = !isSuperAdmin;

  useEffect(() => {
    localStorage.setItem('app_user_profile', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('app_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  const setActiveGrade = (grade: GradeLevel) => {
    if (isSuperAdmin) {
      setActiveGradeState(grade);
    } else {
      console.warn('Student grade is locked. Grade change blocked.');
    }
  };

  const completeOnboarding = (selectedGrade: GradeLevel, name = 'ተማሪ (Student)') => {
    const updated: UserProfile = {
      ...currentUser,
      grade: selectedGrade,
      name,
      role: 'student',
      isGradeLocked: true,
    };
    setCurrentUser(updated);
    setActiveGradeState(selectedGrade);
    setHasCompletedOnboarding(true);
    localStorage.setItem('app_onboarding_completed', 'true');
    localStorage.setItem('app_user_profile', JSON.stringify(updated));
  };

  const loginAsSuperAdmin = () => {
    setCurrentUser(DEFAULT_SUPER_ADMIN_PROFILE);
    setActiveGradeState(DEFAULT_SUPER_ADMIN_PROFILE.grade);
    setHasCompletedOnboarding(true);
    localStorage.setItem('app_onboarding_completed', 'true');
    localStorage.setItem('app_user_profile', JSON.stringify(DEFAULT_SUPER_ADMIN_PROFILE));
  };

  const loginAsStudent = (grade: GradeLevel, name = 'ተማሪ (Student)') => {
    const studentProf: UserProfile = {
      ...DEFAULT_STUDENT_PROFILE,
      name,
      grade,
      isGradeLocked: true,
    };
    setCurrentUser(studentProf);
    setActiveGradeState(grade);
    setHasCompletedOnboarding(true);
    localStorage.setItem('app_onboarding_completed', 'true');
    localStorage.setItem('app_user_profile', JSON.stringify(studentProf));
  };

  const updateUserXP = (additionalXP: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      xp: prev.xp + additionalXP,
    }));
  };

  const markLessonCompleted = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const next = [...completedLessons, lessonId];
      setCompletedLessons(next);
      updateUserXP(100);
      setCurrentUser((prev) => ({
        ...prev,
        completedLessonsCount: prev.completedLessonsCount + 1,
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeGrade,
        setActiveGrade,
        isSuperAdmin,
        isGradeLocked,
        hasCompletedOnboarding,
        completeOnboarding,
        loginAsSuperAdmin,
        loginAsStudent,
        updateUserXP,
        markLessonCompleted,
        completedLessons,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
