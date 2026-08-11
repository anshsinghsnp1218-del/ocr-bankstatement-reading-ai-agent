import React, { useEffect, useState } from 'react';
import { Sparkles, FileSearch, Cpu, CheckCircle2 } from 'lucide-react';

export const ProcessingIndicator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Reading bank statement structure & layout...',
    'Performing OCR on document content...',
    'Extracting transaction dates, descriptions & amounts...',
    'Auto-classifying categories & generating notes...'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-lg p-8 text-center space-y-6 my-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white text-[10px] font-bold">
            <Cpu className="w-3.5 h-3.5" />
          </div>
        </div>

        <h3 id="status-processing-title" className="text-xl font-bold text-slate-900 tracking-tight">
          Analyzing your bank statement...
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Our AI model is extracting structured transaction records with high precision.
        </p>

        {/* Step progress list */}
        <div className="w-full mt-6 space-y-2.5 text-left border border-slate-100 rounded-xl p-4 bg-slate-50/80">
          {steps.map((stepText, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <div className="flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 bg-white" />
                  )}
                </div>
                <span
                  className={`font-medium ${
                    isCurrent
                      ? 'text-blue-700 font-semibold'
                      : isDone
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {stepText}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
