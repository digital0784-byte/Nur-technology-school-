import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  COMPREHENSIVE_TEXTBOOKS_REGISTRY,
  getCurriculumMasterIndex,
  TextbookRecord,
  TextbookChapter,
} from '../../data/textbooksRegistry';
import { LabDiagramSvg } from './LabDiagramSvg';
import { DrmProtectedContainer } from '../common/DrmProtectedContainer';
import { AllTextbooksModal } from './AllTextbooksModal';
import { SecureBookReaderModal } from './SecureBookReaderModal';
import { SubTopicDeepDiveModal, SubTopicItem } from './SubTopicDeepDiveModal';
import { Language } from '../../types';
import { authFetch } from '../../services/apiClient';
import {
  AllBookReadingState,
  TextbookSectionTab,
  loadBookReadingState,
  syncBookReadingProgressFromCloud,
  saveTextbookProgress,
  getLastReadTextbook,
  consumeAutoResumeTextbook,
  computeReadingPercent,
} from '../../services/bookReadingProgressService';
import {
  BookOpen,
  Bookmark,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Calculator,
  Users,
  BookmarkCheck,
  Sparkles,
  Volume2,
  ChevronRight,
  Globe,
  HelpCircle,
  ArrowRight,
  Database,
  Cloud,
  ExternalLink,
  Layers,
  Search,
  ListOrdered,
  X,
  FileSpreadsheet,
  RotateCcw,
} from 'lucide-react';

type ViewMode = 'catalog_index' | 'reader';
type SectionTab = TextbookSectionTab;

