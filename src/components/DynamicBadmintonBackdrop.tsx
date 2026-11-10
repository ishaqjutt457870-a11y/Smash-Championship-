import React from 'react';

export const DynamicBadmintonBackdrop: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Dynamic atmospheric gradient orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-emerald-500/10 dark:bg-emerald-600/15 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full bg-teal-500/10 dark:bg-teal-500/10 blur-[130px]" />
      <div className="absolute top-[40%] right-[15%] w-[35vw] h-[35vw] max-w-[450px] max-h-[450px] rounded-full bg-amber-400/5 dark:bg-amber-400/10 blur-[100px]" />

      {/* Badminton Court Geometric Grid Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] dark:opacity-[0.06] stroke-current text-emerald-950 dark:text-emerald-300"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        fill="none"
      >
        <defs>
          <pattern id="badmintonCourtGrid" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 120 0 L 0 0 0 120" fill="none" strokeWidth="1" />
            <line x1="60" y1="0" x2="60" y2="120" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="0" y1="60" x2="120" y2="60" strokeWidth="0.5" strokeDasharray="4 4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#badmintonCourtGrid)" />
      </svg>

      {/* Floating Decorative Badminton Court Graphic Lines */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[90vw] max-w-5xl h-[400px] border border-emerald-500/5 dark:border-emerald-400/10 rounded-3xl pointer-events-none transform -skew-y-1" />
      <div className="absolute top-36 left-1/2 -translate-x-1/2 w-[85vw] max-w-4xl h-[300px] border border-dashed border-emerald-500/5 dark:border-emerald-400/10 rounded-2xl pointer-events-none transform -skew-y-1" />
    </div>
  );
};
