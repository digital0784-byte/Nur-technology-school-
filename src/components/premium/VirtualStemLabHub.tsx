import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  FlaskConical,
  Flame,
  Zap,
  Weight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Calculator,
  Sliders,
  FileText,
  Info,
} from 'lucide-react';

type LabWorkbenchType = 'titration' | 'hookes_law' | 'ohms_circuit' | 'calorimetry';

export const VirtualStemLabHub: React.FC = () => {
  const { language } = useLanguage();
  const [activeBench, setActiveBench] = useState<LabWorkbenchType>('titration');

  // Safety checklist states
  const [safetyGoggles, setSafetyGoggles] = useState(false);
  const [safetyGloves, setSafetyGloves] = useState(false);
  const [fumeHoodChecked, setFumeHoodChecked] = useState(false);
  const [hypothesisText, setHypothesisText] = useState('');

  // 1. Titration Experiment States
  const [titrantVolumeAddedMl, setTitrantVolumeAddedMl] = useState(0);
  const [acidInitialMolarity, setAcidInitialMolarity] = useState(0.1);
  const [acidVolumeMl, setAcidVolumeMl] = useState(25);
  const [measuredEquivalenceMl, setMeasuredEquivalenceMl] = useState<string>('');

  // 2. Hooke's Law Experiment States
  const [hangingMassGrams, setHangingMassGrams] = useState(150);
  const [springConstantK, setSpringConstantK] = useState(25); // N/m
  const [measuredDisplacementCm, setMeasuredDisplacementCm] = useState<string>('');

  // 3. Ohm's Law Workbench States
  const [batteryVoltageV, setBatteryVoltageV] = useState(12);
  const [resistorOhms, setResistorOhms] = useState(24);
  const [measuredCurrentAmps, setMeasuredCurrentAmps] = useState<string>('');

  // 4. Calorimetry Workbench States
  const [waterMassGrams, setWaterMassGrams] = useState(200);
  const [burnerTimeSec, setBurnerTimeSec] = useState(45);
  const [measuredTempRiseC, setMeasuredTempRiseC] = useState<string>('');

  // Safety complete check
  const isSafetyPassed = safetyGoggles && safetyGloves && fumeHoodChecked;

  // Evaluation calculations
  const calculateTitrationEvaluation = () => {
    // Standard 0.1 M NaOH: theoretical eq volume = (acidM * acidV) / 0.1
    const theoreticalMl = (acidInitialMolarity * acidVolumeMl) / 0.1;
    const studentVal = parseFloat(measuredEquivalenceMl);
    if (isNaN(studentVal) || studentVal <= 0) return null;
    const errorPct = (Math.abs(studentVal - theoreticalMl) / theoreticalMl) * 100;
    return {
      theoretical: theoreticalMl.toFixed(2),
      student: studentVal.toFixed(2),
      errorPct: errorPct.toFixed(1),
      isAccurate: errorPct <= 5.0,
    };
  };

  const calculateHookeEvaluation = () => {
    // F = m * g, elongation Δx = F / k
    const g = 9.8;
    const massKg = hangingMassGrams / 1000;
    const theoreticalCm = ((massKg * g) / springConstantK) * 100;
    const studentVal = parseFloat(measuredDisplacementCm);
    if (isNaN(studentVal) || studentVal <= 0) return null;
    const errorPct = (Math.abs(studentVal - theoreticalCm) / theoreticalCm) * 100;
    return {
      theoretical: theoreticalCm.toFixed(2),
      student: studentVal.toFixed(2),
      errorPct: errorPct.toFixed(1),
      isAccurate: errorPct <= 5.0,
    };
  };

  const calculateOhmEvaluation = () => {
    // I = V / R
    const theoreticalAmps = batteryVoltageV / resistorOhms;
    const studentVal = parseFloat(measuredCurrentAmps);
    if (isNaN(studentVal) || studentVal <= 0) return null;
    const errorPct = (Math.abs(studentVal - theoreticalAmps) / theoreticalAmps) * 100;
    return {
      theoretical: theoreticalAmps.toFixed(3),
      student: studentVal.toFixed(3),
      errorPct: errorPct.toFixed(1),
      isAccurate: errorPct <= 5.0,
    };
  };

  const calculateCalorimetryEvaluation = () => {
    // Q = m * c * ΔT. Assuming 150W burner output: Q = 150 * time. ΔT = Q / (m * 4.184)
    const energyJoules = 150 * burnerTimeSec;
    const theoreticalRise = energyJoules / (waterMassGrams * 4.184);
    const studentVal = parseFloat(measuredTempRiseC);
    if (isNaN(studentVal) || studentVal <= 0) return null;
    const errorPct = (Math.abs(studentVal - theoreticalRise) / theoreticalRise) * 100;
    return {
      theoretical: theoreticalRise.toFixed(1),
      student: studentVal.toFixed(1),
      errorPct: errorPct.toFixed(1),
      isAccurate: errorPct <= 7.0,
    };
  };

  return (
    <div className="space-y-6 text-white animate-in fade-in">
      {/* 1. Header Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-teal-300">
              Virtual STEM Science Laboratory Workbench
            </h3>
            <p className="text-xs text-slate-400">
              Interactive Apparatus, Safety Validation & Automated Measurement Error Analysis
            </p>
          </div>
        </div>

        {/* Bench Selector Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveBench('titration')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeBench === 'titration'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            Chemistry Titration
          </button>
          <button
            onClick={() => setActiveBench('hookes_law')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeBench === 'hookes_law'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Weight className="w-3.5 h-3.5" />
            Physics Hooke's Law
          </button>
          <button
            onClick={() => setActiveBench('ohms_circuit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeBench === 'ohms_circuit'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Ohm's Law Multimeter
          </button>
          <button
            onClick={() => setActiveBench('calorimetry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeBench === 'calorimetry'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Calorimetry Burner
          </button>
        </div>
      </div>

      {/* 2. Laboratory Pre-Flight Safety Checks & Hypothesis Protocol */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Phase 1: Laboratory Safety Protocol & PPE Verification
          </h4>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              isSafetyPassed
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            {isSafetyPassed ? '✓ Safety Certified (Ready to Operate)' : '⚠️ PPE Inspection Incomplete'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={safetyGoggles}
              onChange={(e) => setSafetyGoggles(e.target.checked)}
              className="w-4 h-4 accent-teal-500 rounded"
            />
            <span className="text-xs font-semibold text-slate-300">
              Safety Goggles Eyewear (የዓይን መነፅር)
            </span>
          </label>

          <label className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={safetyGloves}
              onChange={(e) => setSafetyGloves(e.target.checked)}
              className="w-4 h-4 accent-teal-500 rounded"
            />
            <span className="text-xs font-semibold text-slate-300">
              Acid/Chemical Nitrile Gloves (የእጅ ጓንት)
            </span>
          </label>

          <label className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={fumeHoodChecked}
              onChange={(e) => setFumeHoodChecked(e.target.checked)}
              className="w-4 h-4 accent-teal-500 rounded"
            />
            <span className="text-xs font-semibold text-slate-300">
              Fume Hood & Ventilation Verified (የአየር ማናፈሻ)
            </span>
          </label>
        </div>

        {/* Scientific Hypothesis Logging */}
        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-bold text-slate-300">
            Student Hypothesis & Experimental Prediction (ሳይንሳዊ መላምት):
          </label>
          <input
            type="text"
            value={hypothesisText}
            onChange={(e) => setHypothesisText(e.target.value)}
            placeholder="e.g. As the hanging mass doubles, the spring elongation will increase proportionally according to Hooke's Law..."
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* 3. Main Digital Workbench Station */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Apparatus Simulation (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 min-h-[420px] flex flex-col justify-between">
            {/* Workbench Top Status */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Active Apparatus Workbench
              </span>
              <span className="text-[11px] font-mono text-slate-400">MoE Practical Standard</span>
            </div>

            {/* BENCH 1: ACID-BASE TITRATION */}
            {activeBench === 'titration' && (
              <div className="space-y-6 my-auto text-center">
                {/* Visual Glassware Graphic */}
                <div className="flex items-center justify-center gap-8 py-4">
                  {/* Burette Graphic */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-mono mb-1">Burette (0.1M NaOH)</span>
                    <div className="w-6 h-48 bg-slate-950 border-2 border-slate-600 rounded-b-md relative overflow-hidden flex flex-col justify-end">
                      <div
                        className="bg-cyan-500/70 w-full transition-all"
                        style={{ height: `${Math.max(10, 100 - (titrantVolumeAddedMl / 50) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-cyan-300 font-mono mt-1">
                      {titrantVolumeAddedMl.toFixed(1)} mL Added
                    </span>
                  </div>

                  {/* Erlenmeyer Flask Graphic */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-mono mb-1">
                      Conical Flask ({acidVolumeMl}mL Unknown Acid)
                    </span>
                    <div className="w-24 h-28 bg-slate-950 border-2 border-slate-600 rounded-b-3xl relative overflow-hidden flex flex-col justify-end p-1">
                      {/* Solution with Color shift at equivalence */}
                      <div
                        className={`w-full rounded-b-2xl transition-all duration-500 ${
                          titrantVolumeAddedMl >= 24.5 && titrantVolumeAddedMl <= 26.5
                            ? 'bg-pink-500/80 shadow-lg shadow-pink-500/50' // Light pink endpoint
                            : titrantVolumeAddedMl > 26.5
                            ? 'bg-purple-700/80' // Over-titrated
                            : 'bg-slate-300/30' // Clear / colorless
                        }`}
                        style={{ height: '65%' }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">
                      pH: {(1 + (titrantVolumeAddedMl / 25) * 6).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Burette Stopcock Slider */}
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Burette Stopcock Dispenser:</span>
                    <span className="text-cyan-400 font-mono">{titrantVolumeAddedMl.toFixed(1)} mL</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={0.5}
                    value={titrantVolumeAddedMl}
                    onChange={(e) => setTitrantVolumeAddedMl(Number(e.target.value))}
                    disabled={!isSafetyPassed}
                    className="w-full accent-cyan-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0.0 mL (Start)</span>
                    <span className="text-pink-400 font-bold">Endpoint Range (~25.0 mL)</span>
                    <span>50.0 mL (Full)</span>
                  </div>
                </div>
              </div>
            )}

            {/* BENCH 2: HOOKE'S LAW SPRING */}
            {activeBench === 'hookes_law' && (
              <div className="space-y-6 my-auto text-center">
                <div className="flex items-center justify-center gap-12 py-4">
                  {/* Spring Graphic */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-2 bg-slate-700 rounded-t" />
                    {/* Visual Coil with stretch */}
                    <div
                      className="w-10 border-x-4 border-dashed border-amber-400 transition-all duration-300"
                      style={{
                        height: `${80 + (hangingMassGrams / 500) * 120}px`,
                      }}
                    />
                    {/* Hanging Weight Block */}
                    <div className="w-14 h-12 bg-slate-800 border-2 border-amber-500 rounded-lg flex items-center justify-center font-bold font-mono text-xs text-amber-300 shadow-md">
                      {hangingMassGrams}g
                    </div>
                  </div>

                  {/* Meter Ruler Graphic */}
                  <div className="h-56 w-8 bg-amber-950/40 border border-amber-500/40 rounded flex flex-col justify-between py-2 text-[9px] font-mono text-amber-300">
                    <span>0 cm</span>
                    <span>10 cm</span>
                    <span>20 cm</span>
                    <span>30 cm</span>
                    <span>40 cm</span>
                  </div>
                </div>

                <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Attached Calibrated Mass:</span>
                    <span className="text-amber-400 font-mono">{hangingMassGrams} grams</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={500}
                    step={25}
                    value={hangingMassGrams}
                    onChange={(e) => setHangingMassGrams(Number(e.target.value))}
                    disabled={!isSafetyPassed}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            )}

            {/* BENCH 3: OHM'S LAW MULTIMETER */}
            {activeBench === 'ohms_circuit' && (
              <div className="space-y-6 my-auto text-center">
                <div className="flex items-center justify-center gap-8 py-4">
                  {/* Digital Multimeter Display */}
                  <div className="p-4 rounded-3xl bg-slate-950 border-2 border-cyan-500/50 shadow-xl space-y-2 w-56 text-left">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>FLUKE DIGITAL DMM</span>
                      <span className="text-emerald-400">AUTO-RANGE</span>
                    </div>
                    <div className="bg-black p-3 rounded-xl border border-slate-800 font-mono text-right text-2xl font-black text-cyan-400">
                      {(batteryVoltageV / resistorOhms).toFixed(3)}{' '}
                      <span className="text-sm">A</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Source: {batteryVoltageV}V DC</span>
                      <span>Load: {resistorOhms}Ω</span>
                    </div>
                  </div>
                </div>

                <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-300">Power Supply Voltage (V):</span>
                      <span className="text-cyan-400 font-mono">{batteryVoltageV} V</span>
                    </div>
                    <input
                      type="range"
                      min={1.5}
                      max={24}
                      step={1.5}
                      value={batteryVoltageV}
                      onChange={(e) => setBatteryVoltageV(Number(e.target.value))}
                      disabled={!isSafetyPassed}
                      className="w-full accent-cyan-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">Variable Resistor (R):</span>
                      <span className="text-cyan-400 font-mono">{resistorOhms} Ω</span>
                    </div>
                    <input
                      type="range"
                      min={6}
                      max={100}
                      step={2}
                      value={resistorOhms}
                      onChange={(e) => setResistorOhms(Number(e.target.value))}
                      disabled={!isSafetyPassed}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* BENCH 4: CALORIMETRY BURNER */}
            {activeBench === 'calorimetry' && (
              <div className="space-y-6 my-auto text-center">
                <div className="flex items-center justify-center gap-8 py-4">
                  {/* Calorimeter Vessel Graphic */}
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-32 bg-slate-950 border-2 border-rose-500/50 rounded-2xl relative overflow-hidden flex flex-col justify-end p-1">
                      <div className="bg-blue-500/40 w-full h-3/4 rounded-b-xl flex items-center justify-center font-mono text-[10px] text-white">
                        {waterMassGrams}g H₂O
                      </div>
                    </div>
                    {/* Bunsen Burner Flame */}
                    <div className="w-6 h-10 bg-gradient-to-t from-orange-600 via-yellow-400 to-transparent rounded-full animate-pulse mt-1" />
                    <div className="w-12 h-3 bg-slate-700 rounded-b" />
                  </div>
                </div>

                <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Burner Heating Time:</span>
                    <span className="text-rose-400 font-mono">{burnerTimeSec} seconds</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={120}
                    step={5}
                    value={burnerTimeSec}
                    onChange={(e) => setBurnerTimeSec(Number(e.target.value))}
                    disabled={!isSafetyPassed}
                    className="w-full accent-rose-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Measurement Logging & Auto-Evaluator (1 col) */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-sm font-extrabold text-teal-300 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Calculator className="w-4 h-4 text-teal-400" />
              Automated Error Evaluator
            </h4>

            {/* Input field based on active bench */}
            {activeBench === 'titration' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Enter Measured Equivalence Endpoint (mL):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 25.0"
                    value={measuredEquivalenceMl}
                    onChange={(e) => setMeasuredEquivalenceMl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono focus:border-teal-500"
                  />
                </div>

                {calculateTitrationEvaluation() && (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-teal-500/40 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Theoretical Endpoint:</span>
                      <span className="font-mono text-teal-300">
                        {calculateTitrationEvaluation()?.theoretical} mL
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Your Reading:</span>
                      <span className="font-mono text-white">
                        {calculateTitrationEvaluation()?.student} mL
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1.5">
                      <span className="font-bold text-slate-300">Error Percentage:</span>
                      <span
                        className={`font-mono font-bold ${
                          calculateTitrationEvaluation()?.isAccurate
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {calculateTitrationEvaluation()?.errorPct}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeBench === 'hookes_law' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Enter Measured Spring Extension Δx (cm):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 5.88"
                    value={measuredDisplacementCm}
                    onChange={(e) => setMeasuredDisplacementCm(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono focus:border-amber-500"
                  />
                </div>

                {calculateHookeEvaluation() && (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/40 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Theoretical Δx:</span>
                      <span className="font-mono text-amber-300">
                        {calculateHookeEvaluation()?.theoretical} cm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Your Reading:</span>
                      <span className="font-mono text-white">
                        {calculateHookeEvaluation()?.student} cm
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1.5">
                      <span className="font-bold text-slate-300">Error Percentage:</span>
                      <span
                        className={`font-mono font-bold ${
                          calculateHookeEvaluation()?.isAccurate
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {calculateHookeEvaluation()?.errorPct}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeBench === 'ohms_circuit' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Enter Ammeter Current Reading I (Amps):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 0.500"
                    value={measuredCurrentAmps}
                    onChange={(e) => setMeasuredCurrentAmps(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono focus:border-cyan-500"
                  />
                </div>

                {calculateOhmEvaluation() && (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/40 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Theoretical Current:</span>
                      <span className="font-mono text-cyan-300">
                        {calculateOhmEvaluation()?.theoretical} A
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Your Reading:</span>
                      <span className="font-mono text-white">
                        {calculateOhmEvaluation()?.student} A
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1.5">
                      <span className="font-bold text-slate-300">Error Percentage:</span>
                      <span
                        className={`font-mono font-bold ${
                          calculateOhmEvaluation()?.isAccurate
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {calculateOhmEvaluation()?.errorPct}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeBench === 'calorimetry' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Enter Temperature Elevation ΔT (°C):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 8.0"
                    value={measuredTempRiseC}
                    onChange={(e) => setMeasuredTempRiseC(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono focus:border-rose-500"
                  />
                </div>

                {calculateCalorimetryEvaluation() && (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-rose-500/40 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Theoretical ΔT:</span>
                      <span className="font-mono text-rose-300">
                        {calculateCalorimetryEvaluation()?.theoretical} °C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Your Reading:</span>
                      <span className="font-mono text-white">
                        {calculateCalorimetryEvaluation()?.student} °C
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1.5">
                      <span className="font-bold text-slate-300">Error Percentage:</span>
                      <span
                        className={`font-mono font-bold ${
                          calculateCalorimetryEvaluation()?.isAccurate
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {calculateCalorimetryEvaluation()?.errorPct}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
