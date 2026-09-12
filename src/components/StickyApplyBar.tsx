import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator } from 'lucide-react';

export default function StickyApplyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-3 px-4 shadow-lg flex items-center justify-between max-w-7xl mx-auto rounded-t-2xl">
      <div className="flex items-center gap-2">
        <Calculator className="w-5 h-5 text-[#C0991B]" />
        <span className="text-xs font-bold text-gray-800 hidden sm:inline">Check your loan eligibility in 2 minutes</span>
      </div>
      <Link
        to="/pre-qualification"
        className="px-4 py-2 bg-[#074504] hover:bg-[#053203] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
      >
        <span>Apply for Loan</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
