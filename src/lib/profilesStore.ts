import { supabase } from './supabase';

export interface ExtendedUserProfile {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName: string;
  username: string;
  email: string;
  phone: string;
  whatsApp?: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  dateOfBirth?: string;
  jobTitle: string;
  department: string;
  employeeId: string;
  departmentExtension: string;
  canCreateArticles: boolean;
  physicalAddress?: string;
  role: 'Superadmin' | 'Content editor' | 'Administrator' | 'Reviewer' | string;
  status: 'Active' | 'Inactive' | 'Suspended';
  verificationStatus: 'Verified' | 'Pending' | 'Unverified' | 'Rejected';
  profilePhoto: string;
  coverPhoto: string;
  bio: string;
  shortBio: string;
  levelOfEducation: string;
  yearsOfExperience: string;
  workExperience: string[];
  preferredLanguage: string;
  timezone: string;
  expertise: string[];
  certifications: string[];
  education: string[];
  memberships: string[];
  publicHeadline?: string;
  publicBio?: string;
  publicPagePublished?: boolean;
  showPublicContact?: boolean;
  password?: string;
  initialPassword?: string;
  // Super Admin Management Metadata
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  stats: {
    articlesPublished: number;
    draftArticles: number;
    mediaUploaded: number;
    commentsModerated: number;
    communityImpactScore: number;
    readingCount: number;
    guidedLoansCount: number;
    lastLogin: string;
    memberSince: string;
  };
  achievements: string[];
}

const STORAGE_KEY = 'neema_user_profiles_v1';
const EVENT_NAME = 'neema_profiles_updated';

