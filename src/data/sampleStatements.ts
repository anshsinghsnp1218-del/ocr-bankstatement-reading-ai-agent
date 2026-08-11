import { Transaction } from '../types';

export interface SampleBankStatement {
  id: string;
  name: string;
  description: string;
  type: 'image/png' | 'application/pdf';
  bankName: string;
  accountNumber: string;
  statementPeriod: string;
  mockDataUrl: string; // Base64 data URL or SVG mockup URL
  transactions: Transaction[];
}

export const SAMPLE_STATEMENTS: SampleBankStatement[] = [
  {
    id: 'sample-1',
    name: 'Standard Retail Bank Statement (PDF)',
    description: 'Multi-category personal account statement with salary credit, UPI payments & ATM withdrawals.',
    type: 'application/pdf',
    bankName: 'Axis Global Bank',
    accountNumber: 'XXXX-XXXX-4892',
    statementPeriod: '01-08-2026 to 15-08-2026',
    mockDataUrl: '',
    transactions: [
      {
        id: 'tx-1',
        date: '01-08-2026',
        description: 'ACME CORP SALARY CREDIT REF#99823412',
        amount: 65000.00,
        category: 'Salary',
        notes: 'Monthly salary credited via NEFT'
      },
      {
        id: 'tx-2',
        date: '02-08-2026',
        description: 'SWIGGY FOOD ORDER UPI/32940291/BANGALORE',
        amount: -540.50,
        category: 'Food',
        notes: 'UPI payment'
      },
      {
        id: 'tx-3',
        date: '03-08-2026',
        description: 'ATM CASH WITHDRAWAL MG ROAD BRANCH',
        amount: -4000.00,
        category: 'ATM/Cash Withdrawal',
        notes: 'Cash withdrawal'
      },
      {
        id: 'tx-4',
        date: '05-08-2026',
        description: 'SUPERMARKET GROCERIES DEBIT CARD *4892',
        amount: -2850.75,
        category: 'Shopping',
        notes: 'Grocery store POS'
      },
      {
        id: 'tx-5',
        date: '07-08-2026',
        description: 'STATE ELECTRICITY BOARD BILL PMT UPI/882191',
        amount: -1240.00,
        category: 'Bills & Utilities',
        notes: 'Electricity bill payment'
      },
      {
        id: 'tx-6',
        date: '09-08-2026',
        description: 'UBER RIDE MUMBAI REF#UBR99281',
        amount: -380.00,
        category: 'Transportation',
        notes: 'Taxi ride'
      },
      {
        id: 'tx-7',
        date: '10-08-2026',
        description: 'MONTHLY APARTMENT RENT TRANSFER TO LANDLORD',
        amount: -18000.00,
        category: 'Rent',
        notes: 'Online transfer'
      },
      {
        id: 'tx-8',
        date: '12-08-2026',
        description: 'FREELANCE CONSULTING FEE REF#FC-9912',
        amount: 12500.00,
        category: 'Transfer',
        notes: 'Inward client remittance'
      },
      {
        id: 'tx-9',
        date: '14-08-2026',
        description: 'CONSOLIDATED BANK SMS & SERVICE CHARGES',
        amount: -45.00,
        category: 'Bank Charges',
        notes: 'Bank service fee'
      },
      {
        id: 'tx-10',
        date: '15-08-2026',
        description: 'SIP INVESTMENT - MUTUAL FUND GROWTH PLAN',
        amount: -5000.00,
        category: 'Investment',
        notes: 'Auto-debit SIP'
      }
    ]
  },
  {
    id: 'sample-2',
    name: 'Scanned Image Statement (JPEG)',
    description: 'Scanned photograph of a monthly statement with merchant purchases & bill payments.',
    type: 'image/png',
    bankName: 'Metropolitan Trust Bank',
    accountNumber: 'XXXX-XXXX-9102',
    statementPeriod: '15-07-2026 to 31-07-2026',
    mockDataUrl: '',
    transactions: [
      {
        id: 's2-1',
        date: '16-07-2026',
        description: 'CITY PHARMACY MEDICINES & HEALTHCARE',
        amount: -890.00,
        category: 'Healthcare',
        notes: 'Prescription purchase'
      },
      {
        id: 's2-2',
        date: '18-07-2026',
        description: 'NETFLIX DIGITAL SUBSCRIPTION MO',
        amount: -649.00,
        category: 'Entertainment',
        notes: 'Card recurring charge'
      },
      {
        id: 's2-3',
        date: '21-07-2026',
        description: 'DIVIDEND CREDIT - RELIANCE IND',
        amount: 3200.00,
        category: 'Investment',
        notes: 'Direct credit dividend'
      },
      {
        id: 's2-4',
        date: '25-07-2026',
        description: 'ONLINE COURSE TUITION FEE PAYTM/9912',
        amount: -4500.00,
        category: 'Education',
        notes: 'Skill course fee'
      },
      {
        id: 's2-5',
        date: '28-07-2026',
        description: 'SHELL PETROL PUMP FUEL DEBIT',
        amount: -1850.00,
        category: 'Transportation',
        notes: 'Fuel payment'
      }
    ]
  }
];
