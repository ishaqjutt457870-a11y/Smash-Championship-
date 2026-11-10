import React from 'react';
import {
  Trophy,
  Play,
  Users,
  Calendar,
  Zap,
  Activity,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Tv,
  FileText,
  Sparkles,
} from 'lucide-react';
import { TournamentState, PlayerStats } from '../types';

interface DashboardProps {
  state: TournamentState;
  standings: PlayerStats[];
  totalMatchesCount: number;
  completedMatchesCount: number;
  onNavigateTab: (tab: 'roster' | 'matches' | 'table' | 'knockout' | 'h2h' | 'live' | 'courts') => void;
  onStartTournament: () => void;
  onOpenCertificateModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  state,
  standings,
  totalMatchesCount,
  completedMatchesCount,
  onNavigateTab,
  onStartTournament,
  onOpenCertificateModal,
}) => {
  const pendingMatchesCount = Math.max(0, totalMatchesCount - completedMatchesCount);
  const completionPercentage =
    totalMatchesCount > 0 ? Math.round((completedMatchesCount / totalMatchesCount) * 100) : 0;
  const isPlayoffsReady = totalMatchesCount > 0 && completedMatchesCount === totalMatchesCount;
  const top4Players = standings.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0c2f21] via-[#12422e] to-[#18593d] p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20">
        <div className="absolute -right-6 -bottom-8 text-9xl opacity-10 select-none pointer-events-none">
          🏸
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              Tournament Command Center
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold">
              Developed By Hassan · <span className="text-[10px] text-amber-200/80 font-normal">Hassan developers</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            SMASH CHAMPIONSHIP
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Professional BWF-standard badminton tournament manager with automatic round-robin fixture generation,
            interactive live court scoring, multi-court assignment, and championship playoffs.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigateTab('live')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Quick Start Live Scoring</span>
            </button>

            {!state.started ? (
              <button
                onClick={onStartTournament}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-[#0c2a1d] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Tournament</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigateTab('matches')}
                className="px-4 py-2.5 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 border border-emerald-700/50 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>View Matches</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onNavigateTab('courts')}
              className="px-4 py-2.5 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200 border border-emerald-600/30 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Tv className="w-4 h-4" />
              <span>Court Board</span>
            </button>

            {state.finalWinner !== null && (
              <button
                onClick={onOpenCertificateModal}
                className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Certificate & PDF</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Tournaments */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Tournaments</span>
            <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900 dark:text-white">1</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              {state.started ? 'Active League' : 'Setup Stage'}
            </div>
          </div>
        </div>

        {/* Metric 2: Total Players */}
        <div
          onClick={() => onNavigateTab('roster')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between cursor-pointer hover:border-emerald-500/50 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Players</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {state.players.length}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Singles Roster
            </div>
          </div>
        </div>

        {/* Metric 3: Total Matches */}
        <div
          onClick={() => onNavigateTab('matches')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between cursor-pointer hover:border-emerald-500/50 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Fixtures</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {totalMatchesCount}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Round-Robin
            </div>
          </div>
        </div>

        {/* Metric 4: Completed Matches */}
        <div
          onClick={() => onNavigateTab('matches')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between cursor-pointer hover:border-emerald-500/50 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {completedMatchesCount}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {completionPercentage}% complete
            </div>
          </div>
        </div>

        {/* Metric 5: Pending Matches */}
        <div
          onClick={() => onNavigateTab('matches')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between cursor-pointer hover:border-emerald-500/50 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {pendingMatchesCount}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              In schedule queue
            </div>
          </div>
        </div>

        {/* Metric 6: Format */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Format</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900 dark:text-white uppercase">
              {state.matchFormat || 'bo3'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              21 Pts (Max 30)
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Standings Preview & Tournament Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Leaderboard Preview */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Live League Standings
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('table')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              Full Standings Table <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden">
            {standings.map((player, idx) => {
              const isQualified = idx < 4;
              return (
                <div
                  key={player.id}
                  className={`py-3 px-3 flex items-center justify-between rounded-xl transition-colors ${
                    isQualified
                      ? 'hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 text-center text-xs font-black ${
                        idx === 0
                          ? 'text-amber-500'
                          : idx === 1
                          ? 'text-slate-400'
                          : idx === 2
                          ? 'text-amber-700 dark:text-amber-600'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      #{idx + 1}
                    </span>

                    {/* Avatar */}
                    {player.photo ? (
                      <img
                        src={player.photo}
                        alt={player.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                      />
                    ) : (
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm"
                        style={{ backgroundColor: player.avatarColor }}
                      >
                        {player.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{player.name}</span>
                        {isQualified && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                            Playoff Seed
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>
                          {player.won}W - {player.lost}L ({player.played} played)
                        </span>
                        <span>&bull;</span>
                        <span>Sets {player.setsWon}-{player.setsLost}</span>
                      </div>
                    </div>
                  </div>

                  {/* Points & Win% */}
                  <div className="text-right">
                    <div className="text-base font-black text-emerald-700 dark:text-emerald-400">
                      {player.points} <span className="text-xs font-medium">pts</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {player.played > 0 ? Math.round((player.won / player.played) * 100) : 0}% win rate
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Tournament Playoff Status & Champion Info */}
        <div className="space-y-4">
          {/* Champion card if crowned */}
          {state.finalWinner !== null && (
            <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 p-5 text-white shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-amber-100 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-yellow-200" />
                <span>Reigning Champion</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center text-3xl shadow-inner shrink-0">
                  🏆
                </div>
                <div>
                  <h3 className="text-xl font-black text-white leading-tight">
                    {state.players[state.finalWinner]}
                  </h3>
                  <p className="text-xs text-amber-100 font-medium">
                    Smash Championship Winner
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenCertificateModal}
                className="w-full py-2 bg-slate-950/80 hover:bg-slate-950 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Print Official Certificate</span>
              </button>
            </div>
          )}

          {/* Playoff Progression Tracker */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Playoff Progression
              </span>
              <Award className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">League Stage</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {completedMatchesCount}/{totalMatchesCount} matches
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isPlayoffsReady
                ? 'All league matches finished! Top 4 players have advanced to the Semi-Finals.'
                : `Complete all ${totalMatchesCount} league fixtures to lock Top 4 seeds into the single-elimination playoff bracket.`}
            </p>

            <button
              onClick={() => onNavigateTab('knockout')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isPlayoffsReady
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>View Playoff Bracket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Developer Attribution Card */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 rounded-2xl p-4 text-center space-y-1">
            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              Developed By Hassan
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Hassan developers
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              Engineered for seamless offline tournament operations, real-time court scoring, and external TV displays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
