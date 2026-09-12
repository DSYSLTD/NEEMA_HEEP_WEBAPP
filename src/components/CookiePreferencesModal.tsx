import React, { useState } from 'react';
import { X, ShieldCheck, Lock, BarChart3, Target, Check } from 'lucide-react';
import { setConsentPreferences } from '../services/trackingService';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CookiePreferencesModal({ isOpen, onClose }: Props) {
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  if (!isOpen) return null;

  const handleSave = () => {
    setConsentPreferences({
      essential: true,
      analytics,
      marketing,
    });
    if (onClose) onClose();
  };

  const handleAcceptAll = () => {
    setAnalytics(true);
    setMarketing(true);
    setConsentPreferences({
      essential: true,
      analytics: true,
      marketing: true,
    });
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#074504] text-[#C0991B] flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#074504]">Cookie & Privacy Preferences</h3>
            <p className="text-xs text-gray-500 font-medium">Manage how Neema HEEP processes your site data</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          When you visit our platform, we store and retrieve information in the form of cookies. You can choose which types of cookies to allow below.
        </p>

        {/* Categories */}
        <div className="space-y-4">
          {/* 1. Essential */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#074504] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-[#074504] uppercase tracking-wider flex items-center gap-1.5">
                  Strictly Necessary
                  <span className="bg-[#074504] text-[#C0991B] text-[9px] px-2 py-0.5 rounded-full font-bold">Required</span>
                </h4>
                <p className="text-[11px] text-gray-600 font-medium mt-1">
                  Required for site navigation, security features, loan eligibility forms, and member portal sessions.
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-[#074504] shrink-0">Always Active</span>
          </div>

          {/* 2. Analytics */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-[#C0991B] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                  Analytics & Performance
                </h4>
                <p className="text-[11px] text-gray-600 font-medium mt-1">
                  Helps us measure site visits, traffic sources, and usage patterns to optimize loan product offerings.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                checked={analytics} 
                onChange={(e) => setAnalytics(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#074504]"></div>
            </label>
          </div>

          {/* 3. Marketing */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-[#599200] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                  Marketing & Personalization
                </h4>
                <p className="text-[11px] text-gray-600 font-medium mt-1">
                  Allows us to deliver relevant microfinance updates, mentorship invites, and loan campaign alerts on partner networks.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                checked={marketing} 
                onChange={(e) => setMarketing(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#074504]"></div>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            type="button"
            onClick={handleAcceptAll} 
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-extrabold rounded-xl transition-all uppercase tracking-wider"
          >
            Accept All
          </button>
          <button 
            type="button"
            onClick={handleSave} 
            className="w-full sm:w-auto px-6 py-2.5 bg-[#074504] hover:bg-[#0a5c06] text-white text-xs font-black rounded-xl shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 text-[#C0991B]" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
}
