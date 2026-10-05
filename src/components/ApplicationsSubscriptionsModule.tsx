import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Briefcase, Users, Mail, UserCheck, Search, Filter, Download, 
  FileSpreadsheet, Printer, CheckCircle2, Clock, Eye, RefreshCw, 
  Building2, MapPin, Plus, X, Check, AlertCircle, FileText, ChevronRight,
  ExternalLink, Calendar, Phone, Award
} from 'lucide-react';
import { useJobs, Vacancy, JobApplication } from '../hooks/useJobs';
import { blogStore, NewsletterSubscriber } from '../lib/blogStore';
import { downloadExcel, downloadCSV, ColumnDef } from '../lib/excelReportExport';
import ReportModal from './ReportModal';

export type AppSubmodule = 'jobs' | 'job_applications' | 'volunteer_applications' | 'newsletter';

export interface AppSubscriber {
  id: string;
  email: string;
  date: string;
  status: string;
  source?: string;
}

interface ApplicationsSubscriptionsModuleProps {
  initialSubmodule?: AppSubmodule;
  showToast?: (msg: string) => void;
}

export const ApplicationsSubscriptionsModule: React.FC<ApplicationsSubscriptionsModuleProps> = ({
  initialSubmodule = 'jobs',
  showToast = (msg: string) => console.log(msg)
}) => {
  const [submodule, setSubmodule] = useState<AppSubmodule>(initialSubmodule);
  const { vacancies, applications: localJobApps, updateApplicationStatus, addVacancy } = useJobs();

  // Job Applications state
  const [jobApps, setJobApps] = useState<any[]>([]);
  // Volunteer Applications state
  const [volunteers, setVolunteers] = useState<any[]>([]);
  // Newsletter Subscriptions state
  const [subscribers, setSubscribers] = useState<AppSubscriber[]>([]);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);

  // New Vacancy form state
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobRef, setNewJobRef] = useState('');
  const [newJobDept, setNewJobDept] = useState('Credit Operations');
  const [newJobType, setNewJobType] = useState<'Full-Time' | 'Part-Time' | 'Contract' | 'Internship'>('Full-Time');
  const [newJobLocation, setNewJobLocation] = useState('Nyeri Main Branch');
  const [newJobPositions, setNewJobPositions] = useState(1);
  const [newJobDeadline, setNewJobDeadline] = useState('2026-12-31');
  const [newJobSummary, setNewJobSummary] = useState('');

  useEffect(() => {
    setSubmodule(initialSubmodule);
  }, [initialSubmodule]);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      if (submodule === 'job_applications') {
        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setJobApps(data);
        } else {
          setJobApps([]);
        }
      } else if (submodule === 'volunteer_applications') {
        const { data, error } = await supabase
          .from('volunteer_applications')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setVolunteers(data);
        } else {
          setVolunteers([]);
        }
      } else if (submodule === 'newsletter') {
        const { data, error } = await supabase
          .from('newsletter_subscriptions')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setSubscribers(data.map((d: any) => ({
            id: d.id,
            email: d.email,
            date: d.created_at || d.subscribed_at || d.date || new Date().toISOString(),
            status: d.status || 'Subscribed',
            source: d.source || 'Website Footer'
          })));
        } else {
          setSubscribers([]);
        }
      }
    } catch (err) {
      console.warn("Notice loading applications data:", err);
      if (submodule === 'job_applications') setJobApps([]);
      else if (submodule === 'volunteer_applications') setVolunteers([]);
      else if (submodule === 'newsletter') setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [submodule]);

  // Handlers for status updates
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      if (submodule === 'job_applications') {
        await supabase.from('job_applications').update({ status: newStatus }).eq('id', id);
        setJobApps(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
        showToast(`Application updated to ${newStatus}`);
      } else if (submodule === 'volunteer_applications') {
        await supabase.from('volunteer_applications').update({ status: newStatus }).eq('id', id);
        setVolunteers(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
        showToast(`Volunteer application updated to ${newStatus}`);
      } else if (submodule === 'newsletter') {
        await supabase.from('newsletter_subscriptions').update({ status: newStatus }).eq('id', id);
        setSubscribers(prev => prev.map(item => item.id === id ? { ...item, status: newStatus as any } : item));
        showToast(`Subscriber status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
      showToast('Status updated locally');
    }
  };

  // Handle Create Vacancy
  const handleCreateVacancy = () => {
    if (!newJobTitle.trim()) {
      showToast('Job Title is required');
      return;
    }
    const newVac: Vacancy = {
      id: `vac_${Date.now()}`,
      title: newJobTitle.trim(),
      refNumber: newJobRef.trim() || `NH-VAC-${Date.now().toString().slice(-4)}`,
      department: newJobDept,
      category: 'General',
      employmentType: newJobType,
      location: newJobLocation,
      workArrangement: 'On-site',
      summary: newJobSummary.trim() || 'Exciting career opportunity at Neema HEEP Microfinance.',
      responsibilities: ['Execute key departmental duties', 'Liaise with field stakeholders', 'Deliver organizational targets'],
      minQualifications: ['Bachelor degree or Diploma in relevant field', 'High integrity and strong interpersonal skills'],
      requiredExperience: '2+ Years',
      requiredSkills: ['Financial acumen', 'Client communication', 'Problem solving'],
      preferredSkills: ['Local Mt. Kenya community dialect fluency'],
      benefits: ['Competitive compensation', 'Medical cover', 'Pension scheme'],
      workingHours: '8:00 AM - 5:00 PM (Mon-Fri)',
      positionsCount: newJobPositions,
      deadline: newJobDeadline,
      expectedStartDate: '2026-11-01',
      status: 'Published',
      isFeatured: true,
      isUrgent: false,
      slug: newJobTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      viewsCount: 0,
      applicationsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addVacancy(newVac);
    showToast(`Vacancy "${newVac.title}" created successfully!`);
    setShowCreateJobModal(false);
    setNewJobTitle('');
    setNewJobRef('');
    setNewJobSummary('');
  };

  // Submodule Column & Filter Definitions
  const currentColumns: ColumnDef[] = useMemo(() => {
    switch (submodule) {
      case 'jobs':
        return [
          { key: 'refNumber', label: 'Ref Number' },
          { key: 'title', label: 'Job Title' },
          { key: 'department', label: 'Department' },
          { key: 'employmentType', label: 'Type' },
          { key: 'location', label: 'Location' },
          { key: 'positionsCount', label: 'Positions', type: 'number' },
          { key: 'deadline', label: 'Deadline' },
          { key: 'status', label: 'Status' }
        ];
      case 'job_applications':
        return [
          { key: 'applicant_name', label: 'Candidate Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'job_title', label: 'Applied Job' },
          { key: 'department', label: 'Department' },
          { key: 'status', label: 'Status' },
          { key: 'created_at', label: 'Applied Date', type: 'date' }
        ];
      case 'volunteer_applications':
        return [
          { key: 'full_name', label: 'Full Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'county', label: 'County' },
          { key: 'area_of_interest', label: 'Area of Interest' },
          { key: 'availability', label: 'Availability' },
          { key: 'status', label: 'Status' },
          { key: 'created_at', label: 'Submitted Date', type: 'date' }
        ];
      case 'newsletter':
        return [
          { key: 'email', label: 'Subscriber Email' },
          { key: 'status', label: 'Subscription Status' },
          { key: 'source', label: 'Acquisition Source' },
          { key: 'subscribedAt', label: 'Subscribed Date', type: 'date' }
        ];
      default:
        return [];
    }
  }, [submodule]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (submodule === 'jobs') {
      return vacancies.filter(v => {
        const matchesSearch = !q || v.title.toLowerCase().includes(q) || v.refNumber.toLowerCase().includes(q) || v.department.toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
        const matchesDept = departmentFilter === 'All' || v.department === departmentFilter;
        return matchesSearch && matchesStatus && matchesDept;
      });
    } else if (submodule === 'job_applications') {
      return jobApps.filter(a => {
        const matchesSearch = !q || (a.applicant_name || '').toLowerCase().includes(q) || (a.email || '').toLowerCase().includes(q) || (a.job_title || '').toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
    } else if (submodule === 'volunteer_applications') {
      return volunteers.filter(v => {
        const matchesSearch = !q || (v.full_name || '').toLowerCase().includes(q) || (v.email || '').toLowerCase().includes(q) || (v.county || '').toLowerCase().includes(q) || (v.area_of_interest || '').toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
    } else if (submodule === 'newsletter') {
      return subscribers.filter(s => {
        const matchesSearch = !q || s.email.toLowerCase().includes(q) || (s.source || '').toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
    }
    return [];
  }, [submodule, vacancies, jobApps, volunteers, subscribers, searchQuery, statusFilter, departmentFilter]);

  // Metrics for reports
  const summaryMetrics = useMemo(() => {
    const total = filteredData.length;
    if (submodule === 'jobs') {
      const published = vacancies.filter(v => v.status === 'Published').length;
      return [
        { label: 'Total Listed Vacancies', value: total, color: '#074504' },
        { label: 'Active / Published', value: published, color: '#16a34a' },
        { label: 'Departments Represented', value: new Set(vacancies.map(v => v.department)).size, color: '#C0991B' }
      ];
    } else if (submodule === 'job_applications') {
      const shortlisted = jobApps.filter(a => a.status === 'Shortlisted').length;
      const underReview = jobApps.filter(a => a.status === 'Under Review' || a.status === 'New').length;
      return [
        { label: 'Total Applications', value: total, color: '#074504' },
        { label: 'Shortlisted Candidates', value: shortlisted, color: '#16a34a' },
        { label: 'Under Review / New', value: underReview, color: '#C0991B' }
      ];
    } else if (submodule === 'volunteer_applications') {
      const approved = volunteers.filter(v => v.status === 'Approved').length;
      return [
        { label: 'Total Volunteer Inquiries', value: total, color: '#074504' },
        { label: 'Vetted & Approved', value: approved, color: '#16a34a' },
        { label: 'Active Counties', value: new Set(volunteers.map(v => v.county).filter(Boolean)).size, color: '#C0991B' }
      ];
    } else {
      const active = subscribers.filter(s => s.status === 'Subscribed').length;
      return [
        { label: 'Total Email Subscribers', value: total, color: '#074504' },
        { label: 'Active Subscriptions', value: active, color: '#16a34a' }
      ];
    }
  }, [submodule, filteredData, vacancies, jobApps, volunteers, subscribers]);

  const submoduleTitle = {
    jobs: 'Jobs & Vacancies',
    job_applications: 'Job Applications',
    volunteer_applications: 'Volunteer Applications',
    newsletter: 'Newsletter Subscriptions'
  }[submodule];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Submodule Tab Selection Header */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#074504]/10 text-[#074504] uppercase">
                Enterprise Module
              </span>
              <span className="text-xs font-bold text-gray-400">Applications &amp; Subscriptions</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 mt-1 flex items-center gap-2.5">
              <Briefcase className="w-6 h-6 text-[#074504]" />
              <span>{submoduleTitle}</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {submodule === 'jobs' && (
              <button
                onClick={() => setShowCreateJobModal(true)}
                className="px-4 py-2.5 bg-[#074504] hover:bg-[#053203] text-[#C0991B] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all uppercase tracking-wider"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Post New Vacancy</span>
              </button>
            )}

            <button
              onClick={() => downloadExcel(`${submoduleTitle.replace(/\s+/g, '_')}`, currentColumns, filteredData)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Excel</span>
            </button>

            <button
              onClick={() => downloadCSV(`${submoduleTitle.replace(/\s+/g, '_')}`, currentColumns, filteredData)}
              className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all border border-gray-200"
            >
              <Download className="w-4 h-4 text-[#C0991B]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2.5 bg-[#074504] hover:bg-[#053203] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all border border-[#C0991B]/40"
            >
              <Printer className="w-4 h-4 text-[#C0991B]" />
              <span>Generate Report</span>
            </button>

            <button
              onClick={fetchData}
              className="p-2.5 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#074504]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Submodules Nav Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide border-t border-gray-100 pt-3">
          <button
            onClick={() => setSubmodule('jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              submodule === 'jobs'
                ? 'bg-[#074504] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-[#C0991B]" />
            <span>Jobs (Vacancies)</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white">
              {vacancies.length}
            </span>
          </button>

          <button
            onClick={() => setSubmodule('job_applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              submodule === 'job_applications'
                ? 'bg-[#074504] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#C0991B]" />
            <span>Job Applications</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white">
              {jobApps.length}
            </span>
          </button>

          <button
            onClick={() => setSubmodule('volunteer_applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              submodule === 'volunteer_applications'
                ? 'bg-[#074504] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#C0991B]" />
            <span>Volunteer Applications</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white">
              {volunteers.length}
            </span>
          </button>

          <button
            onClick={() => setSubmodule('newsletter')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              submodule === 'newsletter'
                ? 'bg-[#074504] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-[#C0991B]" />
            <span>Newsletter Subscriptions</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white">
              {subscribers.length}
            </span>
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Filter ${submoduleTitle.toLowerCase()}...`}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
            >
              <option value="All">All Statuses</option>
              {submodule === 'jobs' && (
                <>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Closed">Closed</option>
                </>
              )}
              {submodule === 'job_applications' && (
                <>
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </>
              )}
              {submodule === 'volunteer_applications' && (
                <>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Rejected">Rejected</option>
                </>
              )}
              {submodule === 'newsletter' && (
                <>
                  <option value="Subscribed">Subscribed</option>
                  <option value="Unsubscribed">Unsubscribed</option>
                </>
              )}
            </select>
          </div>

          {submodule === 'jobs' && (
            <div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
              >
                <option value="All">All Departments</option>
                <option value="Credit Operations">Credit Operations</option>
                <option value="Branch Operations">Branch Operations</option>
                <option value="Agri-Business">Agri-Business</option>
                <option value="Finance & Accounting">Finance & Accounting</option>
                <option value="Executive Leadership">Executive Leadership</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Filtered Table View */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        {submodule === 'jobs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Ref #</th>
                  <th className="p-4">Job Title</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Positions</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400 font-bold">
                      No vacancies matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((v: Vacancy) => (
                    <tr key={v.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#074504]">{v.refNumber}</td>
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{v.title}</p>
                        <p className="text-[10px] text-gray-400">{v.location}</p>
                      </td>
                      <td className="p-4 text-gray-600 font-medium">{v.department}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {v.employmentType}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-gray-700">{v.positionsCount}</td>
                      <td className="p-4 font-medium text-gray-600">{v.deadline}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          v.status === 'Published' ? 'bg-emerald-100 text-emerald-800' :
                          v.status === 'Draft' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-800'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedItem({ type: 'job', ...v })}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-[#074504] hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {submodule === 'job_applications' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Applied Job</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400 font-bold">
                      No job applications matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((a: any) => (
                    <tr key={a.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{a.applicant_name}</p>
                        <p className="text-[10px] text-gray-400">{a.education_level || 'Higher Education'}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-[#074504]">{a.job_title}</p>
                        <p className="text-[10px] text-gray-400">{a.department || a.job_ref}</p>
                      </td>
                      <td className="p-4 text-gray-600">
                        <p className="font-medium">{a.email}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{a.phone}</p>
                      </td>
                      <td className="p-4 text-gray-500 font-medium">
                        {new Date(a.created_at || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <select
                          value={a.status}
                          onChange={(e) => handleUpdateStatus(a.id, e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-[11px] font-bold text-gray-800 outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedItem({ type: 'job_app', ...a })}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-[#074504] hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {submodule === 'volunteer_applications' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Volunteer</th>
                  <th className="p-4">Area of Interest</th>
                  <th className="p-4">Location / Availability</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400 font-bold">
                      No volunteer applications matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((v: any) => (
                    <tr key={v.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{v.full_name}</p>
                        <p className="text-[10px] text-gray-400">Date: {new Date(v.created_at || Date.now()).toLocaleDateString()}</p>
                      </td>
                      <td className="p-4 font-bold text-[#074504]">{v.area_of_interest}</td>
                      <td className="p-4 text-gray-600">
                        <p className="font-semibold">{v.county} County</p>
                        <p className="text-[10px] text-gray-400">{v.availability}</p>
                      </td>
                      <td className="p-4 text-gray-600">
                        <p className="font-medium">{v.email}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{v.phone}</p>
                      </td>
                      <td className="p-4">
                        <select
                          value={v.status}
                          onChange={(e) => handleUpdateStatus(v.id, e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-[11px] font-bold text-gray-800 outline-none"
                        >
                          <option value="Approved">Approved</option>
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedItem({ type: 'volunteer', ...v })}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-[#074504] hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {submodule === 'newsletter' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Subscriber Email</th>
                  <th className="p-4">Channel / Source</th>
                  <th className="p-4">Subscribed Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400 font-bold">
                      No newsletter subscribers matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((s: AppSubscriber) => (
                    <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-4 font-bold text-gray-900">{s.email}</td>
                      <td className="p-4 text-gray-600 font-medium">{s.source || 'Website Footer'}</td>
                      <td className="p-4 text-gray-500 font-medium">
                        {new Date(s.date || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          s.status === 'Subscribed' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleUpdateStatus(s.id, s.status === 'Subscribed' ? 'Unsubscribed' : 'Subscribed')}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#074504]/10 text-[#074504] flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 uppercase">
                    {selectedItem.type === 'job' ? 'Vacancy Specification' : 
                     selectedItem.type === 'job_app' ? 'Candidate Application' : 'Volunteer Dossier'}
                  </h3>
                  <p className="text-xs text-gray-500">Record ID: {selectedItem.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {selectedItem.type === 'job' && (
                <>
                  <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl font-medium">
                    <div><span className="text-gray-400 font-bold block text-[10px] uppercase">Job Title</span> {selectedItem.title}</div>
                    <div><span className="text-gray-400 font-bold block text-[10px] uppercase">Department</span> {selectedItem.department}</div>
                    <div><span className="text-gray-400 font-bold block text-[10px] uppercase">Positions</span> {selectedItem.positionsCount}</div>
                    <div><span className="text-gray-400 font-bold block text-[10px] uppercase">Deadline</span> {selectedItem.deadline}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-[10px] uppercase mb-1">Summary</span>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl">{selectedItem.summary}</p>
                  </div>
                </>
              )}

              {selectedItem.type === 'job_app' && (
                <>
                  <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl font-medium">
                    <div><span className="text-gray-400 font-bold block text-[10px] uppercase">Candidate</span> {selectedItem.applicant_name}</div>
                    <div><span className="text-gray-400 font-bold block text-[10px] uppercase">Job Applied</span> {selectedItem.job_title}</div>
                    <div><span className="text-gray-400 font-bold block text-[10px] uppercase">Phone</span> {selectedItem.phone}</div>
                    <div><span className="text-gray-400 font-bold block text-[10px] uppercase">Email</span> {selectedItem.email}</div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-amber-800 font-bold block text-[10px] uppercase">Qualifications</span>
                    <p className="text-gray-800 font-semibold">{selectedItem.education_level || 'B.Sc. Degree'}</p>
                    <p className="text-gray-600 mt-1">{selectedItem.years_experience || '3+ Years relevant industry experience'}</p>
                  </div>
                </>
              )}

              {selectedItem.type === 'volunteer' && (
                <>
                  <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl font-medium">
                    <div><span className="text-gray-400 font-bold block text-[10px] uppercase">Volunteer Name</span> {selectedItem.full_name}</div>
                    <div><span className="text-gray-400 font-bold block text-[10px] uppercase">County</span> {selectedItem.county}</div>
                    <div><span className="text-gray-400 font-bold block text-[10px] uppercase">Phone</span> {selectedItem.phone}</div>
                    <div><span className="text-gray-400 font-bold block text-[10px] uppercase">Availability</span> {selectedItem.availability}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-[10px] uppercase mb-1">Motivation &amp; Community Passion</span>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl">{selectedItem.motivation}</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post New Vacancy Modal */}
      {showCreateJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 uppercase flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#074504]" />
                <span>Post New Job Vacancy</span>
              </h3>
              <button
                onClick={() => setShowCreateJobModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Agribusiness Credit Officer"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Reference Number</label>
                  <input
                    type="text"
                    placeholder="e.g. NH-VAC-2026-08"
                    value={newJobRef}
                    onChange={(e) => setNewJobRef(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Department</label>
                  <select
                    value={newJobDept}
                    onChange={(e) => setNewJobDept(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
                  >
                    <option value="Credit Operations">Credit Operations</option>
                    <option value="Branch Operations">Branch Operations</option>
                    <option value="Agri-Business">Agri-Business</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Employment Type</label>
                  <select
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Open Positions</label>
                  <input
                    type="number"
                    min={1}
                    value={newJobPositions}
                    onChange={(e) => setNewJobPositions(parseInt(e.target.value) || 1)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={newJobDeadline}
                    onChange={(e) => setNewJobDeadline(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Location / Branch</label>
                <input
                  type="text"
                  value={newJobLocation}
                  onChange={(e) => setNewJobLocation(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Job Summary</label>
                <textarea
                  rows={3}
                  value={newJobSummary}
                  onChange={(e) => setNewJobSummary(e.target.value)}
                  placeholder="Outline core responsibilities and role objective..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowCreateJobModal(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateVacancy}
                className="px-5 py-2.5 bg-[#074504] hover:bg-[#053203] text-[#C0991B] font-black rounded-xl text-xs uppercase cursor-pointer shadow-md"
              >
                Publish Vacancy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formal Management Audit & Export Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title={`${submoduleTitle} Operations Audit Report`}
        moduleName="Applications & Subscriptions"
        submoduleName={submoduleTitle}
        summaryMetrics={summaryMetrics}
        columns={currentColumns}
        data={filteredData}
        filterDescription={`Status Filter: ${statusFilter}${submodule === 'jobs' ? ` | Department: ${departmentFilter}` : ''} | Search: "${searchQuery || 'All Records'}"`}
      />

    </div>
  );
};

export default ApplicationsSubscriptionsModule;
