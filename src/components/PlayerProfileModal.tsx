import React, { useState } from 'react';
import { X, Camera, Trophy, Medal, Flame, Check, User, ArrowUpRight, Shield, Zap } from 'lucide-react';
import { PlayerStats, TournamentMatch, MatchScore, PlayerBio } from '../types';
import { getPlayerColor, getInitials, formatScore } from '../utils/tournament';

interface PlayerProfileModalProps {
  player: PlayerStats | null;
  isOpen: boolean;
  onClose: () => void;
  fixtures: TournamentMatch[];
  results: Record<string, number>;
  scores: Record<string, MatchScore>;
  allPlayers: string[];
  onUpdatePhoto: (playerId: number, photoDataUrl: string) => void;
  onRemovePhoto: (playerId: number) => void;
  onUpdateBio: (playerId: number, bio: PlayerBio) => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  player,
  isOpen,
  onClose,
  fixtures,
  results,
  scores,
  allPlayers,
  onUpdatePhoto,
  onRemovePhoto,
  onUpdateBio,
}) => {
  if (!isOpen || !player) return null;

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [playStyle, setPlayStyle] = useState(player.bio?.playStyle || 'All-Round Tactician');
  const [hand, setHand] = useState<'Right' | 'Left'>(player.bio?.hand || 'Right');
  const [notes, setNotes] = useState(player.bio?.notes || '');

  const winRate = player.played > 0 ? Math.round((player.won / player.played) * 100) : 0;
  const pointDiff = player.pointsFor - player.pointsAgainst;

  // Find all matches involving this player
  const playerMatches = fixtures.filter(
    (m) => m.playerAIndex === player.id || m.playerBIndex === player.id
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to compressed base64 data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 256;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onUpdatePhoto(player.id, dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBio = () => {
    onUpdateBio(player.id, {
      playStyle,
      hand,
      notes,
    });
    setIsEditingBio(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Banner with Badminton Court Texture */}
        <div className="relative p-6 bg-gradient-to-r from-[#103b29] to-[#1e6142] text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-emerald-200 hover:text-white rounded-xl hover:bg-emerald-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            {/* Avatar Photo Slot */}
            <div className="relative group">
              {player.photo ? (
                <img
                  src={player.photo}
                  alt={player.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-white/20"
                  style={{ backgroundColor: player.avatarColor }}
                >
                  {getInitials(player.name)}
                </div>
              )}

              {/* Upload trigger overlay */}
              <label className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer transition-opacity">
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Change</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold tracking-tight">{player.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-semibold">
                  Seed #{player.id + 1}
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>{player.bio?.playStyle || 'All-Round Tactician'}</span>
                <span>·</span>
                <span>{player.bio?.hand || 'Right'}-Handed</span>
              </p>
              {player.photo && (
                <button
                  onClick={() => onRemovePhoto(player.id)}
                  className="text-[10px] text-emerald-300/80 hover:text-rose-300 underline mt-1"
                >
                  Remove custom photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Performance Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Win Rate</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                {winRate}%
              </span>
              <span className="text-[10px] text-slate-400 block">
                {player.won}W - {player.lost}L
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">League Points</span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {player.points}
              </span>
              <span className="text-[10px] text-slate-400 block">2 pts / win</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Sets (W/L)</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                {player.setsWon}-{player.setsLost}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Diff: {player.setsWon - player.setsLost > 0 ? `+${player.setsWon - player.setsLost}` : player.setsWon - player.setsLost}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Point Diff</span>
              <span
                className={`text-lg font-extrabold tabular-nums ${
                  pointDiff > 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : pointDiff < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {pointDiff > 0 ? `+${pointDiff}` : pointDiff}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {player.pointsFor}:{player.pointsAgainst}
              </span>
            </div>
          </div>

          {/* Edit Bio & Player Profile Section */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Player Profile & Style</span>
              </span>
              <button
                onClick={() => setIsEditingBio(!isEditingBio)}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                {isEditingBio ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditingBio ? (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Play Style</label>
                  <select
                    value={playStyle}
                    onChange={(e) => setPlayStyle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Jump Smash Attacker">Jump Smash Attacker</option>
                    <option value="All-Round Tactician">All-Round Tactician</option>
                    <option value="Net Play Specialist">Net Play Specialist</option>
                    <option value="Defensive Retriever">Defensive Retriever</option>
                    <option value="Fast-Paced Speedster">Fast-Paced Speedster</option>
                    <option value="Deceptive Drop-Shotter">Deceptive Drop-Shotter</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Preferred Hand</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setHand('Right')}
                      className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                        hand === 'Right'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      Right-Handed
                    </button>
                    <button
                      type="button"
                      onClick={() => setHand('Left')}
                      className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                        hand === 'Left'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      Left-Handed
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Coach / Player Notes</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Favorite racket: Yonex Astrox 99 Pro"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <button
                  onClick={handleSaveBio}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Save Profile
                </button>
              </div>
            ) : (
              <div className="text-slate-600 dark:text-slate-300 space-y-1">
                <p>
                  <strong>Style:</strong> {player.bio?.playStyle || 'All-Round Tactician'}
                </p>
                <p>
                  <strong>Hand:</strong> {player.bio?.hand || 'Right'}-Handed
                </p>
                {player.bio?.notes && (
                  <p>
                    <strong>Gear/Notes:</strong> {player.bio.notes}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Match Log History */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              Tournament Match History ({playerMatches.length} matches)
            </h4>

            <div className="space-y-2">
              {playerMatches.map((m) => {
                const isPlayerA = m.playerAIndex === player.id;
                const oppIndex = isPlayerA ? m.playerBIndex : m.playerAIndex;
                const opponentName = allPlayers[oppIndex];
                const winner = results[m.id];
                const hasResult = winner !== undefined;
                const won = winner === player.id;
                const score = scores[m.id];
                const formattedScoreStr = formatScore(score);

                return (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      hasResult
                        ? won
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-md text-white font-bold text-[10px] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: getPlayerColor(oppIndex) }}
                      >
                        {getInitials(opponentName)}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          vs {opponentName}
                        </span>
                        {formattedScoreStr && (
                          <span className="text-[10px] text-slate-500 block">
                            Sets: {formattedScoreStr}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      {hasResult ? (
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            won
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 text-white'
                          }`}
                        >
                          {won ? 'WON' : 'LOST'}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Scheduled</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-medium text-xs transition-colors">
            <Camera className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl text-xs hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
