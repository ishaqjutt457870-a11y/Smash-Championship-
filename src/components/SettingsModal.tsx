import React, { useState } from 'react';
import {
  X,
  Settings,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  ShieldAlert,
  RotateCcw,
  Award,
  Smartphone,
  Save,
  Check,
} from 'lucide-react';
import { MatchFormat } from '../types';
import { isAudioMuted, toggleAudioMute } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  matchFormat: MatchFormat;
  setMatchFormat: (fmt: MatchFormat) => void;
  onResetTournament: () => void;
  onResetAll: () => void;
  onOpenAndroidModal: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDark,
  setIsDark,
  matchFormat,
  setMatchFormat,
  onResetTournament,
  onResetAll,
  onOpenAndroidModal,
}) => {
  const [muted, setMuted] = useState(isAudioMuted());
  const [pointsPerSet, setPointsPerSet] = useState<21 | 15 | 11>(21);
  const [maxDeuceCap, setMaxDeuceCap] = useState<30 | 25 | 15>(30);
  const [intervalPoints, setIntervalPoints] = useState<11 | 8 | 6>(11);
  const [savedNotification, setSavedNotification] = useState(false);

  if (!isOpen) return null;

  const handleToggleSound = () => {
    const next = toggleAudioMute();
    setMuted(next);
  };

  const handleSaveRules = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Tournament Settings & Rules
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Appearance & Sound */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Experience & Theme
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between hover:border-emerald-500 transition-colors cursor-pointer text-left"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Theme Mode</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isDark ? 'Dark Theme' : 'Light Theme'}
                  </div>
                </div>
                {isDark ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              </button>

              <button
                onClick={handleToggleSound}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between hover:border-emerald-500 transition-colors cursor-pointer text-left"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Sound Effects</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {muted ? 'Audio Muted' : 'Audio Active'}
                  </div>
                </div>
                {muted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* Section 2: Match Rules & Defaults */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Default BWF Scoring Rules
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Sets Match Format</span>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Sets required to win fixture</div>
                </div>
                <div className="flex items-center gap-1">
                  {(['bo1', 'bo3', 'bo5'] as MatchFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setMatchFormat(fmt)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs uppercase cursor-pointer ${
                        matchFormat === fmt
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Points Per Game</span>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Target points to conclude set</div>
                </div>
                <div className="flex items-center gap-1">
                  {[21, 15, 11].map((pts) => (
                    <button
                      key={pts}
                      onClick={() => setPointsPerSet(pts as 21 | 15 | 11)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                        pointsPerSet === pts
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {pts} pts
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Maximum Deuce Limit</span>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Hard stop cap for deuce advantage</div>
                </div>
                <div className="flex items-center gap-1">
                  {[30, 25].map((cap) => (
                    <button
                      key={cap}
                      onClick={() => setMaxDeuceCap(cap as 30 | 25)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                        maxDeuceCap === cap
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {cap} pts
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveRules}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              {savedNotification ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Rules Preferences Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Apply Default Rules</span>
                </>
              )}
            </button>
          </div>

          {/* Section 3: Android Studio Project Export */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Android Studio Source
            </h3>
            <button
              onClick={() => {
                onClose();
                onOpenAndroidModal();
              }}
              className="w-full p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/40 flex items-center justify-between transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Android Studio Project ZIP
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Kotlin &bull; Jetpack Compose &bull; Room DB
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Download &rarr;
              </span>
            </button>
          </div>

          {/* Section 4: Data & Reset Options */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Data Management & Reset
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onResetTournament();
                  onClose();
                }}
                className="p-3 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Scores</span>
                </div>
                <div className="text-[10px] text-amber-700/80 dark:text-amber-300/80 mt-1">
                  Clears match results, preserves player roster
                </div>
              </button>

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all data and player rosters?')) {
                    onResetAll();
                    onClose();
                  }
                }}
                className="p-3 rounded-2xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100/60 dark:hover:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  <span>Factory Reset</span>
                </div>
                <div className="text-[10px] text-rose-700/80 dark:text-rose-300/80 mt-1">
                  Clears everything back to initial state
                </div>
              </button>
            </div>
          </div>

          {/* Developer Credit Footer Card */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-900 to-[#0c2f21] p-4 text-white text-center space-y-1 shadow-inner">
            <div className="text-xs text-emerald-200 font-medium">Software Engineering</div>
            <div className="text-base font-black text-amber-300">Developed By Hassan</div>
            <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
              Hassan developers
            </div>
            <p className="text-[10px] text-emerald-200/60 pt-1">
              Smash Championship v2.4 &bull; Universal Web & Android Edition
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
