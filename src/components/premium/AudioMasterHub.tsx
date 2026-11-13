import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../types';
import { PREMIUM_AUDIO_REVISIONS } from '../../data/premiumHubData';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Volume2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Globe,
  Radio,
  Sliders,
  Repeat,
  Share2,
} from 'lucide-react';

interface AudioFlashcard {
  id: string;
  subject: string;
  frontPrompt: Record<Language, string>;
  backMnemonic: Record<Language, string>;
  durationSec: number;
}

const AUDIO_FLASHCARDS: AudioFlashcard[] = [
  {
    id: 'afc-1',
    subject: 'Chemistry',
    frontPrompt: {
      am: 'የ VSEPR ሞለኪውል የኤሌክትሮን ጥንዶች ግፊት ቅደም ተከተል ምንድን ነው?',
      om: 'Tartiba dhiibbaa elektiroonota VSEPR maali?',
      ti: 'ናይ VSEPR ሞለኪውል ምግፋፍ ቅደም ሰዓብ እንታይ እዩ?',
      ar: 'ما هو الترتيب التنازلي لقوى التنافر بين أزواج الإلكترونات وفق نظرية VSEPR؟',
      so: 'Waa maxay amarka isku celinta lammaanaha electron-ka ee VSEPR?',
      en: 'What is the decreasing repulsion hierarchy of electron pairs in VSEPR theory?',
    },
    backMnemonic: {
      am: 'Mnemonic: LL > LB > BB — Lone Pair-Lone Pair (ከፍተኛ) > Lone Pair-Bond Pair > Bond Pair-Bond Pair (ዝቅተኛ)።',
      om: 'LL > LB > BB — Lone Pair-Lone Pair irra caala.',
      ti: 'LL > LB > BB — ናይ Lone Pair ምግፋፍ ዝለዓለ እዩ።',
      ar: 'زوج حر-زوج حر > زوج حر-زوج رابط > زوج رابط-زوج رابط (تنافر الأزواج الحرة هو الأكبر).',
      so: 'LL > LB > BB — Lammaanaha xorta ah ayaa isku celiya ugu badan.',
      en: 'Mnemonic: LL > LB > BB. Lone Pair-Lone Pair repulsion is greatest, followed by Lone-Bond, then Bond-Bond.',
    },
    durationSec: 32,
  },
  {
    id: 'afc-2',
    subject: 'Physics',
    frontPrompt: {
      am: 'የፋራዴይ የኢንዳክሽን ሕግ እና የሌንዝ ሕግ የቀመር ትርጉም?',
      om: 'Seera Faaraadeey fi Seera Leenz maali?',
      ti: 'ሕጊ ፈራዴይን ሌንዝን ትርጉም ቀመር እንታይ እዩ?',
      ar: 'ما هو المدلول الفيزيائي للإشارة السالبة في قانون فاراداي ε = -N (ΔΦ/Δt)؟',
      so: 'Waa maxay macnaha calaamadda taban ee sharciga Faraday?',
      en: 'What is the physical meaning of the negative sign in Faraday’s Law ε = -N(ΔΦ/Δt)?',
    },
    backMnemonic: {
      am: 'Mnemonic: "LENZ = OPPOSITION". የተፈጠረው ኢ.ኤም.ኤፍ ሁልጊዜ የፍላክስ ለውጡን ይቃወማል (የኢነርጂ ጥበቃ ሕግ)።',
      om: '"LENZ = MORMAA". EMF jijjiirama mormuuf uumama.',
      ti: '"LENZ = ተቓዋሚ"። ዝተፈጠረ ኢ.ኤም.ኤፍ ነቲ ለውጢ ይቃወም።',
      ar: 'قانون لينز وحفظ الطاقة: التيار الحثي يعاكس التغير في التدفق المغناطيسي المسبب له.',
      so: 'Sharciga Lenz: EMF wuxuu ka soo horjeedaa isbeddelka.',
      en: 'Lenz’s Law demonstrates conservation of energy: the induced EMF generates a magnetic field opposing the change in flux.',
    },
    durationSec: 40,
  },
  {
    id: 'afc-3',
    subject: 'Biology',
    frontPrompt: {
      am: 'የክሬብስ ዑደት (Krebs Cycle) ዋና ዋና ውጤቶች በአንድ ግሉኮስ ሞለኪውል?',
      om: 'Bu\'aan Krebs Cycle tokkoon tokkoon gulukoosiitiif maali?',
      ti: 'ናይ Krebs Cycle ውፅኢት ብሓደ ግሉኮስ እንታይ እዩ?',
      ar: 'ما هي النواتج الإجمالية لدورة كريبس لجزيء جلوكوز واحد (دورتان)؟',
      so: 'Waa maxay waxsoosaarka wareegga Krebs ee hal glucose?',
      en: 'What are the net products of the Krebs (Citric Acid) Cycle per glucose molecule?',
    },
    backMnemonic: {
      am: 'Mnemonic: 2 ATP, 6 NADH, 2 FADH₂, 4 CO₂ (ለ 2 የፓይሩቬት ዑደቶች)።',
      om: '2 ATP, 6 NADH, 2 FADH₂, 4 CO₂ uuma.',
      ti: '2 ATP, 6 NADH, 2 FADH₂, 4 CO₂ ይወፅእ።',
      ar: '2 ATP + 6 NADH + 2 FADH₂ + 4 CO₂ (ناتج دورتين لكل جزيء جلوكوز كامل).',
      so: '2 ATP, 6 NADH, 2 FADH₂, 4 CO₂.',
      en: 'Per glucose (2 turns): 2 ATP, 6 NADH, 2 FADH₂, and 4 CO₂ molecules released.',
    },
    durationSec: 36,
  },
];

