import React from 'react';
import { Trophy, Award, Medal, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';
import { PlayerStats, MatchScore, MatchFormat } from '../types';
import { getPlayerColor, getInitials, getFormatLabel } from '../utils/tournament';

interface KnockoutStageProps {
  players: string[];
  standings: PlayerStats[];
  allLeagueMatchesDone: boolean;
  semis: Record<number, number>; // 0: winner SF1, 1: winner SF2
  finalWinner: number | null;
  thirdPlaceWinner: number | null;
  matchFormat?: MatchFormat;
  onSetSemiWinner: (semiIndex: number, winnerIndex: number) => void;
  onUndoSemi: (semiIndex: number) => void;
  onSetFinalWinner: (winnerIndex: number) => void;
  onUndoFinal: () => void;
  onSetThirdPlaceWinner: (winnerIndex: number) => void;
  onUndoThirdPlace: () => void;
  onNavigateToMatches: () => void;
  onOpenPlayerProfile?: (playerId: number) => void;
}

export const KnockoutStage: React.FC<KnockoutStageProps> = ({
  players,
  standings,
  allLeagueMatchesDone,
  semis,
  finalWinner,
  thirdPlaceWinner,
  matchFormat = 'bo3',
  onSetSemiWinner,
  onUndoSemi,
  onSetFinalWinner,
  onUndoFinal,
  onSetThirdPlaceWinner,
  onUndoThirdPlace,
  onNavigateToMatches,
  onOpenPlayerProfile,
}) => {
  if (standings.length < 4) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          At least 4 players are required to hold Knockout playoffs.
        </p>
      </div>
    );
  }

  // Top 4 from standings
  const seed1 = standings[0];
  const seed2 = standings[1];
  const seed3 = standings[2];
  const seed4 = standings[3];

  const sf1Winner = semis[0];
  const sf2Winner = semis[1];

  // Determine losers for 3rd place match
  let sf1Loser: number | null = null;
  if (sf1Winner !== undefined) {
    sf1Loser = sf1Winner === seed1.id ? seed4.id : seed1.id;
  }
  let sf2Loser: number | null = null;
  if (sf2Winner !== undefined) {
    sf2Loser = sf2Winner === seed2.id ? seed3.id : seed2.id;
  }

  return (
    <div className="space-y-6">
      {/* Notice if league matches are not yet all finished */}
      {!allLeagueMatchesDone && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>League in progress:</strong> Playoff seeds reflect the current live standings.
              Complete all round-robin matches to finalize seeds.
            </span>
          </div>
          <button
            onClick={onNavigateToMatches}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shrink-0 self-start sm:self-auto transition-colors"
          >
            Go to League Matches
          </button>
        </div>
      )}

      {/* Bracket Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Championship Playoff Bracket
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Semi-Finals (1st vs 4th · 2nd vs 3rd) leading to the Grand Final & Bronze Medal Match.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Single Elimination</span>
            <span aria-hidden="true">·</span>
            <span>{getFormatLabel(matchFormat)}</span>
          </div>
        </div>

        {/* Bracket Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SEMI-FINAL 1 (Seed 1 vs Seed 4) */}
          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Medal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>SEMI-FINAL 1</span>
              </span>
              <span className="text-[11px] text-slate-400">#1 Seed vs #4 Seed</span>
            </div>

            <div className="space-y-2">
              {/* Seed 1 */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  sf1Winner === seed1.id
                    ? 'bg-emerald-100/70 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-700'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div
                  onClick={() => onOpenPlayerProfile?.(seed1.id)}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <span className="text-[10px] font-bold text-slate-400 w-5">#1</span>
                  {seed1.photo ? (
                    <img
                      src={seed1.photo}
                      alt={seed1.name}
                      className="w-7 h-7 rounded-lg object-cover border border-emerald-400/50 shadow-sm shrink-0"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0"
                      style={{ backgroundColor: seed1.avatarColor }}
                    >
                      {getInitials(seed1.name)}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {seed1.name}
                  </span>
                </div>
                {sf1Winner === seed1.id && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Qualified for Final
                  </span>
                )}
              </div>

              {/* Seed 4 */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  sf1Winner === seed4.id
                    ? 'bg-emerald-100/70 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-700'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div
                  onClick={() => onOpenPlayerProfile?.(seed4.id)}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <span className="text-[10px] font-bold text-slate-400 w-5">#4</span>
                  {seed4.photo ? (
                    <img
                      src={seed4.photo}
                      alt={seed4.name}
                      className="w-7 h-7 rounded-lg object-cover border border-emerald-400/50 shadow-sm shrink-0"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0"
                      style={{ backgroundColor: seed4.avatarColor }}
                    >
                      {getInitials(seed4.name)}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {seed4.name}
                  </span>
                </div>
                {sf1Winner === seed4.id && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Qualified for Final
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              {sf1Winner === undefined ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSetSemiWinner(0, seed1.id)}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors truncate"
                  >
                    {seed1.name} Wins
                  </button>
                  <button
                    onClick={() => onSetSemiWinner(0, seed4.id)}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors truncate"
                  >
                    {seed4.name} Wins
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Advancing: <strong className="text-emerald-600 dark:text-emerald-400">{players[sf1Winner]}</strong>
                  </span>
                  <button
                    onClick={() => onUndoSemi(0)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Undo</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SEMI-FINAL 2 (Seed 2 vs Seed 3) */}
          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Medal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>SEMI-FINAL 2</span>
              </span>
              <span className="text-[11px] text-slate-400">#2 Seed vs #3 Seed</span>
            </div>

            <div className="space-y-2">
              {/* Seed 2 */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  sf2Winner === seed2.id
                    ? 'bg-emerald-100/70 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-700'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div
                  onClick={() => onOpenPlayerProfile?.(seed2.id)}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <span className="text-[10px] font-bold text-slate-400 w-5">#2</span>
                  {seed2.photo ? (
                    <img
                      src={seed2.photo}
                      alt={seed2.name}
                      className="w-7 h-7 rounded-lg object-cover border border-emerald-400/50 shadow-sm shrink-0"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0"
                      style={{ backgroundColor: seed2.avatarColor }}
                    >
                      {getInitials(seed2.name)}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {seed2.name}
                  </span>
                </div>
                {sf2Winner === seed2.id && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Qualified for Final
                  </span>
                )}
              </div>

              {/* Seed 3 */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  sf2Winner === seed3.id
                    ? 'bg-emerald-100/70 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-700'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div
                  onClick={() => onOpenPlayerProfile?.(seed3.id)}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <span className="text-[10px] font-bold text-slate-400 w-5">#3</span>
                  {seed3.photo ? (
                    <img
                      src={seed3.photo}
                      alt={seed3.name}
                      className="w-7 h-7 rounded-lg object-cover border border-emerald-400/50 shadow-sm shrink-0"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0"
                      style={{ backgroundColor: seed3.avatarColor }}
                    >
                      {getInitials(seed3.name)}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {seed3.name}
                  </span>
                </div>
                {sf2Winner === seed3.id && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Qualified for Final
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              {sf2Winner === undefined ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSetSemiWinner(1, seed2.id)}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors truncate"
                  >
                    {seed2.name} Wins
                  </button>
                  <button
                    onClick={() => onSetSemiWinner(1, seed3.id)}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors truncate"
                  >
                    {seed3.name} Wins
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Advancing: <strong className="text-emerald-600 dark:text-emerald-400">{players[sf2Winner]}</strong>
                  </span>
                  <button
                    onClick={() => onUndoSemi(1)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Undo</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GRAND FINAL SECTION */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 via-emerald-500/5 to-transparent border border-amber-300/40 dark:border-amber-800/40 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Grand Championship Final
                </h3>
              </div>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                Gold & Silver Medal Match
              </span>
            </div>

            {sf1Winner !== undefined && sf2Winner !== undefined ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Finalist 1 */}
                  <div
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      finalWinner === sf1Winner
                        ? 'bg-amber-100/80 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow"
                        style={{ backgroundColor: getPlayerColor(sf1Winner) }}
                      >
                        {getInitials(players[sf1Winner])}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
                          {players[sf1Winner]}
                        </span>
                        <span className="text-[11px] text-slate-400">Winner SF1</span>
                      </div>
                    </div>
                    {finalWinner === sf1Winner && (
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        🏆 Champion
                      </span>
                    )}
                  </div>

                  {/* Finalist 2 */}
                  <div
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      finalWinner === sf2Winner
                        ? 'bg-amber-100/80 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow"
                        style={{ backgroundColor: getPlayerColor(sf2Winner) }}
                      >
                        {getInitials(players[sf2Winner])}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
                          {players[sf2Winner]}
                        </span>
                        <span className="text-[11px] text-slate-400">Winner SF2</span>
                      </div>
                    </div>
                    {finalWinner === sf2Winner && (
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        🏆 Champion
                      </span>
                    )}
                  </div>
                </div>

                {/* Final Winner Selector */}
                {finalWinner === null ? (
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => onSetFinalWinner(sf1Winner)}
                      className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <Trophy className="w-4 h-4" />
                      <span>{players[sf1Winner]} Wins Title</span>
                    </button>
                    <button
                      onClick={() => onSetFinalWinner(sf2Winner)}
                      className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <Trophy className="w-4 h-4" />
                      <span>{players[sf2Winner]} Wins Title</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                      🏆 Crowned Champion: <strong>{players[finalWinner]}</strong>
                    </span>
                    <button
                      onClick={onUndoFinal}
                      className="px-3.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 hover:bg-amber-100/50 text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Undo Final</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 dark:text-slate-400">
                Complete both Semi-Finals above to unlock the Grand Finalists.
              </div>
            )}
          </div>
        </div>

        {/* 3RD PLACE PLAYOFF (BRONZE MATCH) */}
        {sf1Loser !== null && sf2Loser !== null && (
          <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <Medal className="w-4 h-4" />
                <span>3rd Place Playoff (Bronze Medal)</span>
              </span>
              <span>{players[sf1Loser]} vs {players[sf2Loser]}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600 dark:text-slate-300">
                {thirdPlaceWinner !== null ? (
                  <span>
                    🥉 Bronze Medalist: <strong className="text-emerald-600 dark:text-emerald-400">{players[thirdPlaceWinner]}</strong>
                  </span>
                ) : (
                  <span>Select Bronze Medalist:</span>
                )}
              </div>

              {thirdPlaceWinner === null ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => onSetThirdPlaceWinner(sf1Loser!)}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors"
                  >
                    {players[sf1Loser]} Wins 3rd
                  </button>
                  <button
                    onClick={() => onSetThirdPlaceWinner(sf2Loser!)}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors"
                  >
                    {players[sf2Loser]} Wins 3rd
                  </button>
                </div>
              ) : (
                <button
                  onClick={onUndoThirdPlace}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
                >
                  Undo 3rd Place
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
