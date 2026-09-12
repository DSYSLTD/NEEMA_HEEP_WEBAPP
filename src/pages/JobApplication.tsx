import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Send, Upload, User, Mail, Phone, Briefcase, 
  MapPin, CheckCircle2, ChevronRight, ChevronLeft, FileText, Globe, 
  AlertCircle, ShieldCheck, Lock, Building2, Calendar, 
  Award, BookOpen, Plus, Trash2, Check, Download, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  useJobs, KENYAN_COUNTIES, EducationRecord, EmploymentRecord, 
  MembershipRecord, ReferenceRecord 
} from '../hooks/useJobs';
import { COUNTY_DATA } from '../lib/countyData';

export default function JobApplication() {
  const location = useLocation();
  const navigate = useNavigate();
  const { vacancies, submitJobApplication } = useJobs();

  // Read URL params or state
  const queryParams = new URLSearchParams(location.search);
  const vacancyIdFromUrl = queryParams.get('vacancyId') || location.state?.vacancyId;
  const selectedVacancy = vacancies.find(v => v.id === vacancyIdFromUrl) || vacancies[0];

  // Verification Gateway state
  const [verificationDone, setVerificationDone] = useState(false);
  const [initPhone, setInitPhone] = useState('0712345678');
  const [initEmail, setInitEmail] = useState('applicant@example.com');
  const [otpSent, setOtpSent] = useState(false);
  const [smsOtpInput, setSmsOtpInput] = useState('');
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [simulatedSmsCode, setSimulatedSmsCode] = useState('');
  const [simulatedEmailCode, setSimulatedEmailCode] = useState('');

  // Multi-Step Form state (Steps 1 to 7)
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Identity & Contact
  const [identity, setIdentity] = useState({
    surname: '',
    firstName: '',
    middleName: '',
    nationalId: '',
    nationalIdDocName: '',
    kraPin: '',
    kraPinCertName: '',
    phone: '',
    email: '',
    county: 'Nyeri',
    subCounty: '',
    ward: ''
  });

  // Step 2: Education History
  const [educationList, setEducationList] = useState<EducationRecord[]>([
    { id: 'edu-1', level: 'Degree', institution: 'Kenyatta University', startYear: '2016', endYear: '2020', docName: 'Degree_Certificate.pdf' }
  ]);

  // Step 3: Employment History
  const [employmentList, setEmploymentList] = useState<EmploymentRecord[]>([
    { id: 'emp-1', company: 'Faulu Microfinance Bank', jobTitle: 'Credit Officer', startDate: '2021-02', endDate: '2026-06', isCurrent: false, responsibilities: 'Appraised Chama loans and field business portfolios.' }
  ]);

  // Step 4: Professional Memberships
  const [membershipList, setMembershipList] = useState<MembershipRecord[]>([]);

  // Step 5: References (Require Exactly 4)
  const [references, setReferences] = useState<ReferenceRecord[]>([
    { id: 'ref-1', fullName: '', titleRelationship: '', company: '', yearsKnown: '', phone: '', email: '' },
    { id: 'ref-2', fullName: '', titleRelationship: '', company: '', yearsKnown: '', phone: '', email: '' },
    { id: 'ref-3', fullName: '', titleRelationship: '', company: '', yearsKnown: '', phone: '', email: '' },
    { id: 'ref-4', fullName: '', titleRelationship: '', company: '', yearsKnown: '', phone: '', email: '' }
  ]);

  // Step 6: CV Upload
  const [cvFile, setCvFile] = useState<{ fileName: string; fileSize: string } | null>(null);

  // Step 7: Declaration
  const [certifiedTrue, setCertifiedTrue] = useState(false);
  const [dataConsent, setDataConsent] = useState(false);

  // Confirmation state
  const [submittedAppNumber, setSubmittedAppNumber] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  // Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (!initPhone.match(/^(\+254|0)?(7|1)\d{8}$/)) {
      setOtpError('Please enter a valid Kenyan phone number (e.g., 0712345678 or 0112345678).');
      return;
    }
    if (!initEmail.includes('@')) {
      setOtpError('Please enter a valid email address.');
      return;
    }

    const codeSms = String(Math.floor(100000 + Math.random() * 900000));
    const codeEmail = String(Math.floor(100000 + Math.random() * 900000));
    setSimulatedSmsCode(codeSms);
    setSimulatedEmailCode(codeEmail);
    setSmsOtpInput(codeSms); // Auto-fill for friction-free UX
    setEmailOtpInput(codeEmail); // Auto-fill for friction-free UX
    setOtpSent(true);
  };

  // Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (smsOtpInput !== simulatedSmsCode || emailOtpInput !== simulatedEmailCode) {
      setOtpError('Invalid OTP verification code entered.');
      return;
    }

    setIdentity(prev => ({
      ...prev,
      phone: initPhone,
      email: initEmail
    }));
    setVerificationDone(true);
  };

  // Handle Step 1 Next Validation
  const validateStep1 = () => {
    if (!identity.surname.trim() || !identity.firstName.trim()) {
      setFormError('Please fill in your Surname and First Name.');
      return false;
    }
    if (!identity.nationalId.match(/^\d{7,8}$/)) {
      setFormError('National ID must be 7 or 8 digits.');
      return false;
    }
    if (!identity.kraPin.toUpperCase().match(/^[A-Z]\d{9}[A-Z]$/)) {
      setFormError('Invalid KRA PIN format (e.g. A012345678B).');
      return false;
    }
    setFormError('');
    return true;
  };

  // Handle Step 5 References Validation (Exact 4 Required)
  const validateStep5 = () => {
    for (let i = 0; i < 4; i++) {
      const r = references[i];
      if (!r.fullName.trim() || !r.titleRelationship.trim() || !r.company.trim() || !r.phone.trim() || !r.email.trim()) {
        setFormError(`Please complete all fields for Reference #${i + 1}. Exactly 4 complete references are required.`);
        return false;
      }
    }
    setFormError('');
    return true;
  };

  // Submit Application
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certifiedTrue || !dataConsent) {
      setFormError('You must check both legal declaration checkboxes to complete submission.');
      return;
    }
    if (!cvFile) {
      setFormError('Please upload your Curriculum Vitae (CV) before submitting.');
      return;
    }

    const created = submitJobApplication({
      vacancyId: selectedVacancy ? selectedVacancy.id : 'vac-gen',
      vacancyTitle: selectedVacancy ? selectedVacancy.title : 'General Application',
      vacancyRef: selectedVacancy ? selectedVacancy.refNumber : 'NH-VAC-GEN',
      department: selectedVacancy ? selectedVacancy.department : 'Human Resources',
      status: 'New',
      identity,
      education: educationList,
      employment: employmentList,
      memberships: membershipList,
      references,
      cv: cvFile,
      declaration: {
        certifiedTrue,
        dataConsent
      }
    });

    setSubmittedAppNumber(created.appNumber);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 text-gray-800 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link to="/careers" className="inline-flex items-center gap-2 text-xs font-black text-[#074504] hover:text-[#C0991B] uppercase tracking-wider transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Careers Portal</span>
          </Link>

          <span className="px-3 py-1 bg-[#074504] text-[#C0991B] text-[10px] font-mono font-black rounded-full shadow-xs">
            Ref: {selectedVacancy ? selectedVacancy.refNumber : 'NH-VAC-2026'}
          </span>
        </div>

        {/* Vacancy Banner Summary */}
        <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#074504] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-[#C0991B]/30 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-[#C0991B] text-[#033B18] font-black text-[10px] uppercase rounded-full">
                {selectedVacancy ? selectedVacancy.employmentType : 'Full-Time'}
              </span>
              <span className="px-3 py-1 bg-white/10 text-white font-bold text-[10px] uppercase rounded-full border border-white/20">
                {selectedVacancy ? selectedVacancy.department : 'Credit Operations'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white">
              {selectedVacancy ? selectedVacancy.title : 'Online Job Application'}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 font-medium">
              Location: <strong>{selectedVacancy ? selectedVacancy.location : 'Nyeri'}</strong> • Application Deadline: <strong className="text-[#C0991B]">{selectedVacancy ? selectedVacancy.deadline : '2026-08-30'}</strong>
            </p>
          </div>
        </div>

        {/* SUCCESS CONFIRMATION SCREEN */}
        {submittedAppNumber ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xl text-center space-y-6"
          >
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700 shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-4 py-1.5 bg-[#074504] text-[#C0991B] text-xs font-mono font-black rounded-full uppercase">
                Application Code: {submittedAppNumber}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#074504] uppercase pt-2">
                Job Application Submitted Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-xl mx-auto leading-relaxed">
                Thank you for applying for the position of <strong>{selectedVacancy ? selectedVacancy.title : 'Vacancy'}</strong> at Neema HEEP. Your application has been logged into our secure portal in compliance with the <strong>Kenyan Data Protection Act, 2019</strong>.
              </p>
            </div>

            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 max-w-lg mx-auto text-left text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-black">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Verification & Next Steps</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-emerald-800">
                <li>Confirmation SMS & Email sent to <strong>{identity.phone}</strong> and <strong>{identity.email}</strong>.</li>
                <li>Only shortlisted candidates will be contacted for interviews.</li>
                <li>You can reference your code <strong>{submittedAppNumber}</strong> during inquiries.</li>
              </ul>
            </div>

            <div className="pt-4 flex items-center justify-center gap-4">
              <Link 
                to="/careers" 
                className="px-6 py-3 bg-[#074504] text-white font-black text-xs uppercase rounded-xl hover:bg-[#053203] shadow-md"
              >
                Return to Careers Portal
              </Link>
            </div>
          </motion.div>
        ) : !verificationDone ? (
          
          /* GATEWAY: OTP VERIFICATION PORTAL */
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-xl space-y-6"
          >
            <div className="border-b border-gray-100 pb-4 space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C0991B]" />
                <span className="text-xs font-black text-[#074504] uppercase tracking-wider">
                  Applicant Identity Gateway
                </span>
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase">
                Step 0: Secure OTP Phone & Email Verification
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                To prevent fraud and protect applicant data under the Data Protection Act (2019), verify your phone number and email address before completing the job application form.
              </p>
            </div>

            {otpError && (
              <div className="p-3 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4 max-w-md mx-auto py-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Mobile Phone Number (Safaricom / Airtel) *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input 
                      type="text" 
                      value={initPhone}
                      onChange={e => setInitPhone(e.target.value)}
                      placeholder="e.g. 0712345678 or +254712345678"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#074504] focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">Valid formats: 07XXXXXXXX, 01XXXXXXXX, +2547XXXXXXXX</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input 
                      type="email" 
                      value={initEmail}
                      onChange={e => setInitEmail(e.target.value)}
                      placeholder="e.g. applicant@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#074504] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl shadow-lg hover:bg-[#053203] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Send Verification OTP Codes</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-md mx-auto py-2">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <span className="font-black flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> OTP Codes Generated!
                  </span>
                  <p className="text-[11px] text-emerald-800">
                    Codes sent to <strong>{initPhone}</strong> and <strong>{initEmail}</strong>. (Auto-filled below for seamless testing).
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">SMS OTP Code</label>
                    <input 
                      type="text" 
                      value={smsOtpInput}
                      onChange={e => setSmsOtpInput(e.target.value)}
                      className="w-full p-3 text-center bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-black text-gray-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Email OTP Code</label>
                    <input 
                      type="text" 
                      value={emailOtpInput}
                      onChange={e => setEmailOtpInput(e.target.value)}
                      className="w-full p-3 text-center bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-black text-gray-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#074504] text-white font-black text-xs uppercase rounded-xl shadow-lg hover:bg-[#053203] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#C0991B]" />
                  <span>Verify Identity & Begin Application</span>
                </button>
              </form>
            )}
          </motion.div>
        ) : (

          /* MULTI-STEP APPLICATION FORM (STEPS 1 TO 7) */
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-xl space-y-8">
            {/* Step Wizard Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black uppercase text-[#074504]">
                <span>Step {currentStep} of 7: {
                  currentStep === 1 ? 'Identity & Contact' :
                  currentStep === 2 ? 'Education Qualifications' :
                  currentStep === 3 ? 'Employment History' :
                  currentStep === 4 ? 'Professional Memberships' :
                  currentStep === 5 ? 'References (4 Required)' :
                  currentStep === 6 ? 'Curriculum Vitae (CV)' : 'Legal Declaration'
                }</span>
                <span className="text-[#C0991B] font-mono">{Math.round((currentStep / 7) * 100)}% Complete</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#074504] to-[#C0991B] transition-all duration-300" 
                  style={{ width: `${(currentStep / 7) * 100}%` }} 
                />
              </div>

              {/* Step Badges Row */}
              <div className="flex items-center justify-between pt-2 overflow-x-auto no-scrollbar gap-1 text-[10px] font-bold">
                {[
                  '1. Identity', '2. Education', '3. Experience', '4. Memberships', '5. References', '6. CV Upload', '7. Submit'
                ].map((st, idx) => {
                  const sNum = idx + 1;
                  const isDone = currentStep > sNum;
                  const isCurrent = currentStep === sNum;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        if (sNum < currentStep) setCurrentStep(sNum);
                      }}
                      className={`px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer transition-all ${
                        isCurrent ? 'bg-[#074504] text-[#C0991B] font-black' :
                        isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* STEP 1: IDENTITY & CONTACT */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                    <User className="w-4 h-4 text-[#C0991B]" /> Step 1: Applicant Identity & Legal Contact
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">As shown on your Kenyan National ID or Passport</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Surname *</label>
                    <input 
                      type="text" 
                      value={identity.surname}
                      onChange={e => setIdentity(prev => ({ ...prev, surname: e.target.value }))}
                      placeholder="e.g. Mwangi"
                      required
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">First Name *</label>
                    <input 
                      type="text" 
                      value={identity.firstName}
                      onChange={e => setIdentity(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="e.g. James"
                      required
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Middle Name (Optional)</label>
                    <input 
                      type="text" 
                      value={identity.middleName}
                      onChange={e => setIdentity(prev => ({ ...prev, middleName: e.target.value }))}
                      placeholder="e.g. Kariuki"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">National ID / Passport Number *</label>
                    <input 
                      type="text" 
                      value={identity.nationalId}
                      onChange={e => setIdentity(prev => ({ ...prev, nationalId: e.target.value }))}
                      placeholder="e.g. 32145879"
                      required
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">KRA PIN Number *</label>
                    <input 
                      type="text" 
                      value={identity.kraPin}
                      onChange={e => setIdentity(prev => ({ ...prev, kraPin: e.target.value.toUpperCase() }))}
                      placeholder="e.g. A012345678B"
                      required
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Verified Mobile Phone</label>
                    <input 
                      type="text" 
                      value={identity.phone}
                      disabled
                      className="w-full p-2.5 bg-gray-200 border border-gray-300 rounded-xl text-xs font-mono font-bold text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Verified Email Address</label>
                    <input 
                      type="text" 
                      value={identity.email}
                      disabled
                      className="w-full p-2.5 bg-gray-200 border border-gray-300 rounded-xl text-xs font-bold text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">County of Residence *</label>
                      <select
                        value={identity.county}
                        onChange={e => setIdentity(prev => ({ ...prev, county: e.target.value, subCounty: '', ward: '' }))}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#074504]"
                      >
                        <option value="">Select County</option>
                        {KENYAN_COUNTIES.map(c => (
                          <option key={c} value={c}>{c} County</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Sub-county (Constituency)</label>
                      {identity.county ? (
                        <select
                          value={identity.subCounty}
                          onChange={e => setIdentity(prev => ({ ...prev, subCounty: e.target.value, ward: '' }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#074504]"
                        >
                          <option value="">Select Sub-county</option>
                          {COUNTY_DATA[identity.county].subCounties.map(sc => (
                            <option key={sc} value={sc}>{sc}</option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <select disabled className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-400 cursor-not-allowed">
                          <option value="">Select County First</option>
                        </select>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Ward Location</label>
                      {identity.county && identity.subCounty ? (
                        <select
                          value={identity.ward}
                          onChange={e => setIdentity(prev => ({ ...prev, ward: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#074504]"
                        >
                          <option value="">Select Ward</option>
                          {COUNTY_DATA[identity.county].wards[identity.subCounty].map(w => (
                            <option key={w} value={w}>{w}</option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <select disabled className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-400 cursor-not-allowed">
                          <option value="">Select Sub-county First</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setCurrentStep(2);
                    }}
                    className="px-6 py-2.5 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl flex items-center gap-2 cursor-pointer shadow-md hover:bg-[#053203]"
                  >
                    <span>Next: Education</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: EDUCATION HISTORY */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#C0991B]" /> Step 2: Academic & Professional Qualifications
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">Add academic degrees, diplomas, or certificates</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEducationList(prev => [
                      ...prev,
                      { id: `edu-${Date.now()}`, level: 'Diploma', institution: '', startYear: '2018', endYear: '2020' }
                    ])}
                    className="px-3 py-1.5 bg-[#074504] text-[#C0991B] text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Qualification</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {educationList.map((edu, index) => (
                    <div key={edu.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-[#074504] uppercase">Qualification #{index + 1}</span>
                        {educationList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setEducationList(prev => prev.filter(e => e.id !== edu.id))}
                            className="text-red-600 p-1 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Level</label>
                          <select
                            value={edu.level}
                            onChange={e => {
                              const val = e.target.value as any;
                              setEducationList(prev => prev.map(item => item.id === edu.id ? { ...item, level: val } : item));
                            }}
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                          >
                            <option value="Certificate">Certificate</option>
                            <option value="Diploma">Diploma</option>
                            <option value="Higher Diploma">Higher Diploma</option>
                            <option value="Degree">Degree</option>
                            <option value="Masters">Masters</option>
                            <option value="PhD">PhD</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-gray-700">Institution Name</label>
                          <input 
                            type="text" 
                            value={edu.institution}
                            onChange={e => {
                              const val = e.target.value;
                              setEducationList(prev => prev.map(item => item.id === edu.id ? { ...item, institution: val } : item));
                            }}
                            placeholder="e.g. Kenyatta University"
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700">From</label>
                            <input 
                              type="text" 
                              value={edu.startYear}
                              onChange={e => {
                                const val = e.target.value;
                                setEducationList(prev => prev.map(item => item.id === edu.id ? { ...item, startYear: val } : item));
                              }}
                              className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 text-center"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700">To</label>
                            <input 
                              type="text" 
                              value={edu.endYear}
                              onChange={e => {
                                const val = e.target.value;
                                setEducationList(prev => prev.map(item => item.id === edu.id ? { ...item, endYear: val } : item));
                              }}
                              className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 text-center"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs uppercase rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2.5 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl flex items-center gap-2 cursor-pointer shadow-md hover:bg-[#053203]"
                  >
                    <span>Next: Employment</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: EMPLOYMENT HISTORY */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#C0991B]" /> Step 3: Employment & Work Experience
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">Add relevant work history starting from most recent</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmploymentList(prev => [
                      ...prev,
                      { id: `emp-${Date.now()}`, company: '', jobTitle: '', startDate: '2022-01', endDate: 'Present', isCurrent: false, responsibilities: '' }
                    ])}
                    className="px-3 py-1.5 bg-[#074504] text-[#C0991B] text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Employment</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {employmentList.map((emp, index) => (
                    <div key={emp.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-[#074504] uppercase">Position #{index + 1}</span>
                        {employmentList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setEmploymentList(prev => prev.filter(e => e.id !== emp.id))}
                            className="text-red-600 p-1 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Company / Organization</label>
                          <input 
                            type="text" 
                            value={emp.company}
                            onChange={e => {
                              const val = e.target.value;
                              setEmploymentList(prev => prev.map(item => item.id === emp.id ? { ...item, company: val } : item));
                            }}
                            placeholder="e.g. Faulu Microfinance Bank"
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Job Title</label>
                          <input 
                            type="text" 
                            value={emp.jobTitle}
                            onChange={e => {
                              const val = e.target.value;
                              setEmploymentList(prev => prev.map(item => item.id === emp.id ? { ...item, jobTitle: val } : item));
                            }}
                            placeholder="e.g. Credit Officer"
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Key Responsibilities & Achievements</label>
                        <textarea 
                          rows={2}
                          value={emp.responsibilities}
                          onChange={e => {
                            const val = e.target.value;
                            setEmploymentList(prev => prev.map(item => item.id === emp.id ? { ...item, responsibilities: val } : item));
                          }}
                          className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-900"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs uppercase rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-2.5 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl flex items-center gap-2 cursor-pointer shadow-md hover:bg-[#053203]"
                  >
                    <span>Next: Memberships</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PROFESSIONAL MEMBERSHIPS */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#C0991B]" /> Step 4: Professional Body Memberships (Optional)
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">Add professional accreditations (e.g. KIM, ICPAK, LSK, KISM)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMembershipList(prev => [
                      ...prev,
                      { id: `mem-${Date.now()}`, bodyName: 'KIM (Kenya Institute of Management)', regNumber: '' }
                    ])}
                    className="px-3 py-1.5 bg-[#074504] text-[#C0991B] text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Membership</span>
                  </button>
                </div>

                {membershipList.length === 0 ? (
                  <div className="p-6 bg-gray-50 text-center rounded-2xl border border-dashed border-gray-300 text-xs text-gray-500">
                    No professional memberships added. Click "Add Membership" above or proceed to References.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {membershipList.map((mem, index) => (
                      <div key={mem.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-3">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            value={mem.bodyName}
                            onChange={e => {
                              const val = e.target.value;
                              setMembershipList(prev => prev.map(item => item.id === mem.id ? { ...item, bodyName: val } : item));
                            }}
                            placeholder="Professional Body Name"
                            className="p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                          />
                          <input 
                            type="text" 
                            value={mem.regNumber}
                            onChange={e => {
                              const val = e.target.value;
                              setMembershipList(prev => prev.map(item => item.id === mem.id ? { ...item, regNumber: val } : item));
                            }}
                            placeholder="Registration / Member Number"
                            className="p-2 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setMembershipList(prev => prev.filter(m => m.id !== mem.id))}
                          className="text-red-600 p-2 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs uppercase rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="px-6 py-2.5 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl flex items-center gap-2 cursor-pointer shadow-md hover:bg-[#053203]"
                  >
                    <span>Next: 4 References</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: REFERENCES (EXACTLY 4 REQUIRED) */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                    <User className="w-4 h-4 text-[#C0991B]" /> Step 5: Professional References (EXACTLY 4 REQUIRED)
                  </h3>
                  <p className="text-xs text-amber-900 font-bold bg-amber-50 p-2 rounded-xl border border-[#C0991B]/40 mt-1">
                    Requirement: You must provide exactly four (4) verifiable professional references (e.g., former supervisors, lecturers, or line managers).
                  </p>
                </div>

                <div className="space-y-6">
                  {references.map((ref, idx) => (
                    <div key={ref.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                      <span className="font-black text-xs text-[#074504] uppercase block">
                        Reference #{idx + 1} *
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Full Name *</label>
                          <input 
                            type="text" 
                            value={ref.fullName}
                            onChange={e => {
                              const val = e.target.value;
                              setReferences(prev => prev.map((item, i) => i === idx ? { ...item, fullName: val } : item));
                            }}
                            placeholder="e.g. Peter Nderitu"
                            required
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Title / Relationship *</label>
                          <input 
                            type="text" 
                            value={ref.titleRelationship}
                            onChange={e => {
                              const val = e.target.value;
                              setReferences(prev => prev.map((item, i) => i === idx ? { ...item, titleRelationship: val } : item));
                            }}
                            placeholder="e.g. Branch Manager"
                            required
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Company / Organization *</label>
                          <input 
                            type="text" 
                            value={ref.company}
                            onChange={e => {
                              const val = e.target.value;
                              setReferences(prev => prev.map((item, i) => i === idx ? { ...item, company: val } : item));
                            }}
                            placeholder="e.g. Faulu MFI"
                            required
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Years Known</label>
                          <input 
                            type="text" 
                            value={ref.yearsKnown}
                            onChange={e => {
                              const val = e.target.value;
                              setReferences(prev => prev.map((item, i) => i === idx ? { ...item, yearsKnown: val } : item));
                            }}
                            placeholder="e.g. 4 Years"
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Phone Number *</label>
                          <input 
                            type="text" 
                            value={ref.phone}
                            onChange={e => {
                              const val = e.target.value;
                              setReferences(prev => prev.map((item, i) => i === idx ? { ...item, phone: val } : item));
                            }}
                            placeholder="e.g. +254722111222"
                            required
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold text-gray-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Email Address *</label>
                          <input 
                            type="email" 
                            value={ref.email}
                            onChange={e => {
                              const val = e.target.value;
                              setReferences(prev => prev.map((item, i) => i === idx ? { ...item, email: val } : item));
                            }}
                            placeholder="e.g. ref@company.co.ke"
                            required
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs uppercase rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep5()) setCurrentStep(6);
                    }}
                    className="px-6 py-2.5 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl flex items-center gap-2 cursor-pointer shadow-md hover:bg-[#053203]"
                  >
                    <span>Next: Upload CV</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: CV UPLOAD */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#C0991B]" /> Step 6: Curriculum Vitae (CV) Upload
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">Upload your detailed resume in PDF format (Max 2MB)</p>
                </div>

                <div className="p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300 text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-[#074504] shadow-sm">
                    <Upload className="w-8 h-8 text-[#C0991B]" />
                  </div>

                  {cvFile ? (
                    <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 inline-block space-y-1">
                      <span className="font-black text-xs block">✓ Selected: {cvFile.fileName}</span>
                      <span className="text-[10px] text-emerald-700 font-mono">Size: {cvFile.fileSize}</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-800">Drag & drop your CV PDF file here, or click below</p>
                      <p className="text-[10px] text-gray-400">Supported format: PDF only • Maximum file size: 2MB</p>
                    </div>
                  )}

                  <div>
                    <button
                      type="button"
                      onClick={() => setCvFile({ fileName: `CV_${identity.surname}_${identity.firstName}.pdf`, fileSize: '1.4 MB' })}
                      className="px-5 py-2.5 bg-[#074504] text-[#C0991B] font-bold text-xs uppercase rounded-xl shadow-xs cursor-pointer hover:bg-[#053203]"
                    >
                      {cvFile ? 'Change CV File' : 'Select PDF File'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs uppercase rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!cvFile) {
                        setFormError('Please select or upload your CV PDF file.');
                        return;
                      }
                      setFormError('');
                      setCurrentStep(7);
                    }}
                    className="px-6 py-2.5 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl flex items-center gap-2 cursor-pointer shadow-md hover:bg-[#053203]"
                  >
                    <span>Next: Legal Declaration</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 7: LEGAL DECLARATION & SUBMISSION */}
            {currentStep === 7 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C0991B]" /> Step 7: Legal Declaration & Data Protection Consent
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">Review your commitments under Kenyan laws before submitting</p>
                </div>

                <div className="p-5 bg-amber-50 rounded-2xl border border-[#C0991B]/40 space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={certifiedTrue}
                      onChange={e => setCertifiedTrue(e.target.checked)}
                      className="mt-1 rounded text-[#074504] focus:ring-[#074504]"
                    />
                    <span className="text-xs font-bold text-amber-950 leading-relaxed">
                      I hereby certify that all information, documents, and qualifications provided in this online job application are true, complete, and accurate to the best of my knowledge. I understand that any false statement or omission may lead to immediate disqualification or termination of employment.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={dataConsent}
                      onChange={e => setDataConsent(e.target.checked)}
                      className="mt-1 rounded text-[#074504] focus:ring-[#074504]"
                    />
                    <span className="text-xs font-bold text-amber-950 leading-relaxed">
                      Pursuant to the <strong>Kenyan Data Protection Act, 2019</strong>, I give explicit legal consent to Neema HEEP to collect, verify, process, and retain my personal details, references, and uploaded documents solely for recruitment and background appraisal purposes.
                    </span>
                  </label>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-600 space-y-1">
                  <span className="font-black text-gray-900 block uppercase">Application Overview Summary:</span>
                  <p>Candidate: <strong>{identity.firstName} {identity.surname}</strong> • Position: <strong>{selectedVacancy ? selectedVacancy.title : 'General'}</strong></p>
                  <p>Verified Contacts: Phone <strong>{identity.phone}</strong> | Email <strong>{identity.email}</strong> | Residence <strong>{identity.county} County</strong></p>
                  <p>Attachments: CV File (<strong>{cvFile?.fileName}</strong>) | <strong>4 Verified References Provided</strong></p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(6)}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs uppercase rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl flex items-center gap-2 cursor-pointer shadow-xl hover:bg-[#053203]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Job Application Now</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
