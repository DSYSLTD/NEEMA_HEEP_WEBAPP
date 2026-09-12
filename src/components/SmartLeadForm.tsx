import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Mail, Phone, User, ChevronRight, Smartphone } from 'lucide-react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useLeads } from '../hooks/useLeads';
import { getUserData, saveUserData } from '../lib/userData';
import { leadService } from '../services/leadService';
import { trackStepDrop, trackEvent } from '../services/trackingService';
import CaptchaField from './CaptchaField';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string;
  validation?: (val: string) => boolean;
}

interface SmartLeadFormProps {
  type: 'Registration' | 'Pre-Qualification' | 'Contact' | 'Resource' | 'Career' | 'Partnership' | 'Callback' | 'Volunteer';
  title: string;
  description?: string;
  fields: Field[];
  ctaText: string;
  successMessage?: string;
  onSuccess?: () => void;
  trustSignals?: React.ReactNode;
  center?: boolean;
}

export default function SmartLeadForm({ 
  type, 
  title, 
  description, 
  fields, 
  ctaText, 
  successMessage = "Thank you! We've received your request and a confirmation email has been sent.",
  onSuccess,
  trustSignals,
  center = false
}: SmartLeadFormProps) {
  const { submitLead } = useLeads();
  const [currentStep, setCurrentStep] = useState(0);
  const [consent, setConsent] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // Pre-filled Lead Form & Partial Input Capture from URL params & sessionStorage
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const savedData = getUserData();
    let draftData: Record<string, string> = {};

    if (typeof window !== 'undefined') {
      try {
        const storedDraft = sessionStorage.getItem(`neema_draft_${type}`);
        if (storedDraft) draftData = JSON.parse(storedDraft);
      } catch (e) {
        console.warn(e);
      }

      // Read URL Parameters for Retargeting Pre-Fill
      const params = new URLSearchParams(window.location.search);
      if (params.get('name')) draftData['name'] = params.get('name')!;
      if (params.get('fullName')) draftData['fullName'] = params.get('fullName')!;
      if (params.get('email')) draftData['email'] = params.get('email')!;
      if (params.get('phone')) draftData['phone'] = params.get('phone')!;
      if (params.get('amount')) draftData['amount'] = params.get('amount')!;
      if (params.get('jobTitle')) draftData['jobTitle'] = params.get('jobTitle')!;
    }

    const defaults: Record<string, string> = {
      name: draftData.name || savedData.name || '',
      fullName: draftData.fullName || savedData.name || '',
      email: draftData.email || savedData.email || '',
      phone: draftData.phone || savedData.phone || '',
      phoneNumber: draftData.phoneNumber || savedData.phone || '',
      consentGiven: 'false',
      signupSource: typeof window !== 'undefined' ? window.location.href : 'unknown',
      ...draftData
    };
    
    fields.forEach(f => {
      if (f.defaultValue && !defaults[f.name]) {
        defaults[f.name] = f.defaultValue;
      }
    });
    return defaults;
  });

  // Save inputs to sessionStorage as user types
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(`neema_draft_${type}`, JSON.stringify(formData));
    } catch (e) {
      console.warn('Failed to write partial input draft:', e);
    }

    const dataToSave: any = {};
    if (formData.name || formData.fullName) dataToSave.name = formData.name || formData.fullName;
    if (formData.email) dataToSave.email = formData.email;
    if (formData.phone || formData.phoneNumber) dataToSave.phone = formData.phone || formData.phoneNumber;
    
    if (Object.keys(dataToSave).length > 0) {
      saveUserData(dataToSave);
    }
  }, [formData, type]);

  const [stepValid, setStepValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Verification State
  const [verificationMode, setVerificationMode] = useState<'none' | 'phone' | 'email'>('none');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [vCode, setVCode] = useState('');
  const [vEmailCode, setVEmailCode] = useState('');

  // Group fields into steps (max 2 per step for mobile)
  const steps: Field[][] = [];
  for (let i = 0; i < fields.length; i += 2) {
    steps.push(fields.slice(i, i + 2));
  }

  const validateField = (name: string, value: string, field: Field) => {
    let error = '';
    if (field.required && !value) error = 'This field is required';
    else if (field.type === 'email' && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) error = 'Invalid email address';
    else if (field.type === 'tel') {
      const phoneNumber = parsePhoneNumberFromString(value, 'KE');
      if (!phoneNumber || !phoneNumber.isValid()) {
        error = 'Invalid phone number. Use format 07XXXXXXXX or +254XXXXXXXXX';
      }
    }
    else if (field.validation && !field.validation(value)) error = 'Invalid input';

    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  useEffect(() => {
    if (verificationMode !== 'none') return;
    const currentFields = steps[currentStep] || [];
    const isStepFieldsValid = currentFields.every(f => {
      const val = formData[f.name] || '';
      if (!f.required && !val) return true;
      if (f.required && !val) return false;
      return !errors[f.name];
    });

    if (currentStep === steps.length - 1) {
      setStepValid(isStepFieldsValid && consent && captchaVerified);
    } else {
      setStepValid(isStepFieldsValid);
    }
  }, [formData, currentStep, errors, verificationMode, consent, captchaVerified]);

  const getPhoneValue = () => {
    return formData.phone || formData.mobile || formData.phoneNumber || formData['mobileNumber'] || '';
  };

  const getEmailValue = () => {
    return formData.email || formData.emailAddress || '';
  };

  const handleSendPhoneOtp = async () => {
    const rawPhone = getPhoneValue();
    const parsed = parsePhoneNumberFromString(rawPhone, 'KE');
    const formattedPhone = parsed ? parsed.format('E.164') : rawPhone;

    setSendingVerification(true);
    setErrors(prev => ({ ...prev, phone: '' }));
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone })
      });
      if (!res.ok) throw new Error('Could not send SMS code.');
      setVerificationMode('phone');
    } catch (err: any) {
      setErrors(prev => ({ ...prev, phone: err.message || 'SMS Dispatch Error' }));
    } finally {
      setSendingVerification(false);
    }
  };

  const handleSendEmailOtp = async () => {
    const rawEmail = getEmailValue();
    setSendingVerification(true);
    setErrors(prev => ({ ...prev, email: '' }));
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: rawEmail })
      });
      if (!res.ok) throw new Error('Could not send email validation.');
      setVerificationMode('email');
    } catch (err: any) {
      setErrors(prev => ({ ...prev, email: err.message || 'Email Dispatch Error' }));
    } finally {
      setSendingVerification(false);
    }
  };

  const handleNext = async () => {
    const currentFields = steps[currentStep];
    const hasPhoneField = currentFields.find(f => f.type === 'tel');

    // Real-time API Sync immediately after Step 1 completion
    if (currentStep === 0) {
      leadService.syncPartialLead({
        name: formData['name'] || formData['fullName'],
        email: getEmailValue(),
        phone: getPhoneValue(),
        type,
        step: 1
      });
    }

    trackStepDrop(type, currentStep, `Step ${currentStep + 1}`);

    if (hasPhoneField && !phoneVerified) {
      await handleSendPhoneOtp();
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const emailVal = getEmailValue();
      if (emailVal && !emailVerified) {
        await handleSendEmailOtp();
      } else {
        handleSubmit();
      }
    }
  };

  const handleVerifyPhone = async () => {
    const rawPhone = getPhoneValue();
    const parsed = parsePhoneNumberFromString(rawPhone, 'KE');
    const formattedPhone = parsed ? parsed.format('E.164') : rawPhone;

    setSendingVerification(true);
    setErrors(prev => ({ ...prev, vCode: '' }));
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone, phoneCode: vCode })
      });
      if (!res.ok) throw new Error('Code incorrect or expired.');
      
      setPhoneVerified(true);
      setVerificationMode('none');
      setVCode('');

      if (currentStep === steps.length - 1) {
        const emailVal = getEmailValue();
        if (emailVal && !emailVerified) {
          await handleSendEmailOtp();
        } else {
          handleSubmit();
        }
      } else {
        setCurrentStep(currentStep + 1);
      }
    } catch (err: any) {
      setErrors(prev => ({ ...prev, vCode: err.message || 'Verification Failed.' }));
    } finally {
      setSendingVerification(false);
    }
  };

  const handleVerifyEmail = async () => {
    const rawEmail = getEmailValue();
    setSendingVerification(true);
    setErrors(prev => ({ ...prev, vEmailCode: '' }));
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: rawEmail, emailCode: vEmailCode })
      });
      if (!res.ok) throw new Error('Verification Code incorrect or expired.');

      setEmailVerified(true);
      setVerificationMode('none');
      setVEmailCode('');
      handleSubmit();
    } catch (err: any) {
      setErrors(prev => ({ ...prev, vEmailCode: err.message || 'Verification Failed.' }));
    } finally {
      setSendingVerification(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    
    const updatedDetails = { ...formData };
    fields.forEach(field => {
      if (field.type === 'tel' && updatedDetails[field.name]) {
        const val = updatedDetails[field.name];
        const parsed = parsePhoneNumberFromString(val, 'KE');
        if (parsed) {
          updatedDetails[field.name] = parsed.format('E.164');
        }
      }
    });

    const phoneVal = updatedDetails['phone'] || updatedDetails['phoneNumber'] || updatedDetails['mobile'] || '';
    const phoneNumber = parsePhoneNumberFromString(phoneVal, 'KE');
    const formattedPhone = phoneNumber ? phoneNumber.format('E.164') : phoneVal;

    const pageSource = typeof window !== 'undefined' ? `${title || type} Form on ${window.location.pathname}` : `${type} Form`;

    submitLead({
      type,
      name: formData['name'] || formData['fullName'] || 'Anonymous',
      email: formData['email'] || '',
      phone: formattedPhone,
      consentGiven: "Yes",
      signupSource: pageSource,
      details: {
        ...updatedDetails,
        consentGiven: "Yes",
        signupSource: pageSource,
        userAgent: navigator.userAgent
      }
    });

    // Clear draft upon successful submission
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`neema_draft_${type}`);
    }

    const finalName = formData['name'] || formData['fullName'];
    const finalEmail = formData['email'];
    const finalPhone = formattedPhone;
    
    saveUserData({
      name: finalName,
      email: finalEmail,
      phone: finalPhone
    });

    trackEvent('lead_form_submitted', { type, email: finalEmail });

    setIsSubmitting(false);
    setIsSuccess(true);
    if (onSuccess) onSuccess();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'tel': return <Phone className="w-4 h-4" />;
      case 'text': return <User className="w-4 h-4" />;
      default: return null;
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-[#599200]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#599200]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-[#074504] mb-4 uppercase tracking-tighter">Verified & Submitted!</h2>
        <p className="text-gray-600 font-medium leading-relaxed mb-8 max-w-sm mx-auto">
          {successMessage}
        </p>
        <div className="flex flex-col gap-4">
          <div className="bg-[#F4F7F6] p-4 rounded-xl text-xs font-bold text-[#074504] flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[#C0991B]" />
            Your request has been encrypted & verified.
          </div>
        </div>
      </motion.div>
    );
  }

  if (verificationMode === 'phone') {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8 py-6"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-[#074504]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#074504]">
            <Smartphone className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#074504] uppercase tracking-tighter mb-2">Verify Your Phone</h2>
          <p className="text-gray-500 font-medium text-sm">We've sent a code to <span className="text-[#074504] font-bold">{formData.phone || formData.phoneNumber}</span></p>
        </div>

        <div className="space-y-4">
          <input 
            type="text"
            maxLength={6}
            value={vCode}
            onChange={e => setVCode(e.target.value)}
            placeholder="• • • • • •"
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl py-6 text-center text-4xl font-black tracking-[0.3em] focus:border-[#599200] focus:bg-white outline-none transition-all"
          />
          {errors.vCode && <p className="text-center text-xs font-black text-red-500 uppercase tracking-widest">{errors.vCode}</p>}
        </div>

        <button 
          onClick={handleVerifyPhone}
          disabled={vCode.length !== 6 || sendingVerification}
          className="w-full py-5 rounded-2xl bg-[#074504] text-white font-black uppercase text-xs tracking-widest shadow-xl disabled:opacity-50"
        >
          {sendingVerification ? 'Verifying...' : 'Verify Phone Number'}
        </button>
      </motion.div>
    );
  }

  if (verificationMode === 'email') {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 py-6"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-[#C0991B]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#C0991B]">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#074504] uppercase tracking-tighter mb-2">Confirm Your Email</h2>
          <p className="text-gray-500 font-medium text-sm">We've sent a 6-digit confirmation code to <br/><span className="text-[#074504] font-bold">{formData.email}</span></p>
        </div>

        <div className="space-y-4">
          <input 
            type="text"
            placeholder="Enter 6-digit code"
            maxLength={6}
            value={vEmailCode}
            onChange={e => setVEmailCode(e.target.value)}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl py-4 text-center text-xl font-black tracking-widest focus:border-[#C0991B] focus:bg-white outline-none transition-all"
          />
          {errors.vEmailCode && <p className="text-center text-xs font-black text-red-500 uppercase tracking-widest">{errors.vEmailCode}</p>}
        </div>

        <button 
          onClick={handleVerifyEmail}
          disabled={vEmailCode.length !== 6 || sendingVerification}
          className="w-full py-5 rounded-2xl bg-[#C0991B] text-[#074504] font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {sendingVerification ? 'Verifying...' : 'Submit Verification Code'} <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <div className={`mb-8 ${center ? 'text-center' : ''}`}>
        <h2 className="text-3xl font-black text-[#074504] mb-2 uppercase tracking-tighter leading-tight">{title}</h2>
        {description && <p className="text-gray-500 font-medium">{description}</p>}
      </div>

      {steps.length > 1 && (
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-[#599200]' : 'bg-gray-100'}`}
            />
          ))}
        </div>
      )}

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            {steps[currentStep].map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                  {field.label} {field.required && <span className="text-red-400">*</span>}
                </label>
                <div className="relative group">
                  <div className={`absolute left-5 top-[1.125rem] transition-colors duration-300 ${errors[field.name] ? 'text-red-400' : formData[field.name] ? 'text-[#599200]' : 'text-gray-400'}`}>
                    {getIcon(field.type)}
                  </div>
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, [field.name]: e.target.value });
                        validateField(field.name, e.target.value, field);
                      }}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-[#C0991B] focus:bg-white transition-all font-bold appearance-none"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, [field.name]: e.target.value });
                        validateField(field.name, e.target.value, field);
                      }}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-[#C0991B] focus:bg-white transition-all font-bold resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, [field.name]: e.target.value });
                        validateField(field.name, e.target.value, field);
                      }}
                      placeholder={field.placeholder}
                      data-private={/password|pin|id_?num|national_?id|bank_?acc/i.test(field.name) ? "true" : undefined}
                      data-mask={/password|pin|id_?num|national_?id|bank_?acc/i.test(field.name) ? "true" : undefined}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-[#C0991B] focus:bg-white transition-all font-bold"
                    />
                  )}
                  
                  {formData[field.name] && !errors[field.name] && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#599200]">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  {errors[field.name] && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-red-400">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
                {errors[field.name] && (
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider ml-1">{errors[field.name]}</p>
                )}
              </div>
            ))}

            {currentStep === steps.length - 1 && (
              <div className="space-y-4 pt-2">
                <CaptchaField onVerified={setCaptchaVerified} />

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-1">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={consent}
                      onChange={e => setConsent(e.target.checked)}
                    />
                    <div className="w-5 h-5 border-2 border-gray-200 rounded-md bg-white peer-checked:bg-[#599200] peer-checked:border-[#599200] transition-all duration-200" />
                    <CheckCircle2 className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-tight">
                    I agree to the <a href="/terms-conditions" target="_blank" className="text-[#074504] underline hover:text-[#599200]">Terms of Service</a> and <a href="/privacy-policy" target="_blank" className="text-[#074504] underline hover:text-[#599200]">Privacy Policy</a>, and consent to be contacted regarding my inquiry.
                  </span>
                </label>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="space-y-4">
          <button
            onClick={handleNext}
            disabled={!stepValid || isSubmitting}
            className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 ${
              stepValid && !isSubmitting 
              ? 'bg-[#074504] text-white hover:bg-[#599200] hover:scale-[1.02]' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                {currentStep === steps.length - 1 ? ctaText : 'Next Step'}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <div className="pt-8 border-t border-gray-50">
          <div className="flex items-center gap-4 text-gray-400 mb-4">
            <ShieldCheck className="w-5 h-5 text-[#C0991B]" />
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Your data is encrypted. We never share your personal information with third parties.
            </p>
          </div>
          {trustSignals}
        </div>
      </div>
    </div>
  );
}
