import React from 'react';
import { AlertTriangle, RefreshCw, XCircle } from 'lucide-react';

interface AlertMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({ message, onRetry, onDismiss }) => {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 my-6 text-rose-800 flex items-start gap-3 shadow-xs">
      <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">
        <p className="font-semibold text-rose-900">Extraction Error</p>
        <p className="mt-1 text-rose-700 leading-relaxed">{message}</p>
        <p className="mt-2 text-xs text-rose-600">
          Tip: Ensure the document is a bank statement, has legible text, and is not password protected.
        </p>

        {onRetry && (
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Try Again</span>
            </button>
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-rose-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
        >
          <XCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
