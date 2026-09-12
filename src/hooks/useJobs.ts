import { useState, useEffect, useRef } from 'react';
import { jobService } from '../services/jobService';
import { blogStore } from '../lib/blogStore';

export interface Vacancy {
  id: string;
  title: string;
  refNumber: string;
  department: string;
  category: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
  location: string;
  workArrangement: 'On-site' | 'Hybrid' | 'Remote';
  summary: string;
  responsibilities: string[];
  minQualifications: string[];
  requiredExperience: string;
  requiredSkills: string[];
  preferredSkills: string[];
  benefits: string[];
  workingHours: string;
  positionsCount: number;
  deadline: string;
  expectedStartDate: string;
  status: 'Published' | 'Draft' | 'Scheduled' | 'Closed' | 'Archived';
  isFeatured: boolean;
  isUrgent: boolean;
  seoTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  slug: string;
  viewsCount: number;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export type Job = Vacancy;

export interface VacancyCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  vacanciesCount: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  vacanciesCount: number;
}

export interface EducationRecord {
  id: string;
  level: 'Certificate' | 'Diploma' | 'Higher Diploma' | 'Degree' | 'Masters' | 'PhD';
  institution: string;
  startYear: string;
  endYear: string;
  docName?: string;
}

export interface EmploymentRecord {
  id: string;
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string;
}

export interface MembershipRecord {
  id: string;
  bodyName: string;
  regNumber: string;
  certName?: string;
}

export interface ReferenceRecord {
  id: string;
  fullName: string;
  titleRelationship: string;
  company: string;
  yearsKnown: string;
  phone: string;
  email: string;
}

export interface JobApplication {
  id: string;
  appNumber: string;
  vacancyId: string;
  vacancyTitle: string;
  vacancyRef: string;
  department: string;
  status: 'New' | 'Shortlisted' | 'Under Review' | 'Interview Scheduled' | 'Rejected' | 'Hired' | 'Archived';
  submissionDate: string;
  submissionTimestamp: string;
  verificationStatus: 'Verified' | 'Pending';
  identity: {
    surname: string;
    firstName: string;
    middleName?: string;
    nationalId: string;
    nationalIdDocName?: string;
    kraPin: string;
    kraPinCertName?: string;
    phone: string;
    email: string;
    county: string;
  };
  education: EducationRecord[];
  employment: EmploymentRecord[];
  memberships: MembershipRecord[];
  references: ReferenceRecord[];
  cv: {
    fileName: string;
    fileSize: string;
  };
  declaration: {
    certifiedTrue: boolean;
    dataConsent: boolean;
  };
  adminNotes?: string;
}

export const KENYAN_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo/Marakwet', 'Embu', 'Garissa', 
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', "Murang'a", 
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 
  'Siaya', 'Taita/Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 
  'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

const INITIAL_VACANCIES: Vacancy[] = [];

const INITIAL_CATEGORIES: VacancyCategory[] = [];

const INITIAL_DEPARTMENTS: Department[] = [];

const INITIAL_APPLICATIONS: JobApplication[] = [];

