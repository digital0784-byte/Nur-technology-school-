import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
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
  completedUnits: string[];
  markUnitCompleted: (unitId: string) => void;
  toggleStreakFreeze: () => void;
  activateGracePeriod: () => void;
  unlockBadge: (badgeKey: string) => void;
}

const INITIAL_GUEST_PROFILE: UserProfile = {
  id: 'guest',
  name: 'እንግዳ (Guest)',
  email: '',
  role: 'student',
  grade: 9,
  isGradeLocked: true,
  enrolledAt: '2026-09-01',
  xp: 0,
  streakDays: 0,
  completedLessonsCount: 0,
  quizzesTakenCount: 0,
  averageScore: 0,
  isPremium: false,
  streakFreezeAvailable: false,
  streakFreezeActive: false,
  gracePeriodActive: false,
  unlockedBadges: [],
  dailyQuizzesPassed: 0,
  stemExperimentsCompleted: 0,
  eueeHighScore: 0,
  completedUnits: [],
};

const createDefaultStudentProfile = (u: User, grade: GradeLevel = 9): UserProfile => ({
  id: u.uid,
  name: u.displayName || u.email?.split('@')[0] || 'ተማሪ (Student)',
  email: u.email || '',
  role: 'student',
  grade,
  isGradeLocked: true,
  enrolledAt: new Date().toISOString().split('T')[0],
  xp: 0,
  streakDays: 1,
  completedLessonsCount: 0,
  quizzesTakenCount: 0,
  averageScore: 0,
  isPremium: false,
  streakFreezeAvailable: true,
  streakFreezeActive: false,
  gracePeriodActive: false,
  unlockedBadges: [],
  dailyQuizzesPassed: 0,
  stemExperimentsCompleted: 0,
  eueeHighScore: 0,
  completedLessonIds: [],
});

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

