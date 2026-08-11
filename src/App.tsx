/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ProcessingIndicator } from './components/ProcessingIndicator';
import { SummaryCards } from './components/SummaryCards';
import { TransactionTable } from './components/TransactionTable';
import { AlertMessage } from './components/AlertMessage';
import { AddTransactionModal } from './components/AddTransactionModal';
import { SampleBankStatement } from './data/sampleStatements';
import { Transaction, StatementSummary, BankAccountMetadata } from './types';
import { Sparkles, FileText, CheckCircle, Lock } from 'lucide-react';

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleBankStatement | null>(null);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [accountDetails, setAccountDetails] = useState<BankAccountMetadata | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // File Select Handlers
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setSelectedSample(null);
    setErrorMessage(null);
  };

  const handleSampleSelect = (sample: SampleBankStatement) => {
    setSelectedSample(sample);
    setSelectedFile(null);
    setErrorMessage(null);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setSelectedSample(null);
    setErrorMessage(null);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSelectedSample(null);
    setTransactions(null);
    setAccountDetails(null);
    setErrorMessage(null);
  };

  // Perform Gemini AI Extraction
  const handleExtract = async () => {
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      if (selectedSample) {
        // Simulate short OCR processing time for sample
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setTransactions(selectedSample.transactions);
        setAccountDetails({
          bankName: selectedSample.bankName,
          accountNumber: selectedSample.accountNumber,
          statementPeriod: selectedSample.statementPeriod
        });
        setIsProcessing(false);
        return;
      }

      if (!selectedFile) {
        setErrorMessage('Please select or upload a bank statement file.');
        setIsProcessing(false);
        return;
      }

      // Read file as Base64 string
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const fileData = reader.result as string;

          const response = await fetch('/api/extract-transactions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fileData,
              mimeType: selectedFile.type,
              filename: selectedFile.name
            })
          });

          const data = await response.json();

          if (!data.success) {
            setErrorMessage(
              data.error ||
                'Unable to extract transaction data from this document. Please upload a clearer image or PDF.'
            );
            setTransactions(null);
          } else {
            setTransactions(data.transactions || []);
            setAccountDetails(data.accountDetails || null);
          }
        } catch (fetchErr: any) {
          console.error('Extraction request failed:', fetchErr);
          setErrorMessage(
            'Unable to extract transaction data from this document. Please upload a clearer image or PDF.'
          );
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        setErrorMessage('Failed to read the uploaded file. Please select a valid document.');
        setIsProcessing(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      console.error('Error during extraction process:', err);
      setErrorMessage(
        'An error occurred while processing your document. Please try again or upload a different file.'
      );
      setIsProcessing(false);
    }
  };

  // Transaction CRUD
  const handleUpdateTransaction = (updated: Transaction) => {
    if (!transactions) return;
    setTransactions(transactions.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDeleteTransaction = (id: string) => {
    if (!transactions) return;
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-manual-${Date.now()}`
    };
    setTransactions([newTx, ...(transactions || [])]);
  };

  // Calculate Summary metrics
  const summary: StatementSummary = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { totalTransactions: 0, totalCredits: 0, totalDebits: 0, netAmount: 0 };
    }

    let credits = 0;
    let debits = 0;

    transactions.forEach((t) => {
      if (t.amount >= 0) {
        credits += t.amount;
      } else {
        debits += Math.abs(t.amount);
      }
    });

    const net = credits - debits;

    return {
      totalTransactions: transactions.length,
      totalCredits: Number(credits.toFixed(2)),
      totalDebits: Number(debits.toFixed(2)),
      netAmount: Number(net.toFixed(2))
    };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      {/* Header */}
      <Header onReset={handleReset} hasData={!!transactions} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Account Details Banner if extracted */}
        {accountDetails && (accountDetails.bankName || accountDetails.accountNumber) && (
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-blue-300 uppercase">
                Detected Statement Header
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {accountDetails.bankName || 'Bank Statement'}
              </h2>
              {accountDetails.accountNumber && (
                <p className="text-xs text-blue-200 mt-1">
                  Account Number:{' '}
                  <span className="font-mono font-medium text-white">
                    {accountDetails.accountNumber}
                  </span>
                </p>
              )}
            </div>

            {accountDetails.statementPeriod && (
              <div className="bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/10 text-xs text-blue-100">
                Period: <span className="font-semibold text-white">{accountDetails.statementPeriod}</span>
              </div>
            )}
          </div>
        )}

        {/* Upload Section (Always visible until transactions are extracted, or can be collapsed) */}
        {!transactions && !isProcessing && (
          <FileUpload
            onFileSelect={handleFileSelect}
            onSampleSelect={handleSampleSelect}
            selectedFile={selectedFile}
            selectedSample={selectedSample}
            onClearFile={handleClearFile}
            onExtract={handleExtract}
            isProcessing={isProcessing}
          />
        )}

        {/* Error Alert */}
        {errorMessage && (
          <AlertMessage
            message={errorMessage}
            onRetry={selectedFile || selectedSample ? handleExtract : undefined}
            onDismiss={() => setErrorMessage(null)}
          />
        )}

        {/* Processing Indicator */}
        {isProcessing && <ProcessingIndicator />}

        {/* Extracted Results Section */}
        {transactions && !isProcessing && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Metric Summary Cards */}
            <SummaryCards summary={summary} />

            {/* Editable Transactions Table */}
            <TransactionTable
              transactions={transactions}
              onUpdateTransaction={handleUpdateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onAddTransaction={handleAddTransaction}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Manual Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTransaction}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Bank Statement AI • Encrypted document processing via Google Gemini</span>
          </p>
          <p className="text-slate-400">
            Designed for precise financial transaction OCR & extraction.
          </p>
        </div>
      </footer>
    </div>
  );
}