export function useJobs() {
  const [vacancies, setVacancies] = useState<Vacancy[]>(() => {
    const saved = localStorage.getItem('neema_vacancies_data');
    let loaded: Vacancy[] = INITIAL_VACANCIES;
    if (saved) {
      try { loaded = JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Auto archive expired vacancies on initial load
    const todayStr = new Date().toISOString().split('T')[0];
    return loaded.map(v => {
      if (v.deadline && v.deadline < todayStr && v.status === 'Published') {
        return { ...v, status: 'Archived' as const };
      }
      return v;
    });
  });

  const [categories, setCategories] = useState<VacancyCategory[]>(() => {
    const saved = localStorage.getItem('neema_vacancy_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_CATEGORIES;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('neema_vacancy_departments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_DEPARTMENTS;
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('neema_job_applications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_APPLICATIONS;
  });

  // Synchronize with Supabase database on mount and listen to realtime updates
  useEffect(() => {
    let isMounted = true;

    async function loadFromSupabase() {
      try {
        const dbJobs = await jobService.getJobs();
        if (isMounted && dbJobs.length > 0) {
          const todayStr = new Date().toISOString().split('T')[0];
          const autoArchived = dbJobs.map(v => {
            if (v.deadline && v.deadline < todayStr && v.status === 'Published') {
              return { ...v, status: 'Archived' as const };
            }
            return v;
          });
          setVacancies(autoArchived);
          localStorage.setItem('neema_vacancies_data', JSON.stringify(autoArchived));
          blogStore.saveVacancies(autoArchived);
        }
      } catch (err) {
        console.warn('[useJobs] Error syncing with Supabase:', err);
      }
    }

    loadFromSupabase();

    // Subscribe to Supabase Realtime table changes
    const unsubscribeRealtime = jobService.subscribeToJobs(() => {
      loadFromSupabase();
    });

    return () => {
      isMounted = false;
      if (unsubscribeRealtime) unsubscribeRealtime();
    };
  }, []);

  const vacanciesRef = useRef(vacancies);
  useEffect(() => {
    vacanciesRef.current = vacancies;
  }, [vacancies]);

  useEffect(() => {
    localStorage.setItem('neema_vacancies_data', JSON.stringify(vacancies));
    blogStore.saveVacancies(vacancies);
  }, [vacancies]);

  useEffect(() => {
    localStorage.setItem('neema_vacancy_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('neema_vacancy_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('neema_job_applications', JSON.stringify(applications));
  }, [applications]);

  // Listen to cross-tab storage changes and window custom events
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('neema_vacancies_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const todayStr = new Date().toISOString().split('T')[0];
          const autoArchived = parsed.map((v: Vacancy) => {
            if (v.deadline && v.deadline < todayStr && v.status === 'Published') {
              return { ...v, status: 'Archived' as const };
            }
            return v;
          });
          if (JSON.stringify(autoArchived) !== JSON.stringify(vacanciesRef.current)) {
            setVacancies(autoArchived);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('neema_vacancies_updated', handleStorageChange);
    window.addEventListener('neema_cms_vacancies_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('neema_vacancies_updated', handleStorageChange);
      window.removeEventListener('neema_cms_vacancies_updated', handleStorageChange);
    };
  }, []);

  const notifyVacanciesUpdated = () => {
    window.dispatchEvent(new CustomEvent('neema_vacancies_updated'));
    window.dispatchEvent(new CustomEvent('neema_cms_vacancies_updated'));
  };

  // Actions
  const addVacancy = (newVac: Omit<Vacancy, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'applicationsCount'>) => {
    const created: Vacancy = {
      ...newVac,
      id: `vac-${Date.now()}`,
      viewsCount: 0,
      applicationsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setVacancies(prev => {
      const updated = [created, ...prev];
      localStorage.setItem('neema_vacancies_data', JSON.stringify(updated));
      blogStore.saveVacancies(updated);
      return updated;
    });
    // Sync to Supabase
    jobService.saveJob(created).catch(e => console.warn(e));
    setTimeout(notifyVacanciesUpdated, 50);
    return created;
  };

  const updateVacancy = (id: string, updates: Partial<Vacancy>) => {
    setVacancies(prev => {
      const updated = prev.map(v => v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : v);
      localStorage.setItem('neema_vacancies_data', JSON.stringify(updated));
      blogStore.saveVacancies(updated);
      const target = updated.find(v => v.id === id);
      if (target) {
        jobService.saveJob(target).catch(e => console.warn(e));
      }
      return updated;
    });
    setTimeout(notifyVacanciesUpdated, 50);
  };

  const deleteVacancy = (id: string) => {
    setVacancies(prev => {
      const updated = prev.filter(v => v.id !== id);
      localStorage.setItem('neema_vacancies_data', JSON.stringify(updated));
      blogStore.saveVacancies(updated);
      return updated;
    });
    jobService.deleteJob(id).catch(e => console.warn(e));
    setTimeout(notifyVacanciesUpdated, 50);
  };

  const submitJobApplication = (appData: Omit<JobApplication, 'id' | 'appNumber' | 'submissionDate' | 'submissionTimestamp' | 'verificationStatus'>) => {
    const appNum = `NH-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: JobApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      appNumber: appNum,
      submissionDate: new Date().toISOString().split('T')[0],
      submissionTimestamp: new Date().toISOString(),
      verificationStatus: 'Verified'
    };
    setApplications(prev => [newApp, ...prev]);

    // Update vacancy applicationsCount
    setVacancies(prev => prev.map(v => v.id === appData.vacancyId ? { ...v, applicationsCount: v.applicationsCount + 1 } : v));

    // Save job application to Supabase job_applications table
    jobService.submitJobApplication(newApp).catch(e => console.warn(e));

    return newApp;
  };

  const updateApplicationStatus = (appId: string, status: JobApplication['status'], notes?: string) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status, adminNotes: notes !== undefined ? notes : a.adminNotes } : a));
  };

  return {
    jobs: vacancies, // backward compatible
    vacancies,
    categories,
    departments,
    applications,
    addVacancy,
    updateVacancy,
    deleteVacancy,
    setCategories,
    setDepartments,
    submitJobApplication,
    updateApplicationStatus
  };
}
