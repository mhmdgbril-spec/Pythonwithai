import React from 'react';

export type Icon3DType =
  | 'unit-1'
  | 'unit-2'
  | 'unit-3'
  | 'unit-4'
  | 'unit-5'
  | 'unit-6'
  | 'unit-7'
  | 'unit-8'
  | 'unit-9'
  | 'unit-10'
  | 'unit-11'
  | 'unit-12'
  | 'unit-13'
  | 'unit-14'
  | 'book'
  | 'target'
  | 'theory'
  | 'code'
  | 'quiz'
  | 'project'
  | 'summary'
  | 'appendix'
  | 'golden-rule'
  | 'school'
  | 'colab';

interface Icon3DProps {
  name: Icon3DType | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-11 h-11',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20'
};

interface ThemePalette {
  topGrad: [string, string];
  baseColor: string;
  glowColor: string;
  accentColor: string;
}

const PALETTES: Record<string, ThemePalette> = {
  'unit-1': { topGrad: ['#38bdf8', '#0284c7'], baseColor: '#0369a1', glowColor: 'rgba(56,189,248,0.35)', accentColor: '#fde047' },
  'unit-2': { topGrad: ['#a855f7', '#6b21a8'], baseColor: '#4c1d95', glowColor: 'rgba(168,85,247,0.35)', accentColor: '#67e8f9' },
  'unit-3': { topGrad: ['#10b981', '#047857'], baseColor: '#065f46', glowColor: 'rgba(16,185,129,0.35)', accentColor: '#fde047' },
  'unit-4': { topGrad: ['#f59e0b', '#b45309'], baseColor: '#78350f', glowColor: 'rgba(245,158,11,0.35)', accentColor: '#fef08a' },
  'unit-5': { topGrad: ['#06b6d4', '#0e7490'], baseColor: '#164e63', glowColor: 'rgba(6,182,212,0.35)', accentColor: '#f472b6' },
  'unit-6': { topGrad: ['#ec4899', '#9d174d'], baseColor: '#831843', glowColor: 'rgba(236,72,153,0.35)', accentColor: '#fde047' },
  'unit-7': { topGrad: ['#8b5cf6', '#4c1d95'], baseColor: '#2e1065', glowColor: 'rgba(139,92,246,0.35)', accentColor: '#4ade80' },
  'unit-8': { topGrad: ['#6366f1', '#3730a3'], baseColor: '#1e1b4b', glowColor: 'rgba(99,102,241,0.35)', accentColor: '#38bdf8' },
  'unit-9': { topGrad: ['#f43f5e', '#be123c'], baseColor: '#881337', glowColor: 'rgba(244,63,94,0.35)', accentColor: '#a7f3d0' },
  'unit-10': { topGrad: ['#14b8a6', '#0f766e'], baseColor: '#134e4a', glowColor: 'rgba(20,184,166,0.35)', accentColor: '#fde047' },
  'unit-11': { topGrad: ['#0ea5e9', '#1d4ed8'], baseColor: '#1e3a8a', glowColor: 'rgba(14,165,233,0.35)', accentColor: '#5eead4' },
  'unit-12': { topGrad: ['#f97316', '#c2410c'], baseColor: '#7c2d12', glowColor: 'rgba(249,115,22,0.35)', accentColor: '#7dd3fc' },
  'unit-13': { topGrad: ['#d946ef', '#86198f'], baseColor: '#581c87', glowColor: 'rgba(217,70,239,0.35)', accentColor: '#fde047' },
  'unit-14': { topGrad: ['#3b82f6', '#1e40af'], baseColor: '#172554', glowColor: 'rgba(59,130,246,0.35)', accentColor: '#f43f5e' },
  'book': { topGrad: ['#10b981', '#059669'], baseColor: '#064e3b', glowColor: 'rgba(16,185,129,0.4)', accentColor: '#fde047' },
  'target': { topGrad: ['#f59e0b', '#d97706'], baseColor: '#78350f', glowColor: 'rgba(245,158,11,0.35)', accentColor: '#ffffff' },
  'theory': { topGrad: ['#3b82f6', '#2563eb'], baseColor: '#1e3a8a', glowColor: 'rgba(59,130,246,0.35)', accentColor: '#bae6fd' },
  'code': { topGrad: ['#8b5cf6', '#6d28d9'], baseColor: '#4c1d95', glowColor: 'rgba(139,92,246,0.35)', accentColor: '#4ade80' },
  'quiz': { topGrad: ['#f59e0b', '#b45309'], baseColor: '#78350f', glowColor: 'rgba(245,158,11,0.35)', accentColor: '#fef08a' },
  'project': { topGrad: ['#ec4899', '#be185d'], baseColor: '#831843', glowColor: 'rgba(236,72,153,0.35)', accentColor: '#fde047' },
  'summary': { topGrad: ['#10b981', '#047857'], baseColor: '#064e3b', glowColor: 'rgba(16,185,129,0.35)', accentColor: '#a7f3d0' },
  'appendix': { topGrad: ['#64748b', '#334155'], baseColor: '#0f172a', glowColor: 'rgba(100,116,139,0.35)', accentColor: '#38bdf8' },
  'golden-rule': { topGrad: ['#eab308', '#ca8a04'], baseColor: '#713f12', glowColor: 'rgba(234,179,8,0.4)', accentColor: '#fef9c3' },
  'school': { topGrad: ['#059669', '#065f46'], baseColor: '#022c22', glowColor: 'rgba(5,150,105,0.35)', accentColor: '#fde047' },
  'colab': { topGrad: ['#f97316', '#ea580c'], baseColor: '#7c2d12', glowColor: 'rgba(249,115,22,0.35)', accentColor: '#fef08a' }
};

