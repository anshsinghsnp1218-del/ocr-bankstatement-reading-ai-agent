export type TransactionCategory =
  | 'Food'
  | 'Shopping'
  | 'Transportation'
  | 'Bills & Utilities'
  | 'Rent'
  | 'Salary'
  | 'Transfer'
  | 'ATM/Cash Withdrawal'
  | 'Bank Charges'
  | 'Investment'
  | 'Healthcare'
  | 'Education'
  | 'Entertainment'
  | 'Other';

export const CATEGORIES: TransactionCategory[] = [
  'Food',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Rent',
  'Salary',
  'Transfer',
  'ATM/Cash Withdrawal',
  'Bank Charges',
  'Investment',
  'Healthcare',
  'Education',
  'Entertainment',
  'Other',
];

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: TransactionCategory;
  notes: string;
  isNew?: boolean;
}

export interface BankAccountMetadata {
  bankName?: string;
  accountNumber?: string;
  statementPeriod?: string;
  currency?: string;
}

export interface ExtractionResult {
  success: boolean;
  transactions?: Transaction[];
  accountDetails?: BankAccountMetadata;
  error?: string;
}

export interface StatementSummary {
  totalTransactions: number;
  totalCredits: number;
  totalDebits: number;
  netAmount: number;
}
