import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running inside standalone app, do not display
  if (isInstalled) {
    return null;
  }

  // Chromium / Android native prompt flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0 ${className}`}
        title="Install Smash Championship App on your device"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // Fallback / iOS Safari guide button
  return (
    <>
      <button
        onClick={() => setShowGuide(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/50 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${className}`}
        title="How to install on your smartphone"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
        <span>Install App</span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏸</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Install Smash Championship
                </h3>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Install Smash Championship directly onto your phone’s home screen to use it full-screen with offline support:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <strong className="block text-slate-900 dark:text-slate-100 mb-1">
                  On Android (Chrome / Edge / Samsung Internet):
                </strong>
                <span>
                  Tap the browser menu (<strong>⋮</strong> or <strong>Share</strong>), then select{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400">Install App</strong> or{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400">Add to Home Screen</strong>.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <strong className="block text-slate-900 dark:text-slate-100 mb-1">
                  On iPhone / iPad (Safari):
                </strong>
                <span>
                  Tap the <strong>Share</strong> button (box with upward arrow) at the bottom, scroll down and tap{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400">Add to Home Screen</strong>.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl hover:opacity-90 transition-opacity"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
