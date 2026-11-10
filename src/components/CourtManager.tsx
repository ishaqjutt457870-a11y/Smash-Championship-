import React, { useState } from 'react';
import {
  Tv,
  Play,
  Clock,
  CheckCircle2,
  Users,
  Plus,
  Trash2,
  RotateCcw,
  Zap,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { TournamentMatch, MatchScore } from '../types';

interface Court {
  id: number;
  name: string;
  assignedMatchId: string | null;
  status: 'available' | 'warmup' | 'in_progress' | 'maintenance';
}

interface CourtManagerProps {
  players: string[];
  fixtures: TournamentMatch[];
  results: Record<string, number>;
  scores: Record<string, MatchScore>;
  playerPhotos?: Record<number, string>;
  onLaunchLiveScorer: (matchId: string, courtNumber: number) => void;
}

export const CourtManager: React.FC<CourtManagerProps> = ({
  players,
  fixtures,
  results,
  scores,
  playerPhotos,
  onLaunchLiveScorer,
}) => {
  const [courts, setCourts] = useState<Court[]>([
    { id: 1, name: 'Court 1 (Center)', assignedMatchId: fixtures[0]?.id || null, status: 'in_progress' },
    { id: 2, name: 'Court 2', assignedMatchId: fixtures[1]?.id || null, status: 'warmup' },
    { id: 3, name: 'Court 3', assignedMatchId: null, status: 'available' },
    { id: 4, name: 'Court 4', assignedMatchId: null, status: 'available' },
  ]);

  const [newCourtName, setNewCourtName] = useState('');
  const [selectedMatchToAssign, setSelectedMatchToAssign] = useState<Record<number, string>>({});

  // Pending matches that haven't been completed yet
  const pendingFixtures = fixtures.filter((f) => results[f.id] === undefined);

  const handleAddCourt = () => {
    if (!newCourtName.trim()) return;
    const nextId = courts.length > 0 ? Math.max(...courts.map((c) => c.id)) + 1 : 1;
    setCourts([
      ...courts,
      {
        id: nextId,
        name: newCourtName.trim(),
        assignedMatchId: null,
        status: 'available',
      },
    ]);
    setNewCourtName('');
  };

  const handleRemoveCourt = (id: number) => {
    if (courts.length <= 1) {
      alert('Must have at least one court.');
      return;
    }
    setCourts(courts.filter((c) => c.id !== id));
  };

  const handleUpdateStatus = (
    courtId: number,
    newStatus: 'available' | 'warmup' | 'in_progress' | 'maintenance'
  ) => {
    setCourts(
      courts.map((c) => {
        if (c.id === courtId) {
          return {
            ...c,
            status: newStatus,
            ...(newStatus === 'available' ? { assignedMatchId: null } : {}),
          };
        }
        return c;
      })
    );
  };

  const handleAssignMatch = (courtId: number, matchId: string) => {
    setCourts(
      courts.map((c) => {
        if (c.id === courtId) {
          return {
            ...c,
            assignedMatchId: matchId,
            status: 'in_progress',
          };
        }
        return c;
      })
    );
  };

  const handleUnassignMatch = (courtId: number) => {
    setCourts(
      courts.map((c) => {
        if (c.id === courtId) {
          return {
            ...c,
            assignedMatchId: null,
            status: 'available',
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Court Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Multiple Courts Management
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Assign matches to physical badminton courts, oversee live court statuses, and manage queue.
          </p>
        </div>

        {/* Add Court Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Court Name (e.g. Court 5)"
            value={newCourtName}
            onChange={(e) => setNewCourtName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCourt()}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleAddCourt}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Court</span>
          </button>
        </div>
      </div>

      {/* Courts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {courts.map((court) => {
          const assignedMatch = court.assignedMatchId
            ? fixtures.find((f) => f.id === court.assignedMatchId)
            : null;
          const playerA = assignedMatch ? players[assignedMatch.playerAIndex] : null;
          const playerB = assignedMatch ? players[assignedMatch.playerBIndex] : null;
          const isFinished = assignedMatch && results[assignedMatch.id] !== undefined;

          return (
            <div
              key={court.id}
              className={`rounded-3xl border transition-all p-5 flex flex-col justify-between space-y-4 shadow-sm ${
                court.status === 'in_progress'
                  ? 'bg-emerald-950/20 border-emerald-500/40 dark:bg-emerald-950/40'
                  : court.status === 'warmup'
                  ? 'bg-amber-950/15 border-amber-500/30'
                  : court.status === 'maintenance'
                  ? 'bg-rose-950/10 border-rose-500/20 opacity-75'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {/* Card Header: Court Name & Status badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-black text-xs flex items-center justify-center">
                    C{court.id}
                  </span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {court.name}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      court.status === 'in_progress'
                        ? 'bg-emerald-500 text-white'
                        : court.status === 'warmup'
                        ? 'bg-amber-500 text-slate-950'
                        : court.status === 'maintenance'
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {court.status === 'in_progress'
                      ? 'Live'
                      : court.status === 'warmup'
                      ? 'Warmup'
                      : court.status === 'maintenance'
                      ? 'Service'
                      : 'Open'}
                  </span>

                  <button
                    onClick={() => handleRemoveCourt(court.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                    title="Remove Court"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Court Visual Floor */}
              <div className="relative h-28 rounded-2xl bg-emerald-800 dark:bg-emerald-900/60 border border-emerald-600/40 overflow-hidden flex items-center justify-center p-3 text-white">
                {/* Court White Markings */}
                <div className="absolute inset-2 border border-white/40 rounded pointer-events-none" />
                <div className="absolute inset-y-2 left-1/2 -translate-x-1/2 border-l-2 border-white/60 pointer-events-none" />
                <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 border-t border-white/30 pointer-events-none" />

                {assignedMatch && playerA && playerB ? (
                  <div className="relative z-10 w-full flex items-center justify-between text-xs font-bold px-2">
                    <div className="text-left max-w-[42%] truncate">
                      <div className="truncate text-white drop-shadow-sm">{playerA}</div>
                      <div className="text-[10px] text-emerald-200 font-mono">Side A</div>
                    </div>
                    <div className="text-amber-300 text-sm font-black px-1">VS</div>
                    <div className="text-right max-w-[42%] truncate">
                      <div className="truncate text-white drop-shadow-sm">{playerB}</div>
                      <div className="text-[10px] text-emerald-200 font-mono">Side B</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-emerald-200/80 font-medium">
                    {court.status === 'maintenance' ? 'Court Under Maintenance' : 'Ready for Next Match'}
                  </div>
                )}
              </div>

              {/* Match Assignment Action / Details */}
              {assignedMatch && playerA && playerB ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Match {assignedMatch.id}</span>
                    {isFinished && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        Completed
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onLaunchLiveScorer(assignedMatch.id, court.id)}
                      className="py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Live Score</span>
                    </button>

                    <button
                      onClick={() => handleUnassignMatch(court.id)}
                      className="py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Clear Court
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <select
                      value={selectedMatchToAssign[court.id] || ''}
                      onChange={(e) =>
                        setSelectedMatchToAssign({
                          ...selectedMatchToAssign,
                          [court.id]: e.target.value,
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="">-- Assign Queue Match --</option>
                      {pendingFixtures.map((f) => (
                        <option key={f.id} value={f.id}>
                          Match {f.id}: {players[f.playerAIndex]} vs {players[f.playerBIndex]}
                        </option>
                      ))}
                    </select>

                    <button
                      disabled={!selectedMatchToAssign[court.id]}
                      onClick={() => {
                        const mId = selectedMatchToAssign[court.id];
                        if (mId) handleAssignMatch(court.id, mId);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 disabled:opacity-40 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              )}

              {/* Status Switcher pills */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                <button
                  onClick={() => handleUpdateStatus(court.id, 'available')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    court.status === 'available' ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  Available
                </button>
                <button
                  onClick={() => handleUpdateStatus(court.id, 'warmup')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    court.status === 'warmup' ? 'font-bold text-amber-500' : 'text-slate-400'
                  }`}
                >
                  Warmup
                </button>
                <button
                  onClick={() => handleUpdateStatus(court.id, 'in_progress')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    court.status === 'in_progress' ? 'font-bold text-emerald-500' : 'text-slate-400'
                  }`}
                >
                  In Play
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
