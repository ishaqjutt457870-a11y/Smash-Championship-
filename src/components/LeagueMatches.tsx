import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Filter, ChevronDown, ChevronUp, Sparkles, Trophy, Award } from 'lucide-react';
import { TournamentMatch, MatchScore, MatchFormat } from '../types';
import { getPlayerColor, getInitials, formatScore, getSetsRequiredToWin, getFormatLabel } from '../utils/tournament';

interface LeagueMatchesProps {
  players: string[];
  fixtures: TournamentMatch[];
  results: Record<string, number>;
  scores: Record<string, MatchScore>;
  matchFormat: MatchFormat;
  setMatchFormat?: (fmt: MatchFormat) => void;
  playerPhotos?: Record<number, string>;
  onSetResult: (matchId: string, winnerIndex: number, score?: MatchScore) => void;
  onUndoResult: (matchId: string) => void;
  onSimulateAll: () => void;
  onOpenPlayerProfile: (playerId: number) => void;
  onLaunchLiveScorer?: (matchId: string) => void;
}

export const LeagueMatches: React.FC<LeagueMatchesProps> = ({
  players,
  fixtures,
  results,
  scores,
  matchFormat,
  setMatchFormat,
  playerPhotos,
  onSetResult,
  onUndoResult,
  onSimulateAll,
  onOpenPlayerProfile,
  onLaunchLiveScorer,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedPlayerFilter, setSelectedPlayerFilter] = useState<number | 'all'>('all');
  const [expandedScoreMatchId, setExpandedScoreMatchId] = useState<string | null>(null);

  // Temporary local state for score inputs while editing
  const [tempScores, setTempScores] = useState<Record<string, Record<string, string>>>({});

  const completedMatches = fixtures.filter((m) => results[m.id] !== undefined);
  const totalCount = fixtures.length;
  const completedCount = completedMatches.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter fixtures
  const filteredMatches = fixtures.filter((match) => {
    const isCompleted = results[match.id] !== undefined;
    if (filterMode === 'pending' && isCompleted) return false;
    if (filterMode === 'completed' && !isCompleted) return false;

    if (selectedPlayerFilter !== 'all') {
      if (match.playerAIndex !== selectedPlayerFilter && match.playerBIndex !== selectedPlayerFilter) {
        return false;
      }
    }
    return true;
  });

  const handleScoreChange = (matchId: string, field: string, value: string) => {
    setTempScores((prev) => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || {}),
        [field]: value,
      },
    }));
  };

  const handleSaveDetailedScore = (match: TournamentMatch) => {
    const temp = tempScores[match.id] || {};
    const s1a = parseInt(temp.s1a || '21', 10);
    const s1b = parseInt(temp.s1b || '18', 10);
    const s2a = temp.s2a ? parseInt(temp.s2a, 10) : matchFormat !== 'bo1' ? 21 : undefined;
    const s2b = temp.s2b ? parseInt(temp.s2b, 10) : matchFormat !== 'bo1' ? 15 : undefined;
    const s3a = temp.s3a ? parseInt(temp.s3a, 10) : undefined;
    const s3b = temp.s3b ? parseInt(temp.s3b, 10) : undefined;
    const s4a = temp.s4a ? parseInt(temp.s4a, 10) : undefined;
    const s4b = temp.s4b ? parseInt(temp.s4b, 10) : undefined;
    const s5a = temp.s5a ? parseInt(temp.s5a, 10) : undefined;
    const s5b = temp.s5b ? parseInt(temp.s5b, 10) : undefined;

    let setsWonA = 0;
    let setsWonB = 0;

    const setPairs: Array<[number | undefined, number | undefined]> = [
      [s1a, s1b],
      [s2a, s2b],
      [s3a, s3b],
      [s4a, s4b],
      [s5a, s5b],
    ];

    setPairs.forEach(([sa, sb]) => {
      if (sa !== undefined && sb !== undefined && (sa > 0 || sb > 0)) {
        if (sa > sb) setsWonA++;
        else if (sb > sa) setsWonB++;
      }
    });

    const winnerIndex = setsWonA >= setsWonB ? match.playerAIndex : match.playerBIndex;
    const scoreObj: MatchScore = {
      s1a,
      s1b,
      ...(s2a !== undefined && s2b !== undefined ? { s2a, s2b } : {}),
      ...(s3a !== undefined && s3b !== undefined ? { s3a, s3b } : {}),
      ...(s4a !== undefined && s4b !== undefined ? { s4a, s4b } : {}),
      ...(s5a !== undefined && s5b !== undefined ? { s5a, s5b } : {}),
    };

    onSetResult(match.id, winnerIndex, scoreObj);
    setExpandedScoreMatchId(null);
  };

  return (
    <div className="space-y-6">
      {/* Progress & Format Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                League Matches
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ({completedCount} / {totalCount} completed)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Format: <strong className="text-emerald-700 dark:text-emerald-300 font-bold">{getFormatLabel(matchFormat)}</strong>. Record quick wins or detailed set points.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Format quick switch */}
            {setMatchFormat && (
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
                <button
                  onClick={() => setMatchFormat('bo1')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                    matchFormat === 'bo1'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                  title="Switch to Best of 1 Set"
                >
                  Bo1
                </button>
                <button
                  onClick={() => setMatchFormat('bo3')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                    matchFormat === 'bo3'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                  title="Switch to Best of 3 Sets"
                >
                  Bo3
                </button>
                <button
                  onClick={() => setMatchFormat('bo5')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                    matchFormat === 'bo5'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                  title="Switch to Best of 5 Sets"
                >
                  Bo5
                </button>
              </div>
            )}

            {completedCount < totalCount && (
              <button
                onClick={onSimulateAll}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
                title="Automatically simulate remaining matches with realistic scores"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Simulate Remaining</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span>Overall League Completion</span>
            <span className="font-bold tabular-nums text-slate-800 dark:text-slate-200">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterMode === 'pending'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Pending ({totalCount - completedCount})
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterMode === 'completed'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Player:</span>
            </span>
            <select
              value={selectedPlayerFilter}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedPlayerFilter(val === 'all' ? 'all' : parseInt(val, 10));
              }}
              className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Players</option>
              {players.map((p, i) => (
                <option key={i} value={i}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Match Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No matches found matching the selected filter.
            </div>
          </div>
        ) : (
          filteredMatches.map((match, idx) => {
            const playerA = players[match.playerAIndex];
            const playerB = players[match.playerBIndex];
            const colorA = getPlayerColor(match.playerAIndex);
            const colorB = getPlayerColor(match.playerBIndex);
            const photoA = playerPhotos?.[match.playerAIndex];
            const photoB = playerPhotos?.[match.playerBIndex];
            const winner = results[match.id];
            const isCompleted = winner !== undefined;
            const score = scores[match.id];
            const formattedScoreStr = formatScore(score);
            const isExpanded = expandedScoreMatchId === match.id;

            return (
              <div
                key={match.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border transition-all ${
                  isCompleted
                    ? 'border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Match Header */}
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-3">
                  <span className="font-semibold tracking-wide">
                    MATCH {match.roundNumber || idx + 1}
                  </span>
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="text-slate-400">Upcoming ({getFormatLabel(matchFormat)})</span>
                  )}
                </div>

                {/* Competitors Display with Profile Picture Integration */}
                <div className="space-y-2.5">
                  {/* Player A */}
                  <div
                    className={`flex items-center justify-between p-2.5 rounded-2xl border transition-colors ${
                      winner === match.playerAIndex
                        ? 'bg-emerald-100/70 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-50/80 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60'
                    }`}
                  >
                    <div
                      onClick={() => onOpenPlayerProfile(match.playerAIndex)}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      {photoA ? (
                        <img
                          src={photoA}
                          alt={playerA}
                          className="w-8 h-8 rounded-xl object-cover border border-emerald-400/50 shadow-sm shrink-0"
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0"
                          style={{ backgroundColor: colorA }}
                        >
                          {getInitials(playerA)}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate block">
                          {playerA}
                        </span>
                        <span className="text-[10px] text-slate-400 block -mt-0.5">Click for profile</span>
                      </div>
                    </div>

                    {winner === match.playerAIndex && (
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Winner</span>
                      </span>
                    )}
                  </div>

                  {/* VS Divider */}
                  <div className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                    VS
                  </div>

                  {/* Player B */}
                  <div
                    className={`flex items-center justify-between p-2.5 rounded-2xl border transition-colors ${
                      winner === match.playerBIndex
                        ? 'bg-emerald-100/70 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-50/80 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60'
                    }`}
                  >
                    <div
                      onClick={() => onOpenPlayerProfile(match.playerBIndex)}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      {photoB ? (
                        <img
                          src={photoB}
                          alt={playerB}
                          className="w-8 h-8 rounded-xl object-cover border border-emerald-400/50 shadow-sm shrink-0"
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0"
                          style={{ backgroundColor: colorB }}
                        >
                          {getInitials(playerB)}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate block">
                          {playerB}
                        </span>
                        <span className="text-[10px] text-slate-400 block -mt-0.5">Click for profile</span>
                      </div>
                    </div>

                    {winner === match.playerBIndex && (
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Winner</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Score Summary Tag if set */}
                {formattedScoreStr && (
                  <div className="mt-2.5 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Scores: <span className="tabular-nums font-semibold">{formattedScoreStr}</span>
                  </div>
                )}

                {/* Actions / Winner Selection */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {!isCompleted ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onSetResult(match.id, match.playerAIndex)}
                          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl transition-all shadow-sm truncate"
                          title={`Record win for ${playerA}`}
                        >
                          {playerA} Wins
                        </button>
                        <button
                          onClick={() => onSetResult(match.id, match.playerBIndex)}
                          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl transition-all shadow-sm truncate"
                          title={`Record win for ${playerB}`}
                        >
                          {playerB} Wins
                        </button>
                      </div>

                      {/* Launch Live Court Umpire */}
                      {onLaunchLiveScorer && (
                        <button
                          type="button"
                          onClick={() => onLaunchLiveScorer(match.id)}
                          className="w-full py-2 px-3 bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <span>🏸 Umpire Match Live (Court Scorer)</span>
                        </button>
                      )}

                      {/* Expand Detailed Score toggle */}
                      <button
                        onClick={() =>
                          setExpandedScoreMatchId(isExpanded ? null : match.id)
                        }
                        className="w-full text-center py-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-1"
                      >
                        <span>{isExpanded ? 'Hide Score Form' : `Enter Sets (${matchFormat === 'bo1' ? '1 Set' : matchFormat === 'bo5' ? 'Up to 5 Sets' : 'Up to 3 Sets'})`}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {/* Detailed Score Input Form for Bo1, Bo3, or Bo5 */}
                      {isExpanded && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                            <span>Badminton Set Points:</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                              {getFormatLabel(matchFormat)}
                            </span>
                          </div>

                          <div className={`grid ${matchFormat === 'bo1' ? 'grid-cols-1' : matchFormat === 'bo5' ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-3'} gap-2 text-center`}>
                            {/* Set 1 */}
                            <div>
                              <span className="text-[10px] text-slate-400 block mb-1">Set 1</span>
                              <div className="flex items-center gap-1 justify-center">
                                <input
                                  type="number"
                                  placeholder="21"
                                  defaultValue="21"
                                  className="w-10 px-1 py-1 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                                  onChange={(e) => handleScoreChange(match.id, 's1a', e.target.value)}
                                />
                                <span>-</span>
                                <input
                                  type="number"
                                  placeholder="18"
                                  defaultValue="18"
                                  className="w-10 px-1 py-1 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                                  onChange={(e) => handleScoreChange(match.id, 's1b', e.target.value)}
                                />
                              </div>
                            </div>

                            {/* Set 2 (if Bo3 or Bo5) */}
                            {matchFormat !== 'bo1' && (
                              <div>
                                <span className="text-[10px] text-slate-400 block mb-1">Set 2</span>
                                <div className="flex items-center gap-1 justify-center">
                                  <input
                                    type="number"
                                    placeholder="21"
                                    defaultValue="21"
                                    className="w-10 px-1 py-1 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                                    onChange={(e) => handleScoreChange(match.id, 's2a', e.target.value)}
                                  />
                                  <span>-</span>
                                  <input
                                    type="number"
                                    placeholder="15"
                                    defaultValue="15"
                                    className="w-10 px-1 py-1 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                                    onChange={(e) => handleScoreChange(match.id, 's2b', e.target.value)}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Set 3 (if Bo3 or Bo5) */}
                            {matchFormat !== 'bo1' && (
                              <div>
                                <span className="text-[10px] text-slate-400 block mb-1">Set 3</span>
                                <div className="flex items-center gap-1 justify-center">
                                  <input
                                    type="number"
                                    placeholder="—"
                                    className="w-10 px-1 py-1 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                                    onChange={(e) => handleScoreChange(match.id, 's3a', e.target.value)}
                                  />
                                  <span>-</span>
                                  <input
                                    type="number"
                                    placeholder="—"
                                    className="w-10 px-1 py-1 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                                    onChange={(e) => handleScoreChange(match.id, 's3b', e.target.value)}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Set 4 & 5 (if Bo5) */}
                            {matchFormat === 'bo5' && (
                              <>
                                <div>
                                  <span className="text-[10px] text-slate-400 block mb-1">Set 4</span>
                                  <div className="flex items-center gap-1 justify-center">
                                    <input
                                      type="number"
                                      placeholder="—"
                                      className="w-10 px-1 py-1 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                                      onChange={(e) => handleScoreChange(match.id, 's4a', e.target.value)}
                                    />
                                    <span>-</span>
                                    <input
                                      type="number"
                                      placeholder="—"
                                      className="w-10 px-1 py-1 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                                      onChange={(e) => handleScoreChange(match.id, 's4b', e.target.value)}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <span className="text-[10px] text-slate-400 block mb-1">Set 5</span>
                                  <div className="flex items-center gap-1 justify-center">
                                    <input
                                      type="number"
                                      placeholder="—"
                                      className="w-10 px-1 py-1 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                                      onChange={(e) => handleScoreChange(match.id, 's5a', e.target.value)}
                                    />
                                    <span>-</span>
                                    <input
                                      type="number"
                                      placeholder="—"
                                      className="w-10 px-1 py-1 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                                      onChange={(e) => handleScoreChange(match.id, 's5b', e.target.value)}
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          <button
                            onClick={() => handleSaveDetailedScore(match)}
                            className="w-full mt-2 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl text-xs hover:opacity-90 transition-opacity"
                          >
                            Save Score & Confirm Winner
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Result: <strong className="text-emerald-700 dark:text-emerald-300">{players[winner]}</strong> won
                      </span>
                      <button
                        onClick={() => onUndoResult(match.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Undo</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
