import React, { useState, useEffect } from 'react';
import { VideoMasterclassItem, VideoChapter, VideoQuizCheckpoint } from '../../types/premium';
import { PREMIUM_VIDEO_MASTERCLASSES } from '../../data/premiumHubData';
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
  FlaskConical,
  HelpCircle,
  X,
  Volume2,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface LabExperimentDemo {
  id: string;
  subject: string;
  title: string;
  grade: number;
  duration: string;
  labApparatus: string[];
  safetyRules: string[];
  experimentSteps: string[];
  keyFormula: string;
  eueeImportance: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const LAB_EXPERIMENTS: LabExperimentDemo[] = [
  {
    id: 'lab-redox',
    subject: 'Chemistry',
    grade: 11,
    title: 'Redox Titration: Potassium Permanganate (KMnO₄) vs Iron(II) Sulfate',
    duration: '18:40',
    labApparatus: ['Burette with stopcock', '250mL Erlenmeyer flask', 'Pipette (25.0 mL)', 'Sulfuric Acid (1M H₂SO₄)'],
    safetyRules: ['KMnO₄ is a strong oxidizer; wear safety goggles and latex gloves', 'Add acid slowly to prevent splashing'],
    experimentSteps: [
      'Pipette 25.0 mL of unknown Fe²⁺ solution into the Erlenmeyer flask.',
      'Add 20 mL of dilute H₂SO₄ to provide an acidic medium.',
      'Titrate with standard 0.020 M KMnO₄ until permanent faint pink endpoint appears (30 seconds).',
      'Record initial and final burette readings to calculate stoichiometric moles.',
    ],
    keyFormula: '5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O (Mole ratio 5:1)',
    eueeImportance: 'Appears in over 85% of EUEE Chemistry National Exams (Stoichiometry & Redox).',
    quiz: {
      question: 'Why is an external chemical indicator (like phenolphthalein) NOT required in a KMnO₄ redox titration?',
      options: [
        'KMnO₄ acts as its own self-indicator turning from purple to colorless Mn²⁺ until pink at endpoint.',
        'The reaction generates so much heat that indicators break down.',
        'Sulfuric acid already contains an internal color-changing dye.',
        'Iron(II) turns immediately blue when oxidized.',
      ],
      correctIndex: 0,
      explanation: 'MnO₄⁻ ions are deeply purple, while Mn²⁺ ions in acidic solution are virtually colorless. The first excess drop of KMnO₄ imparts a permanent faint pink tint, making KMnO₄ a self-indicator.',
    },
  },
  {
    id: 'lab-projectile',
    subject: 'Physics',
    grade: 10,
    title: 'Real Trajectory Kinematics & Ballistic Pendulum Motion',
    duration: '22:15',
    labApparatus: ['Spring-loaded projectile launcher', 'Carbon paper & white landing sheet', 'Photogate timer', 'Plumb bob & meter rule'],
    safetyRules: ['Never look directly into the barrel of the loaded launcher', 'Clear the landing trajectory zone before firing'],
    experimentSteps: [
      'Clamp the ballistic launcher horizontally at measured height h = 1.25 m above the floor.',
      'Fire the steel sphere through photogates 5 times to establish mean muzzle velocity v₀.',
      'Calculate theoretical horizontal range R = v₀ * √(2h/g).',
      'Compare calculated theoretical impact with carbon paper strike marks to evaluate drag percentage.',
    ],
    keyFormula: 'R = v₀ * √(2h/g), Time of flight t = √(2h/g)',
    eueeImportance: 'High-yield practical problem on EUEE Physics Paper Unit 3.',
    quiz: {
      question: 'If the launch height h is quadrupled (4h) while horizontal velocity v₀ remains constant, what happens to the range R?',
      options: [
        'The range doubles (2R) because time of flight t is proportional to √h.',
        'The range quadruples (4R).',
        'The range stays identical since horizontal velocity is unchanged.',
        'The range is halved.',
      ],
      correctIndex: 0,
      explanation: 'Time of flight t = √(2h/g). If h becomes 4h, t becomes √(4) * t = 2t. Since R = v₀ * t, the range exactly doubles.',
    },
  },
  {
    id: 'lab-meiosis',
    subject: 'Biology',
    grade: 11,
    title: 'Cell Meiosis & Crossing Over Under High-Resolution Microscopy',
    duration: '16:50',
    labApparatus: ['Compound optical microscope (1000x oil immersion)', 'Prepared Allium cepa (onion root) slides', 'Aceto-carmine nuclear stain'],
    safetyRules: ['Handle cover slips carefully to avoid glass splinter lacerations', 'Use lens paper only for cleaning oil immersion lenses'],
    experimentSteps: [
      'Locate the meristematic zone of the prepared anther section under 100x low power.',
      'Switch to 400x and 1000x to identify Prophase I chiasmata (crossing over loci).',
      'Distinguish homologous chromosome alignment during Metaphase I vs Sister chromatid separation in Anaphase II.',
      'Log gametic variation counts and calculate recombinant frequencies.',
    ],
    keyFormula: 'Recombination Frequency = (Total Recombinants / Total Offspring) * 100%',
    eueeImportance: 'Crucial genetics question on Grade 11/12 National Biology exam papers.',
    quiz: {
      question: 'During which exact phase of meiosis does genetic crossing-over (chiasma formation) occur?',
      options: [
        'Prophase I (Pachytene sub-stage)',
        'Metaphase II',
        'Telophase I',
        'Anaphase I',
      ],
      correctIndex: 0,
      explanation: 'Crossing over between non-sister chromatids of homologous chromosomes occurs specifically during Prophase I of Meiosis I (in the pachytene stage).',
    },
  },
];

export const VideoMasterclassHub: React.FC = () => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'curriculum' | 'labs'>('curriculum');
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);
  const [selectedLabIdx, setSelectedLabIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [activeCheckpoint, setActiveCheckpoint] = useState<VideoQuizCheckpoint | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [isLabQuizModalOpen, setIsLabQuizModalOpen] = useState(false);
  const [labQuizSelectedAnswer, setLabQuizSelectedAnswer] = useState<number | null>(null);
  const [labQuizSubmitted, setLabQuizSubmitted] = useState(false);

  const activeVideo = PREMIUM_VIDEO_MASTERCLASSES[selectedVideoIdx] || PREMIUM_VIDEO_MASTERCLASSES[0];
  const activeLab = LAB_EXPERIMENTS[selectedLabIdx] || LAB_EXPERIMENTS[0];

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
    }, 1000 / playbackSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, activeVideo, activeCheckpoint, quizAnswered, playbackSpeed]);

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
    <div className="space-y-6 text-white animate-in fade-in">
      {/* Category Toggle: Curriculum Masterclasses vs Real-World Labs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-amber-500/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-amber-300">
              HD Video Masterclasses & Lab Demonstrations
            </h3>
            <p className="text-[11px] text-slate-400">
              Synchronized with Ethiopian MoE 2019 E.C. Curriculum (Grades 9-12)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setSelectedCategory('curriculum');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              selectedCategory === 'curriculum'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Curriculum Lectures ({PREMIUM_VIDEO_MASTERCLASSES.length})
          </button>
          <button
            onClick={() => {
              setSelectedCategory('labs');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              selectedCategory === 'labs'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            Real Lab Demonstrations ({LAB_EXPERIMENTS.length})
          </button>
        </div>
      </div>

      {selectedCategory === 'curriculum' ? (
        /* =================== CURRICULUM LECTURES VIEW =================== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Viewport (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Simulated 1080p Video Canvas */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 shadow-2xl flex flex-col justify-between p-6">
              {/* Top Watermark & Badge */}
              <div className="flex items-center justify-between text-xs z-10">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-300 font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  1080p HD Studio Master
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-slate-300 text-[11px] font-mono">
                  Grade {activeVideo.grade} • {activeVideo.badge}
                </span>
              </div>

              {/* Center Play Graphic or In-lecture Slide */}
              <div className="flex flex-col items-center justify-center text-center my-auto z-10 space-y-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition"
                >
                  {isPlaying ? <Pause className="w-9 h-9" /> : <Play className="w-9 h-9 ml-1" />}
                </button>

                <div className="max-w-md">
                  <h3 className="text-lg font-black text-white leading-tight">
                    {activeVideo.title[language] || activeVideo.title.en}
                  </h3>
                  <p className="text-xs text-amber-200/90 mt-1">
                    {activeVideo.instructor.name} • {activeVideo.instructor.role}
                  </p>
                </div>
              </div>

              {/* Checkpoint Popover Interruption */}
              {activeCheckpoint && (
                <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md p-6 flex flex-col justify-center items-center animate-in fade-in">
                  <div className="max-w-md w-full bg-slate-900 border border-amber-500/50 rounded-2xl p-5 shadow-2xl space-y-4">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <HelpCircle className="w-4 h-4" />
                      In-Video Comprehension Checkpoint
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {activeCheckpoint.question[language] || activeCheckpoint.question.en}
                    </p>

                    <div className="space-y-2">
                      {activeCheckpoint.options[language]?.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => setQuizAnswered(oIdx)}
                          className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold border transition ${
                            quizAnswered === null
                              ? 'bg-slate-800 border-slate-700 hover:border-amber-400'
                              : oIdx === activeCheckpoint.correctIndex
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                              : quizAnswered === oIdx
                              ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                              : 'bg-slate-800/40 border-slate-800 text-slate-500'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {quizAnswered !== null && (
                      <div className="pt-2 text-xs text-slate-300 space-y-2">
                        <p className="text-[11px] leading-relaxed">
                          💡 {activeCheckpoint.explanation[language] || activeCheckpoint.explanation.en}
                        </p>
                        <button
                          onClick={() => {
                            setActiveCheckpoint(null);
                            setIsPlaying(true);
                          }}
                          className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                        >
                          ትምህርቱን ቀጥል (Resume Masterclass)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Scrubber & Controls */}
              <div className="space-y-2 z-10 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                {/* Progress Bar */}
                <div
                  className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const ratio = (e.clientX - rect.left) / rect.width;
                    handleJumpToTime(Math.floor(ratio * activeVideo.durationSeconds));
                  }}
                >
                  <div
                    className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full transition-all"
                    style={{
                      width: `${(currentTimeSec / activeVideo.durationSeconds) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:text-amber-400 transition"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleJumpToTime(0)}
                      className="hover:text-amber-400 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-[11px]">
                      {formatTime(currentTimeSec)} / {activeVideo.durationFormatted}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Speed Selector */}
                    <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-lg text-[10px]">
                      <Sliders className="w-3 h-3 text-slate-400" />
                      {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => setPlaybackSpeed(s)}
                          className={`px-1 rounded ${
                            playbackSpeed === s ? 'text-amber-400 font-bold' : 'text-slate-400'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lecture Selection Carousel */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Curriculum Topic:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PREMIUM_VIDEO_MASTERCLASSES.map((vid, idx) => (
                  <button
                    key={vid.id}
                    onClick={() => {
                      setSelectedVideoIdx(idx);
                      setCurrentTimeSec(0);
                      setIsPlaying(false);
                      setActiveCheckpoint(null);
                      setQuizAnswered(null);
                    }}
                    className={`p-3 rounded-2xl text-left border transition ${
                      selectedVideoIdx === idx
                        ? 'bg-amber-950/40 border-amber-500/80 ring-1 ring-amber-500/30'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-amber-400 block uppercase">
                      Grade {vid.grade} • {vid.subject}
                    </span>
                    <h5 className="text-xs font-black text-white mt-1 line-clamp-1">
                      {vid.title[language] || vid.title.en}
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      ⏱ {vid.durationFormatted}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Companion Notes Sidebar (1 col) */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-extrabold text-amber-300 flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-amber-400" />
                  Timestamped Chapter Links
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Jump to point</span>
              </div>

              {/* Clickable Chapter Points */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {activeVideo.chapters.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => handleJumpToTime(ch.timeSeconds)}
                    className="w-full p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 text-left transition flex items-start gap-2.5 group"
                  >
                    <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded shrink-0">
                      {ch.timeFormatted}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                        {ch.title[language] || ch.title.en}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {ch.keyTakeaway[language] || ch.keyTakeaway.en}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Formula Cheatsheet */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Key Formulas & Derivations
                </h5>
                <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-[11px] text-emerald-300">
                  {(activeVideo.formulaCheatsheet || []).map((formula, fIdx) => (
                    <div key={fIdx} className="truncate">
                      • {formula}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =================== REAL-WORLD LABS VIEW =================== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Lab Experiment Viewport (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900 border border-teal-500/40 shadow-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                    {activeLab.subject} • Grade {activeLab.grade} Practical Lab
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">{activeLab.title}</h3>
                </div>
                <button
                  onClick={() => {
                    setIsLabQuizModalOpen(true);
                    setLabQuizSelectedAnswer(null);
                    setLabQuizSubmitted(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition active:scale-95"
                >
                  <FileCheck className="w-4 h-4" />
                  Take Lab Quiz (ፈተና ውሰድ)
                </button>
              </div>

              {/* Apparatus & Safety */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <h5 className="text-xs font-extrabold text-teal-300 flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-teal-400" />
                    Required Lab Apparatus:
                  </h5>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {activeLab.labApparatus.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <h5 className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    Laboratory Safety Guidelines:
                  </h5>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {activeLab.safetyRules.map((rule, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step-by-Step Procedure */}
              <div className="space-y-2">
                <h5 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                  Step-by-Step Practical Procedure:
                </h5>
                <div className="space-y-2">
                  {activeLab.experimentSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Governing Reaction / Equation Box */}
              <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 font-mono text-xs text-teal-200">
                <span className="text-[10px] uppercase font-bold text-teal-400 block mb-1">
                  Governing Principle & Stoichiometry:
                </span>
                {activeLab.keyFormula}
              </div>
            </div>
          </div>

          {/* Lab Selector Sidebar (1 col) */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-extrabold text-teal-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                <FlaskConical className="w-4 h-4 text-teal-400" />
                Select Laboratory Experiment
              </h4>

              <div className="space-y-2">
                {LAB_EXPERIMENTS.map((lab, idx) => (
                  <button
                    key={lab.id}
                    onClick={() => {
                      setSelectedLabIdx(idx);
                      setLabQuizSelectedAnswer(null);
                      setLabQuizSubmitted(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl text-left border transition ${
                      selectedLabIdx === idx
                        ? 'bg-teal-950/40 border-teal-500/80 ring-1 ring-teal-500/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-teal-400 uppercase block">
                      {lab.subject} • Grade {lab.grade}
                    </span>
                    <h5 className="text-xs font-black text-white mt-1 leading-snug">
                      {lab.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                      ⏱ {lab.duration} • MoE Lab Manual
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lab Quiz Modal */}
      {isLabQuizModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-900 border border-teal-500/50 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-400" />
                <h4 className="text-sm font-bold text-white">Lab Experiment Competency Quiz</h4>
              </div>
              <button
                onClick={() => setIsLabQuizModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-teal-200">
                {activeLab.quiz.question}
              </p>

              <div className="space-y-2">
                {activeLab.quiz.options.map((opt, idx) => {
                  const isSelected = labQuizSelectedAnswer === idx;
                  const isCorrect = idx === activeLab.quiz.correctIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => !labQuizSubmitted && setLabQuizSelectedAnswer(idx)}
                      disabled={labQuizSubmitted}
                      className={`w-full p-3 rounded-2xl text-left text-xs font-semibold border transition ${
                        !labQuizSubmitted
                          ? isSelected
                            ? 'bg-teal-950 border-teal-500 text-teal-200'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                          : isCorrect
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                          : isSelected
                          ? 'bg-rose-950 border-rose-500 text-rose-300'
                          : 'bg-slate-800/40 border-slate-800 text-slate-500'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {labQuizSubmitted && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-teal-300 block">ማብራሪያ (Pedagogical Solution):</span>
                  <p>{activeLab.quiz.explanation}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              {!labQuizSubmitted ? (
                <button
                  onClick={() => setLabQuizSubmitted(true)}
                  disabled={labQuizSelectedAnswer === null}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs"
                >
                  መልስህን አረጋግጥ (Submit Answer)
                </button>
              ) : (
                <button
                  onClick={() => setIsLabQuizModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  ዝጋ (Close)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
