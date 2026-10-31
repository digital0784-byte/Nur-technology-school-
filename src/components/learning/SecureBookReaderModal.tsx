import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { TextbookRecord, TextbookChapter } from '../../data/textbooksRegistry';
import {
  BookOpen,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Sun,
  Moon,
  Bookmark,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
  ShieldCheck,
  ShieldAlert,
  ListOrdered,
  RotateCcw,
  Sparkles,
  Award,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface SecureBookReaderModalProps {
  book: TextbookRecord;
  initialPage?: number;
  initialChapterIdx?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const SecureBookReaderModal: React.FC<SecureBookReaderModalProps> = ({
  book,
  initialPage = 1,
  initialChapterIdx = 0,
  isOpen,
  onClose,
}) => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { language } = useLanguage();

  // Reader states
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const saved = localStorage.getItem(`nur_last_read_${book.id}`);
    return saved ? parseInt(saved, 10) : initialPage;
  });

  const [zoomLevel, setZoomLevel] = useState<number>(100); // 75 to 200%
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'sepia'>('light');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isTocDrawerOpen, setIsTocDrawerOpen] = useState<boolean>(false);
  const [jumpPageInput, setJumpPageInput] = useState<string>(currentPage.toString());
  const [violationToast, setViolationToast] = useState<string | null>(null);
  const [isBlinded, setIsBlinded] = useState<boolean>(false);
  const [sessionTimestamp, setSessionTimestamp] = useState<string>(new Date().toUTCString());

  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Derive phone number for watermark: student profile phone or fallback
  const studentPhone =
    (currentUser as any).phone ||
    (isSuperAdmin ? '0910097862' : '09' + (currentUser.id ? currentUser.id.slice(0, 8).replace(/\D/g, '4') : '12345678'));

  const sessionId = useRef(`SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`).current;

  // Auto-save reading progress to localStorage and Firestore
  useEffect(() => {
    localStorage.setItem(`nur_last_read_${book.id}`, currentPage.toString());
    setJumpPageInput(currentPage.toString());

    // Update session timestamp periodically
    const timer = setInterval(() => {
      setSessionTimestamp(new Date().toUTCString());
    }, 10000);
    return () => clearInterval(timer);
  }, [currentPage, book.id]);

  // Determine current active chapter based on currentPage
  const activeChapterIdx = Math.max(
    0,
    book.chapters.findIndex((ch) => currentPage >= ch.startPage && currentPage <= ch.endPage)
  );
  const activeChapter: TextbookChapter =
    book.chapters[activeChapterIdx >= 0 ? activeChapterIdx : initialChapterIdx] || book.chapters[0];

  const triggerViolation = useCallback((type: string, message: string) => {
    setViolationToast(message);
    setIsBlinded(true);

    // Security audit log
    fetch('/api/security/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        logId: `DRM-${Date.now()}`,
        actorId: currentUser.email || 'student_session',
        actorRole: isSuperAdmin ? 'SUPER_ADMIN' : 'STUDENT',
        action: 'READER_DRM_BREACH_ATTEMPT',
        resourceType: 'MOE_TEXTBOOK_PDF',
        resourceId: book.id,
        result: 'denied',
        timestamp: new Date().toISOString(),
        details: type,
      }),
    }).catch(() => {});

    setTimeout(() => setIsBlinded(false), 1800);
    setTimeout(() => setViolationToast(null), 3800);
  }, [currentUser.email, isSuperAdmin, book.id]);

  // Anti-Scraping Keyboard & Mouse Traps
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen Key
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        triggerViolation('PRINT_SCREEN', 'የስክሪን ፎቶ ማንሳት ተከልክሏል! (Screenshot capture intercepted by DRM shield)');
        return false;
      }
      // Ctrl+S / Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        triggerViolation('SAVE_SHORTCUT', 'መጽሐፉን ዳውንሎድ ማድረግ በDRM የተጠበቀ ነው (Save intercepted)');
        return false;
      }
      // Ctrl+P / Cmd+P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        triggerViolation('PRINT_SHORTCUT', 'ማተም በህግ የተከለከለ ነው (Printing intercepted)');
        return false;
      }
      // F12 or Inspect shortcuts
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c'))) {
        e.preventDefault();
        triggerViolation('DEVTOOLS', 'የደህንነት ምርመራ ተከልክሏል (DevTools blocked)');
        return false;
      }
      // Page navigation with arrow keys
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentPage((p) => Math.min(book.totalPages, p + 1));
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentPage((p) => Math.max(1, p - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, book.totalPages, triggerViolation]);

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerContainerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(200, z + 25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(75, z - 25));
  const handleResetZoom = () => setZoomLevel(100);

  // Jump to specific page
  const handlePageJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= book.totalPages) {
      setCurrentPage(pageNum);
    } else {
      setJumpPageInput(currentPage.toString());
    }
  };

  // Jump directly to chapter
  const handleJumpToChapter = (chapter: TextbookChapter) => {
    setCurrentPage(chapter.startPage);
    setIsTocDrawerOpen(false);
  };

  if (!isOpen) return null;

  // Reading mode theme classes
  const themeClasses = {
    light: 'bg-slate-100 text-slate-900',
    dark: 'bg-slate-950 text-slate-100',
    sepia: 'bg-[#fbf0d9] text-[#433422]',
  }[themeMode];

  const pageSurfaceClasses = {
    light: 'bg-white text-slate-900 border-slate-200 shadow-md',
    dark: 'bg-slate-900 text-slate-100 border-slate-800 shadow-2xl',
    sepia: 'bg-[#f4ecd8] text-[#3e2e1e] border-[#e4d4b8] shadow-md',
  }[themeMode];

  return (
    <div
      ref={readerContainerRef}
      onContextMenu={(e) => {
        e.preventDefault();
        triggerViolation('RIGHT_CLICK', 'የቀኝ-ጠቅ ማድረግ (Right-click) ተከልክሏል!');
      }}
      className={`fixed inset-0 z-50 flex flex-col select-none overflow-hidden transition-colors ${themeClasses}`}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Violation Blinding Flash Shield */}
      {isBlinded && (
        <div className="absolute inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
          <ShieldAlert className="w-16 h-16 text-rose-500 animate-bounce" />
          <h2 className="text-xl sm:text-2xl font-black text-white">
            የDRM ዲጂታል መብት ጥበቃ ማስጠንቀቂያ!
          </h2>
          <p className="text-xs sm:text-sm text-rose-300 max-w-md">
            ይህ ይፋዊ የትምህርት ሚኒስቴር መጽሐፍ በDRM የተጠበቀ ነው። ስክሪን ፎቶ ማንሳት፣ ማተም ወይም ማውረድ የተከለከለ ነው።
          </p>
          <div className="text-[11px] font-mono text-slate-400">
            Session: {sessionId} • Phone: {studentPhone}
          </div>
        </div>
      )}

      {/* Violation Toast Notification */}
      {violationToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-rose-950 text-rose-200 border border-rose-500/80 shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-3">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{violationToast}</span>
        </div>
      )}

      {/* ================= TOP READER TOOLBAR ================= */}
      <header className="shrink-0 h-14 border-b px-4 flex items-center justify-between gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-slate-200 dark:border-slate-800 z-30">
        {/* Left: Book Title & Chapter Jump Drawer Button */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setIsTocDrawerOpen(!isTocDrawerOpen)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0"
            title="የምዕራፎች ማውጫ (Table of Contents)"
          >
            <ListOrdered className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">ማውጫ (TOC)</span>
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
              {book.title[language] || book.title.en}
            </h1>
            <p className="text-[10px] text-slate-400 truncate">
              Grade {book.grade} • {activeChapter.title[language] || activeChapter.title.en}
            </p>
          </div>
        </div>

        {/* Center: Page Navigation Controls & Jump Input */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 transition-all"
            title="የቀደመው ገጽ (Previous Page)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <form onSubmit={handlePageJumpSubmit} className="flex items-center gap-1 text-xs font-semibold">
            <input
              type="text"
              value={jumpPageInput}
              onChange={(e) => setJumpPageInput(e.target.value)}
              className="w-10 sm:w-12 text-center py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <span className="text-slate-400">/ {book.totalPages}</span>
          </form>

          <button
            type="button"
            disabled={currentPage >= book.totalPages}
            onClick={() => setCurrentPage((p) => Math.min(book.totalPages, p + 1))}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 transition-all"
            title="ቀጣይ ገጽ (Next Page)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Zoom, Theme, Fullscreen, Super Admin Offline Download, Close */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Zoom Controls */}
          <div className="hidden md:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 75}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 disabled:opacity-30"
              title="አሳንስ (Zoom Out)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span
              onClick={handleResetZoom}
              className="text-[11px] font-bold px-1.5 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-emerald-500"
              title="100% አድርግ"
            >
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 disabled:opacity-30"
              title="አጎላ (Zoom In)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Theme Modes */}
          <button
            type="button"
            onClick={() => {
              if (themeMode === 'light') setThemeMode('dark');
              else if (themeMode === 'dark') setThemeMode('sepia');
              else setThemeMode('light');
            }}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all"
            title={`Reading Mode: ${themeMode.toUpperCase()}`}
          >
            {themeMode === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : themeMode === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <span className="text-xs font-bold text-[#b08855]">Sepia</span>}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all"
            title="ሙሉ ስክሪን (Toggle Fullscreen)"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Super Admin Unrestricted Offline Download */}
          {isSuperAdmin && (
            <a
              href={book.firebaseDownloadUrl || book.pdfUrl}
              download={`${book.subjectCode}_Grade${book.grade}_MoE_Official.pdf`}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs transition-all"
              title="Super Admin Unrestricted Download"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF አውርድ (Root)</span>
            </a>
          )}

          {/* Close Reader */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-500 hover:text-rose-600 transition-all ml-1"
            title="መጽሐፉን ዝጋ (Close Reader)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ================= MAIN READING CANVAS AREA ================= */}
      <div className="relative flex-1 overflow-auto flex justify-center p-3 sm:p-6">
        {/* Dynamic Translucent Student Watermark Diagonal Overlay */}
        <div
          className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-around overflow-hidden opacity-10"
          style={{ transform: 'rotate(-25deg) scale(1.3)' }}
        >
          {Array.from({ length: 6 }).map((_, rowIdx) => (
            <div key={rowIdx} className="flex justify-around text-center whitespace-nowrap">
              {Array.from({ length: 3 }).map((_, colIdx) => (
                <div key={colIdx} className="text-xs sm:text-sm font-black tracking-widest text-slate-900 dark:text-white uppercase select-none">
                  FDRE MoE 2019 E.C. • PHONE: {studentPhone} • {currentUser.email || 'NUR_STUDENT'} • {sessionId}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Rendered Book Page Document Surface */}
        <div
          className={`relative max-w-4xl w-full min-h-[900px] p-6 sm:p-12 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${pageSurfaceClasses}`}
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
        >
          {/* Official MoE Running Header */}
          <div className="border-b pb-3 mb-6 flex items-center justify-between text-xs text-slate-400 font-semibold border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                FDRE MoE • Grade {book.grade}
              </span>
              <span>|</span>
              <span className="truncate max-w-[200px] sm:max-w-none">
                {book.subjectName[language] || book.subjectName.en}
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>MoE Verified Official Curriculum</span>
            </div>
          </div>

          {/* Page Content Body */}
          <div className="space-y-6 flex-1 text-xs sm:text-sm leading-relaxed">
            {/* Unit Title Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Unit {activeChapter.unitNumber} • ምዕራፍ {activeChapter.unitNumber}
              </span>
              <h2 className="text-base sm:text-xl font-black text-emerald-950 dark:text-emerald-100">
                {activeChapter.title[language] || activeChapter.title.en}
              </h2>
            </div>

            {/* Theory Text Content */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm sm:text-base border-b pb-1 border-slate-200/60 dark:border-slate-800/60 text-slate-900 dark:text-white">
                ዋና የፅንሰ-ሀሳብ ማብራሪያ (Core Theoretical Foundation)
              </h3>
              <p className="text-justify leading-relaxed font-serif text-sm sm:text-base opacity-95">
                {activeChapter.theoryContent[language] || activeChapter.theoryContent.en}
              </p>
            </div>

            {/* Pedagogical Worked Examples if available */}
            {activeChapter.examples && activeChapter.examples.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  የተሰሩ ምሳሌዎች (Pedagogical Worked Examples):
                </h4>
                {activeChapter.examples.slice(0, 2).map((ex) => (
                  <div
                    key={ex.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2 text-xs"
                  >
                    <div className="font-bold text-emerald-700 dark:text-emerald-300">
                      ምሳሌ {ex.exampleNumber}: {ex.problemStatement[language] || ex.problemStatement.en}
                    </div>
                    {ex.formula && (
                      <div className="p-2 rounded bg-white dark:bg-slate-900 font-mono text-center text-xs font-bold text-amber-600 dark:text-amber-400 border">
                        {ex.formula}
                      </div>
                    )}
                    <div className="text-slate-600 dark:text-slate-300">
                      <strong>መልስ (Solution):</strong> {ex.finalAnswer[language] || ex.finalAnswer.en}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Supplementary Ethiopian Curriculum Context */}
            {activeChapter.supplementaryNote && (
              <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-950 dark:text-amber-100 space-y-1">
                <strong>🇪🇹 ከኢትዮጵያ ነባራዊ ሁኔታ ጋር ያለው ትስስር (Ethiopian Context):</strong>
                <p>{activeChapter.supplementaryNote[language] || activeChapter.supplementaryNote.en}</p>
              </div>
            )}
          </div>

          {/* Official MoE Running Footer */}
          <div className="border-t pt-4 mt-8 flex items-center justify-between text-xs text-slate-400 border-slate-200 dark:border-slate-800 font-semibold">
            <span>© 2019 E.C. Ministry of Education Ethiopia</span>
            <div className="flex items-center gap-2">
              <Bookmark className="w-3.5 h-3.5 text-emerald-500" />
              <span>ገጽ {currentPage} (Page {currentPage} of {book.totalPages})</span>
            </div>
            <span>FDRE Education Standard</span>
          </div>
        </div>
      </div>

      {/* ================= CHAPTER TABLE OF CONTENTS DRAWER ================= */}
      {isTocDrawerOpen && (
        <aside className="absolute top-14 left-0 bottom-0 w-80 sm:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-40 flex flex-col animate-in slide-in-from-left duration-200">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm">
              <ListOrdered className="w-4 h-4 text-emerald-600" />
              <span>የመጽሐፉ ማውጫ (Table of Contents)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsTocDrawerOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {book.chapters.map((ch, idx) => {
              const isCurrent = activeChapterIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleJumpToChapter(ch)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    isCurrent
                      ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 ring-1 ring-emerald-500 shadow-xs'
                      : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                      Unit {ch.unitNumber}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {ch.title[language] || ch.title.en}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0 mt-1">
                    p. {ch.startPage}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[11px] text-slate-500 flex items-center justify-between">
            <span>ጠቅላላ ምዕራፎች: {book.chapters.length}</span>
            <span>{book.totalPages} ጠቅላላ ገጾች</span>
          </div>
        </aside>
      )}
    </div>
  );
};
