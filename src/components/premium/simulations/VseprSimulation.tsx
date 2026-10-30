import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Eye, Sparkles, Atom, Info } from 'lucide-react';

interface AtomNode {
  x: number;
  y: number;
  z: number;
  symbol: string;
  color: string;
  radius: number;
  isCentral?: boolean;
}

interface LonePairOrbital {
  x: number;
  y: number;
  z: number;
  color: string;
}

interface MoleculeConfig {
  id: string;
  name: string;
  formula: string;
  stericNumber: number;
  bondingPairs: number;
  lonePairs: number;
  bondAngle: string;
  hybridization: string;
  geometryName: string;
  centralAtom: AtomNode;
  ligands: AtomNode[];
  lonePairOrbitals: LonePairOrbital[];
  description: string;
}

const MOLECULES: MoleculeConfig[] = [
  {
    id: 'ch4',
    name: 'ሜቴን (Methane)',
    formula: 'CH₄',
    stericNumber: 4,
    bondingPairs: 4,
    lonePairs: 0,
    bondAngle: '109.5°',
    hybridization: 'sp³',
    geometryName: 'ቴትራሄድራል (Tetrahedral)',
    centralAtom: { x: 0, y: 0, z: 0, symbol: 'C', color: '#334155', radius: 18, isCentral: true },
    ligands: [
      { x: 0, y: -75, z: 0, symbol: 'H', color: '#F8FAFC', radius: 12 },
      { x: 70, y: 25, z: 0, symbol: 'H', color: '#F8FAFC', radius: 12 },
      { x: -35, y: 25, z: 60, symbol: 'H', color: '#F8FAFC', radius: 12 },
      { x: -35, y: 25, z: -60, symbol: 'H', color: '#F8FAFC', radius: 12 },
    ],
    lonePairOrbitals: [],
    description: 'አራት እኩል የሆኑ C-H ቦንዶች ፍፁም 109.5° ማዕዘን በመፍጠር በቦታ ውስጥ ከፍተኛ መራራቅ ይፈጥራሉ።',
  },
  {
    id: 'nh3',
    name: 'አሞኒያ (Ammonia)',
    formula: 'NH₃',
    stericNumber: 4,
    bondingPairs: 3,
    lonePairs: 1,
    bondAngle: '107.0°',
    hybridization: 'sp³',
    geometryName: 'ትራይጎናል ፒራሚዳል (Trigonal Pyramidal)',
    centralAtom: { x: 0, y: -10, z: 0, symbol: 'N', color: '#2563EB', radius: 18, isCentral: true },
    ligands: [
      { x: 65, y: 35, z: 0, symbol: 'H', color: '#F8FAFC', radius: 12 },
      { x: -32, y: 35, z: 56, symbol: 'H', color: '#F8FAFC', radius: 12 },
      { x: -32, y: 35, z: -56, symbol: 'H', color: '#F8FAFC', radius: 12 },
    ],
    lonePairOrbitals: [{ x: 0, y: -70, z: 0, color: '#A855F7' }],
    description: 'በላይኛው ጫፍ ላይ ያለው ነጠላ የኤሌክትሮን ጥንድ (lone pair) ቦንዶቹን ወደ ታች በመግፋት ማዕዘኑን ከ 109.5° ወደ 107° ያሳንሰዋል።',
  },
  {
    id: 'h2o',
    name: 'ውሃ (Water)',
    formula: 'H₂O',
    stericNumber: 4,
    bondingPairs: 2,
    lonePairs: 2,
    bondAngle: '104.5°',
    hybridization: 'sp³',
    geometryName: 'ታጣፊ / ቤንት (Bent / V-Shaped)',
    centralAtom: { x: 0, y: -15, z: 0, symbol: 'O', color: '#DC2626', radius: 19, isCentral: true },
    ligands: [
      { x: 55, y: 35, z: 0, symbol: 'H', color: '#F8FAFC', radius: 12 },
      { x: -55, y: 35, z: 0, symbol: 'H', color: '#F8FAFC', radius: 12 },
    ],
    lonePairOrbitals: [
      { x: 30, y: -65, z: 35, color: '#A855F7' },
      { x: -30, y: -65, z: -35, color: '#A855F7' },
    ],
    description: 'ሁለቱ ኃይለኛ የሎን ፔር ኤሌክትሮን ደመናዎች የ O-H ቦንዶችን በከፍተኛ ሁኔታ በመግፋት ማዕዘኑን ወደ 104.5° ያጠበቡታል።',
  },
  {
    id: 'co2',
    name: 'ካርቦን ዳይኦክሳይድ (Carbon Dioxide)',
    formula: 'CO₂',
    stericNumber: 2,
    bondingPairs: 2,
    lonePairs: 0,
    bondAngle: '180.0°',
    hybridization: 'sp',
    geometryName: 'መስመራዊ (Linear)',
    centralAtom: { x: 0, y: 0, z: 0, symbol: 'C', color: '#334155', radius: 18, isCentral: true },
    ligands: [
      { x: -80, y: 0, z: 0, symbol: 'O', color: '#DC2626', radius: 16 },
      { x: 80, y: 0, z: 0, symbol: 'O', color: '#DC2626', radius: 16 },
    ],
    lonePairOrbitals: [],
    description: 'በካርቦን ዙሪያ ሁለት ድርብ ቦንዶች ብቻ በመኖራቸው አነስተኛ ግፊት የሚኖረው ቀጥተኛ መስመር (180°) ሲፈጠር ነው።',
  },
  {
    id: 'sf6',
    name: 'ሰልፈር ሄክሳፍሎራይድ (SF₆)',
    formula: 'SF₆',
    stericNumber: 6,
    bondingPairs: 6,
    lonePairs: 0,
    bondAngle: '90.0°',
    hybridization: 'sp³d²',
    geometryName: 'ኦክታሄድራል (Octahedral)',
    centralAtom: { x: 0, y: 0, z: 0, symbol: 'S', color: '#F59E0B', radius: 20, isCentral: true },
    ligands: [
      { x: 0, y: -75, z: 0, symbol: 'F', color: '#10B981', radius: 13 },
      { x: 0, y: 75, z: 0, symbol: 'F', color: '#10B981', radius: 13 },
      { x: 75, y: 0, z: 0, symbol: 'F', color: '#10B981', radius: 13 },
      { x: -75, y: 0, z: 0, symbol: 'F', color: '#10B981', radius: 13 },
      { x: 0, y: 0, z: 75, symbol: 'F', color: '#10B981', radius: 13 },
      { x: 0, y: 0, z: -75, symbol: 'F', color: '#10B981', radius: 13 },
    ],
    lonePairOrbitals: [],
    description: 'ስድስቱ የፍሎሪን አተሞች በሰልፈር ዙሪያ ፍፁም ሲሜትሪያል በሆነ የ 90° ማዕዘን ይደረደራሉ።',
  },
];

