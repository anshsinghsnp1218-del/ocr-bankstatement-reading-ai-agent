import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 file uploads (PDFs, images)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Route: Extract transactions using Gemini 3.6 Flash
  app.post('/api/extract-transactions', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          success: false,
          error: 'GEMINI_API_KEY is not configured in environment variables. Please ensure the key is present in your secrets.'
        });
      }

      const { fileData, mimeType, filename } = req.body;

      if (!fileData || !mimeType) {
        return res.status(400).json({
          success: false,
          error: 'Missing file data or MIME type. Please upload a valid bank statement file.'
        });
      }

      // Initialize Gemini Client
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      // Prepare Inline Data Part
      // Clean base64 string if data URL prefix was included
      const cleanBase64 = fileData.replace(/^data:[^;]+;base64,/, '');

      const documentPart = {
        inlineData: {
          mimeType: mimeType,
          data: cleanBase64
        }
      };

      const promptText = `
Analyze the attached bank statement file (${filename || 'document'}) and extract all individual transaction records.

CRITICAL INSTRUCTIONS:
1. EXCLUDE NON-TRANSACTIONS: Do NOT include summary rows, headers, or metadata as transactions. Specifically, ignore rows like "Opening Balance", "Closing Balance", "Available Balance", "Current Balance", "Brought Forward", "Carried Forward", "Total Debits", "Total Credits", "Account Summary", customer address, or bank details.
2. DYNAMIC LAYOUT PARSING: Identify transactions regardless of column headers (e.g. Debit/Credit columns, Withdrawal/Deposit columns, or single Amount column with Dr/Cr indicators).
3. AMOUNT SIGNS:
   - Money OUT (Debits, Withdrawals, Card Payments, Purchases, Transfers Out, Fees, Charges, Rent, Bills) MUST BE NEGATIVE numbers (e.g., -450.00, -15000.00).
   - Money IN (Credits, Salary, Deposits, Transfers In, Refunds, Interest, Dividends) MUST BE POSITIVE numbers (e.g., 50000.00, 1200.00).
   - Preserve exact decimal points and values. Do not confuse account balances with transaction amounts.
4. DESCRIPTION ACCURACY: Keep the full transaction description. Include merchant names, UPI IDs, reference numbers, cheque numbers, and transaction details without shortening.
5. DATES: Format transaction dates consistently as DD-MM-YYYY whenever possible (or preserve original day, month, year).
6. CATEGORIZATION: Assign each transaction to exactly one of the following categories:
   - Food
   - Shopping
   - Transportation
   - Bills & Utilities
   - Rent
   - Salary
   - Transfer
   - ATM/Cash Withdrawal
   - Bank Charges
   - Investment
   - Healthcare
   - Education
   - Entertainment
   - Other (use if uncertain)
7. NOTES: Extract or infer helpful notes (e.g., "UPI payment to merchant", "ATM Cash withdrawal", "Salary credit via NEFT", "Cheque #10294", "Bank fee"). Leave blank if no relevant detail is present.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: {
          parts: [
            documentPart,
            { text: promptText }
          ]
        },
        config: {
          systemInstruction: 'You are an expert financial document parser and OCR system specialized in extracting transaction data from bank statements (PDFs, scanned images, photos). Be extremely precise with transaction amounts, dates, and non-transaction filtering.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bankName: { type: Type.STRING, description: 'Name of the bank if visible' },
              accountNumber: { type: Type.STRING, description: 'Account number if visible' },
              statementPeriod: { type: Type.STRING, description: 'Date range of statement if visible' },
              transactions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    date: { type: Type.STRING, description: 'Date in DD-MM-YYYY format' },
                    description: { type: Type.STRING, description: 'Full transaction description with details' },
                    amount: { type: Type.NUMBER, description: 'Amount with sign: negative for money out, positive for money in' },
                    category: { type: Type.STRING, description: 'Category choice' },
                    notes: { type: Type.STRING, description: 'Inferred notes or extra reference details' }
                  },
                  required: ['date', 'description', 'amount', 'category']
                }
              }
            },
            required: ['transactions']
          }
        }
      });

      const responseText = response.text || '{}';
      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse Gemini JSON output:', responseText);
        return res.status(500).json({
          success: false,
          error: 'Unable to parse transaction data from the model response. Please check document quality and try again.'
        });
      }

      if (!parsedData.transactions || !Array.isArray(parsedData.transactions)) {
        return res.status(400).json({
          success: false,
          error: 'Unable to extract transaction data from this document. Please upload a clearer image or PDF.'
        });
      }

      // Add unique IDs and validate category
      const validCategories = [
        'Food', 'Shopping', 'Transportation', 'Bills & Utilities', 'Rent', 'Salary',
        'Transfer', 'ATM/Cash Withdrawal', 'Bank Charges', 'Investment', 'Healthcare',
        'Education', 'Entertainment', 'Other'
      ];

      const sanitizedTransactions = parsedData.transactions.map((tx: any, index: number) => ({
        id: `tx-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 4)}`,
        date: tx.date || new Date().toISOString().split('T')[0],
        description: tx.description || 'Unidentified Transaction',
        amount: typeof tx.amount === 'number' ? Number(tx.amount.toFixed(2)) : 0,
        category: validCategories.includes(tx.category) ? tx.category : 'Other',
        notes: tx.notes || ''
      }));

      return res.json({
        success: true,
        accountDetails: {
          bankName: parsedData.bankName || '',
          accountNumber: parsedData.accountNumber || '',
          statementPeriod: parsedData.statementPeriod || ''
        },
        transactions: sanitizedTransactions,
        rawCount: sanitizedTransactions.length
      });

    } catch (error: any) {
      console.error('Error in /api/extract-transactions:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'An unexpected error occurred while processing the bank statement.'
      });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Bank Statement AI' });
  });

  // Vite development middleware vs production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
