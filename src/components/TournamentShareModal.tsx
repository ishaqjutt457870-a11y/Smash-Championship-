import React, { useState } from 'react';
import { Share2, Copy, Check, Download, Upload, X, Trash2, Printer } from 'lucide-react';
import { TournamentState, PlayerStats } from '../types';

interface TournamentShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentState: TournamentState;
  standings: PlayerStats[];
  onImportState: (imported: TournamentState) => void;
  onResetAll: () => void;
}

export const TournamentShareModal: React.FC<TournamentShareModalProps> = ({
  isOpen,
  onClose,
  tournamentState,
  standings,
  onImportState,
  onResetAll,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build clean text summary
  const championName =
    tournamentState.finalWinner !== null
      ? tournamentState.players[tournamentState.finalWinner]
      : 'In Progress';

  const standingsLines = standings
    .map(
      (s, i) =>
        `${i + 1}. ${s.name} — ${s.points} pts (W: ${s.won}, L: ${s.lost})`
    )
    .join('\n');

  const shareText = `🏸 *${tournamentState.tournamentTitle}*
🏆 Champion: ${championName}

📊 *League Standings:*
${standingsLines}

Generated via Smash Championship Badminton App.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tournamentState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `smash-championship-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.players)) {
          onImportState(parsed);
          onClose();
        } else {
          alert('Invalid tournament backup file format.');
        }
      } catch (err) {
        alert('Could not parse tournament backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Share & Export Tournament</h3>
              <p className="text-xs text-slate-400">Export scores, copy summary, or backup data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* WhatsApp / Text Summary Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Text / WhatsApp Summary
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
            <textarea
              readOnly
              value={shareText}
              rows={6}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
            />
          </div>

          {/* Backup & Restore Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownloadBackup}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors flex items-start gap-3"
            >
              <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                  Export JSON Backup
                </span>
                <span className="text-[11px] text-slate-500">
                  Save all fixtures and results to a JSON file
                </span>
              </div>
            </button>

            <label className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors flex items-start gap-3 cursor-pointer">
              <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                  Restore Backup
                </span>
                <span className="text-[11px] text-slate-500">
                  Load a previously exported tournament JSON
                </span>
              </div>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Quick Print & Danger Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Scoresheet</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all tournament matches, players, and recorded results?')) {
                  onResetAll();
                  onClose();
                }
              }}
              className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Everything</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