const NATIONAL_LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'am', name: 'አማርኛ (Amharic)', flag: '🇪🇹' },
  { code: 'om', name: 'Afaan Oromoo', flag: '🇪🇹' },
  { code: 'ti', name: 'ትግርኛ (Tigrinya)', flag: '🇪🇹' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'so', name: 'Soomaali (Somali)', flag: '🇸🇴' },
  { code: 'en', name: 'English (UK/US)', flag: '🇬🇧' },
];

export const AudioMasterHub: React.FC = () => {
  const { language: currentAppLang } = useLanguage();
  const [selectedSpokenLang, setSelectedSpokenLang] = useState<Language>(currentAppLang || 'am');
  const [selectedTrackIdx, setSelectedTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(0.85);
  const [activeTab, setActiveTab] = useState<'podcasts' | 'flashcards'>('podcasts');

  // Flashcard states
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeTrack = PREMIUM_AUDIO_REVISIONS[selectedTrackIdx] || PREMIUM_AUDIO_REVISIONS[0];
  const activeCard = AUDIO_FLASHCARDS[activeCardIdx] || AUDIO_FLASHCARDS[0];

  // Speech synthesis for authentic multi-lingual spoken voice
  const speakText = (text: string, lang: Language) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackSpeed;
    if (lang === 'ar') utterance.lang = 'ar-SA';
    else if (lang === 'en') utterance.lang = 'en-US';
    else utterance.lang = 'am-ET';

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const textToSpeak =
        activeTab === 'podcasts'
          ? activeTrack.transcripts[selectedSpokenLang] || activeTrack.transcripts.en
          : isCardFlipped
          ? activeCard.backMnemonic[selectedSpokenLang] || activeCard.backMnemonic.en
          : activeCard.frontPrompt[selectedSpokenLang] || activeCard.frontPrompt.en;

      speakText(textToSpeak, selectedSpokenLang);
    }
  };

  // Audio Progress Timer loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTimeSec((t) => {
        const next = t + 1 * playbackSpeed;
        const totalDuration =
          activeTab === 'podcasts' ? activeTrack.audioDurationSeconds : activeCard.durationSec;
        if (next >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, activeTab, activeTrack, activeCard]);

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
        const totalDuration =
          activeTab === 'podcasts' ? activeTrack.audioDurationSeconds : activeCard.durationSec;
        const progressRatio = currentTimeSec / totalDuration;
        const isCurrentBar = i / barsCount <= progressRatio;

        let heightRatio = 0.2 + 0.3 * Math.sin(i * 0.3 + phase);
        if (isPlaying) {
          heightRatio += 0.4 * Math.abs(Math.sin(i * 0.5 + phase * 2));
        }

        const barHeight = Math.max(4, h * heightRatio * 0.85);
        const x = i * (barWidth + 2);
        const y = (h - barHeight) / 2;

        ctx.fillStyle = isCurrentBar ? '#10B981' : '#334155';
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      if (isPlaying) phase += 0.15;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, currentTimeSec, activeTab, activeTrack, activeCard]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 text-white animate-in fade-in">
      {/* 1. Language & Podcast Navigation Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-emerald-300">
              Audio Master Hub & Spoken Podcasts
            </h3>
            <p className="text-xs text-slate-400">
              High-Yield Audio Chapter Summaries & Offline Audio Flashcards in 6 National Languages
            </p>
          </div>
        </div>

        {/* Spoken National Language Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold px-2 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            Language:
          </span>
          {NATIONAL_LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setSelectedSpokenLang(l.code);
                if (isPlaying && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsPlaying(false);
                }
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                selectedSpokenLang === l.code
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Toggle: Podcasts vs Audio Flashcards */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setActiveTab('podcasts');
            setIsPlaying(false);
            setCurrentTimeSec(0);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'podcasts'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Radio className="w-4 h-4" />
          Studio Chapter Summaries ({PREMIUM_AUDIO_REVISIONS.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('flashcards');
            setIsPlaying(false);
            setCurrentTimeSec(0);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'flashcards'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Spoken Audio Flashcards ({AUDIO_FLASHCARDS.length})
        </button>
      </div>

      {activeTab === 'podcasts' ? (
        /* PODCASTS VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visualizer and Player (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    {activeTrack.subject} • Grade {activeTrack.grade}
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">
                    {activeTrack.title[selectedSpokenLang] || activeTrack.title.en}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Grade {activeTrack.grade} High-Yield Audio • {activeTrack.durationMinutes} Minutes
                  </p>
                </div>

                {/* Stream-Only Policy Badge (Downloads Disabled) */}
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border bg-slate-950 border-rose-500/40 text-rose-300">
                  <span>🔒 Stream Only • ማውረድ ተከልክሏል</span>
                </span>
              </div>

              {/* Dynamic Waveform Canvas Visualizer */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <canvas ref={canvasRef} width={600} height={90} className="w-full h-24" />
                <div className="flex justify-between text-xs font-mono text-slate-400 mt-2">
                  <span>{formatTime(currentTimeSec)}</span>
                  <span>{formatTime(activeTrack.audioDurationSeconds)}</span>
                </div>
              </div>

              {/* Player Transport Controls */}
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentTimeSec((t) => Math.max(0, t - 15))}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <Rewind className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleTogglePlay}
                    className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                  </button>

                  <button
                    onClick={() =>
                      setCurrentTimeSec((t) => Math.min(activeTrack.audioDurationSeconds, t + 15))
                    }
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <FastForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Speed Toggle: 0.75x, 1.0x, 1.25x, 1.5x */}
                <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  {[0.75, 1.0, 1.25, 1.5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPlaybackSpeed(s)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                        playbackSpeed === s ? 'bg-emerald-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Narration Script in Selected National Language */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  Spoken Chapter Narration Transcript:
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  {activeTrack.transcripts[selectedSpokenLang] || activeTrack.transcripts.en}
                </p>
              </div>
            </div>
          </div>

          {/* Podcast Tracklist Sidebar (1 col) */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-extrabold text-emerald-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                Select Chapter Audio
              </h4>

              <div className="space-y-2">
                {PREMIUM_AUDIO_REVISIONS.map((track, idx) => (
                  <button
                    key={track.id}
                    onClick={() => {
                      setSelectedTrackIdx(idx);
                      setCurrentTimeSec(0);
                      if (isPlaying && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        setIsPlaying(false);
                      }
                    }}
                    className={`w-full p-3 rounded-2xl text-left border transition ${
                      selectedTrackIdx === idx
                        ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-emerald-400 uppercase block">
                      {track.subject} • Grade {track.grade}
                    </span>
                    <h5 className="text-xs font-black text-white mt-1 leading-snug">
                      {track.title[selectedSpokenLang] || track.title.en}
                    </h5>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>⏱ {formatTime(track.audioDurationSeconds)}</span>
                      <span>Stream Only</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* AUDIO FLASHCARDS VIEW */
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-xl space-y-5 text-center">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
              <span className="font-bold text-emerald-400">
                Audio Flashcard #{activeCardIdx + 1} of {AUDIO_FLASHCARDS.length} ({activeCard.subject})
              </span>
              <span className="font-mono text-slate-400">⏱ {activeCard.durationSec}s summary</span>
            </div>

            {/* Flashcard Body with Flip Toggle */}
            <div
              onClick={() => setIsCardFlipped(!isCardFlipped)}
              className="p-8 rounded-3xl bg-slate-950 border border-slate-800 min-h-[200px] flex flex-col justify-center items-center cursor-pointer hover:border-emerald-500/50 transition group"
            >
              <span className="text-[10px] uppercase font-bold text-slate-400 mb-2 block">
                {isCardFlipped ? '💡 Mnemonic & Answer (Click to see question)' : '❓ High-Yield Question (Click to reveal answer)'}
              </span>
              <p className="text-base font-bold text-white max-w-md leading-relaxed">
                {isCardFlipped
                  ? activeCard.backMnemonic[selectedSpokenLang] || activeCard.backMnemonic.en
                  : activeCard.frontPrompt[selectedSpokenLang] || activeCard.frontPrompt.en}
              </p>
            </div>

            {/* Audio Spoken Button */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleTogglePlay}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause Spoken Audio' : 'Play Spoken Narration (አድምጥ)'}
              </button>

              <button
                onClick={() => {
                  setActiveCardIdx((i) => (i + 1) % AUDIO_FLASHCARDS.length);
                  setIsCardFlipped(false);
                  setIsPlaying(false);
                }}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
              >
                ቀጣይ ካርድ (Next Card) →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
