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

const createDefaultStudentProfile = (u: User, grade: GradeLevel = 9): UserProfile => {
  const isSuper =
    (u.email && isSuperAdminEmailAddress(u.email)) ||
    (u.phoneNumber && (u.phoneNumber === '0910097862' || u.phoneNumber.endsWith('7862')));
  return {
    id: u.uid,
    name: u.displayName || u.email?.split('@')[0] || (isSuper ? 'Nuriye Ahmed Adem' : 'ተማሪ (Student)'),
    email: u.email || '',
    role: isSuper ? 'super_admin' : 'student',
    grade,
    isGradeLocked: !isSuper,
    enrolledAt: new Date().toISOString().split('T')[0],
    xp: 0,
    streakDays: 1,
    completedLessonsCount: 0,
    quizzesTakenCount: 0,
    averageScore: 0,
    isPremium: Boolean(isSuper),
    streakFreezeAvailable: true,
    streakFreezeActive: false,
    gracePeriodActive: false,
    unlockedBadges: [],
    dailyQuizzesPassed: 0,
    stemExperimentsCompleted: 0,
    eueeHighScore: 0,
    completedLessonIds: [],
  };
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

export const isSuperAdminEmailAddress = (email?: string | null): boolean => {
  const e = (email || '').toLowerCase().trim();
  return e === 'mejennur669@gmail.com' || e === 'abuzinad7862@gmail.com';
};

export const checkIsSuperAdmin = (email?: string | null, phone?: string | null, role?: string | null): boolean => {
  const e = (email || '').toLowerCase().trim();
  const p = (phone || '').trim();
  const r = (role || '').toLowerCase().trim();
  return (
    isSuperAdminEmailAddress(e) ||
    p === '0910097862' ||
    p.endsWith('7862') ||
    r === 'super_admin' ||
    r === 'admin'
  );
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeProfile = (id: string, d: any): UserProfile => {
  const isSuperAdminEmail = checkIsSuperAdmin(d.email, d.phone, d.role);
  let resolvedRole: UserProfile['role'] = 'student';
  if (isSuperAdminEmail || d.role === 'super_admin' || d.role === 'admin') {
    resolvedRole = 'super_admin';
  } else if (d.role === 'teacher') {
    resolvedRole = 'teacher';
  } else if (d.role === 'parent') {
    resolvedRole = 'parent';
  }

  return {
    ...d,
    id,
    name: String(d.name || (isSuperAdminEmail ? 'Nuriye Ahmed Adem' : '')),
    email: String(d.email || (isSuperAdminEmail ? 'mejennur669@gmail.com' : '')),
    role: resolvedRole,
    grade: ([9, 10, 11, 12].includes(Number(d.grade)) ? Number(d.grade) : 9) as GradeLevel,
    isGradeLocked: isSuperAdminEmail ? false : d.isGradeLocked === true,
    xp: Number(d.xp) || 0,
    streakDays: Number(d.streakDays) || 0,
    completedLessonsCount: Number(d.completedLessonsCount) || 0,
    quizzesTakenCount: Number(d.quizzesTakenCount) || 0,
    averageScore: Number(d.averageScore) || 0,
    isPremium: isSuperAdminEmail ? true : d.isPremium === true,
    premiumExpiresAt: isSuperAdminEmail ? undefined : d.premiumExpiresAt,
    hasPremiumLearning: isSuperAdminEmail ? true : d.hasPremiumLearning === true,
    premiumLearningExpiresAt: isSuperAdminEmail ? undefined : d.premiumLearningExpiresAt,
    completedLessonIds: Array.isArray(d.completedLessonIds) ? d.completedLessonIds : [],
  };
};

const OFFLINE_PROFILE_CACHE_KEY = 'nur_offline_user_profile_v1';

const saveOfflineProfile = (p: UserProfile) => {
  try {
    localStorage.setItem(OFFLINE_PROFILE_CACHE_KEY, JSON.stringify(p));
  } catch {
    // Ignore storage quota errors
  }
};

const loadOfflineProfile = (uid: string): UserProfile | null => {
  try {
    const raw = localStorage.getItem(OFFLINE_PROFILE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    if (parsed && parsed.id === uid) return parsed;
  } catch {
    // Ignore parse errors
  }
  return null;
};

const clearOfflineProfile = () => {
  try {
    localStorage.removeItem(OFFLINE_PROFILE_CACHE_KEY);
  } catch {
    // Ignore storage errors
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeGrade, setActiveGradeState] = useState<GradeLevel>(9);
  const registrationInFlightRef = React.useRef<string | null>(null);

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

  // 2) Follow the signed-in user's Firestore profile (single canonical source of truth at users/{auth.uid}).
  useEffect(() => {
    if (!firebaseUser) return;
    const cached = loadOfflineProfile(firebaseUser.uid);
    if (cached) {
      setProfile(cached);
      setAuthLoading(false);
    } else {
      setAuthLoading(true);
    }
    return onSnapshot(
      doc(db, 'users', firebaseUser.uid),
      (snap) => {
        if (snap.exists()) {
          const norm = normalizeProfile(snap.id, snap.data());
          setProfile(norm);
          saveOfflineProfile(norm);
          // If the authenticated user is super admin but their Firestore document doesn't reflect it,
          // upgrade the Firestore doc so security rules pass.
          if (norm.role === 'super_admin' && snap.data()?.role !== 'super_admin') {
            setDoc(doc(db, 'users', firebaseUser.uid), { role: 'super_admin', isPremium: true }, { merge: true }).catch(() => {});
          }
        } else {
          // If a registration is currently in-flight, avoid writing an empty default profile with grade 9
          if (registrationInFlightRef.current === firebaseUser.email) {
            setAuthLoading(false);
            return;
          }
          const def = createDefaultStudentProfile(firebaseUser, activeGrade);
          setProfile((prev) => prev ?? def);
          saveOfflineProfile(def);
          // Create the Firestore doc if missing using merge: true to avoid overwriting existing fields
          setDoc(doc(db, 'users', firebaseUser.uid), def, { merge: true }).catch((err) => {
            console.warn('Profile creation notice:', err);
          });
        }
        setAuthLoading(false);
      },
      (err) => {
        console.warn('Profile listener notice:', err);
        setProfile((prev) => prev ?? cached ?? createDefaultStudentProfile(firebaseUser, activeGrade));
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
    checkIsSuperAdmin(currentUser.email, (currentUser as any).phone, profile?.role) ||
    checkIsSuperAdmin(firebaseUser?.email, firebaseUser?.phoneNumber, profile?.role);
  const isGradeLocked = !isSuperAdmin;

  const setActiveGrade = (grade: GradeLevel) => {
    if (isSuperAdmin) {
      setActiveGradeState(grade);
    } else {
      console.warn('Student grade is locked. Grade change blocked.');
    }
  };

  const register = useCallback(async ({ name, email, password, grade }: RegisterParams) => {
    const cleanEmail = email.trim();
    registrationInFlightRef.current = cleanEmail;
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const isSuper = checkIsSuperAdmin(cred.user.email || cleanEmail, null);
      const assignedRole = isSuper ? 'super_admin' : 'student';

      const newProfile: UserProfile = {
        id: cred.user.uid,
        name: name.trim(),
        email: cred.user.email || cleanEmail,
        role: assignedRole,
        grade,
        isGradeLocked: !isSuper,
        enrolledAt: new Date().toISOString().split('T')[0],
        xp: 0,
        streakDays: 1,
        completedLessonsCount: 0,
        quizzesTakenCount: 0,
        averageScore: 0,
        isPremium: isSuper,
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

      await setDoc(
        doc(db, 'users', cred.user.uid),
        {
          id: cred.user.uid,
          uid: cred.user.uid,
          name: name.trim(),
          email: cred.user.email || cleanEmail,
          role: assignedRole,
          grade,
          isGradeLocked: !isSuper,
          enrolledAt: new Date().toISOString().split('T')[0],
          xp: 0,
          streakDays: 1,
          completedLessonsCount: 0,
          quizzesTakenCount: 0,
          averageScore: 0,
          isPremium: isSuper,
          streakFreezeAvailable: true,
          streakFreezeActive: false,
          gracePeriodActive: false,
          unlockedBadges: [],
          dailyQuizzesPassed: 0,
          stemExperimentsCompleted: 0,
          eueeHighScore: 0,
          completedLessonIds: [],
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error('Firestore user profile write notice:', err);
      throw err;
    } finally {
      registrationInFlightRef.current = null;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const logout = useCallback(async () => {
    clearOfflineProfile();
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
