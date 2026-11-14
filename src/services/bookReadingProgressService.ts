import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../firebase';

export type TextbookSectionTab =
  | 'theory'
  | 'examples'
  | 'activities'
  | 'experiments'
  | 'exercises'
  | 'supplementary';

export type BookReaderMode = 'breakdown' | 'secure_reader';

export interface TextbookReadingProgress {
  bookId: string;
  grade: number;
  bookTitle: string;
  chapterIdx: number;
  unitNumber: number;
  chapterTitle: string;
  tab: TextbookSectionTab;
  pageNumber: number;
  totalPages: number;
  scrollTop?: number;
  readerMode: BookReaderMode;
  updatedAt: string;
}

export interface SupplementaryReadingProgress {
  bookId: string;
  bookTitle: string;
  series: string;
  chapterNumber: number;
  chapterTitle: string;
  expandedExercise: number | null;
  scrollTop?: number;
  updatedAt: string;
}

export interface AllBookReadingState {
  lastTextbookId?: string;
  textbooks: Record<string, TextbookReadingProgress>;
  lastSupplementaryId?: string;
  supplementary: Record<string, SupplementaryReadingProgress>;
}

const STORAGE_PREFIX = 'nur_book_reading_progress_v1_';
const PENDING_AUTO_RESUME_KEY = 'nur_book_pending_auto_resume';

let pendingCloudSyncTimer: ReturnType<typeof setTimeout> | null = null;

function storageKey(userId?: string): string {
  const safeId = (userId || 'guest').trim() || 'guest';
  return `${STORAGE_PREFIX}${safeId}`;
}

function emptyState(): AllBookReadingState {
  return {
    textbooks: {},
    supplementary: {},
  };
}

export function loadBookReadingState(userId?: string): AllBookReadingState {
  if (typeof window === 'undefined') return emptyState();
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<AllBookReadingState>;
    return {
      lastTextbookId: typeof parsed.lastTextbookId === 'string' ? parsed.lastTextbookId : undefined,
      textbooks: parsed.textbooks && typeof parsed.textbooks === 'object' ? parsed.textbooks : {},
      lastSupplementaryId:
        typeof parsed.lastSupplementaryId === 'string' ? parsed.lastSupplementaryId : undefined,
      supplementary:
        parsed.supplementary && typeof parsed.supplementary === 'object' ? parsed.supplementary : {},
    };
  } catch {
    return emptyState();
  }
}

