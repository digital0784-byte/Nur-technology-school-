import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Compass } from 'lucide-react';

export const CareerPathwaysView: React.FC = () => {
  const { t } = useLanguage();

  const pathways = [
    {
      title: 'Software Engineering & AI Technology',
      stream: 'Natural Science',
      university: 'Addis Ababa University (AAiT), ASTU, AASTU',
      description: 'Focus on Calculus, Discrete Math, IT, and Algorithm design to develop national software infrastructure.',
    },
    {
      title: 'Civil & Dam Hydroelectric Engineering',
      stream: 'Natural Science',
      university: 'Arba Minch University (Water Technology), Bahir Dar',
      description: 'Physics kinematics, thermodynamics, and geology for large infrastructure projects like GERD.',
    },
    {
      title: 'Biomedical & Clinical Medicine',
      stream: 'Natural Science',
      university: 'Tikur Anbessa (AAU), Gondar, Jimma University',
      description: 'Cell biology, biochemistry, genetics, and public healthcare epidemiology.',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700 text-[11px] font-bold uppercase mb-1">
          <Compass className="w-3.5 h-3.5" />
          {t('mod_career_pathways')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_career_pathways')}</h1>
        <p className="text-xs sm:text-sm text-emerald-100">{t('mod_career_pathways_sub')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pathways.map((c, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {c.stream}
            </span>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1.5">{c.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{c.description}</p>
            <div className="pt-2 border-t text-[11px] text-slate-400">
              <span className="font-bold text-slate-600 dark:text-slate-300">Top Universities:</span> {c.university}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
