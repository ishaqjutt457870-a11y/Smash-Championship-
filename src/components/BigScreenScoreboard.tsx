import React, { useEffect, useState } from 'react';
import { Maximize2, Minimize2, X, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { LiveMatchState } from '../types';

interface BigScreenScoreboardProps {
  matchState: LiveMatchState;
  playerAName: string;
  playerBName: string;
  playerAPhoto?: string;
  playerBPhoto?: string;
  onClose: () => void;
  onAddPointA: () => void;
  onAddPointB: () => void;
  onUndo: () => void;
}

export const BigScreenScoreboard: React.FC<BigScreenScoreboardProps> = ({
  matchState,
  playerAName,
  playerBName,
  playerAPhoto,
  playerBPhoto,
  onClose,
  onAddPointA,
  onAddPointB,
  onUndo,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Match timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Compute set summary
  const setsWonA = matchState.setScores.filter((s) => s.a > s.b).length;
  const setsWonB = matchState.setScores.filter((s) => s.b > s.a).length;

  // Determine game point or match point
  const maxScore = Math.max(matchState.currentPointsA, matchState.currentPointsB);
  const diff = Math.abs(matchState.currentPointsA - matchState.currentPointsB);
  const isGamePoint =
    (matchState.currentPointsA >= 20 || matchState.currentPointsB >= 20) && diff >= 1;

  return (
    <div className="fixed inset-0 z-50 bg-[#06170f] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Top Bar for Stadium / Broadcast Display */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#0a2318] border-b border-emerald-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-black text-xl">
            🏸
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>SMASH CHAMPIONSHIP</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold uppercase">
                Court {matchState.courtNumber || 1}
              </span>
            </div>
            <div className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
              <span>Developed By Hassan</span>
              <span className="text-emerald-500">&bull;</span>
              <span className="text-emerald-300/80 font-normal">HASSAN DEVELOPERS</span>
            </div>
          </div>
        </div>

        {/* Center Match Clock & Status */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Match Time</div>
            <div className="text-lg font-mono font-bold text-amber-400">{formatTimer(elapsedSeconds)}</div>
          </div>

          <div className="px-4 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-600/40 text-center">
            <div className="text-[10px] text-emerald-300 uppercase tracking-widest font-mono">Set {matchState.currentSet}</div>
            <div className="text-xs font-bold text-emerald-200">
              {isGamePoint ? 'GAME POINT' : matchState.status === 'interval' ? 'INTERVAL' : 'IN PLAY'}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-rose-900/40 hover:bg-rose-900/70 border border-rose-700/50 text-rose-200 transition-colors cursor-pointer"
            title="Exit Big Screen View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Broadcast Split Screen Scoreboard */}
      <div className="flex-1 grid grid-cols-2 gap-4 p-6 sm:p-10 items-stretch">
        {/* Player / Side A */}
        <div
          onClick={onAddPointA}
          className={`relative rounded-3xl p-8 flex flex-col justify-between border-4 transition-all cursor-pointer shadow-2xl overflow-hidden ${
            matchState.server === 'A'
              ? 'bg-gradient-to-br from-[#0c3a27] via-[#104831] to-[#0d3423] border-amber-400 shadow-amber-500/10'
              : 'bg-gradient-to-br from-[#092b1d] to-[#071f15] border-emerald-900/60'
          }`}
        >
          {/* Server Indicator Badge */}
          {matchState.server === 'A' && (
            <div className="absolute top-6 right-6 px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
              <span>🏸 SERVING</span>
              <span className="text-[10px] uppercase font-mono">({matchState.servingSide})</span>
            </div>
          )}

          {/* Player Bio & Photo */}
          <div className="flex items-center gap-5">
            {playerAPhoto ? (
              <img
                src={playerAPhoto}
                alt={playerAName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-emerald-400/40 shadow-xl"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-700 border-4 border-emerald-400/40 flex items-center justify-center text-3xl font-black text-white shadow-xl">
                {playerAName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-xs text-emerald-300 font-mono tracking-widest uppercase">Side A</div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-none mt-1">
                {playerAName}
              </h2>
              <div className="mt-2 text-sm text-emerald-200 font-bold">
                Sets Won: <span className="text-amber-400 font-mono text-lg">{setsWonA}</span>
              </div>
            </div>
          </div>

          {/* Giant Score Numbers */}
          <div className="flex flex-col items-center justify-center my-auto py-4">
            <div className="text-[120px] sm:text-[180px] font-black tracking-tighter leading-none text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] font-mono">
              {matchState.currentPointsA}
            </div>
            <span className="text-xs text-emerald-400/80 font-mono uppercase tracking-widest mt-2">
              Tap anywhere on left side to add +1
            </span>
          </div>

          {/* Past Set History */}
          <div className="flex items-center gap-2 pt-4 border-t border-emerald-800/60">
            <span className="text-xs text-slate-400 font-mono uppercase">Past Sets:</span>
            {matchState.setScores.map((s, idx) => (
              <span
                key={idx}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                  s.a > s.b ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Set {idx + 1}: {s.a} - {s.b}
              </span>
            ))}
          </div>
        </div>

        {/* Player / Side B */}
        <div
          onClick={onAddPointB}
          className={`relative rounded-3xl p-8 flex flex-col justify-between border-4 transition-all cursor-pointer shadow-2xl overflow-hidden ${
            matchState.server === 'B'
              ? 'bg-gradient-to-br from-[#0c3a27] via-[#104831] to-[#0d3423] border-amber-400 shadow-amber-500/10'
              : 'bg-gradient-to-br from-[#092b1d] to-[#071f15] border-emerald-900/60'
          }`}
        >
          {/* Server Indicator Badge */}
          {matchState.server === 'B' && (
            <div className="absolute top-6 right-6 px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
              <span>🏸 SERVING</span>
              <span className="text-[10px] uppercase font-mono">({matchState.servingSide})</span>
            </div>
          )}

          {/* Player Bio & Photo */}
          <div className="flex items-center gap-5">
            {playerBPhoto ? (
              <img
                src={playerBPhoto}
                alt={playerBName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-teal-400/40 shadow-xl"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-teal-700 border-4 border-teal-400/40 flex items-center justify-center text-3xl font-black text-white shadow-xl">
                {playerBName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-xs text-teal-300 font-mono tracking-widest uppercase">Side B</div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-none mt-1">
                {playerBName}
              </h2>
              <div className="mt-2 text-sm text-teal-200 font-bold">
                Sets Won: <span className="text-amber-400 font-mono text-lg">{setsWonB}</span>
              </div>
            </div>
          </div>

          {/* Giant Score Numbers */}
          <div className="flex flex-col items-center justify-center my-auto py-4">
            <div className="text-[120px] sm:text-[180px] font-black tracking-tighter leading-none text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] font-mono">
              {matchState.currentPointsB}
            </div>
            <span className="text-xs text-emerald-400/80 font-mono uppercase tracking-widest mt-2">
              Tap anywhere on right side to add +1
            </span>
          </div>

          {/* Past Set History */}
          <div className="flex items-center gap-2 pt-4 border-t border-emerald-800/60">
            <span className="text-xs text-slate-400 font-mono uppercase">Past Sets:</span>
            {matchState.setScores.map((s, idx) => (
              <span
                key={idx}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                  s.b > s.a ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Set {idx + 1}: {s.b} - {s.a}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stadium Bottom Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#0a2318] border-t border-emerald-900/60 text-xs">
        <div className="flex items-center gap-4 text-slate-300">
          <span>Official 21-Point BWF System</span>
          <span>&bull;</span>
          <span>2-Point Clear Margin (Max 30)</span>
          <span>&bull;</span>
          <span>Shuttles Used: {matchState.equipment?.shuttlesUsed || 1}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onUndo}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition-colors cursor-pointer"
          >
            Undo Last Point
          </button>
          <div className="text-emerald-400 font-mono text-[11px]">
            HASSAN DEVELOPERS &bull; SMASH TOURNAMENT SYSTEM
          </div>
        </div>
      </div>
    </div>
  );
};