export const Icon3D: React.FC<Icon3DProps> = ({ name, size = 'md', className = '' }) => {
  const palette = PALETTES[name] || PALETTES['book'];
  const uid = `icon3d-${name}-${Math.random().toString(36).slice(2, 7)}`;

  const renderGlyph = () => {
    switch (name) {
      case 'unit-1':
      case 'code':
        // 3D Python Terminal & Code Cube
        return (
          <g>
            {/* 3D Inner Screen */}
            <rect x="13" y="14" width="38" height="28" rx="6" fill="#0f172a" stroke="#e2e8f0" strokeWidth="1.5" />
            <circle cx="18.5" cy="19" r="1.8" fill="#f43f5e" />
            <circle cx="24" cy="19" r="1.8" fill="#f59e0b" />
            <circle cx="29.5" cy="19" r="1.8" fill="#10b981" />
            <path d="M19 27L25 31L19 35" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="28" y1="35" x2="37" y2="35" stroke="#fde047" strokeWidth="2.8" strokeLinecap="round" />
            {/* 3D Python Dual Badge */}
            <circle cx="44" cy="39" r="8" fill={palette.accentColor} />
            <path d="M41 39H47M44 36V42" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" />
          </g>
        );

      case 'unit-2':
        // 3D AI Brain & Circuit Core
        return (
          <g>
            <rect x="17" y="15" width="30" height="28" rx="7" fill="#ffffff" fillOpacity="0.95" />
            <rect x="22" y="20" width="20" height="18" rx="4" fill="#3b0764" />
            <circle cx="28" cy="29" r="3" fill="#67e8f9" />
            <circle cx="36" cy="29" r="3" fill="#f472b6" />
            <path d="M28 29H36" stroke="#ffffff" strokeWidth="2" />
            {/* 3D Pins */}
            <path d="M23 11V15M32 11V15M41 11V15M23 43V47M32 43V47M41 43V47M13 22H17M13 29H17M13 36H17M47 22H51M47 29H51M47 36H51" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );

      case 'unit-3':
        // 3D ML Classification & Decision Tree
        return (
          <g>
            <path d="M32 18V27M32 27L20 35M32 27L44 35" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="17" r="6" fill="#fde047" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="13" y="33" width="14" height="11" rx="3.5" fill="#ffffff" />
            <rect x="37" y="33" width="14" height="11" rx="3.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="20" cy="38.5" r="2.5" fill="#10b981" />
            <circle cx="44" cy="38.5" r="2.5" fill="#0f172a" />
          </g>
        );

      case 'unit-4':
        // 3D NLP Speech & Arabic Text Bubble
        return (
          <g>
            <path d="M14 20C14 15.5817 17.5817 12 22 12H42C46.4183 12 50 15.5817 50 20V32C50 36.4183 46.4183 40 42 40H28L19 46V40H22C17.5817 40 14 36.4183 14 32V20Z" fill="#ffffff" />
            <rect x="20" y="19" width="24" height="3.5" rx="1.75" fill="#d97706" />
            <rect x="20" y="25.5" width="18" height="3.5" rx="1.75" fill="#0284c7" />
            <rect x="20" y="32" width="12" height="3.5" rx="1.75" fill="#10b981" />
            <circle cx="42" cy="33" r="5" fill="#fde047" stroke="#78350f" strokeWidth="1.5" />
          </g>
        );

      case 'unit-5':
        // 3D Computer Vision Camera Lens & Eye
        return (
          <g>
            <rect x="13" y="16" width="38" height="28" rx="7" fill="#ffffff" />
            <circle cx="32" cy="30" r="10.5" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" />
            <circle cx="32" cy="30" r="5" fill="#38bdf8" />
            <circle cx="34.5" cy="27.5" r="2" fill="#ffffff" />
            <circle cx="44" cy="21" r="2.5" fill="#f43f5e" />
            {/* Scanning Corners */}
            <path d="M17 20H21M17 20V24M47 20H43M47 20V24M17 40H21M17 40V36M47 40H43M47 40V36" stroke="#0e7490" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'unit-6':
        // 3D Recommendation Star & Target Cards
        return (
          <g>
            <rect x="14" y="16" width="24" height="28" rx="5" fill="#ffffff" fillOpacity="0.9" />
            <rect x="24" y="13" width="26" height="30" rx="6" fill="#0f172a" stroke="#fbcfe8" strokeWidth="1.5" />
            <path d="M37 19L39.6 24.3L45.5 25.1L41.2 29.2L42.2 35L37 32.2L31.8 35L32.8 29.2L28.5 25.1L34.4 24.3L37 19Z" fill="#fde047" />
          </g>
        );

      case 'unit-7':
        // 3D Smart Gamepad Controller
        return (
          <g>
            <path d="M17 21H47C50.5 21 53 24 52 28L49.5 39C48.5 42.5 45 44 42 41.5L37.5 37H26.5L22 41.5C19 44 15.5 42.5 14.5 39L12 28C11 24 13.5 21 17 21Z" fill="#ffffff" />
            <path d="M22 26V32M19 29H25" stroke="#4c1d95" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="41" cy="27" r="2.5" fill="#f43f5e" />
            <circle cx="45" cy="31" r="2.5" fill="#38bdf8" />
            <circle cx="37" cy="31" r="2.5" fill="#10b981" />
          </g>
        );

      case 'unit-8':
        // 3D Deep Learning Neural Network
        return (
          <g>
            {/* Connections */}
            <path d="M18 19L32 23M18 19L32 35M18 39L32 23M18 39L32 35M32 23L46 29M32 35L46 29" stroke="#bae6fd" strokeWidth="2.2" />
            {/* Input Layer */}
            <circle cx="18" cy="19" r="4.5" fill="#ffffff" />
            <circle cx="18" cy="39" r="4.5" fill="#ffffff" />
            {/* Hidden Layer */}
            <circle cx="32" cy="23" r="5" fill="#fde047" stroke="#1e1b4b" strokeWidth="1.5" />
            <circle cx="32" cy="35" r="5" fill="#fde047" stroke="#1e1b4b" strokeWidth="1.5" />
            {/* Output Layer */}
            <circle cx="46" cy="29" r="5.5" fill="#4ade80" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        );

      case 'unit-9':
        // 3D Healthcare Heart Pulse & Medical Shield
        return (
          <g>
            <path d="M32 45C32 45 14 34.5 14 22.5C14 17.5 18 13.5 23 13.5C26.5 13.5 29.8 15.5 32 18.5C34.2 15.5 37.5 13.5 41 13.5C46 13.5 50 17.5 50 22.5C50 34.5 32 45 32 45Z" fill="#ffffff" />
            <path d="M19 28H26L29.5 21L34.5 35L38 28H45" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );

      case 'unit-10':
        // 3D Cyber Security Shield & Lock
        return (
          <g>
            <path d="M32 11L49 17V29C49 38.5 41.5 44.8 32 48C22.5 44.8 15 38.5 15 29V17L32 11Z" fill="#ffffff" />
            <rect x="25" y="27" width="14" height="11" rx="3" fill="#0f766e" />
            <path d="M28 27V23.5C28 21.3 29.8 19.5 32 19.5C34.2 19.5 36 21.3 36 23.5V27" stroke="#0f766e" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="32" cy="32.5" r="2" fill="#fde047" />
          </g>
        );

      case 'unit-11':
        // 3D AIoT Smart Sensor Hub & Signal Waves
        return (
          <g>
            <rect x="20" y="24" width="24" height="20" rx="5" fill="#ffffff" />
            <circle cx="32" cy="34" r="5.5" fill="#0284c7" />
            <path d="M24 19C28.5 15 35.5 15 40 19" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
            <path d="M19 14.5C26.2 8.5 37.8 8.5 45 14.5" stroke="#5eead4" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="32" cy="34" r="2" fill="#fde047" />
          </g>
        );

      case 'unit-12':
        // 3D Autonomous Robot Head & Antenna
        return (
          <g>
            <line x1="32" y1="10" x2="32" y2="17" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="10" r="3.5" fill="#38bdf8" />
            <rect x="15" y="17" width="34" height="26" rx="8" fill="#ffffff" />
            <rect x="20" y="23" width="24" height="10" rx="5" fill="#0f172a" />
            <circle cx="26.5" cy="28" r="3" fill="#38bdf8" />
            <circle cx="37.5" cy="28" r="3" fill="#38bdf8" />
            <rect x="25" y="37" width="14" height="2.8" rx="1.4" fill="#ea580c" />
          </g>
        );

      case 'unit-13':
        // 3D Generative AI Sparkle & Magic Cube
        return (
          <g>
            <path d="M32 11L36.5 24.5L50 29L36.5 33.5L32 47L27.5 33.5L14 29L27.5 24.5L32 11Z" fill="#ffffff" />
            <path d="M32 18L34.5 26.5L43 29L34.5 31.5L32 40L29.5 31.5L21 29L29.5 26.5L32 18Z" fill="#fde047" />
            <circle cx="46" cy="16" r="3" fill="#67e8f9" />
            <circle cx="18" cy="41" r="2.5" fill="#f472b6" />
          </g>
        );

      case 'unit-14':
        // 3D Voice Assistant Microphone & Sound Waves
        return (
          <g>
            <rect x="26" y="13" width="12" height="20" rx="6" fill="#ffffff" />
            <path d="M21 27C21 33.1 25.9 38 32 38C38.1 38 43 33.1 43 27" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
            <path d="M32 38V45M26 45H38" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            <path d="M15 24V30M49 24V30" stroke="#67e8f9" strokeWidth="2.8" strokeLinecap="round" />
          </g>
        );

      case 'book':
      case 'theory':
        // 3D Isometric Textbook
        return (
          <g>
            <path d="M16 15C16 13.3 17.3 12 19 12H45C46.7 12 48 13.3 48 15V43C48 44.7 46.7 46 45 46H19C17.3 46 16 44.7 16 43V15Z" fill="#ffffff" />
            <path d="M21 12V46" stroke="#cbd5e1" strokeWidth="2.5" />
            <rect x="26" y="18" width="16" height="4" rx="2" fill="#10b981" />
            <rect x="26" y="25" width="12" height="3" rx="1.5" fill="#64748b" />
            <circle cx="34" cy="36" r="4.5" fill="#fde047" stroke="#0f172a" strokeWidth="1.2" />
          </g>
        );

      case 'target':
        return (
          <g>
            <circle cx="32" cy="29" r="15" fill="#ffffff" />
            <circle cx="32" cy="29" r="10" fill="#f43f5e" />
            <circle cx="32" cy="29" r="5" fill="#fde047" />
          </g>
        );

      case 'quiz':
        return (
          <g>
            <circle cx="32" cy="29" r="15" fill="#ffffff" />
            <path d="M28 24C28 21.5 30 20 32.5 20C35 20 36.8 21.6 36.8 24C36.8 26 35 27.2 33.5 28.2C32.4 29 32 29.8 32 31.2" stroke="#b45309" strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="32" cy="36.5" r="2.2" fill="#b45309" />
          </g>
        );

      case 'project':
        return (
          <g>
            <path d="M32 12C38 17 41 25 41 33H23C23 25 26 17 32 12Z" fill="#ffffff" />
            <circle cx="32" cy="25" r="4" fill="#ec4899" />
            <path d="M23 33L18 39H25M41 33L46 39H39" fill="#fde047" />
            <path d="M29 36H35L32 44L29 36Z" fill="#f97316" />
          </g>
        );

      case 'summary':
        return (
          <g>
            <circle cx="32" cy="29" r="15" fill="#ffffff" />
            <path d="M25 29.5L30 34.5L40 24.5" stroke="#059669" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );

      case 'golden-rule':
        return (
          <g>
            <path d="M22 15H42V26C42 31.5 37.5 36 32 36C26.5 36 22 31.5 22 26V15Z" fill="#fde047" stroke="#ffffff" strokeWidth="2" />
            <path d="M28 36H36V42H28V36ZM24 42H40V45H24V42Z" fill="#ffffff" />
            <circle cx="32" cy="24" r="4" fill="#ca8a04" />
          </g>
        );

      case 'school':
        return (
          <g>
            <path d="M32 14L50 23L32 32L14 23L32 14Z" fill="#ffffff" />
            <path d="M21 27.5V37.5C21 40.5 26 43 32 43C38 43 43 40.5 43 37.5V27.5" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
            <path d="M48 24V35" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );

      default:
        return (
          <g>
            <rect x="16" y="16" width="32" height="26" rx="6" fill="#ffffff" />
            <circle cx="32" cy="29" r="7" fill={palette.accentColor} />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none flex-shrink-0 ${SIZE_MAP[size]} ${className}`}
      style={{
        filter: `drop-shadow(0 6px 10px ${palette.glowColor})`
      }}
    >
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id={`${uid}-top`} x1="8" y1="6" x2="56" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={palette.topGrad[0]} />
            <stop offset="100%" stopColor={palette.topGrad[1]} />
          </linearGradient>
          <linearGradient id={`${uid}-shine`} x1="12" y1="8" x2="36" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 3D Extruded Bottom Pedestal */}
        <rect x="6" y="12" width="52" height="48" rx="16" fill={palette.baseColor} />

        {/* 3D Main Glossy Cushion */}
        <rect x="6" y="6" width="52" height="48" rx="16" fill={`url(#${uid}-top)`} />

        {/* 3D Top Bevel Rim Highlight */}
        <rect
          x="7.5"
          y="7.5"
          width="49"
          height="45"
          rx="14.5"
          stroke="url(#icon3d-rim)"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />

        {/* Specular Glass Reflection */}
        <path
          d="M22 8H42C49.732 8 56 14.268 56 22V24C44 28 24 26 8 20V22C8 14.268 14.268 8 22 8Z"
          fill={`url(#${uid}-shine)`}
        />

        {/* 3D Center Subject Glyph */}
        {renderGlyph()}
      </svg>
    </div>
  );
};
