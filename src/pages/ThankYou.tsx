import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Download, Home, BookOpen, HeartHandshake, Loader2, RefreshCw } from 'lucide-react';

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(false);
  const [verifiedStatus, setVerifiedStatus] = useState<string>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const emailParam = searchParams.get('email');
  const tokenParam = searchParams.get('token');
  const isVerifiedParam = searchParams.get('verified') === 'true';
  const typeParam = searchParams.get('type') || 'checklist'; // 'newsletter', 'checklist', 'career', 'partnership', 'callback', 'sponsorship'

  // Run real-time background signature validation if email and token are provided via link
  useEffect(() => {
    if (emailParam && tokenParam) {
      setVerifying(true);
      setVerifiedStatus('verifying');
      
      fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailParam,
          emailCode: tokenParam
        })
      })
        .then(res => {
          if (!res.ok) throw new Error('Verification link has expired or is invalid.');
          return res.json();
        })
        .then(() => {
          setVerifiedStatus('success');
        })
        .catch(err => {
          console.error(err);
          setVerifiedStatus('error');
          setErrorMsg(err.message || 'Verification link failed.');
        })
        .finally(() => {
          setVerifying(false);
        });
    } else if (isVerifiedParam) {
      setVerifiedStatus('success');
    }
  }, [emailParam, tokenParam, isVerifiedParam]);

  // Dynamic PDF Download using direct client-side blob generation
  const handleDownloadFile = () => {
    try {
      const pdfText = `
NEEMA HEEP LENDING INTEGRITY
============================================================
THE ULTIMATE FUNDING-READY LOAN APPLICATION CHECKLIST & ROADMAP
============================================================
This certified checklist is distributed to pre-verified entries under Neema HEEP guidelines.

CORE DOCUMENTATION CHECKLIST:
1. IDENTIFICATION & COMPLIANCE
   [ ] Original national ID (both sides scanned clearly)
   [ ] Two passport-sized colored photographs
   [ ] PIN Certificate from Kenya Revenue Authority (KRA)
   [ ] Latest 3 months Utility Statement / Proof of Residence

2. CAPITAL & INCOME VERIFICATION
   [ ] Certified bank statements (Last 6 consecutive months)
   [ ] M-Pesa business statements (Till / Paybill statement where applicable)
   [ ] Verified income tax returns for the completed fiscal year
   [ ] Standard employee payslips (Latest 3 months, stamped by HR)

3. COLLATERAL & SECURITY
   [ ] Clean logbook files (Under direct ownership)
   [ ] Land title deed (Subject to official land registry search)
   [ ] Listed guarantees / Co-signer consent forms executed
   [ ] Chattel search approval certificates

4. BUSINESS INTENT & CREDIT
   [ ] Active business permit / trade license
   [ ] Certificate of Business Registration / Incorporation
   [ ] Business profile brief with a transparent capital schedule
   [ ] Signed credit disclosure and CRB authorization file

Thank you for your validated submission. Neema HEEP program advisors will contact you shortly.
Authorized by: Neema HEEP Program Committee
`;
      const blob = new Blob([pdfText], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Neema_HEEP_Bank_Ready_Checklist.txt');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download execution error: ', err);
    }
  };

  const renderContent = () => {
    if (verifiedStatus === 'verifying') {
      return (
        <div className="text-center py-12 space-y-4">
          <Loader2 className="w-16 h-16 text-[#074504] animate-spin mx-auto animate-pulse" />
          <h2 className="text-xl font-bold text-[#074504] uppercase tracking-tight">Authenticating Verification Link...</h2>
          <p className="text-xs text-gray-400 font-medium font-mono">Comparing cryptographic state token in DB...</p>
        </div>
      );
    }

    if (verifiedStatus === 'error') {
      return (
        <div className="text-center py-8 space-y-6">
          <div className="w-16 h-16 bg-red-100/80 rounded-full flex items-center justify-center mx-auto text-red-600">
            <RefreshCw className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-red-600 uppercase tracking-tight">Verification Expired</h2>
            <p className="text-gray-500 text-sm font-semibold max-w-md mx-auto leading-relaxed">
              {errorMsg || "The verification link is expired, invalid, or has already been consumed. Please request a new verification code."}
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Link to="/checklists" className="bg-[#074504] hover:bg-[#599200] text-white font-black uppercase text-[10px] tracking-widest px-6 py-3 rounded-xl transition-all">
              Try Checklists Page
            </Link>
            <Link to="/" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold uppercase text-[10px] tracking-widest px-6 py-3 rounded-xl transition-all">
              Back to Home
            </Link>
          </div>
        </div>
      );
    }

    // Default: Success (success verified or verifiedParam is true)
    return (
      <div className="space-y-8 py-4">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-[#074504]/10 text-[#074504] rounded-full flex items-center justify-center mx-auto scale-105">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          
          <div className="space-y-1">
            <span className="bg-[#599200]/20 text-[#074504] border border-[#599200]/10 text-[9px] font-black uppercase tracking-[0.25em] px-4 py-1 rounded-full">
              Authentication Success
            </span>
            <h2 className="text-3xl font-black text-[#074504] uppercase tracking-tighter pt-3">
              Data Verified!
            </h2>
            <p className="text-gray-500 font-medium text-sm max-w-lg mx-auto">
              Your email address <strong className="text-gray-700 font-bold">{emailParam || "provided"}</strong> has been confirmed as authenticated and added to our clean list.
            </p>
          </div>
        </div>

        {/* Lead Magnet / Guide Download Card */}
        {typeParam === 'checklist' && (
          <div className="bg-[#074504]/5 border border-[#074504]/10 rounded-[2rem] p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 max-w-2xl mx-auto">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C0991B]/5 rounded-full blur-[60px]" />
            <div className="relative z-10 space-y-2 text-center md:text-left">
              <span className="bg-[#C0991B] text-[#074504] text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                Lead Magnet Download Ready
              </span>
              <h3 className="text-xl font-black text-[#074504] uppercase tracking-tight pt-1">
                The Ultimate 'Funding-Ready' Checklist
              </h3>
              <p className="text-xs text-gray-500 font-semibold max-w-sm">
                Get immediate access to the critical structural checklist that minimizes loan application rejection.
              </p>
            </div>
            <button
              onClick={handleDownloadFile}
              className="bg-[#C0991B] hover:bg-[#A38217] text-[#074504] text-[10px] font-black uppercase tracking-widest px-8 py-5 rounded-2xl shadow-xl transition-all hover:scale-105 shrink-0 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download guide</span>
            </button>
          </div>
        )}

        {typeParam === 'newsletter' && (
          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-[2rem] p-8 text-center max-w-md mx-auto space-y-4">
            <h3 className="text-lg font-black text-[#074504] uppercase tracking-tight">Welcome to the Newsletter!</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              We have officially queued your email to receive authorized Neema HEEP updates, economic grants notices, and transparency audit reports directly.
            </p>
          </div>
        )}

        {typeParam !== 'checklist' && typeParam !== 'newsletter' && (
          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-[2rem] p-8 text-center max-w-md mx-auto space-y-4">
            <h3 className="text-lg font-black text-[#074504] uppercase tracking-tight">Form Successfully Processed</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Your details are verified. The Neema HEEP program validation committee will review your submission and connect with you shortly.
            </p>
          </div>
        )}

        {/* Other Website Action Paths */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-4 border-t border-gray-100">
          <Link 
            to="/" 
            className="bg-white hover:bg-gray-50 border border-gray-100 text-[#074504] text-[10px] font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-center"
          >
            <Home className="w-4 h-4 text-gray-400" />
            <span>Go to Home</span>
          </Link>

          <Link 
            to="/loans" 
            className="bg-white hover:bg-gray-50 border border-gray-100 text-[#074504] text-[10px] font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-center"
          >
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span>Borrowing limits</span>
          </Link>

          <Link 
            to="/sponsorship" 
            className="bg-white hover:bg-gray-50 border border-gray-100 text-[#074504] text-[10px] font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-center"
          >
            <HeartHandshake className="w-4 h-4 text-gray-400" />
            <span>Get support</span>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <main className="flex-grow pt-28 pb-28 bg-[#f8faf8] flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-100 rounded-[3rem] p-10 md:p-14 shadow-xl"
        >
          {renderContent()}
        </motion.div>
      </div>
    </main>
  );
}
