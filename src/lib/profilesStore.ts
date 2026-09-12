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
  role: 'Super Admin' | 'Site Administrator' | 'Editor' | 'Author' | 'Loan Officer' | 'Webmaster' | 'Auditor' | string;
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
  }
];

class ProfilesStore {
  private profiles: ExtendedUserProfile[] = [];

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
          role: u.role || 'Author',
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
          initialPassword: u.initial_password || '',
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

        const existingEmails = new Set(fetchedProfiles.map(p => p.email.toLowerCase()));
        const localOnly = this.profiles.filter(p => !existingEmails.has(p.email.toLowerCase()));
        this.profiles = [...fetchedProfiles, ...localOnly];
        this.saveToStorage();
      }
    } catch (err) {
      console.warn("Notice loading profiles from Supabase:", err);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.profiles = JSON.parse(stored);
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
    return this.profiles.filter(p => p.status !== 'Archived' as any);
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
      initial_password: newProfile.initialPassword,
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
