import React, { useState } from 'react';
import { Plus, Trash2, Shuffle, Play, Users, Check, AlertCircle, Camera, Award, Zap } from 'lucide-react';
import { MatchFormat } from '../types';
import { getPlayerColor, getInitials, PRESET_ROSTERS, getFormatLabel } from '../utils/tournament';

interface PlayerSetupProps {
  players: string[];
  setPlayers: (players: string[]) => void;
  playerPhotos?: Record<number, string>;
  matchFormat: MatchFormat;
  setMatchFormat: (format: MatchFormat) => void;
  tournamentStarted: boolean;
  onStartTournament: () => void;
  onResetTournament: () => void;
  onOpenPlayerProfile: (playerId: number) => void;
}

export const PlayerSetup: React.FC<PlayerSetupProps> = ({
  players,
  setPlayers,
  playerPhotos,
  matchFormat,
  setMatchFormat,
  tournamentStarted,
  onStartTournament,
  onResetTournament,
  onOpenPlayerProfile,
}) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddPlayer = (nameToAdd?: string) => {
    const target = (nameToAdd || newPlayerName).trim();
    if (!target) return;

    if (players.some((p) => p.toLowerCase() === target.toLowerCase())) {
      setErrorMessage(`"${target}" is already in the tournament roster.`);
      return;
    }

    setPlayers([...players, target]);
    setNewPlayerName('');
    setErrorMessage(null);
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length <= 4) {
      setErrorMessage('Tournament requires at least 4 players.');
      return;
    }
    const updated = players.filter((_, i) => i !== index);
    setPlayers(updated);
    setErrorMessage(null);
  };

  const handleUpdatePlayerName = (index: number, newName: string) => {
    const updated = [...players];
    updated[index] = newName;
    setPlayers(updated);
  };

  const handleShuffle = () => {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    setPlayers(shuffled);
  };

  const handleApplyPreset = (presetPlayers: string[]) => {
    setPlayers([...presetPlayers]);
    setErrorMessage(null);
  };

  const totalMatches = (players.length * (players.length - 1)) / 2;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Tournament Roster & Format
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Register players with custom photos, select match format, and launch the tournament.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums text-sm">
              {players.length}
            </span>{' '}
            Registered
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums text-sm">
              {totalMatches}
            </span>{' '}
            League Matches
          </div>
        </div>

        {/* MATCH FORMAT SELECTOR: Best of 1, 3, 5 */}
        <div className="mt-5 p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Match Format Selection</span>
              </span>
              <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                Current: <strong className="text-emerald-950 dark:text-white">{getFormatLabel(matchFormat)}</strong>
              </p>
            </div>

            {/* Segmented control buttons */}
            <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 rounded-xl shadow-sm self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setMatchFormat('bo1')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  matchFormat === 'bo1'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Best of 1
              </button>

              <button
                type="button"
                onClick={() => setMatchFormat('bo3')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  matchFormat === 'bo3'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Best of 3
              </button>

              <button
                type="button"
                onClick={() => setMatchFormat('bo5')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  matchFormat === 'bo5'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Best of 5
              </button>
            </div>
          </div>
        </div>

        {/* Add Player Input */}
        <div className="mt-5 flex gap-2">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => {
              setNewPlayerName(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddPlayer();
            }}
            placeholder="Enter player or team name..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
          />
          <button
            onClick={() => handleAddPlayer()}
            disabled={!newPlayerName.trim()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mt-3 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Quick Presets */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            Quick Roster Presets:
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_ROSTERS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleApplyPreset(preset.players)}
                className="px-3 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {preset.name} ({preset.players.length})
              </button>
            ))}
          </div>
        </div>

        {/* Player List with Profile Picture Integration */}
        <div className="mt-6 space-y-2.5">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span>REGISTERED PLAYERS (Click avatar to edit profile & photo)</span>
            <span>{players.length} players</span>
          </div>

          {players.map((player, index) => {
            const avatarColor = getPlayerColor(index);
            const initials = getInitials(player);
            const photo = playerPhotos?.[index];

            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 transition-all hover:border-slate-300 dark:hover:border-slate-600"
              >
                {/* Clickable Profile Avatar */}
                <button
                  type="button"
                  onClick={() => onOpenPlayerProfile(index)}
                  className="relative group shrink-0 focus:outline-none"
                  title="Click to view & edit player profile picture"
                >
                  {photo ? (
                    <img
                      src={photo}
                      alt={player}
                      className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-500/50 shadow-sm"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {initials}
                    </div>
                  )}
                  <span className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                    <Camera className="w-3.5 h-3.5" />
                  </span>
                </button>

                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 w-6 tabular-nums text-center">
                  #{index + 1}
                </div>

                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <input
                    type="text"
                    value={player}
                    onChange={(e) => handleUpdatePlayerName(index, e.target.value)}
                    className="flex-1 bg-transparent border-0 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-2 py-1"
                    placeholder={`Player ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => onOpenPlayerProfile(index)}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline self-start sm:self-auto px-2"
                  >
                    View Profile
                  </button>
                </div>

                <button
                  onClick={() => handleRemovePlayer(index)}
                  disabled={players.length <= 4}
                  title={players.length <= 4 ? 'Minimum 4 players required' : 'Remove player'}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-20 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Controls row */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleShuffle}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Randomize player seed order"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle Seeds</span>
          </button>

          <div className="flex items-center gap-2">
            {tournamentStarted && (
              <button
                onClick={onResetTournament}
                className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition-colors"
              >
                Reset Matches
              </button>
            )}

            <button
              onClick={onStartTournament}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-700/15 flex items-center gap-2"
            >
              {tournamentStarted ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Update & Continue</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Tournament</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Rules Card with Developer Credit */}
      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-3xl p-5 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
        <div className="font-bold text-sm flex items-center justify-between text-emerald-800 dark:text-emerald-300">
          <span className="flex items-center gap-2">
            <span>🏸</span> Tournament Structure & Rules
          </span>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            Format: {matchFormat === 'bo1' ? 'Best of 1' : matchFormat === 'bo5' ? 'Best of 5' : 'Best of 3'}
          </span>
        </div>
        <p className="leading-relaxed">
          <strong>1. League Round-Robin:</strong> Every player plays each competitor once under{' '}
          <strong>{getFormatLabel(matchFormat)}</strong>. Each win awards <strong>2 points</strong>, and a loss awards <strong>0 points</strong>.
        </p>
        <p className="leading-relaxed">
          <strong>2. Playoff Qualification:</strong> The <strong>Top 4 players</strong> advance to the Knockout Semi-Finals (1st vs 4th, 2nd vs 3rd).
        </p>
        <p className="leading-relaxed">
          <strong>3. Grand Championship:</strong> Semi-final winners clash in the Grand Final for the championship trophy.
        </p>
      </div>
    </div>
  );
};
