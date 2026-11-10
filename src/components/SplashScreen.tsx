import React, { useEffect, useState, useRef } from 'react';
import { Award, Zap, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  isDark?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, isDark: propIsDark }) => {
  const [phase, setPhase] = useState<'splash' | 'loading' | 'complete'>('splash');
  const [progress, setProgress] = useState(12);
  const [loadingText, setLoadingText] = useState('Initializing Court Engine...');
  const [isSystemDark, setIsSystemDark] = useState(true);
  const finishTriggered = useRef(false);

  // Detect dark or light mode
  useEffect(() => {
    if (propIsDark !== undefined) {
      setIsSystemDark(propIsDark);
    } else {
      const stored = localStorage.getItem('smash-theme');
      if (stored) {
        setIsSystemDark(stored === 'dark');
      } else {
        setIsSystemDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    }
  }, [propIsDark]);

  const handleComplete = () => {
    if (finishTriggered.current) return;
    finishTriggered.current = true;
    onFinish();
  };

  // Safe loading progress sequence with error catch & failsafe timeout
  useEffect(() => {
    // Phase 1 -> Transition to Loading Phase after initial brand impact
    const phaseTimer = setTimeout(() => {
      setPhase('loading');
    }, 900);

    // Dynamic steps simulating data & database readiness
    const t1 = setTimeout(() => {
      setProgress(38);
      setLoadingText('Connecting Offline Room / Local Database...');
    }, 1200);

    const t2 = setTimeout(() => {
      try {
        // Verify local tournament data from storage
        const raw = localStorage.getItem('hbt-state');
        if (raw) JSON.parse(raw);
      } catch (err) {
        console.warn('Recovered safely from local storage check:', err);
      }
      setProgress(64);
      setLoadingText('Verifying Player Rosters & Photo Profiles...');
    }, 1600);

    const t3 = setTimeout(() => {
      setProgress(88);
      setLoadingText('Compiling BWF Fixtures & Courts...');
    }, 2000);

    const t4 = setTimeout(() => {
      setProgress(100);
      setLoadingText('Preparing Your Championship...');
      setPhase('complete');
    }, 2350);

    // Auto-enter dashboard after 100%
    const t5 = setTimeout(() => {
      handleComplete();
    }, 2750);

    // Hard Failsafe: Guarantee screen never hangs under any device conditions
    const safetyTimeout = setTimeout(() => {
      handleComplete();
    }, 3500);

    return () => {
      clearTimeout(phaseTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(safetyTimeout);
    };
  }, []);

  // SVG Circular progress mathematics
  const strokeWidth = 5;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Loading Smash Championship"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 select-none transition-colors duration-500 ${
        isSystemDark
          ? 'bg-gradient-to-br from-[#061910] via-[#0b2b1d] to-[#081f14] text-white'
          : 'bg-gradient-to-br from-[#f2f9f4] via-[#e3f2e8] to-[#d8ebde] text-slate-900'
      }`}
    >
      {/* Badminton Court Ambient Backdrop Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-3xl transition-opacity ${
            isSystemDark ? 'bg-emerald-500/10' : 'bg-emerald-400/20'
          }`}
        />
        <div
          className={`absolute bottom-1/4 right-1/3 w-[340px] h-[340px] rounded-full blur-2xl ${
            isSystemDark ? 'bg-amber-400/10' : 'bg-amber-300/15'
          }`}
        />

        {/* Court Boundary Lines */}
        <div
          className={`absolute inset-8 sm:inset-16 border rounded-3xl pointer-events-none transition-colors ${
            isSystemDark ? 'border-emerald-500/15' : 'border-emerald-600/15'
          }`}
        >
          {/* Net Line */}
          <div
            className={`absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed ${
              isSystemDark ? 'border-emerald-400/25' : 'border-emerald-600/25'
            }`}
          />
          {/* Center Line */}
          <div
            className={`absolute inset-y-0 left-1/2 -translate-x-1/2 border-l ${
              isSystemDark ? 'border-emerald-400/15' : 'border-emerald-600/15'
            }`}
          />
        </div>
      </div>

      {/* Top Bar with Status Tag */}
      <div className="w-full max-w-md flex items-center justify-between relative z-10">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md ${
            isSystemDark
              ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-300'
              : 'bg-emerald-100/90 border-emerald-300 text-emerald-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>OFFLINE BWF CERTIFIED ENGINE</span>
        </div>

        <button
          onClick={handleComplete}
          className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
            isSystemDark
              ? 'text-emerald-300/80 hover:text-white hover:bg-emerald-900/40'
              : 'text-emerald-800/80 hover:text-emerald-950 hover:bg-emerald-200/50'
          }`}
        >
          Skip &rarr;
        </button>
      </div>

      {/* Center Brand & Loading Core */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full my-auto py-6">
        {/* Animated Badminton Shuttlecock & Logo Emblem */}
        <div className="relative mb-6">
          {/* Outer Pulse Ring */}
          <div
            className={`absolute -inset-2 rounded-3xl blur-md opacity-40 animate-pulse ${
              isSystemDark ? 'bg-emerald-500' : 'bg-emerald-400'
            }`}
          />

          {/* Logo Card */}
          <div
            className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 flex items-center justify-center shadow-2xl border transition-transform ${
              isSystemDark
                ? 'bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-500 border-emerald-300/40 shadow-emerald-950/60'
                : 'bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 border-white shadow-emerald-700/20'
            }`}
          >
            {/* Animated Floating Shuttlecock */}
            <div className="text-5xl sm:text-6xl select-none transform transition-transform animate-bounce">
              🏸
            </div>

            {/* Micro Badge */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg border-2 border-white">
              <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1
          className={`text-3xl sm:text-4xl font-black tracking-tight uppercase drop-shadow-sm font-sans ${
            isSystemDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          SMASH CHAMPIONSHIP
        </h1>

        {/* Subtitle */}
        <div className="mt-2 mb-4 flex items-center justify-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          <span
            className={`text-sm sm:text-base font-extrabold tracking-tight ${
              isSystemDark ? 'text-amber-300' : 'text-amber-700'
            }`}
          >
            Developed By Hassan
          </span>
        </div>

        {/* Developer Badge */}
        <div
          className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-sm border mb-8 ${
            isSystemDark
              ? 'bg-emerald-900/60 border-emerald-500/40 text-emerald-200'
              : 'bg-emerald-100 border-emerald-400/50 text-emerald-900'
          }`}
        >
          HASSAN DEVELOPERS
        </div>

        {/* Circular Progress & Loading State */}
        <div className="w-full flex flex-col items-center gap-3">
          {/* Circular SVG Progress Ring */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
              {/* Background Track */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                className={isSystemDark ? 'text-emerald-950/80' : 'text-emerald-200/60'}
                strokeWidth={strokeWidth}
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress Indicator */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="text-amber-400 transition-all duration-300 ease-out"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Percentage Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-sm font-black font-mono ${
                  isSystemDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {progress}%
              </span>
            </div>
          </div>

          {/* Dynamic Loading Status Text */}
          <div className="h-6 flex items-center justify-center">
            <p
              className={`text-xs font-bold tracking-wide transition-all ${
                phase === 'complete'
                  ? 'text-emerald-400 font-extrabold animate-pulse'
                  : isSystemDark
                  ? 'text-emerald-300/90'
                  : 'text-emerald-800'
              }`}
            >
              {loadingText}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Technical & Device Verification Strip */}
      <div className="w-full max-w-md text-center relative z-10 pt-2 border-t border-emerald-500/10">
        <div
          className={`flex items-center justify-center gap-3 text-[10px] font-mono tracking-wider uppercase ${
            isSystemDark ? 'text-emerald-400/60' : 'text-emerald-700/70'
          }`}
        >
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Android SplashScreen API
          </span>
          <span>&bull;</span>
          <span>Room DB Offline</span>
          <span>&bull;</span>
          <span>Zero-Lag</span>
        </div>
      </div>
    </div>
  );
};
