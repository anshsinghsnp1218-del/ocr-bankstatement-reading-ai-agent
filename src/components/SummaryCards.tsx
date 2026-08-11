import React from 'react';
import { StatementSummary } from '../types';
import { Hash, ArrowDownRight, ArrowUpRight, Scale } from 'lucide-react';

interface SummaryCardsProps {
  summary: StatementSummary;
  currencySymbol?: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, currencySymbol = '$' }) => {
  const formatCurrency = (val: number) => {
    const absVal = Math.abs(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${currencySymbol}${absVal}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {/* Total Transactions */}
      <div id="summary-total-transactions" className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Transactions
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {summary.totalTransactions}
          </p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
          <Hash className="w-5 h-5" />
        </div>
      </div>

      {/* Total Credits */}
      <div id="summary-total-credits" className="bg-white rounded-xl border border-emerald-200/80 p-4 shadow-2xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-emerald-700 uppercase tracking-wider">
            Total Credits
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            +{formatCurrency(summary.totalCredits)}
          </p>
        </div>
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      {/* Total Debits */}
      <div id="summary-total-debits" className="bg-white rounded-xl border border-rose-200/80 p-4 shadow-2xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-rose-700 uppercase tracking-wider">
            Total Debits
          </p>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            -{formatCurrency(summary.totalDebits)}
          </p>
        </div>
        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
          <ArrowDownRight className="w-5 h-5" />
        </div>
      </div>

      {/* Net Amount */}
      <div id="summary-net-amount" className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Net Amount
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${
              summary.netAmount >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {summary.netAmount >= 0 ? '+' : '-'}{formatCurrency(summary.netAmount)}
          </p>
        </div>
        <div
          className={`p-3 rounded-xl border ${
            summary.netAmount >= 0
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-rose-50 text-rose-600 border-rose-100'
          }`}
        >
          <Scale className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
