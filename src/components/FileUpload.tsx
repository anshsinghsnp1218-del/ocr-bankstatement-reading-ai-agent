import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, CheckCircle2, X, Sparkles, FileSpreadsheet, Eye } from 'lucide-react';
import { SAMPLE_STATEMENTS, SampleBankStatement } from '../data/sampleStatements';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onSampleSelect: (sample: SampleBankStatement) => void;
  selectedFile: File | null;
  selectedSample: SampleBankStatement | null;
  onClearFile: () => void;
  onExtract: () => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onSampleSelect,
  selectedFile,
  selectedSample,
  onClearFile,
  onExtract,
  isProcessing
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      alert('Please upload a valid PDF or image file (JPG, PNG).');
      return;
    }

    // Generate object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setFilePreviewUrl(objectUrl);
    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClearFile();
  };

  const isPdf = selectedFile?.type === 'application/pdf' || selectedSample?.type === 'application/pdf';
  const isImage = selectedFile?.type.startsWith('image/') || selectedSample?.type.startsWith('image/');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      <div>
        <h2 id="heading-upload" className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-blue-600" />
          <span>Upload Bank Statement</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Supports scanned documents, photos, or digital PDF bank statements.
        </p>
      </div>

      {!selectedFile && !selectedSample ? (
        <div className="space-y-4">
          <div
            id="dropzone-bank-statement"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group ${
              isDragging
                ? 'border-blue-500 bg-blue-50/70 shadow-inner'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/80'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg"
              className="hidden"
              id="file-input-bank-statement"
            />
            
            <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-800">
                <span className="text-blue-600 underline underline-offset-2">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-500 font-medium">
                PDF, JPG, JPEG, or PNG (up to 20MB)
              </p>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium text-slate-500 bg-slate-100/80 px-3 py-1 rounded-full">
              <span>Dynamic layout OCR</span>
              <span>•</span>
              <span>Multi-page PDFs</span>
              <span>•</span>
              <span>Scanned photos</span>
            </div>
          </div>

          {/* Sample Statement Quick Loader */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Don't have a statement handy? Try a sample:
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_STATEMENTS.map((sample) => (
                <button
                  key={sample.id}
                  id={`btn-sample-${sample.id}`}
                  onClick={() => onSampleSelect(sample)}
                  type="button"
                  className="text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/40 transition-all group flex items-start gap-3 cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-blue-600 group-hover:border-blue-300">
                    {sample.type === 'application/pdf' ? (
                      <FileText className="w-4 h-4" />
                    ) : (
                      <ImageIcon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-700">
                      {sample.name}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {sample.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* File Preview Area */
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-lg bg-blue-100/70 border border-blue-200 text-blue-700">
                {isPdf ? <FileText className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {selectedFile ? selectedFile.name : selectedSample?.name}
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Ready
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedFile
                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • ${selectedFile.type || 'Document'}`
                    : `${selectedSample?.bankName} • ${selectedSample?.statementPeriod}`}
                </p>
              </div>
            </div>

            <button
              id="btn-clear-file"
              onClick={handleClear}
              disabled={isProcessing}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Document Preview Box */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100/80">
            <div className="px-3 py-2 bg-slate-200/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                Document Preview
              </span>
              <span>{isPdf ? 'PDF Document' : 'Image Scan'}</span>
            </div>

            <div className="p-2 flex justify-center items-center min-h-[220px] max-h-[380px] overflow-auto">
              {filePreviewUrl ? (
                isPdf ? (
                  <iframe
                    src={filePreviewUrl}
                    title="PDF Statement Preview"
                    className="w-full h-[320px] rounded border border-slate-200 bg-white"
                  />
                ) : (
                  <img
                    src={filePreviewUrl}
                    alt="Uploaded Bank Statement Preview"
                    className="max-h-[340px] max-w-full object-contain rounded shadow-xs"
                  />
                )
              ) : selectedSample ? (
                /* Sample Mock Preview Visual */
                <div className="w-full max-w-lg bg-white border border-slate-200 rounded-lg p-5 shadow-xs text-left font-mono text-xs space-y-3 text-slate-700">
                  <div className="border-b pb-2 flex justify-between items-center text-slate-900 font-sans font-bold text-sm">
                    <span>{selectedSample.bankName}</span>
                    <span className="text-xs text-slate-500 font-mono">{selectedSample.accountNumber}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans">
                    Statement Period: <span className="font-semibold text-slate-700">{selectedSample.statementPeriod}</span>
                  </div>
                  <div className="bg-slate-50 border rounded p-2 text-[11px] space-y-1.5">
                    <div className="grid grid-cols-12 font-bold border-b pb-1 text-slate-800">
                      <span className="col-span-3">DATE</span>
                      <span className="col-span-6">DESCRIPTION</span>
                      <span className="col-span-3 text-right">AMOUNT</span>
                    </div>
                    {selectedSample.transactions.slice(0, 4).map((tx, idx) => (
                      <div key={idx} className="grid grid-cols-12 text-slate-600">
                        <span className="col-span-3">{tx.date}</span>
                        <span className="col-span-6 truncate pr-1">{tx.description}</span>
                        <span className={`col-span-3 text-right font-medium ${tx.amount < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {tx.amount < 0 ? `-₹${Math.abs(tx.amount)}` : `+₹${tx.amount}`}
                        </span>
                      </div>
                    ))}
                    <div className="text-[10px] text-slate-400 italic text-center pt-1">
                      + {selectedSample.transactions.length - 4} more transactions ready for extraction
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Preview not available</p>
              )}
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="flex justify-end pt-2">
            <button
              id="btn-extract-transactions"
              onClick={onExtract}
              disabled={isProcessing}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm text-white shadow-md transition-all cursor-pointer ${
                isProcessing
                  ? 'bg-blue-400 cursor-not-allowed opacity-80'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-blue-500/20'
              }`}
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Extract Transactions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
