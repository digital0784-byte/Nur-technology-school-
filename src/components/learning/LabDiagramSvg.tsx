import React from 'react';

interface LabDiagramSvgProps {
  type: 'pendulum' | 'titration' | 'optics_prism' | 'microscope' | 'circuit' | 'electrolysis' | 'kinematics_trolley';
  className?: string;
}

export const LabDiagramSvg: React.FC<LabDiagramSvgProps> = ({ type, className = 'w-full h-48' }) => {
  switch (type) {
    case 'titration':
      return (
        <svg viewBox="0 0 400 240" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="240" fill="#f8fafc" className="dark:fill-slate-900" rx="16" />
          {/* Retort Stand */}
          <rect x="60" y="210" width="140" height="12" rx="4" fill="#64748b" />
          <rect x="80" y="20" width="8" height="190" fill="#94a3b8" />
          <rect x="88" y="50" width="60" height="6" fill="#64748b" />
          <rect x="144" y="44" width="8" height="18" fill="#475569" rx="2" />

          {/* Burette */}
          <rect x="148" y="25" width="16" height="130" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" rx="3" />
          {/* Solution in burette */}
          <rect x="150" y="60" width="12" height="90" fill="#38bdf8" opacity="0.6" />
          {/* Calibrations */}
          <line x1="156" y1="40" x2="164" y2="40" stroke="#0369a1" strokeWidth="1" />
          <line x1="156" y1="60" x2="164" y2="60" stroke="#0369a1" strokeWidth="1" />
          <line x1="156" y1="80" x2="164" y2="80" stroke="#0369a1" strokeWidth="1" />
          <line x1="156" y1="100" x2="164" y2="100" stroke="#0369a1" strokeWidth="1" />
          <line x1="156" y1="120" x2="164" y2="120" stroke="#0369a1" strokeWidth="1" />
          {/* Stopcock valve */}
          <polygon points="152,155 160,165 156,170 152,155" fill="#0284c7" />
          <rect x="146" y="157" width="20" height="4" fill="#0369a1" rx="2" />
          {/* Droplet */}
          <circle cx="156" cy="180" r="2.5" fill="#ec4899" />

          {/* Conical Flask */}
          <polygon points="152,185 160,185 185,215 127,215" fill="#fdf2f8" stroke="#db2777" strokeWidth="2" />
          {/* Liquid in flask (pink titration endpoint) */}
          <polygon points="135,213 177,213 170,202 142,202" fill="#f472b6" opacity="0.8" />
          {/* White ceramic tile */}
          <rect x="110" y="215" width="92" height="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" rx="2" />

          {/* Labels & Annotations */}
          <text x="180" y="45" fill="#0284c7" fontSize="11" fontWeight="bold">0.100 M NaOH (Burette)</text>
          <text x="180" y="162" fill="#0369a1" fontSize="10">Stopcock Valve (መቆጣጠሪያ ቫልቭ)</text>
          <text x="200" y="208" fill="#db2777" fontSize="11" fontWeight="bold">HCl + Phenolphthalein</text>
          <text x="200" y="222" fill="#9d174d" fontSize="9">Endpoint: Faint Permanent Pink</text>
        </svg>
      );

    case 'kinematics_trolley':
      return (
        <svg viewBox="0 0 400 240" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="240" fill="#f8fafc" className="dark:fill-slate-900" rx="16" />
          {/* Inclined Plane */}
          <polygon points="40,200 360,200 40,80" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
          <line x1="40" y1="200" x2="360" y2="200" stroke="#334155" strokeWidth="3" />
          {/* Elevation Block */}
          <rect x="40" y="80" width="30" height="120" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />

          {/* Ticker Timer */}
          <rect x="42" y="55" width="28" height="24" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" rx="3" />
          <text x="20" y="45" fill="#0284c7" fontSize="9" fontWeight="bold">Ticker Timer (50 Hz)</text>

          {/* Ticker Tape */}
          <line x1="70" y1="72" x2="160" y2="124" stroke="#f59e0b" strokeWidth="3" strokeDasharray="2,6" />

          {/* Dynamics Trolley */}
          <g transform="rotate(20.5 190 140)">
            <rect x="160" y="115" width="65" height="30" rx="4" fill="#10b981" stroke="#047857" strokeWidth="2" />
            <circle cx="175" cy="148" r="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <circle cx="210" cy="148" r="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <text x="170" y="133" fill="#ffffff" fontSize="9" fontWeight="bold">Trolley (m)</text>
          </g>

          {/* Acceleration vector */}
          <line x1="260" y1="165" x2="310" y2="185" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arrow)" />
          <text x="270" y="155" fill="#ef4444" fontSize="11" fontWeight="bold">a = 1.5 m/s²</text>
          <text x="130" y="222" fill="#475569" fontSize="10">Friction-Compensated Ramp (የተዳፋት ገበታ)</text>
        </svg>
      );

    case 'optics_prism':
    default:
      return (
        <svg viewBox="0 0 400 240" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="240" fill="#f8fafc" className="dark:fill-slate-900" rx="16" />
          {/* Glass Beaker */}
          <rect x="130" y="60" width="140" height="140" rx="10" fill="#e0f2fe" opacity="0.5" stroke="#0284c7" strokeWidth="2" />
          <path d="M 130 90 Q 200 95 270 90" stroke="#0284c7" strokeWidth="1.5" fill="none" />
          {/* Inverted Funnel */}
          <polygon points="170,180 230,180 205,130 195,130" fill="#93c5fd" opacity="0.5" stroke="#3b82f6" strokeWidth="1.5" />
          <rect x="196" y="80" width="8" height="50" fill="#93c5fd" opacity="0.5" stroke="#3b82f6" strokeWidth="1" />
          {/* Plant sprigs (Elodea) */}
          <path d="M 190 178 Q 200 160 185 150 Q 200 145 200 175" stroke="#16a34a" strokeWidth="3" fill="none" />
          <path d="M 210 178 Q 200 160 215 150 Q 200 145 200 175" stroke="#16a34a" strokeWidth="3" fill="none" />
          {/* Bubbles */}
          <circle cx="200" cy="110" r="3" fill="#38bdf8" />
          <circle cx="202" cy="95" r="4" fill="#38bdf8" />
          <circle cx="199" cy="80" r="3.5" fill="#38bdf8" />
          <circle cx="200" cy="68" r="5" fill="#0284c7" />

          {/* Lamp */}
          <circle cx="60" cy="130" r="22" fill="#fef08a" stroke="#eab308" strokeWidth="2" />
          <line x1="82" y1="120" x2="120" y2="120" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
          <line x1="82" y1="130" x2="125" y2="130" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
          <line x1="82" y1="140" x2="120" y2="140" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />

          {/* Labels */}
          <text x="35" y="170" fill="#ca8a04" fontSize="10" fontWeight="bold">Light Source (መብራት)</text>
          <text x="215" y="75" fill="#0284c7" fontSize="10" fontWeight="bold">O₂ Gas Bubbles</text>
          <text x="215" y="165" fill="#15803d" fontSize="10" fontWeight="bold">Elodea Plant</text>
          <text x="130" y="224" fill="#475569" fontSize="10">0.2% NaHCO₃ Carbon Solution</text>
        </svg>
      );
  }
};
