import React from 'react';
import { Award, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { PlayerStats } from '../types';
import { getInitials } from '../utils/tournament';

interface StandingsTableProps {
  standings: PlayerStats[];
  onNavigateToKnockout: () => void;
  allMatchesDone: boolean;
  onOpenPlayerProfile?: (playerId: number) => void;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  standings,
  onNavigateToKnockout,
  allMatchesDone,
  onOpenPlayerProfile,
}) => {
  return (
    <div className="space-y-6">
      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Table Header / Action */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                League Standings
              </h2>
              {allMatchesDone && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Finalized</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Top 4 players advance directly to the Knockout Semi-Finals. Click any player to view profile.
            </p>
          </div>

          <button
            onClick={onNavigateToKnockout}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <Award className="w-4 h-4" />
            <span>View Playoff Bracket</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th scope="col" className="py-3.5 pl-4 sm:pl-6 pr-2 w-12 text-center">
                  Pos
                </th>
                <th scope="col" className="py-3.5 px-3">
                  Player
                </th>
                <th scope="col" className="py-3.5 px-3 text-center">
                  MP
                </th>
                <th scope="col" className="py-3.5 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                  W
                </th>
                <th scope="col" className="py-3.5 px-3 text-center text-rose-600 dark:text-rose-400">
                  L
                </th>
                <th scope="col" className="py-3.5 px-3 text-center hidden md:table-cell">
                  Sets
                </th>
                <th scope="col" className="py-3.5 px-3 text-center hidden sm:table-cell">
                  Diff
                </th>
                <th scope="col" className="py-3.5 px-3 text-center text-slate-900 dark:text-slate-100 font-extrabold">
                  Pts
                </th>
                <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-6 text-center hidden lg:table-cell">
                  Form
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {standings.map((player, index) => {
                const isQualified = index < 4;
                const isCutoff = index === 3;
                const pointDiff = player.pointsFor - player.pointsAgainst;

                return (
                  <React.Fragment key={player.id}>
                    <tr
                      className={`transition-colors ${
                        isQualified
                          ? 'bg-emerald-50/20 dark:bg-emerald-950/10 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Rank Position */}
                      <td className="py-3.5 pl-4 sm:pl-6 pr-2 text-center">
                        <div className="flex items-center justify-center">
                          {index === 0 ? (
                            <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-bold text-xs flex items-center justify-center shadow-sm">
                              1
                            </span>
                          ) : index === 1 ? (
                            <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center shadow-sm">
                              2
                            </span>
                          ) : index === 2 ? (
                            <span className="w-6 h-6 rounded-full bg-amber-600 text-amber-100 font-bold text-xs flex items-center justify-center shadow-sm">
                              3
                            </span>
                          ) : index === 3 ? (
                            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold text-xs flex items-center justify-center">
                              4
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 tabular-nums">
                              {index + 1}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Player Profile with Picture */}
                      <td className="py-3.5 px-3">
                        <div
                          onClick={() => onOpenPlayerProfile?.(player.id)}
                          className="flex items-center gap-2.5 cursor-pointer group"
                        >
                          {player.photo ? (
                            <img
                              src={player.photo}
                              alt={player.name}
                              className="w-8 h-8 rounded-xl object-cover border border-emerald-400/50 shadow-sm shrink-0"
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-[11px] shadow-sm shrink-0"
                              style={{ backgroundColor: player.avatarColor }}
                            >
                              {getInitials(player.name)}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors block leading-tight">
                              {player.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block -mt-0.5">
                              {player.bio?.playStyle || (isQualified ? 'Semi-Finals Zone' : 'Competitor')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Matches Played */}
                      <td className="py-3.5 px-3 text-center text-xs font-medium text-slate-600 dark:text-slate-400 tabular-nums">
                        {player.played}
                      </td>

                      {/* Won */}
                      <td className="py-3.5 px-3 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {player.won}
                      </td>

                      {/* Lost */}
                      <td className="py-3.5 px-3 text-center text-xs font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                        {player.lost}
                      </td>

                      {/* Sets Won/Lost */}
                      <td className="py-3.5 px-3 text-center text-xs text-slate-500 dark:text-slate-400 tabular-nums hidden md:table-cell">
                        {player.setsWon > 0 || player.setsLost > 0
                          ? `${player.setsWon} - ${player.setsLost}`
                          : '—'}
                      </td>

                      {/* Point Diff */}
                      <td className="py-3.5 px-3 text-center text-xs tabular-nums hidden sm:table-cell">
                        <span
                          className={`font-semibold ${
                            pointDiff > 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : pointDiff < 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {pointDiff > 0 ? `+${pointDiff}` : pointDiff}
                        </span>
                      </td>

                      {/* Points */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm tabular-nums">
                          {player.points}
                        </span>
                      </td>

                      {/* Form (Recent W/L dots) */}
                      <td className="py-3.5 pl-3 pr-4 sm:pr-6 text-center hidden lg:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          {player.form.length === 0 ? (
                            <span className="text-[11px] text-slate-400">—</span>
                          ) : (
                            player.form.slice(-5).map((res, fIdx) => (
                              <span
                                key={fIdx}
                                className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center text-white ${
                                  res === 'W' ? 'bg-emerald-600' : 'bg-slate-400 dark:bg-slate-600'
                                }`}
                                title={res === 'W' ? 'Win' : 'Loss'}
                              >
                                {res}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Cutoff visual separator after 4th place */}
                    {isCutoff && standings.length > 4 && (
                      <tr className="bg-emerald-500/10">
                        <td
                          colSpan={9}
                          className="py-1 px-4 text-center text-[10px] font-bold tracking-wider text-emerald-700 dark:text-emerald-300 uppercase border-y border-emerald-300/40 dark:border-emerald-800/40"
                        >
                          ▲ Top 4 Qualify for Semi-Finals Knockout Stage ▲
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer Notes */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <div>
            <strong>Scoring:</strong> Win = 2 pts · Loss = 0 pts. Ties broken by wins, set differential, then points.
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Semi-Final Pairings: 1st vs 4th · 2nd vs 3rd</span>
          </div>
        </div>
      </div>
    </div>
  );
};
