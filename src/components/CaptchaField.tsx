import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

interface CaptchaFieldProps {
  onVerified: (isValid: boolean) => void;
}

export default function CaptchaField({ onVerified }: CaptchaFieldProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isPassed, setIsPassed] = useState(false);
  const [error, setError] = useState(false);

  const generateQuiz = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 1;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setIsPassed(false);
    setError(false);
    onVerified(false);
  };

  useEffect(() => {
    generateQuiz();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserAnswer(val);
    const expected = num1 + num2;
    if (parseInt(val, 10) === expected) {
      setIsPassed(true);
      setError(false);
      onVerified(true);
    } else {
      setIsPassed(false);
      if (val.length >= String(expected).length) {
        setError(true);
      } else {
        setError(false);
      }
      onVerified(false);
    }
  };

  return (
    <div className="bg-[#f8faf8] border border-gray-200 rounded-2xl p-4 my-3">
      {/* Hidden Honeypot Field for Spam Bots */}
      <input 
        type="text" 
        name="_gotcha" 
        tabIndex={-1} 
        autoComplete="off" 
        className="hidden opacity-0 w-0 h-0 absolute -z-50 pointer-events-none" 
      />

      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-xs font-black text-[#074504] uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#C0991B]" />
          <span>Security & Spam Verification</span>
        </div>
        <button
          type="button"
          onClick={generateQuiz}
          className="text-gray-400 hover:text-[#074504] transition-colors p-1"
          title="Refresh Challenge"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl font-mono text-sm font-black text-[#074504] tracking-wider shrink-0 shadow-xs">
          {num1} + {num2} = ?
        </div>
        <div className="relative flex-1">
          <input
            type="number"
            value={userAnswer}
            onChange={handleChange}
            placeholder="Answer"
            className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none transition-all ${
              isPassed 
                ? 'border-[#599200] ring-1 ring-[#599200]' 
                : error 
                  ? 'border-red-400 ring-1 ring-red-400' 
                  : 'border-gray-200 focus:border-[#074504]'
            }`}
          />
          {isPassed && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#599200]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
      {error && (
        <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">Incorrect answer, please try again.</p>
      )}
    </div>
  );
}