export const TextbookView: React.FC = () => {
  const { currentUser, activeGrade } = useAuth();
  const { t, language } = useLanguage();

  const [readingState, setReadingState] = useState<AllBookReadingState>(() =>
    loadBookReadingState(currentUser.id)
  );

  const [viewMode, setViewMode] = useState<ViewMode>('catalog_index');
  const [selectedLanguageOverride, setSelectedLanguageOverride] = useState<Language>(language);

  // Retrieve Master Index for current grade
  const { coreSubjects, supplementaryGuides } = getCurriculumMasterIndex(activeGrade);
  const allGradeBooks = [...coreSubjects, ...supplementaryGuides];

  // Selected Book state (initialize from last read textbook for this grade if available)
  const [selectedBookId, setSelectedBookId] = useState<string>(() => {
    const initialState = loadBookReadingState(currentUser.id);
    const lastForGrade = initialState.lastTextbookId
      ? initialState.textbooks[initialState.lastTextbookId]
      : undefined;
    if (lastForGrade && lastForGrade.grade === activeGrade) {
      return lastForGrade.bookId;
    }
    return coreSubjects[0]?.id || COMPREHENSIVE_TEXTBOOKS_REGISTRY[0].id;
  });
  const currentBook: TextbookRecord =
    COMPREHENSIVE_TEXTBOOKS_REGISTRY.find((b) => b.id === selectedBookId) ||
    COMPREHENSIVE_TEXTBOOKS_REGISTRY[0];

  // Book Table of Contents Modal state (Triggered whenever a book is clicked!)
  const [isTocModalOpen, setIsTocModalOpen] = useState<boolean>(false);
  const [tocModalBook, setTocModalBook] = useState<TextbookRecord>(currentBook);

  // Secure DRM Reader and Full Library Catalog Modals
  const [isAllTextbooksModalOpen, setIsAllTextbooksModalOpen] = useState<boolean>(false);
  const [isSecureReaderOpen, setIsSecureReaderOpen] = useState<boolean>(false);
  const [secureReaderBook, setSecureReaderBook] = useState<TextbookRecord>(currentBook);
  const [secureReaderInitialPage, setSecureReaderInitialPage] = useState<number | undefined>(undefined);
  const [secureReaderInitialChapterIdx, setSecureReaderInitialChapterIdx] = useState<number>(0);
  const [deepDiveTopic, setDeepDiveTopic] = useState<{
    topic: SubTopicItem;
    unitNumber: number;
    unitTitle: string;
    book: TextbookRecord;
  } | null>(null);

  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(() => {
    const saved = loadBookReadingState(currentUser.id).textbooks[selectedBookId];
    return saved ? Math.max(0, Math.min(saved.chapterIdx, currentBook.chapters.length - 1)) : 0;
  });
  const currentChapter: TextbookChapter =
    currentBook.chapters[selectedChapterIdx] || currentBook.chapters[0];

  const [activeTab, setActiveTab] = useState<SectionTab>(() => {
    const saved = loadBookReadingState(currentUser.id).textbooks[selectedBookId];
    return saved?.tab || 'theory';
  });
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [aiAnalysisError, setAiAnalysisError] = useState<boolean>(false);
  const [lastAnalysisPrompt, setLastAnalysisPrompt] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Reload & sync cloud progress on user change or mount, and handle Dashboard auto-resume
  useEffect(() => {
    const local = loadBookReadingState(currentUser.id);
    setReadingState(local);

    const pendingBookId = consumeAutoResumeTextbook();
    if (pendingBookId) {
      const targetBook = COMPREHENSIVE_TEXTBOOKS_REGISTRY.find((b) => b.id === pendingBookId);
      const saved = local.textbooks[pendingBookId];
      if (targetBook && saved) {
        setSelectedBookId(targetBook.id);
        setSelectedChapterIdx(Math.max(0, Math.min(saved.chapterIdx, targetBook.chapters.length - 1)));
        setActiveTab(saved.tab || 'theory');
        if (saved.readerMode === 'secure_reader') {
          setSecureReaderBook(targetBook);
          setSecureReaderInitialPage(saved.pageNumber);
          setSecureReaderInitialChapterIdx(saved.chapterIdx);
          setIsSecureReaderOpen(true);
        } else {
          setViewMode('reader');
        }
      }
    }

    let cancelled = false;
    syncBookReadingProgressFromCloud(currentUser.id).then((merged) => {
      if (!cancelled) {
        setReadingState(merged);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [currentUser.id]);

  // Persist reading position whenever reading in 'reader' (breakdown) mode
  useEffect(() => {
    if (viewMode !== 'reader') return;
    const ch = currentBook.chapters[selectedChapterIdx] || currentBook.chapters[0];
    if (!ch) return;

    const updated = saveTextbookProgress(currentUser.id, {
      bookId: currentBook.id,
      grade: currentBook.grade,
      bookTitle:
        currentBook.title[selectedLanguageOverride] || currentBook.title.am || currentBook.title.en,
      chapterIdx: selectedChapterIdx,
      unitNumber: ch.unitNumber,
      chapterTitle:
        ch.title[selectedLanguageOverride] || ch.title.am || ch.title.en,
      tab: activeTab,
      pageNumber: ch.startPage,
      totalPages: currentBook.totalPages,
      readerMode: 'breakdown',
    });
    setReadingState(updated);
  }, [
    viewMode,
    currentBook.id,
    currentBook.grade,
    currentBook.totalPages,
    selectedChapterIdx,
    activeTab,
    currentUser.id,
    selectedLanguageOverride,
  ]);

  const handleOpenSecureReader = (
    book: TextbookRecord,
    chapterIdx?: number,
    explicitPage?: number
  ) => {
    const saved = readingState.textbooks[book.id];
    const targetChapterIdx =
      typeof chapterIdx === 'number' ? chapterIdx : saved?.chapterIdx ?? 0;
    const targetPage =
      typeof explicitPage === 'number'
        ? explicitPage
        : typeof chapterIdx === 'number'
        ? book.chapters[chapterIdx]?.startPage
        : saved?.pageNumber;

    setSecureReaderBook(book);
    setSecureReaderInitialChapterIdx(targetChapterIdx);
    setSecureReaderInitialPage(targetPage);
    setIsSecureReaderOpen(true);
  };

  const handleResumeTextbook = (
    book: TextbookRecord,
    modeOverride?: 'breakdown' | 'secure_reader'
  ) => {
    const saved = readingState.textbooks[book.id];
    const chIdx = saved
      ? Math.max(0, Math.min(saved.chapterIdx, book.chapters.length - 1))
      : 0;
    const targetTab: SectionTab = saved?.tab || 'theory';
    const targetMode = modeOverride || saved?.readerMode || 'breakdown';

    setSelectedBookId(book.id);
    setSelectedChapterIdx(chIdx);
    setActiveTab(targetTab);
    setAiAnalysisResult(null);

    if (targetMode === 'secure_reader') {
      handleOpenSecureReader(book, chIdx, saved?.pageNumber);
    } else {
      setViewMode('reader');
      requestAnimationFrame(() => {
        readerContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const tabLabelsAm: Record<SectionTab, string> = {
    theory: 'መማሪያ ይዘት (Theory)',
    examples: 'ምሳሌዎች (Examples)',
    activities: 'አክቲቪቲዎች (Activities)',
    experiments: 'ላቦራቶሪ (Experiments)',
    exercises: 'መልመጃዎች (Exercises)',
    supplementary: 'አጋዥ መረጃ (Supplementary)',
  };

  const lastReadForGrade = getLastReadTextbook(currentUser.id, activeGrade);
  const lastReadOverall = lastReadForGrade || getLastReadTextbook(currentUser.id);
  const lastReadBookRecord = lastReadOverall
    ? COMPREHENSIVE_TEXTBOOKS_REGISTRY.find((b) => b.id === lastReadOverall.bookId) || null
    : null;

  const langNames: Record<Language, { label: string; flag: string }> = {
    am: { label: 'አማርኛ', flag: '🇪🇹' },
    om: { label: 'Afaan Oromoo', flag: '🌳' },
    ti: { label: 'ትግርኛ', flag: '🏔️' },
    ar: { label: 'العربية', flag: '🌙' },
    so: { label: 'Soomaali', flag: '🌊' },
    en: { label: 'English', flag: '🌐' },
  };

  // Click on ANY book immediately opens its Table of Contents (ማውጫ)
  const handleBookCardClick = (book: TextbookRecord) => {
    setTocModalBook(book);
    setIsTocModalOpen(true);
  };

  // Open specific chapter and jump directly into the reader
  const handleSelectChapterFromToc = (
    book: TextbookRecord,
    chapterIdx: number,
    targetTab: SectionTab = 'theory'
  ) => {
    setSelectedBookId(book.id);
    setSelectedChapterIdx(chapterIdx);
    setActiveTab(targetTab);
    setIsTocModalOpen(false);
    setViewMode('reader');
    setAiAnalysisResult(null);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRequestVerbatimAiAnalysis = async (contentPrompt: string) => {
    setIsAnalyzing(true);
    setAiAnalysisResult(null);
    setAiAnalysisError(false);
    setLastAnalysisPrompt(contentPrompt);
    try {
      const res = await authFetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `እባክህ የሚከተለውን የክፍል ${currentBook.grade} የ${currentBook.subjectName.en} የመማሪያ መጽሐፍ ክፍል በስድስቱም ቋንቋዎች ተደራሽ በሆነ መልኩ በዝርዝር ተንትነህ አብራራልኝ:\n\n"${contentPrompt}"\n\nየመማሪያ መጽሐፉን ምሳሌዎች፣ አክቲቪቲዎች እና የላቦራቶሪ አሰራሩን አገናዝበህ አብራራ።`,
          grade: currentBook.grade,
          subject: currentBook.subjectName.en,
          unit: `Unit ${currentChapter.unitNumber}`,
          topic: currentChapter.title.en,
          language: selectedLanguageOverride,
        }),
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setAiAnalysisResult(data.reply);
      } else {
        setAiAnalysisError(true);
      }
    } catch {
      setAiAnalysisError(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredCoreSubjects = coreSubjects.filter(
    (b) =>
      b.title[selectedLanguageOverride]?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.subjectName[selectedLanguageOverride]?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.subjectCode.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/80 text-[11px] font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            Textbooks & Chapter Directory
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            የክፍል {activeGrade} አጠቃላይ የመማሪያ እና አጋዥ መጻሕፍት ማውጫ
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            እያንዳንዱ መጽሐፍ ክሊክ ሲደረግ ሙሉ ማውጫው (Table of Contents) ይከፈታል • በ6 ቋንቋዎች በዝርዝር ትንታኔ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Browse All Grades Catalog Modal Button */}
          <button
            type="button"
            onClick={() => setIsAllTextbooksModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ሁሉንም መጽሐፍት አስስ (Grades 9-12 Catalog)</span>
          </button>

          {/* Secure Reader Quick Button */}
          <button
            type="button"
            onClick={() => handleOpenSecureReader(currentBook)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>ደህንነቱ የተጠበቀ ንባብ (Secure Reader)</span>
          </button>

          {/* Main View Mode Toggle */}
          <div className="bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/10 flex items-center gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('catalog_index')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'catalog_index'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              ዝርዝር (Index)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('reader')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'reader'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              ትንታኔ (Breakdown)
            </button>
          </div>

          {/* Language Selector for Verbatim Breakdown */}
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-xs">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedLanguageOverride}
              onChange={(e) => setSelectedLanguageOverride(e.target.value as Language)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              {Object.entries(langNames).map(([code, info]) => (
                <option key={code} value={code} className="bg-slate-900 text-white">
                  {info.flag} {info.label} ({code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: MASTER CURRICULUM & TEXTBOOK CATALOG INDEX (ማውጫ) */}
      {/* ======================================================== */}
      {viewMode === 'catalog_index' && (
        <div className="space-y-8">
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="የትምህርት አይነት ወይም የመጽሐፍ ርዕስ ፈልጉ (ማንኛውንም መጽሐፍ ክሊክ ሲያደርጉ ማውጫው ይከፈታል)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                {coreSubjects.length} ይፋዊ የመማሪያ መጻሕፍት
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold">
                {supplementaryGuides.length} አጋዥ መመሪያዎች
              </span>
            </div>
          </div>

          {/* Continue Where You Left Off Banner */}
          {lastReadOverall && lastReadBookRecord && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border border-emerald-500/40 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-[11px] font-bold">
                  <Bookmark className="w-3.5 h-3.5 text-amber-300" />
                  <span>ካቆሙበት መጽሐፍ ይቀጥሉ (Continue Reading Where You Left Off)</span>
                </div>
                <h3 className="text-base sm:text-lg font-black truncate">
                  {lastReadBookRecord.title[selectedLanguageOverride] || lastReadBookRecord.title.am}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-100/90">
                  <span className="font-bold text-amber-300">
                    Grade {lastReadBookRecord.grade} • ምዕራፍ {lastReadOverall.unitNumber}
                  </span>
                  {lastReadOverall.chapterTitle && (
                    <span className="truncate max-w-md">
                      — {lastReadOverall.chapterTitle}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[11px]">
                    ገፅ {lastReadOverall.pageNumber} / {lastReadBookRecord.totalPages} (
                    {computeReadingPercent(lastReadOverall.pageNumber, lastReadBookRecord.totalPages)}%)
                  </span>
                  {lastReadOverall.readerMode === 'breakdown' && (
                    <span className="text-[11px] text-emerald-200">
                      • {tabLabelsAm[lastReadOverall.tab]}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleResumeTextbook(lastReadBookRecord)}
                  className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>ካቆሙበት ይቀጥሉ (Resume Reading)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleResumeTextbook(lastReadBookRecord, 'secure_reader')}
                  className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <span>Secure Reader (ገፅ {lastReadOverall.pageNumber})</span>
                </button>
              </div>
            </div>
          )}

          {/* Section A: Official Core Curriculum Textbooks for Enrolled Grade */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                የክፍል {activeGrade} ይፋዊ የመማሪያ መጻሕፍት (እያንዳንዱን መጽሐፍ ክሊክ በማድረግ ማውጫውን ይመልከቱ)
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Grade {activeGrade} FDRE MoE New Curriculum (2019 E.C.)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCoreSubjects.map((book) => {
                const bookProgress = readingState.textbooks[book.id];
                const bookPct = bookProgress
                  ? computeReadingPercent(bookProgress.pageNumber, book.totalPages)
                  : 0;

                return (
                <div
                  key={book.id}
                  onClick={() => handleBookCardClick(book)}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/20 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                        {book.subjectCode}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {book.totalPages} ገጾች (pp) • {book.chapters.length} ምዕራፎች
                      </span>
                    </div>

                    <div>
                      <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                        <span>{book.subjectName[selectedLanguageOverride] || book.subjectName.am}</span>
                        <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {book.title[selectedLanguageOverride] || book.title.am}
                      </p>
                    </div>

                    {bookProgress && (
                      <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                          <span className="flex items-center gap-1 truncate">
                            <Bookmark className="w-3 h-3 shrink-0" />
                            <span>
                              ያቆሙበት: ምዕራፍ {bookProgress.unitNumber} • ገፅ {bookProgress.pageNumber}
                            </span>
                          </span>
                          <span className="font-mono text-[10px]">{bookPct}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-emerald-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${bookPct}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Chapters Mini-Preview */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        የምዕራፎች ማውጫ ቅምሻ (Units Preview):
                      </span>
                      <div className="space-y-1">
                        {book.chapters.slice(0, 3).map((ch, idx) => (
                          <div
                            key={idx}
                            className="text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-between truncate bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-lg"
                          >
                            <span className="truncate">
                              {ch.unitNumber}. {ch.title[selectedLanguageOverride] || ch.title.am}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-1">
                              ገፅ {ch.startPage}
                            </span>
                          </div>
                        ))}
                        {book.chapters.length > 3 && (
                          <div className="text-[10px] text-emerald-600 font-bold px-1">
                            + {book.chapters.length - 3} ተጨማሪ ምዕራፎች...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Firebase Storage Metadata Banner */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 text-[11px] font-mono space-y-1">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1">
                          <Cloud className="w-3 h-3 text-emerald-600" />
                          Firebase Storage
                        </span>
                        <span className="text-emerald-600 font-bold text-[10px] uppercase">
                          ✓ Synced ({(book.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB)
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {book.firebaseStoragePath}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (bookProgress) {
                          handleResumeTextbook(book);
                        } else {
                          handleOpenSecureReader(book);
                        }
                      }}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>
                        {bookProgress
                          ? `ካቆሙበት ቀጥል (ገፅ ${bookProgress.pageNumber})`
                          : 'ክፈትና አንብብ (Secure Reader)'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookCardClick(book);
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1 transition-colors"
                      title="የምዕራፎች ማውጫ (Table of Contents)"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                      <span>ማውጫ</span>
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* Section B: Supplementary Books & National Exam Guides for Enrolled Grade */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-purple-600" />
                የአጋዥ መጻሕፍት እና የፈተና መመሪያዎች ማውጫ (Supplementary Guides & Exam Banks)
              </h2>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">
                MoE Verified Resources
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {supplementaryGuides.map((supp) => {
                const suppProgress = readingState.textbooks[supp.id];
                return (
                <div
                  key={supp.id}
                  onClick={() => handleBookCardClick(supp)}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 hover:ring-2 hover:ring-purple-500/20 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300">
                        {supp.category.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {supp.totalPages} pp • {supp.chapters.length} ክፍሎች
                      </span>
                    </div>

                    <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center justify-between">
                      <span>{supp.title[selectedLanguageOverride] || supp.title.am}</span>
                      <ChevronRight className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
                    </h3>

                    {suppProgress && (
                      <div className="px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-[11px] font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                        <Bookmark className="w-3 h-3 shrink-0" />
                        <span>
                          ያቆሙበት: ምዕራፍ {suppProgress.unitNumber} • ገፅ {suppProgress.pageNumber}
                        </span>
                      </div>
                    )}

                    {/* Supplementary Mini-Preview */}
                    <div className="space-y-1">
                      {supp.chapters.slice(0, 2).map((ch, idx) => (
                        <div
                          key={idx}
                          className="text-[11px] text-slate-700 dark:text-slate-300 truncate bg-purple-50/50 dark:bg-purple-950/20 px-2 py-1 rounded-lg"
                        >
                          {ch.unitNumber}. {ch.title[selectedLanguageOverride] || ch.title.am}
                        </div>
                      ))}
                    </div>

                    {/* Firebase Storage mapping */}
                    <div className="p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 text-[11px] font-mono space-y-1">
                      <div className="flex items-center justify-between text-purple-800 dark:text-purple-300">
                        <span className="flex items-center gap-1">
                          <Cloud className="w-3 h-3 text-purple-600" />
                          Firebase Storage
                        </span>
                        <span className="font-bold text-[10px]">
                          {(supp.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {supp.firebaseStoragePath}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (suppProgress) {
                          handleResumeTextbook(supp);
                        } else {
                          handleBookCardClick(supp);
                        }
                      }}
                      className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                      <span>
                        {suppProgress
                          ? `ካቆሙበት ቀጥል (ምዕራፍ ${suppProgress.unitNumber})`
                          : 'ማውጫውን ክፈት (Open Contents)'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSecureReader(supp);
                      }}
                      title="በ Secure Reader አንብብ (No Download)"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      <BookOpen className="w-4 h-4 text-purple-600" />
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: INTERACTIVE BOOK READER & 6-LANGUAGE VERBATIM HUB */}
      {/* ======================================================== */}
      {viewMode === 'reader' && (
        <div ref={readerContainerRef} className="space-y-6">
          {/* Quick Bar to Return to Master Index or Open Table of Contents Drawer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
            <button
              type="button"
              onClick={() => setViewMode('catalog_index')}
              className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5 hover:underline"
            >
              ◀ ወደ ዋናው የመማሪያ መጻሕፍት ዝርዝር ተመለስ (Back to Books Index)
            </button>

            <div className="flex flex-wrap items-center gap-2">
              {/* Table of Contents Button (Always available in reader!) */}
              <button
                type="button"
                onClick={() => handleBookCardClick(currentBook)}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5 hover:bg-emerald-100"
              >
                <ListOrdered className="w-3.5 h-3.5 text-emerald-600" />
                📑 የዚህ መጽሐፍ ሙሉ ማውጫ (Table of Contents)
              </button>

              <select
                value={selectedBookId}
                onChange={(e) => {
                  const nextId = e.target.value;
                  const savedForBook = readingState.textbooks[nextId];
                  const nextBook =
                    COMPREHENSIVE_TEXTBOOKS_REGISTRY.find((b) => b.id === nextId) || currentBook;
                  setSelectedBookId(nextId);
                  setSelectedChapterIdx(
                    savedForBook
                      ? Math.max(0, Math.min(savedForBook.chapterIdx, nextBook.chapters.length - 1))
                      : 0
                  );
                  setActiveTab(savedForBook?.tab || 'theory');
                  setAiAnalysisResult(null);
                }}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-none"
              >
                {allGradeBooks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.subjectName[selectedLanguageOverride] || b.subjectName.am} ({b.totalPages} pp)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Book Identity Card & Chapter Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Textbook Identity & Firebase Storage Link */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  የተመረጠ መጽሐፍ (Active Book)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Grade {currentBook.grade}
                </span>
              </div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                {currentBook.title[selectedLanguageOverride] || currentBook.title.am}
              </h3>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 text-[11px] font-mono space-y-1">
                <div className="text-emerald-600 font-bold flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" />
                  Firebase Storage Path:
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 break-all">
                  {currentBook.firebaseStoragePath}
                </div>
                <div className="pt-1 flex justify-between text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-700 mt-1">
                  <span>MD5: {currentBook.md5Checksum.slice(0, 8)}...</span>
                  <span>{(currentBook.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                </div>
              </div>
            </div>

            {/* Chapter Carousel Navigator */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs md:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    የምዕራፍ ምርጫ (Select Chapter / Unit)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleBookCardClick(currentBook)}
                    className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                    ሁሉንም ማውጫ ተመልከት
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentBook.chapters.map((ch, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedChapterIdx(idx);
                        setAiAnalysisResult(null);
                      }}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        idx === selectedChapterIdx
                          ? 'border-emerald-500 bg-emerald-500 text-white font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="font-bold truncate">
                        {ch.title[selectedLanguageOverride] || ch.title.am}
                      </div>
                      <div className="text-[10px] opacity-80 mt-1 font-mono">
                        ገፅ {ch.startPage} – {ch.endPage} (Pages)
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>ይፋዊ የትምህርት ሚኒስቴር የመማሪያ ሰነድ (2019 ዓ.ም)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  DRM Protected
                </span>
              </div>
            </div>
          </div>

          {/* 6 Core Section Tabs for the Active Unit */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('theory')}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === 'theory'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              📖 1. መማሪያ ይዘት (Theory & Text)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('examples')}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === 'examples'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Calculator className="w-4 h-4" />
              💡 2. ምሳሌዎች (Worked Examples) ({currentChapter.examples.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('activities')}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === 'activities'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              👥 3. አክቲቪቲዎች (In-Class Activities) ({currentChapter.activities.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('experiments')}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === 'experiments'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              🔬 4. ሙከራዎችና ፎቶዎች (Lab Experiments & Photos) ({currentChapter.experiments.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('exercises')}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === 'exercises'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              📝 5. የምዕራፍ መልመጃዎች (Review Exercises) ({currentChapter.reviewExercises.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('supplementary')}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === 'supplementary'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              📚 6. አጋዥ መጻሕፍት (Supplementary Guide)
            </button>
          </div>

          {/* Main Content Viewer with DRM Protection Watermark */}
          <DrmProtectedContainer
            contentTitle={`${currentBook.title.en} - ${currentChapter.title.en}`}
            watermarkOpacity={0.12}
            watermarkAngle={-26}
            className="rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="relative bg-white dark:bg-slate-900 p-6 sm:p-8 min-h-[500px]">

            {/* Tab 1: Theory & Textbook Content */}
            {activeTab === 'theory' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 tracking-wide">
                      የምዕራፉ ማጠቃለያ (በ AI የተዘጋጀ) / AI-written chapter summary (ከመጽሐፉ ገፅ {currentChapter.startPage}–{currentChapter.endPage} ጋር ይዛመዳል / matches textbook pp. {currentChapter.startPage}–{currentChapter.endPage})
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      {currentChapter.title[selectedLanguageOverride] || currentChapter.title.am}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeak(
                        currentChapter.theoryContent[selectedLanguageOverride] ||
                          currentChapter.theoryContent.am
                      )
                    }
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 text-slate-700 dark:text-slate-300 transition-colors"
                    title="ጽሑፉን አሰማኝ (Listen Audio)"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>

                <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 font-sans">
                  <p>
                    {currentChapter.theoryContent[selectedLanguageOverride] ||
                      currentChapter.theoryContent.am}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-2">
                    ከመጽሐፍዎ ጋር ያመሳስሉ / Please verify with your textbook
                  </p>
                </div>

                {/* Chapter Topics Overview */}
                {currentChapter.topics && currentChapter.topics.length > 0 && (
                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300">
                      <span className="flex items-center gap-1.5">
                        <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                        በዚህ ምዕራፍ ስር የተካተቱ ይፋዊ ንዑሳን ርዕሶች ({currentChapter.topics.length} Topics):
                      </span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                        ገፅ {currentChapter.startPage} – {currentChapter.endPage}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {currentChapter.topics.map((t) => (
                        <div
                          key={t.id}
                          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 text-xs shadow-2xs space-y-1.5 flex flex-col justify-between"
                        >
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">
                              {t.title}
                            </p>
                            {t.pageReference && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono block mt-0.5">
                                📖 {t.pageReference}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setDeepDiveTopic({
                                topic: t,
                                unitNumber: currentChapter.unitNumber,
                                unitTitle: currentChapter.title[selectedLanguageOverride] || currentChapter.title.am,
                                book: currentBook,
                              })
                            }
                            className="self-start px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>ትንታኔና ምሳሌ</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Deep Analysis Action Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={isAnalyzing}
                    onClick={() =>
                      handleRequestVerbatimAiAnalysis(
                        currentChapter.theoryContent[selectedLanguageOverride] ||
                          currentChapter.theoryContent.am
                      )
                    }
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    {isAnalyzing ? 'በመተንተን ላይ...' : '🤖 በዝርዝር በኑር ኤአይ አስረዳኝ (NUR AI Detailed Deep Dive)'}
                  </button>

                  <span className="text-xs text-slate-400 font-mono">
                    ቋንቋ፡ {langNames[selectedLanguageOverride].label} ({selectedLanguageOverride.toUpperCase()})
                  </span>
                </div>
              </div>
            )}

            {/* Tab 2: Worked Examples */}
            {activeTab === 'examples' && (
              <div className="space-y-6">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  የመማሪያ መጽሐፉ ተግባራዊ ምሳሌዎች (Textbook Worked Examples)
                </h2>

                {currentChapter.examples.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    ለዚህ ምዕራፍ ምሳሌዎች በቅርቡ ይካተታሉ።
                  </div>
                ) : (
                  currentChapter.examples.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                        <span className="font-black text-emerald-700 dark:text-emerald-300 text-sm">
                          {ex.exampleNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleSpeak(
                              ex.problemStatement[selectedLanguageOverride] || ex.problemStatement.am
                            )
                          }
                          className="text-slate-400 hover:text-emerald-600 p-1"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {ex.problemStatement[selectedLanguageOverride] || ex.problemStatement.am}
                      </p>

                      {/* Given & Formula */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <span className="font-bold text-slate-500 uppercase block mb-1">
                            📝 የተሰጡ መጠኖች (Given):
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 font-mono text-slate-700 dark:text-slate-300">
                            {ex.given.map((g, i) => (
                              <li key={i}>{g}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <span className="font-bold text-slate-500 uppercase block mb-1">
                            📐 ዋና ቀመር (Formula):
                          </span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {ex.formula}
                          </span>
                        </div>
                      </div>

                      {/* Steps */}
                      <div className="space-y-2 text-xs sm:text-sm">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block">
                          ደረጃ በደረጃ ስሌት (Step-by-Step Calculation):
                        </span>
                        {ex.calculationSteps.map((step, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200"
                          >
                            {step[selectedLanguageOverride] || step.am}
                          </div>
                        ))}
                      </div>

                      {/* Final Answer */}
                      <div className="p-3.5 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-between">
                        <span>
                          ✅ የመጨረሻ መልስ፡ {ex.finalAnswer[selectedLanguageOverride] || ex.finalAnswer.am}
                        </span>
                      </div>

                      <p className="text-[11px] text-amber-700 dark:text-amber-400 italic">
                        💡 {ex.pedagogicalNote[selectedLanguageOverride] || ex.pedagogicalNote.am}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Activities */}
            {activeTab === 'activities' && (
              <div className="space-y-6">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  የትምህርት ክፍል እና የመስክ አክቲቪቲዎች (In-Class Learning Activities)
                </h2>

                {currentChapter.activities.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    ለዚህ ምዕራፍ አክቲቪቲዎች በቅርቡ ይካተታሉ።
                  </div>
                ) : (
                  currentChapter.activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-indigo-700 dark:text-indigo-300 text-xs px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900">
                          {act.activityNumber}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        {act.title[selectedLanguageOverride] || act.title.am}
                      </h3>

                      <div className="space-y-3 text-xs sm:text-sm">
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900">
                          <strong className="text-indigo-600 block mb-1">📋 መመሪያ (Instruction):</strong>
                          <p className="text-slate-700 dark:text-slate-300">
                            {act.instruction[selectedLanguageOverride] || act.instruction.am}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900">
                          <strong className="text-indigo-600 block mb-1">👥 የቡድን ተግባር (Group Task):</strong>
                          <p className="text-slate-700 dark:text-slate-300">
                            {act.groupTask[selectedLanguageOverride] || act.groupTask.am}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                          <strong className="text-amber-800 dark:text-amber-300 block mb-1">
                            🧠 የትንታኔ እና የማሰላሰያ ጥያቄ (Critical Thinking):
                          </strong>
                          <p className="text-amber-950 dark:text-amber-200">
                            {act.criticalThinkingQuestion[selectedLanguageOverride] ||
                              act.criticalThinkingQuestion.am}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 4: Laboratory Experiments and Apparatus Photos */}
            {activeTab === 'experiments' && (
              <div className="space-y-6">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-teal-600" />
                  የላቦራቶሪ ሙከራዎች፣ አሰራርና የመሳሪያ ፎቶዎች (Lab Experiments & Apparatus)
                </h2>

                {currentChapter.experiments.map((lab) => (
                  <div
                    key={lab.id}
                    className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-6"
                  >
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-teal-800 dark:text-teal-300">
                        {lab.title[selectedLanguageOverride] || lab.title.am}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                        <strong>የሙከራው ግብ (Objective):</strong>{' '}
                        {lab.objective[selectedLanguageOverride] || lab.objective.am}
                      </p>
                    </div>

                    {/* Apparatus Illustration Diagram */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                        የመሳሪያዎች አቀማመጥ ዲያግራም (Experimental Setup Diagram)
                      </span>
                      <LabDiagramSvg type={lab.diagramSvgType} />
                    </div>

                    {/* Apparatus & Reagents List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                          🧪 የሚያስፈልጉ ቁሳቁሶች (Apparatus):
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                          {lab.apparatus.map((app, i) => (
                            <li key={i}>{app}</li>
                          ))}
                        </ul>
                      </div>

                      {lab.reagents && (
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                            ⚗️ ኬሚካሎችና ሪኤጀንቶች (Chemical Reagents):
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                            {lab.reagents.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Step-by-Step Procedure */}
                    <div className="space-y-2 text-xs sm:text-sm">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        ደረጃ በደረጃ የላቦራቶሪ አሰራር (Step-by-Step Laboratory Procedure):
                      </span>
                      {lab.procedure.map((p, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                        >
                          {p[selectedLanguageOverride] || p.am}
                        </div>
                      ))}
                    </div>

                    {/* Safety & Observation Notes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200">
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          የደህንነት ጥንቃቄ (Safety Precautions):
                        </div>
                        {lab.safetyPrecautions[selectedLanguageOverride] ||
                          lab.safetyPrecautions.am}
                      </div>

                      <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-teal-900 dark:text-teal-200">
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          <CheckCircle2 className="w-4 h-4 text-teal-600" />
                          የውጤት ትንታኔ (Observation & Data Analysis):
                        </div>
                        {lab.observationNotes[selectedLanguageOverride] ||
                          lab.observationNotes.am}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 5: Review Exercises */}
            {activeTab === 'exercises' && (
              <div className="space-y-6">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  የምዕራፉ ማጠቃለያ መልመጃዎችና ጥያቄዎች (Unit Review Exercises)
                </h2>

                {currentChapter.reviewExercises.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    ለዚህ ምዕራፍ መልመጃዎች በቅርቡ ይካተታሉ።
                  </div>
                ) : (
                  currentChapter.reviewExercises.map((ex) => {
                    const isExpanded = expandedExerciseId === ex.id;
                    return (
                      <div
                        key={ex.id}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                            {ex.exerciseNumber}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {ex.type.replace('_', ' ')}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {ex.question[selectedLanguageOverride] || ex.question.am}
                        </p>

                        {ex.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                            {ex.options.map((opt, i) => (
                              <div
                                key={i}
                                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5"
                          >
                            {isExpanded ? 'ማብራሪያውን ደብቅ' : '✅ ትክክለኛ መልስ እና ዝርዝር አሰራር አሳየኝ'}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                            <div className="font-bold text-xs text-emerald-700 dark:text-emerald-300">
                              ትክክለኛ መልስ፡{' '}
                              {ex.correctAnswer[selectedLanguageOverride] || ex.correctAnswer.am}
                            </div>
                            <div className="space-y-1.5 text-xs">
                              <span className="font-semibold text-slate-500 block">የአሰራር ደረጃዎች፡</span>
                              {ex.stepByStepSolution.map((s, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono"
                                >
                                  {s[selectedLanguageOverride] || s.am}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Tab 6: Supplementary Guide Connection */}
            {activeTab === 'supplementary' && (
              <div className="space-y-6">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <BookmarkCheck className="w-5 h-5 text-purple-600" />
                  የአጋዥ መጻሕፍትና የፈተና ባንክ ማጣቀሻ (Supplementary Guides)
                </h2>

                <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-3">
                  <h3 className="font-bold text-sm text-purple-900 dark:text-purple-200">
                    የዚህ ምዕራፍ ተዛማጅ አጋዥ መረጃ (Curriculum Correlation):
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-950 dark:text-purple-100">
                    {currentChapter.supplementaryNote[selectedLanguageOverride] ||
                      currentChapter.supplementaryNote.am}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-[11px] px-2.5 py-1 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200 font-bold">
                      EUEE Model Bank
                    </span>
                    <span className="text-[11px] px-2.5 py-1 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200 font-bold">
                      STEM Formula Manual
                    </span>
                    <span className="text-[11px] px-2.5 py-1 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200 font-bold">
                      MoE Laboratory Guidelines
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Verbatim Deep Dive Popup/Box */}
            {(aiAnalysisResult || aiAnalysisError) && (
              <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-slate-900 text-slate-100 border border-emerald-500 shadow-2xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    የኑር ኤአይ በዝርዝር ጥልቅ ትንታኔ ({langNames[selectedLanguageOverride].label})
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAiAnalysisResult(null);
                      setAiAnalysisError(false);
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ✕ ዝጋ (Close)
                  </button>
                </div>
                {aiAnalysisError ? (
                  <div className="space-y-3 py-2">
                    <p className="text-xs sm:text-sm text-rose-300">
                      የትንታኔ ማብራሪያውን ማግኘት አልተቻለም። እባክዎ እንደገና ይሞክሩ። / Could not load analysis. Please try again.
                    </p>
                    <button
                      type="button"
                      disabled={isAnalyzing}
                      onClick={() => handleRequestVerbatimAiAnalysis(lastAnalysisPrompt)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      {isAnalyzing ? 'በመሞከር ላይ...' : 'እንደገና ሞክር (Retry)'}
                    </button>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {aiAnalysisResult}
                  </div>
                )}
              </div>
            )}
            </div>
          </DrmProtectedContainer>
        </div>
      )}

      {/* ======================================================== */}
      {/* 📑 MASTER TABLE OF CONTENTS MODAL (የመጽሐፉ ሙሉ ማውጫ) */}
      {/* Triggered whenever ANY book card is clicked!              */}
      {/* ======================================================== */}
      {isTocModalOpen && tocModalBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-indigo-950 text-white flex items-start justify-between border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-[10px] font-black uppercase tracking-wider">
                    Grade {tocModalBook.grade} • {tocModalBook.subjectCode}
                  </span>
                  <span className="text-xs font-mono text-emerald-300">
                    {tocModalBook.totalPages} ገጾች • {tocModalBook.chapters.length} ምዕራፎች
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black">
                  {tocModalBook.title[selectedLanguageOverride] || tocModalBook.title.am}
                </h2>
                <div className="flex items-center gap-3 text-[11px] text-slate-300 font-mono pt-1">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Cloud className="w-3 h-3" />
                    Firebase Storage: {(tocModalBook.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                  </span>
                  <span>MD5: {tocModalBook.md5Checksum.slice(0, 8)}...</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTocModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="ዝጋ (Close)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chapters Table of Contents List */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {readingState.textbooks[tocModalBook.id] && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-200 font-bold">
                    <Bookmark className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      ያቆሙበት ቦታ: ምዕራፍ {readingState.textbooks[tocModalBook.id].unitNumber} • ገፅ{' '}
                      {readingState.textbooks[tocModalBook.id].pageNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTocModalOpen(false);
                      handleResumeTextbook(tocModalBook);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 self-start sm:self-center shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>ካቆሙበት ቀጥል</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500">
                <span className="uppercase tracking-wider flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4 text-emerald-600" />
                  የምዕራፎች ይፋዊ ማውጫ (Official Syllabus Table of Contents):
                </span>
                <span>{tocModalBook.chapters.length} ምዕራፎች</span>
              </div>

              <div className="space-y-3">
                {tocModalBook.chapters.map((ch, idx) => {
                  const isSavedChapter =
                    readingState.textbooks[tocModalBook.id]?.chapterIdx === idx;
                  return (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                      isSavedChapter
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 ring-1 ring-emerald-500/40'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {ch.unitNumber}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h4 className="font-black text-sm text-slate-900 dark:text-white">
                              {ch.title[selectedLanguageOverride] || ch.title.am}
                            </h4>
                            {isSavedChapter && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1">
                                <Bookmark className="w-2.5 h-2.5" />
                                ያቆሙበት
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            የመማሪያ ገፅ {ch.startPage} – {ch.endPage} (Pages)
                          </span>
                        </div>
                      </div>

                      {/* Jump to specific section buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleSelectChapterFromToc(tocModalBook, idx, 'theory')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                        >
                          <span>{isSavedChapter ? 'ካቆሙበት ቀጥል' : 'ምዕራፉን ክፈት'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Sub-items Indicator Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleSelectChapterFromToc(tocModalBook, idx, 'examples')}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 flex items-center gap-1"
                      >
                        <Calculator className="w-3 h-3 text-emerald-600" />
                        <span>ምሳሌዎች ({ch.examples.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectChapterFromToc(tocModalBook, idx, 'activities')}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 flex items-center gap-1"
                      >
                        <Users className="w-3 h-3 text-indigo-600" />
                        <span>አክቲቪቲዎች ({ch.activities.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectChapterFromToc(tocModalBook, idx, 'experiments')}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-500 flex items-center gap-1"
                      >
                        <FlaskConical className="w-3 h-3 text-teal-600" />
                        <span>ላቦራቶሪና ፎቶዎች ({ch.experiments.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectChapterFromToc(tocModalBook, idx, 'exercises')}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-amber-600" />
                        <span>መልመጃዎች ({ch.reviewExercises.length})</span>
                      </button>
                    </div>

                    {/* Topics List from MoE Syllabus */}
                    {ch.topics && ch.topics.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                            የምዕራፉ ንዑሳን ርዕሶች ማውጫ ({ch.topics.length} Topics):
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            MoE Official Syllabus
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {ch.topics.map((t) => (
                            <div
                              key={t.id}
                              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2 shadow-2xs hover:border-emerald-400 transition-all group/top"
                            >
                              <div className="space-y-0.5 min-w-0">
                                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover/top:text-emerald-600 transition-colors">
                                  {t.title}
                                </p>
                                {t.pageReference && (
                                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <BookOpen className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{t.pageReference}</span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeepDiveTopic({
                                      topic: t,
                                      unitNumber: ch.unitNumber,
                                      unitTitle: ch.title[selectedLanguageOverride] || ch.title.am,
                                      book: tocModalBook,
                                    });
                                  }}
                                  className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-colors"
                                  title="ጥልቅ ትንታኔ እና ምሳሌዎች"
                                >
                                  <Sparkles className="w-3 h-3 text-amber-300" />
                                  <span>ትንታኔና ምሳሌ</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSelectChapterFromToc(tocModalBook, idx, 'theory')}
                                  className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shrink-0 transition-colors"
                                >
                                  አንብብ
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer with Direct PDF Link and Secure Reader */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 font-mono text-[11px] truncate">
                Firebase URI: {tocModalBook.firebaseStoragePath}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsTocModalOpen(false);
                    handleOpenSecureReader(tocModalBook);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  ደህንነቱ የተጠበቀ ንባብ (Secure Reader)
                </button>
                <button
                  type="button"
                  onClick={() => setIsTocModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-bold"
                >
                  ዝጋ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECURE DRM BOOK READER MODAL & ALL TEXTBOOKS CATALOG MODAL */}
      {/* ======================================================== */}
      <SecureBookReaderModal
        book={secureReaderBook}
        initialPage={secureReaderInitialPage}
        initialChapterIdx={secureReaderInitialChapterIdx}
        isOpen={isSecureReaderOpen}
        onClose={() => {
          setIsSecureReaderOpen(false);
          setReadingState(loadBookReadingState(currentUser.id));
        }}
        onProgressSaved={() => setReadingState(loadBookReadingState(currentUser.id))}
      />

      <AllTextbooksModal
        isOpen={isAllTextbooksModalOpen}
        onClose={() => setIsAllTextbooksModalOpen(false)}
        onSelectBook={(book) => handleOpenSecureReader(book)}
      />

      {/* SUB-TOPIC EXPLANATION & WORKED EXAMPLES MODAL */}
      {deepDiveTopic && (
        <SubTopicDeepDiveModal
          isOpen={Boolean(deepDiveTopic)}
          onClose={() => setDeepDiveTopic(null)}
          subjectName={deepDiveTopic.book.subjectName[selectedLanguageOverride] || deepDiveTopic.book.subjectName.am}
          subjectCode={deepDiveTopic.book.subjectCode}
          grade={deepDiveTopic.book.grade}
          unitTitle={deepDiveTopic.unitTitle}
          unitNumber={deepDiveTopic.unitNumber}
          topic={deepDiveTopic.topic}
        />
      )}
    </div>
  );
};
