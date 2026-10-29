import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  deleteUser,
  User,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, increment, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { GradeLevel, UserProfile } from '../types';

interface RegisterParams {
  name: string;
  email: string;
  password: string;
  grade: GradeLevel;
}

interface AuthContextType {
  /** Always defined so existing screens keep working; it is a blank guest profile when signed out. */
  currentUser: UserProfile;
  isAuthenticated: boolean;
  authLoading: boolean;
  activeGrade: GradeLevel;
  setActiveGrade: (grade: GradeLevel) => void;
  isSuperAdmin: boolean;
  isGradeLocked: boolean;
  register: (p: RegisterParams) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserXP: (additionalXP: number) => void;
  markLessonCompleted: (lessonId: string) => void;
  completedLessons: string[];
}

const GUEST_PROFILE: UserProfile = {
  id: 'guest',
  name: 'እንግዳ (Guest)',
  email: '',
  role: 'student',
  grade: 9,
  isGradeLocked: true,
  enrolledAt: '',
  xp: 0,
  streakDays: 0,
  completedLessonsCount: 0,
  quizzesTakenCount: 0,
  averageScore: 0,
  isPremium: false,
};

const MAX_XP_PER_WRITE = 500; // mirrors firestore.rules

/** Friendly Amharic/English messages for Firebase auth errors. */
export function authErrorMessage(err: any): string {
  switch (err?.code) {
    case 'auth/invalid-email':
      return 'ኢሜይሉ ትክክል አይደለም / Invalid email address.';
    case 'auth/missing-password':
    case 'auth/weak-password':
      return 'የይለፍ ቃል ቢያንስ 6 ቁምፊ መሆን አለበት / Password must be at least 6 characters.';
    case 'auth/email-already-in-use':
      return 'ይህ ኢሜይል ቀድሞ ተመዝግቧል / This email is already registered.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'ኢሜይል ወይም የይለፍ ቃል ትክክል አይደለም / Wrong email or password.';
    case 'auth/too-many-requests':
      return 'ብዙ ሙከራ ተደርጓል፣ ቆይተው ይሞክሩ / Too many attempts, try again later.';
    case 'auth/network-request-failed':
      return 'የኢንተርኔት ግንኙነት ችግር / Network error. Check your connection.';
    case 'permission-denied':
      return 'ፈቃድ የለም / Permission denied.';
    default:
      return 'ያልታወቀ ችግር ተፈጥሯል፣ እንደገና ይሞክሩ / Something went wrong, please try again.';
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeGrade, setActiveGradeState] = useState<GradeLevel>(9);

  // 1) Follow the Firebase Auth session.
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (!user) {
        setProfile(null);
        setAuthLoading(false);
      }
    });
  }, []);

  // 2) Follow the signed-in user's Firestore profile (single source of truth).
  useEffect(() => {
    if (!firebaseUser) return;
    setAuthLoading(true);
    return onSnapshot(
      doc(db, 'users', firebaseUser.uid),
      (snap) => {
        setProfile(snap.exists() ? ({ ...(snap.data() as UserProfile), id: snap.id }) : null);
        setAuthLoading(false);
      },
      (err) => {
        console.error('Profile listener error:', err);
        setProfile(null);
        setAuthLoading(false);
      }
    );
  }, [firebaseUser?.uid]);

  // Students are locked to their registered grade; admins start there but may switch.
  useEffect(() => {
    if (profile) setActiveGradeState(profile.grade);
  }, [profile?.id, profile?.grade]);

  const isAuthenticated = Boolean(firebaseUser && profile);
  const currentUser = profile ?? GUEST_PROFILE;
  const isSuperAdmin = profile?.role === 'super_admin';
  const isGradeLocked = !isSuperAdmin;

  const setActiveGrade = (grade: GradeLevel) => {
    if (isSuperAdmin) setActiveGradeState(grade);
    else console.warn('Student grade is locked. Grade change blocked.');
  };

  const register = useCallback(async ({ name, email, password, grade }: RegisterParams) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    try {
      await updateProfile(cred.user, { displayName: name.trim() });
      await setDoc(doc(db, 'users', cred.user.uid), {
        id: cred.user.uid,
        name: name.trim(),
        email: cred.user.email,
        role: 'student',
        grade,
        isGradeLocked: true,
        enrolledAt: new Date().toISOString().split('T')[0],
        xp: 0,
        streakDays: 0,
        completedLessonsCount: 0,
        quizzesTakenCount: 0,
        averageScore: 0,
        isPremium: false,
        completedLessonIds: [],
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      // Don't leave an auth account without a profile behind.
      await deleteUser(cred.user).catch(() => {});
      throw err;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  }, []);

  const updateUserXP = (additionalXP: number) => {
    if (!firebaseUser || !profile) return;
    const amount = Math.max(0, Math.min(MAX_XP_PER_WRITE, Math.floor(additionalXP)));
    if (amount === 0) return;
    updateDoc(doc(db, 'users', firebaseUser.uid), { xp: increment(amount) }).catch((e) =>
      console.error('XP update failed:', e)
    );
  };

  const completedLessons = profile?.completedLessonIds ?? [];

  const markLessonCompleted = (lessonId: string) => {
    if (!firebaseUser || !profile || completedLessons.includes(lessonId)) return;
    updateDoc(doc(db, 'users', firebaseUser.uid), {
      completedLessonIds: arrayUnion(lessonId),
      completedLessonsCount: increment(1),
      xp: increment(100),
    }).catch((e) => console.error('Lesson completion failed:', e));
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
        register,
        login,
        logout,
        resetPassword,
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
