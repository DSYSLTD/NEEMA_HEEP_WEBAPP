import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Smartphone, 
  User, 
  Users,
  Camera, 
  CreditCard, 
  Briefcase,
  History,
  Info,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  Lock,
  Download,
  AlertTriangle,
  ChevronRight,
  MapPin,
  Building2,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import imageCompression from 'browser-image-compression';

// --- CONSTANTS & TYPES ---

import { COUNTY_DATA, KENYA_COUNTIES as COUNTIES } from '../lib/countyData';
import { supabase } from '../lib/supabase';

const INDIVIDUAL_FEE = 2000;
const GROUP_FEE_PER_MEMBER = 600;
const PAYBILL = "974850";

type RegType = 'individual' | 'group';
type Step = 'welcome' | 'details' | 'uploads' | 'payment' | 'review' | 'success';

interface GroupMember {
  id: string;
  fullName: string;
  phone: string;
  idNumber: string;
  role: string;
}

// --- COMPONENTS ---

const ProgressIndicator = ({ step, steps }: { step: number; steps: string[] }) => (
  <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 scrollbar-hide px-4">
    {steps.map((label, i) => {
      const active = i + 1 === step;
      const completed = i + 1 < step;
      return (
        <div key={label} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] transition-all duration-300 ${
            active ? 'bg-[#074504] text-white scale-110 shadow-lg' : 
            completed ? 'bg-[#599200] text-white' : 
            'bg-white border border-gray-200 text-gray-400'
          }`}>
            {completed ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
          </div>
          <span className={`text-[9px] uppercase font-black tracking-widest whitespace-nowrap transition-colors duration-300 ${
            active ? 'text-[#074504]' : 'text-gray-400'
          }`}>
            {label}
          </span>
          {i < steps.length - 1 && <div className="w-6 h-px bg-gray-200 mx-1" />}
        </div>
      );
    })}
  </div>
);

export default function JoinUs() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [regType, setRegType] = useState<RegType>('individual');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentConfirm, setConsentConfirm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'manual'>('manual');
  const [manualTxId, setManualTxId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dob: '',
    idNumber: '',
    kraPin: '',
    phone: '',
    altPhone: '',
    email: '',
    county: '',
    constituency: '',
    ward: '',
    physicalAddress: '',
    // Group specific
    groupName: '',
    groupType: '',
    groupRegNumber: '',
    yearFounded: '',
    memberCount: '',
    repFirstName: '',
    repMiddleName: '',
    repLastName: '',
    repIdNumber: '',
    repPhone: '',
    repPosition: ''
  });

  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [files, setFiles] = useState<{
    passportPhoto: File | null;
    idFront: File | null;
    idBack: File | null;
  }>({
    passportPhoto: null,
    idFront: null,
    idBack: null
  });

  const [previews, setPreviews] = useState<{
    passportPhoto: string;
    idFront: string;
    idBack: string;
  }>({
    passportPhoto: '',
    idFront: '',
    idBack: ''
  });

  const [consentChecked, setConsentChecked] = useState(false);

  // --- HANDLERS ---

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof files) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file.");
        return;
      }

      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };
        
        const compressedFile = await imageCompression(file, options);
        
        setFiles(prev => ({ ...prev, [key]: compressedFile }));
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => ({ ...prev, [key]: reader.result as string }));
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Compression error:", error);
        alert("Error processing the image. Please try another file.");
      }
    }
  };

  const addGroupMember = () => {
    setGroupMembers(prev => [
      ...prev,
      { id: Math.random().toString(36).substr(2, 9), fullName: '', phone: '', idNumber: '', role: '' }
    ]);
  };

  const removeGroupMember = (id: string) => {
    setGroupMembers(prev => prev.filter(m => m.id !== id));
  };

  const updateGroupMember = (id: string, field: keyof GroupMember, value: string) => {
    setGroupMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (currentStep === 'details') {
      if (regType === 'individual') {
        if (!formData.firstName) err.firstName = "Required";
        if (!formData.lastName) err.lastName = "Required";
        
        const parsedPhone = parsePhoneNumberFromString(formData.phone, 'KE');
        if (!formData.phone || !parsedPhone || !parsedPhone.isValid()) {
          err.phone = "Invalid phone number. Use e.g. 07XXXXXXXX";
        }
      } else {
        if (!formData.groupName) err.groupName = "Required";
        
        const parsedPhone = parsePhoneNumberFromString(formData.repPhone, 'KE');
        if (!formData.repPhone || !parsedPhone || !parsedPhone.isValid()) {
          err.repPhone = "Invalid phone number. Use e.g. 07XXXXXXXX";
        }
      }

      if (!consentChecked) {
        err.consent = "Legal consent is mandatory to continue";
      }
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };



  const handleSubmitRegistration = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        registration_type: regType,
        full_name: regType === 'individual' ? `${formData.firstName} ${formData.lastName}`.trim() : formData.groupName,
        phone: formData.phone || formData.repPhone || '',
        id_number: formData.idNumber || formData.repIdNumber || '',
        county: formData.county || '',
        sub_county: formData.constituency || '',
        ward: formData.ward || '',
        payment_ref: manualTxId || '',
        group_members: groupMembers || [],
        details: formData,
        status: 'Submitted',
        signup_source: typeof window !== 'undefined' ? `Join Us Membership Portal (${window.location.pathname})` : 'Join Us Portal',
        created_at: new Date().toISOString()
      };

      // Save to Supabase membership_registrations table
      const { error } = await supabase.from('membership_registrations').insert([payload]);
      if (error) {
        console.warn('Supabase membership_registrations notice:', error);
        // Fallback to leads
        try {
          await supabase.from('leads').insert([{
            full_name: payload.full_name,
            phone: payload.phone,
            type: 'Registration',
            details: payload,
            status: 'New',
            signup_source: 'Join Us Portal',
            created_at: new Date().toISOString()
          }]);
        } catch {}
      }

      const mockRegId = "REG-" + Date.now().toString(36).toUpperCase();
      setRegistrationId(mockRegId);
      setCurrentStep('success');
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER HELPERS ---

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 p-6 md:p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#C0991B]/10 text-[#C0991B] rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-[#074504] uppercase tracking-tighter leading-[0.9] mb-4">
                Neema HEEP <br/>
                <span className="text-[#C0991B]">Membership</span>
              </h1>
              <p className="text-gray-500 font-medium max-w-sm mx-auto text-sm">
                Join a trusted community empowering growth, prosperity, and financial inclusion.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Individual Card */}
              <div className="bg-white border-2 border-[#074504]/10 rounded-[2.5rem] p-8 hover:border-[#599200] transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#599200]/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                <User className="w-8 h-8 text-[#599200] mb-6" />
                <h3 className="text-xl font-black text-[#074504] uppercase mb-4">Individual</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#599200] shrink-0" /> Transparent & affordable registration fee structures communicated upon consultation
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#599200] shrink-0" /> Valid Kenyan National ID / Passport
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#599200] shrink-0" /> Passport Photo & Active Contact Details
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#599200] shrink-0" /> Active M-Pesa Phone Number
                  </li>
                </ul>
                <button 
                  onClick={() => { setRegType('individual'); setCurrentStep('details'); }}
                  className="w-full py-4 bg-[#074504] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:shadow-[#074504]/20 transition-all flex items-center justify-center gap-2"
                >
                  Register as Individual <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Group Card */}
              <div className="bg-white border-2 border-[#C0991B]/10 rounded-[2.5rem] p-8 hover:border-[#C0991B] transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#C0991B]/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                <Users className="w-8 h-8 text-[#C0991B] mb-6" />
                <h3 className="text-xl font-black text-[#074504] uppercase mb-4">Group / Chamas</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#C0991B] shrink-0" /> Transparent & affordable registration fee structures communicated upon consultation
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#C0991B] shrink-0" /> Group Representative National ID
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#C0991B] shrink-0" /> Chama / Group Member Roster & Details
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#C0991B] shrink-0" /> Active M-Pesa Number for Official Account
                  </li>
                </ul>
                <button 
                  onClick={() => { setRegType('group'); setCurrentStep('details'); }}
                  className="w-full py-4 bg-[#C0991B] text-[#074504] rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:shadow-[#C0991B]/20 transition-all flex items-center justify-center gap-2"
                >
                  Register as Group <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100 flex gap-6 items-start">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">M-Pesa Payment Instructions</p>
                  <p className="text-sm text-amber-900 font-bold leading-relaxed mb-4">
                    When making your payment via M-Pesa, you <span className="underline">must use your ID Number</span> as the Account Number.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm min-w-[120px]">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Paybill</p>
                      <p className="font-black text-[#074504] text-lg">974850</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm min-w-[120px]">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Account Number</p>
                      <p className="font-black text-[#074504] text-lg">Your ID Number</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'details':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 md:p-12 space-y-10">
            <header className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentStep('welcome')}
                className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-black text-[#074504] uppercase tracking-tight">
                  {regType === 'individual' ? 'Personal Details' : 'Group Information'}
                </h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Step 2 of 5</p>
              </div>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
              {regType === 'individual' ? (
                <>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">First Name</label>
                    <input 
                      type="text" 
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#599200] font-bold text-[#074504]"
                      placeholder="e.g. Samuel"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Last Name</label>
                    <input 
                      type="text" 
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#599200] font-bold text-[#074504]"
                      placeholder="e.g. Kibaki"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">National ID</label>
                    <input 
                      type="text" 
                      value={formData.idNumber}
                      onChange={e => setFormData({...formData, idNumber: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#599200] font-bold text-[#074504]"
                      placeholder="12345678"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#599200] font-bold text-[#074504]"
                      placeholder="07XX XXX XXX"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Group Name</label>
                    <input 
                      type="text" 
                      value={formData.groupName}
                      onChange={e => setFormData({...formData, groupName: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#599200] font-bold text-[#074504]"
                      placeholder="e.g. Unity Self Help Group"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Group Type</label>
                    <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#599200] font-bold text-[#074504]">
                      <option>Self Help Group</option>
                      <option>Business Chama</option>
                      <option>Farmer Cooperative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Member Count</label>
                    <input 
                      type="number" 
                      value={formData.memberCount}
                      onChange={e => setFormData({...formData, memberCount: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-[#599200] font-bold text-[#074504]"
                      placeholder="e.g. 15"
                    />
                  </div>
                </>
              )}

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">County</label>
                   <select 
                    value={formData.county}
                    onChange={e => setFormData({...formData, county: e.target.value, constituency: '', ward: ''})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 outline-none font-bold text-[#074504] focus:border-[#599200]"
                   >
                     <option value="">Select County</option>
                     {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Sub-county (Constituency)</label>
                  {formData.county ? (
                    <select 
                      value={formData.constituency}
                      onChange={e => setFormData({...formData, constituency: e.target.value, ward: ''})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 outline-none font-bold text-[#074504] focus:border-[#599200]"
                    >
                      <option value="">Select Sub-county</option>
                      {COUNTY_DATA[formData.county].subCounties.map(sc => (
                        <option key={sc} value={sc}>{sc}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <select disabled className="w-full bg-gray-100 border border-gray-100 rounded-2xl px-4 py-4 outline-none font-bold text-gray-400 cursor-not-allowed">
                      <option value="">Select County First</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Ward Location</label>
                  {formData.county && formData.constituency ? (
                    <select 
                      value={formData.ward}
                      onChange={e => setFormData({...formData, ward: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 outline-none font-bold text-[#074504] focus:border-[#599200]"
                    >
                      <option value="">Select Ward</option>
                      {COUNTY_DATA[formData.county].wards[formData.constituency].map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <select disabled className="w-full bg-gray-100 border border-gray-100 rounded-2xl px-4 py-4 outline-none font-bold text-gray-400 cursor-not-allowed">
                      <option value="">Select Sub-county First</option>
                    </select>
                  )}
                </div>
              </div>
            </div>

            {regType === 'group' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-black text-[#074504] uppercase tracking-tight">Group Members</h3>
                   <button 
                    onClick={addGroupMember}
                    className="bg-[#599200]/10 text-[#599200] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#599200] hover:text-white transition-all"
                   >
                     <Plus className="w-4 h-4" /> Add Member
                   </button>
                </div>
                <div className="space-y-4">
                  {groupMembers.map((m, i) => (
                    <div key={m.id} className="bg-white border border-gray-100 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4 relative group">
                       <input 
                        placeholder="Full Name" 
                        value={m.fullName}
                        onChange={e => updateGroupMember(m.id, 'fullName', e.target.value)}
                        className="bg-gray-50 border-none rounded-xl px-4 py-2 font-bold text-sm text-[#074504]"
                       />
                       <input 
                        placeholder="Phone" 
                        value={m.phone}
                        onChange={e => updateGroupMember(m.id, 'phone', e.target.value)}
                        className="bg-gray-50 border-none rounded-xl px-4 py-2 font-bold text-sm text-[#074504]"
                       />
                       <input 
                        placeholder="ID Number" 
                        value={m.idNumber}
                        onChange={e => updateGroupMember(m.id, 'idNumber', e.target.value)}
                        className="bg-gray-50 border-none rounded-xl px-4 py-2 font-bold text-sm text-[#074504]"
                       />
                       <div className="flex items-center gap-2">
                        <select 
                          value={m.role}
                          onChange={e => updateGroupMember(m.id, 'role', e.target.value)}
                          className="flex-grow bg-gray-50 border-none rounded-xl px-4 py-2 font-bold text-sm text-[#074504] appearance-none"
                        >
                          <option>Member</option>
                          <option>Chairperson</option>
                          <option>Secretary</option>
                          <option>Treasurer</option>
                        </select>
                        <button onClick={() => removeGroupMember(m.id)} className="text-red-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                       </div>
                    </div>
                  ))}
                  {groupMembers.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-[2rem] text-gray-400 italic text-xs">
                      No members added yet. Click 'Add Member' to begin.
                    </div>
                  )}
                </div>
              </div>
            )}

            {Object.keys(errors).length > 0 && (
              <div className="flex flex-col gap-2 bg-red-50 p-6 rounded-3xl border border-red-100 text-xs font-bold text-red-600 leading-relaxed">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>Please resolve the following errors:</span>
                </div>
                <ul className="list-disc pl-5 mt-1 font-semibold space-y-1">
                  {Object.entries(errors).map(([key, value]) => (
                    <li key={key} className="uppercase tracking-tight text-[10px]">
                      {key}: {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-1">
                  <input 
                    type="checkbox" 
                    className="peer sr-only" 
                    checked={consentChecked}
                    onChange={e => setConsentChecked(e.target.checked)}
                  />
                  <div className="w-5 h-5 border-2 border-gray-200 rounded-md bg-white peer-checked:bg-[#599200] peer-checked:border-[#599200] transition-all duration-200" />
                  <CheckCircle2 className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-tight">
                  I agree to the Terms of Service and Privacy Policy, and consent to be contacted regarding my inquiry.
                </span>
              </label>
            </div>

            <button 
              onClick={() => { if(validate()) setCurrentStep('uploads'); }}
              className="w-full py-5 bg-[#074504] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3"
            >
              Continue to Uploads <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        );

      case 'uploads':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 md:p-12 space-y-10">
            <header className="flex items-center gap-4">
              <button onClick={() => setCurrentStep('details')} className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all"><ArrowLeft className="w-5 h-5"/></button>
              <div>
                <h2 className="text-2xl font-black text-[#074504] uppercase tracking-tight">Document Uploads</h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Step 3 of 5</p>
              </div>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { key: 'passportPhoto', label: 'Passport Photo', icon: <Camera />, desc: 'Recent color photo' },
                { key: 'idFront', label: 'ID Front Side', icon: <FileText />, desc: 'National ID (Front)' },
                { key: 'idBack', label: 'ID Back Side', icon: <CreditCard />, desc: 'National ID (Back)' }
              ].map(({ key, label, icon, desc }) => (
                <div key={key} className="space-y-4">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</p>
                   <div className="relative group">
                      <input 
                        type="file" 
                        id={key} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, key as any)}
                      />
                      <label 
                        htmlFor={key}
                        className={`flex flex-col items-center justify-center aspect-square rounded-[2rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                          previews[key as keyof typeof previews] ? 'border-[#599200] bg-[#599200]/5' : 'border-gray-100 bg-gray-50 hover:border-[#C0991B] hover:bg-white'
                        }`}
                      >
                         {previews[key as keyof typeof previews] ? (
                           <img src={previews[key as keyof typeof previews]} alt="Preview" className="w-full h-full object-cover" />
                         ) : (
                           <>
                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-[#C0991B] mb-3 shadow-sm">
                               {icon}
                             </div>
                             <p className="text-[10px] font-black text-[#074504] uppercase tracking-tighter mb-1 text-center">Click to Upload</p>
                             <p className="text-[8px] text-gray-400 text-center px-4 font-bold">{desc}</p>
                           </>
                         )}
                      </label>
                      {previews[key as keyof typeof previews] && (
                        <button 
                          onClick={() => {
                            setFiles(prev => ({...prev, [key]: null}));
                            setPreviews(prev => ({...prev, [key]: ''}));
                          }}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                   </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setCurrentStep('payment')}
              className="w-full py-5 bg-[#074504] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3"
            >
              Proceed to Payment <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        );

      case 'payment':
        const fee = regType === 'individual' ? INDIVIDUAL_FEE : (GROUP_FEE_PER_MEMBER * Math.max(1, groupMembers.length));
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 md:p-12 space-y-10">
            <header className="flex items-center gap-4">
              <button onClick={() => setCurrentStep('uploads')} className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all"><ArrowLeft className="w-5 h-5"/></button>
              <div>
                <h2 className="text-2xl font-black text-[#074504] uppercase tracking-tight">Fee Payment</h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Step 4 of 5</p>
              </div>
            </header>

            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#599200]/20 rounded-full blur-[60px]" />
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-[10px] font-black text-[#C0991B] uppercase tracking-[0.2em] mb-2">Registration Fee</h3>
                    <p className="text-4xl font-black">KES {fee.toLocaleString()}</p>
                    <p className="text-[10px] text-white/50 uppercase mt-2">Payable to: Neema HEEP Microfinance</p>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                       <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Paybill</p>
                       <p className="font-black text-[#074504]">{PAYBILL}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                       <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Account</p>
                       <p className="font-black text-[#074504]">{regType.toUpperCase()}-{formData.idNumber || 'NEW'}</p>
                    </div>
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">M-Pesa Transaction Code</label>
                   <input 
                    type="text" 
                    value={manualTxId}
                    onChange={e => setManualTxId(e.target.value.toUpperCase())}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 font-black text-lg text-[#074504] placeholder:text-gray-200"
                    placeholder="e.g. RFG8H9JKL2"
                   />
                 </div>
                 <button 
                  disabled={!manualTxId}
                  onClick={() => setCurrentStep('review')}
                  className="w-full py-5 bg-[#074504] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg disabled:opacity-50"
                 >
                   Submit & Verify
                 </button>
              </div>
            </div>
          </motion.div>
        );

      case 'review':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 md:p-12 space-y-10">
            <header className="flex items-center gap-4">
              <button onClick={() => setCurrentStep('payment')} className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all"><ArrowLeft className="w-5 h-5"/></button>
              <div>
                <h2 className="text-2xl font-black text-[#074504] uppercase tracking-tight">Review & Confirm</h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Final Step</p>
              </div>
            </header>

            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
                <p className="text-[10px] font-black text-[#074504] uppercase tracking-widest border-b border-gray-200 pb-2">Core Details</p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                   <div><p className="text-gray-400 uppercase mb-1">Type</p><p className="font-bold text-[#074504] uppercase">{regType}</p></div>
                   <div><p className="text-gray-400 uppercase mb-1">Phone</p><p className="font-bold text-[#074504]">{formData.phone}</p></div>
                   {regType === 'individual' ? (
                     <div className="col-span-2"><p className="text-gray-400 uppercase mb-1">Applicant</p><p className="font-bold text-[#074504]">{formData.firstName} {formData.lastName}</p></div>
                   ) : (
                     <div className="col-span-2"><p className="text-gray-400 uppercase mb-1">Group Name</p><p className="font-bold text-[#074504]">{formData.groupName}</p></div>
                   )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
                <p className="text-[10px] font-black text-[#074504] uppercase tracking-widest border-b border-gray-200 pb-2">Documents Verified</p>
                <div className="flex gap-4">
                  {Object.entries(previews).map(([key, src]) => src && (
                    <div key={key} className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                      <img src={src} alt="Upload" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Payment Completed</p>
                    <p className="text-xs font-bold text-emerald-700">Ref: {manualTxId || 'Verified via M-Pesa'}</p>
                 </div>
                 <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
            </div>

            <div className="space-y-6">
              <label className="flex items-start gap-4 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-[#599200] focus:ring-[#599200] cursor-pointer" 
                    checked={consentConfirm}
                    onChange={e => setConsentConfirm(e.target.checked)}
                    required 
                  />
                  <span className="text-xs font-semibold text-gray-500 leading-relaxed group-hover:text-[#074504] transition-colors">
                    I confirm that the information provided is true and accurate to the best of my knowledge. I understand that falsifying details may lead to disqualification.
                  </span>
              </label>

              <button 
                disabled={isSubmitting || !consentConfirm}
                onClick={handleSubmitRegistration}
                className="w-full py-5 bg-[#074504] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Finalizing...' : 'Complete Registration'}
              </button>
            </div>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-12 text-center space-y-8">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
               <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-black text-[#074504] uppercase tracking-tighter">Registration Successful</h2>
              <p className="text-gray-400 font-medium lowercase tracking-tighter">Reference: #{registrationId?.slice(-6).toUpperCase()}</p>
            </div>
            
            <div className="max-w-md mx-auto p-4 bg-gray-50 border border-gray-100 rounded-[2rem] text-xs font-medium text-gray-500 leading-relaxed">
              Your membership request has been received. Our team will verify your documents and payment promptly. You will receive an SMS confirmation with your official <span className="font-bold text-[#074504]">Member Number</span>.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                className="w-full py-5 bg-white border-2 border-[#074504] text-[#074504] rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#074504] hover:text-white transition-all shadow-sm"
              >
                <Download className="w-4 h-4" /> Download Receipt
              </button>
              <button 
                onClick={() => navigate('/')}
                className="w-full py-5 bg-[#074504] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#053303] transition-all shadow-xl"
              >
                Return to Home
              </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-[#f8faf8] font-sans pb-24 pt-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header Branding (Mobile focused) */}
        <div className="lg:hidden flex justify-center mb-8">
           <img 
             src={encodeURI("/NEEMA HEEP LOGO.jpeg")} 
             alt="Logo" 
             loading="lazy"
             decoding="async"
             onError={(e) => {
               const target = e.currentTarget;
               if (!target.dataset.triedFallback) {
                 target.dataset.triedFallback = 'true';
                 target.src = "/Header logo.jpeg";
               }
             }}
             className="h-12 w-auto object-contain" 
           />
        </div>

        {/* Step Indicator (Desktop) */}
        {currentStep !== 'welcome' && currentStep !== 'success' && (
          <ProgressIndicator 
            step={['details', 'uploads', 'payment', 'review'].indexOf(currentStep) + 2} 
            steps={['Onboarding', 'Details', 'Uploads', 'Payment', 'Review']} 
          />
        )}

        <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
           {renderStep()}
        </div>

        {currentStep === 'welcome' && (
          <div className="mt-12 text-center space-y-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trusted by 15,000+ Members Across Kenya</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
               <img src="/usaid_logo.png" loading="lazy" decoding="async" onError={(e) => { e.currentTarget.src = "https://lh3.googleusercontent.com/d/1PhQJZjUieQd2DBXot1QXfP8lETA3NeB4"; }} alt="USAID" className="h-6 w-auto object-contain" />
               <img src="/kcb_logo.png" loading="lazy" decoding="async" onError={(e) => { e.currentTarget.src = "https://lh3.googleusercontent.com/d/1lOM7DWOkRUS24xL_wdFl7P-O7boarFW5"; }} alt="KCB" className="h-6 w-auto object-contain" />
               <img src="/musoni_logo.png" loading="lazy" decoding="async" onError={(e) => { e.currentTarget.src = "https://lh3.googleusercontent.com/d/18bwtrkXovP9_vjEb5NEmjOtoD2ltqbwg"; }} alt="Musoni" className="h-6 w-auto object-contain" />
               <img src="/amfi_logo.png" loading="lazy" decoding="async" onError={(e) => { e.currentTarget.src = "https://lh3.googleusercontent.com/d/1uGjWzkaQmCE6c1XAS8K8cun4RmmMpIkO"; }} alt="AMFI" className="h-6 w-auto object-contain" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
