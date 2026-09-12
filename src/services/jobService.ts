import { supabase } from '../lib/supabase';
import { Vacancy } from '../hooks/useJobs';

export const jobService = {
  async getJobs(): Promise<Vacancy[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map(item => ({
        id: String(item.id || `vac-${Date.now()}`),
        title: item.title || '',
        refNumber: item.ref_number || item.refNumber || `NH-VAC-${item.id}`,
        department: item.department || 'General Operations',
        category: item.category || 'General',
        employmentType: item.employment_type || item.employmentType || 'Full-Time',
        location: item.location || 'Nyeri',
        workArrangement: item.work_arrangement || 'On-site',
        summary: item.summary || item.description || '',
        responsibilities: Array.isArray(item.responsibilities) 
          ? item.responsibilities 
          : (typeof item.responsibilities === 'string' && item.responsibilities.startsWith('[') ? JSON.parse(item.responsibilities) : [item.responsibilities].filter(Boolean)),
        minQualifications: Array.isArray(item.min_qualifications) 
          ? item.min_qualifications 
          : (typeof item.min_qualifications === 'string' && item.min_qualifications.startsWith('[') ? JSON.parse(item.min_qualifications) : [item.min_qualifications].filter(Boolean)),
        requiredExperience: item.required_experience || '3+ years experience in microfinance',
        requiredSkills: Array.isArray(item.required_skills) 
          ? item.required_skills 
          : (typeof item.required_skills === 'string' && item.required_skills.startsWith('[') ? JSON.parse(item.required_skills) : [item.required_skills].filter(Boolean)),
        preferredSkills: Array.isArray(item.preferred_skills) ? item.preferred_skills : [],
        benefits: Array.isArray(item.benefits) 
          ? item.benefits 
          : (typeof item.benefits === 'string' && item.benefits.startsWith('[') ? JSON.parse(item.benefits) : [item.benefits].filter(Boolean)),
        workingHours: item.working_hours || 'Mon - Fri: 8:00 AM - 5:00 PM',
        positionsCount: Number(item.positions_count) || 1,
        deadline: item.deadline || '',
        expectedStartDate: item.expected_start_date || '',
        status: (item.status === 'Open' || item.status === 'Active' ? 'Published' : item.status) || 'Published',
        isFeatured: Boolean(item.is_featured),
        isUrgent: Boolean(item.is_urgent),
        seoTitle: item.seo_title || `${item.title} | Neema HEEP Careers`,
        metaDescription: item.meta_description || item.summary || '',
        slug: item.slug || (item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : ''),
        viewsCount: Number(item.views_count) || 0,
        applicationsCount: Number(item.applications_count) || 0,
        createdAt: item.created_at ? item.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        updatedAt: item.updated_at ? item.updated_at.split('T')[0] : new Date().toISOString().split('T')[0]
      })) as Vacancy[];
    } catch (err) {
      console.warn('[jobService] Exception fetching jobs from Supabase:', err);
      return [];
    }
  },

  async saveJob(vacancy: Vacancy): Promise<void> {
    try {
      const payload = {
        id: vacancy.id,
        title: vacancy.title,
        ref_number: vacancy.refNumber,
        department: vacancy.department,
        category: vacancy.category,
        employment_type: vacancy.employmentType,
        location: vacancy.location,
        work_arrangement: vacancy.workArrangement,
        summary: vacancy.summary,
        responsibilities: vacancy.responsibilities,
        min_qualifications: vacancy.minQualifications,
        required_experience: vacancy.requiredExperience,
        required_skills: vacancy.requiredSkills,
        benefits: vacancy.benefits,
        positions_count: vacancy.positionsCount,
        deadline: vacancy.deadline,
        status: vacancy.status,
        is_featured: vacancy.isFeatured,
        is_urgent: vacancy.isUrgent,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('jobs')
        .upsert([payload], { onConflict: 'id' });

      if (error) {
        console.warn('[jobService] Supabase job save notice:', error.message);
      }
    } catch (err) {
      console.warn('[jobService] Exception saving job to Supabase:', err);
    }
  },

  async deleteJob(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('[jobService] Supabase job delete notice:', error.message);
      }
    } catch (err) {
      console.warn('[jobService] Exception deleting job from Supabase:', err);
    }
  },

  async submitJobApplication(appData: any): Promise<void> {
    try {
      const payload = {
        full_name: `${appData.personalInfo?.firstName || ''} ${appData.personalInfo?.lastName || ''}`.trim() || appData.applicantName || '',
        email: appData.personalInfo?.email || appData.email || '',
        phone: appData.personalInfo?.phone || appData.phone || '',
        vacancy_id: appData.vacancyId || '',
        vacancy_title: appData.vacancyTitle || '',
        vacancy_ref: appData.vacancyRef || '',
        department: appData.department || '',
        app_number: appData.appNumber || '',
        id_number: appData.personalInfo?.idNumber || '',
        kra_pin: appData.personalInfo?.kraPin || '',
        county: appData.personalInfo?.county || '',
        sub_county: appData.personalInfo?.constituency || appData.personalInfo?.subCounty || '',
        ward: appData.personalInfo?.ward || '',
        education: appData.education || [],
        employment: appData.employmentHistory || [],
        memberships: appData.professionalMemberships || [],
        references: appData.references || [],
        cv_info: appData.cvInfo || {},
        status: appData.status || 'Received',
        signup_source: appData.signupSource || (typeof window !== 'undefined' ? `Careers Page (${window.location.pathname})` : 'Careers Page'),
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('job_applications')
        .insert([payload]);

      if (error) {
        console.warn('[jobService] Supabase job application save error, attempting fallback to leads:', error);
        try {
          await supabase.from('leads').insert([{
            full_name: payload.full_name,
            email: payload.email,
            phone: payload.phone,
            type: 'Career',
            details: payload,
            status: 'New',
            signup_source: 'Job Application',
            created_at: new Date().toISOString()
          }]);
        } catch {}
      }
    } catch (err) {
      console.warn('[jobService] Exception submitting job application to Supabase:', err);
    }
  },

  subscribeToJobs(onUpdate: () => void) {
    try {
      const channel = supabase
        .channel('jobs_db_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => {
          onUpdate();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      return () => {};
    }
  }
};

