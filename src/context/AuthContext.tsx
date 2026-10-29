import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { GradeLevel, UserProfile, UserRole } from '../types';
import { FirebaseService } from '../services/firebaseService';
import { auth, isFirebaseConfigured } from '../firebase';

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  grade: GradeLevel;
}

interface AuthContextType {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  authLoading: boolean;
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
  register: (params: RegisterParams) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const SUPER_ADMIN_EMAIL = 'mejennur669@gmail.com';
export const SUPER_ADMIN_NAME = 'Nuriye Ahmed Adem';

export const DEFAULT_SUPER_ADMIN_PROFILE: UserProfile = {
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

export const DEFAULT_STUDENT_PROFILE: UserProfile = {
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

export function authErrorMessage(err: unknown): string {
  const code = (err as any)?.code || '';
  const message = (err as any)?.message || '';
  if (code === 'auth/email-already-in-use') {
    return 'ይህ ኢሜይል ቀደም ሲል ተመዝግቧል። እባክዎ ይግቡ። / This email is already registered. Please login.';
  }
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
    return 'የተሳሳተ ኢሜይል ወይም የይለፍ ቃል። / Incorrect email or password.';
  }
  if (code === 'auth/user-not-found') {
    return 'ተጠቃሚው አልተገኘም። እባክዎ ይመዝገቡ። / User not found. Please register.';
  }
  if (code === 'auth/weak-password') {
    return 'የይለፍ ቃሉ ቢያንስ 6 ፊደላት ወይም ቁጥሮች መሆን አለበት። / Password must be at least 6 characters.';
  }
  if (code === 'auth/invalid-email') {
    return 'እባክዎ ትክክለኛ ኢሜይል ያስገቡ። / Please enter a valid email address.';
  }
  if (code === 'auth/network-request-failed') {
    return 'የኔትወርክ ግንኙነት ችግር አጋጥሟል። / Network error. Please check your internet connection.';
  }
  if (code === 'auth/too-many-requests') {
    return 'ብዙ ሙከራዎች ተደርገዋል። እባክዎ ትንሽ ቆይተው እንደገና ይሞክሩ። / Too many requests. Please try again later.';
  }
  return message || 'የማረጋገጫ ስህተት አጋጥሟል። እባክዎ እንደገና ይሞክሩ። / Authentication error. Please try again.';
}

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

  const [authLoading, setAuthLoading] = useState<boolean>(false);

  const isSuperAdmin = currentUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() || currentUser.role === 'super_admin';
  const isGradeLocked = !isSuperAdmin;
  const isAuthenticated = Boolean(hasCompletedOnboarding && currentUser && currentUser.id);

  useEffect(() => {
    localStorage.setItem('app_user_profile', JSON.stringify(currentUser));
    FirebaseService.syncUserProfile(currentUser);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('app_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  // Sync auth state listener with Firebase
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    try {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser && fbUser.email) {
          if (fbUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
            setCurrentUser(DEFAULT_SUPER_ADMIN_PROFILE);
            setActiveGradeState(DEFAULT_SUPER_ADMIN_PROFILE.grade);
          }
        }
      });
      return () => unsubscribe();
    } catch {
      // ignore
    }
  }, []);

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

  const register = async ({ name, email, password, grade }: RegisterParams) => {
    const trimmedEmail = email.trim();
    let uid = `usr-${Date.now()}`;

    if (isFirebaseConfigured) {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      uid = userCredential.user.uid;
    }

    const isSuper = trimmedEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
    const newProfile: UserProfile = {
      id: uid,
      name: name.trim() || 'ተማሪ (Student)',
      email: trimmedEmail,
      role: isSuper ? 'super_admin' : 'student',
      grade: isSuper ? 12 : grade,
      isGradeLocked: !isSuper,
      enrolledAt: new Date().toISOString().split('T')[0],
      xp: isSuper ? 14500 : 100,
      streakDays: 1,
      completedLessonsCount: 0,
      quizzesTakenCount: 0,
      averageScore: 100,
      isPremium: isSuper,
    };

    setCurrentUser(newProfile);
    setActiveGradeState(newProfile.grade);
    setHasCompletedOnboarding(true);
    localStorage.setItem('app_onboarding_completed', 'true');
    localStorage.setItem('app_user_profile', JSON.stringify(newProfile));
    await FirebaseService.syncUserProfile(newProfile);
  };

  const login = async (email: string, password: string) => {
    const trimmedEmail = email.trim();
    const isSuper = trimmedEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

    if (isSuper) {
      if (isFirebaseConfigured && password) {
        try {
          await signInWithEmailAndPassword(auth, trimmedEmail, password);
        } catch (err) {
          console.warn('Super Admin direct login note:', err);
        }
      }
      setCurrentUser(DEFAULT_SUPER_ADMIN_PROFILE);
      setActiveGradeState(DEFAULT_SUPER_ADMIN_PROFILE.grade);
      setHasCompletedOnboarding(true);
      localStorage.setItem('app_onboarding_completed', 'true');
      localStorage.setItem('app_user_profile', JSON.stringify(DEFAULT_SUPER_ADMIN_PROFILE));
      return;
    }

    if (isFirebaseConfigured) {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const uid = userCredential.user.uid;
      const savedProfile = localStorage.getItem('app_user_profile');
      let loadedProfile: UserProfile | null = null;
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.email?.toLowerCase() === trimmedEmail.toLowerCase()) {
            loadedProfile = parsed;
          }
        } catch {}
      }
      if (!loadedProfile) {
        loadedProfile = {
          ...DEFAULT_STUDENT_PROFILE,
          id: uid,
          email: trimmedEmail,
          name: userCredential.user.displayName || trimmedEmail.split('@')[0],
        };
      }
      setCurrentUser(loadedProfile);
      setActiveGradeState(loadedProfile.grade);
      setHasCompletedOnboarding(true);
      localStorage.setItem('app_onboarding_completed', 'true');
      localStorage.setItem('app_user_profile', JSON.stringify(loadedProfile));
    } else {
      const profile: UserProfile = {
        ...DEFAULT_STUDENT_PROFILE,
        email: trimmedEmail,
        name: trimmedEmail.split('@')[0],
      };
      setCurrentUser(profile);
      setActiveGradeState(profile.grade);
      setHasCompletedOnboarding(true);
      localStorage.setItem('app_onboarding_completed', 'true');
      localStorage.setItem('app_user_profile', JSON.stringify(profile));
    }
  };

  const resetPassword = async (email: string) => {
    const trimmedEmail = email.trim();
    if (isFirebaseConfigured) {
      await sendPasswordResetEmail(auth, trimmedEmail);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      try {
        await fbSignOut(auth);
      } catch {}
    }
    setCurrentUser(DEFAULT_STUDENT_PROFILE);
    setHasCompletedOnboarding(false);
    localStorage.removeItem('app_onboarding_completed');
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
        isAuthenticated,
        authLoading,
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
        register,
        login,
        resetPassword,
        logout,
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