const normalizeProfile = (id: string, d: any): UserProfile => {
  const isSuperAdminEmail =
    d.email === 'mejennur669@gmail.com' ||
    d.phone === '0910097862' ||
    d.role === 'super_admin';
  return {
    ...d,
    id,
    name: String(d.name || (isSuperAdminEmail ? 'Nuriye Ahmed Adem' : '')),
    email: String(d.email || (isSuperAdminEmail ? 'mejennur669@gmail.com' : '')),
    role: isSuperAdminEmail ? 'super_admin' : 'student',
    grade: ([9, 10, 11, 12].includes(Number(d.grade)) ? Number(d.grade) : 9) as GradeLevel,
    isGradeLocked: isSuperAdminEmail ? false : d.isGradeLocked === true,
    xp: Number(d.xp) || 0,
    streakDays: Number(d.streakDays) || 0,
    completedLessonsCount: Number(d.completedLessonsCount) || 0,
    quizzesTakenCount: Number(d.quizzesTakenCount) || 0,
    averageScore: Number(d.averageScore) || 0,
    isPremium: isSuperAdminEmail ? true : d.isPremium === true,
    completedLessonIds: Array.isArray(d.completedLessonIds) ? d.completedLessonIds : [],
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeGrade, setActiveGradeState] = useState<GradeLevel>(9);

  const [guestProfile, setGuestProfile] = useState<UserProfile>(INITIAL_GUEST_PROFILE);

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
        if (snap.exists()) {
          setProfile(normalizeProfile(snap.id, snap.data()));
        } else {
          setProfile((prev) => prev ?? createDefaultStudentProfile(firebaseUser, activeGrade));
        }
        setAuthLoading(false);
      },
      (err) => {
        console.warn('Profile listener notice:', err);
        setProfile((prev) => prev ?? createDefaultStudentProfile(firebaseUser, activeGrade));
        setAuthLoading(false);
      }
    );
  }, [firebaseUser?.uid]);

  // Students are locked to their registered grade; admins start there but may switch.
  useEffect(() => {
    if (profile) setActiveGradeState(profile.grade);
    else if (guestProfile) setActiveGradeState(guestProfile.grade);
  }, [profile?.id, profile?.grade, guestProfile?.grade]);

  const isAuthenticated = Boolean(firebaseUser);
  const currentUser = profile ?? (firebaseUser ? createDefaultStudentProfile(firebaseUser, activeGrade) : guestProfile);
  const isSuperAdmin =
    profile?.role === 'super_admin' ||
    currentUser.email === 'mejennur669@gmail.com' ||
    (currentUser as any).phone === '0910097862';
  const isGradeLocked = !isSuperAdmin;

  const setActiveGrade = (grade: GradeLevel) => {
    if (isSuperAdmin) {
      setActiveGradeState(grade);
    } else {
      console.warn('Student grade is locked. Grade change blocked.');
    }
  };

  const register = useCallback(async ({ name, email, password, grade }: RegisterParams) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const newProfile: UserProfile = {
      id: cred.user.uid,
      name: name.trim(),
      email: cred.user.email || email.trim(),
      role: 'student',
      grade,
      isGradeLocked: true,
      enrolledAt: new Date().toISOString().split('T')[0],
      xp: 0,
      streakDays: 1,
      completedLessonsCount: 0,
      quizzesTakenCount: 0,
      averageScore: 0,
      isPremium: false,
      streakFreezeAvailable: true,
      streakFreezeActive: false,
      gracePeriodActive: false,
      unlockedBadges: [],
      dailyQuizzesPassed: 0,
      stemExperimentsCompleted: 0,
      eueeHighScore: 0,
      completedLessonIds: [],
    };
    setProfile(newProfile);
    setActiveGradeState(grade);

    try {
      await updateProfile(cred.user, { displayName: name.trim() });
    } catch (e) {
      console.warn('Could not update Auth displayName:', e);
    }

    try {
      await setDoc(doc(db, 'users', cred.user.uid), {
        id: cred.user.uid,
        uid: cred.user.uid,
        name: name.trim(),
        email: cred.user.email || email.trim(),
        role: 'student',
        grade,
        isGradeLocked: true,
        enrolledAt: new Date().toISOString().split('T')[0],
        xp: 0,
        streakDays: 1,
        completedLessonsCount: 0,
        quizzesTakenCount: 0,
        averageScore: 0,
        isPremium: false,
        streakFreezeAvailable: true,
        streakFreezeActive: false,
        gracePeriodActive: false,
        unlockedBadges: [],
        dailyQuizzesPassed: 0,
        stemExperimentsCompleted: 0,
        eueeHighScore: 0,
        completedLessonIds: [],
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Firestore user profile write notice:', err);
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
    const amount = Math.max(0, Math.min(MAX_XP_PER_WRITE, Math.floor(additionalXP)));
    if (amount === 0) return;

    if (firebaseUser && profile) {
      updateDoc(doc(db, 'users', firebaseUser.uid), { xp: increment(amount) }).catch((e) =>
        console.error('XP update failed:', e)
      );
    } else {
      setGuestProfile((prev) => ({
        ...prev,
        xp: prev.xp + amount,
      }));
    }
  };

  const completedLessons = (profile?.completedLessonIds ?? guestProfile.completedLessonIds) || [];

  const markLessonCompleted = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) return;

    if (firebaseUser && profile) {
      updateDoc(doc(db, 'users', firebaseUser.uid), {
        completedLessonIds: arrayUnion(lessonId),
        completedLessonsCount: increment(1),
        xp: increment(20), // Reading a full lesson: +20 XP
      }).catch((e) => console.error('Lesson completion failed:', e));
    } else {
      setGuestProfile((prev) => ({
        ...prev,
        completedLessonIds: [...(prev.completedLessonIds || []), lessonId],
        completedLessonsCount: prev.completedLessonsCount + 1,
        xp: prev.xp + 20, // +20 XP
      }));
    }
  };

  const toggleStreakFreeze = () => {
    if (firebaseUser && profile) {
      const nextVal = !profile.streakFreezeActive;
      updateDoc(doc(db, 'users', firebaseUser.uid), {
        streakFreezeActive: nextVal,
      }).catch((e) => console.error('Streak freeze update failed:', e));
    } else {
      setGuestProfile((prev) => ({
        ...prev,
        streakFreezeActive: !prev.streakFreezeActive,
      }));
    }
  };

  const activateGracePeriod = () => {
    if (firebaseUser && profile) {
      updateDoc(doc(db, 'users', firebaseUser.uid), {
        gracePeriodActive: true,
        streakDays: increment(1),
      }).catch((e) => console.error('Grace period update failed:', e));
    } else {
      setGuestProfile((prev) => ({
        ...prev,
        gracePeriodActive: true,
        streakDays: prev.streakDays + 1,
      }));
    }
  };

  const unlockBadge = (badgeKey: string) => {
    if (firebaseUser && profile) {
      updateDoc(doc(db, 'users', firebaseUser.uid), {
        unlockedBadges: arrayUnion(badgeKey),
      }).catch((e) => console.error('Unlock badge update failed:', e));
    } else {
      setGuestProfile((prev) => {
        const currentBadges = prev.unlockedBadges || [];
        if (currentBadges.includes(badgeKey)) return prev;
        return {
          ...prev,
          unlockedBadges: [...currentBadges, badgeKey],
        };
      });
    }
  };

  const completedUnits = (profile?.completedUnits ?? guestProfile.completedUnits) || [];

  const markUnitCompleted = (unitId: string) => {
    if (completedUnits.includes(unitId)) return;

    if (firebaseUser && profile) {
      updateDoc(doc(db, 'users', firebaseUser.uid), {
        completedUnits: arrayUnion(unitId),
        xp: increment(100), // +100 XP for mastering an entire chapter competency unit
      }).catch((e) => console.error('Unit completion failed in firestore:', e));
    } else {
      setGuestProfile((prev) => ({
        ...prev,
        completedUnits: [...(prev.completedUnits || []), unitId],
        xp: prev.xp + 100,
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
        register,
        login,
        logout,
        resetPassword,
        updateUserXP,
        markLessonCompleted,
        completedLessons,
        completedUnits,
        markUnitCompleted,
        toggleStreakFreeze,
        activateGracePeriod,
        unlockBadge,
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
