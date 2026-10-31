import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  COMPREHENSIVE_TEXTBOOKS_REGISTRY,
  TextbookRecord,
} from '../../data/textbooksRegistry';
import { GradeLevel } from '../../types';
import {
  BookOpen,
  Search,
  ShieldCheck,
  Bookmark,
  ChevronRight,
  X,
  Sparkles,
  FileText,
  Filter,
  CheckCircle2,
  Lock,
  Download,
  GraduationCap,
} from 'lucide-react';

interface AllTextbooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBook: (book: TextbookRecord) => void;
}

export const AllTextbooksModal: React.FC<AllTextbooksModalProps> = ({
  isOpen,
  onClose,
  onSelectBook,
}) => {
  const { language } = useLanguage();
  const { isSuperAdmin, activeGrade } = useAuth();

  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('all');
  const [selectedStream, setSelectedStream] = useState<'All' | 'Natural Science' | 'Social Science'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  // Filter textbooks according to Grade, Stream, and Search
  const filteredBooks = COMPREHENSIVE_TEXTBOOKS_REGISTRY.filter((book) => {
    // Grade filter
    if (selectedGrade !== 'all' && book.grade !== selectedGrade) {
      return false;
    }

    // Stream filter (Grades 11 and 12 stream differentiation)
    if (selectedStream !== 'All' && book.grade >= 11) {
      const isNatural = ['MATH', 'PHYS', 'CHEM', 'BIO', 'IT'].includes(book.subjectCode);
      const isSocial = ['HIST', 'GEOG', 'ECON', 'ENG', 'CIVICS'].includes(book.subjectCode);

      if (selectedStream === 'Natural Science' && !isNatural) return false;
      if (selectedStream === 'Social Science' && !isSocial) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch =
        (book.title[language] || '').toLowerCase().includes(q) ||
        (book.title.en || '').toLowerCase().includes(q);
      const subjectMatch =
        (book.subjectName[language] || '').toLowerCase().includes(q) ||
        (book.subjectName.en || '').toLowerCase().includes(q) ||
        book.subjectCode.toLowerCase().includes(q);
      return titleMatch || subjectMatch;
    }

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="w-full max-w-5xl h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* ================= MODAL HEADER ================= */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600/60 text-[11px] font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              የይፋዊ መማሪያ መጽሐፍት ካታሎግ (MoE 2019 E.C.)
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              የክፍል 9-12 የትምህርት ሚኒስቴር ሙሉ የመማሪያ መጽሐፍት
            </h2>
            <p className="text-xs text-emerald-100/90">
              በአዲሱ የኢ.ፌ.ዲ.ሪ ስርዓተ-ትምህርት መሰረት የተዘጋጁ ቋሚ የመማሪያ መጽሐፍት ቤተ-መጽሐፍት
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="self-end sm:self-center p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
            title="ዝጋ (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= FILTER TOOLBAR ================= */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Grade Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="font-bold text-slate-400 mr-1 shrink-0">ክፍል (Grade):</span>
            {(['all', 9, 10, 11, 12] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                  selectedGrade === g
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                {g === 'all' ? 'ሁሉም (All Grades)' : `Grade ${g}`}
              </button>
            ))}
          </div>

          {/* Stream Selector & Search */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['All', 'Natural Science', 'Social Science'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedStream(s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedStream === s
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {s === 'All' ? 'ሁሉም ዘርፍ' : s === 'Natural Science' ? '🔬 Natural' : '📜 Social'}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[180px] sm:min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="መጽሐፍ ይፈልጉ..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* ================= TEXTBOOKS CARDS GRID ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredBooks.length === 0 ? (
            <div className="p-16 text-center text-slate-400 space-y-2">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">ምንም የተገኘ መጽሐፍ የለም (No textbooks match filter)</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((book) => {
                const lastReadPage = localStorage.getItem(`nur_last_read_${book.id}`);

                const coverGradients: Record<string, string> = {
                  emerald: 'from-emerald-700 to-teal-900',
                  amber: 'from-amber-600 to-orange-800',
                  indigo: 'from-indigo-700 to-blue-900',
                  purple: 'from-purple-700 to-violet-900',
                  cyan: 'from-cyan-600 to-blue-800',
                  rose: 'from-rose-600 to-pink-900',
                  blue: 'from-blue-600 to-indigo-900',
                };
                const gradient = coverGradients[book.coverColor] || 'from-emerald-700 to-slate-900';

                return (
                  <div
                    key={book.id}
                    className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:border-emerald-500/60"
                  >
                    <div className="space-y-3">
                      {/* Stylized MoE Textbook Cover Frame */}
                      <div
                        className={`h-36 rounded-2xl bg-gradient-to-br ${gradient} text-white p-4 flex flex-col justify-between shadow-inner relative overflow-hidden`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-black/30 backdrop-blur-xs text-white">
                            Grade {book.grade} • {book.subjectCode}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-300" />
                            MoE Verified
                          </span>
                        </div>

                        <div>
                          <div className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">
                            FDRE Ministry of Education
                          </div>
                          <h3 className="text-sm font-black text-white line-clamp-2 leading-tight">
                            {book.title[language] || book.title.en}
                          </h3>
                        </div>

                        <div className="text-[9px] font-mono text-white/70 flex justify-between">
                          <span>2019 E.C. Curriculum</span>
                          <span>{book.totalPages} Pages</span>
                        </div>
                      </div>

                      {/* Metadata details */}
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {book.subjectName[language] || book.subjectName.en}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>{book.chapters.length} ምዕራፎች (Units)</span>
                          <span>{(book.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                        </div>

                        {lastReadPage && (
                          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1">
                            <Bookmark className="w-3 h-3" />
                            <span>ያቆሙበት ገጽ: {lastReadPage}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Open Button */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectBook(book);
                        onClose();
                      }}
                      className="w-full py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>ክፈትና አንብብ (Open Reader)</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= MODAL FOOTER ================= */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ሁሉም መጽሐፍት በDRM ዲጂታል የውሃ ምልክት የተጠበቁ ናቸው</span>
          </div>

          <div className="font-bold text-slate-700 dark:text-slate-300">
            የተገኙ መጽሐፍት: {filteredBooks.length}
          </div>
        </div>
      </div>
    </div>
  );
};
