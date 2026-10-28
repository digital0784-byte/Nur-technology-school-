import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Video, Play } from 'lucide-react';

export const VideoLearningView: React.FC = () => {
  const { activeGrade } = useAuth();
  const { t } = useLanguage();
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeVideoTopic, setActiveVideoTopic] = useState('Kinematics and Vectors (2D Animation)');

  const playlist = [
    { title: 'Kinematics & Projectiles (2D Animation)', duration: '14:20 min', instructor: 'Dr. Bekele M.' },
    { title: 'Chemical Reactions & Stoichiometry', duration: '18:45 min', instructor: 'Teacher Senait K.' },
    { title: 'Limits & Calculus in 3D Motion', duration: '22:10 min', instructor: 'Prof. Ahmed Adem' },
    { title: 'Electromagnetism & Hydroelectric Turbines', duration: '16:05 min', instructor: 'Eng. Solomon T.' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-900 to-amber-900 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-700 text-[11px] font-bold uppercase mb-1">
          <Video className="w-3.5 h-3.5" />
          {t('mod_video_learning')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_video_learning')}</h1>
        <p className="text-xs sm:text-sm text-rose-100">{t('mod_video_learning_sub')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-3">
          <div className="relative aspect-video rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shadow-xl">
            {isPlayingVideo ? (
              <div className="p-6 text-center text-white space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600 animate-pulse mx-auto flex items-center justify-center">
                  <Play className="w-6 h-6 fill-white" />
                </div>
                <h3 className="font-bold text-base">{activeVideoTopic}</h3>
                <p className="text-xs text-slate-400">
                  Streaming HD 1080p • Ethiopian MoE Certified Instructor Commentary
                </p>
                <button
                  type="button"
                  onClick={() => setIsPlayingVideo(false)}
                  className="px-4 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-semibold"
                >
                  Pause Video
                </button>
              </div>
            ) : (
              <div className="p-6 text-center text-white space-y-3">
                <button
                  type="button"
                  onClick={() => setIsPlayingVideo(true)}
                  className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center shadow-lg transition-transform hover:scale-105 mx-auto"
                >
                  <Play className="w-8 h-8 fill-white ml-1" />
                </button>
                <div className="font-bold text-sm sm:text-base">{activeVideoTopic}</div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Grade {activeGrade} HD Animation Video
                </span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {activeVideoTopic}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Visualizing abstract formulas using 2D and 3D simulations. Topics include velocity vectors, free-body resolution on inclined planes, and practical Ethiopian engineering case studies.
            </p>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recommended Video Lessons
          </h3>
          <div className="space-y-2">
            {playlist.map((vid, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveVideoTopic(vid.title);
                  setIsPlayingVideo(true);
                }}
                className="w-full p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all flex items-center gap-3 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {vid.title}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
                    <span>{vid.instructor}</span>
                    <span className="font-mono">{vid.duration}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
