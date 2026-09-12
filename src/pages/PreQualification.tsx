import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, ArrowRight, Lock, BookOpen, Clock, Activity, FileText, User, ShieldCheck, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from '../components/Helmet';
import { useLeads } from '../hooks/useLeads';
import { getUserData, saveUserData } from '../lib/userData';
import { LOAN_PRODUCTS } from '../lib/loanData';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

type QuizData = {
  intent: string;
  income: string;
  employment: string;
  crb: string;
  amount: string;
  purpose: string;
  existingLoans: string;
  documents: string;
};

type LeadContact = {
  fullName: string;
  phone: string;
  email: string;
};

export default function EligibilityQuiz() {
  const navigate = useNavigate();
  const { submitLead } = useLeads();
  const [step, setStep] = useState(1);
  const [consent, setConsent] = useState(false);
  const [data, setData] = useState<QuizData>({
    intent: '', income: '', employment: '', crb: '', amount: '', purpose: '', existingLoans: '', documents: ''
  });
  const [contact, setContact] = useState<LeadContact>(() => {
    const saved = getUserData();
    return {
      fullName: saved.name || '',
      phone: saved.phone || '',
      email: saved.email || ''
    };
  });

  // Persist contact info as it's entered
  useEffect(() => {
    if (contact.fullName || contact.email || contact.phone) {
      saveUserData({
        name: contact.fullName,
        email: contact.email,
        phone: contact.phone
      });
    }
  }, [contact.fullName, contact.email, contact.phone]);
  const [phoneError, setPhoneError] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<{ score: number, category: string, recommended: string, recommendedId?: string, leadId: string } | null>(null);
  const [isExistingMember, setIsExistingMember] = useState<boolean | null>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState('');

  const nextStep = () => setStep(s => Math.min(s + 1, 9));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const updateData = (field: keyof QuizData, value: string) => {
    setData({ ...data, [field]: value });
    if (field !== 'amount') {
      setTimeout(nextStep, 350); // Auto-advance for multiple choice
    }
  };

  const submitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    
    // Validate Kenyan phone number (E.164)
    const phoneNumber = parsePhoneNumberFromString(contact.phone, 'KE');
    if (!phoneNumber || !phoneNumber.isValid()) {
      setPhoneError('Please enter a valid Kenyan phone number (e.g. 0712345678 or +254...)');
      return;
    }

    if (!consent) {
      setPhoneError('Please provide legal consent to continue.');
      return;
    }

    const formattedPhone = phoneNumber.format('E.164');
    setIsSubmitting(true);
    
    // Capture as Lead
    submitLead({
      type: 'Pre-Qualification',
      name: contact.fullName,
      email: contact.email,
      phone: formattedPhone,
      consentGiven: "Yes",
      signupSource: typeof window !== 'undefined' ? `Pre-Qualification Quiz Page (${window.location.pathname})` : 'Pre-Qualification Page',
      details: { 
        ...data, 
        score: 85
      }
    });

    try {
      // Keep existing simulation/API logic
      const res = await fetch('/api/eligibility/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers: data, 
          contact: {
            ...contact,
            phone: formattedPhone,
            consentGiven: "Yes",
            signupSource: window.location.href
          }
        })
      });
      const resultData = await res.json();
      if (resultData.success) {
        setResults(resultData);
        setStep(10); // Results step
      }
    } catch (err) {
      console.error(err);
      setPhoneError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setRegError("Password must be at least 8 characters");
    if (password !== confirmPassword) return setRegError("Passwords do not match");

    setIsRegistering(true);
    try {
      const res = await fetch('/api/eligibility/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: results?.leadId, password })
      });
      const resData = await res.json();
      if (resData.success) {
        navigate('/portal');
      } else {
        setRegError(resData.error || "Failed to register");
      }
    } catch (err) {
      console.error(err);
      setRegError('Connection error. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const STEPS = 8;
  const progressPercent = Math.max(0, Math.min(100, ((step - 1) / STEPS) * 100));

  return (
    <div className="min-h-screen bg-[#f8faf8] flex flex-col font-sans">
      <Helmet>
        <title>Loan Eligibility Checker Kenya - See If You Qualify Instantly | Neema HEEP</title>
        <meta name="description" content="Check your loan eligibility instantly with Neema HEEP's personalized qualification system. Get your score and dynamic funding plan today." />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [{
                "@type": "Question",
                "name": "How does the loan eligibility checker work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The eligibility checker takes 2 minutes. We evaluate your monthly income, CRB status, employment type, and loan purpose to assign a customized eligibility score and funding recommendation."
                }
              }]
            }
          `}
        </script>
      </Helmet>

      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b shadow-sm sticky top-0 z-20">
        <Link to="/" className="flex flex-col group shrink-0">
          <span className="text-xl font-black text-[#074504] tracking-tight uppercase leading-none">NEEMA HEEP</span>
          <span className="text-[#C0991B] font-extrabold text-[10px] tracking-[0.2em] uppercase leading-tight">MICRO FINANCE</span>
        </Link>
        {step <= STEPS && (
          <div className="flex items-center gap-2">
             <div className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">Step {step} of 8</div>
             <button onClick={() => navigate('/')} className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full">
                <span className="text-gray-400 font-bold">×</span>
             </button>
          </div>
        )}
      </div>

      {step <= STEPS && (
        <div className="w-full h-1.5 bg-gray-200 sticky top-[69px] z-20">
           <div className="h-full bg-[#599200] transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
        </div>
      )}

      <div className="flex-grow flex items-center justify-center p-6 py-12 relative overflow-hidden">
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#599200] rounded-full blur-[150px] opacity-5 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C0991B] rounded-full blur-[150px] opacity-5 pointer-events-none" />

        <div className="w-full max-w-lg relative z-10">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 animate-in slide-in-from-bottom-4 fade-in duration-500">
            
            {step > 1 && step <= STEPS && (
              <button 
                onClick={prevStep}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors mb-6"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div className="min-h-[300px]">
              {step === 1 && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <span className="text-[#C0991B] font-black uppercase tracking-widest text-[10px] mb-2 block">Step 1: Let's start</span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">What type of loan are you looking for?</h2>
                  <div className="space-y-3">
                    {['Business Loan', 'Personal Loan', 'Emergency Loan', 'Asset Financing'].map(option => (
                      <button 
                        key={option} 
                        onClick={() => updateData('intent', option)} 
                        className={`w-full text-left px-5 py-4 rounded-xl border-2 font-bold transition-all ${data.intent === option ? 'border-[#599200] bg-[#599200]/5 text-[#074504]' : 'border-gray-100 hover:border-[#599200]/30 text-gray-600'}`}
                      >
                         {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-300">
                  <span className="text-[#C0991B] font-black uppercase tracking-widest text-[10px] mb-2 block">Step 2: Financials</span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">What is your average monthly income?</h2>
                  <div className="space-y-3">
                    {['<20K', '20K-50K', '50K-100K', '100K+'].map(option => (
                      <button 
                        key={option} 
                        onClick={() => updateData('income', option)} 
                        className={`w-full text-left px-5 py-4 rounded-xl border-2 font-bold transition-all ${data.income === option ? 'border-[#599200] bg-[#599200]/5 text-[#074504]' : 'border-gray-100 hover:border-[#599200]/30 text-gray-600'}`}
                      >
                         {option} KES
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-300">
                  <span className="text-[#C0991B] font-black uppercase tracking-widest text-[10px] mb-2 block">Step 3: Employment</span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">What is your employment status?</h2>
                  <div className="space-y-3">
                    {['Employed (Permanent/Contract)', 'Self-Employed', 'Informal'].map(option => (
                      <button 
                        key={option} 
                        onClick={() => updateData('employment', option)} 
                        className={`w-full text-left px-5 py-4 rounded-xl border-2 font-bold transition-all ${data.employment === option ? 'border-[#599200] bg-[#599200]/5 text-[#074504]' : 'border-gray-100 hover:border-[#599200]/30 text-gray-600'}`}
                      >
                         {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-300">
                  <span className="text-[#C0991B] font-black uppercase tracking-widest text-[10px] mb-2 block">Step 4: Credit History</span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">What is your current CRB status?</h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Good', desc: 'I have no default history' },
                      { label: 'Not Sure', desc: 'Could be listed, but unaware' },
                      { label: 'Listed', desc: 'Currently blacklisted for default' }
                    ].map(option => (
                      <button 
                        key={option.label} 
                        onClick={() => updateData('crb', option.label)} 
                        className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex flex-col ${data.crb === option.label ? 'border-[#599200] bg-[#599200]/5' : 'border-gray-100 hover:border-[#599200]/30'}`}
                      >
                         <span className={`font-bold text-lg ${data.crb === option.label ? 'text-[#074504]' : 'text-gray-800'}`}>{option.label}</span>
                         <span className={`text-sm ${data.crb === option.label ? 'text-[#074504]/70' : 'text-gray-500'}`}>{option.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-300">
                  <span className="text-[#C0991B] font-black uppercase tracking-widest text-[10px] mb-2 block">Step 5: Loan Specifics</span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">How much are you looking to borrow?</h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">KES</span>
                      <input 
                        type="number" 
                        value={data.amount}
                        onChange={(e) => setData({...data, amount: e.target.value})}
                        className="w-full text-2xl font-black bg-gray-50 border border-gray-200 rounded-xl pl-16 pr-4 py-6 outline-none focus:ring-2 focus:ring-[#599200]/20 focus:border-[#599200] transition-colors"
                        placeholder="0.00"
                      />
                    </div>
                    <button 
                      disabled={!data.amount || Number(data.amount) < 1000}
                      onClick={nextStep}
                      className="w-full bg-[#599200] hover:bg-[#4d7d00] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-xl transition-all shadow-md mt-4"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-300">
                  <span className="text-[#C0991B] font-black uppercase tracking-widest text-[10px] mb-2 block">Step 6: Intent Detail</span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">What is the primary purpose of this loan?</h2>
                  <div className="space-y-3">
                    {['Business Expansion', 'Stock Purchase', 'School Fees', 'Emergency', 'Asset Acquisition'].map(option => (
                      <button 
                        key={option} 
                        onClick={() => updateData('purpose', option)} 
                        className={`w-full text-left px-5 py-4 rounded-xl border-2 font-bold transition-all ${data.purpose === option ? 'border-[#599200] bg-[#599200]/5 text-[#074504]' : 'border-gray-100 hover:border-[#599200]/30 text-gray-600'}`}
                      >
                         {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 7 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-300">
                  <span className="text-[#C0991B] font-black uppercase tracking-widest text-[10px] mb-2 block">Step 7: Current Liabilities</span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">Do you have existing loans elsewhere?</h2>
                  <div className="space-y-3">
                    {[
                      { val: 'None', label: 'None, I am loan-free' },
                      { val: 'Manageable', label: 'Yes, but payments are manageable' },
                      { val: 'Struggling', label: 'Yes, and I am struggling slightly' }
                    ].map(option => (
                      <button 
                        key={option.val} 
                        onClick={() => updateData('existingLoans', option.val)} 
                        className={`w-full text-left px-5 py-4 rounded-xl border-2 font-bold transition-all ${data.existingLoans === option.val ? 'border-[#599200] bg-[#599200]/5 text-[#074504]' : 'border-gray-100 hover:border-[#599200]/30 text-gray-600'}`}
                      >
                         {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 8 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-300">
                  <span className="text-[#C0991B] font-black uppercase tracking-widest text-[10px] mb-2 block">Step 8: Readiness</span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">Are your KYC documents (ID, KRA Pin, M-Pesa statement) ready?</h2>
                  <div className="space-y-3">
                    {['All ready', 'Some ready', 'Not ready'].map(option => (
                      <button 
                        key={option} 
                        onClick={() => {
                          setData({ ...data, documents: option });
                          setTimeout(() => setStep(9), 350);
                        }} 
                        className={`w-full text-left px-5 py-4 rounded-xl border-2 font-bold transition-all ${data.documents === option ? 'border-[#599200] bg-[#599200]/5 text-[#074504]' : 'border-gray-100 hover:border-[#599200]/30 text-gray-600'}`}
                      >
                         {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* LEAD CAPTURE FORM */}
              {step === 9 && (
                <form onSubmit={submitQuiz} className="animate-in zoom-in-95 fade-in duration-400">
                  <div className="w-16 h-16 bg-[#599200]/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-[#C0991B]" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">Quiz Complete!</h2>
                  <p className="text-gray-600 font-medium mb-8">Get your Eligibility Score and Funding Plan instantly.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-1 block">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={contact.fullName}
                        onChange={(e) => setContact({...contact, fullName: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#599200]/20 focus:border-[#599200]"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-1 block">Phone Number <span className="text-red-500">*</span></label>
                      <input 
                        required
                        type="tel" 
                        value={contact.phone}
                        onChange={(e) => setContact({...contact, phone: e.target.value})}
                        className={`w-full bg-gray-50 border ${phoneError ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-200'} rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#599200]/20 focus:border-[#599200]`}
                        placeholder="e.g. 0712345678"
                      />
                      {phoneError && <p className="text-xs text-red-500 font-bold mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {phoneError}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-1 block">Email Address <span className="text-red-500">*</span></label>
                      <input 
                        required
                        type="email" 
                        value={contact.email}
                        onChange={(e) => setContact({...contact, email: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#599200]/20 focus:border-[#599200]"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="pt-2">
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
                        <span className="text-[10px] sm:text-xs font-bold text-gray-400 leading-relaxed uppercase tracking-tight selection:bg-none">
                          I agree to the <Link to="/terms-conditions" className="underline hover:text-[#074504]">Terms</Link> and <Link to="/privacy-policy" className="underline hover:text-[#074504]">Privacy Policy</Link>, and consent to NEEMA HEEP processing my data for eligibility evaluation.
                        </span>
                      </label>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting || !consent}
                      className={`w-full font-extrabold py-4 rounded-xl transition-all shadow-md mt-4 flex justify-center items-center gap-2 ${isSubmitting || !consent ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#599200] hover:bg-[#4d7d00] text-white'}`}
                    >
                      {isSubmitting ? 'Calculating Score...' : 'Get My Eligibility Score'}
                    </button>
                  </div>
                </form>
              )}

              {/* DYNAMIC RESULTS & UPSELL */}
              {step === 10 && results && (
                <div className="animate-in zoom-in fade-in duration-500 text-center flex flex-col items-center">
                  
                  {/* Gauge/Score visual */}
                  <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                      <circle 
                        cx="50" cy="50" r="45" fill="none" 
                        stroke={results.category === 'HIGH' ? '#599200' : (results.category === 'MEDIUM' ? '#f59e0b' : '#ef4444')} 
                        strokeWidth="8" 
                        strokeDasharray="282.7" 
                        strokeDashoffset={282.7 - (282.7 * results.score) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-gray-900 tracking-tighter">{results.score}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">/ 100</span>
                    </div>
                  </div>

                  <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-4 shadow-sm border ${
                     results.category === 'HIGH' ? 'bg-[#599200]/10 text-[#C0991B] border-[#599200]/20' : 
                     (results.category === 'MEDIUM' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-50 text-red-600 border-red-200')
                  }`}>
                     {results.category} LIKELIHOOD
                  </span>

                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                    {results.category === 'HIGH' ? `You Qualify for up to KES ${Number(data.amount).toLocaleString()}!` : 
                    (results.category === 'MEDIUM' ? 'You Show Strong Potential' : 'Let\'s Get You Funding-Ready')}
                  </h2>

                  <p className="text-gray-600 font-medium mb-8 max-w-sm">
                    {results.category === 'HIGH' ? 'Your profile matches our prime criteria. Create an account to unlock your dashboard and submit your final application.' : 
                    (results.category === 'MEDIUM' ? 'Your profile is good. A quick consultation can help us structure the right facility for you.' : 'Your profile needs a bit of structural reorganization before lending. Get our free financial checklists.')}
                  </p>

                  <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8 text-left">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#C0991B] shrink-0 border border-gray-100">
                         <Activity className="w-6 h-6"/>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Recommended Product</p>
                        <p className="text-lg font-black text-[#074504] leading-tight">{results.recommended}</p>
                        {results.recommendedId && LOAN_PRODUCTS[results.recommendedId] && (
                          <div className="mt-2 text-sm text-gray-500 font-medium leading-relaxed italic border-l-2 border-[#C0991B] pl-3 py-1">
                            "{LOAN_PRODUCTS[results.recommendedId].tagline}"
                          </div>
                        )}
                      </div>
                    </div>

                    {results.recommendedId && LOAN_PRODUCTS[results.recommendedId] && (
                        <div className="mb-6 space-y-2">
                             <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#599200]" />
                                {LOAN_PRODUCTS[results.recommendedId].features[0]}
                             </div>
                             <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#599200]" />
                                {LOAN_PRODUCTS[results.recommendedId].features[1]}
                             </div>
                             <Link 
                                to={`/loans/${results.recommendedId}`}
                                className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#C0991B] hover:text-[#074504] transition-colors mt-2"
                             >
                                Read full product details <ArrowRight className="w-3 h-3" />
                             </Link>
                        </div>
                    )}
                    
                    <div className="pt-6 border-t border-gray-200">
                      {isExistingMember === null ? (
                        <div className="text-center">
                          <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                             <User className="w-3.5 h-3.5"/> Membership Status
                          </p>
                          <p className="text-sm text-gray-600 mb-6">Are you already a registered member of Neema HEEP?</p>
                          <div className="grid grid-cols-2 gap-3">
                            <button 
                              onClick={() => setIsExistingMember(true)}
                              className="px-6 py-3 bg-[#074504] text-white rounded-xl font-bold text-sm hover:bg-[#0a5a06] transition-all shadow-sm"
                            >
                              Yes, I am
                            </button>
                            <button 
                              onClick={() => setIsExistingMember(false)}
                              className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
                            >
                              No, not yet
                            </button>
                          </div>
                        </div>
                      ) : isExistingMember ? (
                        <div className="space-y-4">
                           <div className="bg-[#599200]/10 p-4 rounded-xl border border-[#599200]/20 flex items-center gap-3">
                              <CheckCircle2 className="w-5 h-5 text-[#599200] shrink-0" />
                              <p className="text-sm font-bold text-[#074504]">Great! Access your dashboard to finalize this application.</p>
                           </div>
                           <div className="grid sm:grid-cols-2 gap-3">
                              <Link 
                                to="/portal" 
                                className="w-full bg-[#074504] hover:bg-[#053203] text-white font-black py-4 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-center"
                              >
                                Staff & CMS Portal <ArrowRight className="w-4 h-4"/>
                              </Link>
                              <Link 
                                to="/request-callback" 
                                className="w-full bg-[#C0991B] hover:bg-[#a38217] text-[#074504] font-bold py-4 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-center"
                              >
                                Request Call Back
                              </Link>
                           </div>
                           <p className="text-[10px] text-gray-400 text-center font-bold">Your full eligibility report has been synced to your profile.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                           <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center gap-3">
                              <ShieldCheck className="w-5 h-5 text-[#C0991B] shrink-0" />
                              <p className="text-sm font-bold text-amber-900">Join the Neema family to claim your approved limit.</p>
                           </div>
                           <div className="grid gap-3">
                             <Link 
                               to="/join" 
                               className="w-full bg-[#C0991B] hover:bg-[#a38217] text-[#074504] font-black py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                             >
                                Register as New Member <User className="w-4 h-4"/>
                             </Link>
                             <Link 
                               to="/contact" 
                               className="w-full border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                             >
                                Request a Call Back <Phone className="w-4 h-4"/>
                             </Link>
                           </div>
                           <p className="text-[10px] text-gray-400 text-center font-bold">A copy of your recommendation has been sent to your email.</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-extrabold text-[#074504] mb-8 text-center uppercase tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Is the eligibility score a guarantee?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">No, the score is a highly accurate preliminary gauge used to bypass initial bottlenecks. A formal appraisal will still be required upon completion of the member profile.</p>
            </div>
            <div className="border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Who qualifies for a HIGH score?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Individuals or businesses showcasing stable, predictable income streams, clean credit history, and organized KYC documentation typically fall within our top-tier evaluation criteria.</p>
            </div>
            <div className="border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Is my data secure?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Absolutely. We utilize robust backend hashing specifically via simulated environments combined with AES encryption standard practices to protect your personally identifiable information (PII).</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
