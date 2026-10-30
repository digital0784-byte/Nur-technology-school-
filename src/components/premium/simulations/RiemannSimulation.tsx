import React, { useState, useRef, useEffect } from 'react';
import { Calculator, BarChart3, TrendingUp, Info } from 'lucide-react';

type MathFunctionKey = 'parabola' | 'quadratic' | 'sine' | 'cubic';

interface FunctionModel {
  key: MathFunctionKey;
  label: string;
  latex: string;
  fn: (x: number) => number;
  a: number;
  b: number;
  exactIntegral: number;
}

const FUNCTIONS: FunctionModel[] = [
  {
    key: 'parabola',
    label: 'f(x) = 4x - x²',
    latex: '\\int_0^4 (4x - x^2) dx',
    fn: (x) => 4 * x - x * x,
    a: 0,
    b: 4,
    exactIntegral: 32 / 3, // 10.6667
  },
  {
    key: 'quadratic',
    label: 'f(x) = x²',
    latex: '\\int_0^3 x^2 dx',
    fn: (x) => x * x,
    a: 0,
    b: 3,
    exactIntegral: 9, // 9.00
  },
  {
    key: 'sine',
    label: 'f(x) = sin(x) + 1.2',
    latex: '\\int_0^\\pi (\\sin(x) + 1.2) dx',
    fn: (x) => Math.sin(x) + 1.2,
    a: 0,
    b: Math.PI,
    exactIntegral: 2 + 1.2 * Math.PI, // ~5.7699
  },
  {
    key: 'cubic',
    label: 'f(x) = x³ - 3x + 3',
    latex: '\\int_0^2 (x^3 - 3x + 3) dx',
    fn: (x) => x * x * x - 3 * x + 3,
    a: 0,
    b: 2,
    exactIntegral: 4, // 4.00
  },
];

