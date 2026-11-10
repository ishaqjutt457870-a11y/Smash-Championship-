import React from 'react';
import { Smartphone, Moon, Sun, Share2, Award, LayoutDashboard, Tv, Settings, FileText } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export type AppTab = 'dashboard' | 'roster' | 'matches' | 'table' | 'knockout' | 'courts' | 'h2h' | 'live';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  tournamentStarted: boolean;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  onOpenAndroidModal: () => void;
  onOpenShareModal: () => void;
  onOpenPDFModal: () => void;
  onOpenSettingsModal: () => void;
  completedMatchesCount: number;
  totalMatchesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  tournamentStarted,
  isDark,
  setIsDark,
  onOpenAndroidModal,
  onOpenShareModal,
  onOpenPDFModal,
  onOpenSettingsModal,
  completedMatchesCount,
  totalMatchesCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#103b29] text-white border-b border-[#1b553c] shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand title, one line with developer credit */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold shadow-inner shrink-0">
            <span className="text-xl">🏸</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-white whitespace-nowrap">
              Smash Championship
            </span>
            <div className="text-[11px] whitespace-nowrap flex items-center gap-1.5 -mt-0.5">
              <span className="font-bold text-emerald-300">Developed By Hassan</span>
              <span className="text-emerald-400/50">·</span>
              <span className="text-[10px] text-emerald-200/75 tracking-tight font-medium">Hassan developers</span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links, single line */}
        <nav className="hidden lg:flex items-center gap-1 sm:gap-2 text-sm font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/40'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs sm:text-sm font-medium cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/40'
            }`}
          >
            Players
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'matches'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/40'
            }`}
          >
            <span>Matches</span>
            {tournamentStarted && totalMatchesCount > 0 && (
              <span className="text-[11px] bg-emerald-800/80 px-1.5 py-0.2 rounded text-emerald-200">
                {completedMatchesCount}/{totalMatchesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs sm:text-sm font-medium cursor-pointer ${
              activeTab === 'table'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/40'
            }`}
          >
            Standings
          </button>

          <button
            onClick={() => setActiveTab('knockout')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'knockout'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/40'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Playoffs</span>
          </button>

          <button
            onClick={() => setActiveTab('courts')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'courts'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/40'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Courts</span>
          </button>

          <button
            onClick={() => setActiveTab('h2h')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs sm:text-sm font-medium cursor-pointer ${
              activeTab === 'h2h'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/40'
            }`}
          >
            H2H
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'live'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-amber-300 hover:text-white hover:bg-emerald-900/40'
            }`}
          >
            <span>🏸 Live Court</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onOpenPDFModal}
            className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800/50 rounded-lg transition-colors cursor-pointer"
            title="Official Certificate & PDF Scoresheet"
            aria-label="Certificate & PDF"
          >
            <FileText className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenShareModal}
            className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800/50 rounded-lg transition-colors cursor-pointer"
            title="Share & Export Tournament"
            aria-label="Share tournament"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettingsModal}
            className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800/50 rounded-lg transition-colors cursor-pointer"
            title="Tournament Rules & Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800/50 rounded-lg transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <PWAInstallButton />

          <button
            onClick={onOpenAndroidModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#0c2a1d] text-xs font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
            title="Download Android Studio Project ZIP"
          >
            <Smartphone className="w-4 h-4" />
            <span>Android ZIP</span>
          </button>
        </div>
      </div>
    </header>
  );
};
