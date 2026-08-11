import React, { useState, useMemo } from 'react';
import { CATEGORIES, Transaction, TransactionCategory } from '../types';
import {
  Search,
  ArrowUpDown,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { CsvExporter } from './CsvExporter';

interface TransactionTableProps {
  transactions: Transaction[];
  onUpdateTransaction: (updated: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onOpenAddModal: () => void;
}

type SortField = 'date' | 'description' | 'amount' | 'category';
type SortOrder = 'asc' | 'desc';
type TypeFilter = 'all' | 'credit' | 'debit';

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onUpdateTransaction,
  onDeleteTransaction,
  onAddTransaction,
  onOpenAddModal
}) => {
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Transaction | null>(null);

  // Category badge colors mapping
  const categoryColors: Record<TransactionCategory, string> = {
    Food: 'bg-amber-50 text-amber-700 border-amber-200',
    Shopping: 'bg-purple-50 text-purple-700 border-purple-200',
    Transportation: 'bg-blue-50 text-blue-700 border-blue-200',
    'Bills & Utilities': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Rent: 'bg-red-50 text-red-700 border-red-200',
    Salary: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Transfer: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'ATM/Cash Withdrawal': 'bg-orange-50 text-orange-700 border-orange-200',
    'Bank Charges': 'bg-slate-100 text-slate-700 border-slate-300',
    Investment: 'bg-teal-50 text-teal-700 border-teal-200',
    Healthcare: 'bg-rose-50 text-rose-700 border-rose-200',
    Education: 'bg-sky-50 text-sky-700 border-sky-200',
    Entertainment: 'bg-pink-50 text-pink-700 border-pink-200',
    Other: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Search
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        t.description.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower) ||
        t.notes.toLowerCase().includes(searchLower) ||
        t.date.toLowerCase().includes(searchLower);

      // Category filter
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;

      // Type filter (credit vs debit)
      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'credit' && t.amount >= 0) ||
        (typeFilter === 'debit' && t.amount < 0);

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [transactions, searchTerm, selectedCategory, typeFilter]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'amount') {
        valA = a.amount;
        valB = b.amount;
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTransactions, sortField, sortOrder]);

  // Paginated data
  const totalPages = Math.ceil(sortedTransactions.length / pageSize) || 1;
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedTransactions.slice(startIndex, startIndex + pageSize);
  }, [sortedTransactions, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Edit Handlers
  const handleStartEdit = (t: Transaction) => {
    setEditingId(t.id);
    setEditForm({ ...t });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = () => {
    if (editForm) {
      onUpdateTransaction(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  return (
    <div id="section-results-table" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-4 sm:p-6">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Extracted Transactions</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {filteredTransactions.length} items
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Review, edit values, filter categories, or export to CSV.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-add-transaction-modal"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-xs border border-blue-200 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Row</span>
          </button>

          <CsvExporter transactions={filteredTransactions} />
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-50/80 p-3 rounded-xl border border-slate-200/70">
        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-transactions"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search date, description, notes..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-4 relative">
          <select
            id="select-category-filter"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-700"
          >
            <option value="All">All Categories ({transactions.length})</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter Buttons (All / Credits / Debits) */}
        <div className="sm:col-span-3 flex justify-end">
          <div className="inline-flex p-0.5 rounded-lg bg-slate-200/80 border border-slate-300 text-[11px]">
            <button
              onClick={() => {
                setTypeFilter('all');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setTypeFilter('credit');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                typeFilter === 'credit'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Credits (+)
            </button>
            <button
              onClick={() => {
                setTypeFilter('debit');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                typeFilter === 'debit'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Debits (-)
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table id="table-bank-transactions" className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 select-none">
              <th
                onClick={() => handleSort('date')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/80 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('description')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/80 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Description</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('amount')}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-200/80 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Amount</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('category')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/80 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Category</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>

              <th className="py-3 px-4">Notes</th>

              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No transactions match your search or filters.
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((t) => {
                const isEditing = editingId === t.id;

                if (isEditing && editForm) {
                  return (
                    <tr key={t.id} className="bg-blue-50/60 border-l-4 border-l-blue-600">
                      {/* Edit Date */}
                      <td className="p-2">
                        <input
                          type="text"
                          value={editForm.date}
                          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          className="w-full p-1.5 border rounded border-blue-300 text-xs bg-white focus:outline-none"
                        />
                      </td>

                      {/* Edit Description */}
                      <td className="p-2">
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full p-1.5 border rounded border-blue-300 text-xs bg-white focus:outline-none"
                        />
                      </td>

                      {/* Edit Amount */}
                      <td className="p-2">
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.amount}
                          onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) || 0 })}
                          className="w-full p-1.5 border rounded border-blue-300 text-xs text-right font-mono bg-white focus:outline-none"
                        />
                      </td>

                      {/* Edit Category */}
                      <td className="p-2">
                        <select
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({ ...editForm, category: e.target.value as TransactionCategory })
                          }
                          className="w-full p-1.5 border rounded border-blue-300 text-xs bg-white focus:outline-none"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Edit Notes */}
                      <td className="p-2">
                        <input
                          type="text"
                          value={editForm.notes}
                          onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                          className="w-full p-1.5 border rounded border-blue-300 text-xs bg-white focus:outline-none"
                        />
                      </td>

                      {/* Save/Cancel */}
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={handleSaveEdit}
                            className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">
                      {t.date}
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-xs sm:max-w-md break-words">
                      {t.description}
                    </td>

                    {/* Amount */}
                    <td className={`py-3 px-4 text-right font-mono font-bold whitespace-nowrap ${
                      t.amount < 0 ? 'text-rose-600' : 'text-emerald-600'
                    }`}>
                      {t.amount < 0
                        ? `-${Math.abs(t.amount).toFixed(2)}`
                        : `+${t.amount.toFixed(2)}`}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          categoryColors[t.category] || categoryColors.Other
                        }`}
                      >
                        {t.category}
                      </span>
                    </td>

                    {/* Notes */}
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {t.notes || <span className="text-slate-300 italic">—</span>}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(t)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteTransaction(t.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Rows count bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="p-1 border border-slate-300 rounded bg-white text-slate-700"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="ml-2">
            Showing {paginatedTransactions.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(currentPage * pageSize, sortedTransactions.length)} of {sortedTransactions.length}
          </span>
        </div>

        {/* Page Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-semibold text-slate-700 px-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
