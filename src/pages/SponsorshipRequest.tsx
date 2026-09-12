import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ArrowLeft, CheckCircle2, BookOpen, 
  FileText, UploadCloud, Check, User, Info, AlertCircle, FileCheck2, Gift, Send, GraduationCap
} from 'lucide-react';
import { leadService } from '../services/leadService';
import VerificationModal from '../components/VerificationModal';

const SCHOLARSHIP_PROGRAM = {
  id: 'education',
  name: 'Arise & Shine Education Support',
  kind: 'Arise & Shine Junior/Senior School Scholarship (grades 10 to 12)',
  description: 'Empowering children and youth through school fees support, mentorship, and junior/senior school scholarships for grades 10 to 12.'
};

const QUANTIFIED_SUPPORT_OPTIONS = [
  'Full Secondary School Tuition & Boarding Fees (Grades 10 - 12)',
  'Partial Tuition & School Fee Balance Support',
  'School Uniforms, Textbooks & Learning Materials Package',
  'National Exam & Secondary Assessment Fees Support',
  'Special Educational Needs & Learning Disability Support',
  'Boarding & Student Maintenance Allowance',
  'Other Educational Support Needed'
];

import { COUNTY_DATA, COUNTIES_LIST, NEEMA_SERVED_COUNTIES } from '../lib/countyData';

