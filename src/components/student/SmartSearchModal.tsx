import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Search, Loader2 } from 'lucide-react';

export const SmartSearchModal: React.FC = () => {
  const { activeGrade } = useAuth();
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, grade: activeGrade, language }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.results)) {
        setResults(data.results);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-indigo-950 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700 text-[11px] font-bold uppercase mb-1">
          <Search className="w-3.5 h-3.5" />
          {t('mod_smart_search')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_smart_search')}</h1>
        <p className="text-xs sm:text-sm text-emerald-100">{t('mod_smart_search_sub')}</p>
      </div>

      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ፅንሰ-ሀሳብ ወይም ርዕስ ይፈልጉ (e.g. Carnot Cycle, Limits, Redox)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ፈልግ'}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {results.map((r, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-xs font-bold text-emerald-600 uppercase">{r.subject}</span>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">{r.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">{r.summary}</p>
            <div className="text-[11px] text-slate-400 font-mono">{r.textbookPageRef}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