function persistLocalState(userId: string | undefined, state: AllBookReadingState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

function scheduleCloudSync(userId: string | undefined, state: AllBookReadingState): void {
  if (!userId || !isFirebaseConfigured) return;
  const uid = auth.currentUser?.uid;
  if (!uid || uid !== userId) return;

  if (pendingCloudSyncTimer) {
    clearTimeout(pendingCloudSyncTimer);
  }

  pendingCloudSyncTimer = setTimeout(() => {
    pendingCloudSyncTimer = null;
    const progressRef = doc(db, 'users', uid, 'progress', 'book_reading');
    setDoc(
      progressRef,
      {
        ...state,
        syncedAt: new Date().toISOString(),
      },
      { merge: true }
    ).catch(() => {
      // Silently ignore offline/transient errors; localStorage already has latest state
    });
  }, 800);
}

function mergeStates(local: AllBookReadingState, remote: AllBookReadingState): AllBookReadingState {
  const mergedTextbooks: Record<string, TextbookReadingProgress> = { ...local.textbooks };
  for (const [bookId, remoteItem] of Object.entries(remote.textbooks || {})) {
    const localItem = mergedTextbooks[bookId];
    if (!localItem || (remoteItem.updatedAt || '') > (localItem.updatedAt || '')) {
      mergedTextbooks[bookId] = remoteItem;
    }
  }

  const mergedSupp: Record<string, SupplementaryReadingProgress> = { ...local.supplementary };
  for (const [bookId, remoteItem] of Object.entries(remote.supplementary || {})) {
    const localItem = mergedSupp[bookId];
    if (!localItem || (remoteItem.updatedAt || '') > (localItem.updatedAt || '')) {
      mergedSupp[bookId] = remoteItem;
    }
  }

  // Determine most recently updated textbook / supplementary book
  let lastTextbookId = local.lastTextbookId || remote.lastTextbookId;
  let newestTextbookTs = '';
  for (const [bookId, item] of Object.entries(mergedTextbooks)) {
    if ((item.updatedAt || '') >= newestTextbookTs) {
      newestTextbookTs = item.updatedAt || '';
      lastTextbookId = bookId;
    }
  }

  let lastSupplementaryId = local.lastSupplementaryId || remote.lastSupplementaryId;
  let newestSuppTs = '';
  for (const [bookId, item] of Object.entries(mergedSupp)) {
    if ((item.updatedAt || '') >= newestSuppTs) {
      newestSuppTs = item.updatedAt || '';
      lastSupplementaryId = bookId;
    }
  }

  return {
    lastTextbookId,
    textbooks: mergedTextbooks,
    lastSupplementaryId,
    supplementary: mergedSupp,
  };
}

export async function syncBookReadingProgressFromCloud(
  userId?: string
): Promise<AllBookReadingState> {
  const local = loadBookReadingState(userId);
  if (!userId || !isFirebaseConfigured) return local;
  const uid = auth.currentUser?.uid;
  if (!uid || uid !== userId) return local;

  try {
    const progressRef = doc(db, 'users', uid, 'progress', 'book_reading');
    const snap = await getDoc(progressRef);
    if (!snap.exists()) return local;
    const remote = snap.data() as Partial<AllBookReadingState>;
    const normalizedRemote: AllBookReadingState = {
      lastTextbookId: typeof remote.lastTextbookId === 'string' ? remote.lastTextbookId : undefined,
      textbooks: remote.textbooks && typeof remote.textbooks === 'object' ? remote.textbooks : {},
      lastSupplementaryId:
        typeof remote.lastSupplementaryId === 'string' ? remote.lastSupplementaryId : undefined,
      supplementary:
        remote.supplementary && typeof remote.supplementary === 'object' ? remote.supplementary : {},
    };
    const merged = mergeStates(local, normalizedRemote);
    persistLocalState(userId, merged);
    return merged;
  } catch {
    return local;
  }
}

export function saveTextbookProgress(
  userId: string | undefined,
  progress: Omit<TextbookReadingProgress, 'updatedAt'> & { updatedAt?: string }
): AllBookReadingState {
  const state = loadBookReadingState(userId);
  const entry: TextbookReadingProgress = {
    ...progress,
    updatedAt: progress.updatedAt || new Date().toISOString(),
  };

  const nextState: AllBookReadingState = {
    ...state,
    lastTextbookId: entry.bookId,
    textbooks: {
      ...state.textbooks,
      [entry.bookId]: entry,
    },
  };

  persistLocalState(userId, nextState);
  if (typeof window !== 'undefined' && entry.pageNumber > 0) {
    try {
      localStorage.setItem(`nur_last_read_${entry.bookId}`, String(entry.pageNumber));
    } catch {
      // ignore
    }
  }
  scheduleCloudSync(userId, nextState);
  return nextState;
}

export function getTextbookProgress(
  userId: string | undefined,
  bookId: string
): TextbookReadingProgress | null {
  const state = loadBookReadingState(userId);
  if (state.textbooks[bookId]) {
    return state.textbooks[bookId];
  }
  // Legacy fallback check for `nur_last_read_${bookId}`
  if (typeof window !== 'undefined') {
    const legacy = localStorage.getItem(`nur_last_read_${bookId}`);
    if (legacy) {
      const pageNum = parseInt(legacy, 10);
      if (!Number.isNaN(pageNum) && pageNum > 0) {
        return {
          bookId,
          grade: 9,
          bookTitle: '',
          chapterIdx: 0,
          unitNumber: 1,
          chapterTitle: '',
          tab: 'theory',
          pageNumber: pageNum,
          totalPages: 0,
          readerMode: 'secure_reader',
          updatedAt: new Date(0).toISOString(),
        };
      }
    }
  }
  return null;
}

export const SUPPLEMENTARY_ELIGIBLE_GRADES: Record<string, number[]> = {
  'supp-extreme-math': [11, 12],
  'supp-extreme-phys': [11, 12],
  'supp-extreme-chem': [11, 12],
  'supp-alpha-workbook': [12],
  'supp-galaxy-bank': [12],
};

export function isSupplementaryBookEligibleForGrade(
  bookId: string,
  grade: number,
  isSuperAdmin = false
): boolean {
  if (isSuperAdmin) return true;
  const allowed = SUPPLEMENTARY_ELIGIBLE_GRADES[bookId];
  if (!allowed) return false;
  return allowed.includes(grade);
}

export function getLastReadTextbook(
  userId: string | undefined,
  preferredGrade?: number,
  strictGrade = false
): TextbookReadingProgress | null {
  const state = loadBookReadingState(userId);
  if (state.lastTextbookId && state.textbooks[state.lastTextbookId]) {
    const last = state.textbooks[state.lastTextbookId];
    if (!preferredGrade || last.grade === preferredGrade) {
      return last;
    }
  }

  const all = Object.values(state.textbooks).sort((a, b) =>
    (b.updatedAt || '').localeCompare(a.updatedAt || '')
  );
  if (preferredGrade) {
    const gradeMatch = all.find((item) => item.grade === preferredGrade);
    if (gradeMatch) return gradeMatch;
    if (strictGrade) return null;
  }
  return all[0] || null;
}

export function saveSupplementaryProgress(
  userId: string | undefined,
  progress: Omit<SupplementaryReadingProgress, 'updatedAt'> & { updatedAt?: string }
): AllBookReadingState {
  const state = loadBookReadingState(userId);
  const entry: SupplementaryReadingProgress = {
    ...progress,
    updatedAt: progress.updatedAt || new Date().toISOString(),
  };

  const nextState: AllBookReadingState = {
    ...state,
    lastSupplementaryId: entry.bookId,
    supplementary: {
      ...state.supplementary,
      [entry.bookId]: entry,
    },
  };

  persistLocalState(userId, nextState);
  scheduleCloudSync(userId, nextState);
  return nextState;
}

export function getLastReadSupplementary(
  userId: string | undefined
): SupplementaryReadingProgress | null {
  const state = loadBookReadingState(userId);
  if (state.lastSupplementaryId && state.supplementary[state.lastSupplementaryId]) {
    return state.supplementary[state.lastSupplementaryId];
  }
  const all = Object.values(state.supplementary).sort((a, b) =>
    (b.updatedAt || '').localeCompare(a.updatedAt || '')
  );
  return all[0] || null;
}

export function requestAutoResumeTextbook(bookId: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(PENDING_AUTO_RESUME_KEY, bookId);
  } catch {
    // ignore
  }
}

export function consumeAutoResumeTextbook(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = sessionStorage.getItem(PENDING_AUTO_RESUME_KEY);
    if (val) {
      sessionStorage.removeItem(PENDING_AUTO_RESUME_KEY);
    }
    return val;
  } catch {
    return null;
  }
}

export function computeReadingPercent(pageNumber: number, totalPages: number): number {
  if (!totalPages || totalPages <= 0) return 0;
  return Math.min(100, Math.max(1, Math.round((pageNumber / totalPages) * 100)));
}
