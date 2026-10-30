import React, { useState, useRef, useEffect } from 'react';
import { HighYieldAudioItem } from '../../types/premium';
import { useLanguage } from '../../context/LanguageContext';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Volume2,
  Headphones,
  BookOpen,
  Sparkles,
  Layers,
} from 'lucide-react';

interface AudioMasterclassPlayerProps {
  tracks: HighYieldAudioItem[];
}

export const AudioMasterclassPlayer: React.FC<AudioMasterclassPlayerProps> = ({ tracks }) => {
  const { language } = useLanguage();
  const [selectedTrackIdx, setSelectedTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(0.85);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeTrack = tracks[selectedTrackIdx] || tracks[0];

  // Simulated audio progress timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTimeSec((t) => {
        const next = t + 1 * playbackSpeed;
        if (next >= activeTrack.audioDurationSeconds) {
          setIsPlaying(false);
          return activeTrack.audioDurationSeconds;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, activeTrack.audioDurationSeconds]);

  // Audio Waveform Visualization on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const barsCount = 64;
      const barWidth = w / barsCount - 2;

      for (let i = 0; i < barsCount; i++) {
        // Amplitude modulated by play status and sine waves
        const progressRatio = currentTimeSec / activeTrack.audioDurationSeconds;
        const isCurrentBar = i / barsCount <= progressRatio;

        let heightRatio = 0.2 + 0.3 * Math.sin(i * 0.3 + phase);
        if (isPlaying) {
          heightRatio += 0.4 * Math.abs(Math.sin(i * 0.5 + phase * 2));
        }

        const barHeight = Math.max(4, h * heightRatio * 0.8);
        const x = i * (barWidth + 2);
        const y = (h - barHeight) / 2;

        ctx.fillStyle = isCurrentBar ? '#10B981' : '#334155';
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      if (isPlaying) phase += 0.1;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, currentTimeSec, activeTrack.audioDurationSeconds]);

  // Handle scrub
  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTimeSec(Number(e.target.value));
  };

  const skipSeconds = (delta: number) => {
    setCurrentTimeSec((t) =>
      Math.max(0, Math.min(activeTrack.audioDurationSeconds, t + delta))
    );
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 p-4 text-white">
      {/* Track Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h4 className="font-extrabold text-base text-emerald-300 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-emerald-400" />
            የድምፅ ትምህርት እና ማጠቃለያ (High-Yield Audio Revision Hub)
          </h4>
          <p className="text-xs text-slate-400">
            ከፈተና በፊት በ 10-15 ደቂቃ ውስጥ ፎርሙላዎችን እና ማስታወሻዎችን በድምፅ ይከልሱ
          </p>
        </div>

        {/* Track buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          {tracks.map((tr, idx) => (
            <button
              key={tr.id}
              onClick={() => {
                setSelectedTrackIdx(idx);
                setCurrentTimeSec(0);
                setIsPlaying(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedTrackIdx === idx
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ክፍል {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Player Box */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
              {activeTrack.subject.toUpperCase()} • GRADE {activeTrack.grade}
            </span>
            <h3 className="text-lg font-black text-white mt-1">
              {activeTrack.title[language] || activeTrack.title.am}
            </h3>
            <p className="text-xs text-slate-400">
              {activeTrack.topic[language] || activeTrack.topic.am}
            </p>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {[0.75, 1.0, 1.25, 1.5].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition ${
                  playbackSpeed === spd
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Live Audio Waveform Canvas */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800/80 p-3 flex justify-center shadow-inner">
          <canvas ref={canvasRef} width={680} height={70} className="w-full max-w-2xl h-16 block" />
        </div>

        {/* Progress Bar & Timestamps */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={activeTrack.audioDurationSeconds}
            step={1}
            value={currentTimeSec}
            onChange={handleScrub}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>{formatTime(currentTimeSec)}</span>
            <span>{formatTime(activeTrack.audioDurationSeconds)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 pt-1">
          <button
            onClick={() => skipSeconds(-10)}
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="10 ሰከንድ ወደ ኋላ"
          >
            <Rewind className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="p-4 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25 transition active:scale-95"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => skipSeconds(10)}
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="10 ሰከንድ ወደ ፊት"
          >
            <FastForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* High-Yield Cheatsheet Formulas and Mnemonics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Formulas */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            ከፍተኛ ውጤት የሚያስገኙ ቀመሮች (High-Yield Formulas)
          </span>
          <div className="space-y-1.5">
            {activeTrack.highYieldFormulas.map((f, i) => (
              <div key={i} className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300">
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Mnemonic Rhyme */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
          <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-purple-400" />
            የፈተና ማስታወሻ ዜማ (Memory Mnemonic)
          </span>
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs text-purple-200 leading-relaxed">
            {activeTrack.keyMnemonics[language] || activeTrack.keyMnemonics.am}
          </div>
        </div>
      </div>

      {/* Multilingual Synchronized Transcript */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-slate-400" />
          የትምህርቱ ጽሑፍ በ 6 ቋንቋዎች (Full Lesson Transcript)
        </span>
        <p
          className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 font-sans"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          {activeTrack.transcripts[language] || activeTrack.transcripts.am}
        </p>
      </div>
    </div>
  );
};
