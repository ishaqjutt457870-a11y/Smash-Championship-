import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRightLeft,
  Timer,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { TournamentMatch, MatchScore, MatchFormat, LiveMatchState, ShuttleEquipment } from '../types';
import { getPlayerColor, getInitials, getSetsRequiredToWin, getFormatLabel } from '../utils/tournament';
import {
  playShuttleHitSound,
  playPointChime,
  playAlertTone,
  playIntervalBuzzer,
  toggleAudioMute,
  getAudioMuted,
} from '../utils/audio';
import { ShuttleTossModal } from './ShuttleTossModal';
import { BigScreenScoreboard } from './BigScreenScoreboard';
import { Lock, Unlock, Tv, Zap, Flame, Shield, Activity } from 'lucide-react';

export type WinningShotType = 'Smash' | 'Drop' | 'Net Shot' | 'Clear' | 'Drive' | 'Unforced Error' | 'Fault';

interface LiveCourtScorerProps {
  players: string[];
  fixtures: TournamentMatch[];
  playerPhotos?: Record<number, string>;
  matchFormat: MatchFormat;
  onSaveMatchResult: (matchId: string, winnerIndex: number, score: MatchScore) => void;
  initialMatchId?: string;
  initialCourtNumber?: number;
}

export const LiveCourtScorer: React.FC<LiveCourtScorerProps> = ({
  players,
  fixtures,
  playerPhotos,
  matchFormat,
  onSaveMatchResult,
  initialMatchId,
  initialCourtNumber = 1,
}) => {
  // Find match or default to first
  const [selectedMatchId, setSelectedMatchId] = useState<string>(
    initialMatchId || (fixtures.length > 0 ? fixtures[0].id : '')
  );
  const [courtNumber, setCourtNumber] = useState<number>(initialCourtNumber);
  const [isBigScreenOpen, setIsBigScreenOpen] = useState(false);
  const [isUmpireLocked, setIsUmpireLocked] = useState(false);
  const [selectedShotType, setSelectedShotType] = useState<WinningShotType>('Smash');
  const [rallyDuration, setRallyDuration] = useState<number>(8);
  const [rallyLog, setRallyLog] = useState<
    Array<{
      set: number;
      winner: 'A' | 'B';
      shot: WinningShotType;
      rallySec: number;
      scoreA: number;
      scoreB: number;
    }>
  >([]);

  const activeMatch = fixtures.find((f) => f.id === selectedMatchId) || fixtures[0];

  const playerA = activeMatch ? players[activeMatch.playerAIndex] : 'Player 1';
  const playerB = activeMatch ? players[activeMatch.playerBIndex] : 'Player 2';
  const photoA = activeMatch ? playerPhotos?.[activeMatch.playerAIndex] : undefined;
  const photoB = activeMatch ? playerPhotos?.[activeMatch.playerBIndex] : undefined;
  const colorA = activeMatch ? getPlayerColor(activeMatch.playerAIndex) : '#16a34a';
  const colorB = activeMatch ? getPlayerColor(activeMatch.playerBIndex) : '#2563eb';

  // Live match state
  const [currentSet, setCurrentSet] = useState(1);
  const [pointsA, setPointsA] = useState(0);
  const [pointsB, setPointsB] = useState(0);
  const [server, setServer] = useState<'A' | 'B'>('A');
  const [sideAOnLeft, setSideAOnLeft] = useState(true);
  const [history, setHistory] = useState<Array<{ a: number; b: number; server: 'A' | 'B' }>>([]);
  const [completedSets, setCompletedSets] = useState<Array<{ a: number; b: number }>>([]);
  const [isMuted, setIsMuted] = useState(getAudioMuted());

  // Shuttlecock equipment state
  const [shuttleType, setShuttleType] = useState<'feather' | 'nylon'>('feather');
  const [shuttleBrand, setShuttleBrand] = useState('Yonex Aerosensa 50');
  const [shuttleSpeed, setShuttleSpeed] = useState<76 | 77 | 78>(77);
  const [shuttlesUsed, setShuttlesUsed] = useState(1);
  const [isTossOpen, setIsTossOpen] = useState(false);

  // Interval timer
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [intervalTitle, setIntervalTitle] = useState('');

  // Sets required
  const setsToWin = getSetsRequiredToWin(matchFormat);
  const setsWonA = completedSets.filter((s) => s.a > s.b).length;
  const setsWonB = completedSets.filter((s) => s.b > s.a).length;
  const matchWinner = setsWonA >= setsToWin ? 'A' : setsWonB >= setsToWin ? 'B' : null;

  // Interval timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev === null || prev <= 1) {
            setTimerActive(false);
            playIntervalBuzzer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSeconds]);

  // Determine BWF active serving box:
  // In singles, even points (0, 2, 4...) -> Right Service Court.
  // Odd points (1, 3, 5...) -> Left Service Court.
  const serverPoints = server === 'A' ? pointsA : pointsB;
  const serverCourtSide: 'right' | 'left' = serverPoints % 2 === 0 ? 'right' : 'left';

  // Game Point / Match Point detection
  const isGamePointA = (pointsA >= 20 && pointsA - pointsB >= 1) || pointsA === 29;
  const isGamePointB = (pointsB >= 20 && pointsB - pointsA >= 1) || pointsB === 29;
  const isMatchPointA = isGamePointA && setsWonA === setsToWin - 1;
  const isMatchPointB = isGamePointB && setsWonB === setsToWin - 1;
  const isDeuce = pointsA >= 20 && pointsB >= 20 && pointsA === pointsB;

  const handlePointScored = (winner: 'A' | 'B') => {
    if (matchWinner || isUmpireLocked) return;

    playShuttleHitSound();
    playPointChime();

    setHistory((prev) => [...prev, { a: pointsA, b: pointsB, server }]);

    const nextA = winner === 'A' ? pointsA + 1 : pointsA;
    const nextB = winner === 'B' ? pointsB + 1 : pointsB;

    setPointsA(nextA);
    setPointsB(nextB);
    setServer(winner);

    // Record to Rally Log
    setRallyLog((prev) => [
      ...prev,
      {
        set: currentSet,
        winner,
        shot: selectedShotType,
        rallySec: rallyDuration,
        scoreA: nextA,
        scoreB: nextB,
      },
    ]);

    // 11-point interval alert (BWF rules: 60 seconds interval at 11 points)
    if ((nextA === 11 && nextB < 11) || (nextB === 11 && nextA < 11)) {
      playIntervalBuzzer();
      setTimerSeconds(60);
      setTimerActive(true);
      setIntervalTitle('11-Point Mid-Game Interval (60s)');
    }

    // Set won check:
    // First to 21 with 2-point lead, or max 30 points cap
    const hasWonSet =
      (nextA >= 21 && nextA - nextB >= 2) ||
      (nextB >= 21 && nextB - nextA >= 2) ||
      nextA === 30 ||
      nextB === 30;

    if (hasWonSet) {
      playAlertTone();
      const updatedSets = [...completedSets, { a: nextA, b: nextB }];
      setCompletedSets(updatedSets);

      const nextSetsWonA = updatedSets.filter((s) => s.a > s.b).length;
      const nextSetsWonB = updatedSets.filter((s) => s.b > s.a).length;

      if (nextSetsWonA >= setsToWin || nextSetsWonB >= setsToWin) {
        // Match finished!
      } else {
        // Next set break (120 seconds interval between sets according to BWF rules)
        setCurrentSet((prev) => prev + 1);
        setPointsA(0);
        setPointsB(0);
        setSideAOnLeft((prev) => !prev); // Change court sides
        setTimerSeconds(120);
        setTimerActive(true);
        setIntervalTitle('Set Break Interval (120s)');
      }
    }
  };

  const handleUndoPoint = () => {
    if (history.length === 0 || isUmpireLocked) return;
    const last = history[history.length - 1];
    setPointsA(last.a);
    setPointsB(last.b);
    setServer(last.server);
    setHistory((prev) => prev.slice(0, -1));
    setRallyLog((prev) => prev.slice(0, -1));
  };

  const handleSwitchSides = () => {
    setSideAOnLeft((prev) => !prev);
  };

  const handleApplyTossResult = (firstServer: 'A' | 'B', sideLeft: 'A' | 'B') => {
    setServer(firstServer);
    setSideAOnLeft(sideLeft === 'A');
  };

  const handleSyncToTournament = () => {
    if (!activeMatch) return;

    // Convert completed sets into MatchScore
    const scoreObj: MatchScore = {};
    completedSets.forEach((s, idx) => {
      if (idx === 0) {
        scoreObj.s1a = s.a;
        scoreObj.s1b = s.b;
      } else if (idx === 1) {
        scoreObj.s2a = s.a;
        scoreObj.s2b = s.b;
      } else if (idx === 2) {
        scoreObj.s3a = s.a;
        scoreObj.s3b = s.b;
      } else if (idx === 3) {
        scoreObj.s4a = s.a;
        scoreObj.s4b = s.b;
      } else if (idx === 4) {
        scoreObj.s5a = s.a;
        scoreObj.s5b = s.b;
      }
    });

    const winningIndex =
      setsWonA >= setsToWin ? activeMatch.playerAIndex : activeMatch.playerBIndex;

    onSaveMatchResult(activeMatch.id, winningIndex, scoreObj);
  };

  const handleResetCurrentMatch = () => {
    if (window.confirm('Reset this live match scoreboard?')) {
      setCurrentSet(1);
      setPointsA(0);
      setPointsB(0);
      setHistory([]);
      setCompletedSets([]);
      setTimerSeconds(null);
      setTimerActive(false);
    }
  };

  // Determine left player vs right player on visual court
  const leftPlayer = sideAOnLeft ? { name: playerA, letter: 'A' as const, points: pointsA, color: colorA, photo: photoA } : { name: playerB, letter: 'B' as const, points: pointsB, color: colorB, photo: photoB };
  const rightPlayer = sideAOnLeft ? { name: playerB, letter: 'B' as const, points: pointsB, color: colorB, photo: photoB } : { name: playerA, letter: 'A' as const, points: pointsA, color: colorA, photo: photoA };

  return (
    <div className="space-y-6">
      {/* Top Controls & Match Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏸</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Shuttle Live Court Umpire
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
              BWF Rules
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time point scoring, BWF service court tracking, shuttle equipment, and interval timers.
          </p>
        </div>

        {/* Fixture Selector, Court, Umpire Lock & Big Screen Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Court Selector */}
          <select
            value={courtNumber}
            onChange={(e) => setCourtNumber(Number(e.target.value))}
            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold focus:outline-none"
          >
            <option value={1}>Court 1 (Center)</option>
            <option value={2}>Court 2</option>
            <option value={3}>Court 3</option>
            <option value={4}>Court 4</option>
          </select>

          <select
            value={selectedMatchId}
            onChange={(e) => {
              setSelectedMatchId(e.target.value);
              setCurrentSet(1);
              setPointsA(0);
              setPointsB(0);
              setHistory([]);
              setRallyLog([]);
              setCompletedSets([]);
            }}
            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold focus:outline-none"
          >
            {fixtures.map((m, i) => (
              <option key={m.id} value={m.id}>
                Match #{m.roundNumber || i + 1}: {players[m.playerAIndex]} vs {players[m.playerBIndex]}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsBigScreenOpen(true)}
            className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Launch Big Screen Scoreboard for External Monitors"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Big Screen</span>
          </button>

          <button
            onClick={() => setIsUmpireLocked(!isUmpireLocked)}
            className={`px-3 py-2 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer ${
              isUmpireLocked
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
            title={isUmpireLocked ? 'Umpire Locked: Taps Ignored' : 'Lock Scoreboard against accidental taps'}
          >
            {isUmpireLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{isUmpireLocked ? 'Locked' : 'Lock'}</span>
          </button>

          <button
            onClick={() => setIsTossOpen(true)}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Spin Shuttlecock for Match Toss"
          >
            <span>🏸 Spin Toss</span>
          </button>

          <button
            onClick={() => {
              const muted = toggleAudioMute();
              setIsMuted(muted);
            }}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interval Countdown Banner */}
      {timerSeconds !== null && timerSeconds > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500 text-slate-950 shadow-md flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 animate-pulse" />
            <div>
              <strong className="block text-xs uppercase tracking-wider font-extrabold">
                {intervalTitle}
              </strong>
              <span className="text-2xl font-black tabular-nums">
                {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimerActive(!timerActive)}
              className="px-3 py-1.5 bg-slate-950 text-white font-bold text-xs rounded-xl"
            >
              {timerActive ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={() => {
                setTimerSeconds(null);
                setTimerActive(false);
              }}
              className="px-3 py-1.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Live Match Point Alert Banner */}
      {(isMatchPointA || isMatchPointB || isGamePointA || isGamePointB || isDeuce) && !matchWinner && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 text-white font-extrabold text-xs text-center shadow flex items-center justify-center gap-2 tracking-wide uppercase">
          <Sparkles className="w-4 h-4" />
          <span>
            {isMatchPointA
              ? `🔥 CHAMPIONSHIP MATCH POINT: ${playerA} (Set ${currentSet})`
              : isMatchPointB
              ? `🔥 CHAMPIONSHIP MATCH POINT: ${playerB} (Set ${currentSet})`
              : isGamePointA
              ? `⚡ GAME POINT: ${playerA}`
              : isGamePointB
              ? `⚡ GAME POINT: ${playerB}`
              : '⚡ DEUCE: 20-20 (Must win by 2 points up to 30)'}
          </span>
        </div>
      )}

      {/* Live Scoreboard Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
        {/* Set Scores History Row */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">Set {currentSet} in Progress</span>
            <span className="text-slate-400">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {getFormatLabel(matchFormat)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {completedSets.map((s, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs"
              >
                Set {idx + 1}: {s.a}-{s.b}
              </span>
            ))}
            <div className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-300">
              <span>Sets:</span>
              <span className="text-emerald-600 font-black text-sm">{setsWonA}</span>
              <span>-</span>
              <span className="text-emerald-600 font-black text-sm">{setsWonB}</span>
            </div>
          </div>
        </div>

        {/* Big Tactile Dual Scoreboard */}
        <div className="py-6 grid grid-cols-2 gap-4 sm:gap-8 items-center text-center">
          {/* Player A Score Card */}
          <div
            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-between ${
              server === 'A'
                ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {photoA ? (
                <img src={photoA} alt={playerA} className="w-9 h-9 rounded-xl object-cover shadow-sm" />
              ) : (
                <div
                  className="w-9 h-9 rounded-xl text-white font-bold text-xs flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: colorA }}
                >
                  {getInitials(playerA)}
                </div>
              )}
              <div className="text-left">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate block max-w-[140px]">
                  {playerA}
                </span>
                {server === 'A' && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <span>🏸 Serving ({serverCourtSide} box)</span>
                  </span>
                )}
              </div>
            </div>

            <div className="text-6xl sm:text-8xl font-black text-slate-900 dark:text-slate-100 tabular-nums py-2 my-2 tracking-tight">
              {pointsA}
            </div>

            {!matchWinner && (
              <button
                onClick={() => handlePointScored('A')}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black text-base sm:text-lg rounded-2xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2"
              >
                <span>+1 Point</span>
              </button>
            )}
          </div>

          {/* Player B Score Card */}
          <div
            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-between ${
              server === 'B'
                ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {photoB ? (
                <img src={photoB} alt={playerB} className="w-9 h-9 rounded-xl object-cover shadow-sm" />
              ) : (
                <div
                  className="w-9 h-9 rounded-xl text-white font-bold text-xs flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: colorB }}
                >
                  {getInitials(playerB)}
                </div>
              )}
              <div className="text-left">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate block max-w-[140px]">
                  {playerB}
                </span>
                {server === 'B' && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <span>🏸 Serving ({serverCourtSide} box)</span>
                  </span>
                )}
              </div>
            </div>

            <div className="text-6xl sm:text-8xl font-black text-slate-900 dark:text-slate-100 tabular-nums py-2 my-2 tracking-tight">
              {pointsB}
            </div>

            {!matchWinner && (
              <button
                onClick={() => handlePointScored('B')}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black text-base sm:text-lg rounded-2xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2"
              >
                <span>+1 Point</span>
              </button>
            )}
          </div>
        </div>

        {/* Match Concluded Card */}
        {matchWinner && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 text-center space-y-3 mt-4 animate-in zoom-in-95">
            <h3 className="text-lg font-black flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6" />
              <span>MATCH FINISHED: {matchWinner === 'A' ? playerA : playerB} WINS!</span>
            </h3>
            <p className="text-xs font-semibold">
              Final score: {completedSets.map((s) => `${s.a}-${s.b}`).join(', ')}
            </p>
            <button
              onClick={handleSyncToTournament}
              className="px-6 py-2.5 bg-slate-950 text-white font-bold text-xs rounded-xl shadow-lg hover:opacity-90 transition-opacity"
            >
              Sync & Save Result to Tournament
            </button>
          </div>
        )}

        {/* Scoreboard Action Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndoPoint}
              disabled={history.length === 0}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo Point</span>
            </button>

            <button
              onClick={handleSwitchSides}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 transition-colors"
              title="Change ends of court"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Switch Ends</span>
            </button>
          </div>

          <button
            onClick={handleResetCurrentMatch}
            className="text-xs text-rose-600 dark:text-rose-400 hover:underline"
          >
            Reset Scoreboard
          </button>
        </div>
      </div>

      {/* Interactive Top-Down Badminton Court Visualizer */}
      <div className="bg-[#103b29] text-white rounded-3xl p-6 shadow-xl border border-[#1d5b3f] relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-emerald-300">🏸 Live Court Visualizer</span>
            <span className="text-[10px] text-emerald-200/70">
              (BWF Singles Service Zones)
            </span>
          </div>
          <span className="text-xs text-emerald-200 font-medium">
            Active Server: <strong className="text-white">{server === 'A' ? playerA : playerB}</strong> ({serverCourtSide} box)
          </span>
        </div>

        {/* Badminton Court Surface */}
        <div className="relative w-full h-52 sm:h-64 bg-[#0d4f34] border-4 border-white rounded-2xl overflow-hidden shadow-inner flex">
          {/* Net in the center */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-white z-20 shadow-md">
            <div className="w-4 h-full border-r-2 border-l-2 border-dashed border-slate-200 opacity-60 -ml-1.5" />
          </div>

          {/* LEFT HALF OF COURT */}
          <div className="flex-1 h-full relative border-r-2 border-white/60">
            {/* Short Service Line */}
            <div className="absolute top-0 bottom-0 right-[25%] w-1 bg-white/70" />
            {/* Center Line */}
            <div className="absolute left-0 right-[25%] top-1/2 -translate-y-1/2 h-1 bg-white/70" />

            {/* Left Player Label */}
            <div className="absolute bottom-2 left-3 bg-black/40 px-2 py-1 rounded text-[11px] font-bold text-white z-10 flex items-center gap-1.5">
              <span>{leftPlayer.name}</span>
              <span className="text-emerald-300">({leftPlayer.points})</span>
            </div>

            {/* Left Top Service Box (Left Court on this side) */}
            <div
              className={`absolute top-0 bottom-1/2 left-0 right-[25%] flex items-center justify-center transition-colors ${
                server === leftPlayer.letter && serverCourtSide === 'left'
                  ? 'bg-amber-400/25 ring-2 ring-amber-400/80 inset-0'
                  : ''
              }`}
            >
              {server === leftPlayer.letter && serverCourtSide === 'left' && (
                <div className="text-2xl animate-bounce">🏸</div>
              )}
            </div>

            {/* Left Bottom Service Box (Right Court on this side) */}
            <div
              className={`absolute top-1/2 bottom-0 left-0 right-[25%] flex items-center justify-center transition-colors ${
                server === leftPlayer.letter && serverCourtSide === 'right'
                  ? 'bg-amber-400/25 ring-2 ring-amber-400/80'
                  : ''
              }`}
            >
              {server === leftPlayer.letter && serverCourtSide === 'right' && (
                <div className="text-2xl animate-bounce">🏸</div>
              )}
            </div>
          </div>

          {/* RIGHT HALF OF COURT */}
          <div className="flex-1 h-full relative border-l-2 border-white/60">
            {/* Short Service Line */}
            <div className="absolute top-0 bottom-0 left-[25%] w-1 bg-white/70" />
            {/* Center Line */}
            <div className="absolute left-[25%] right-0 top-1/2 -translate-y-1/2 h-1 bg-white/70" />

            {/* Right Player Label */}
            <div className="absolute bottom-2 right-3 bg-black/40 px-2 py-1 rounded text-[11px] font-bold text-white z-10 flex items-center gap-1.5">
              <span>{rightPlayer.name}</span>
              <span className="text-emerald-300">({rightPlayer.points})</span>
            </div>

            {/* Right Top Service Box */}
            <div
              className={`absolute top-0 bottom-1/2 left-[25%] right-0 flex items-center justify-center transition-colors ${
                server === rightPlayer.letter && serverCourtSide === 'right'
                  ? 'bg-amber-400/25 ring-2 ring-amber-400/80'
                  : ''
              }`}
            >
              {server === rightPlayer.letter && serverCourtSide === 'right' && (
                <div className="text-2xl animate-bounce">🏸</div>
              )}
            </div>

            {/* Right Bottom Service Box */}
            <div
              className={`absolute top-1/2 bottom-0 left-[25%] right-0 flex items-center justify-center transition-colors ${
                server === rightPlayer.letter && serverCourtSide === 'left'
                  ? 'bg-amber-400/25 ring-2 ring-amber-400/80'
                  : ''
              }`}
            >
              {server === rightPlayer.letter && serverCourtSide === 'left' && (
                <div className="text-2xl animate-bounce">🏸</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-200/80">
          <span>* Yellow highlight shows active serving court box under BWF rules</span>
          <span>Even score: Right court · Odd score: Left court</span>
        </div>
      </div>

      {/* Shuttle Equipment Tracker & Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏸</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Shuttlecock Equipment & Match Tracker
            </h3>
          </div>
          <span className="text-xs text-slate-400">Match Equipment Log</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          {/* Shuttle Type */}
          <div>
            <label className="text-[11px] text-slate-500 block mb-1 font-semibold">Shuttle Type</label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setShuttleType('feather')}
                className={`flex-1 py-1.5 rounded-lg border font-bold text-xs ${
                  shuttleType === 'feather'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Goose Feather
              </button>
              <button
                type="button"
                onClick={() => setShuttleType('nylon')}
                className={`flex-1 py-1.5 rounded-lg border font-bold text-xs ${
                  shuttleType === 'nylon'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Nylon / Plastic
              </button>
            </div>
          </div>

          {/* Shuttle Brand */}
          <div>
            <label className="text-[11px] text-slate-500 block mb-1 font-semibold">Brand / Model</label>
            <select
              value={shuttleBrand}
              onChange={(e) => setShuttleBrand(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
            >
              <option value="Yonex Aerosensa 50">Yonex Aerosensa 50</option>
              <option value="Yonex Aerosensa 30">Yonex Aerosensa 30</option>
              <option value="Victor Master No. 1">Victor Master No. 1</option>
              <option value="Li-Ning G900">Li-Ning G900</option>
              <option value="Yonex Mavis 350">Yonex Mavis 350 (Nylon)</option>
              <option value="Carlton T800">Carlton T800</option>
            </select>
          </div>

          {/* Shuttle Speed */}
          <div>
            <label className="text-[11px] text-slate-500 block mb-1 font-semibold">Speed Rating</label>
            <div className="flex gap-1">
              {[76, 77, 78].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setShuttleSpeed(spd as 76 | 77 | 78)}
                  className={`flex-1 py-1.5 rounded-lg border font-bold text-xs ${
                    shuttleSpeed === spd
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {spd} {spd === 77 ? '(Std)' : spd === 76 ? '(Slow)' : '(Fast)'}
                </button>
              ))}
            </div>
          </div>

          {/* Shuttles Used Counter */}
          <div>
            <label className="text-[11px] text-slate-500 block mb-1 font-semibold">Shuttles Consumed</label>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tabular-nums text-slate-900 dark:text-slate-100">
                {shuttlesUsed} shuttles
              </span>
              <button
                onClick={() => setShuttlesUsed((prev) => prev + 1)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                +1 Changed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rally & Shot Tracker (Smash, Drop, Net Shot, Clear, Drive, Fault, Error) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Rally Shot & Error Tracker
            </h3>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Select winning shot tag before tapping +1 point
          </div>
        </div>

        {/* Shot Selection Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { type: 'Smash', icon: '💥', desc: 'Attacking Smash' },
              { type: 'Drop', icon: '🎯', desc: 'Deceptive Drop' },
              { type: 'Net Shot', icon: '🕸️', desc: 'Spinning Net Kill' },
              { type: 'Clear', icon: '🚀', desc: 'Deep Overhead Clear' },
              { type: 'Drive', icon: '⚡', desc: 'Flat Fast Drive' },
              { type: 'Unforced Error', icon: '❌', desc: 'Opponent Out / Net' },
              { type: 'Fault', icon: '⚠️', desc: 'Service / Line Fault' },
            ] as const
          ).map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => setSelectedShotType(item.type)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedShotType === item.type
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-400/40 scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.type}</span>
            </button>
          ))}
        </div>

        {/* Rally Duration Picker */}
        <div className="flex items-center gap-3 pt-2 text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400">Rally Duration:</span>
          {[4, 8, 15, 25, 45].map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setRallyDuration(sec)}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold cursor-pointer ${
                rallyDuration === sec
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              ~{sec}s
            </button>
          ))}
        </div>

        {/* Rally History Log Table */}
        {rallyLog.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Rally-By-Rally Log ({rallyLog.length} rallies)
              </span>
              <span className="text-[11px] text-slate-400">Latest at top</span>
            </div>

            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs border border-slate-200 dark:border-slate-800 rounded-xl">
              {[...rallyLog].reverse().map((r, idx) => (
                <div
                  key={idx}
                  className="py-2 px-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-slate-400 font-mono text-[11px]">
                      #{rallyLog.length - idx}
                    </span>
                    <span
                      className={`font-bold ${
                        r.winner === 'A'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-teal-600 dark:text-teal-400'
                      }`}
                    >
                      {r.winner === 'A' ? playerA : playerB}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-medium">
                      {r.shot}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-mono text-[11px]">{r.rallySec}s rally</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {r.scoreA} - {r.scoreB}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Shuttle Toss Modal */}
      <ShuttleTossModal
        isOpen={isTossOpen}
        onClose={() => setIsTossOpen(false)}
        playerAName={playerA}
        playerBName={playerB}
        onApplyTossResult={handleApplyTossResult}
      />

      {/* Big Screen Scoreboard Modal for External TV / Projectors */}
      {isBigScreenOpen && (
        <BigScreenScoreboard
          matchState={{
            matchId: selectedMatchId,
            playerAIndex: activeMatch.playerAIndex,
            playerBIndex: activeMatch.playerBIndex,
            currentSet,
            setScores: completedSets,
            currentPointsA: pointsA,
            currentPointsB: pointsB,
            server,
            servingSide: serverCourtSide,
            sideAOnLeft,
            history: [],
            courtNumber,
            equipment: {
              type: shuttleType,
              brand: shuttleBrand,
              speed: shuttleSpeed,
              shuttlesUsed,
            },
            status: timerActive ? 'interval' : 'in_progress',
          }}
          playerAName={playerA}
          playerBName={playerB}
          playerAPhoto={photoA}
          playerBPhoto={photoB}
          onClose={() => setIsBigScreenOpen(false)}
          onAddPointA={() => handlePointScored('A')}
          onAddPointB={() => handlePointScored('B')}
          onUndo={handleUndoPoint}
        />
      )}
    </div>
  );
};
