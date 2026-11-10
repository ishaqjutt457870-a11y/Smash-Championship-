import { useState, useEffect, useMemo } from 'react';
import { Header, AppTab } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PlayerSetup } from './components/PlayerSetup';
import { LeagueMatches } from './components/LeagueMatches';
import { StandingsTable } from './components/StandingsTable';
import { KnockoutStage } from './components/KnockoutStage';
import { CourtManager } from './components/CourtManager';
import { HeadToHeadMatrix } from './components/HeadToHeadMatrix';
import { ChampionPodium } from './components/ChampionPodium';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AndroidProjectModal } from './components/AndroidProjectModal';
import { TournamentShareModal } from './components/TournamentShareModal';
import { PlayerProfileModal } from './components/PlayerProfileModal';
import { LiveCourtScorer } from './components/LiveCourtScorer';
import { DynamicBadmintonBackdrop } from './components/DynamicBadmintonBackdrop';
import { SplashScreen } from './components/SplashScreen';
import { PDFReportModal } from './components/PDFReportModal';
import { SettingsModal } from './components/SettingsModal';
import { TournamentState, MatchScore, MatchFormat, PlayerBio, PlayerStats } from './types';
import {
  loadTournamentState,
  saveTournamentState,
  generateFixtures,
  calculateStandings,
  getFormatLabel,
} from './utils/tournament';
import { fireConfetti } from './utils/confetti';
import { Trophy, Smartphone, ArrowRight, Play, Award, Zap, Heart } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [state, setState] = useState<TournamentState>(() => loadTournamentState());
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(() => {
    return (
      localStorage.getItem('smash-theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [liveMatchId, setLiveMatchId] = useState<string>('');
  const [liveCourtNumber, setLiveCourtNumber] = useState<number>(1);

  // Sync theme with DOM
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smash-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smash-theme', 'light');
    }
  }, [isDark]);

  // Persist state changes
  useEffect(() => {
    saveTournamentState(state);
  }, [state]);

  // Generated round-robin fixtures
  const fixtures = useMemo(() => {
    return generateFixtures(state.players.length);
  }, [state.players.length]);

  // Live standings with photos & bios
  const standings = useMemo(() => {
    return calculateStandings(
      state.players,
      state.results,
      state.scores,
      state.playerPhotos,
      state.playerBios
    );
  }, [state.players, state.results, state.scores, state.playerPhotos, state.playerBios]);

  const completedMatchesCount = Object.keys(state.results).length;
  const totalMatchesCount = fixtures.length;
  const allLeagueMatchesDone = totalMatchesCount > 0 && completedMatchesCount === totalMatchesCount;

  // Selected player for profile modal
  const selectedPlayerStats = useMemo(() => {
    if (selectedPlayerId === null) return null;
    return standings.find((s) => s.id === selectedPlayerId) || null;
  }, [selectedPlayerId, standings]);

  // Handlers for tournament mutations
  const handleStartTournament = () => {
    setState((prev) => ({
      ...prev,
      started: true,
    }));
    setActiveTab('matches');
  };

  const handleSetPlayers = (newPlayers: string[]) => {
    setState((prev) => {
      const hasChanged = JSON.stringify(prev.players) !== JSON.stringify(newPlayers);
      return {
        ...prev,
        players: newPlayers,
        ...(hasChanged
          ? {
              results: {},
              scores: {},
              semis: {},
              semiScores: {},
              finalWinner: null,
              thirdPlaceWinner: null,
            }
          : {}),
      };
    });
  };

  const handleSetMatchFormat = (format: MatchFormat) => {
    setState((prev) => ({
      ...prev,
      matchFormat: format,
    }));
  };

  const handleSetMatchResult = (matchId: string, winnerIndex: number, score?: MatchScore) => {
    setState((prev) => ({
      ...prev,
      results: {
        ...prev.results,
        [matchId]: winnerIndex,
      },
      scores: {
        ...(prev.scores || {}),
        ...(score ? { [matchId]: score } : {}),
      },
      semis: {},
      semiScores: {},
      finalWinner: null,
      thirdPlaceWinner: null,
    }));
  };

  const handleUndoMatchResult = (matchId: string) => {
    setState((prev) => {
      const nextResults = { ...prev.results };
      delete nextResults[matchId];
      const nextScores = { ...(prev.scores || {}) };
      delete nextScores[matchId];
      return {
        ...prev,
        results: nextResults,
        scores: nextScores,
        semis: {},
        semiScores: {},
        finalWinner: null,
        thirdPlaceWinner: null,
      };
    });
  };

  const handleSimulateAllRemaining = () => {
    setState((prev) => {
      const nextResults = { ...prev.results };
      const nextScores = { ...(prev.scores || {}) };
      const format = prev.matchFormat || 'bo3';

      fixtures.forEach((match) => {
        if (nextResults[match.id] === undefined) {
          const isPlayerAWinner = Math.random() > 0.5;
          const winnerIndex = isPlayerAWinner ? match.playerAIndex : match.playerBIndex;
          nextResults[match.id] = winnerIndex;

          const s1a = isPlayerAWinner ? 21 : Math.floor(Math.random() * 6) + 14;
          const s1b = isPlayerAWinner ? Math.floor(Math.random() * 6) + 14 : 21;
          const s2a = isPlayerAWinner ? 21 : Math.floor(Math.random() * 6) + 14;
          const s2b = isPlayerAWinner ? Math.floor(Math.random() * 6) + 14 : 21;

          if (format === 'bo1') {
            nextScores[match.id] = { s1a, s1b };
          } else if (format === 'bo5') {
            const s3a = isPlayerAWinner ? 21 : Math.floor(Math.random() * 6) + 14;
            const s3b = isPlayerAWinner ? Math.floor(Math.random() * 6) + 14 : 21;
            nextScores[match.id] = { s1a, s1b, s2a, s2b, s3a, s3b };
          } else {
            nextScores[match.id] = { s1a, s1b, s2a, s2b };
          }
        }
      });

      return {
        ...prev,
        results: nextResults,
        scores: nextScores,
      };
    });
  };

  const handleSetSemiWinner = (semiIndex: number, winnerIndex: number) => {
    setState((prev) => ({
      ...prev,
      semis: {
        ...prev.semis,
        [semiIndex]: winnerIndex,
      },
      finalWinner: null,
      thirdPlaceWinner: null,
    }));
  };

  const handleUndoSemi = (semiIndex: number) => {
    setState((prev) => {
      const nextSemis = { ...prev.semis };
      delete nextSemis[semiIndex];
      return {
        ...prev,
        semis: nextSemis,
        finalWinner: null,
        thirdPlaceWinner: null,
      };
    });
  };

  const handleSetFinalWinner = (winnerIndex: number) => {
    setState((prev) => ({
      ...prev,
      finalWinner: winnerIndex,
    }));
    fireConfetti();
  };

  const handleUndoFinal = () => {
    setState((prev) => ({
      ...prev,
      finalWinner: null,
    }));
  };

  const handleSetThirdPlaceWinner = (winnerIndex: number) => {
    setState((prev) => ({
      ...prev,
      thirdPlaceWinner: winnerIndex,
    }));
  };

  const handleUndoThirdPlace = () => {
    setState((prev) => ({
      ...prev,
      thirdPlaceWinner: null,
    }));
  };

  const handleResetTournament = () => {
    if (window.confirm('Reset all match results and scores? Registered players will be kept.')) {
      setState((prev) => ({
        ...prev,
        results: {},
        scores: {},
        semis: {},
        semiScores: {},
        finalWinner: null,
        thirdPlaceWinner: null,
      }));
    }
  };

  const handleResetAll = () => {
    setState({
      players: ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6'],
      playerPhotos: {},
      playerBios: {},
      matchFormat: 'bo3',
      results: {},
      scores: {},
      semis: {},
      semiScores: {},
      thirdPlaceWinner: null,
      finalWinner: null,
      started: false,
      tournamentTitle: 'Smash Championship',
      createdDate: new Date().toISOString(),
    });
    setActiveTab('roster');
  };

  // Player Profile handlers
  const handleUpdatePhoto = (playerId: number, dataUrl: string) => {
    setState((prev) => ({
      ...prev,
      playerPhotos: {
        ...(prev.playerPhotos || {}),
        [playerId]: dataUrl,
      },
    }));
  };

  const handleRemovePhoto = (playerId: number) => {
    setState((prev) => {
      const nextPhotos = { ...(prev.playerPhotos || {}) };
      delete nextPhotos[playerId];
      return {
        ...prev,
        playerPhotos: nextPhotos,
      };
    });
  };

  const handleUpdateBio = (playerId: number, bio: PlayerBio) => {
    setState((prev) => ({
      ...prev,
      playerBios: {
        ...(prev.playerBios || {}),
        [playerId]: bio,
      },
    }));
  };

  // Determine runner-up for podium
  const runnerUp = useMemo(() => {
    if (state.finalWinner === null) return null;
    const sf1Winner = state.semis[0];
    const sf2Winner = state.semis[1];
    if (sf1Winner !== undefined && sf2Winner !== undefined) {
      return state.finalWinner === sf1Winner ? sf2Winner : sf1Winner;
    }
    return null;
  }, [state.finalWinner, state.semis]);

  return (
    <div className="min-h-screen bg-[#f0f4f1] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors pb-20 md:pb-8 relative">
      {/* Dynamic and Attractive Badminton Court Atmospheric Backdrop */}
      <DynamicBadmintonBackdrop />

      {/* Animated Splash & Loading Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} isDark={isDark} />}

      {/* Top Bar adhering to Top Bar Contract with Developer attribution */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tournamentStarted={state.started}
        isDark={isDark}
        setIsDark={setIsDark}
        onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenPDFModal={() => setIsPDFModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        completedMatchesCount={completedMatchesCount}
        totalMatchesCount={totalMatchesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 z-10">
        {/* Crowned Champion Banner if final is completed */}
        {state.finalWinner !== null && activeTab !== 'dashboard' && (
          <div className="mb-6">
            <ChampionPodium
              players={state.players}
              finalWinner={state.finalWinner}
              runnerUp={runnerUp}
              thirdPlace={state.thirdPlaceWinner ?? null}
              standings={standings}
              onResetTournament={handleResetTournament}
              onOpenShareModal={() => setIsShareModalOpen(true)}
            />
          </div>
        )}

        {/* Tabbed Views */}
        {activeTab === 'dashboard' && (
          <Dashboard
            state={state}
            standings={standings}
            totalMatchesCount={totalMatchesCount}
            completedMatchesCount={completedMatchesCount}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onStartTournament={handleStartTournament}
            onOpenCertificateModal={() => setIsPDFModalOpen(true)}
          />
        )}

        {activeTab === 'roster' && (
          <PlayerSetup
            players={state.players}
            setPlayers={handleSetPlayers}
            playerPhotos={state.playerPhotos}
            matchFormat={state.matchFormat || 'bo3'}
            setMatchFormat={handleSetMatchFormat}
            tournamentStarted={state.started}
            onStartTournament={handleStartTournament}
            onResetTournament={handleResetTournament}
            onOpenPlayerProfile={(id) => setSelectedPlayerId(id)}
          />
        )}

        {activeTab === 'matches' && (
          <LeagueMatches
            players={state.players}
            fixtures={fixtures}
            results={state.results}
            scores={state.scores || {}}
            matchFormat={state.matchFormat || 'bo3'}
            setMatchFormat={handleSetMatchFormat}
            playerPhotos={state.playerPhotos}
            onSetResult={handleSetMatchResult}
            onUndoResult={handleUndoMatchResult}
            onSimulateAll={handleSimulateAllRemaining}
            onOpenPlayerProfile={(id) => setSelectedPlayerId(id)}
            onLaunchLiveScorer={(matchId) => {
              setLiveMatchId(matchId);
              setActiveTab('live');
            }}
          />
        )}

        {activeTab === 'table' && (
          <StandingsTable
            standings={standings}
            onNavigateToKnockout={() => setActiveTab('knockout')}
            allMatchesDone={allLeagueMatchesDone}
            onOpenPlayerProfile={(id) => setSelectedPlayerId(id)}
          />
        )}

        {activeTab === 'courts' && (
          <CourtManager
            players={state.players}
            fixtures={fixtures}
            results={state.results}
            scores={state.scores || {}}
            playerPhotos={state.playerPhotos}
            onLaunchLiveScorer={(matchId, courtNum) => {
              setLiveMatchId(matchId);
              setLiveCourtNumber(courtNum);
              setActiveTab('live');
            }}
          />
        )}

        {activeTab === 'live' && (
          <LiveCourtScorer
            players={state.players}
            fixtures={fixtures}
            playerPhotos={state.playerPhotos}
            matchFormat={state.matchFormat || 'bo3'}
            initialMatchId={liveMatchId}
            initialCourtNumber={liveCourtNumber}
            onSaveMatchResult={(matchId, winnerIndex, score) => {
              handleSetMatchResult(matchId, winnerIndex, score);
              setActiveTab('matches');
            }}
          />
        )}

        {activeTab === 'knockout' && (
          <KnockoutStage
            players={state.players}
            standings={standings}
            allLeagueMatchesDone={allLeagueMatchesDone}
            semis={state.semis}
            finalWinner={state.finalWinner}
            thirdPlaceWinner={state.thirdPlaceWinner ?? null}
            matchFormat={state.matchFormat || 'bo3'}
            onSetSemiWinner={handleSetSemiWinner}
            onUndoSemi={handleUndoSemi}
            onSetFinalWinner={handleSetFinalWinner}
            onUndoFinal={handleUndoFinal}
            onSetThirdPlaceWinner={handleSetThirdPlaceWinner}
            onUndoThirdPlace={handleUndoThirdPlace}
            onNavigateToMatches={() => setActiveTab('matches')}
            onOpenPlayerProfile={(id) => setSelectedPlayerId(id)}
          />
        )}

        {activeTab === 'h2h' && (
          <HeadToHeadMatrix
            players={state.players}
            fixtures={fixtures}
            results={state.results}
            scores={state.scores || {}}
            playerPhotos={state.playerPhotos}
            onOpenPlayerProfile={(id) => setSelectedPlayerId(id)}
          />
        )}
      </main>

      {/* Modern Developer Credit Footer */}
      <footer className="mt-12 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-base">🏸</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">Smash Championship</span>
            <span aria-hidden="true">·</span>
            <span>Badminton League & Tournament</span>
          </div>

          {/* Prominent Developed By Hassan main with Hassan developers small */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
              Developed By Hassan
            </span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-[11px] text-slate-400 font-medium">
              Hassan developers
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tournamentStarted={state.started}
        completedMatchesCount={completedMatchesCount}
        totalMatchesCount={totalMatchesCount}
        hasChampion={state.finalWinner !== null}
      />

      {/* Player Profile & Photo Modal */}
      <PlayerProfileModal
        player={selectedPlayerStats}
        isOpen={selectedPlayerId !== null}
        onClose={() => setSelectedPlayerId(null)}
        fixtures={fixtures}
        results={state.results}
        scores={state.scores || {}}
        allPlayers={state.players}
        onUpdatePhoto={handleUpdatePhoto}
        onRemovePhoto={handleRemovePhoto}
        onUpdateBio={handleUpdateBio}
      />

      {/* Android Project Modal */}
      <AndroidProjectModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />

      {/* Share / Export Modal */}
      <TournamentShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        tournamentState={state}
        standings={standings}
        onImportState={(newState) => setState(newState)}
        onResetAll={handleResetAll}
      />

      {/* PDF Report & Certificate Modal */}
      <PDFReportModal
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
        tournamentState={state}
        standings={standings}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        isDark={isDark}
        setIsDark={setIsDark}
        matchFormat={state.matchFormat || 'bo3'}
        setMatchFormat={handleSetMatchFormat}
        onResetTournament={handleResetTournament}
        onResetAll={handleResetAll}
        onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
      />
    </div>
  );
}
