import React from 'react';
import { Smartphone, Download, X, CheckCircle, Terminal, FolderArchive, ArrowRight } from 'lucide-react';

interface AndroidProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidProjectModal: React.FC<AndroidProjectModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 bg-[#103b29] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Smash Championship Android Project</h3>
              <p className="text-xs text-emerald-200/80">
                Package: <code className="font-mono bg-emerald-900/60 px-1.5 py-0.5 rounded text-emerald-300">com.hassan.badminton</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-emerald-200 hover:text-white rounded-xl hover:bg-emerald-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Direct Download Card */}
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-900 dark:text-emerald-200">
                <FolderArchive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Smash_Championship_Android_Project.zip</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                Complete Android Studio source code including Gradle build scripts, AndroidManifest.xml, and Kotlin MainActivity.
              </p>
            </div>

            <a
              href="/Smash_Championship_Android_Project.zip"
              download="Smash_Championship_Android_Project.zip"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download ZIP</span>
            </a>
          </div>

          {/* Project Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Project Architecture & Files
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                  MainActivity.kt
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Hardware-accelerated WebView with DOM storage & back navigation
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                  AndroidManifest.xml
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Theme NoActionBar, portrait lock, deep link ready
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                  build.gradle & settings.gradle
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Standard Android Gradle Plugin build configuration
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                  Offline Local Storage
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Auto-persists all scores & tournament history locally on phone
                </span>
              </div>
            </div>
          </div>

          {/* Step by step to build APK */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              How to Build an APK on your computer
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong>Extract the ZIP file</strong> to your computer folder (contains <code className="font-mono text-emerald-600 dark:text-emerald-400">smash_project/</code>).
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong>Open in Android Studio:</strong> Launch Android Studio and click <strong>File &gt; Open</strong>, then select the <code className="font-mono text-emerald-600 dark:text-emerald-400">smash_project</code> folder.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong>Generate APK:</strong> Click <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>. Android Studio builds the file into <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">app/build/outputs/apk/debug/app-debug.apk</code> ready to install on your phone!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            You can also run and use the full app right here in this browser!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
