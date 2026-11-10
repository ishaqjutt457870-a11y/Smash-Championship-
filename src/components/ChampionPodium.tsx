import React from 'react';
import { Trophy, Award, Medal, Sparkles, Share2, RotateCcw } from 'lucide-react';
import { PlayerStats } from '../types';
import { getPlayerColor, getInitials } from '../utils/tournament';
import { fireConfetti } from '../utils/confetti';

interface ChampionPodiumProps {
  players: string[];
  finalWinner: number;
  runnerUp: number | null;
  thirdPlace: number | null;
  standings: PlayerStats[];
  onResetTournament: () => void;
  onOpenShareModal: () => void;
}

export const ChampionPodium: React.FC<ChampionPodiumProps> = ({
  players,
  finalWinner,
  runnerUp,
  thirdPlace,
  standings,
  onResetTournament,
  onOpenShareModal,
}) => {
  const championName = players[finalWinner];
  const championStats = standings.find((s) => s.id === finalWinner);
  const runnerUpName = runnerUp !== null ? players[runnerUp] : null;
  const thirdPlaceName = thirdPlace !== null ? players[thirdPlace] : null;

  return (
    <div className="bg-gradient-to-b from-amber-500/15 via-emerald-600/10 to-transparent dark:from-amber-500/10 dark:via-emerald-950/20 rounded-3xl p-6 sm:p-8 border border-amber-300/50 dark:border-amber-700/40 shadow-lg text-center relative overflow-hidden">
      {/* Decorative shuttlecock background icons */}
      <div className="absolute top-2 left-6 text-6xl opacity-10 select-none pointer-events-none">🏸</div>
      <div className="absolute bottom-2 right-6 text-6xl opacity-10 select-none pointer-events-none">🏸</div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-400/30 mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>TOURNAMENT CONCLUDED</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
        Smash Champion Crowned!
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-1">
        All tournament rounds and championship playoffs have successfully finished.
      </p>

      {/* Podium Stage */}
      <div className="mt-8 flex items-end justify-center gap-3 sm:gap-6 max-w-xl mx-auto">
        {/* 2nd Place (Silver) */}
        {runnerUpName && runnerUp !== null && (
          <div className="flex-1 flex flex-col items-center">
            <div className="relative mb-2">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm sm:text-base shadow-md"
                style={{ backgroundColor: getPlayerColor(runnerUp) }}
              >
                {getInitials(runnerUpName)}
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-black text-xs flex items-center justify-center shadow">
                2
              </div>
            </div>
            <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate max-w-[100px] block">
              {runnerUpName}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Runner-Up</span>
            <div className="w-full h-20 bg-slate-200/80 dark:bg-slate-800/80 rounded-t-xl mt-2 flex items-center justify-center text-slate-500 font-bold text-xs border-t-2 border-slate-300 dark:border-slate-700">
              🥈 Silver
            </div>
          </div>
        )}

        {/* 1st Place (Gold / Champion) */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative mb-2">
            <div className="text-3xl animate-bounce mb-1">👑</div>
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center text-white font-black text-base sm:text-xl shadow-xl border-4 border-amber-300"
              style={{ backgroundColor: getPlayerColor(finalWinner) }}
            >
              {getInitials(championName)}
            </div>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-lg">
              1
            </div>
          </div>
          <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate max-w-[130px] block mt-1">
            {championName}
          </span>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">CHAMPION</span>
          <div className="w-full h-32 bg-amber-400/30 dark:bg-amber-500/20 rounded-t-2xl mt-2 flex flex-col items-center justify-center text-amber-800 dark:text-amber-300 font-bold text-xs border-t-4 border-amber-400 shadow-sm p-1">
            <Trophy className="w-6 h-6 mb-1 text-amber-500" />
            <span>🏆 Gold</span>
          </div>
        </div>

        {/* 3rd Place (Bronze) */}
        {thirdPlaceName && thirdPlace !== null && (
          <div className="flex-1 flex flex-col items-center">
            <div className="relative mb-2">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm sm:text-base shadow-md"
                style={{ backgroundColor: getPlayerColor(thirdPlace) }}
              >
                {getInitials(thirdPlaceName)}
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow">
                3
              </div>
            </div>
            <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate max-w-[100px] block">
              {thirdPlaceName}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">3rd Place</span>
            <div className="w-full h-14 bg-amber-700/20 dark:bg-amber-900/30 rounded-t-xl mt-2 flex items-center justify-center text-amber-800 dark:text-amber-300 font-bold text-xs border-t-2 border-amber-600">
              🥉 Bronze
            </div>
          </div>
        )}
      </div>

      {/* Champion Performance Card */}
      {championStats && (
        <div className="mt-8 max-w-md mx-auto p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-around text-xs">
          <div>
            <span className="text-slate-400 block">League Wins</span>
            <span className="text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {championStats.won} / {championStats.played}
            </span>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
          <div>
            <span className="text-slate-400 block">League Points</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {championStats.points} pts
            </span>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
          <div>
            <span className="text-slate-400 block">Status</span>
            <span className="text-base font-bold text-amber-500">Gold MVP</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={fireConfetti}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Fire Confetti Again</span>
        </button>

        <button
          onClick={onOpenShareModal}
          className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:opacity-90 text-white dark:text-slate-900 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Tournament Results</span>
        </button>

        <button
          onClick={onResetTournament}
          className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Start New Tournament</span>
        </button>
      </div>
    </div>
  );
};