export const RiemannSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedFuncKey, setSelectedFuncKey] = useState<MathFunctionKey>('parabola');
  const [partitionsN, setPartitionsN] = useState(12);
  const [method, setMethod] = useState<'left' | 'right' | 'midpoint'>('midpoint');

  const activeModel = FUNCTIONS.find((f) => f.key === selectedFuncKey) || FUNCTIONS[0];

  // Calculate Riemann Sum
  const a = activeModel.a;
  const b = activeModel.b;
  const dx = (b - a) / partitionsN;

  let approxSum = 0;
  for (let i = 0; i < partitionsN; i++) {
    let sampleX = a + i * dx;
    if (method === 'right') sampleX = a + (i + 1) * dx;
    if (method === 'midpoint') sampleX = a + (i + 0.5) * dx;
    approxSum += activeModel.fn(sampleX) * dx;
  }

  const exact = activeModel.exactIntegral;
  const errorAbs = Math.abs(approxSum - exact);
  const errorPercent = (errorAbs / exact) * 100;

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const padLeft = 45;
    const padRight = 35;
    const padTop = 30;
    const padBottom = 45;

    const drawWidth = width - padLeft - padRight;
    const drawHeight = height - padTop - padBottom;

    // Find y min and max for scaling
    let maxY = 1;
    for (let x = a; x <= b; x += (b - a) / 100) {
      const y = activeModel.fn(x);
      if (y > maxY) maxY = y;
    }
    maxY *= 1.25;

    const toCanvasX = (realX: number) => padLeft + ((realX - a) / (b - a)) * drawWidth;
    const toCanvasY = (realY: number) => height - padBottom - (realY / maxY) * drawHeight;

    // 1. Draw Grid
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 5; i++) {
      const gy = padTop + (drawHeight / 5) * i;
      ctx.moveTo(padLeft, gy);
      ctx.lineTo(width - padRight, gy);
    }
    ctx.stroke();

    // 2. Draw Riemann Rectangles
    for (let i = 0; i < partitionsN; i++) {
      const rectLeftX = a + i * dx;
      const rectRightX = a + (i + 1) * dx;

      let sampleX = rectLeftX;
      if (method === 'right') sampleX = rectRightX;
      if (method === 'midpoint') sampleX = rectLeftX + dx / 2;

      const rectY = Math.max(0, activeModel.fn(sampleX));

      const cX1 = toCanvasX(rectLeftX);
      const cX2 = toCanvasX(rectRightX);
      const cY = toCanvasY(rectY);
      const cBase = toCanvasY(0);

      // Rectangle Fill
      ctx.fillStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.35)' : 'rgba(99, 102, 241, 0.35)';
      ctx.fillRect(cX1, cY, cX2 - cX1, cBase - cY);

      // Rectangle Border
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(cX1, cY, cX2 - cX1, cBase - cY);

      // Sample point dot on top of rectangle
      const dotX = toCanvasX(sampleX);
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(dotX, cY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Draw Continuous Curve f(x)
    ctx.beginPath();
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 3;
    const steps = 150;
    for (let i = 0; i <= steps; i++) {
      const rx = a + ((b - a) / steps) * i;
      const ry = activeModel.fn(rx);
      const cx = toCanvasX(rx);
      const cy = toCanvasY(ry);
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // 4. Ground Axis line
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padLeft - 10, toCanvasY(0));
    ctx.lineTo(width - padRight + 10, toCanvasY(0));
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '11px monospace';
    ctx.fillText(`a = ${a.toFixed(1)}`, padLeft, height - padBottom + 18);
    ctx.fillText(`b = ${b.toFixed(2)}`, width - padRight - 35, height - padBottom + 18);
  }, [activeModel, partitionsN, method, a, b, dx]);

  return (
    <div className="space-y-4 p-4 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h4 className="font-extrabold text-base text-purple-300 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-400" />
            የሪማን ድምር እና የኢንቴግራል ስፋት አስመሳይ (Riemann Sum Integrator)
          </h4>
          <p className="text-xs text-slate-400">
            የክፍፍል ቁጥር (n → ∞) ሲጨምር ድምሩ ወደ ትክክለኛው የኢንቴግራል ዋጋ ይጠጋል
          </p>
        </div>

        {/* Function Chooser */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          {FUNCTIONS.map((f) => (
            <button
              key={f.key}
              onClick={() => setSelectedFuncKey(f.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedFuncKey === f.key
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas View */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner flex justify-center">
        <canvas
          ref={canvasRef}
          width={720}
          height={300}
          className="w-full max-w-3xl h-auto block"
        />

        {/* Mathematical Analysis HUD */}
        <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 shadow-xl space-y-1">
          <div className="text-[11px] text-slate-400">Exact Definite Integral:</div>
          <div className="text-sm font-black text-rose-400">∫ f(x) dx = {exact.toFixed(4)}</div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            Riemann Sum (n = {partitionsN}):
          </div>
          <div className="text-sm font-black text-cyan-300">Rₙ = {approxSum.toFixed(4)}</div>
          <div className="flex items-center justify-between gap-3 text-[11px] pt-1 border-t border-slate-800">
            <span className="text-slate-400">Error (ε):</span>
            <span className={`font-bold ${errorPercent < 1 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {errorPercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Controls: Partition Slider & Method Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs">
        {/* Partitions n */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium">
            <span className="text-slate-300">የሬክታንግል ክፍፍል ብዛት (n partitions):</span>
            <span className="text-purple-400 font-bold">{partitionsN}</span>
          </div>
          <input
            type="range"
            min={2}
            max={60}
            step={1}
            value={partitionsN}
            onChange={(e) => setPartitionsN(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>n = 2 (粗糙)</span>
            <span>n = 30</span>
            <span>n = 60 (ከፍተኛ ጥራት)</span>
          </div>
        </div>

        {/* Summation Rule */}
        <div className="space-y-1.5">
          <span className="text-slate-300 font-medium block">የናሙና ነጥብ ስልት (Summation Rule):</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setMethod('left')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold border transition text-center ${
                method === 'left'
                  ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700'
              }`}
            >
              Left Riemann (Lₙ)
            </button>
            <button
              onClick={() => setMethod('midpoint')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold border transition text-center ${
                method === 'midpoint'
                  ? 'bg-purple-600/30 text-purple-300 border-purple-500/50'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700'
              }`}
            >
              Midpoint (Mₙ) ★
            </button>
            <button
              onClick={() => setMethod('right')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold border transition text-center ${
                method === 'right'
                  ? 'bg-rose-600/30 text-rose-300 border-rose-500/50'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700'
              }`}
            >
              Right Riemann (Rₙ)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
