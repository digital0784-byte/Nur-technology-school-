import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Pause, Sparkles, Compass, Shield } from 'lucide-react';

interface ProjectilePoint {
  x: number;
  y: number;
}

export const ProjectileSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation Controls
  const [angleDeg, setAngleDeg] = useState(45);
  const [velocity, setVelocity] = useState(30); // m/s
  const [gravity, setGravity] = useState(9.8); // m/s^2 (Earth = 9.8, Moon = 1.62, Mars = 3.71)
  const [planet, setPlanet] = useState<'earth' | 'moon' | 'mars'>('earth');
  const [airDrag, setAirDrag] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Simulation state variables
  const [time, setTime] = useState(0);
  const [currentPos, setCurrentPos] = useState<ProjectilePoint>({ x: 0, y: 0 });
  const [trail, setTrail] = useState<ProjectilePoint[]>([]);

  // Theoretical analytical values
  const angleRad = (angleDeg * Math.PI) / 180;
  const v0x = velocity * Math.cos(angleRad);
  const v0y = velocity * Math.sin(angleRad);
  const totalFlightTime = (2 * v0y) / gravity;
  const maxHeight = (v0y * v0y) / (2 * gravity);
  const maxRange = (velocity * velocity * Math.sin(2 * angleRad)) / gravity;

  // Handle planet change
  const handlePlanetChange = (p: 'earth' | 'moon' | 'mars') => {
    setPlanet(p);
    if (p === 'earth') setGravity(9.8);
    if (p === 'moon') setGravity(1.62);
    if (p === 'mars') setGravity(3.71);
    handleReset();
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setCurrentPos({ x: 0, y: 0 });
    setTrail([]);
  };

  const handleFire = () => {
    handleReset();
    setIsRunning(true);
  };

  // Animation frame loop
  useEffect(() => {
    if (!isRunning) return;

    let animId: number;
    const dt = 0.04 * playbackSpeed;

    const tick = () => {
      setTime((prevTime) => {
        const nextTime = prevTime + dt;
        if (nextTime >= totalFlightTime) {
          setIsRunning(false);
          const finalX = maxRange;
          setCurrentPos({ x: finalX, y: 0 });
          setTrail((t) => [...t, { x: finalX, y: 0 }]);
          return totalFlightTime;
        }

        // Calculate position
        let x = v0x * nextTime;
        let y = v0y * nextTime - 0.5 * gravity * nextTime * nextTime;

        if (airDrag) {
          // Simplified drag damping
          const dragFactor = Math.exp(-0.04 * nextTime);
          x *= dragFactor;
          y *= dragFactor;
        }

        if (y < 0) y = 0;

        setCurrentPos({ x, y });
        setTrail((t) => [...t, { x, y }]);
        return nextTime;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, totalFlightTime, v0x, v0y, gravity, airDrag, playbackSpeed, maxRange]);

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Padding and coordinate scale
    const padX = 50;
    const padY = 50;
    const drawWidth = width - padX * 2;
    const drawHeight = height - padY * 2;

    // Determine scale based on max expected range & height
    const scaleX = drawWidth / Math.max(maxRange * 1.15, 60);
    const scaleY = drawHeight / Math.max(maxHeight * 1.35, 25);
    const toCanvasX = (realX: number) => padX + realX * scaleX;
    const toCanvasY = (realY: number) => height - padY - realY * scaleY;

    // Draw Grid Lines & Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Grid horizontal
    for (let h = 0; h <= maxHeight * 1.3; h += Math.max(5, Math.round(maxHeight / 5))) {
      const cy = toCanvasY(h);
      ctx.moveTo(padX, cy);
      ctx.lineTo(width - padX, cy);
    }
    // Grid vertical
    for (let d = 0; d <= maxRange * 1.1; d += Math.max(10, Math.round(maxRange / 6))) {
      const cx = toCanvasX(d);
      ctx.moveTo(cx, padY);
      ctx.lineTo(cx, height - padY);
    }
    ctx.stroke();

    // Ground line
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(padX - 15, toCanvasY(0));
    ctx.lineTo(width - padX + 15, toCanvasY(0));
    ctx.stroke();

    // Ground fill
    ctx.fillStyle = '#064E3B40';
    ctx.fillRect(padX - 15, toCanvasY(0), drawWidth + 30, padY);

    // Draw Cannon Base at (0,0)
    const cannonLen = 30;
    const originX = toCanvasX(0);
    const originY = toCanvasY(0);

    ctx.save();
    ctx.translate(originX, originY);
    ctx.rotate(-angleRad);
    ctx.fillStyle = '#6366F1';
    ctx.fillRect(0, -6, cannonLen, 12);
    ctx.restore();

    // Cannon pivot wheel
    ctx.beginPath();
    ctx.arc(originX, originY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#4F46E5';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#818CF8';
    ctx.stroke();

    // Draw Trajectory Trail
    if (trail.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 3]);
      ctx.moveTo(toCanvasX(trail[0].x), toCanvasY(trail[0].y));
      for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(toCanvasX(trail[i].x), toCanvasY(trail[i].y));
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Apex (Max Height) marker
    const apexX = maxRange / 2;
    const apexCanvasX = toCanvasX(apexX);
    const apexCanvasY = toCanvasY(maxHeight);

    ctx.strokeStyle = '#EC4899';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(apexCanvasX, toCanvasY(0));
    ctx.lineTo(apexCanvasX, apexCanvasY);
    ctx.lineTo(padX, apexCanvasY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Apex label
    ctx.fillStyle = '#F472B6';
    ctx.font = '11px sans-serif';
    ctx.fillText(`H_max = ${maxHeight.toFixed(1)}m`, apexCanvasX + 6, apexCanvasY - 4);

    // Draw Current Projectile Ball
    const ballCanvasX = toCanvasX(currentPos.x);
    const ballCanvasY = toCanvasY(currentPos.y);

    ctx.beginPath();
    ctx.arc(ballCanvasX, ballCanvasY, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#38BDF8';
    ctx.shadowColor = '#38BDF8';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Velocity Vector when flying
    if (isRunning && time < totalFlightTime) {
      const curVy = v0y - gravity * time;
      const vScale = 1.2;
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ballCanvasX, ballCanvasY);
      ctx.lineTo(ballCanvasX + v0x * vScale, ballCanvasY - curVy * vScale);
      ctx.stroke();
    }

    // Coordinates text
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px monospace';
    ctx.fillText(`(0,0)`, padX - 25, height - padY + 16);
    ctx.fillText(`R = ${maxRange.toFixed(1)}m`, toCanvasX(maxRange) - 20, height - padY + 16);
  }, [trail, currentPos, maxHeight, maxRange, angleRad, v0x, v0y, gravity, time, isRunning, totalFlightTime]);

  return (
    <div className="space-y-4 p-4 text-white">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h4 className="font-extrabold text-base text-amber-300 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            2D/3D የፕሮጀክትል እንቅስቃሴ አስመሳይ (Projectile Motion Vector Lab)
          </h4>
          <p className="text-xs text-slate-400">
            የማዕዘን፣ የመጀመሪያ ፍጥነት እና የስበት ኃይል (g) ተጽዕኖ በቅጽበት ይፈትሹ
          </p>
        </div>

        {/* Planet Presets */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => handlePlanetChange('earth')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              planet === 'earth' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌍 መሬት (9.8 m/s²)
          </button>
          <button
            onClick={() => handlePlanetChange('moon')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              planet === 'moon' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌕 ጨረቃ (1.6 m/s²)
          </button>
          <button
            onClick={() => handlePlanetChange('mars')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              planet === 'mars' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔴 ማርስ (3.7 m/s²)
          </button>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner flex justify-center">
        <canvas
          ref={canvasRef}
          width={720}
          height={320}
          className="w-full max-w-3xl h-auto block"
        />

        {/* Live HUD Floating telemetry */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 bg-slate-900/85 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 shadow-xl">
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Time (t):</span>
            <span className="text-amber-300 font-bold">{time.toFixed(2)} s</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Position (x, y):</span>
            <span className="text-cyan-300 font-bold">({currentPos.x.toFixed(1)}m, {currentPos.y.toFixed(1)}m)</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Max Height (H):</span>
            <span className="text-pink-400 font-bold">{maxHeight.toFixed(1)} m</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Total Range (R):</span>
            <span className="text-emerald-400 font-bold">{maxRange.toFixed(1)} m</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Flight Time (T):</span>
            <span className="text-purple-400 font-bold">{totalFlightTime.toFixed(2)} s</span>
          </div>
        </div>
      </div>

      {/* Control Sliders and Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs">
        {/* Launch Angle Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium">
            <span className="text-slate-300">የመወርወሪያ ማዕዘን (Angle θ):</span>
            <span className="text-amber-400 font-bold">{angleDeg}°</span>
          </div>
          <input
            type="range"
            min={10}
            max={85}
            step={1}
            value={angleDeg}
            disabled={isRunning}
            onChange={(e) => {
              setAngleDeg(Number(e.target.value));
              handleReset();
            }}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>10°</span>
            <span>45° (Max Range)</span>
            <span>85°</span>
          </div>
        </div>

        {/* Initial Velocity Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium">
            <span className="text-slate-300">የመጀመሪያ ፍጥነት (Velocity v₀):</span>
            <span className="text-cyan-400 font-bold">{velocity} m/s</span>
          </div>
          <input
            type="range"
            min={10}
            max={60}
            step={2}
            value={velocity}
            disabled={isRunning}
            onChange={(e) => {
              setVelocity(Number(e.target.value));
              handleReset();
            }}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>10 m/s</span>
            <span>35 m/s</span>
            <span>60 m/s</span>
          </div>
        </div>

        {/* Gravity & Toggles */}
        <div className="space-y-2 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={airDrag}
                disabled={isRunning}
                onChange={(e) => setAirDrag(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span className="text-slate-300 text-xs">የአየር መቋቋም (Air Drag)</span>
            </label>

            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-0.5 text-xs"
            >
              <option value={0.5}>0.5x Slow</option>
              <option value={1}>1.0x Normal</option>
              <option value={2}>2.0x Fast</option>
            </select>
          </div>

          {/* Action Launch Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleFire}
              disabled={isRunning}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-black text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              መድፉን ተኩስ (Launch)
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="እንደገና ጀምር"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
