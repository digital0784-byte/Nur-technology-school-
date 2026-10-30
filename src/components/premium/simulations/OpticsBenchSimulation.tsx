import React, { useState, useRef, useEffect } from 'react';
import { Eye, Compass, Info, RotateCcw } from 'lucide-react';

export const OpticsBenchSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Optical bench state (in cm)
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');
  const [focalLengthAbs, setFocalLengthAbs] = useState(15); // cm
  const [objectDistance, setObjectDistance] = useState(30); // cm (d_o)
  const [objectHeight, setObjectHeight] = useState(30); // mm (h_o)

  // Thin lens equation calculations: 1/f = 1/do + 1/di => di = (f * do) / (do - f)
  const f = lensType === 'convex' ? focalLengthAbs : -focalLengthAbs;
  const isAtFocus = Math.abs(objectDistance - f) < 0.2;

  // Image distance
  let imageDistance = 0;
  let magnification = 1;
  let isReal = true;
  let isInverted = true;

  if (isAtFocus) {
    imageDistance = Infinity;
    magnification = Infinity;
  } else {
    imageDistance = (f * objectDistance) / (objectDistance - f);
    magnification = -imageDistance / objectDistance;
    isReal = imageDistance > 0;
    isInverted = magnification < 0;
  }

  // Draw Ray Tracing Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const originX = width / 2;
    const originY = height / 2;

    // Scale factor: pixels per cm
    const pxPerCm = 6.0;

    // 1. Principal Optical Axis
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // 2. Center Lens
    const lensRadiusX = 14;
    const lensRadiusY = 110;

    ctx.save();
    ctx.translate(originX, originY);
    ctx.beginPath();
    if (lensType === 'convex') {
      // Biconvex shape
      ctx.ellipse(0, 0, lensRadiusX, lensRadiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    } else {
      // Biconcave shape
      ctx.rect(-lensRadiusX, -lensRadiusY, lensRadiusX * 2, lensRadiusY * 2);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#A855F7';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
    ctx.restore();

    // 3. Focal Points (F1 and F2)
    const f1X = originX - focalLengthAbs * pxPerCm;
    const f2X = originX + focalLengthAbs * pxPerCm;
    const twoF1X = originX - 2 * focalLengthAbs * pxPerCm;
    const twoF2X = originX + 2 * focalLengthAbs * pxPerCm;

    // Draw focal dots
    [
      { x: f1X, label: 'F₁' },
      { x: f2X, label: 'F₂' },
      { x: twoF1X, label: '2F₁' },
      { x: twoF2X, label: '2F₂' },
    ].forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.x, originY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
      ctx.fillStyle = '#CBD5E1';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(pt.label, pt.x, originY + 16);
    });

    // 4. Object Arrow (Left side of lens)
    const objX = originX - objectDistance * pxPerCm;
    const objTopY = originY - (objectHeight / 10) * pxPerCm * 4;

    // Draw Object Arrow
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(objX, originY);
    ctx.lineTo(objX, objTopY);
    ctx.stroke();

    // Arrowhead
    ctx.fillStyle = '#22C55E';
    ctx.beginPath();
    ctx.moveTo(objX - 6, objTopY + 10);
    ctx.lineTo(objX + 6, objTopY + 10);
    ctx.lineTo(objX, objTopY - 2);
    ctx.fill();

    ctx.fillStyle = '#4ADE80';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`Object (dₒ=${objectDistance}cm)`, objX, objTopY - 8);

    // 5. Principal Rays Construction
    if (!isAtFocus && Math.abs(imageDistance) < 200) {
      const imgX = originX + imageDistance * pxPerCm;
      const imgHeightPx = -(objectHeight / 10) * pxPerCm * 4 * magnification;
      const imgTipY = originY - imgHeightPx;

      // Ray 1: Parallel to axis, refracts through F
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      ctx.lineTo(originX, objTopY);
      if (lensType === 'convex') {
        ctx.lineTo(imgX, imgTipY);
      } else {
        // Diverges away from F1
        ctx.lineTo(width, objTopY - ((originY - objTopY) / focalLengthAbs) * (width - originX));
      }
      ctx.stroke();

      // Ray 2: Central ray through center O undeflected
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(objX, objTopY);
      ctx.lineTo(imgX, imgTipY);
      ctx.stroke();

      // 6. Image Arrow
      ctx.strokeStyle = isReal ? '#38BDF8' : '#C084FC';
      if (!isReal) ctx.setLineDash([4, 4]);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(imgX, originY);
      ctx.lineTo(imgX, imgTipY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Image Arrowhead
      ctx.fillStyle = isReal ? '#38BDF8' : '#C084FC';
      ctx.beginPath();
      const arrowDir = imgTipY > originY ? -1 : 1;
      ctx.moveTo(imgX - 6, imgTipY - 10 * arrowDir);
      ctx.lineTo(imgX + 6, imgTipY - 10 * arrowDir);
      ctx.lineTo(imgX, imgTipY + 2 * arrowDir);
      ctx.fill();

      // Image Label
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(
        `${isReal ? 'Real' : 'Virtual'} Image (${Math.abs(imageDistance).toFixed(1)}cm)`,
        imgX,
        imgTipY > originY ? imgTipY + 18 : imgTipY - 10
      );
    }
  }, [lensType, focalLengthAbs, objectDistance, objectHeight, f, imageDistance, magnification, isReal, isAtFocus]);

  return (
    <div className="space-y-4 p-4 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h4 className="font-extrabold text-base text-cyan-300 flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            የብርሃን ስብራት እና የሌንስ ኦፕቲክስ ቤንች (Optics Ray-Tracing Bench)
          </h4>
          <p className="text-xs text-slate-400">
            የቀጭን ሌንስ ቀመር (1/f = 1/dₒ + 1/dᵢ) እና ምስል አፈጣጠር በቅጽበት
          </p>
        </div>

        {/* Lens Type Selector */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setLensType('convex')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              lensType === 'convex'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔍 ኮንቬክስ ሌንስ (Convex +f)
          </button>
          <button
            onClick={() => setLensType('concave')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              lensType === 'concave'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            👓 ኮንኬቭ ሌንስ (Concave -f)
          </button>
        </div>
      </div>

      {/* Optical Bench Canvas */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner flex justify-center">
        <canvas
          ref={canvasRef}
          width={720}
          height={320}
          className="w-full max-w-3xl h-auto block"
        />

        {/* HUD Telemetry */}
        <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 shadow-xl space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Focal Length (f):</span>
            <span className="text-amber-400 font-bold">{f > 0 ? `+${f}` : f} cm</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Object Dist (dₒ):</span>
            <span className="text-emerald-400 font-bold">{objectDistance} cm</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Image Dist (dᵢ):</span>
            <span className="text-cyan-400 font-bold">
              {isAtFocus ? '∞ (Infinity)' : `${imageDistance.toFixed(1)} cm`}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Magnification (M):</span>
            <span className="text-purple-400 font-bold">
              {isAtFocus ? '∞' : `${magnification.toFixed(2)}x`}
            </span>
          </div>
          <div className="pt-1 border-t border-slate-800 text-[11px] font-bold">
            {isAtFocus ? (
              <span className="text-amber-400">ምስል አይፈጠርም (At focal point)</span>
            ) : isReal ? (
              <span className="text-cyan-300">እውነተኛ እና የተገለበጠ (Real & Inverted)</span>
            ) : (
              <span className="text-purple-300">ምናባዊ እና ቀጥተኛ (Virtual & Upright)</span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Bench Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs">
        {/* Object Distance */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium">
            <span className="text-slate-300">የአካል ርቀት (Object Distance dₒ):</span>
            <span className="text-emerald-400 font-bold">{objectDistance} cm</span>
          </div>
          <input
            type="range"
            min={8}
            max={50}
            step={1}
            value={objectDistance}
            onChange={(e) => setObjectDistance(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>8 cm</span>
            <span>2F (30 cm)</span>
            <span>50 cm</span>
          </div>
        </div>

        {/* Focal Length */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium">
            <span className="text-slate-300">የፎካል ርዝመት (|f|):</span>
            <span className="text-amber-400 font-bold">{focalLengthAbs} cm</span>
          </div>
          <input
            type="range"
            min={10}
            max={25}
            step={1}
            value={focalLengthAbs}
            onChange={(e) => setFocalLengthAbs(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>10 cm</span>
            <span>15 cm</span>
            <span>25 cm</span>
          </div>
        </div>

        {/* Object Height */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium">
            <span className="text-slate-300">የአካል ቁመት (Height hₒ):</span>
            <span className="text-cyan-400 font-bold">{objectHeight} mm</span>
          </div>
          <input
            type="range"
            min={15}
            max={45}
            step={1}
            value={objectHeight}
            onChange={(e) => setObjectHeight(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>15 mm</span>
            <span>30 mm</span>
            <span>45 mm</span>
          </div>
        </div>
      </div>
    </div>
  );
};