export const VseprSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedMoleculeId, setSelectedMoleculeId] = useState('ch4');
  const [showLonePairs, setShowLonePairs] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotX, setRotX] = useState(0.3);
  const [rotY, setRotY] = useState(0.5);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const activeMolecule = MOLECULES.find((m) => m.id === selectedMoleculeId) || MOLECULES[0];

  // Auto rotation loop
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotY((prev) => prev + 0.015);
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate]);

  // Mouse drag handlers for 3D orbital rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    setRotY((y) => y + dx * 0.01);
    setRotX((x) => x + dy * 0.01);
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // 3D Projection & Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // 3D rotation matrix calculation
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const project = (x: number, y: number, z: number) => {
      // Rotate around Y
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      // Rotate around X
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // Perspective projection
      const fov = 350;
      const scale = fov / (fov + z2);
      return {
        px: centerX + x1 * scale,
        py: centerY + y2 * scale,
        depth: z2,
        scale,
      };
    };

    // Project Central Atom
    const centralP = project(activeMolecule.centralAtom.x, activeMolecule.centralAtom.y, activeMolecule.centralAtom.z);

    // Project Ligand Atoms
    const projectedLigands = activeMolecule.ligands.map((ligand) => {
      const p = project(ligand.x, ligand.y, ligand.z);
      return { ...ligand, ...p };
    });

    // Project Lone Pairs
    const projectedLonePairs = activeMolecule.lonePairOrbitals.map((lp) => {
      const p = project(lp.x, lp.y, lp.z);
      return { ...lp, ...p };
    });

    // Draw Bonds (Covalent Sticks)
    projectedLigands.forEach((lig) => {
      ctx.beginPath();
      ctx.moveTo(centralP.px, centralP.py);
      ctx.lineTo(lig.px, lig.py);
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = Math.max(3, 5 * lig.scale);
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    // Draw Lone Pair Orbitals (semi-transparent teardrop lobes)
    if (showLonePairs) {
      projectedLonePairs.forEach((lp) => {
        // Draw dotted repulsion line
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(centralP.px, centralP.py);
        ctx.lineTo(lp.px, lp.py);
        ctx.strokeStyle = '#C084FC';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);

        // Lobe ellipse
        ctx.beginPath();
        ctx.arc(lp.px, lp.py, 14 * lp.scale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.45)';
        ctx.fill();
        ctx.strokeStyle = '#D8B4FE';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 2 dots representing electron pair
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(lp.px - 3, lp.py, 2.5, 0, Math.PI * 2);
        ctx.arc(lp.px + 3, lp.py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Sort Atoms by depth so front atoms render in front of rear atoms
    const allAtomsToDraw = [
      { ...activeMolecule.centralAtom, ...centralP },
      ...projectedLigands,
    ].sort((a, b) => b.depth - a.depth);

    // Draw Spheres
    allAtomsToDraw.forEach((atom) => {
      const r = atom.radius * atom.scale;
      const grad = ctx.createRadialGradient(
        atom.px - r * 0.3,
        atom.py - r * 0.3,
        r * 0.1,
        atom.px,
        atom.py,
        r
      );
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.3, atom.color);
      grad.addColorStop(1, '#0F172A');

      ctx.beginPath();
      ctx.arc(atom.px, atom.py, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowColor = atom.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Atom Text Label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.max(10, Math.round(13 * atom.scale))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(atom.symbol, atom.px, atom.py);
    });
  }, [activeMolecule, rotX, rotY, showLonePairs]);

  return (
    <div className="space-y-4 p-4 text-white">
      {/* Header and Molecule Picker */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h4 className="font-extrabold text-base text-cyan-300 flex items-center gap-2">
            <Atom className="w-5 h-5 text-cyan-400" />
            የሞለኪውሎች 3D የቦታ ቅርጽ (VSEPR Molecular Geometry)
          </h4>
          <p className="text-xs text-slate-400">
            ማውዙን በመጎተት ሞለኪውሉን በ 3D አሽከርክረው ይመልከቱ
          </p>
        </div>

        {/* Molecule Quick Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          {MOLECULES.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMoleculeId(m.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedMoleculeId === m.id
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m.formula}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div
        className="relative rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 overflow-hidden shadow-inner flex justify-center cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          width={720}
          height={320}
          className="w-full max-w-3xl h-auto block"
        />

        {/* 3D Viewport Controls overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 backdrop-blur-md transition ${
              autoRotate
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800/80 text-slate-400 border-slate-700'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            Auto-Rotate
          </button>

          <button
            onClick={() => setShowLonePairs((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 backdrop-blur-md transition ${
              showLonePairs
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-800/80 text-slate-400 border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Lone Pairs
          </button>
        </div>

        {/* Molecular Spec HUD */}
        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs text-slate-300 shadow-xl max-w-xs space-y-1">
          <div className="font-bold text-white text-sm flex items-center gap-2">
            <span>{activeMolecule.name}</span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-900 text-cyan-300 font-mono text-[11px]">
              {activeMolecule.formula}
            </span>
          </div>
          <div className="text-[11px] text-cyan-300 font-semibold">{activeMolecule.geometryName}</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            <span>Bond Angle: <b className="text-amber-400">{activeMolecule.bondAngle}</b></span>
            <span>Hybridization: <b className="text-emerald-400">{activeMolecule.hybridization}</b></span>
            <span>Steric Number: <b className="text-white">{activeMolecule.stericNumber}</b></span>
            <span>Lone Pairs: <b className="text-purple-400">{activeMolecule.lonePairs}</b></span>
          </div>
        </div>
      </div>

      {/* Description Explanatory Note */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{activeMolecule.description}</p>
      </div>
    </div>
  );
};
