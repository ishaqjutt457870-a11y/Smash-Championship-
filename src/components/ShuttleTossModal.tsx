import React, { useState } from 'react';
import { X, RotateCw, Check, ArrowRight, Zap } from 'lucide-react';
import { playShuttleHitSound } from '../utils/audio';

interface ShuttleTossModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerAName: string;
  playerBName: string;
  onApplyTossResult: (firstServer: 'A' | 'B', sideLeft: 'A' | 'B') => void;
}

export const ShuttleTossModal: React.FC<ShuttleTossModalProps> = ({
  isOpen,
  onClose,
  playerAName,
  playerBName,
  onApplyTossResult,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [tossWinner, setTossWinner] = useState<'A' | 'B' | null>(null);
  const [servingChoice, setServingChoice] = useState<'A' | 'B'>('A');
  const [sideChoice, setSideChoice] = useState<'left' | 'right'>('left');

  if (!isOpen) return null;

  const handleSpinShuttle = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setTossWinner(null);
    playShuttleHitSound();

    // Randomize winner and spins
    const winner: 'A' | 'B' = Math.random() > 0.5 ? 'A' : 'B';
    const targetAngle = winner === 'A' ? 0 : 180;
    const extraSpins = (Math.floor(Math.random() * 4) + 5) * 360;
    const finalRot = rotation + extraSpins + (targetAngle - (rotation % 360));

    setRotation(finalRot);

    setTimeout(() => {
      setIsSpinning(false);
      setTossWinner(winner);
      setServingChoice(winner);
      playShuttleHitSound();
    }, 1800);
  };

  const handleConfirm = () => {
    const sideLeft = sideChoice === 'left' ? 'A' : 'B';
    onApplyTossResult(servingChoice, sideLeft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 text-center space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏸</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Shuttle Spin / Match Toss
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Spin the shuttlecock on court to determine the first server and side choice.
        </p>

        {/* Players Indicator */}
        <div className="flex items-center justify-between px-4 text-xs font-bold text-slate-800 dark:text-slate-200">
          <div className={`p-2 rounded-xl transition-all ${tossWinner === 'A' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500' : ''}`}>
            ▲ {playerAName}
          </div>
          <span className="text-slate-400 text-[10px]">TOSS</span>
          <div className={`p-2 rounded-xl transition-all ${tossWinner === 'B' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500' : ''}`}>
            ▼ {playerBName}
          </div>
        </div>

        {/* 3D Shuttlecock Spinner */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center bg-emerald-50/50 dark:bg-emerald-950/20 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
          <div
            className="text-6xl transition-transform duration-[1800ms] ease-out select-none"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            🏸
          </div>
        </div>

        {/* Result & Choice */}
        {tossWinner && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
            <span className="font-bold flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{tossWinner === 'A' ? playerAName : playerBName} wins the toss!</span>
            </span>

            <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-around pt-1">
              <div>
                <span className="block text-slate-400">First Server:</span>
                <select
                  value={servingChoice}
                  onChange={(e) => setServingChoice(e.target.value as 'A' | 'B')}
                  className="mt-1 px-2 py-1 bg-white dark:bg-slate-800 border rounded font-semibold text-xs"
                >
                  <option value="A">{playerAName}</option>
                  <option value="B">{playerBName}</option>
                </select>
              </div>

              <div>
                <span className="block text-slate-400">Court Side:</span>
                <select
                  value={sideChoice}
                  onChange={(e) => setSideChoice(e.target.value as 'left' | 'right')}
                  className="mt-1 px-2 py-1 bg-white dark:bg-slate-800 border rounded font-semibold text-xs"
                >
                  <option value="left">{playerAName} Left / {playerBName} Right</option>
                  <option value="right">{playerBName} Left / {playerAName} Right</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSpinShuttle}
            disabled={isSpinning}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Spinning...' : 'Spin Shuttlecock'}</span>
          </button>

          {tossWinner && (
            <button
              onClick={handleConfirm}
              className="py-2.5 px-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl transition-all shadow-sm"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
