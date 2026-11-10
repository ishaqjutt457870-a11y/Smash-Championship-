import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Award,
  Sparkles,
  Trophy,
  CheckCircle2,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { TournamentState, PlayerStats } from '../types';

interface PDFReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentState: TournamentState;
  standings: PlayerStats[];
}

export const PDFReportModal: React.FC<PDFReportModalProps> = ({
  isOpen,
  onClose,
  tournamentState,
  standings,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const championName =
    tournamentState.finalWinner !== null
      ? tournamentState.players[tournamentState.finalWinner]
      : standings[0]?.name || 'Tournament Winner';

  const runnerUpName =
    tournamentState.semis && tournamentState.finalWinner !== null
      ? tournamentState.players[
          tournamentState.semis[0] === tournamentState.finalWinner
            ? tournamentState.semis[1]
            : tournamentState.semis[0]
        ] || 'Runner Up'
      : standings[1]?.name || 'Runner Up';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 print:hidden">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Official Championship Certificate & Tournament Report
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Content Area */}
        <div className="p-6 sm:p-8 space-y-8 print:p-0 print:m-0" id="printable-area">
          {/* Printable Gold Certificate */}
          <div
            ref={certificateRef}
            className="relative rounded-3xl border-8 border-amber-400/80 bg-gradient-to-br from-[#0b2b1e] via-[#0f3827] to-[#081d14] p-8 sm:p-12 text-white shadow-2xl overflow-hidden print:border-4 print:rounded-none"
          >
            {/* Certificate Decorative Guilloche-style Borders */}
            <div className="absolute inset-3 border-2 border-amber-300/40 rounded-2xl pointer-events-none" />
            <div className="absolute inset-5 border border-dashed border-amber-400/30 rounded-xl pointer-events-none" />

            {/* Corner Filigrees */}
            <div className="absolute top-6 left-6 text-2xl text-amber-300">✦</div>
            <div className="absolute top-6 right-6 text-2xl text-amber-300">✦</div>
            <div className="absolute bottom-6 left-6 text-2xl text-amber-300">✦</div>
            <div className="absolute bottom-6 right-6 text-2xl text-amber-300">✦</div>

            {/* Certificate Header */}
            <div className="text-center relative z-10 space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-400 text-slate-950 text-3xl font-black shadow-lg mx-auto mb-2">
                🏆
              </div>

              <div className="text-xs sm:text-sm uppercase tracking-[0.3em] text-amber-300 font-extrabold font-mono">
                Official Badminton Tournament Award
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-serif drop-shadow-md">
                CERTIFICATE OF CHAMPIONSHIP
              </h1>

              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-3" />

              <p className="text-xs sm:text-sm text-emerald-200/90 italic font-serif">
                This is proudly presented to certify that
              </p>

              {/* Champion Name Box */}
              <div className="py-4">
                <span className="text-3xl sm:text-5xl font-extrabold text-amber-300 tracking-wide underline decoration-amber-400/50 decoration-wavy underline-offset-8 drop-shadow-md">
                  {championName}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
                has emerged as the victorious <strong className="text-amber-200">CHAMPION</strong> of the{' '}
                <strong className="text-white">{tournamentState.tournamentTitle || 'Smash Championship'}</strong>,
                demonstrating extraordinary agility, sportsmanship, and technical excellence across all fixtures.
              </p>
            </div>

            {/* Gold Seal & Signatures */}
            <div className="mt-12 pt-8 border-t border-amber-400/30 grid grid-cols-3 items-center text-center relative z-10 gap-4">
              {/* Signature 1: Tournament Director */}
              <div className="space-y-1">
                <div className="h-10 flex items-end justify-center font-serif italic text-amber-200 text-lg sm:text-xl">
                  Hassan
                </div>
                <div className="w-36 h-0.5 bg-amber-400/60 mx-auto" />
                <div className="text-[11px] font-bold text-white uppercase tracking-wider">
                  Tournament Director
                </div>
                <div className="text-[9px] text-emerald-300">Smash Championship Board</div>
              </div>

              {/* Center Official Gold Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 p-1 shadow-2xl flex items-center justify-center border-2 border-white/60 transform rotate-6">
                  <div className="w-full h-full rounded-full border border-dashed border-amber-900 flex flex-col items-center justify-center text-slate-950 font-black p-1 text-center">
                    <span className="text-[9px] uppercase tracking-tighter font-extrabold leading-none">
                      OFFICIAL
                    </span>
                    <span className="text-xl leading-none my-0.5">🎖️</span>
                    <span className="text-[8px] uppercase tracking-tighter font-bold leading-none">
                      GOLD SEAL
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-amber-300 font-mono mt-1 font-bold">
                  BWF STANDARD
                </div>
              </div>

              {/* Signature 2: Software / Developer Authority */}
              <div className="space-y-1">
                <div className="h-10 flex items-end justify-center font-serif italic text-amber-200 text-base sm:text-lg">
                  Developed By Hassan
                </div>
                <div className="w-36 h-0.5 bg-amber-400/60 mx-auto" />
                <div className="text-[11px] font-bold text-white uppercase tracking-wider">
                  Lead Engineering
                </div>
                <div className="text-[9px] text-emerald-300 uppercase tracking-widest font-mono">
                  HASSAN DEVELOPERS
                </div>
              </div>
            </div>

            {/* Certificate Bottom Footnote */}
            <div className="mt-8 text-center text-[10px] text-emerald-300/60 font-mono">
              VERIFIED ID: {tournamentState.createdDate ? new Date(tournamentState.createdDate).toLocaleDateString() : 'OFFICIAL'} &bull; SMASH CHAMPIONSHIP TOURNAMENT SYSTEM
            </div>
          </div>

          {/* Tournament Summary Scoresheet Table (Printable) */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Official Tournament Final Standings</span>
            </h3>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Player</th>
                    <th className="py-2.5 px-3 text-center">Played</th>
                    <th className="py-2.5 px-3 text-center">Won</th>
                    <th className="py-2.5 px-3 text-center">Lost</th>
                    <th className="py-2.5 px-3 text-center">Sets (W-L)</th>
                    <th className="py-2.5 px-3 text-center">Points (F-A)</th>
                    <th className="py-2.5 px-3 text-right">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {standings.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-bold">#{idx + 1}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                        {p.name}
                      </td>
                      <td className="py-2 px-3 text-center font-mono">{p.played}</td>
                      <td className="py-2 px-3 text-center font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {p.won}
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-rose-500">{p.lost}</td>
                      <td className="py-2 px-3 text-center font-mono">
                        {p.setsWon} - {p.setsLost}
                      </td>
                      <td className="py-2 px-3 text-center font-mono">
                        {p.pointsFor} - {p.pointsAgainst}
                      </td>
                      <td className="py-2 px-3 text-right font-black text-emerald-700 dark:text-emerald-400">
                        {p.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
