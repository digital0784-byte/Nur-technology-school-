import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ProjectileSimulation } from './simulations/ProjectileSimulation';
import { VseprSimulation } from './simulations/VseprSimulation';
import { RiemannSimulation } from './simulations/RiemannSimulation';
import {
  Box,
  Compass,
  Atom,
  Dna,
  Heart,
  Radio,
  Orbit,
  Zap,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

type SimulationDomain = 'physics' | 'chemistry' | 'biology' | 'math';

export const SimulationsHub: React.FC = () => {
  const { language } = useLanguage();
  const [selectedDomain, setSelectedDomain] = useState<SimulationDomain>('physics');
  const [activeSimId, setActiveSimId] = useState<string>('gravitational_orbits');

  // Interactive state for Orbits
  const [centralMass, setCentralMass] = useState<number>(100);
  const [orbitDistance, setOrbitDistance] = useState<number>(120);
  const [orbitVelocity, setOrbitVelocity] = useState<number>(1.2);
  const [isSimRunning, setIsSimRunning] = useState<boolean>(true);

  // Interactive state for Electric Field Vectors
  const [charge1, setCharge1] = useState<number>(5);
  const [charge2, setCharge2] = useState<number>(-5);
  const [fieldResolution, setFieldResolution] = useState<number>(14);

  // Interactive state for Wave Interference
  const [wavelength, setWavelength] = useState<number>(24);
  const [slitSeparation, setSlitSeparation] = useState<number>(60);
  const [wavePhase, setWavePhase] = useState<number>(0);

  // Interactive state for DNA Replication Fork
  const [replicationSpeed, setReplicationSpeed] = useState<number>(1);
  const [dnaForkPos, setDnaForkPos] = useState<number>(0);

  // Interactive state for Human Circulatory System
  const [heartRateBpm, setHeartRateBpm] = useState<number>(75);
  const [bloodPulse, setBloodPulse] = useState<number>(0);

  // Canvas Refs
  const orbitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const electricCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dnaCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const circulatoryCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animation Loop for Gravitational Orbits
  useEffect(() => {
    if (activeSimId !== 'gravitational_orbits') return;
    const canvas = orbitCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    let animId: number;

    const render = () => {
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Orbit Path
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, orbitDistance, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Central Star (e.g., Sun)
      const starRadius = Math.max(12, Math.min(32, Math.sqrt(centralMass) * 2.2));
      const starGlow = ctx.createRadialGradient(cx, cy, 2, cx, cy, starRadius * 2);
      starGlow.addColorStop(0, '#fef08a');
      starGlow.addColorStop(0.4, '#f59e0b');
      starGlow.addColorStop(1, 'transparent');

      ctx.fillStyle = starGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, starRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx, cy, starRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw Orbiting Planet
      if (isSimRunning) {
        const orbitalPeriodRate = (0.015 * orbitVelocity * Math.sqrt(centralMass)) / Math.sqrt(orbitDistance);
        angle += orbitalPeriodRate;
      }

      const px = cx + Math.cos(angle) * orbitDistance;
      const py = cy + Math.sin(angle) * orbitDistance;

      // Velocity Vector arrow
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px, py);
      const vx = -Math.sin(angle) * 35 * orbitVelocity;
      const vy = Math.cos(angle) * 35 * orbitVelocity;
      ctx.lineTo(px + vx, py + vy);
      ctx.stroke();

      // Gravitational Force vector arrow towards sun
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(px, py);
      const fx = (cx - px) * 0.2;
      const fy = (cy - py) * 0.2;
      ctx.lineTo(px + fx, py + fy);
      ctx.stroke();

      // Planet body
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeSimId, centralMass, orbitDistance, orbitVelocity, isSimRunning]);

  // Animation Loop for Electric Field Vectors
  useEffect(() => {
    if (activeSimId !== 'electric_field') return;
    const canvas = electricCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#050814';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const q1x = canvas.width * 0.35;
    const q1y = canvas.height * 0.5;
    const q2x = canvas.width * 0.65;
    const q2y = canvas.height * 0.5;

    // Draw grid of electric field vector arrows
    const step = canvas.width / fieldResolution;
    for (let x = step / 2; x < canvas.width; x += step) {
      for (let y = step / 2; y < canvas.height; y += step) {
        // Distance to Q1
        const r1x = x - q1x;
        const r1y = y - q1y;
        const dist1Sq = r1x * r1x + r1y * r1y + 100;
        const dist1 = Math.sqrt(dist1Sq);

        // Distance to Q2
        const r2x = x - q2x;
        const r2y = y - q2y;
        const dist2Sq = r2x * r2x + r2y * r2y + 100;
        const dist2 = Math.sqrt(dist2Sq);

        // Superposition of Electric Fields: E = k * q / r^2 * unit vector
        const E1x = (charge1 * r1x) / (dist1 * dist1Sq);
        const E1y = (charge1 * r1y) / (dist1 * dist1Sq);

        const E2x = (charge2 * r2x) / (dist2 * dist2Sq);
        const E2y = (charge2 * r2y) / (dist2 * dist2Sq);

        const Ex = E1x + E2x;
        const Ey = E1y + E2y;
        const EMag = Math.sqrt(Ex * Ex + Ey * Ey);

        if (EMag > 0.0001) {
          const arrowLen = Math.min(step * 0.45, EMag * 8000);
          const angle = Math.atan2(Ey, Ex);

          ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(1, EMag * 6000 + 0.2)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(angle) * arrowLen, y + Math.sin(angle) * arrowLen);
          ctx.stroke();
        }
      }
    }

    // Draw Charge Q1
    ctx.fillStyle = charge1 >= 0 ? '#ef4444' : '#3b82f6';
    ctx.beginPath();
    ctx.arc(q1x, q1y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${charge1 > 0 ? '+' : ''}${charge1}μC`, q1x, q1y);

    // Draw Charge Q2
    ctx.fillStyle = charge2 >= 0 ? '#ef4444' : '#3b82f6';
    ctx.beginPath();
    ctx.arc(q2x, q2y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${charge2 > 0 ? '+' : ''}${charge2}μC`, q2x, q2y);
  }, [activeSimId, charge1, charge2, fieldResolution]);

  // Animation Loop for Wave Interference
  useEffect(() => {
    if (activeSimId !== 'wave_interference') return;
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    let animId: number;

    const render = () => {
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const slit1Y = canvas.height / 2 - slitSeparation / 2;
      const slit2Y = canvas.height / 2 + slitSeparation / 2;
      const slitX = 90;

      // Draw Slit Barrier
      ctx.fillStyle = '#475569';
      ctx.fillRect(slitX - 4, 0, 8, slit1Y - 6);
      ctx.fillRect(slitX - 4, slit1Y + 6, 8, slitSeparation - 12);
      ctx.fillRect(slitX - 4, slit2Y + 6, 8, canvas.height - slit2Y - 6);

      // Render concentric wave ripples from Slits 1 and 2
      phase += 0.8;
      const maxRadius = canvas.width - slitX;

      for (let r = (phase % wavelength); r < maxRadius; r += wavelength) {
        ctx.strokeStyle = `rgba(52, 211, 153, ${Math.max(0, 1 - r / maxRadius) * 0.45})`;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(slitX, slit1Y, r, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(slitX, slit2Y, r, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      }

      // Draw Right Detection Screen & Intensity Graph
      const screenX = canvas.width - 40;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(screenX, 10);
      ctx.lineTo(screenX, canvas.height - 10);
      ctx.stroke();

      // Fringe intensity bands
      for (let y = 10; y < canvas.height - 10; y += 3) {
        const d1 = Math.sqrt((screenX - slitX) ** 2 + (y - slit1Y) ** 2);
        const d2 = Math.sqrt((screenX - slitX) ** 2 + (y - slit2Y) ** 2);
        const pathDiff = Math.abs(d1 - d2);
        const intensity = Math.cos((Math.PI * pathDiff) / wavelength) ** 2;

        ctx.fillStyle = `rgba(52, 211, 153, ${intensity * 0.9})`;
        ctx.fillRect(screenX + 5, y, intensity * 25, 3);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeSimId, wavelength, slitSeparation]);

  // Animation Loop for DNA Replication Fork
  useEffect(() => {
    if (activeSimId !== 'dna_replication') return;
    const canvas = dnaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    let animId: number;

    const render = () => {
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      step += 0.03 * replicationSpeed;
      const forkX = canvas.width * 0.45;
      const cy = canvas.height * 0.5;

      // Draw Unwound strands splitting into two forks
      ctx.lineWidth = 4;

      // Parent Double Helix (Left to Fork)
      ctx.strokeStyle = '#a855f7';
      ctx.beginPath();
      ctx.moveTo(40, cy);
      ctx.lineTo(forkX, cy);
      ctx.stroke();

      // Leading Strand (Top Branch)
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(forkX, cy);
      ctx.bezierCurveTo(forkX + 80, cy - 30, forkX + 120, cy - 70, canvas.width - 40, cy - 70);
      ctx.stroke();

      // Lagging Strand (Bottom Branch with Okazaki gaps)
      ctx.strokeStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(forkX, cy);
      ctx.bezierCurveTo(forkX + 80, cy + 30, forkX + 120, cy + 70, canvas.width - 40, cy + 70);
      ctx.stroke();

      // Helicase Enzyme (Wedge at Fork)
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(forkX - 10, cy - 18);
      ctx.lineTo(forkX + 15, cy);
      ctx.lineTo(forkX - 10, cy + 18);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('HELICASE', forkX - 8, cy + 3);

      // DNA Polymerase III Enzyme complexes
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(forkX + 100, cy - 65, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '9px sans-serif';
      ctx.fillText('Pol III', forkX + 85, cy - 82);

      // RNA Primers & Okazaki Fragments on Lagging Strand
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(forkX + 70, cy + 62, 35, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Okazaki Fragment (5\'→3\')', forkX + 60, cy + 90);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeSimId, replicationSpeed]);

  // Animation Loop for Human Circulatory System
  useEffect(() => {
    if (activeSimId !== 'circulatory_system') return;
    const canvas = circulatoryCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let animId: number;

    const render = () => {
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += (heartRateBpm / 60) * 0.05;
      const pulseScale = 1 + Math.sin(time * 6) * 0.08;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Pulmonary Loop (Blue deoxygenated to lungs, red oxygenated back)
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx, cy - 80, 80, 50, 0, 0, Math.PI);
      ctx.stroke();

      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 80, 80, 50, 0, Math.PI, Math.PI * 2);
      ctx.stroke();

      // Systemic Loop (Red to body organs, blue back)
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 85, 95, 60, 0, 0, Math.PI);
      ctx.stroke();

      ctx.strokeStyle = '#3b82f6';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 85, 95, 60, 0, Math.PI, Math.PI * 2);
      ctx.stroke();

      // 4-Chambered Heart Center Body
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(pulseScale, pulseScale);

      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(-14, -10, 24, 0, Math.PI * 2);
      ctx.arc(14, -10, 24, 0, Math.PI * 2);
      ctx.moveTo(-36, -6);
      ctx.lineTo(0, 36);
      ctx.lineTo(36, -6);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${heartRateBpm} BPM`, 0, 5);
      ctx.font = '8px sans-serif';
      ctx.fillText('120/80 mmHg', 0, 16);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeSimId, heartRateBpm]);

  return (
    <div className="space-y-6 text-white animate-in fade-in">
      {/* Domain Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-indigo-500/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-indigo-300">
              2D & 3D Interactive STEM Visualizers
            </h3>
            <p className="text-[11px] text-slate-400">
              Interactive variable controls aligned with Ethiopian High School STEM
            </p>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'physics' as SimulationDomain, label: 'Physics (ፊዚክስ)', icon: Orbit },
            { id: 'chemistry' as SimulationDomain, label: 'Chemistry (ኬሚስትሪ)', icon: Atom },
            { id: 'biology' as SimulationDomain, label: 'Biology (ባዮሎጂ)', icon: Dna },
            { id: 'math' as SimulationDomain, label: 'Mathematics (ሒሳብ)', icon: Compass },
          ].map((dom) => {
            const Icon = dom.icon;
            const isSelected = selectedDomain === dom.id;
            return (
              <button
                key={dom.id}
                onClick={() => {
                  setSelectedDomain(dom.id);
                  if (dom.id === 'physics') setActiveSimId('gravitational_orbits');
                  if (dom.id === 'chemistry') setActiveSimId('vsepr_molecules');
                  if (dom.id === 'biology') setActiveSimId('dna_replication');
                  if (dom.id === 'math') setActiveSimId('riemann_integrals');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {dom.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-models selector for current domain */}
      <div className="flex flex-wrap gap-2">
        {selectedDomain === 'physics' && (
          <>
            <button
              onClick={() => setActiveSimId('gravitational_orbits')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                activeSimId === 'gravitational_orbits'
                  ? 'bg-amber-600 border-amber-400 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🪐 Gravitational Orbits & Kepler's Laws
            </button>
            <button
              onClick={() => setActiveSimId('electric_field')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                activeSimId === 'electric_field'
                  ? 'bg-cyan-600 border-cyan-400 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Electric Field Vectors (Coulomb's Law)
            </button>
            <button
              onClick={() => setActiveSimId('wave_interference')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                activeSimId === 'wave_interference'
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🌊 Wave Interference & Double Slit
            </button>
            <button
              onClick={() => setActiveSimId('projectile_motion')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                activeSimId === 'projectile_motion'
                  ? 'bg-rose-600 border-rose-400 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🎯 2D Projectile Motion Kinematics
            </button>
          </>
        )}

        {selectedDomain === 'chemistry' && (
          <>
            <button
              onClick={() => setActiveSimId('vsepr_molecules')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                activeSimId === 'vsepr_molecules'
                  ? 'bg-cyan-600 border-cyan-400 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🧪 3D Molecular Geometry (VSEPR Theory)
            </button>
          </>
        )}

        {selectedDomain === 'biology' && (
          <>
            <button
              onClick={() => setActiveSimId('dna_replication')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                activeSimId === 'dna_replication'
                  ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🧬 DNA Replication Fork & Enzymes
            </button>
            <button
              onClick={() => setActiveSimId('circulatory_system')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                activeSimId === 'circulatory_system'
                  ? 'bg-rose-600 border-rose-400 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🫀 Human 4-Chambered Circulatory System
            </button>
          </>
        )}

        {selectedDomain === 'math' && (
          <button
            onClick={() => setActiveSimId('riemann_integrals')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
              activeSimId === 'riemann_integrals'
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            📐 Riemann Sums & Definite Integrals Area
          </button>
        )}
      </div>

      {/* Main Simulation Viewport and Controllers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Visualizer (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Real-Time Simulation Engine
              </span>
              <span className="text-[11px] text-slate-400 font-mono">60 FPS Hardware Render</span>
            </div>

            {/* Canvas components for each active simulation */}
            {activeSimId === 'gravitational_orbits' && (
              <canvas
                ref={orbitCanvasRef}
                width={640}
                height={360}
                className="w-full h-auto aspect-video rounded-2xl border border-slate-800 bg-[#050814]"
              />
            )}

            {activeSimId === 'electric_field' && (
              <canvas
                ref={electricCanvasRef}
                width={640}
                height={360}
                className="w-full h-auto aspect-video rounded-2xl border border-slate-800 bg-[#050814]"
              />
            )}

            {activeSimId === 'wave_interference' && (
              <canvas
                ref={waveCanvasRef}
                width={640}
                height={360}
                className="w-full h-auto aspect-video rounded-2xl border border-slate-800 bg-[#050814]"
              />
            )}

            {activeSimId === 'projectile_motion' && <ProjectileSimulation />}

            {activeSimId === 'vsepr_molecules' && <VseprSimulation />}

            {activeSimId === 'dna_replication' && (
              <canvas
                ref={dnaCanvasRef}
                width={640}
                height={360}
                className="w-full h-auto aspect-video rounded-2xl border border-slate-800 bg-[#050814]"
              />
            )}

            {activeSimId === 'circulatory_system' && (
              <canvas
                ref={circulatoryCanvasRef}
                width={640}
                height={360}
                className="w-full h-auto aspect-video rounded-2xl border border-slate-800 bg-[#050814]"
              />
            )}

            {activeSimId === 'riemann_integrals' && <RiemannSimulation />}
          </div>
        </div>

        {/* Variable Sliders and Controllers Sidebar (1 col) */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-sm font-extrabold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-amber-400" />
              Dynamic Variable Controls
            </h4>

            {/* Sliders for Orbits */}
            {activeSimId === 'gravitational_orbits' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Central Star Mass (M):</span>
                    <span className="text-amber-400 font-mono">{centralMass} M☉</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={250}
                    value={centralMass}
                    onChange={(e) => setCentralMass(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Orbital Radius (r):</span>
                    <span className="text-amber-400 font-mono">{orbitDistance} AU</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={170}
                    value={orbitDistance}
                    onChange={(e) => setOrbitDistance(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Velocity Multiplier (v):</span>
                    <span className="text-amber-400 font-mono">{orbitVelocity.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.4}
                    max={2.5}
                    step={0.1}
                    value={orbitVelocity}
                    onChange={(e) => setOrbitVelocity(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    MoE Physics Principle:
                  </span>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    v = √(G·M / r), Period T² ∝ r³ (Kepler's Third Law)
                  </p>
                </div>
              </div>
            )}

            {/* Sliders for Electric Field */}
            {activeSimId === 'electric_field' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Charge Q₁:</span>
                    <span className="text-red-400 font-mono">{charge1 > 0 ? `+${charge1}` : charge1} μC</span>
                  </div>
                  <input
                    type="range"
                    min={-10}
                    max={10}
                    value={charge1}
                    onChange={(e) => setCharge1(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Charge Q₂:</span>
                    <span className="text-blue-400 font-mono">{charge2 > 0 ? `+${charge2}` : charge2} μC</span>
                  </div>
                  <input
                    type="range"
                    min={-10}
                    max={10}
                    value={charge2}
                    onChange={(e) => setCharge2(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Field Line Resolution:</span>
                    <span className="text-cyan-400 font-mono">{fieldResolution}x{fieldResolution}</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={22}
                    value={fieldResolution}
                    onChange={(e) => setFieldResolution(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Coulomb's Law:
                  </span>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    F = k·|q₁·q₂| / r², E = F / q₀ (N/C)
                  </p>
                </div>
              </div>
            )}

            {/* Sliders for Wave Interference */}
            {activeSimId === 'wave_interference' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Wavelength (λ):</span>
                    <span className="text-emerald-400 font-mono">{wavelength} nm</span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={45}
                    value={wavelength}
                    onChange={(e) => setWavelength(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Slit Separation (d):</span>
                    <span className="text-emerald-400 font-mono">{slitSeparation} μm</span>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={110}
                    value={slitSeparation}
                    onChange={(e) => setSlitSeparation(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Fringe Spacing:
                  </span>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    y_m = (m · λ · L) / d (Constructive Interference)
                  </p>
                </div>
              </div>
            )}

            {/* Sliders for DNA */}
            {activeSimId === 'dna_replication' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Enzymatic Speed:</span>
                    <span className="text-purple-400 font-mono">{replicationSpeed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={3}
                    step={0.5}
                    value={replicationSpeed}
                    onChange={(e) => setReplicationSpeed(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1 text-xs text-slate-300">
                  <p className="font-bold text-purple-300">Semi-Conservative Replication:</p>
                  <p>• Helicase unzips parent double helix hydrogen bonds.</p>
                  <p>• Leading strand synthesizes continuously 5' to 3'.</p>
                  <p>• Lagging strand synthesizes discontinuously via Okazaki fragments sealed by DNA Ligase.</p>
                </div>
              </div>
            )}

            {/* Sliders for Circulatory */}
            {activeSimId === 'circulatory_system' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Heart Rate (BPM):</span>
                    <span className="text-rose-400 font-mono">{heartRateBpm} Beats/min</span>
                  </div>
                  <input
                    type="range"
                    min={45}
                    max={160}
                    value={heartRateBpm}
                    onChange={(e) => setHeartRateBpm(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1 text-xs text-slate-300">
                  <p className="font-bold text-rose-300">Cardiac Cycle Dynamics:</p>
                  <p>• Systole: Ventricular contraction pumping blood into aorta.</p>
                  <p>• Diastole: Heart chamber relaxation and ventricular filling.</p>
                  <p>• Pulmonary loop oxygenates blood via pulmonary capillaries.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
