import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Mail, Phone, RefreshCw, X, AlertCircle } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  email?: string;
  phone?: string;
  onVerified: () => void;
  onClose: () => void;
}

export default function VerificationModal({
  isOpen,
  email,
  phone,
  onVerified,
  onClose,
}: VerificationModalProps) {
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Trigger OTP sending when modal opens
  const sendOtps = async () => {
    if (!email && !phone) return;
    setSending(true);
    setError('');
    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to send verification codes.');
      }
    } catch (err: any) {
      setError(err.message || 'Error sending codes. Please check your network and try again.');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      sendOtps();
      setEmailCode('');
      setPhoneCode('');
      setError('');
      setSuccess(false);
    }
  }, [isOpen, email, phone]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setVerifying(true);

    if (email && !emailCode.trim()) {
      setError('Please enter the 6-digit email confirmation code.');
      setVerifying(false);
      return;
    }

    if (phone && !phoneCode.trim()) {
      setError('Please enter the 6-digit SMS verification code.');
      setVerifying(false);
      return;
    }

    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          emailCode: emailCode.trim(),
          phone,
          phoneCode: phoneCode.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Invalid verification details. Please try again.');
      }
      
      setSuccess(true);
      setTimeout(() => {
        onVerified();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please verify your entries.');
    } finally {
      setVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-[2.5rem] w-full max-w-lg p-8 md:p-10 shadow-2xl border border-gray-100 overflow-hidden relative"
        >
          {/* Header background accent */}
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#074504] to-[#C0991B]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {success ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 bg-[#074504]/10 rounded-full flex items-center justify-center mx-auto text-[#074504]">
                <ShieldCheck className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#074504] uppercase tracking-tight">Identity Verified!</h3>
                <p className="text-gray-500 font-medium text-sm">
                  Your email and phone have been successfully authenticated. Submitting your form now...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <span className="text-[#C0991B] font-extrabold text-[10px] uppercase tracking-[0.2em] block">
                  Security Integrity Verification
                </span>
                <h3 className="text-2xl font-black text-[#074504] uppercase tracking-tighter">
                  One Step Left
                </h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  We stand for valid outreach. Please verify the credentials entered to proceed with safe data processing.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 text-red-600 text-xs font-semibold leading-relaxed">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {sending ? (
                <div className="flex items-center justify-center gap-3 py-6 text-[#074504] font-bold text-sm">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Generating verification codes...</span>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Email verification field */}
                  {email && (
                    <div className="space-y-2 bg-[#074504]/5 border border-[#074504]/10 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-[#074504] font-black text-xs uppercase tracking-wider">
                        <Mail className="w-4 h-4 text-[#C0991B]" />
                        <span>Email Code Sent</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">
                        Verification code sent to <strong className="text-gray-700">{email}</strong>. Entering this code verifies ownership.
                      </p>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 123456"
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center tracking-[0.5em] text-lg font-black bg-white border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#074504] transition-all"
                      />
                    </div>
                  )}

                  {/* Phone verification field */}
                  {phone && (
                    <div className="space-y-2 bg-[#C0991B]/5 border border-[#C0991B]/20 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-[#074504] font-black text-xs uppercase tracking-wider">
                        <Phone className="w-4 h-4 text-[#074504]" />
                        <span>SMS OTP Code Sent</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">
                        OTP message sent to <strong className="text-gray-700">{phone}</strong>. Verify it to guarantee lead quality.
                      </p>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 654321"
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center tracking-[0.5em] text-lg font-black bg-white border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-[#074504] transition-all"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="submit"
                  disabled={sending || verifying}
                  className="w-full bg-[#074504] hover:bg-[#599200] disabled:bg-gray-200 text-white font-black uppercase text-xs tracking-widest py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {verifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>Verify & Confirm Submit</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={sendOtps}
                  disabled={sending || verifying}
                  className="text-xs text-[#074504] hover:text-[#599200] hover:underline flex items-center justify-center gap-1.5 font-bold transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend Verification Codes</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
