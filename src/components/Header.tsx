import React from 'react';
import { Building2, ShieldCheck, Sparkles, FileText, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onReset?: () => void;
  hasData?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, hasData }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white py-6 px-4 sm:px-8 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 flex items-center justify-center shadow-inner">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 id="app-title" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Bank Statement AI
              </h1>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Sparkles className="w-3 h-3" /> OCR Powered
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">
              Upload your bank statement and automatically extract transactions using AI.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Private & In-Memory Only</span>
          </div>

          {hasData && onReset && (
            <button
              id="btn-reset-statement"
              onClick={onReset}
              className="inline-flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm cursor-pointer"
              title="Upload another statement"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Statement</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
