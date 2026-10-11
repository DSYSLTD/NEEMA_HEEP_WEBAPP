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
import { generateUniqueFormIdentifier } from '../lib/identifierUtils';
import { exportOfficialReceiptPdf } from '../lib/pdfPrintUtils';
import { uploadFileToBucket } from '../lib/storageUtils';
import UploadRequirementsNotice, { RequiredDocumentItem } from '../components/UploadRequirementsNotice';
import MpesaPaymentCapture, { ParsedMpesaTransaction } from '../components/MpesaPaymentCapture';

const INDIVIDUAL_DOCUMENTS: RequiredDocumentItem[] = [
  {
    name: 'Kenyan National ID / Passport',
    description: 'Crisp, high-resolution scanned copy or clear mobile photo of both the front and back of your ID.',
    acceptedFormats: 'PDF, JPG, PNG',
    maxSize: '5MB',
    required: true
  },
  {
    name: 'Passport-Sized Photograph',
    description: 'Recent colored photograph with a clear facial view taken against a neutral or plain background.',
    acceptedFormats: 'JPG, PNG',
    maxSize: '5MB',
    required: true
  },
  {
    name: 'KRA PIN Certificate',
    description: 'Official Kenya Revenue Authority (iTax) taxpayer personal identification certificate.',
    acceptedFormats: 'PDF, JPG',
    maxSize: '5MB',
    required: false
  }
];

