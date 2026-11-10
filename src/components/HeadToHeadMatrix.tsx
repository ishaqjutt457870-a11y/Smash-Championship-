import React from 'react';
import { Users2 } from 'lucide-react';
import { TournamentMatch, MatchScore } from '../types';
import { getPlayerColor, getInitials, formatScore } from '../utils/tournament';

interface HeadToHeadMatrixProps {
  players: string[];
  fixtures: TournamentMatch[];
  results: Record<string, number>;
  scores: Record<string, MatchScore>;
  playerPhotos?: Record<number, string>;
  onOpenPlayerProfile?: (playerId: number) => void;
}

export const HeadToHeadMatrix: React.FC<HeadToHeadMatrixProps> = ({
  players,
  fixtures,
  results,
  scores,
  playerPhotos,
  onOpenPlayerProfile,
}) => {
  // Build lookup map for match outcome between any two players
  const matchMap: Record<string, { winner?: number; matchId: string; score?: MatchScore }> = {};

  fixtures.forEach((m) => {
    const key1 = `${m.playerAIndex}-${m.playerBIndex}`;
    const key2 = `${m.playerBIndex}-${m.playerAIndex}`;
    const data = {
      winner: results[m.id],
      matchId: m.id,
      score: scores[m.id],
    };
    matchMap[key1] = data;
    matchMap[key2] = data;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6">
        <div className="mb-4 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Users2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Head-to-Head Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cross-grid view of all match results between every player in the tournament.
            </p>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />
              <span>Win</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" />
              <span>Loss</span>
            </span>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left font-semibold text-slate-400 border-b border-slate-200 dark:border-slate-800 min-w-[130px]">
                  Player (Row) vs
                </th>
                {players.map((p, idx) => (
                  <th
                    key={idx}
                    className="p-2 font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 min-w-[50px]"
                    title={p}
                  >
                    <div
                      onClick={() => onOpenPlayerProfile?.(idx)}
                      className="flex flex-col items-center cursor-pointer group"
                    >
                      {playerPhotos?.[idx] ? (
                        <img
                          src={playerPhotos[idx]}
                          alt={p}
                          className="w-6 h-6 rounded-md object-cover border border-emerald-400/50 shadow-sm mb-1"
                        />
                      ) : (
                        <div
                          className="w-6 h-6 rounded-md text-white font-bold text-[10px] flex items-center justify-center mb-1 shadow-sm"
                          style={{ backgroundColor: getPlayerColor(idx) }}
                        >
                          {getInitials(p)}
                        </div>
                      )}
                      <span className="truncate max-w-[44px] block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {idx + 1}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players.map((rowPlayer, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                  {/* Row Player Label */}
                  <td className="p-2 text-left font-semibold text-slate-900 dark:text-slate-100">
                    <div
                      onClick={() => onOpenPlayerProfile?.(rIdx)}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      {playerPhotos?.[rIdx] ? (
                        <img
                          src={playerPhotos[rIdx]}
                          alt={rowPlayer}
                          className="w-5 h-5 rounded object-cover border border-emerald-400/50 shadow-sm shrink-0"
                        />
                      ) : (
                        <div
                          className="w-5 h-5 rounded text-white font-bold text-[9px] flex items-center justify-center shrink-0"
                          style={{ backgroundColor: getPlayerColor(rIdx) }}
                        >
                          {getInitials(rowPlayer)}
                        </div>
                      )}
                      <span className="truncate max-w-[110px] block font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {rIdx + 1}. {rowPlayer}
                      </span>
                    </div>
                  </td>

                  {/* Columns */}
                  {players.map((colPlayer, cIdx) => {
                    if (rIdx === cIdx) {
                      return (
                        <td key={cIdx} className="p-2 bg-slate-100/60 dark:bg-slate-800/40 text-slate-300 dark:text-slate-600 font-bold">
                          —
                        </td>
                      );
                    }

                    const key = `${rIdx}-${cIdx}`;
                    const matchInfo = matchMap[key];
                    const winner = matchInfo?.winner;
                    const hasResult = winner !== undefined;
                    const isWin = winner === rIdx;
                    const score = matchInfo?.score;
                    const scoreStr = formatScore(score);

                    return (
                      <td key={cIdx} className="p-1.5">
                        {hasResult ? (
                          <div
                            className={`py-1 px-1 rounded-md text-[11px] font-bold ${
                              isWin
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                            }`}
                            title={`${rowPlayer} vs ${colPlayer}: ${isWin ? 'Won' : 'Lost'}${scoreStr ? ` (${scoreStr})` : ''}`}
                          >
                            {isWin ? 'W' : 'L'}
                          </div>
                        ) : (
                          <div className="py-1 px-1 text-slate-300 dark:text-slate-600 font-medium">
                            ·
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
