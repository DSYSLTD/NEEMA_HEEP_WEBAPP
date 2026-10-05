import React from 'react';
import { Phone, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SmartLeadForm from '../components/SmartLeadForm';
import { CALLBACK_FORM_FIELDS, CALLBACK_FORM_CTA, CALLBACK_FORM_TITLE, CALLBACK_FORM_DESC } from '../lib/callbackFields';

export default function RequestCallBack() {
  return (
    <div className="min-h-screen bg-[#f8faf8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-[#074504] hover:text-[#599200] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Global standardized Request a Call Back Form container (identical to Contact Us page) */}
        <div className="bg-[#074504] text-white p-6 sm:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#599200] rounded-full blur-[100px] opacity-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C0991B] rounded-full blur-[100px] opacity-15 pointer-events-none" />
          
          <div className="relative z-10 bg-white text-gray-900 p-6 sm:p-8 rounded-[2rem] shadow-lg">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#074504]/10 rounded-full text-[#074504] mb-4">
              <Phone className="w-3.5 h-3.5 text-[#C0991B]" />
              <span className="text-[10px] font-black uppercase tracking-widest">Phone Callback Service</span>
            </div>

            <SmartLeadForm 
              type="Callback"
              title={CALLBACK_FORM_TITLE}
              description={CALLBACK_FORM_DESC}
              fields={CALLBACK_FORM_FIELDS}
              ctaText={CALLBACK_FORM_CTA}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