export default function SponsorshipRequest() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    // Step 1
    programStream: SCHOLARSHIP_PROGRAM.name,
    sponsorshipKind: SCHOLARSHIP_PROGRAM.kind,
    requestedSupport: QUANTIFIED_SUPPORT_OPTIONS[0],
    
    // Step 2
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    county: '',
    subCounty: '',
    ward: '',
    socialStatus: 'Single Mother',
    
    // Step 3
    justification: '',
    uploadedFiles: [] as { name: string; size: string; type: string }[],
    
    // Step 4
    consentApproved: false,
    signatureName: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'phone') {
      // Allow only numerical digits, +, and spaces/dashes that we'll clean up
      finalValue = value.replace(/[^\d+\-\s]/g, '');
    }
    setForm(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handlePhoneBlur = () => {
    setForm(prev => {
      let raw = prev.phone.trim().replace(/[\s\-]/g, '');
      if (raw.startsWith('0')) {
        raw = '+254' + raw.slice(1);
      } else if (raw.startsWith('254') && !raw.startsWith('+')) {
        raw = '+' + raw;
      } else if (/^[17]\d{8}$/.test(raw)) {
        raw = '+254' + raw;
      } else if (raw && !raw.startsWith('+')) {
        // Fallback guess country code prefix if it is 9 digits and doesn't have country code
        if (raw.length === 9) {
          raw = '+254' + raw;
        } else {
          raw = '+' + raw;
        }
      }
      return { ...prev, phone: raw };
    });
  };

  // Capture file uploads (mock behavior)
  const handleMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: (f.size / 1024).toFixed(1) + ' KB',
        type: f.type || 'Document'
      }));
      setForm(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setForm(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
    }));
  };

  // Validate current step
  const validateStep = (step: number) => {
    const stepErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!form.requestedSupport || !form.requestedSupport.trim()) {
        stepErrors.requestedSupport = 'Please select the specific support desired.';
      }
    }
    
    if (step === 2) {
      if (!form.fullName.trim()) stepErrors.fullName = 'Full Name is required.';
      if (!form.email.trim()) {
        stepErrors.email = 'Email Address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        stepErrors.email = 'Please enter a valid email address.';
      }
      
      // Strict standard E.164 format validator (starts with +, followed by country code and digits, no symbols/spaces, 7-15 digits total)
      const e164Regex = /^\+[1-9]\d{6,14}$/;
      if (!form.phone.trim()) {
        stepErrors.phone = 'Phone Number is required.';
      } else if (!e164Regex.test(form.phone.replace(/[\s\-]/g, ''))) {
        stepErrors.phone = 'Phone number must be in standard E.164 international format starting with + and country code (e.g., +254712345678).';
      }

      if (!form.idNumber.trim()) {
        stepErrors.idNumber = 'National ID or Birth Cert number is required.';
      }
      if (!form.county.trim()) {
        stepErrors.county = 'County of residence is required.';
      }
      if (!form.subCounty.trim()) {
        stepErrors.subCounty = 'Sub-county is required.';
      }
      if (!form.ward.trim()) {
        stepErrors.ward = 'Ward location is required.';
      }
    }

    if (step === 3) {
      if (!form.justification.trim() || form.justification.length < 30) {
        stepErrors.justification = 'Please provide a justification explaining your social case (minimum 30 characters).';
      }
    }

    if (step === 4) {
      if (!form.consentApproved) {
        stepErrors.consentApproved = 'You must give consent to process your private evaluation data.';
      }
      if (!form.signatureName.trim()) {
        stepErrors.signatureName = 'A written signature name is required.';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    setIsVerifying(true);
  };

  const handleVerifiedSubmit = async () => {
    setIsVerifying(false);
    setIsSubmitting(true);
    
    try {
      const payload = {
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        type: 'Sponsorship' as const,
        consentGiven: form.consentApproved,
        signupSource: typeof window !== 'undefined' ? `Sponsorship Application Page (${window.location.pathname})` : 'Sponsorship Portal',
        details: {
          programStream: SCHOLARSHIP_PROGRAM.name,
          sponsorshipKind: form.sponsorshipKind,
          requestedSupport: form.requestedSupport,
          idNumber: form.idNumber,
          county: form.county,
          ward: form.ward,
          socialStatus: form.socialStatus,
          justification: form.justification,
          signature: form.signatureName,
          uploadedFilesCount: form.uploadedFiles.length,
          applicationStatus: 'Pending', // default sponsorship sub-status
          evaluationDate: null,
          decisionNotes: ''
        }
      };

      const result = await leadService.submitLead(payload);
      setSubmissionId(result.id || 'SP-' + Date.now());
      setIsCompleted(true);
    } catch (err) {
      console.error(err);
      setErrors({ global: 'Failed to process application. Please check network and configurations.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow bg-[#f8faf8] pb-24 font-sans">
      {/* Visual Identity Hero */}
      <section className="bg-[#074504] text-white py-20 lg:py-24 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-20%] left-[-10%] w-[350px] h-[350px] bg-[#C0991B] rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] bg-[#599200] rounded-full blur-[130px]" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-6"
          >
            <GraduationCap className="w-4 h-4 text-[#C0991B]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C0991B]">Arise & Shine Education Support</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-6 tracking-tight uppercase"
          >
            Scholarship <span className="text-[#C0991B]">Application Portal</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-gray-200 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Empowering children and youth through school fees support, mentorship, and junior/senior school scholarships for grades 10 to 12.
          </motion.p>
        </div>
      </section>

      {/* Main interactive form card */}
      <div className="max-w-3xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(7,69,4,0.06)] border border-gray-100 overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!isCompleted ? (
              <motion.div 
                key="form-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Horizontal Progress bar indicator */}
                <div className="bg-gray-50 border-b border-gray-50 p-8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-[#074504]/10 text-[#074504] font-black text-xs flex items-center justify-center">
                      {currentStep}
                    </span>
                    <div>
                      <h3 className="text-xs font-black text-[#074504] uppercase tracking-wider">Step {currentStep} of 4</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                        {currentStep === 1 && 'Scholarship Selection'}
                        {currentStep === 2 && 'Applicant Profile'}
                        {currentStep === 3 && 'Case Justification'}
                        {currentStep === 4 && 'Consent & Submission'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map(s => (
                      <div 
                        key={s} 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          s === currentStep ? 'w-8 bg-[#074504]' : s < currentStep ? 'w-3 bg-[#599200]' : 'w-2 bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                  {/* STEP 1: Scholarship Selection */}
                  {currentStep === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <h3 className="text-lg font-extrabold text-[#074504] uppercase tracking-tight">1. Scholarship Program Selection</h3>
                        <p className="text-xs text-gray-500 font-medium">Application for the Arise & Shine Junior/Senior School Scholarship (Grades 10 to 12).</p>
                      </div>

                      {/* Single Featured Scholarship Banner */}
                      <div className="bg-gradient-to-br from-[#074504]/5 via-white to-emerald-50/40 border-2 border-[#074504] rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 bg-[#074504] text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                            <BookOpen className="w-6 h-6 text-[#C0991B]" />
                          </div>
                          <div className="space-y-1">
                            <span className="bg-[#074504] text-[#C0991B] text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full inline-block">
                              Active Scholarship Program
                            </span>
                            <h4 className="text-base font-black uppercase text-[#074504] tracking-tight">
                              Arise & Shine Junior/Senior School Scholarship (grades 10 to 12)
                            </h4>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed border-t border-emerald-100/80 pt-3">
                          Empowering children and youth through school fees support, mentorship, and junior/senior school scholarships (grades 10 to 12). Sponsoring qualified secondary school students facing financial hardship for uninterrupted learning.
                        </p>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-[#074504] uppercase tracking-widest block mb-1.5">Specific Quantified Support Desired</label>
                          <select 
                            name="requestedSupport"
                            value={form.requestedSupport}
                            onChange={handleTextChange}
                            className={`w-full bg-white border rounded-xl px-4 py-3.5 text-xs font-bold text-[#074504] focus:ring-2 focus:ring-[#C0991B] outline-none cursor-pointer ${
                              errors.requestedSupport ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'
                            }`}
                          >
                            {QUANTIFIED_SUPPORT_OPTIONS.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                          {errors.requestedSupport && (
                            <p className="text-red-500 font-bold text-[9px] uppercase tracking-wider mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> {errors.requestedSupport}
                            </p>
                          )}
                          <p className="text-[9px] text-gray-400 font-bold mt-2 uppercase tracking-wider">Select the primary category of financial or material support required for the student.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: General Lead Capture & Personal Data */}
                  {currentStep === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <h3 className="text-lg font-extrabold text-[#074504] uppercase tracking-tight">2. Applicant Profile</h3>
                        <p className="text-xs text-gray-500 font-medium">Please supply your valid identification info. This doubles as a lead record so we can contact you.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Full Applicant Name</label>
                          <input 
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleTextChange}
                            placeholder="e.g. Mary Wanjiku Njuguna"
                            className={`w-full border rounded-xl px-4 py-3 text-xs font-bold text-[#074504] focus:ring-2 focus:ring-[#C0991B] outline-none ${
                              errors.fullName ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'
                            }`}
                          />
                          {errors.fullName && <p className="text-red-500 font-bold text-[9px] uppercase tracking-wider mt-1">{errors.fullName}</p>}
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">National ID / Birth Cert No.</label>
                          <input 
                            type="text"
                            name="idNumber"
                            value={form.idNumber}
                            onChange={handleTextChange}
                            placeholder="e.g. 28359482"
                            className={`w-full border rounded-xl px-4 py-3 text-xs font-bold text-[#074504] focus:ring-2 focus:ring-[#C0991B] outline-none ${
                              errors.idNumber ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'
                            }`}
                          />
                          {errors.idNumber && <p className="text-red-500 font-bold text-[9px] uppercase tracking-wider mt-1">{errors.idNumber}</p>}
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Phone Number (M-Pesa Preferred - E.164 standard)</label>
                          <input 
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleTextChange}
                            onBlur={handlePhoneBlur}
                            placeholder="e.g. +254712345678"
                            className={`w-full border rounded-xl px-4 py-3 text-xs font-bold text-[#074504] focus:ring-2 focus:ring-[#C0991B] outline-none ${
                              errors.phone ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'
                            }`}
                          />
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">Auto-formats local numbers to +254 structure on exit.</p>
                          {errors.phone && <p className="text-red-500 font-bold text-[9px] uppercase tracking-wider mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Email Address</label>
                          <input 
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleTextChange}
                            placeholder="mary@yourdomain.com"
                            className={`w-full border rounded-xl px-4 py-3 text-xs font-bold text-[#074504] focus:ring-2 focus:ring-[#C0991B] outline-none ${
                              errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'
                            }`}
                          />
                          {errors.email && <p className="text-red-500 font-bold text-[9px] uppercase tracking-wider mt-1">{errors.email}</p>}
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">County of Residence</label>
                          <select 
                            name="county"
                            value={form.county}
                            onChange={(e) => {
                              const val = e.target.value;
                              setForm(prev => ({ ...prev, county: val, subCounty: '', ward: '' }));
                              if (errors.county) setErrors(prev => { const c = {...prev}; delete c.county; return c; });
                              if (errors.subCounty) setErrors(prev => { const c = {...prev}; delete c.subCounty; return c; });
                              if (errors.ward) setErrors(prev => { const c = {...prev}; delete c.ward; return c; });
                            }}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-[#074504] focus:ring-2 focus:ring-[#C0991B] bg-white outline-none"
                          >
                            <option value="">Select County</option>
                            {COUNTIES_LIST.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          {errors.county && <p className="text-red-500 font-bold text-[9px] uppercase tracking-wider mt-1">{errors.county}</p>}
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Sub-county (Constituency)</label>
                          {form.county ? (
                            <select
                              name="subCounty"
                              value={form.subCounty || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setForm(prev => ({ ...prev, subCounty: val, ward: '' }));
                                if (errors.subCounty) setErrors(prev => { const c = {...prev}; delete c.subCounty; return c; });
                                if (errors.ward) setErrors(prev => { const c = {...prev}; delete c.ward; return c; });
                              }}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-[#074504] focus:ring-2 focus:ring-[#C0991B] bg-white outline-none"
                            >
                              <option value="">Select Sub-county</option>
                              {COUNTY_DATA[form.county].subCounties.map(sc => (
                                <option key={sc} value={sc}>{sc}</option>
                              ))}
                              <option value="Other">Other</option>
                            </select>
                          ) : (
                            <select disabled className="w-full border border-gray-200 bg-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-400 cursor-not-allowed outline-none">
                              <option value="">Select County First</option>
                            </select>
                          )}
                          {errors.subCounty && <p className="text-red-500 font-bold text-[9px] uppercase tracking-wider mt-1">{errors.subCounty}</p>}
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Ward Location</label>
                          {form.county && form.subCounty ? (
                            <select
                              name="ward"
                              value={form.ward}
                              onChange={handleTextChange}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-[#074504] focus:ring-2 focus:ring-[#C0991B] bg-white outline-none"
                            >
                              <option value="">Select Ward</option>
                              {COUNTY_DATA[form.county].wards[form.subCounty].map(w => (
                                <option key={w} value={w}>{w}</option>
                              ))}
                              <option value="Other">Other</option>
                            </select>
                          ) : (
                            <select disabled className="w-full border border-gray-200 bg-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-400 cursor-not-allowed outline-none">
                              <option value="">Select Sub-county First</option>
                            </select>
                          )}
                          {errors.ward && <p className="text-red-500 font-bold text-[9px] uppercase tracking-wider mt-1">{errors.ward}</p>}
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Your Social-Economic Category</label>
                          <select 
                            name="socialStatus"
                            value={form.socialStatus}
                            onChange={handleTextChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-[#074504] focus:ring-2 focus:ring-[#C0991B] bg-white outline-none"
                          >
                            <option value="Single Mother">Single Mother & Head of Household</option>
                            <option value="Unemployed Youth">Unemployed and Looking for Technical Work</option>
                            <option value="Parent with Fee Arrears">Parent supporting multiple dependents with school fee arrears</option>
                            <option value="Small Business Owner">Small SME Business Owner / Agro-dealer in need of machinery</option>
                            <option value="Farming Household">Farming family with critical WASH need</option>
                            <option value="Orphan / Guardian support">Orphan / Guardian support group</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Case Justification & Digital Attestation */}
                  {currentStep === 3 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <h3 className="text-lg font-extrabold text-[#074504] uppercase tracking-tight">3. Case Justification</h3>
                        <p className="text-xs text-gray-500 font-medium">Explain your economic situation in detail to aid our review panel.</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Social Case Narrative Statement</label>
                          <textarea 
                            name="justification"
                            value={form.justification}
                            onChange={handleTextChange}
                            placeholder="Describe how long you have faced this social/financial situation, how many assets or dependents you support, and how this specific Neema HEEP program intervention will act as a launchpad for your household..."
                            className={`w-full border rounded-xl p-4 text-xs font-bold text-[#074504] h-36 focus:ring-2 focus:ring-[#C0991B] outline-none ${
                              errors.justification ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'
                            }`}
                          />
                          {errors.justification && <p className="text-red-500 font-bold text-[9px] uppercase tracking-wider mt-1">{errors.justification}</p>}
                        </div>

                        {/* File Upload Zone - Mock but interactive drag and drop representation */}
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Supporting Documents (Report cards, business statements, fee slips, recommendation letters)</label>
                          
                          <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 hover:border-[#074504] bg-gray-50/50 text-center transition-all relative">
                            <input 
                              type="file"
                              multiple
                              onChange={handleMockUpload}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              id="sponsorship-doc-upload"
                            />
                            <div className="space-y-2 pointer-events-none">
                              <UploadCloud className="w-10 h-10 text-gray-300 mx-auto" />
                              <p className="text-[10px] font-black text-[#074504] uppercase tracking-wider">Drag and drop files here to attach or Click to Browse</p>
                              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Supports PDF, PNG, JPG inside AI Sandbox (Max 5MB)</p>
                            </div>
                          </div>

                          {/* Render Attached Files */}
                          {form.uploadedFiles.length > 0 && (
                            <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-48 overflow-y-auto">
                              <div className="text-[9px] font-black text-[#074504] uppercase tracking-wide mb-2 flex items-center justify-between">
                                <span>Attached files ({form.uploadedFiles.length})</span>
                                <span className="text-[#C0991B]">Mock Uploaded successfully</span>
                              </div>
                              {form.uploadedFiles.map((file, i) => (
                                <div key={i} className="flex items-center justify-between bg-white px-3 py-2.5 rounded-lg border border-gray-100 text-[10px] font-bold">
                                  <div className="flex items-center gap-2 text-gray-700">
                                    <FileCheck2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="truncate max-w-[150px]">{file.name}</span>
                                    <span className="text-gray-400 text-[8px]">({file.size})</span>
                                  </div>
                                  <button 
                                    type="button" 
                                    onClick={() => removeFile(i)}
                                    className="text-red-500 hover:text-red-700 font-extrabold uppercase text-[8px] tracking-wider"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: Review, Consent & Signature Submission */}
                  {currentStep === 4 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <h3 className="text-lg font-extrabold text-[#074504] uppercase tracking-tight">4. Audit, Review & Written Consent</h3>
                        <p className="text-xs text-gray-500 font-medium">Almost done! Review your profile information below and confirm consent guidelines.</p>
                      </div>

                      {/* Summary Panel */}
                      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 space-y-4 text-xs font-bold divide-y divide-gray-100">
                        <div className="pb-3 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Program Stream</p>
                            <p className="text-[#074504] uppercase text-[10px]">{SCHOLARSHIP_PROGRAM.name}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Sponsorship Requested</p>
                            <p className="text-[#C0991B]">{form.sponsorshipKind}</p>
                          </div>
                        </div>

                        <div className="py-3 grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Applicant Name</p>
                            <p className="text-gray-800">{form.fullName}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Phone Number</p>
                            <p className="text-gray-800">{form.phone}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">County / Sub-county / Ward</p>
                            <p className="text-gray-800 text-xs">{form.county}{form.subCounty ? `, ${form.subCounty}` : ''}, {form.ward}</p>
                          </div>
                        </div>

                        <div className="py-3">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Quantified Support Narrative</p>
                          <p className="text-gray-700 italic font-medium">"{form.requestedSupport}"</p>
                        </div>
                      </div>

                      {/* Informed Consent Agreement Text */}
                      <div className="bg-[#074504]/5 border border-[#074504]/10 rounded-2xl p-6 space-y-4">
                        <div className="flex gap-3 items-start">
                          <Info className="w-5 h-5 text-[#C0991B] shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h4 className="text-[11px] font-black text-[#074504] uppercase tracking-wider">Informed Data Consent Agreement</h4>
                            <p className="text-[10px] text-gray-600 font-medium leading-relaxed">
                              By checking the consent box, you authorise Neema HEEP staff and its program evaluation committee to hold, evaluate, and share your personal economic information strictly for the purpose of granting sponsorships. We process all data in compliance with the Kenyan Data Protection Act 2019. Upon approval or rejection, we will notify you using your listed phone and email credentials.
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-start gap-3">
                          <input 
                            type="checkbox"
                            id="consentApproved"
                            name="consentApproved"
                            checked={form.consentApproved}
                            onChange={(e) => setForm(prev => ({ ...prev, consentApproved: e.target.checked }))}
                            className="w-5 h-5 accent-[#074504] mt-0.5 cursor-pointer rounded-md"
                          />
                          <label htmlFor="consentApproved" className="text-[10px] text-gray-800 cursor-pointer select-none">
                            <span className="font-extrabold text-[#074504]">YES, I AGREE</span> is captured with my voluntary consent. I authorise Neema HEEP to store and evaluate this application.
                          </label>
                        </div>
                        {errors.consentApproved && <p className="text-red-500 font-bold text-[9px] uppercase tracking-wider pl-8">{errors.consentApproved}</p>}
                      </div>

                      {/* Signature signatureName */}
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Electronic Signature (Type your Full Name to sign)</label>
                        <input 
                          type="text"
                          name="signatureName"
                          value={form.signatureName}
                          onChange={handleTextChange}
                          placeholder="mary@yourdomain.com"
                          className={`w-full border rounded-xl px-4 py-3 text-xs font-bold text-[#074504] focus:ring-2 focus:ring-[#C0991B] outline-none ${
                            errors.signatureName ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'
                          }`}
                        />
                        {errors.signatureName && <p className="text-red-500 font-bold text-[9px] uppercase tracking-wider mt-1">{errors.signatureName}</p>}
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Footer */}
                  <div className="pt-8 border-t border-gray-50 flex items-center justify-between gap-4">
                    {currentStep > 1 ? (
                      <button 
                        type="button" 
                        onClick={handlePrev}
                        disabled={isSubmitting}
                        className="px-6 py-3.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-500 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all"
                      >
                        <ArrowLeft className="w-4 h-4 text-gray-400" /> Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 4 ? (
                      <button 
                        type="button" 
                        onClick={handleNext}
                        className="px-8 py-3.5 bg-[#074504] hover:bg-[#052903] text-white rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                      >
                        Next Step <ArrowRight className="w-4 h-4 text-[#C0991B]" />
                      </button>
                    ) : (
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="px-10 py-4 bg-[#074504] hover:bg-[#599200] text-white rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>Evaluating Application...</>
                        ) : (
                          <>
                            Submit Application <Send className="w-4 h-4 text-[#C0991B]" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            ) : (
              // STEP SUCCESS WRAPPER CARD
              <motion.div 
                key="success-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 md:p-16 text-center space-y-8"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500 shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl font-black text-[#074504] uppercase tracking-tighter">Application Received</h2>
                  <p className="text-[#C0991B] font-bold text-xs uppercase tracking-[0.2em]">Referance Code: {submissionId}</p>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 max-w-lg mx-auto text-left space-y-4 text-xs font-bold text-gray-600 leading-relaxed">
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5 font-bold text-[10px]">✓</div>
                    <p>Your sponsorship request has been securely persisted in the <span className="font-extrabold text-[#074504]">Neema HEEP Leads Repository</span>.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5 font-bold text-[10px]">✓</div>
                    <p>A regional committee has been alerted to review your social evaluation narrative against our program slots.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-[#C0991B]/10 flex items-center justify-center text-[#C0991B] shrink-0 mt-0.5 font-bold text-[10px]">✓</div>
                    <p>Upon verification and formal approval by the board, we will contact you directly on <span className="font-extrabold text-[#074504]">{form.phone}</span> to dispense your desired sponsorship pack.</p>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Est. evaluation turnaround: 3 - 5 business days.</p>

                <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => {
                      setForm({
                        programStream: SCHOLARSHIP_PROGRAM.name,
                        sponsorshipKind: SCHOLARSHIP_PROGRAM.kind,
                        requestedSupport: QUANTIFIED_SUPPORT_OPTIONS[0],
                        fullName: '',
                        email: '',
                        phone: '',
                        idNumber: '',
                        county: 'Kiambu',
                        subCounty: '',
                        ward: '',
                        socialStatus: 'Single Mother',
                        justification: '',
                        uploadedFiles: [],
                        consentApproved: false,
                        signatureName: ''
                      });
                      setCurrentStep(1);
                      setIsCompleted(false);
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gray-100 font-black text-[10px] text-gray-500 rounded-xl hover:bg-gray-200 transition-all uppercase tracking-widest"
                  >
                    Submit Another Request
                  </button>
                  <a 
                    href="/"
                    className="w-full sm:w-auto text-center px-8 py-3.5 bg-[#074504] font-black text-[10px] text-white rounded-xl hover:scale-105 transition-all uppercase tracking-widest shadow-md"
                  >
                    Go Back Home
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <VerificationModal 
        isOpen={isVerifying}
        email={form.email}
        phone={form.phone}
        onVerified={handleVerifiedSubmit}
        onClose={() => setIsVerifying(false)}
      />
    </main>
  );
}
