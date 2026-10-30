import React, { useState, useRef, useEffect } from 'react';
import { Zap, Power, Gauge, Lightbulb, RotateCcw } from 'lucide-react';

export const CircuitSandboxSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Circuit components state
  const [isSwitchClosed, setIsSwitchClosed] = useState(true);
  const [circuitType, setCircuitType] = useState<'series' | 'parallel'>('series');
  const [voltage, setVoltage] = useState(12); // Volts
  const [r1, setR1] = useState(20); // Ohms
  const [r2, setR2] = useState(30); // Ohms
  const [electronOffset, setElectronOffset] = useState(0);

  // Electrical computations
  // Series: Req = R1 + R2
  // Parallel: Req = (R1 * R2) / (R1 + R2)
  const rEquivalent = circuitType === 'series' ? r1 + r2 : (r1 * r2) / (r1 + r2);
  const totalCurrent = isSwitchClosed ? voltage / rEquivalent : 0; // Amperes (I = V / Req)
  const totalPower = voltage * totalCurrent; // Watts (P = VI)

  // Branch voltages & currents
  let vR1 = 0;
  let vR2 = 0;
  let iR1 = 0;
  let iR2 = 0;

  if (isSwitchClosed) {
    if (circuitType === 'series') {
      iR1 = totalCurrent;
      iR2 = totalCurrent;
      vR1 = totalCurrent * r1;
      vR2 = totalCurrent * r2;
    } else {
      vR1 = voltage;
      vR2 = voltage;
      iR1 = voltage / r1;
      iR2 = voltage / r2;
    }
  }

  // Animate electron drift velocity proportional to current
  useEffect(() => {
    if (!isSwitchClosed || totalCurrent <= 0) return;
    const interval = setInterval(() => {
      setElectronOffset((prev) => (prev + totalCurrent * 4) % 100);
    }, 40);
    return () => clearInterval(interval);
  }, [isSwitchClosed, totalCurrent]);

  // Canvas schematic rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padX = 60;
    const padY = 50;
    const cw = w - padX * 2;
    const ch = h - padY * 2;

    // Outer Circuit Wire Loop
    ctx.strokeStyle = isSwitchClosed ? '#F59E0B' : '#475569';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';

    ctx.strokeRect(padX, padY, cw, ch);

    // DC Battery on Left Wire
    const batteryY = padY + ch / 2;
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(padX - 8, batteryY - 24, 16, 48);

    // Long plate (+)
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(padX - 16, batteryY - 12);
    ctx.lineTo(padX + 16, batteryY - 12);
    ctx.stroke();

    // Short plate (-)
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(padX - 9, batteryY + 12);
    ctx.lineTo(padX + 9, batteryY + 12);
    ctx.stroke();

    // Battery Voltage label
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`+`, padX - 25, batteryY - 12);
    ctx.fillStyle = '#3B82F6';
    ctx.fillText(`-`, padX - 25, batteryY + 16);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText(`${voltage}V DC`, padX - 52, batteryY + 2);

    // Switch on Top Wire
    const switchX = padX + cw * 0.35;
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(switchX - 18, padY - 8, 36, 16);

    ctx.beginPath();
    ctx.arc(switchX - 14, padY, 4, 0, Math.PI * 2);
    ctx.arc(switchX + 14, padY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#CBD5E1';
    ctx.fill();

    // Switch Blade
    ctx.strokeStyle = isSwitchClosed ? '#10B981' : '#F43F5E';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(switchX - 14, padY);
    if (isSwitchClosed) {
      ctx.lineTo(switchX + 14, padY);
    } else {
      ctx.lineTo(switchX + 8, padY - 22);
    }
    ctx.stroke();

    // Resistors and Bulb Layout
    if (circuitType === 'series') {
      // Resistor 1 on right vertical wire
      const r1Y = padY + ch * 0.3;
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(padX + cw - 12, r1Y - 18, 24, 36);
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 3;
      ctx.strokeRect(padX + cw - 8, r1Y - 15, 16, 30);
      ctx.fillStyle = '#38BDF8';
      ctx.font = '11px sans-serif';
      ctx.fillText(`R₁: ${r1}Ω`, padX + cw + 14, r1Y + 3);

      // Resistor 2 on right vertical wire
      const r2Y = padY + ch * 0.7;
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(padX + cw - 12, r2Y - 18, 24, 36);
      ctx.strokeStyle = '#A855F7';
      ctx.lineWidth = 3;
      ctx.strokeRect(padX + cw - 8, r2Y - 15, 16, 30);
      ctx.fillStyle = '#A855F7';
      ctx.font = '11px sans-serif';
      ctx.fillText(`R₂: ${r2}Ω`, padX + cw + 14, r2Y + 3);
    } else {
      // Parallel Branching
      const branchX = padX + cw * 0.75;
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(branchX, padY);
      ctx.lineTo(branchX, padY + ch);
      ctx.stroke();

      // Branch 1 Resistor
      const midBranchY = padY + ch / 2;
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(branchX - 8, midBranchY - 16, 16, 32);
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 3;
      ctx.strokeRect(branchX - 6, midBranchY - 14, 12, 28);
      ctx.fillStyle = '#38BDF8';
      ctx.fillText(`R₁: ${r1}Ω`, branchX - 42, midBranchY + 3);

      // Branch 2 Resistor on far right wire
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(padX + cw - 8, midBranchY - 16, 16, 32);
      ctx.strokeStyle = '#A855F7';
      ctx.lineWidth = 3;
      ctx.strokeRect(padX + cw - 6, midBranchY - 14, 12, 28);
      ctx.fillStyle = '#A855F7';
      ctx.fillText(`R₂: ${r2}Ω`, padX + cw + 12, midBranchY + 3);
    }

    // Incandescent Test Lamp on Bottom Wire
    const bulbX = padX + cw * 0.5;
    const bulbY = padY + ch;

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(bulbX - 20, bulbY - 10, 40, 20);

    // Lamp Bulb Glow
    const glowRadius = isSwitchClosed ? Math.min(32, 10 + totalPower * 0.8) : 0;
    if (glowRadius > 0) {
      const grad = ctx.createRadialGradient(bulbX, bulbY, 2, bulbX, bulbY, glowRadius);
      grad.addColorStop(0, '#FEF08A');
      grad.addColorStop(0.5, 'rgba(250, 204, 21, 0.45)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lamp Glass Circle
    ctx.beginPath();
    ctx.arc(bulbX, bulbY, 13, 0, Math.PI * 2);
    ctx.fillStyle = isSwitchClosed && totalCurrent > 0 ? '#FACC15' : '#334155';
    ctx.fill();
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Filament cross
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bulbX - 6, bulbY - 6);
    ctx.lineTo(bulbX + 6, bulbY + 6);
    ctx.moveTo(bulbX + 6, bulbY - 6);
    ctx.lineTo(bulbX - 6, bulbY + 6);
    ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '11px sans-serif';
    ctx.fillText(`Lamp (${totalPower.toFixed(1)}W)`, bulbX - 25, bulbY + 28);
  }, [circuitType, isSwitchClosed, voltage, r1, r2, totalCurrent, totalPower]);

  return (
    <div className="space-y-4 p-4 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h4 className="font-extrabold text-base text-amber-300 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            የኤሌክትሪክ ሰርኪውት እና የኦህም ሕግ ሳንድቦክስ (DC Circuit Sandbox)
          </h4>
          <p className="text-xs text-slate-400">
            የተከታታይ (Series) እና የትይዩ (Parallel) ሬዚስተሮች፣ ቮልቴጅ እና የጅረት ስርጭት
          </p>
        </div>

        {/* Circuit Type Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setCircuitType('series')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              circuitType === 'series'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ተከታታይ (Series R₁ + R₂)
          </button>
          <button
            onClick={() => setCircuitType('parallel')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              circuitType === 'parallel'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ትይዩ (Parallel R₁ || R₂)
          </button>
        </div>
      </div>

      {/* Circuit Canvas View */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner flex justify-center">
        <canvas ref={canvasRef} width={720} height={320} className="w-full max-w-3xl h-auto block" />

        {/* Multimeter Telemetry HUD */}
        <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 shadow-xl space-y-1.5 min-w-[210px]">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold border-b border-slate-800 pb-1">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            Digital Multimeter
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Voltage:</span>
            <span className="text-red-400 font-bold">{voltage.toFixed(1)} V</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Equivalent Req:</span>
            <span className="text-white font-bold">{rEquivalent.toFixed(1)} Ω</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Current (I):</span>
            <span className="text-amber-400 font-bold">{totalCurrent.toFixed(2)} A</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Power (P):</span>
            <span className="text-yellow-300 font-bold">{totalPower.toFixed(1)} W</span>
          </div>
          <div className="pt-1 border-t border-slate-800 text-[11px] space-y-0.5">
            <div className="flex justify-between text-cyan-300">
              <span>VR₁: {vR1.toFixed(1)}V</span>
              <span>IR₁: {iR1.toFixed(2)}A</span>
            </div>
            <div className="flex justify-between text-purple-300">
              <span>VR₂: {vR2.toFixed(1)}V</span>
              <span>IR₂: {iR2.toFixed(2)}A</span>
            </div>
          </div>
        </div>

        {/* Switch Toggle Button overlay on canvas */}
        <div className="absolute top-3 left-3">
          <button
            onClick={() => setIsSwitchClosed((prev) => !prev)}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-2 border shadow-lg transition active:scale-95 ${
              isSwitchClosed
                ? 'bg-emerald-600/90 hover:bg-emerald-500 text-white border-emerald-400/50'
                : 'bg-rose-600/90 hover:bg-rose-500 text-white border-rose-400/50'
            }`}
          >
            <Power className="w-4 h-4" />
            {isSwitchClosed ? 'ማብሪያ ክፍት ነው (Switch ON)' : 'ማብሪያ ተዘግቷል (Switch OFF)'}
          </button>
        </div>
      </div>

      {/* Sliders: Voltage, R1, R2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs">
        {/* Voltage */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium">
            <span className="text-slate-300">የባትሪ ቮልቴጅ (Voltage):</span>
            <span className="text-red-400 font-bold">{voltage} V</span>
          </div>
          <input
            type="range"
            min={2}
            max={24}
            step={1}
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            className="w-full accent-red-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>2 V</span>
            <span>12 V</span>
            <span>24 V</span>
          </div>
        </div>

        {/* Resistor 1 */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium">
            <span className="text-slate-300">ሬዚስተር R₁ (Resistor 1):</span>
            <span className="text-cyan-400 font-bold">{r1} Ω</span>
          </div>
          <input
            type="range"
            min={10}
            max={80}
            step={5}
            value={r1}
            onChange={(e) => setR1(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>10 Ω</span>
            <span>40 Ω</span>
            <span>80 Ω</span>
          </div>
        </div>

        {/* Resistor 2 */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium">
            <span className="text-slate-300">ሬዚስተር R₂ (Resistor 2):</span>
            <span className="text-purple-400 font-bold">{r2} Ω</span>
          </div>
          <input
            type="range"
            min={10}
            max={80}
            step={5}
            value={r2}
            onChange={(e) => setR2(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>10 Ω</span>
            <span>40 Ω</span>
            <span>80 Ω</span>
          </div>
        </div>
      </div>
    </div>
  );
};
