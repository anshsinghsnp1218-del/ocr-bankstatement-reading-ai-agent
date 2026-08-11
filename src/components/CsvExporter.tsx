import React from 'react';
import { Transaction } from '../types';
import { Download } from 'lucide-react';

interface CsvExporterProps {
  transactions: Transaction[];
  filename?: string;
}

export const CsvExporter: React.FC<CsvExporterProps> = ({
  transactions,
  filename = 'extracted_bank_transactions.csv'
}) => {
  const handleDownloadCsv = () => {
    if (!transactions || transactions.length === 0) return;

    // Header exactly as specified in requirements: Date,Description,Amount,Category,Notes
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Notes'];

    const escapeCsvField = (field: string | number) => {
      const str = String(field ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = transactions.map((t) => [
      escapeCsvField(t.date),
      escapeCsvField(t.description),
      escapeCsvField(t.amount.toFixed(2)),
      escapeCsvField(t.category),
      escapeCsvField(t.notes)
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      id="btn-download-csv"
      onClick={handleDownloadCsv}
      disabled={!transactions || transactions.length === 0}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      <span>Download CSV</span>
    </button>
  );
};
