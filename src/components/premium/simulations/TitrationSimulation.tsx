import React, { useState, useRef, useEffect } from 'react';
import { FlaskConical, Droplet, RotateCcw, Play, Pause, CheckCircle2, AlertCircle } from 'lucide-react';

export const TitrationSimulation: React.FC = () => {
  // Titration state
  const [volNaOH, setVolNaOH] = useState(0); // mL added, 0 to 50
  const [indicator, setIndicator] = useState<'phenolphthalein' | 'methyl_orange' | 'bromothymol'>('phenolphthalein');
  const [isDripping, setIsDripping] = useState(false);
  const [dripRate, setDripRate] = useState<number>(0.2); // mL per tick

  // Unknown sample parameters
  const [trueHClMolarity] = useState(0.088); // 0.088 M true unknown
  const volHCl = 25.0; // mL
  const molarityNaOH = 0.10; // M

  // Theoretical equivalence volume: M_a * V_a = M_b * V_b => V_b = (0.088 * 25) / 0.10 = 22.0 mL
  const vEquiv = (trueHClMolarity * volHCl) / molarityNaOH; // 22.0 mL

  // Calculate pH based on added NaOH
  const calculatePH = (v: number): number => {
    const molesAcid = trueHClMolarity * (volHCl / 1000);
    const molesBase = molarityNaOH * (v / 1000);
    const totalVolL = (volHCl + v) / 1000;

    if (v < vEquiv - 0.05) {
      // Excess acid
      const excessMolesH = molesAcid - molesBase;
      const concH = excessMolesH / totalVolL;
      return Math.max(1.0, -Math.log10(concH));
    } else if (Math.abs(v - vEquiv) <= 0.05) {
      // Equivalence point
      return 7.0;
    } else {
      // Excess base
      const excessMolesOH = molesBase - molesAcid;
      const concOH = excessMolesOH / totalVolL;
      const pOH = -Math.log10(concOH);
      return Math.min(13.0, 14.0 - pOH);
    }
  };

  const currentPH = calculatePH(volNaOH);

  // Solution Color calculation based on indicator and pH
  const getSolutionColor = (): { color: string; label: string } => {
    if (indicator === 'phenolphthalein') {
      if (currentPH < 8.2) return { color: 'rgba(241, 245, 249, 0.4)', label: 'Colorless (አሲዳማ)' };
      if (currentPH <= 10.0) return { color: 'rgba(244, 114, 182, 0.75)', label: 'Faint Pink (የመጨረሻ ነጥብ Endpoint)' };
      return { color: 'rgba(219, 39, 119, 0.95)', label: 'Deep Magenta / Excess Base' };
    } else if (indicator === 'methyl_orange') {
      if (currentPH < 3.1) return { color: 'rgba(239, 68, 68, 0.8)', label: 'Red (ጠንካራ አሲድ)' };
      if (currentPH <= 4.4) return { color: 'rgba(249, 115, 22, 0.8)', label: 'Orange (ሽግግር)' };
      return { color: 'rgba(234, 179, 8, 0.85)', label: 'Yellow (ገለልተኛ / ቤዝ)' };
    } else {
      // Bromothymol blue
      if (currentPH < 6.0) return { color: 'rgba(234, 179, 8, 0.8)', label: 'Yellow (አሲድ)' };
      if (currentPH <= 7.6) return { color: 'rgba(34, 197, 94, 0.85)', label: 'Green (ገለልተኛ Neutral)' };
      return { color: 'rgba(59, 130, 246, 0.85)', label: 'Blue (ቤዝ)' };
    }
  };

  const solutionStyle = getSolutionColor();

  // Drip interval ticker
  useEffect(() => {
    if (!isDripping) return;
    const interval = setInterval(() => {
      setVolNaOH((v) => {
        const next = Math.min(50, Number((v + dripRate).toFixed(2)));
        if (next >= 50) setIsDripping(false);
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isDripping, dripRate]);

  const handleAddDrop = (amount: number) => {
    setVolNaOH((v) => Math.min(50, Number((v + amount).toFixed(2))));
  };

  const handleReset = () => {
    setIsDripping(false);
    setVolNaOH(0);
  };

  // Canvas graph for pH Titration Curve
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padL = 35;
    const padR = 20;
    const padT = 20;
    const padB = 30;

    const dw = w - padL - padR;
    const dh = h - padT - padB;

    // Grid lines
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // pH lines 0, 7, 14
    [0, 7, 14].forEach((phVal) => {
      const gy = padT + dh * (1 - phVal / 14);
      ctx.moveTo(padL, gy);
      ctx.lineTo(w - padR, gy);
    });
    ctx.stroke();

    // Equivalence 7.0 line (dashed)
    const eqY = padT + dh * (1 - 7 / 14);
    ctx.strokeStyle = '#10B981';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(padL, eqY);
    ctx.lineTo(w - padR, eqY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Curve plotting
    ctx.beginPath();
    ctx.strokeStyle = '#F472B6';
    ctx.lineWidth = 2.5;

    for (let v = 0; v <= 50; v += 0.5) {
      const ph = calculatePH(v);
      const cx = padL + (v / 50) * dw;
      const cy = padT + dh * (1 - ph / 14);
      if (v === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // Current point on curve
    const curX = padL + (volNaOH / 50) * dw;
    const curY = padT + dh * (1 - currentPH / 14);
    ctx.beginPath();
    ctx.arc(curX, curY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#38BDF8';
    ctx.shadowColor = '#38BDF8';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px monospace';
    ctx.fillText('pH 14', 5, padT + 5);
    ctx.fillText('pH 7', 5, eqY + 3);
    ctx.fillText('pH 1', 5, h - padB);
    ctx.fillText('0 mL', padL, h - 10);
    ctx.fillText('22 mL (Eq)', padL + (22 / 50) * dw - 20, h - 10);
    ctx.fillText('50 mL', w - padR - 30, h - 10);
  }, [volNaOH, currentPH]);

  // Burette fluid height percentage (starts at 50mL mark, drains as volNaOH increases)
  const buretteDrainPercent = (volNaOH / 50) * 100;

  return (
    <div className="space-y-4 p-4 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h4 className="font-extrabold text-base text-pink-300 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-pink-400" />
            የአሲድ እና ቤዝ ኳንቲቴቲቭ ቲትሬሽን ምናባዊ ላብ (Titration Lab)
          </h4>
          <p className="text-xs text-slate-400">
            0.10 M NaOH በመጠቀም የ 25.0 mL HCl ናሙናን ትክክለኛ ሞላሪቲ ያግኙ
          </p>
        </div>

        {/* Indicator Selector */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setIndicator('phenolphthalein')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              indicator === 'phenolphthalein'
                ? 'bg-pink-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Phenolphthalein (8.2 - 10.0)
          </button>
          <button
            onClick={() => setIndicator('methyl_orange')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              indicator === 'methyl_orange'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Methyl Orange (3.1 - 4.4)
          </button>
          <button
            onClick={() => setIndicator('bromothymol')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              indicator === 'bromothymol'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bromothymol (6.0 - 7.6)
          </button>
        </div>
      </div>

      {/* Main Lab Bench: Left Apparatus, Right pH Curve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Glassware Apparatus Simulation */}
        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 flex flex-col items-center justify-between min-h-[340px]">
          {/* Burette Clamp and Tube */}
          <div className="relative w-12 h-44 rounded-b-md border-2 border-slate-500 bg-slate-900/40 overflow-hidden shadow-inner flex flex-col justify-end">
            {/* Graduated markings */}
            <div className="absolute inset-0 flex flex-col justify-between py-1 px-0.5 text-[8px] font-mono text-slate-500 select-none pointer-events-none">
              <span>0 mL</span>
              <span>10</span>
              <span>20</span>
              <span>30</span>
              <span>40</span>
              <span>50 mL</span>
            </div>

            {/* Fluid level */}
            <div
              className="w-full bg-cyan-400/50 border-t border-cyan-300 transition-all duration-200"
              style={{ height: `${Math.max(0, 100 - buretteDrainPercent)}%` }}
            />
          </div>

          {/* Stopcock valve */}
          <div className="w-16 h-3 bg-slate-700 rounded-sm my-1 flex items-center justify-center border border-slate-600">
            <div className={`w-3 h-3 rounded-full ${isDripping ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          </div>

          {/* Dripping drops animation */}
          <div className="h-10 flex items-center justify-center">
            {isDripping && (
              <div className="w-2.5 h-3 rounded-b-full bg-cyan-400 animate-bounce shadow" />
            )}
          </div>

          {/* Erlenmeyer Flask */}
          <div className="relative w-36 h-28 flex flex-col items-center justify-end">
            {/* Flask neck */}
            <div className="w-10 h-6 border-x-2 border-slate-400/80 bg-transparent" />
            {/* Flask Body (Trapezoid simulated with border/radius) */}
            <div
              className="w-36 h-22 rounded-b-3xl border-2 border-t-0 border-slate-400/80 overflow-hidden relative shadow-lg flex items-end justify-center transition-colors duration-500"
              style={{
                backgroundColor: solutionStyle.color,
              }}
            >
              <div className="text-[10px] font-bold text-slate-900/90 text-center pb-2 select-none">
                {solutionStyle.label}
              </div>
            </div>
          </div>

          {/* Flask details bar */}
          <div className="w-full flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Analyte: 25.0 mL HCl</span>
            <span className="font-mono text-cyan-300">NaOH Added: {volNaOH.toFixed(2)} mL</span>
          </div>
        </div>

        {/* Right: pH Curve & Digital Titration Telemetry */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-300">የ pH ለውጥ ኩርባ (pH Titration Curve)</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Digital pH Meter:</span>
              <span className="px-2 py-0.5 rounded bg-pink-950 border border-pink-500/40 text-pink-300 font-mono font-bold text-sm">
                {currentPH.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Canvas Graph */}
          <div className="flex justify-center py-2">
            <canvas ref={graphCanvasRef} width={340} height={180} className="w-full max-w-sm h-auto block" />
          </div>

          {/* Stoichiometric Calculation Box */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Equivalence Point (Vₑ):</span>
              <span className="text-emerald-400 font-mono font-bold">22.00 mL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Status:</span>
              <span className={volNaOH >= 21.9 && volNaOH <= 22.1 ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                {volNaOH < 21.9
                  ? 'ከመጨረሻ ነጥብ በታች (Pre-Equivalence)'
                  : volNaOH <= 22.1
                  ? '🎯 ፍፁም ሚዛን (Equivalence Reached!)'
                  : 'ከመጠን ያለፈ ቤዝ (Over-titrated)'}
              </span>
            </div>
            {volNaOH >= 21.9 && volNaOH <= 22.1 && (
              <div className="pt-1.5 border-t border-slate-800 text-[11px] text-emerald-300">
                ✅ M_HCl = (0.10 M × 22.0 mL) / 25.0 mL = <b>0.088 M</b>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bench Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleAddDrop(0.1)}
            disabled={volNaOH >= 50}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition active:scale-95 flex items-center gap-1.5"
          >
            <Droplet className="w-3.5 h-3.5 text-cyan-400" />
            +0.1 mL (Dropwise)
          </button>
          <button
            onClick={() => handleAddDrop(1.0)}
            disabled={volNaOH >= 50}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition active:scale-95"
          >
            +1.0 mL (Fast)
          </button>
          <button
            onClick={() => handleAddDrop(5.0)}
            disabled={volNaOH >= 50}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition active:scale-95"
          >
            +5.0 mL (Stream)
          </button>

          <button
            onClick={() => setIsDripping((prev) => !prev)}
            className={`py-2 px-3 rounded-xl font-bold transition flex items-center gap-1.5 ${
              isDripping
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isDripping ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isDripping ? 'አቁም (Stop Drip)' : 'ቀጣይነት ያለው ጠብታ (Auto Drip)'}
          </button>
        </div>

        <button
          onClick={handleReset}
          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-4 h-4" />
          አዲስ ናሙና ጀምር (Reset Lab)
        </button>
      </div>
    </div>
  );
};