// Initial default profile seed
export const INITIAL_PROFILES_SEED: ExtendedUserProfile[] = [
  {
    id: 'usr-1',
    firstName: 'Patrick',
    middleName: '',
    lastName: 'Munene',
    displayName: 'Patrick Munene',
    username: 'ptrckmunene',
    email: 'ptrckmunene@gmail.com',
    phone: '+254 712 345 678',
    whatsApp: '+254 712 345 678',
    gender: 'Male',
    dateOfBirth: '1992-05-14',
    jobTitle: 'Super Admin & Senior Web developer',
    department: 'Web Development',
    employeeId: 'NH-EMP-2022-001',
    departmentExtension: 'Ext. 101 (Executive)',
    canCreateArticles: true,
    physicalAddress: 'Neema Heep Plaza, Kimathi Way, Nyeri',
    role: 'Super Admin',
    status: 'Active',
    verificationStatus: 'Verified',
    profilePhoto: '/developer_teaching_coding.jpg',
    coverPhoto: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    bio: 'Passionate about micro-financing innovation, financial inclusion, and community economic empowerment across Mt. Kenya region.',
    shortBio: 'Founder & CEO at Neema HEEP Microfinance.',
    levelOfEducation: 'Master of Science in Finance (M.Sc. Finance)',
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
    createdAt: '2022-01-15 08:30 AM',
    createdBy: 'System Initialization (Super Admin)',
    stats: {
      articlesPublished: 24,
      draftArticles: 3,
      mediaUploaded: 86,
      commentsModerated: 142,
      communityImpactScore: 98,
      readingCount: 48920,
      guidedLoansCount: 1240,
      lastLogin: '2026-08-04 08:30 AM',
      memberSince: 'January 2022'
    },
    achievements: ['First Article', '100 Articles', 'Impact Champion', 'Verified Author', 'Featured Writer', 'Top Editor']
  },
  {
    id: 'usr-2',
    firstName: 'Mary',
    middleName: 'W.',
    lastName: 'Wambui',
    displayName: 'Mary Wambui',
    username: 'marywambui',
    email: 'mary.wambui@neemaheep.org',
    phone: '+254 722 112 233',
    whatsApp: '+254 722 112 233',
    gender: 'Female',
    dateOfBirth: '1994-08-22',
    jobTitle: 'Content Editor & Communications Lead',
    department: 'Editorial & Marketing',
    employeeId: 'NH-EMP-2023-014',
    departmentExtension: 'Ext. 204',
    canCreateArticles: true,
    physicalAddress: 'Neema Heep Plaza, 2nd Floor, Nyeri',
    role: 'Content editor',
    status: 'Active',
    verificationStatus: 'Verified',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    bio: 'Experienced financial journalist and digital communicator dedicated to sharing stories of grassroots financial empowerment and women-led enterprise growth.',
    shortBio: 'Head of Content & Editorial Communications at Neema HEEP.',
    levelOfEducation: 'Bachelor of Arts in Communication & Media',
    yearsOfExperience: '8+ Years in Financial Journalism',
    workExperience: [
      'Content Editor - Neema HEEP Microfinance (2023-Present)',
      'Business Features Writer - Daily Nation (2018-2023)'
    ],
    publicHeadline: 'Financial Storyteller & Digital Publishing Specialist',
    publicBio: 'Amplifying the voices of micro-entrepreneurs and community leaders across Mount Kenya.',
    publicPagePublished: true,
    showPublicContact: true,
    preferredLanguage: 'English (UK)',
    timezone: 'Africa/Nairobi (UTC+3)',
    expertise: ['Financial Storytelling', 'Content Strategy', 'Social Impact Audits', 'Community Engagement'],
    certifications: ['Certified Content Strategist', 'Digital Marketing Professional'],
    education: ['B.A. Communication - Daystar University'],
    memberships: ['Public Relations Society of Kenya (PRSK)'],
    createdAt: '2023-03-01 09:00 AM',
    createdBy: 'Patrick Munene (Super Admin)',
    stats: {
      articlesPublished: 42,
      draftArticles: 5,
      mediaUploaded: 120,
      commentsModerated: 310,
      communityImpactScore: 94,
      readingCount: 32400,
      guidedLoansCount: 650,
      lastLogin: 'Today, 09:15 AM',
      memberSince: 'March 2023'
    },
    achievements: ['Top Writer', 'Community Favorite', 'Editor Choice']
  },
  {
    id: 'usr-3',
    firstName: 'Joseph',
    middleName: 'M.',
    lastName: 'Kariuki',
    displayName: 'Joseph Kariuki',
    username: 'josephkariuki',
    email: 'joseph.kariuki@neemaheep.org',
    phone: '+254 733 445 566',
    whatsApp: '+254 733 445 566',
    gender: 'Male',
    dateOfBirth: '1989-11-05',
    jobTitle: 'Branch Operations Administrator',
    department: 'Branch Operations',
    employeeId: 'NH-EMP-2022-005',
    departmentExtension: 'Ext. 108',
    canCreateArticles: false,
    physicalAddress: 'Neema Heep Plaza, Ground Floor, Nyeri',
    role: 'Administrator',
    status: 'Active',
    verificationStatus: 'Verified',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    bio: 'Oversees daily credit underwriting, field group activations, and compliance procedures across Nyeri, Embu, and Kirinyaga branches.',
    shortBio: 'Operations Lead managing credit workflows and partner logistics.',
    levelOfEducation: 'Bachelor of Commerce (Finance & Banking)',
    yearsOfExperience: '11+ Years in Microfinance Operations',
    workExperience: [
      'Operations Administrator - Neema HEEP (2022-Present)',
      'Credit Operations Officer - Faulu Microfinance (2015-2022)'
    ],
    publicHeadline: 'Microfinance Operations & Underwriting Lead',
    publicBio: 'Ensuring seamless financial service delivery for agricultural and business groups.',
    publicPagePublished: true,
    showPublicContact: true,
    preferredLanguage: 'English (UK)',
    timezone: 'Africa/Nairobi (UTC+3)',
    expertise: ['Branch Operations', 'Credit Underwriting', 'SME Due Diligence', 'Risk Compliance'],
    certifications: ['Certified Credit Analyst'],
    education: ['B.Com Finance - Kenyatta University'],
    memberships: ['Kenya Institute of Management (KIM)'],
    createdAt: '2022-04-10 10:00 AM',
    createdBy: 'Patrick Munene (Super Admin)',
    stats: {
      articlesPublished: 8,
      draftArticles: 1,
      mediaUploaded: 45,
      commentsModerated: 80,
      communityImpactScore: 91,
      readingCount: 14200,
      guidedLoansCount: 1850,
      lastLogin: 'Yesterday, 04:30 PM',
      memberSince: 'April 2022'
    },
    achievements: ['Operations Star', 'Efficiency Leader']
  },
  {
    id: 'usr-4',
    firstName: 'Grace',
    middleName: '',
    lastName: 'Muthoni',
    displayName: 'Grace Muthoni',
    username: 'gracemuthoni',
    email: 'grace.muthoni@neemaheep.org',
    phone: '+254 711 889 900',
    whatsApp: '+254 711 889 900',
    gender: 'Female',
    dateOfBirth: '1995-03-18',
    jobTitle: 'Compliance & Quality Reviewer',
    department: 'Risk & Compliance',
    employeeId: 'NH-EMP-2024-028',
    departmentExtension: 'Ext. 305',
    canCreateArticles: false,
    role: 'Reviewer',
    status: 'Active',
    verificationStatus: 'Verified',
    profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    bio: 'Dedicated to upholding transparency, anti-money laundering (AML) controls, and ethical lending practices in community banking.',
    shortBio: 'Quality auditor reviewing applicant credentials and publications.',
    levelOfEducation: 'Bachelor of Laws (LL.B)',
    yearsOfExperience: '6+ Years in Regulatory Compliance',
    workExperience: [
      'Compliance Reviewer - Neema HEEP (2024-Present)',
      'Legal & Compliance Associate - Centum (2020-2024)'
    ],
    publicHeadline: 'Regulatory Compliance & Risk Governance Specialist',
    publicBio: 'Guiding institutional integrity and consumer protection standards.',
    publicPagePublished: true,
    showPublicContact: false,
    preferredLanguage: 'English (UK)',
    timezone: 'Africa/Nairobi (UTC+3)',
    expertise: ['Regulatory Compliance', 'Consumer Protection', 'Risk Audits', 'Governance'],
    certifications: ['Certified Compliance Officer (CCO)'],
    education: ['LL.B - University of Nairobi'],
    memberships: ['Law Society of Kenya (LSK)'],
    createdAt: '2024-01-15 11:30 AM',
    createdBy: 'Patrick Munene (Super Admin)',
    stats: {
      articlesPublished: 4,
      draftArticles: 2,
      mediaUploaded: 15,
      commentsModerated: 215,
      communityImpactScore: 89,
      readingCount: 8900,
      guidedLoansCount: 420,
      lastLogin: 'Today, 08:00 AM',
      memberSince: 'January 2024'
    },
    achievements: ['Integrity Champion']
  }
];

