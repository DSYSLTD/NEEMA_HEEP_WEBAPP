import React, { useState, useMemo, useEffect } from 'react';
import { 
  User, Users, Globe, CheckCircle2, X, Edit3, Trash2, 
  Search, Mail, Phone, ImageIcon, FileText, Briefcase, GraduationCap, 
  Award, TrendingUp, Eye, Grid, List, ShieldCheck, Check, Plus,
  Lock, ArrowUpRight, ShieldAlert, BookOpen, Clock, HeartHandshake, Calculator, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { profilesStore, ExtendedUserProfile } from '../lib/profilesStore';
export type { ExtendedUserProfile };

// Initial mock dataset of profiles enriched for Neema HEEP Enterprise
const INITIAL_PROFILES: ExtendedUserProfile[] = [
  {
    id: 'usr-1',
    firstName: 'Patrick',
    middleName: 'Munene',
    lastName: 'Kinyua',
    displayName: 'Patrick Munene',
    username: 'pmunene',
    email: 'ptrckmunene@gmail.com',
    phone: '+254 712 345 678',
    whatsApp: '+254 712 345 678',
    gender: 'Male',
    dateOfBirth: '1992-05-14',
    jobTitle: 'Managing Director & Founder',
    department: 'Executive Leadership',
    employeeId: 'NH-EMP-2022-001',
    departmentExtension: 'Ext. 101 (Executive)',
    canCreateArticles: true,
    physicalAddress: 'Neema Heep Plaza, Kimathi Way, Nyeri',
    role: 'Editor',
    status: 'Active',
    verificationStatus: 'Verified',
    profilePhoto: '/developer_teaching_coding.jpg',
    coverPhoto: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    bio: 'Passionate about micro-financing innovation, financial inclusion, and community economic empowerment across Mt. Kenya region.',
    shortBio: 'Founder & CEO at Neema HEEP Microfinance.',
    levelOfEducation: "Master of Science in Finance (M.Sc. Finance)",
    yearsOfExperience: '14+ Years Experience in Microfinance & SME Credit',
    workExperience: [
      'Managing Director & Founder - Neema HEEP Microfinance (2022-Present)',
      'Senior Microfinance & Risk Specialist - Equity Bank Kenya (2016-2022)',
      'SME Credit Analyst - KCB Bank Group (2012-2016)'
    ],
    publicHeadline: 'Managing Director & Microfinance Innovator',
    publicBio: 'Leading micro-lending transformations and agricultural credit accessibility across Mount Kenya. Dedicated to empowering SMEs, female entrepreneurs, and smallholder farming groups.',
    publicPagePublished: true,
    showPublicContact: true,
    preferredLanguage: 'English (UK)',
    timezone: 'Africa/Nairobi (UTC+3)',
    expertise: ['Mt. Kenya Microfinance', 'WASH Sanitation Loans', 'Imara Business Credit', 'Community Healthcare Pairing', 'SME Financial Advisory'],
    certifications: ['Chartered Microfinance Executive (CME)', 'Certified Agribusiness Consultant'],
    education: ['B.Sc. Financial Engineering - Strathmore University', 'M.Sc. Finance - University of Nairobi'],
    memberships: ['Kenya Association of Microfinance Institutions (AMFI)', 'Association of Agribusiness Professionals'],
    stats: {
      articlesPublished: 24,
      draftArticles: 3,
      mediaUploaded: 86,
      commentsModerated: 142,
      communityImpactScore: 98,
      readingCount: 48920,
      guidedLoansCount: 1240,
      lastLogin: '2026-07-24 08:30 AM',
      memberSince: 'January 2022'
    },
    achievements: ['First Article', '100 Articles', 'Impact Champion', 'Verified Author', 'Featured Writer', 'Top Editor']
  },
  {
    id: 'usr-2',
    firstName: 'Jane',
    middleName: 'Wanjiku',
    lastName: 'Muturi',
    displayName: 'Dr. Jane Muturi',
    username: 'jmuturi',
    email: 'jane@neemaheep.co.ke',
    phone: '+254 722 987 654',
    whatsApp: '+254 722 987 654',
    gender: 'Female',
    dateOfBirth: '1988-11-20',
    jobTitle: 'Head of Community Health & Welfare',
    department: 'Social Impact & Healthcare',
    employeeId: 'NH-EMP-2023-014',
    departmentExtension: 'Ext. 204 (Community Health)',
    canCreateArticles: true,
    physicalAddress: 'Neema Heep Hub, Nanyuki Town',
    role: 'Editor',
    status: 'Active',
    verificationStatus: 'Verified',
    profilePhoto: '/Grace Wanjiku.jpeg',
    coverPhoto: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    bio: 'Medical doctor dedicated to pairing preventive healthcare initiatives with micro-loans for rural women entrepreneurs.',
    shortBio: 'Community Health Lead & Preventive Medicine Specialist.',
    levelOfEducation: 'Bachelor of Medicine & Surgery (MBChB), Master of Public Health (MPH)',
    yearsOfExperience: '10+ Years in Community Health & Rural Health Finance',
    workExperience: [
      'Head of Community Health & Welfare - Neema HEEP (2023-Present)',
      'Medical Officer & Public Health Coordinator - Nyeri County Referral Hospital (2018-2023)'
    ],
    publicHeadline: 'Head of Community Health & Preventive Care',
    publicBio: 'Pioneering healthcare financing models and WASH sanitation credits for rural women cooperatives across Laikipia and Nyeri.',
    publicPagePublished: true,
    showPublicContact: true,
    preferredLanguage: 'English (US)',
    timezone: 'Africa/Nairobi (UTC+3)',
    expertise: ['Maternal Health Loans', 'Clean Water & Hygiene (WASH)', 'Rural Healthcare Financing', 'Community Mobilization'],
    certifications: ['MBChB - University of Nairobi', 'MPH - Johns Hopkins University'],
    education: ['Bachelor of Medicine & Surgery - UoN', 'MPH - Johns Hopkins University'],
    memberships: ['Kenya Medical Association (KMA)', 'Global Health Council'],
    stats: {
      articlesPublished: 14,
      draftArticles: 2,
      mediaUploaded: 42,
      commentsModerated: 89,
      communityImpactScore: 95,
      readingCount: 31200,
      guidedLoansCount: 860,
      lastLogin: '2026-07-23 04:15 PM',
      memberSince: 'March 2023'
    },
    achievements: ['First Article', 'Impact Champion', 'Verified Author', 'Community Contributor', 'Featured Writer']
  },
  {
    id: 'usr-3',
    firstName: 'Samuel',
    middleName: 'Auma',
    lastName: 'Ochieng',
    displayName: 'Samuel Ochieng',
    username: 'sochieng',
    email: 'samuel@neemaheep.co.ke',
    phone: '+254 733 456 789',
    gender: 'Male',
    dateOfBirth: '1985-03-08',
    jobTitle: 'Senior Credit & Risk Manager',
    department: 'Risk & Compliance',
    employeeId: 'NH-EMP-2023-022',
    departmentExtension: 'Ext. 308 (Risk & Compliance)',
    canCreateArticles: false, // Site admin restricted for demonstration
    role: 'Author',
    status: 'Active',
    verificationStatus: 'Verified',
    profilePhoto: '/Antony Kinyua.jpeg',
    coverPhoto: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    bio: 'Over 12 years of experience in credit risk modeling, portfolio quality control, and micro-business advisory.',
    shortBio: 'Risk & Credit Structuring Specialist.',
    levelOfEducation: 'Bachelor of Commerce in Finance (B.Com Finance)',
    yearsOfExperience: '12+ Years in Credit Risk & Musoni Core Banking',
    workExperience: [
      'Senior Credit & Risk Manager - Neema HEEP (2023-Present)',
      'Risk & Portfolio Quality Analyst - Faulu Microfinance Bank (2015-2023)'
    ],
    publicHeadline: 'Senior Credit Risk & Audit Specialist',
    publicBio: 'Specializing in portfolio risk reduction, Musoni core banking integration, and group-guaranteed loan underwriting.',
    publicPagePublished: true,
    showPublicContact: false,
    preferredLanguage: 'English (UK)',
    timezone: 'Africa/Nairobi (UTC+3)',
    expertise: ['Risk Mitigation', 'Group Guaranteed Lending', 'Musoni Core Banking', 'Portfolio Quality Control'],
    certifications: ['Certified Credit Analyst (CCA)', 'PRM - Professional Risk Manager'],
    education: ['B.Com Finance - Kenyatta University'],
    memberships: ['Global Association of Risk Professionals (GARP)'],
    stats: {
      articlesPublished: 8,
      draftArticles: 1,
      mediaUploaded: 19,
      commentsModerated: 210,
      communityImpactScore: 92,
      readingCount: 19400,
      guidedLoansCount: 540,
      lastLogin: '2026-07-23 11:00 AM',
      memberSince: 'June 2023'
    },
    achievements: ['First Article', 'Verified Author', 'Top Editor']
  }
];

export default function UserProfileManager() {
  // Submodule Tabs strictly limited to:
  // 1. 'my_profile'
  // 2. 'my_public_page'
  // 3. 'other_profiles'
  const [activeSubTab, setActiveSubTab] = useState<'my_profile' | 'my_public_page' | 'other_profiles'>('my_profile');

  // Authenticated User Personal Profile ID (Patrick Munene)
  const loggedUserId = 'usr-1';

  // Profiles State (synced with profilesStore)
  const [profiles, setProfiles] = useState<ExtendedUserProfile[]>(() => profilesStore.getProfiles());

  useEffect(() => {
    const unsubscribe = profilesStore.subscribe((updatedProfiles) => {
      setProfiles(updatedProfiles);
    });
    return unsubscribe;
  }, []);

  // Authenticated Personal Profile object
  const loggedProfile = useMemo(() => {
    return profiles.find(p => p.id === loggedUserId) || profiles[0];
  }, [profiles]);

  // Selected Profile state when inspecting another user in "Other Profiles"
  const [inspectingUser, setInspectingUser] = useState<ExtendedUserProfile | null>(null);

  // Modals & Preview States
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isEditPublicPageModalOpen, setIsEditPublicPageModalOpen] = useState(false);
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = useState(false);
  const [isPhotoStudioOpen, setIsPhotoStudioOpen] = useState(false);
  const [isCoverStudioOpen, setIsCoverStudioOpen] = useState(false);
  const [isDeleteProfileModalOpen, setIsDeleteProfileModalOpen] = useState(false);
  const [isDeletePublicPageModalOpen, setIsDeletePublicPageModalOpen] = useState(false);

  // New Profile Form State for Super Admin Creation
  const [newProfileFormData, setNewProfileFormData] = useState<Partial<ExtendedUserProfile>>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: 'Operations',
    role: 'Author',
    bio: '',
    levelOfEducation: 'Bachelor Degree',
    yearsOfExperience: '3+ Years'
  });

  const handleCreateNewProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileFormData.firstName?.trim() || !newProfileFormData.lastName?.trim() || !newProfileFormData.email?.trim()) {
      triggerToast('Error: First Name, Last Name, and Email are required!');
      return;
    }
    const created = profilesStore.createProfile(newProfileFormData, 'Super Admin');
    setIsCreateProfileModalOpen(false);
    setNewProfileFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      department: 'Operations',
      role: 'Author',
      bio: '',
      levelOfEducation: 'Bachelor Degree',
      yearsOfExperience: '3+ Years'
    });
    triggerToast(`Super Admin Success: New profile created for ${created.displayName}!`);
  };

  // "View as Reader" Mode Toggle on Public Author Page
  const [isReaderModeActive, setIsReaderModeActive] = useState(false);

  // Customize Modal Tab: 'edit' or 'preview'
  const [customizeModalTab, setCustomizeModalTab] = useState<'edit' | 'preview'>('edit');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filtering State for Other Profiles
  const [otherProfilesViewMode, setOtherProfilesViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');

  // Photo / Cover Studio State
  const [tempPhotoUrl, setTempPhotoUrl] = useState(loggedProfile?.profilePhoto || '');
  const [tempCoverUrl, setTempCoverUrl] = useState(loggedProfile?.coverPhoto || '');

  // Form State for Editing Own Profile
  const [editFormData, setEditFormData] = useState<ExtendedUserProfile>(loggedProfile);

  // New Inputs inside Edit Modal
  const [newExpertiseTag, setNewExpertiseTag] = useState('');
  const [newWorkExpEntry, setNewWorkExpEntry] = useState('');

  // Form State for Editing Own Public Page
  const [publicPageFormData, setPublicPageFormData] = useState({
    publicHeadline: loggedProfile.publicHeadline || '',
    publicBio: loggedProfile.publicBio || loggedProfile.bio,
    showPublicContact: loggedProfile.showPublicContact ?? true,
    coverPhoto: loggedProfile.coverPhoto
  });

  // Helper Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Save Own Profile
  const handleSaveOwnProfile = (updated: ExtendedUserProfile) => {
    if (updated.id !== loggedUserId) {
      triggerToast('Security Notice: You can only edit your own personal profile!');
      setIsEditUserModalOpen(false);
      return;
    }
    profilesStore.updateProfile(updated.id, updated, 'Patrick Munene (Self)');
    setIsEditUserModalOpen(false);
    triggerToast('Your personal profile credentials have been updated!');
  };

  // Handle Delete Own Profile
  const handleDeleteOwnProfile = () => {
    const res = profilesStore.deleteOrArchiveProfile(loggedUserId, 'Patrick Munene (Self)');
    setIsDeleteProfileModalOpen(false);
    if (res.action === 'archived') {
      triggerToast('Your personal profile was archived because you have published articles. Access revoked and hidden from team directories.');
    } else {
      triggerToast('Your personal profile was permanently deleted.');
    }
  };

  // Handle Save Own Public Page
  const handleSaveOwnPublicPage = () => {
    profilesStore.updateProfile(loggedUserId, {
      publicHeadline: publicPageFormData.publicHeadline,
      publicBio: publicPageFormData.publicBio,
      publicPagePublished: true,
      showPublicContact: publicPageFormData.showPublicContact,
      coverPhoto: publicPageFormData.coverPhoto
    }, 'Patrick Munene (Self)');
    setIsEditPublicPageModalOpen(false);
    triggerToast('Your public author page settings have been updated!');
  };

  // Handle Delete / Unpublish Own Public Page
  const handleDeleteOwnPublicPage = () => {
    profilesStore.updateProfile(loggedUserId, {
      publicPagePublished: false,
      publicHeadline: '',
      publicBio: ''
    }, 'Patrick Munene (Self)');
    setIsDeletePublicPageModalOpen(false);
    triggerToast('Your public author page has been unpublished.');
  };

  // Add Expertise Tag
  const handleAddExpertiseTag = () => {
    if (!newExpertiseTag.trim()) return;
    if (editFormData.expertise.includes(newExpertiseTag.trim())) {
      setNewExpertiseTag('');
      return;
    }
    setEditFormData({
      ...editFormData,
      expertise: [...editFormData.expertise, newExpertiseTag.trim()]
    });
    setNewExpertiseTag('');
  };

  // Remove Expertise Tag
  const handleRemoveExpertiseTag = (tagToRemove: string) => {
    setEditFormData({
      ...editFormData,
      expertise: editFormData.expertise.filter(t => t !== tagToRemove)
    });
  };

  // Add Work Experience Entry
  const handleAddWorkExpEntry = () => {
    if (!newWorkExpEntry.trim()) return;
    setEditFormData({
      ...editFormData,
      workExperience: [...(editFormData.workExperience || []), newWorkExpEntry.trim()]
    });
    setNewWorkExpEntry('');
  };

  // Remove Work Experience Entry
  const handleRemoveWorkExpEntry = (index: number) => {
    setEditFormData({
      ...editFormData,
      workExperience: editFormData.workExperience.filter((_, i) => i !== index)
    });
  };

  // Filtered Other Profiles List
  const filteredOtherProfiles = useMemo(() => {
    return profiles.filter(p => {
      const query = searchQuery.toLowerCase();
      const matchSearch = 
        p.displayName.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.username.toLowerCase().includes(query) ||
        p.jobTitle.toLowerCase().includes(query) ||
        p.expertise.some(e => e.toLowerCase().includes(query));
      
      const matchRole = selectedRoleFilter === 'ALL' || p.role === selectedRoleFilter;
      return matchSearch && matchRole;
    });
  }, [profiles, searchQuery, selectedRoleFilter]);

  return (
    <div className="space-y-6 pb-12 font-sans text-gray-900">
      
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#074504] text-[#C0991B] px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#C0991B] flex items-center gap-3 font-bold text-xs uppercase tracking-wide"
          >
            <ShieldCheck className="w-4 h-4 text-[#C0991B] animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header & Submodule Tabs Navigation */}
      <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#074504] rounded-3xl border border-[#C0991B]/30 shadow-lg p-6 md:p-8 text-white space-y-4">
        {/* 1. Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-[#C0991B] shrink-0" />
            <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide">Profiles &amp; User Management</h1>
          </div>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#C0991B]/20 text-[#C0991B] border border-[#C0991B]/40 uppercase">
            Internal Directory
          </span>
        </div>

        {/* 2. Description Text */}
        <p className="text-xs md:text-sm text-gray-200 font-medium leading-relaxed max-w-4xl">
          Manage your personal profile, update author bio &amp; public credentials, and review team directory profiles across the platform.
        </p>

        {/* 3. CTA buttons / Navigation Tabs */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-white/10 pt-4">
          {[
            { id: 'my_profile', label: 'My Profile', icon: User, desc: 'Internal credentials' },
            { id: 'my_public_page', label: 'My Public Author Page', icon: Globe, desc: 'Public author profile' },
            { id: 'other_profiles', label: 'Other Profiles', icon: Users, desc: 'Team directory' }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive 
                    ? 'bg-[#C0991B] text-[#074504] shadow-md scale-[1.02]' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#074504]' : 'text-[#C0991B]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PROFILE GOVERNANCE & CREATION RESTRICTION NOTICE */}
      <div className="bg-amber-50/90 rounded-2xl border border-[#C0991B]/40 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#074504] shadow-xs">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#C0991B] shrink-0 mt-0.5" />
          <div>
            <span className="font-black uppercase tracking-wider block text-xs text-[#074504]">Profile Creation &amp; Editing Governance</span>
            <p className="text-gray-700 font-medium text-[11px] leading-relaxed mt-0.5">
              Profiles can <strong>ONLY</strong> be created by the <strong>Super Admin</strong> via this Profiles Manager module. Individual users are authorized to edit already existing profile records.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateProfileModalOpen(true)}
          className="px-4 py-2.5 bg-[#074504] hover:bg-[#053203] text-[#C0991B] font-black rounded-xl uppercase text-xs flex items-center gap-2 shadow-sm shrink-0 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 text-[#C0991B]" /> Create Profile (Super Admin)
        </button>
      </div>

      {/* ==================== SUBMODULE 1: MY PROFILE ==================== */}
      {activeSubTab === 'my_profile' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top Banner Card with Directly Editable Cover & Profile Picture */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden relative">
            
            {/* Header / Cover Image with direct edit overlay */}
            <div className="h-52 w-full bg-cover bg-center relative group" style={{ backgroundImage: `url(${loggedProfile.coverPhoto})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#074504]/90 via-[#074504]/30 to-transparent"></div>
              
              {/* Cover Image Direct Edit Button */}
              <button 
                onClick={() => {
                  setTempCoverUrl(loggedProfile.coverPhoto);
                  setIsCoverStudioOpen(true);
                }}
                className="absolute top-4 left-4 px-3.5 py-1.5 bg-[#074504]/80 hover:bg-[#074504] backdrop-blur-md text-white border border-white/30 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#C0991B]" /> Change Header Image
              </button>

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="px-3 py-1 bg-[#074504]/80 backdrop-blur-md text-[#C0991B] border border-[#C0991B]/40 rounded-full text-xs font-black uppercase tracking-wider">
                  {loggedProfile.role}
                </span>
                <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-black uppercase flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {loggedProfile.status}
                </span>
              </div>
            </div>

            {/* Profile Avatar & Primary Information */}
            <div className="p-6 relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                
                {/* Directly Editable Profile Picture - Overlapping cover border cleanly */}
                <div className="relative group shrink-0 -mt-16 z-10">
                  <img 
                    src={loggedProfile.profilePhoto} 
                    alt={loggedProfile.displayName} 
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl bg-gray-100"
                  />
                  <button 
                    onClick={() => {
                      setTempPhotoUrl(loggedProfile.profilePhoto);
                      setIsPhotoStudioOpen(true);
                    }}
                    className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-bold transition-all cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-[#C0991B] mb-1" />
                    <span>Change Picture</span>
                  </button>
                  {loggedProfile.verificationStatus === 'Verified' && (
                    <div className="absolute -bottom-2 -right-2 bg-[#074504] text-[#C0991B] p-1.5 rounded-full border-2 border-white shadow-md">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-black text-gray-900">{loggedProfile.displayName}</h2>
                    <span className="text-xs font-bold text-gray-500">(@{loggedProfile.username})</span>
                  </div>
                  <p className="text-xs font-bold text-[#074504] uppercase flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#C0991B]" /> {loggedProfile.jobTitle}
                  </p>
                </div>
              </div>

              {/* Action Buttons to Edit/Delete Own Profile */}
              <div className="flex items-center gap-2 flex-wrap">
                <button 
                  onClick={() => {
                    setEditFormData(loggedProfile);
                    setIsEditUserModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#074504] text-[#C0991B] rounded-xl text-xs font-bold uppercase flex items-center gap-2 shadow-sm hover:bg-[#053203] transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile Credentials
                </button>
                <button 
                  onClick={() => setIsDeleteProfileModalOpen(true)}
                  className="px-3.5 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 hover:bg-red-100 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" /> Delete Profile
                </button>
              </div>
            </div>
          </div>

          {/* Key Impact & Editorial Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
                <span>Articles Published</span>
                <FileText className="w-4 h-4 text-[#C0991B]" />
              </div>
              <div className="text-2xl font-black text-[#074504]">{loggedProfile.stats.articlesPublished}</div>
              <span className="text-[10px] font-extrabold text-[#7a600d] bg-amber-50 px-2 py-0.5 rounded-full inline-block border border-[#C0991B]/30">
                Editorial Contributions
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
                <span>Total Readers Reached</span>
                <Eye className="w-4 h-4 text-[#C0991B]" />
              </div>
              <div className="text-2xl font-black text-[#074504]">{loggedProfile.stats.readingCount.toLocaleString()}</div>
              <span className="text-[10px] font-extrabold text-[#7a600d] bg-amber-50 px-2 py-0.5 rounded-full inline-block border border-[#C0991B]/30">
                Community Engagement
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
                <span>Community Impact Score</span>
                <Award className="w-4 h-4 text-[#C0991B]" />
              </div>
              <div className="text-2xl font-black text-[#074504]">{loggedProfile.stats.communityImpactScore}%</div>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                High Editorial Trust
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
                <span>Editorial Reviews</span>
                <CheckCircle2 className="w-4 h-4 text-[#C0991B]" />
              </div>
              <div className="text-2xl font-black text-[#074504]">{loggedProfile.stats.guidedLoansCount}+</div>
              <span className="text-[10px] font-extrabold text-[#7a600d] bg-amber-50 px-2 py-0.5 rounded-full inline-block border border-[#C0991B]/30">
                Verified Peer Submissions
              </span>
            </div>
          </div>

          {/* Main 2-Column Info, Biography, Expertise & Internal Credentials */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Biography, Areas of Expertise, Education & Experience */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Detailed Biography (Fully Editable) */}
              <div className="bg-white p-6 rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                    <User className="w-4 h-4 text-[#C0991B]" /> Biography overview
                  </h3>
                  <button 
                    onClick={() => {
                      setEditFormData(loggedProfile);
                      setIsEditUserModalOpen(true);
                    }}
                    className="text-[11px] font-bold text-[#074504] bg-amber-50 hover:bg-amber-100 border border-[#C0991B]/40 px-3 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-[#C0991B]" /> Edit Bio
                  </button>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {loggedProfile.bio}
                </p>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600">
                  <span className="font-black text-[#074504] uppercase block mb-1">Short Tagline:</span>
                  {loggedProfile.shortBio}
                </div>
              </div>

              {/* Editable Areas of Expertise */}
              <div className="bg-white p-6 rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#C0991B]" /> Areas of Expertise
                  </h3>
                  <button 
                    onClick={() => {
                      setEditFormData(loggedProfile);
                      setIsEditUserModalOpen(true);
                    }}
                    className="text-[11px] font-bold text-[#074504] bg-amber-50 hover:bg-amber-100 border border-[#C0991B]/40 px-3 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-[#C0991B]" /> Add / Manage Expertise
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {loggedProfile.expertise.map((exp, idx) => (
                    <span key={idx} className="px-3.5 py-1.5 bg-amber-50 text-[#826507] border border-[#C0991B]/40 text-xs font-bold rounded-xl flex items-center gap-2 shadow-2xs">
                      <span>{exp}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Education & Experience Section */}
              <div className="bg-white p-6 rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#C0991B]" /> Education & Work Experience
                  </h3>
                  <button 
                    onClick={() => {
                      setEditFormData(loggedProfile);
                      setIsEditUserModalOpen(true);
                    }}
                    className="text-[11px] font-bold text-[#074504] bg-amber-50 hover:bg-amber-100 border border-[#C0991B]/40 px-3 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-[#C0991B]" /> Edit Section
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Level of Education</span>
                    <p className="text-xs font-black text-gray-900">{loggedProfile.levelOfEducation || 'Not specified'}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Professional Membership</span>
                    <p className="text-xs font-black text-[#074504]">
                      {loggedProfile.memberships && loggedProfile.memberships.length > 0 
                        ? loggedProfile.memberships.join(', ') 
                        : 'Not specified'}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Years of Experience</span>
                    <p className="text-xs font-black text-gray-900">{loggedProfile.yearsOfExperience || 'Not specified'}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Current Position</span>
                    <p className="text-xs font-black text-[#074504]">{loggedProfile.jobTitle || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Editorial Governance & Author Status Panel */}
            <div className="space-y-6">
              
              {/* Editorial Governance Panel */}
              <div className="bg-white p-6 rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs space-y-5">
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C0991B]" /> Editorial Role & Governance
                  </h3>
                  <span className="px-2 py-0.5 bg-amber-100 text-[#074504] text-[9px] font-black rounded-full uppercase">
                    CMS Verified
                  </span>
                </div>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-gray-400 font-extrabold uppercase text-[10px] block">Editorial Role</span>
                    <span className="font-bold text-gray-900 flex items-center gap-1.5 mt-0.5">
                      <Award className="w-3.5 h-3.5 text-[#074504]" /> {loggedProfile.role} • {loggedProfile.jobTitle}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-extrabold uppercase text-[10px] block">Peer Review Rights</span>
                    <span className="font-bold text-[#074504] flex items-center gap-1.5 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Article Submissions & Review
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 font-extrabold uppercase text-[10px] block">Author Verification Status</span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                      {loggedProfile.verificationStatus} Author Profile
                    </span>
                  </div>
                </div>

                {/* Article Creation Privilege Card */}
                <div className={`p-4 rounded-2xl border ${loggedProfile.canCreateArticles ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-amber-50 border-[#C0991B]/50 text-[#826507]'} space-y-2`}>
                  <div className="flex items-center gap-2 font-black text-xs uppercase">
                    {loggedProfile.canCreateArticles ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Article Creation Privilege: Allowed</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#C0991B]" />
                        <span>Article Creation Privilege: Restricted</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] font-medium leading-relaxed">
                    {loggedProfile.canCreateArticles 
                      ? 'Your user account is authorized by site administration to create, draft, and submit articles across Neema Journal.'
                      : 'Article creation privileges for your user account are restricted by site administration. Contact site admin to grant access.'
                    }
                  </p>
                </div>
              </div>

              {/* Internal Ethics & Editorial Guidelines */}
              <div className="bg-gradient-to-br from-[#074504] to-[#042d02] p-6 rounded-2xl border border-[#C0991B] text-white space-y-3 shadow-md">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#C0991B]" />
                  <h4 className="font-black text-sm uppercase text-[#C0991B]">Editorial Ethics Guidelines</h4>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed font-medium">
                  All articles published under Neema HEEP must adhere to accurate microfinance disclosures, borrower confidentiality, and transparent interest reporting.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBMODULE 2: MY PUBLIC AUTHOR PAGE ==================== */}
      {activeSubTab === 'my_public_page' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Rendered Live Public Author Page View */}
          {loggedProfile.publicPagePublished !== false ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden space-y-8">
              {/* Cover Banner without top blank space */}
              <div className="h-64 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${loggedProfile.coverPhoto})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#074504]/90 via-[#074504]/40 to-transparent"></div>
                
                {/* Top Action Controls overlay right on cover image - Flush top with no blank space above */}
                <div className="absolute top-4 right-4 flex flex-nowrap items-center gap-2 z-10">
                  <button 
                    onClick={() => {
                      setPublicPageFormData({
                        publicHeadline: loggedProfile.publicHeadline || '',
                        publicBio: loggedProfile.publicBio || loggedProfile.bio,
                        showPublicContact: loggedProfile.showPublicContact ?? true,
                        coverPhoto: loggedProfile.coverPhoto
                      });
                      setCustomizeModalTab('edit');
                      setIsEditPublicPageModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-[#074504]/90 hover:bg-[#074504] backdrop-blur-md text-[#C0991B] border border-[#C0991B]/50 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-md transition-all whitespace-nowrap"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Customize Page
                  </button>

                  <button 
                    onClick={() => setIsReaderModeActive(!isReaderModeActive)}
                    className={`px-3.5 py-1.5 backdrop-blur-md rounded-xl text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap shadow-md ${
                      isReaderModeActive 
                        ? 'bg-[#C0991B] text-[#074504]' 
                        : 'bg-[#074504]/90 hover:bg-[#074504] text-amber-200 border border-[#C0991B]/40'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" /> {isReaderModeActive ? 'Exit Reader Mode' : 'View as Reader'}
                  </button>

                  <button 
                    onClick={() => setIsDeletePublicPageModalOpen(true)}
                    className="px-3 py-1.5 bg-red-900/80 hover:bg-red-900 backdrop-blur-md text-red-200 border border-red-500/40 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Unpublish
                  </button>
                </div>

                <div className="absolute bottom-6 left-8 right-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                  <div className="flex items-end gap-5">
                    <img 
                      src={loggedProfile.profilePhoto} 
                      alt={loggedProfile.displayName} 
                      className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-2xl bg-gray-100"
                    />
                    <div className="text-white space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-black">{loggedProfile.displayName}</h2>
                        <ShieldCheck className="w-6 h-6 text-[#C0991B]" />
                      </div>
                      <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        {loggedProfile.publicHeadline || `${loggedProfile.jobTitle}`}
                      </p>
                      <p className="text-xs text-amber-100/90">Verified Neema HEEP Author • Member since {loggedProfile.stats.memberSince}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-white text-xs font-bold">
                    <div>
                      <span className="text-amber-300 font-black block text-base">{loggedProfile.stats.articlesPublished}</span>
                      <span className="text-[10px] text-gray-200 uppercase">Articles</span>
                    </div>
                    <div className="w-px h-8 bg-white/20"></div>
                    <div>
                      <span className="text-amber-300 font-black block text-base">{loggedProfile.stats.readingCount.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-200 uppercase">Reads</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Public Content Body */}
              <div className="p-8 space-y-8">
                {/* 1. About the Author & Biography */}
                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                    <h3 className="font-black text-lg text-[#074504] uppercase flex items-center gap-2">
                      <User className="w-5 h-5 text-[#C0991B]" /> About the Author
                    </h3>
                    <span className="px-3 py-1 bg-[#074504] text-[#C0991B] rounded-full text-[10px] font-black uppercase tracking-wider">
                      Verified CMS Specialist
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed font-medium">
                    {loggedProfile.publicBio || loggedProfile.bio}
                  </p>
                  {loggedProfile.shortBio && (
                    <p className="text-xs text-[#074504] font-bold italic pt-1">
                      "{loggedProfile.shortBio}"
                    </p>
                  )}

                  {/* Title at Bottom of About Author section matching the Header Title strictly */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-emerald-200/80 mt-2 bg-emerald-100/40 -mx-6 -mb-6 p-4 rounded-b-2xl">
                    <div className="flex items-center gap-3">
                      <img 
                        src={loggedProfile.profilePhoto} 
                        alt={loggedProfile.displayName} 
                        className="w-10 h-10 rounded-full border-2 border-[#C0991B] object-cover shadow-2xs" 
                      />
                      <div>
                        <h4 className="text-sm font-black text-[#074504] uppercase tracking-wide">
                          {loggedProfile.displayName}
                        </h4>
                        <p className="text-xs font-bold text-[#826507]">
                          {loggedProfile.publicHeadline || loggedProfile.jobTitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-[#074504] text-[#C0991B] rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C0991B]" /> Verified Author Title
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Area of Expertise & Education & Work Experience (Trust & Authority Signal) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Area of Expertise */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                    <h4 className="font-black text-xs text-[#074504] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
                      <Award className="w-4 h-4 text-[#C0991B]" /> Area of Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {loggedProfile.expertise.map((exp, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-amber-50 text-[#826507] border border-[#C0991B]/40 rounded-xl text-xs font-bold">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education & Work Experience Grid */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                    <h4 className="font-black text-xs text-[#074504] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
                      <GraduationCap className="w-4 h-4 text-[#C0991B]" /> Education & Work Experience
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-0.5">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Level of Education</span>
                        <p className="text-xs font-black text-gray-900">{loggedProfile.levelOfEducation || 'Not specified'}</p>
                      </div>

                      <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-0.5">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Professional Membership</span>
                        <p className="text-xs font-black text-[#074504]">
                          {loggedProfile.memberships && loggedProfile.memberships.length > 0 
                            ? loggedProfile.memberships.join(', ') 
                            : 'Not specified'}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-0.5">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Years of Experience</span>
                        <p className="text-xs font-black text-gray-900">{loggedProfile.yearsOfExperience || 'Not specified'}</p>
                      </div>

                      <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-0.5">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Current Position</span>
                        <p className="text-xs font-black text-[#074504]">{loggedProfile.jobTitle || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Articles by Author (Max 4 Listed) */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-lg text-[#074504] uppercase">
                      Other articles by {loggedProfile.displayName}
                    </h3>
                    <span className="text-xs font-bold text-gray-400">
                      Max 4 shown
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        id: 'art-1',
                        title: 'Empowering Smallholders with Micro-Credit in Mount Kenya',
                        category: 'Financial Literacy',
                        snippet: 'How Neema HEEP loans bridge irrigation gaps for dairy and horticulture farmers in Nyeri County.',
                        date: 'July 20, 2026',
                        reads: '4.8k reads'
                      },
                      {
                        id: 'art-2',
                        title: 'WASH Sanitation Micro-Finance for Women Groups',
                        category: 'Community Health',
                        snippet: 'Improving clean water access and household sanitation through revolving group guarantees.',
                        date: 'June 14, 2026',
                        reads: '3.2k reads'
                      },
                      {
                        id: 'art-3',
                        title: 'Agribusiness Financing Strategies for Rural Cooperatives',
                        category: 'Agribusiness Credit',
                        snippet: 'Unlocking working capital for avocado and coffee smallholder groups across Laikipia.',
                        date: 'May 28, 2026',
                        reads: '5.1k reads'
                      },
                      {
                        id: 'art-4',
                        title: 'Digital Micro-Lending & Mobile Credit Risk Assessment',
                        category: 'Fintech Innovation',
                        snippet: 'Leveraging mobile money transaction histories for rapid loan underwriting in microfinance.',
                        date: 'April 10, 2026',
                        reads: '6.4k reads'
                      }
                    ].slice(0, 4).map((art) => (
                      <div key={art.id} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3 flex flex-col justify-between hover:border-[#C0991B]/50 transition-all">
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-[#826507] bg-amber-100 px-2.5 py-0.5 rounded-full uppercase inline-block">
                            {art.category}
                          </span>
                          <h4 className="font-black text-sm text-[#074504] line-clamp-2">{art.title}</h4>
                          <p className="text-xs text-gray-600 line-clamp-2 font-medium">{art.snippet}</p>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold pt-2 border-t border-gray-200">
                          <span>{art.date}</span>
                          <span className="text-[#074504]">{art.reads}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impactful Neema HEEP Website CTAs - All Active with Direct Navigation & Lead Capture */}
                <div className="bg-gradient-to-r from-[#074504] via-[#095906] to-[#074504] p-6 rounded-3xl border-2 border-[#C0991B] text-white space-y-4 shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#C0991B]" />
                      <h4 className="font-black text-sm uppercase text-[#C0991B]">Explore Neema HEEP Solutions</h4>
                    </div>
                    <p className="text-xs text-gray-200 font-medium">
                      Financial inclusion, micro-credit products, and community health initiatives across Mt. Kenya.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <button 
                      onClick={() => {
                        triggerToast('Navigating to Loan Products Directory...');
                        window.location.hash = '/loans';
                      }}
                      className="py-2.5 px-3 bg-[#C0991B] text-[#074504] rounded-xl text-xs font-black uppercase tracking-wider hover:bg-amber-400 transition-all cursor-pointer flex items-center justify-between shadow-xs whitespace-nowrap"
                    >
                      <span className="flex items-center gap-1.5 truncate"><Layers className="w-4 h-4 shrink-0" /> Micro-Loan Products</span>
                      <ArrowUpRight className="w-4 h-4 shrink-0" />
                    </button>

                    <button 
                      onClick={() => {
                        triggerToast('Navigating to Loan Pre-Qualification Form...');
                        window.location.hash = '/pre-qualification';
                      }}
                      className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between border border-white/20 whitespace-nowrap"
                    >
                      <span className="flex items-center gap-1.5 truncate"><Calculator className="w-4 h-4 text-[#C0991B] shrink-0" /> Pre-Qualification</span>
                      <ArrowUpRight className="w-4 h-4 shrink-0" />
                    </button>

                    <button 
                      onClick={() => {
                        triggerToast('Navigating to Community Health Programs...');
                        window.location.hash = '/programs';
                      }}
                      className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between border border-white/20 whitespace-nowrap"
                    >
                      <span className="flex items-center gap-1.5 truncate"><HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" /> Health Programs</span>
                      <ArrowUpRight className="w-4 h-4 shrink-0" />
                    </button>

                    <button 
                      onClick={() => {
                        triggerToast('Navigating to Request Lead Callback...');
                        window.location.hash = '/request-callback';
                      }}
                      className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between border border-white/20 whitespace-nowrap"
                    >
                      <span className="flex items-center gap-1.5 truncate"><BookOpen className="w-4 h-4 text-amber-300 shrink-0" /> Lead Consultation</span>
                      <ArrowUpRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
              <Globe className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-black text-base text-gray-800 uppercase">Public Author Page Un-published</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Your public author profile is currently unpublished. Publish it so readers can view your author profile when reading your articles.
              </p>
              <button 
                onClick={() => {
                  profilesStore.updateProfile(loggedUserId, { publicPagePublished: true }, 'Patrick Munene (Self)');
                  triggerToast('Your public author page is now live!');
                }}
                className="px-5 py-2.5 bg-[#074504] text-[#C0991B] rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#053203] transition-all cursor-pointer"
              >
                Publish Author Page Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== SUBMODULE 3: OTHER PROFILES ==================== */}
      {activeSubTab === 'other_profiles' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header Banner */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C0991B]" /> Peer Profiles Directory
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Browse and inspect peer team member profiles across Neema HEEP.
                </p>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setOtherProfilesViewMode('grid')}
                  className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    otherProfilesViewMode === 'grid' ? 'bg-white text-[#074504] shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" /> Grid
                </button>
                <button 
                  onClick={() => setOtherProfilesViewMode('list')}
                  className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    otherProfilesViewMode === 'list' ? 'bg-white text-[#074504] shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" /> List
                </button>
              </div>
            </div>

            {/* Search & Simplified Role Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-100">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, role, or area of expertise..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#C0991B] transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Role filter pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Filter Role:</span>
                {['ALL', 'Editor', 'Author'].map((role) => (
                  <button 
                    key={role}
                    onClick={() => setSelectedRoleFilter(role)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      selectedRoleFilter === role 
                        ? 'bg-[#074504] text-[#C0991B]' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {role === 'ALL' ? 'All Profiles' : `${role}s`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Cards Display */}
          {otherProfilesViewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOtherProfiles.map((prof) => (
                <div 
                  key={prof.id} 
                  className={`bg-white rounded-3xl border ${prof.id === loggedUserId ? 'border-2 border-[#C0991B]' : 'border-gray-200'} shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group`}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={prof.profilePhoto} 
                          alt={prof.displayName} 
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-200 shadow-sm bg-gray-100"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-black text-sm text-gray-900">{prof.displayName}</h4>
                            {prof.id === loggedUserId && (
                              <span className="px-2 py-0.5 bg-amber-100 text-[#074504] text-[9px] font-black rounded-full uppercase">You</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 font-bold">@{prof.username}</p>
                          <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-md uppercase mt-1">
                            {prof.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-[#074504] uppercase flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-[#C0991B]" /> {prof.jobTitle}
                    </p>

                    <p className="text-xs text-gray-600 line-clamp-2 font-medium">
                      {prof.bio}
                    </p>

                    {/* Areas of Expertise Tags */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Areas of Expertise:</span>
                      <div className="flex flex-wrap gap-1">
                        {prof.expertise.slice(0, 3).map((exp, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-amber-50 text-[#826507] border border-[#C0991B]/30 text-[10px] font-extrabold rounded-md">
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <button 
                      onClick={() => setInspectingUser(prof)}
                      className="px-4 py-2 bg-[#074504] text-[#C0991B] rounded-xl text-xs font-extrabold uppercase flex items-center gap-1.5 hover:bg-[#053203] transition-all cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C0991B]" /> View Full Profile
                    </button>
                    <span className="text-[10px] font-bold text-gray-400">
                      {prof.stats.articlesPublished} Articles
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden divide-y divide-gray-100 shadow-xs">
              {filteredOtherProfiles.map((prof) => (
                <div key={prof.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/80 transition-all">
                  <div className="flex items-center gap-4">
                    <img 
                      src={prof.profilePhoto} 
                      alt={prof.displayName} 
                      className="w-12 h-12 rounded-xl object-cover border border-amber-200 bg-gray-100 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm text-gray-900">{prof.displayName}</h4>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-md uppercase">
                          {prof.role}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#074504]">{prof.jobTitle}</p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {prof.expertise.slice(0, 3).map((exp, idx) => (
                          <span key={idx} className="text-[10px] font-bold text-[#826507] bg-amber-50 px-2 py-0.5 rounded border border-[#C0991B]/30">
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setInspectingUser(prof)}
                      className="px-4 py-2 bg-[#074504] text-[#C0991B] rounded-xl text-xs font-bold uppercase flex items-center gap-1 hover:bg-[#053203] transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== MODALS ==================== */}

      {/* 1. EDIT OWN PERSONAL PROFILE MODAL */}
      <AnimatePresence>
        {isEditUserModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full border-2 border-[#C0991B] p-6 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-black text-base text-[#074504] uppercase flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#C0991B]" /> Edit Personal Credentials & Profile
                </h3>
                <button onClick={() => setIsEditUserModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                <div>
                  <label className="font-black text-gray-700 uppercase block mb-1">Display Name</label>
                  <input 
                    type="text" 
                    value={editFormData.displayName}
                    onChange={(e) => setEditFormData({ ...editFormData, displayName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
                  />
                </div>

                <div>
                  <label className="font-black text-gray-700 uppercase block mb-1">Job Title</label>
                  <input 
                    type="text" 
                    value={editFormData.jobTitle}
                    onChange={(e) => setEditFormData({ ...editFormData, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
                  />
                </div>

                <div>
                  <label className="font-black text-gray-700 uppercase block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
                  />
                </div>

                <div>
                  <label className="font-black text-gray-700 uppercase block mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
                  />
                </div>

                {/* Level of Education & Years of Experience */}
                <div>
                  <label className="font-black text-gray-700 uppercase block mb-1">Level of Education</label>
                  <input 
                    type="text" 
                    value={editFormData.levelOfEducation || ''}
                    placeholder="e.g., Master of Science in Finance"
                    onChange={(e) => setEditFormData({ ...editFormData, levelOfEducation: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
                  />
                </div>

                <div>
                  <label className="font-black text-gray-700 uppercase block mb-1">Years of Experience</label>
                  <input 
                    type="text" 
                    value={editFormData.yearsOfExperience || ''}
                    placeholder="e.g., 14+ Years in Microfinance"
                    onChange={(e) => setEditFormData({ ...editFormData, yearsOfExperience: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-black text-gray-700 uppercase block mb-1">Biography</label>
                  <textarea 
                    rows={3}
                    value={editFormData.bio}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-black text-gray-700 uppercase block mb-1">Short Tagline</label>
                  <input 
                    type="text" 
                    value={editFormData.shortBio}
                    onChange={(e) => setEditFormData({ ...editFormData, shortBio: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
                  />
                </div>

                {/* Add / Manage Areas of Expertise */}
                <div className="sm:col-span-2 space-y-2 pt-2 border-t border-gray-100">
                  <label className="font-black text-[#074504] uppercase block">Areas of Expertise</label>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newExpertiseTag}
                      onChange={(e) => setNewExpertiseTag(e.target.value)}
                      placeholder="e.g., WASH Micro-Financing, Smallholder Credit"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
                    />
                    <button 
                      type="button"
                      onClick={handleAddExpertiseTag}
                      className="px-4 py-2 bg-[#074504] text-[#C0991B] rounded-xl font-bold uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Tag
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {editFormData.expertise.map((exp, idx) => (
                      <span key={idx} className="px-3 py-1 bg-amber-50 text-[#826507] border border-[#C0991B]/40 text-xs font-bold rounded-xl flex items-center gap-1.5">
                        <span>{exp}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveExpertiseTag(exp)}
                          className="hover:text-red-700 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Add / Manage Work Experience Entries */}
                <div className="sm:col-span-2 space-y-2 pt-2 border-t border-gray-100">
                  <label className="font-black text-[#074504] uppercase block">Work Experience History</label>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newWorkExpEntry}
                      onChange={(e) => setNewWorkExpEntry(e.target.value)}
                      placeholder="e.g., Senior Microfinance Advisor - Equity Bank (2016-2022)"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
                    />
                    <button 
                      type="button"
                      onClick={handleAddWorkExpEntry}
                      className="px-4 py-2 bg-[#074504] text-[#C0991B] rounded-xl font-bold uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Experience
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {(editFormData.workExperience || []).map((work, idx) => (
                      <div key={idx} className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-xs font-bold rounded-xl flex items-center justify-between">
                        <span>{work}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveWorkExpEntry(idx)}
                          className="text-red-600 hover:text-red-800 cursor-pointer ml-2"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button 
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold uppercase hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleSaveOwnProfile(editFormData)}
                  className="px-5 py-2.5 bg-[#074504] text-[#C0991B] rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#053203] cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. COVER IMAGE STUDIO MODAL */}
      <AnimatePresence>
        {isCoverStudioOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full border-2 border-[#C0991B] p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#C0991B]" /> Edit Header Image
                </h3>
                <button onClick={() => setIsCoverStudioOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-700 uppercase block">Header Image URL</label>
                <input 
                  type="text" 
                  value={tempCoverUrl}
                  onChange={(e) => setTempCoverUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#C0991B]"
                />
                
                <div className="h-32 w-full rounded-2xl bg-cover bg-center border border-gray-200" style={{ backgroundImage: `url(${tempCoverUrl})` }}></div>

                <span className="text-[10px] font-bold text-gray-400 block">Preset Covers:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
                  ].map((url, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setTempCoverUrl(url)}
                      className="h-14 rounded-xl bg-cover bg-center border border-gray-300 hover:border-[#C0991B] cursor-pointer"
                      style={{ backgroundImage: `url(${url})` }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setIsCoverStudioOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold uppercase cursor-pointer">
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    profilesStore.updateProfile(loggedUserId, { coverPhoto: tempCoverUrl }, 'Patrick Munene (Self)');
                    setIsCoverStudioOpen(false);
                    triggerToast('Header photo updated!');
                  }}
                  className="px-5 py-2 bg-[#074504] text-[#C0991B] rounded-xl text-xs font-black uppercase cursor-pointer"
                >
                  Save Header Photo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. PROFILE PHOTO STUDIO MODAL */}
      <AnimatePresence>
        {isPhotoStudioOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full border-2 border-[#C0991B] p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <User className="w-5 h-5 text-[#C0991B]" /> Profile Avatar Studio
                </h3>
                <button onClick={() => setIsPhotoStudioOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-700 uppercase block">Avatar Image Path / URL</label>
                <input 
                  type="text" 
                  value={tempPhotoUrl}
                  onChange={(e) => setTempPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#C0991B]"
                />

                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <img 
                    src={tempPhotoUrl} 
                    alt="Avatar preview" 
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
                    }}
                    className="w-28 h-28 rounded-2xl object-cover border-2 border-[#C0991B] shadow-md" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setIsPhotoStudioOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold uppercase cursor-pointer">
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    profilesStore.updateProfile(loggedUserId, { profilePhoto: tempPhotoUrl }, 'Patrick Munene (Self)');
                    setIsPhotoStudioOpen(false);
                    triggerToast('Profile picture updated!');
                  }}
                  className="px-5 py-2 bg-[#074504] text-[#C0991B] rounded-xl text-xs font-black uppercase cursor-pointer"
                >
                  Save Profile Picture
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. EDIT PUBLIC AUTHOR PAGE MODAL (WITH LIVE PREVIEW TAB) */}
      <AnimatePresence>
        {isEditPublicPageModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full border-2 border-[#C0991B] p-6 space-y-4 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#C0991B]" /> Customize Public Author Page
                </h3>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                    <button 
                      onClick={() => setCustomizeModalTab('edit')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer transition-all ${customizeModalTab === 'edit' ? 'bg-[#074504] text-[#C0991B]' : 'text-gray-600'}`}
                    >
                      Edit Fields
                    </button>
                    <button 
                      onClick={() => setCustomizeModalTab('preview')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer transition-all ${customizeModalTab === 'preview' ? 'bg-[#074504] text-[#C0991B]' : 'text-gray-600'}`}
                    >
                      Live Preview
                    </button>
                  </div>
                  <button onClick={() => setIsEditPublicPageModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {customizeModalTab === 'edit' ? (
                <div className="space-y-4 text-xs font-bold">
                  <div>
                    <label className="font-black text-gray-700 uppercase block mb-1">Public Author Headline Tagline</label>
                    <input 
                      type="text" 
                      value={publicPageFormData.publicHeadline}
                      onChange={(e) => setPublicPageFormData({ ...publicPageFormData, publicHeadline: e.target.value })}
                      placeholder="e.g., Managing Director & Microfinance Innovator"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
                    />
                  </div>

                  <div>
                    <label className="font-black text-gray-700 uppercase block mb-1">Public Author Bio (Visible to Blog Readers)</label>
                    <textarea 
                      rows={5}
                      value={publicPageFormData.publicBio}
                      onChange={(e) => setPublicPageFormData({ ...publicPageFormData, publicBio: e.target.value })}
                      placeholder="Enter the public bio that readers will see on your author profile..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
                    />
                  </div>
                </div>
              ) : (
                /* Modal Live Preview Mode */
                <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 text-xs font-black text-[#074504] uppercase">
                    <Eye className="w-4 h-4 text-[#C0991B]" />
                    <span>Public Page Reader Preview</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={loggedProfile.profilePhoto} alt={loggedProfile.displayName} className="w-14 h-14 rounded-xl object-cover border border-[#C0991B]" />
                      <div>
                        <h4 className="font-black text-base text-gray-900">{loggedProfile.displayName}</h4>
                        <p className="text-xs font-bold text-[#074504]">{publicPageFormData.publicHeadline || loggedProfile.jobTitle}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 font-medium leading-relaxed border-t border-gray-100 pt-3">
                      {publicPageFormData.publicBio || 'No public bio set.'}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setIsEditPublicPageModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold uppercase cursor-pointer">
                  Cancel
                </button>
                <button 
                  onClick={handleSaveOwnPublicPage}
                  className="px-5 py-2 bg-[#074504] text-[#C0991B] rounded-xl text-xs font-black uppercase cursor-pointer"
                >
                  Save & Publish Author Page
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. TEAM MEMBER PROFILE INSPECTOR MODAL */}
      <AnimatePresence>
        {inspectingUser && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-3xl w-full border-2 border-[#C0991B] p-6 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#C0991B]" />
                  <h3 className="font-black text-base text-[#074504] uppercase">
                    Author Profile: {inspectingUser.displayName}
                  </h3>
                </div>
                <button onClick={() => setInspectingUser(null)} className="p-2 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cover Banner */}
              <div className="h-40 w-full rounded-2xl bg-cover bg-center relative" style={{ backgroundImage: `url(${inspectingUser.coverPhoto})` }}>
                <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-4">
                  <img src={inspectingUser.profilePhoto} alt={inspectingUser.displayName} className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md bg-gray-100" />
                  <div className="text-white">
                    <h4 className="font-black text-lg">{inspectingUser.displayName}</h4>
                    <p className="text-xs text-amber-300 font-bold">{inspectingUser.jobTitle}</p>
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="space-y-6 text-xs">
                {/* 1. About the Author & Biography */}
                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                    <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                      <User className="w-4 h-4 text-[#C0991B]" /> About the Author
                    </h3>
                    <span className="px-2.5 py-0.5 bg-[#074504] text-[#C0991B] text-[10px] font-black rounded-full uppercase">
                      Verified Author
                    </span>
                  </div>
                  <p className="text-xs text-gray-800 leading-relaxed font-medium">
                    {inspectingUser.bio}
                  </p>
                  {inspectingUser.shortBio && (
                    <p className="text-xs font-bold text-[#826507] italic bg-amber-50/80 p-2.5 rounded-xl border border-[#C0991B]/30">
                      "{inspectingUser.shortBio}"
                    </p>
                  )}

                  {/* Title at Bottom of About Author section matching Header Title strictly */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-emerald-200/80 mt-2 bg-emerald-100/40 -mx-6 -mb-6 p-4 rounded-b-2xl">
                    <div className="flex items-center gap-3">
                      <img 
                        src={inspectingUser.profilePhoto} 
                        alt={inspectingUser.displayName} 
                        className="w-10 h-10 rounded-full border-2 border-[#C0991B] object-cover shadow-2xs" 
                      />
                      <div>
                        <h4 className="text-sm font-black text-[#074504] uppercase tracking-wide">
                          {inspectingUser.displayName}
                        </h4>
                        <p className="text-xs font-bold text-[#826507]">
                          {inspectingUser.publicHeadline || inspectingUser.jobTitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-[#074504] text-[#C0991B] rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C0991B]" /> Verified Author Title
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Education & Work Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div>
                    <span className="font-black text-[#074504] uppercase block mb-1">Level of Education</span>
                    <p className="text-gray-800 font-bold">{inspectingUser.levelOfEducation || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-black text-[#074504] uppercase block mb-1">Professional Membership</span>
                    <p className="text-gray-800 font-bold">
                      {inspectingUser.memberships && inspectingUser.memberships.length > 0 
                        ? inspectingUser.memberships.join(', ') 
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <span className="font-black text-[#074504] uppercase block mb-1">Years of Experience</span>
                    <p className="text-gray-800 font-bold">{inspectingUser.yearsOfExperience || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-black text-[#074504] uppercase block mb-1">Current Position</span>
                    <p className="text-gray-800 font-bold">{inspectingUser.jobTitle || 'Not specified'}</p>
                  </div>
                </div>

                {/* 3. Areas of Expertise */}
                <div>
                  <span className="font-black text-[#074504] uppercase block mb-1">Areas of Expertise</span>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectingUser.expertise.map((exp, idx) => (
                      <span key={idx} className="px-3 py-1 bg-amber-50 text-[#826507] border border-[#C0991B]/40 font-bold rounded-lg">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Articles Written by User */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h4 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#C0991B]" /> Articles Written by {inspectingUser.displayName}
                    </h4>
                    <span className="text-xs font-bold text-gray-500">
                      {inspectingUser.stats.articlesPublished} Published Articles
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        title: `Microfinance Inclusion & Credit Access Models`,
                        category: 'Financial Inclusion',
                        snippet: `Strategic frameworks published by ${inspectingUser.displayName} on expanding credit accessibility in rural communities.`,
                        date: 'July 2026',
                        reads: '3.4k reads'
                      },
                      {
                        title: `Risk Analysis & Group Guarantee Loans`,
                        category: 'Risk & Credit',
                        snippet: `Best practice guidelines and risk assessment strategies authored by ${inspectingUser.displayName}.`,
                        date: 'June 2026',
                        reads: '2.8k reads'
                      }
                    ].map((art, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-[#826507] uppercase">
                          <span>{art.category}</span>
                          <span>{art.date}</span>
                        </div>
                        <h5 className="font-bold text-xs text-gray-900 line-clamp-1">{art.title}</h5>
                        <p className="text-[11px] text-gray-600 line-clamp-2">{art.snippet}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Neema HEEP CTAs */}
                <div className="bg-gradient-to-r from-[#074504] via-[#095906] to-[#074504] p-4 rounded-2xl border border-[#C0991B] text-white space-y-3">
                  <div className="flex items-center justify-between text-xs font-black uppercase text-[#C0991B]">
                    <span>Explore Neema HEEP Solutions</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C0991B]" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <button onClick={() => { triggerToast('Navigating to Micro-Loans...'); window.location.hash = '/loans'; }} className="p-2 bg-[#C0991B] text-[#074504] font-black rounded-lg uppercase truncate hover:bg-amber-400 cursor-pointer">
                      Loans
                    </button>
                    <button onClick={() => { triggerToast('Navigating to Pre-Qualification...'); window.location.hash = '/pre-qualification'; }} className="p-2 bg-white/10 text-white border border-white/20 font-black rounded-lg uppercase truncate hover:bg-white/20 cursor-pointer">
                      Pre-Qualify
                    </button>
                    <button onClick={() => { triggerToast('Navigating to Programs...'); window.location.hash = '/programs'; }} className="p-2 bg-white/10 text-white border border-white/20 font-black rounded-lg uppercase truncate hover:bg-white/20 cursor-pointer">
                      Programs
                    </button>
                    <button onClick={() => { triggerToast('Navigating to Callback Request...'); window.location.hash = '/request-callback'; }} className="p-2 bg-white/10 text-white border border-white/20 font-black rounded-lg uppercase truncate hover:bg-white/20 cursor-pointer">
                      Lead Form
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-gray-100 pt-4">
                <button onClick={() => setInspectingUser(null)} className="px-5 py-2 bg-[#074504] text-[#C0991B] rounded-xl text-xs font-black uppercase cursor-pointer">
                  Close Profile Inspector
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. UNPUBLISH PUBLIC PAGE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeletePublicPageModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full border-2 border-red-500 p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-red-600 font-black text-sm uppercase">
                <Trash2 className="w-6 h-6" />
                <span>Unpublish Public Author Page?</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                This will unpublish your public author page. Blog readers will no longer see your author profile attached to articles.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setIsDeletePublicPageModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold uppercase cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleDeleteOwnPublicPage} className="px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase cursor-pointer">
                  Unpublish Page
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. DELETE OWN PROFILE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteProfileModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full border-2 border-red-600 p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-red-600 font-black text-sm uppercase">
                <Trash2 className="w-6 h-6" />
                <span>Delete Personal Profile?</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Are you sure you want to delete your personal author profile? This action is irreversible.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setIsDeleteProfileModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold uppercase cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleDeleteOwnProfile} className="px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase cursor-pointer">
                  Delete My Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* 8. SUPER ADMIN CREATE PROFILE MODAL */}
      <AnimatePresence>
        {isCreateProfileModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full border-2 border-[#074504] p-6 md:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3 text-[#074504]">
                  <Plus className="w-6 h-6 text-[#C0991B]" />
                  <div>
                    <h3 className="font-black text-base uppercase tracking-wide">Create New User Profile</h3>
                    <p className="text-xs text-gray-500 font-medium">Super Admin Exclusive Privilege • Provisioning Profile Module Record</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsCreateProfileModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateNewProfileSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">First Name *</label>
                    <input 
                      type="text" 
                      required
                      value={newProfileFormData.firstName || ''}
                      onChange={(e) => setNewProfileFormData({ ...newProfileFormData, firstName: e.target.value })}
                      placeholder="e.g. Grace" 
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-[#C0991B]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Middle Name</label>
                    <input 
                      type="text" 
                      value={newProfileFormData.middleName || ''}
                      onChange={(e) => setNewProfileFormData({ ...newProfileFormData, middleName: e.target.value })}
                      placeholder="e.g. Wambui" 
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-[#C0991B]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Last Name *</label>
                    <input 
                      type="text" 
                      required
                      value={newProfileFormData.lastName || ''}
                      onChange={(e) => setNewProfileFormData({ ...newProfileFormData, lastName: e.target.value })}
                      placeholder="e.g. Mwangi" 
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-[#C0991B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      value={newProfileFormData.email || ''}
                      onChange={(e) => setNewProfileFormData({ ...newProfileFormData, email: e.target.value })}
                      placeholder="grace@neemaheep.org" 
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-[#C0991B]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={newProfileFormData.phone || ''}
                      onChange={(e) => setNewProfileFormData({ ...newProfileFormData, phone: e.target.value })}
                      placeholder="+254 7..." 
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-[#C0991B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Job Title</label>
                    <input 
                      type="text" 
                      value={newProfileFormData.jobTitle || ''}
                      onChange={(e) => setNewProfileFormData({ ...newProfileFormData, jobTitle: e.target.value })}
                      placeholder="e.g. Senior Credit Officer" 
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-[#C0991B]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Department</label>
                    <input 
                      type="text" 
                      value={newProfileFormData.department || ''}
                      onChange={(e) => setNewProfileFormData({ ...newProfileFormData, department: e.target.value })}
                      placeholder="e.g. Credit & Risk" 
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-[#C0991B]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">System Role</label>
                    <select 
                      value={newProfileFormData.role || 'Author'}
                      onChange={(e) => setNewProfileFormData({ ...newProfileFormData, role: e.target.value as any })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-[#C0991B]"
                    >
                      <option value="Author">Author</option>
                      <option value="Editor">Editor</option>
                      <option value="Loan Officer">Loan Officer</option>
                      <option value="Web Master">Web Master</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Profile Bio &amp; Summary</label>
                  <textarea 
                    rows={3}
                    value={newProfileFormData.bio || ''}
                    onChange={(e) => setNewProfileFormData({ ...newProfileFormData, bio: e.target.value })}
                    placeholder="Brief background and expertise..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-[#C0991B]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button 
                    type="button"
                    onClick={() => setIsCreateProfileModalOpen(false)} 
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold uppercase cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-[#074504] text-[#C0991B] rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-[#053203] transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-[#C0991B]" /> Create Profile Now
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