const GROUP_DOCUMENTS: RequiredDocumentItem[] = [
  {
    name: 'Registration Certificate',
    description: 'Official certificate from the Ministry of Social Services, Registrar of Groups, or County Government.',
    acceptedFormats: 'PDF, JPG, PNG',
    maxSize: '5MB',
    required: true
  },
  {
    name: 'Group Constitution / By-Laws',
    description: 'Signed copy of the group constitution, objectives, and governing operational rules.',
    acceptedFormats: 'PDF',
    maxSize: '5MB',
    required: true
  },
  {
    name: 'List of Active Members',
    description: 'Comprehensive roster of all group members with their full names, ID numbers, and phone contacts.',
    acceptedFormats: 'PDF, Excel, JPG',
    maxSize: '5MB',
    required: true
  },
  {
    name: 'Executive Officials Identification',
    description: 'Scanned ID cards of the group representative, Chairperson, Secretary, and Treasurer.',
    acceptedFormats: 'PDF, JPG',
    maxSize: '5MB',
    required: true
  }
];

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
  const [mpesaRawMessage, setMpesaRawMessage] = useState('');
  const [mpesaAmount, setMpesaAmount] = useState<number>(INDIVIDUAL_FEE);
  const [mpesaTimestamp, setMpesaTimestamp] = useState('');
  const [mpesaScreenshotName, setMpesaScreenshotName] = useState('');
  const [docRequirementsAck, setDocRequirementsAck] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [submittedReceiptData, setSubmittedReceiptData] = useState<any>(null);

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
      if (regType === 'individual') {
        const uniqueTrackingId = generateUniqueFormIdentifier('individual_registration');

        // 1. Upload photos/documents to appropriate buckets
        let passportUrl = previews.passportPhoto || '';
        let idFrontUrl = previews.idFront || '';
        let idBackUrl = previews.idBack || '';

        if (files.passportPhoto) {
          try {
            const up = await uploadFileToBucket(files.passportPhoto, 'member-photos', `passport_${uniqueTrackingId}.jpg`);
            passportUrl = up.url;
          } catch (e) {
            console.warn("Notice uploading passport photo to member-photos bucket:", e);
          }
        }
        if (files.idFront) {
          try {
            const up = await uploadFileToBucket(files.idFront, 'member-documents', `id_front_${uniqueTrackingId}.jpg`);
            idFrontUrl = up.url;
          } catch (e) {
            console.warn("Notice uploading ID front to member-documents bucket:", e);
          }
        }
        if (files.idBack) {
          try {
            const up = await uploadFileToBucket(files.idBack, 'member-documents', `id_back_${uniqueTrackingId}.jpg`);
            idBackUrl = up.url;
          } catch (e) {
            console.warn("Notice uploading ID back to member-documents bucket:", e);
          }
        }

        const fullNameVal = `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`.trim();
        const individualPayload = {
          trackingId: uniqueTrackingId,
          unique_identifier: uniqueTrackingId,
          registration_number: uniqueTrackingId,
          first_name: formData.firstName || '',
          middle_name: formData.middleName || '',
          last_name: formData.lastName || '',
          full_name: fullNameVal,
          gender: formData.gender || '',
          dob: formData.dob || null,
          id_number: formData.idNumber || '',
          kra_pin: formData.kraPin || '',
          phone: formData.phone || '',
          alt_phone: formData.altPhone || '',
          email: formData.email || '',
          county: formData.county || '',
          sub_county: formData.constituency || '',
          ward: formData.ward || '',
          physical_address: formData.physicalAddress || '',
          passport_photo: passportUrl,
          id_photo_front: idFrontUrl,
          id_photo_back: idBackUrl,
          payment_ref: manualTxId || '',
          payment_amount: INDIVIDUAL_FEE,
          payment_message: mpesaRawMessage || '',
          payment_timestamp: mpesaTimestamp || new Date().toISOString(),
          payment_status: 'Paid',
          details: {
            ...formData,
            passportUrl,
            idFrontUrl,
            idBackUrl,
            trackingId: uniqueTrackingId
          },
          status: 'Submitted',
          signup_source: typeof window !== 'undefined' ? `Individual Registration (${window.location.pathname})` : 'Individual Registration',
          created_at: new Date().toISOString()
        };

        // 2. Persist to server /api/registrations/individual
        try {
          await fetch('/api/registrations/individual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(individualPayload)
          });
        } catch (apiErr) {
          console.warn("Server registration sync notice:", apiErr);
        }

        // 3. Direct Supabase insert
        try {
          await supabase.from('individual_registrations').insert([individualPayload]);
        } catch {}

        // 4. Prepare Receipt Data
        setSubmittedReceiptData({
          receiptTitle: 'OFFICIAL INDIVIDUAL MEMBERSHIP REGISTRATION RECEIPT',
          uniqueIdentifier: uniqueTrackingId,
          formType: 'individual_registration',
          applicantName: fullNameVal,
          applicantPhone: formData.phone,
          applicantEmail: formData.email,
          applicantIdNumber: formData.idNumber,
          county: formData.county,
          amountPaid: INDIVIDUAL_FEE,
          paymentRef: manualTxId || 'PAID',
          paymentMessage: mpesaRawMessage || undefined,
          paymentTimestamp: mpesaTimestamp || new Date().toISOString(),
          sections: [
            {
              sectionTitle: 'Applicant Demographic & KYC Data',
              items: [
                { label: 'Full Legal Name', value: fullNameVal },
                { label: 'National ID / Passport', value: formData.idNumber || 'Not provided' },
                { label: 'KRA Taxpayer PIN', value: formData.kraPin || 'Not provided' },
                { label: 'Date of Birth / Gender', value: `${formData.dob || 'N/A'} • ${formData.gender || 'N/A'}` },
                { label: 'County & Sub-County', value: `${formData.county || 'N/A'} • ${formData.constituency || 'N/A'}` },
                { label: 'Ward & Physical Address', value: `${formData.ward || 'N/A'} • ${formData.physicalAddress || 'N/A'}` },
                { label: 'Contact Phone & Email', value: `${formData.phone} • ${formData.email || 'N/A'}` }
              ]
            },
            {
              sectionTitle: 'Uploaded Documents & Storage Bucket References',
              items: [
                { label: 'Passport Photograph', value: passportUrl ? 'Stored in member-photos bucket' : 'Attached' },
                { label: 'National ID (Front)', value: idFrontUrl ? 'Stored in member-documents bucket' : 'Attached' },
                { label: 'National ID (Back)', value: idBackUrl ? 'Stored in member-documents bucket' : 'Attached' }
              ]
            },
            {
              sectionTitle: 'Statutory Verification & Data Attestation',
              items: [
                { label: 'Identity & Registration Status', value: 'Complete & Submitted' },
                { label: 'Phone & Communication Status', value: 'Recorded for SMS/WhatsApp notices' },
                { label: 'Data Protection Compliance', value: 'Compliant with Kenyan Data Protection Act 2019' }
              ]
            }
          ]
        });

        setRegistrationId(uniqueTrackingId);
        setCurrentStep('success');
      } else {
        const uniqueTrackingId = generateUniqueFormIdentifier('group_registration');
        const memberCountNum = parseInt(formData.memberCount, 10) || (groupMembers ? groupMembers.length : 1);
        const groupFeeTotal = memberCountNum * GROUP_FEE_PER_MEMBER;

        const groupPayload = {
          trackingId: uniqueTrackingId,
          unique_identifier: uniqueTrackingId,
          registration_number: uniqueTrackingId,
          group_name: formData.groupName || 'Unnamed Group',
          group_type: formData.groupType || 'Chama / Self Help Group',
          registration_certificate_no: formData.groupRegNumber || '',
          formation_date: formData.yearFounded || null,
          member_count: memberCountNum,
          county: formData.county || '',
          sub_county: formData.constituency || '',
          ward: formData.ward || '',
          physical_address: formData.physicalAddress || '',
          representative_name: `${formData.repFirstName} ${formData.repMiddleName ? formData.repMiddleName + ' ' : ''}${formData.repLastName}`.trim() || 'Group Representative',
          representative_role: formData.repPosition || 'Chairperson',
          representative_id_number: formData.repIdNumber || '',
          representative_phone: formData.repPhone || '',
          group_members: groupMembers || [],
          payment_ref: manualTxId || '',
          payment_amount: groupFeeTotal,
          payment_message: mpesaRawMessage || '',
          payment_timestamp: mpesaTimestamp || new Date().toISOString(),
          payment_status: 'Paid',
          details: {
            ...formData,
            groupMembers,
            trackingId: uniqueTrackingId
          },
          status: 'Submitted',
          signup_source: typeof window !== 'undefined' ? `Group Registration (${window.location.pathname})` : 'Group Registration',
          created_at: new Date().toISOString()
        };

        // 2. Persist to server /api/registrations/group
        try {
          await fetch('/api/registrations/group', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(groupPayload)
          });
        } catch (apiErr) {
          console.warn("Server group registration sync notice:", apiErr);
        }

        // 3. Direct Supabase insert
        try {
          await supabase.from('group_registrations').insert([groupPayload]);
        } catch {}

        // 4. Prepare Receipt Data
        setSubmittedReceiptData({
          receiptTitle: 'OFFICIAL GROUP MEMBERSHIP REGISTRATION RECEIPT',
          uniqueIdentifier: uniqueTrackingId,
          formType: 'group_registration',
          applicantName: formData.groupName || 'Group Member Registration',
          applicantPhone: formData.repPhone,
          applicantEmail: formData.email,
          applicantIdNumber: formData.repIdNumber,
          county: formData.county,
          amountPaid: groupFeeTotal,
          paymentRef: manualTxId || 'PAID',
          paymentMessage: mpesaRawMessage || undefined,
          paymentTimestamp: mpesaTimestamp || new Date().toISOString(),
          sections: [
            {
              sectionTitle: 'Group Institutional Details',
              items: [
                { label: 'Group Name', value: formData.groupName || 'N/A' },
                { label: 'Group Classification', value: formData.groupType || 'Chama / Self Help Group' },
                { label: 'Registration Cert No', value: formData.groupRegNumber || 'In Progress' },
                { label: 'Formation Year', value: formData.yearFounded || 'N/A' },
                { label: 'Total Enrolled Members', value: `${memberCountNum} members` },
                { label: 'Location Jurisdiction', value: `${formData.county} County • ${formData.constituency} • ${formData.ward}` }
              ]
            },
            {
              sectionTitle: 'Executive Representative Profile',
              items: [
                { label: 'Representative Name', value: `${formData.repFirstName} ${formData.repLastName}`.trim() },
                { label: 'Executive Role', value: formData.repPosition || 'Chairperson' },
                { label: 'National ID Number', value: formData.repIdNumber || 'N/A' },
                { label: 'Mobile Contact', value: formData.repPhone || 'N/A' }
              ]
            },
            {
              sectionTitle: 'Group Roster & Document Bucket Reference',
              items: [
                { label: 'Group Member Register', value: `${groupMembers.length} member records attached` },
                { label: 'Group Storage Bucket', value: 'Stored in group-documents bucket' },
                { label: 'Compliance Status', value: 'Statutory compliance logged under Kenyan Law' }
              ]
            }
          ]
        });

        setRegistrationId(uniqueTrackingId);
        setCurrentStep('success');
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please check network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!submittedReceiptData) return;
    try {
      await exportOfficialReceiptPdf(submittedReceiptData);
    } catch (e) {
      console.error("Receipt generation error:", e);
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
              <p className="text-gray-500 font-medium max-w-lg mx-auto text-sm">
                Join a trusted community empowering growth, prosperity, and financial inclusion.
              </p>
            </div>

            {/* PRE-APPLICATION DOCUMENT & UPLOAD NOTICE (BEFORE STEP 1) */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 p-1.5 bg-gray-100 rounded-2xl max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={() => setRegType('individual')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    regType === 'individual'
                      ? 'bg-white text-[#074504] shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Individual Documents
                </button>
                <button
                  type="button"
                  onClick={() => setRegType('group')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    regType === 'group'
                      ? 'bg-white text-[#074504] shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Group Documents
                </button>
              </div>

              <UploadRequirementsNotice
                formType="registration"
                title={`${regType === 'individual' ? 'Individual' : 'Group / Chama'} Document Requirements Checklist`}
                subtitle="To ensure your membership is approved rapidly, review the required documents below and have them ready on your device before starting Step 1."
                documents={regType === 'individual' ? INDIVIDUAL_DOCUMENTS : GROUP_DOCUMENTS}
                acknowledged={docRequirementsAck}
                setAcknowledged={setDocRequirementsAck}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-2">
              {/* Individual Card */}
              <div className={`bg-white border-2 rounded-[2.5rem] p-8 transition-all group overflow-hidden relative ${
                regType === 'individual' ? 'border-[#074504] shadow-lg ring-2 ring-[#074504]/20' : 'border-[#074504]/10 hover:border-[#599200]'
              }`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#599200]/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                <User className="w-8 h-8 text-[#599200] mb-6" />
                <h3 className="text-xl font-black text-[#074504] uppercase mb-4">Individual Membership</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#599200] shrink-0" /> Fee: KES {INDIVIDUAL_FEE.toLocaleString()} one-off registration
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#599200] shrink-0" /> Valid Kenyan National ID / Passport (Front & Back)
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#599200] shrink-0" /> Clear Passport Photo & Contact Details
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#599200] shrink-0" /> Active M-Pesa Phone Number
                  </li>
                </ul>
                <button 
                  onClick={() => { setRegType('individual'); setCurrentStep('details'); }}
                  className="w-full py-4 bg-[#074504] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:shadow-[#074504]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Start Step 1: Personal Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Group Card */}
              <div className={`bg-white border-2 rounded-[2.5rem] p-8 transition-all group overflow-hidden relative ${
                regType === 'group' ? 'border-[#C0991B] shadow-lg ring-2 ring-[#C0991B]/20' : 'border-[#C0991B]/10 hover:border-[#C0991B]'
              }`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#C0991B]/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                <Users className="w-8 h-8 text-[#C0991B] mb-6" />
                <h3 className="text-xl font-black text-[#074504] uppercase mb-4">Group / Chama Membership</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#C0991B] shrink-0" /> Fee: KES {GROUP_FEE_PER_MEMBER.toLocaleString()} per member
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#C0991B] shrink-0" /> Group Registration Certificate
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#C0991B] shrink-0" /> Signed Constitution & Member Roster
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-[#C0991B] shrink-0" /> Group Representative National ID
                  </li>
                </ul>
                <button 
                  onClick={() => { setRegType('group'); setCurrentStep('details'); }}
                  className="w-full py-4 bg-[#C0991B] text-[#074504] rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:shadow-[#C0991B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Start Step 1: Group Details <ArrowRight className="w-4 h-4" />
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
        const accountNum = `${regType.toUpperCase()}-${formData.idNumber || 'NEW'}`;
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 md:p-12 space-y-8">
            <header className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentStep('uploads')} 
                className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5"/>
              </button>
              <div>
                <h2 className="text-2xl font-black text-[#074504] uppercase tracking-tight">Fee Payment</h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Step 4 of 5: M-Pesa Payment &amp; Message Capture</p>
              </div>
            </header>

            {/* M-PESA PAYMENT & MESSAGE CAPTURE */}
            <MpesaPaymentCapture
              paybill={PAYBILL}
              accountNumber={accountNum}
              expectedAmount={fee}
              recipientName="NEEMA HEEP"
              initialMessage={mpesaRawMessage}
              initialTxCode={manualTxId}
              onPaymentCaptured={(data) => {
                if (data.txCode) setManualTxId(data.txCode);
                if (data.rawMessage) setMpesaRawMessage(data.rawMessage);
                if (data.amount) setMpesaAmount(data.amount);
                if (data.dateTime) setMpesaTimestamp(data.dateTime);
                if (data.screenshotName) setMpesaScreenshotName(data.screenshotName);
              }}
            />

            <div className="pt-2">
              <button 
                disabled={!manualTxId || manualTxId.length < 6}
                onClick={() => setCurrentStep('review')}
                className="w-full py-5 bg-[#074504] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-[#053203] transition-all"
              >
                Proceed to Review &amp; Confirm <ArrowRight className="w-4 h-4" />
              </button>
              {!manualTxId && (
                <p className="text-center text-[10px] text-amber-700 font-bold uppercase tracking-wider mt-2">
                  Please paste or enter your M-Pesa payment SMS confirmation message above to verify your payment.
                </p>
              )}
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

              <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 space-y-3">
                 <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-0.5">M-Pesa Payment Captured</p>
                      <p className="text-sm font-black text-[#074504] font-mono">Ref: {manualTxId} (KES {mpesaAmount.toLocaleString()})</p>
                      {mpesaTimestamp && (
                        <p className="text-[10px] text-gray-500 font-medium">Timestamp: {mpesaTimestamp}</p>
                      )}
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
                 </div>
                 {mpesaRawMessage && (
                   <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 text-[11px] text-gray-700 font-mono leading-relaxed">
                     <span className="text-[9px] font-black uppercase text-gray-400 block mb-1">Captured M-Pesa SMS:</span>
                     "{mpesaRawMessage}"
                   </div>
                 )}
                 {mpesaScreenshotName && (
                   <p className="text-[10px] font-bold text-emerald-700">Attached Proof: {mpesaScreenshotName}</p>
                 )}
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
              <div className="inline-block px-4 py-2 bg-[#074504]/5 border border-[#074504]/10 rounded-2xl">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  Unique Registration Tracking ID
                </p>
                <p className="text-sm md:text-base font-black font-mono text-[#074504] tracking-wider">
                  {registrationId}
                </p>
              </div>
            </div>
            
            <div className="max-w-md mx-auto p-4 bg-gray-50 border border-gray-100 rounded-[2rem] text-xs font-medium text-gray-500 leading-relaxed">
              Your membership request and documents have been secured in the appropriate database and document bucket. An official receipt on institutional letterhead has been generated.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={handleDownloadReceipt}
                className="w-full py-5 bg-[#074504] text-[#C0991B] border-2 border-[#C0991B] rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#053203] hover:text-white transition-all shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Official Receipt (PDF)
              </button>
              <button 
                onClick={() => navigate('/')}
                className="w-full py-5 bg-white border-2 border-[#074504] text-[#074504] rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#074504] hover:text-white transition-all shadow-xl cursor-pointer"
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