class ProfilesStore {
  private profiles: ExtendedUserProfile[] = [...INITIAL_PROFILES_SEED];

  constructor() {
    this.loadFromStorage();
    this.fetchSupabaseProfiles();
  }

  public async fetchSupabaseProfiles(): Promise<void> {
    try {
      const { data, error } = await supabase.from('user_profiles').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const fetchedProfiles: ExtendedUserProfile[] = data.map((u: any) => ({
          id: u.id || `usr-${u.email}`,
          firstName: u.first_name || u.display_name?.split(' ')[0] || 'User',
          middleName: u.middle_name || '',
          lastName: u.last_name || u.display_name?.split(' ').slice(1).join(' ') || '',
          displayName: u.display_name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
          username: u.username || u.email.split('@')[0],
          email: u.email,
          phone: u.phone || '+254 700 000 000',
          whatsApp: u.whatsapp || u.phone || '+254 700 000 000',
          gender: u.gender || 'Prefer not to say',
          jobTitle: u.job_title || `${u.role || 'CMS User'} - ${u.department || 'Editorial'}`,
          department: u.department || 'CMS Editorial',
          employeeId: u.employee_id || `NH-EMP-${u.email.split('@')[0].toUpperCase()}`,
          departmentExtension: 'Ext. 200',
          canCreateArticles: true,
          physicalAddress: 'Neema HEEP HQ',
          role: u.role || 'Content editor',
          status: u.status || 'Active',
          verificationStatus: u.verification_status || 'Verified',
          profilePhoto: u.profile_photo || '/developer_teaching_coding.jpg',
          coverPhoto: u.cover_photo || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
          bio: u.bio || 'Registered CMS user at Neema HEEP.',
          shortBio: u.short_bio || `${u.job_title || u.role} at Neema HEEP.`,
          levelOfEducation: 'Bachelor Degree',
          yearsOfExperience: '3+ Years',
          workExperience: Array.isArray(u.work_experience) ? u.work_experience : [`${u.role || 'CMS User'} - Neema HEEP`],
          preferredLanguage: 'English (UK)',
          timezone: 'Africa/Nairobi (UTC+3)',
          expertise: Array.isArray(u.expertise) ? u.expertise : ['CMS Publishing', 'Microfinance'],
          certifications: Array.isArray(u.certifications) ? u.certifications : ['Certified CMS User'],
          education: Array.isArray(u.education) ? u.education : ['University Graduate'],
          memberships: Array.isArray(u.memberships) ? u.memberships : ['Neema HEEP Team'],
          publicHeadline: u.job_title || `${u.role} at Neema HEEP`,
          publicBio: u.bio || 'Registered CMS User',
          publicPagePublished: true,
          showPublicContact: true,
          password: u.password || u.initial_password || '',
          initialPassword: u.initial_password || u.password || '',
          createdAt: u.created_at ? new Date(u.created_at).toLocaleString() : new Date().toLocaleString(),
          createdBy: 'System/Supabase',
          stats: u.stats || {
            articlesPublished: 0,
            draftArticles: 0,
            mediaUploaded: 0,
            commentsModerated: 0,
            communityImpactScore: 50,
            readingCount: 0,
            guidedLoansCount: 0,
            lastLogin: 'Active',
            memberSince: '2026'
          },
          achievements: ['Registered User']
        }));

        this.profiles = fetchedProfiles;
        this.saveToStorage();
      } else if (!error && data && data.length === 0) {
        // Keep initial seed if database table has 0 rows
        if (this.profiles.length === 0) {
          this.profiles = [...INITIAL_PROFILES_SEED];
          this.saveToStorage();
        }
      }
    } catch (err) {
      console.warn("Notice loading profiles from Supabase:", err);
      if (this.profiles.length === 0) {
        this.profiles = [...INITIAL_PROFILES_SEED];
        this.saveToStorage();
      }
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.profiles = parsed;
        } else {
          this.profiles = [...INITIAL_PROFILES_SEED];
          this.saveToStorage();
        }
      } else {
        this.profiles = [...INITIAL_PROFILES_SEED];
        this.saveToStorage();
      }
    } catch (e) {
      console.warn('Error reading profiles from storage:', e);
      this.profiles = [...INITIAL_PROFILES_SEED];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profiles));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: this.profiles }));
    } catch (e) {
      console.warn('Error saving profiles to storage:', e);
    }
  }

  public getProfiles(): ExtendedUserProfile[] {
    const active = this.profiles.filter(p => p.status !== 'Archived' as any);
    return active.length > 0 ? active : [...INITIAL_PROFILES_SEED];
  }

  public getAllProfilesIncludingArchived(): ExtendedUserProfile[] {
    return [...this.profiles];
  }

  public getProfileById(id: string): ExtendedUserProfile | undefined {
    return this.profiles.find(p => p.id === id);
  }

  public createProfile(data: Partial<ExtendedUserProfile>, creatorName: string = 'Super Admin'): ExtendedUserProfile {
    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newId = `usr-${Date.now()}`;
    const fn = data.firstName?.trim() || 'New';
    const mn = data.middleName?.trim() ? ` ${data.middleName.trim()}` : '';
    const ln = data.lastName?.trim() || 'User';
    const fullName = `${fn}${mn} ${ln}`;
    const displayName = data.displayName?.trim() || fullName;
    const username = data.username?.trim().toLowerCase() || `usr_${Math.random().toString(36).substring(2, 7)}`;

    const newProfile: ExtendedUserProfile = {
      id: newId,
      firstName: fn,
      middleName: data.middleName?.trim() || '',
      lastName: ln,
      displayName: displayName,
      username: username,
      email: data.email?.trim() || `${username}@neemaheep.org`,
      phone: data.phone?.trim() || '+254 700 000 000',
      whatsApp: data.whatsApp?.trim() || data.phone?.trim() || '+254 700 000 000',
      gender: data.gender || 'Prefer not to say',
      dateOfBirth: data.dateOfBirth || '',
      jobTitle: data.jobTitle?.trim() || 'Staff Officer',
      department: data.department?.trim() || 'Operations',
      employeeId: data.employeeId?.trim() || `NH-EMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      departmentExtension: data.departmentExtension?.trim() || 'Ext. 300',
      canCreateArticles: data.canCreateArticles ?? true,
      physicalAddress: data.physicalAddress?.trim() || 'Neema HEEP HQ, Nyeri',
      role: data.role || 'Author',
      status: data.status || 'Active',
      verificationStatus: data.verificationStatus || 'Verified',
      profilePhoto: data.profilePhoto || '/developer_teaching_coding.jpg',
      coverPhoto: data.coverPhoto || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      bio: data.bio?.trim() || 'Neema HEEP enterprise team member.',
      shortBio: data.shortBio?.trim() || `${data.jobTitle || 'Staff Member'} at Neema HEEP.`,
      levelOfEducation: data.levelOfEducation?.trim() || 'Bachelor Degree',
      yearsOfExperience: data.yearsOfExperience?.trim() || '3+ Years Experience',
      workExperience: data.workExperience && data.workExperience.length > 0 ? data.workExperience : [`${data.jobTitle || 'Staff Member'} - Neema HEEP (2026-Present)`],
      preferredLanguage: data.preferredLanguage || 'English (UK)',
      timezone: data.timezone || 'Africa/Nairobi (UTC+3)',
      expertise: data.expertise || ['Microfinance', 'Community Relations'],
      certifications: data.certifications || ['Neema HEEP Certified Staff'],
      education: data.education || ['B.Sc. Business Administration'],
      memberships: data.memberships || ['Neema HEEP Staff Association'],
      publicHeadline: data.publicHeadline || data.jobTitle || 'Neema HEEP Officer',
      publicBio: data.publicBio || data.bio || 'Neema HEEP enterprise staff profile.',
      publicPagePublished: data.publicPagePublished ?? true,
      showPublicContact: data.showPublicContact ?? true,
      createdAt: formattedTimestamp,
      createdBy: creatorName,
      updatedAt: formattedTimestamp,
      updatedBy: creatorName,
      stats: data.stats || {
        articlesPublished: 0,
        draftArticles: 0,
        mediaUploaded: 0,
        commentsModerated: 0,
        communityImpactScore: 50,
        readingCount: 0,
        guidedLoansCount: 0,
        lastLogin: 'Never',
        memberSince: now.toLocaleString('en-US', { month: 'long', year: 'numeric' })
      },
      achievements: data.achievements || ['New Profile Created']
    };

    this.profiles = [newProfile, ...this.profiles];
    this.saveToStorage();

    // Async sync to Supabase user_profiles table
    supabase.from('user_profiles').upsert([{
      first_name: newProfile.firstName,
      last_name: newProfile.lastName,
      display_name: newProfile.displayName,
      username: newProfile.username,
      email: newProfile.email,
      role: newProfile.role,
      department: newProfile.department,
      status: newProfile.status,
      password: newProfile.password || newProfile.initialPassword,
      initial_password: newProfile.initialPassword || newProfile.password,
      job_title: newProfile.jobTitle
    }], { onConflict: 'email' }).then(({ error }) => {
      if (error) console.warn("Supabase user_profiles upsert notice:", error);
    });

    return newProfile;
  }

  public updateProfile(id: string, updates: Partial<ExtendedUserProfile>, updaterName: string = 'Super Admin'): ExtendedUserProfile | null {
    const idx = this.profiles.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const current = this.profiles[idx];
    const updated: ExtendedUserProfile = {
      ...current,
      ...updates,
      updatedAt: formattedTimestamp,
      updatedBy: updaterName
    };

    // Re-calculate full name if names were changed
    if (updates.firstName || updates.lastName || updates.middleName) {
      const fn = updated.firstName.trim();
      const mn = updated.middleName?.trim() ? ` ${updated.middleName.trim()}` : '';
      const ln = updated.lastName.trim();
      updated.displayName = updates.displayName || `${fn}${mn} ${ln}`;
    }

    this.profiles[idx] = updated;
    this.saveToStorage();
    return updated;
  }

  public deleteProfile(id: string): boolean {
    const initialLen = this.profiles.length;
    this.profiles = this.profiles.filter(p => p.id !== id);
    if (this.profiles.length < initialLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public deleteOrArchiveProfile(id: string, operatorName: string = 'Super Admin'): { action: 'deleted' | 'archived', profile: ExtendedUserProfile | null } {
    const profile = this.profiles.find(p => p.id === id);
    if (!profile) return { action: 'deleted', profile: null };

    const articlesPublished = profile.stats?.articlesPublished || 0;
    if (articlesPublished > 0) {
      const archived = this.updateProfile(id, {
        status: 'Archived' as any,
        canCreateArticles: false,
        publicPagePublished: false,
        shortBio: `[Archived Author] Content preserved (${articlesPublished} articles published).`
      }, operatorName);
      return { action: 'archived', profile: archived };
    } else {
      this.deleteProfile(id);
      return { action: 'deleted', profile };
    }
  }

  public subscribe(callback: (profiles: ExtendedUserProfile[]) => void): () => void {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<ExtendedUserProfile[]>;
      callback(customEvent.detail || this.getProfiles());
    };

    window.addEventListener(EVENT_NAME, handler);
    // Initial call
    callback(this.getProfiles());

    return () => {
      window.removeEventListener(EVENT_NAME, handler);
    };
  }
}

export const profilesStore = new ProfilesStore();
