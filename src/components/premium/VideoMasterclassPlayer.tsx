import React, { useState, useEffect } from 'react';
import { VideoMasterclassItem, VideoChapter, VideoQuizCheckpoint } from '../../types/premium';
import { useLanguage } from '../../context/LanguageContext';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Award,
  Video,
  ListOrdered,
  FileCheck,
} from 'lucide-react';

interface VideoMasterclassPlayerProps {
  videos: VideoMasterclassItem[];
}

export const VideoMasterclassPlayer: React.FC<VideoMasterclassPlayerProps> = ({ videos }) => {
  const { language } = useLanguage();
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [activeCheckpoint, setActiveCheckpoint] = useState<VideoQuizCheckpoint | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);

  const activeVideo = videos[selectedVideoIdx] || videos[0];

  // Video progress timer loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTimeSec((t) => {
        const next = t + 1;

        // Check if there is an active checkpoint quiz at this timestamp
        const checkpoint = activeVideo.checkpoints.find(
          (c) => Math.abs(c.timeSeconds - next) <= 1
        );
        if (checkpoint && !activeCheckpoint && quizAnswered === null) {
          setIsPlaying(false);
          setActiveCheckpoint(checkpoint);
        }

        if (next >= activeVideo.durationSeconds) {
          setIsPlaying(false);
          return activeVideo.durationSeconds;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, activeVideo, activeCheckpoint, quizAnswered]);

  const handleJumpToTime = (seconds: number) => {
    setCurrentTimeSec(seconds);
    setActiveCheckpoint(null);
    setQuizAnswered(null);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 p-4 text-white">
      {/* Lesson Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h4 className="font-extrabold text-base text-amber-300 flex items-center gap-2">
            <Video className="w-5 h-5 text-amber-400" />
            HD ቪዲዮ ማስተርክላስ ቤተ-መጽሐፍት (HD Masterclasses)
          </h4>
          <p className="text-xs text-slate-400">
            በከፍተኛ የኢትዮጵያ የትምህርት ባለሙያዎች የተዘጋጁ ጥራት ያላቸው የቪዲዮ ትምህርቶች
          </p>
        </div>

        {/* Video selector buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          {videos.map((vid, idx) => (
            <button
              key={vid.id}
              onClick={() => {
                setSelectedVideoIdx(idx);
                setCurrentTimeSec(0);
                setIsPlaying(false);
                setActiveCheckpoint(null);
                setQuizAnswered(null);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedVideoIdx === idx
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ቪዲዮ {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Video Viewport & Chapters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Video Viewport Player (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative aspect-video rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between">
            {/* Visual Simulated Masterclass Screen */}
            <div
              className={`absolute inset-0 bg-gradient-to-tr ${activeVideo.thumbnailGradient} opacity-90 flex flex-col items-center justify-center p-6 text-center select-none`}
            >
              {/* Animated STEM chalkboard visuals */}
              <div className="space-y-2 max-w-md">
                <span className="inline-block px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-amber-300 border border-white/10 text-[10px] font-bold uppercase tracking-wider">
                  {activeVideo.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
                  {activeVideo.title[language] || activeVideo.title.am}
                </h3>
                <p className="text-xs text-slate-200 drop-shadow">
                  {activeVideo.instructor.name}
                </p>
                <div className="text-[11px] text-amber-200/90 font-mono pt-2">
                  {formatTime(currentTimeSec)} / {activeVideo.durationFormatted}
                </div>
              </div>

              {/* Mid-video checkpoint quiz overlay */}
              {activeCheckpoint && (
                <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
                  <div className="max-w-md w-full p-5 rounded-2xl bg-slate-900 border border-amber-500/50 text-left space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                      <Sparkles className="w-4 h-4" />
                      የመረዳት ማረጋገጫ ፈተና (Checkpoint Quiz)
                    </div>
                    <p className="text-sm font-medium text-white">
                      {activeCheckpoint.question[language] || activeCheckpoint.question.am}
                    </p>

                    <div className="space-y-1.5">
                      {(activeCheckpoint.options[language] || activeCheckpoint.options.am).map(
                        (opt, optIdx) => {
                          const isCorrect = optIdx === activeCheckpoint.correctIndex;
                          const isChosen = quizAnswered === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => setQuizAnswered(optIdx)}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition ${
                                quizAnswered !== null
                                  ? isCorrect
                                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                                    : isChosen
                                    ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                                    : 'bg-slate-800 text-slate-400 border-slate-700'
                                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        }
                      )}
                    </div>

                    {quizAnswered !== null && (
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] text-slate-300">
                          {quizAnswered === activeCheckpoint.correctIndex
                            ? '✅ ትክክል! ድንቅ ግንዛቤ!'
                            : '💡 ማብራሪያውን ይመልከቱ።'}
                        </span>
                        <button
                          onClick={() => {
                            setActiveCheckpoint(null);
                            setIsPlaying(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                        >
                          ቪዲዮውን ቀጥል (Resume)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls Bar on Video */}
            <div className="relative z-10 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2">
              {/* Scrub line */}
              <input
                type="range"
                min={0}
                max={activeVideo.durationSeconds}
                step={1}
                value={currentTimeSec}
                onChange={(e) => handleJumpToTime(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying((p) => !p)}
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                  <span className="text-xs font-mono text-slate-300">
                    {formatTime(currentTimeSec)} / {activeVideo.durationFormatted}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                    1080p HD
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructor & Lesson Bio */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-white">{activeVideo.instructor.name}</h4>
              <p className="text-xs text-amber-300/90">{activeVideo.instructor.role}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{activeVideo.instructor.credentials}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center shrink-0">
              <span className="text-xs font-bold text-amber-400 block">54 ETB</span>
              <span className="text-[10px] text-slate-400">Single Video Pack</span>
            </div>
          </div>
        </div>

        {/* Chapters & Key Takeaways (Col 3) */}
        <div className="space-y-4">
          {/* Chapter Navigation */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <ListOrdered className="w-4 h-4 text-amber-400" />
              የትምህርቱ ምዕራፎች (Interactive Chapters)
            </span>

            <div className="space-y-2">
              {activeVideo.chapters.map((ch) => {
                const isPast = currentTimeSec >= ch.timeSeconds;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleJumpToTime(ch.timeSeconds)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 text-left transition space-y-1 block"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white truncate pr-2">
                        {ch.title[language] || ch.title.am}
                      </span>
                      <span className="font-mono text-amber-300 text-[11px] shrink-0">
                        {ch.timeFormatted}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {ch.keyTakeaway[language] || ch.keyTakeaway.am}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formula Cheatsheet */}
          {activeVideo.formulaCheatsheet && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                የፎርሙላ ማጠቃለያ ካርድ (Formula Cheatsheet)
              </span>
              <div className="space-y-1.5">
                {activeVideo.formulaCheatsheet.map((f, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-200">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
