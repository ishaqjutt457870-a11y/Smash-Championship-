import React from 'react';
import { Users, Calendar, Table2, Award, LayoutDashboard, Tv } from 'lucide-react';
import { AppTab } from './Header';

interface MobileBottomNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  tournamentStarted: boolean;
  completedMatchesCount: number;
  totalMatchesCount: number;
  hasChampion: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  tournamentStarted,
  completedMatchesCount,
  totalMatchesCount,
  hasChampion,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg pb-safe">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        {/* Roster */}
        <button
          onClick={() => setActiveTab('roster')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'roster'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Roster</span>
        </button>

        {/* Matches */}
        <button
          onClick={() => setActiveTab('matches')}
          className={`flex flex-col items-center justify-center h-full relative transition-colors ${
            activeTab === 'matches'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Matches</span>
          {tournamentStarted && totalMatchesCount > 0 && (
            <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        {/* Central Live Court Umpire Button */}
        <button
          onClick={() => setActiveTab('live')}
          className="flex flex-col items-center justify-center h-full relative"
        >
          <div
            className={`w-10 h-10 -mt-3 rounded-2xl flex items-center justify-center text-lg shadow-lg transition-transform active:scale-95 ${
              activeTab === 'live'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                : 'bg-emerald-600 text-white'
            }`}
          >
            🏸
          </div>
          <span
            className={`text-[10px] tracking-tight font-bold mt-1 ${
              activeTab === 'live'
                ? 'text-amber-500 dark:text-amber-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Live Court
          </span>
        </button>

        {/* Table */}
        <button
          onClick={() => setActiveTab('table')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'table'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Table2 className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Table</span>
        </button>

        {/* Playoffs */}
        <button
          onClick={() => setActiveTab('knockout')}
          className={`flex flex-col items-center justify-center h-full relative transition-colors ${
            activeTab === 'knockout'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Playoffs</span>
          {hasChampion && (
            <span className="absolute top-2 right-4 text-[10px]">👑</span>
          )}
        </button>
      </div>
    </div>
  );
};
