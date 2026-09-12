import React, { useState, useMemo } from 'react';
import { 
  Briefcase, Plus, Search, Filter, Download, FileText, CheckCircle2, 
  Clock, AlertCircle, AlertTriangle, Building2, MapPin, Users, Calendar, Eye, Edit3, 
  Trash2, FileSpreadsheet, Printer, Send, Shield, RefreshCw, 
  ChevronRight, ArrowUpRight, BarChart3, PieChart, TrendingUp, Layers, 
  Sliders, UserCheck, X, Check, Copy, ExternalLink, Award, BookOpen, 
  Lock, Globe, Database, Terminal, ShieldCheck, Mail, Phone, Flame, ArrowLeft, Archive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  useJobs, Vacancy, JobApplication, KENYAN_COUNTIES, VacancyCategory, Department 
} from '../hooks/useJobs';
import { exportPdfReport, printHtmlReport } from '../lib/pdfPrintUtils';

export default function VacanciesAdminModule({ className = '' }: { className?: string }) {
  const { 
    vacancies, categories, departments, applications, 
    addVacancy, updateVacancy, deleteVacancy, 
    setCategories, setDepartments, updateApplicationStatus 
  } = useJobs();

  // Navigation state within Vacancies Module
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'listings' | 'all_vacancies' | 'categories_departments' | 
    'applications' | 'reports' | 'analytics_settings'
  >('listings');

  // Toggle for inline vacancy creation/editing form and posting mode
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [postingMode, setPostingMode] = useState<'single' | 'batch'>('single');

  // Batch vacancy posting state
  const [batchVacancies, setBatchVacancies] = useState<Array<{
    id: string;
    title: string;
    refNumber: string;
    department: string;
    category: string;
    employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
    location: string;
    positionsCount: number;
    deadline: string;
    summary: string;
  }>>([
    {
      id: 'batch-1',
      title: 'Senior Micro-Finance Credit Officer',
      refNumber: 'NH-VAC-2026-B01',
      department: 'Credit Operations',
      category: 'Credit & Risk',
      employmentType: 'Full-Time',
      location: 'Nyeri Main Branch',
      positionsCount: 2,
      deadline: '2026-08-30',
      summary: 'Conduct credit appraisals, manage chama field lending operations, and monitor portfolio performance.'
    },
    {
      id: 'batch-2',
      title: 'Junior Field Credit Officer',
      refNumber: 'NH-VAC-2026-B02',
      department: 'Credit Operations',
      category: 'Credit & Risk',
      employmentType: 'Full-Time',
      location: 'Murang\'a Branch',
      positionsCount: 3,
      deadline: '2026-08-30',
      summary: 'Engage with local microfinance groups, process weekly chama loan disbursements, and conduct field visits.'
    }
  ]);

  // Scheduled Vacancies State (supporting single & batch scheduling)
  const [scheduledVacancies, setScheduledVacancies] = useState<Array<{
    id: string;
    title: string;
    refNumber: string;
    department: string;
    category: string;
    positionsCount: number;
    location: string;
    scheduledDate: string;
    scheduledTime: string;
    deadline: string;
    summary: string;
    status: 'Scheduled';
  }>>([
    {
      id: 'sched-1',
      title: 'Branch Audit & Internal Control Specialist',
      refNumber: 'NH-SCHED-2026-01',
      department: 'Risk & Audit',
      category: 'Risk & Compliance',
      positionsCount: 1,
      location: 'Nyeri HQ',
      scheduledDate: '2026-08-15',
      scheduledTime: '08:00 AM',
      deadline: '2026-09-15',
      summary: 'Lead internal branch audits, compliance policy verification, and operational risk assessments.',
      status: 'Scheduled'
    },
    {
      id: 'sched-2',
      title: 'Regional Field Collection Team Lead',
      refNumber: 'NH-SCHED-2026-02',
      department: 'Credit Operations',
      category: 'Credit & Risk',
      positionsCount: 2,
      location: 'Embu & Meru Regional Branches',
      scheduledDate: '2026-08-20',
      scheduledTime: '09:00 AM',
      deadline: '2026-09-20',
      summary: 'Oversee regional group portfolio recovery, field collections, and credit officer coaching.',
      status: 'Scheduled'
    }
  ]);

  // Batch Scheduling state form
  const [batchSchedRows, setBatchSchedRows] = useState<Array<{
    id: string;
    title: string;
    refNumber: string;
    department: string;
    category: string;
    positionsCount: number;
    location: string;
    scheduledDate: string;
    scheduledTime: string;
    deadline: string;
    summary: string;
  }>>([
    {
      id: 'bsched-1',
      title: 'ICT Core Systems Administrator',
      refNumber: 'NH-BSCHED-01',
      department: 'ICT & Technology',
      category: 'IT & Digital Financial Services',
      positionsCount: 1,
      location: 'Nyeri HQ',
      scheduledDate: '2026-09-01',
      scheduledTime: '08:00 AM',
      deadline: '2026-09-30',
      summary: 'Maintain microfinance core banking software, network security infrastructure, and database backups.'
    },
    {
      id: 'bsched-2',
      title: 'Customer Experience & Tele-Support Officer',
      refNumber: 'NH-BSCHED-02',
      department: 'Operations',
      category: 'Customer Experience',
      positionsCount: 2,
      location: 'Nyeri HQ',
      scheduledDate: '2026-09-01',
      scheduledTime: '08:00 AM',
      deadline: '2026-09-30',
      summary: 'Handle member enquiries, loan product support, candidate calls, and feedback ticketing.'
    }
  ]);

  // Category & Department Addition/Editing State
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [newCategoryForm, setNewCategoryForm] = useState({ name: '', code: '', description: '' });

  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [newDeptForm, setNewDeptForm] = useState({ name: '', code: '', head: '' });

  // Active / Selected Application for details modal
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  // Editing vacancy state
  const [editingVacancyId, setEditingVacancyId] = useState<string | null>(null);

  // Search & Filter state for Vacancies
  const [vacSearch, setVacSearch] = useState('');
  const [vacStatusFilter, setVacStatusFilter] = useState('All');
  const [vacDeptFilter, setVacDeptFilter] = useState('All');

  // Search & Filter state for Applications
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('All');
  const [appDeptFilter, setAppDeptFilter] = useState('All');
  const [appCountyFilter, setAppCountyFilter] = useState('All');
  const [appTimeframeFilter, setAppTimeframeFilter] = useState('All');

  // Search & Filter state for Live Listings Screen
  const [listingsSearch, setListingsSearch] = useState('');
  const [listingsDeptFilter, setListingsDeptFilter] = useState('All');

  // Global Delete Confirmation Modal State
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    itemName?: string;
    message?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: 'Confirm Deletion',
    onConfirm: () => {}
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Vacancy Form State
  const [vacForm, setVacForm] = useState<{
    title: string;
    refNumber: string;
    department: string;
    category: string;
    employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
    location: string;
    workArrangement: 'On-site' | 'Hybrid' | 'Remote';
    summary: string;
    responsibilitiesStr: string;
    minQualificationsStr: string;
    requiredExperience: string;
    requiredSkillsStr: string;
    preferredSkillsStr: string;
    benefitsStr: string;
    workingHours: string;
    positionsCount: number;
    deadline: string;
    expectedStartDate: string;
    status: 'Published' | 'Draft' | 'Scheduled' | 'Closed' | 'Archived';
    scheduledDate: string;
    scheduledTime: string;
    scheduledNotifyApplicants: boolean;
    isFeatured: boolean;
    isUrgent: boolean;
    seoTitle: string;
    metaDescription: string;
    slug: string;
  }>({
    title: '',
    refNumber: `NH-VAC-2026-0${Math.floor(10 + Math.random() * 90)}`,
    department: 'Credit Operations',
    category: 'Credit & Risk',
    employmentType: 'Full-Time',
    location: 'Nyeri Main Branch',
    workArrangement: 'On-site',
    summary: '',
    responsibilitiesStr: 'Appraise credit applications in line with policy.\nConduct field risk assessments.\nMonitor portfolio performance.',
    minQualificationsStr: 'Bachelor Degree in Business or related field.\nMicrofinance Certification.',
    requiredExperience: '3+ years microfinance experience in Kenya.',
    requiredSkillsStr: 'Credit Appraisal, Chama Lending, M-PESA, Swahili',
    preferredSkillsStr: 'Motorcycle License, Agricultural Risk',
    benefitsStr: 'Competitive Salary, Health Insurance, Airtime & Transport',
    workingHours: 'Monday – Friday: 8:00 AM – 5:00 PM',
    positionsCount: 2,
    deadline: '2026-08-30',
    expectedStartDate: '2026-09-15',
    status: 'Published',
    scheduledDate: '2026-09-01',
    scheduledTime: '08:00',
    scheduledNotifyApplicants: true,
    isFeatured: false,
    isUrgent: false,
    seoTitle: '',
    metaDescription: '',
    slug: ''
  });

  // Reset or Load vacancy form
  const handleOpenCreateVacancy = () => {
    setEditingVacancyId(null);
    setVacForm({
      title: '',
      refNumber: `NH-VAC-2026-0${Math.floor(10 + Math.random() * 90)}`,
      department: 'Credit Operations',
      category: 'Credit & Risk',
      employmentType: 'Full-Time',
      location: 'Nyeri Main Branch',
      workArrangement: 'On-site',
      summary: '',
      responsibilitiesStr: 'Appraise credit applications in line with policy.\nConduct field risk assessments.\nMonitor portfolio performance.',
      minQualificationsStr: 'Bachelor Degree in Business or related field.\nMicrofinance Certification.',
      requiredExperience: '3+ years microfinance experience in Kenya.',
      requiredSkillsStr: 'Credit Appraisal, Chama Lending, M-PESA, Swahili',
      preferredSkillsStr: 'Motorcycle License, Agricultural Risk',
      benefitsStr: 'Competitive Salary, Health Insurance, Airtime & Transport',
      workingHours: 'Monday – Friday: 8:00 AM – 5:00 PM',
      positionsCount: 2,
      deadline: '2026-08-30',
      expectedStartDate: '2026-09-15',
      status: 'Published',
      scheduledDate: '2026-09-01',
      scheduledTime: '08:00',
      scheduledNotifyApplicants: true,
      isFeatured: false,
      isUrgent: false,
      seoTitle: '',
      metaDescription: '',
      slug: ''
    });
    setShowPublishForm(true);
    setActiveTab('all_vacancies');
  };

  const handleEditVacancy = (v: Vacancy) => {
    setEditingVacancyId(v.id);
    setVacForm({
      title: v.title,
      refNumber: v.refNumber,
      department: v.department,
      category: v.category,
      employmentType: v.employmentType,
      location: v.location,
      workArrangement: v.workArrangement,
      summary: v.summary,
      responsibilitiesStr: v.responsibilities.join('\n'),
      minQualificationsStr: v.minQualifications.join('\n'),
      requiredExperience: v.requiredExperience,
      requiredSkillsStr: v.requiredSkills.join(', '),
      preferredSkillsStr: v.preferredSkills.join(', '),
      benefitsStr: v.benefits.join(', '),
      workingHours: v.workingHours,
      positionsCount: v.positionsCount,
      deadline: v.deadline,
      expectedStartDate: v.expectedStartDate,
      status: v.status,
      scheduledDate: '2026-09-01',
      scheduledTime: '08:00',
      scheduledNotifyApplicants: true,
      isFeatured: v.isFeatured,
      isUrgent: v.isUrgent,
      seoTitle: v.seoTitle || '',
      metaDescription: v.metaDescription || '',
      slug: v.slug
    });
    setShowPublishForm(true);
    setActiveTab('all_vacancies');
  };

  const handleSaveVacancy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vacForm.title.trim()) {
      showToast('Error: Vacancy Job Title is required.');
      return;
    }

    const respArray = vacForm.responsibilitiesStr.split('\n').filter(s => s.trim().length > 0);
    const qualArray = vacForm.minQualificationsStr.split('\n').filter(s => s.trim().length > 0);
    const reqSkills = vacForm.requiredSkillsStr.split(',').map(s => s.trim()).filter(Boolean);
    const prefSkills = vacForm.preferredSkillsStr.split(',').map(s => s.trim()).filter(Boolean);
    const benArray = vacForm.benefitsStr.split(',').map(s => s.trim()).filter(Boolean);

    const generatedSlug = vacForm.slug || vacForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (editingVacancyId) {
      updateVacancy(editingVacancyId, {
        title: vacForm.title,
        refNumber: vacForm.refNumber,
        department: vacForm.department,
        category: vacForm.category,
        employmentType: vacForm.employmentType,
        location: vacForm.location,
        workArrangement: vacForm.workArrangement,
        summary: vacForm.summary,
        responsibilities: respArray,
        minQualifications: qualArray,
        requiredExperience: vacForm.requiredExperience,
        requiredSkills: reqSkills,
        preferredSkills: prefSkills,
        benefits: benArray,
        workingHours: vacForm.workingHours,
        positionsCount: vacForm.positionsCount,
        deadline: vacForm.deadline,
        expectedStartDate: vacForm.expectedStartDate,
        status: vacForm.status,
        isFeatured: vacForm.isFeatured,
        isUrgent: vacForm.isUrgent,
        seoTitle: vacForm.seoTitle || `${vacForm.title} | Neema HEEP Careers`,
        metaDescription: vacForm.metaDescription || vacForm.summary,
        slug: generatedSlug
      });
      showToast('Vacancy updated successfully!');
    } else {
      addVacancy({
        title: vacForm.title,
        refNumber: vacForm.refNumber,
        department: vacForm.department,
        category: vacForm.category,
        employmentType: vacForm.employmentType,
        location: vacForm.location,
        workArrangement: vacForm.workArrangement,
        summary: vacForm.summary,
        responsibilities: respArray,
        minQualifications: qualArray,
        requiredExperience: vacForm.requiredExperience,
        requiredSkills: reqSkills,
        preferredSkills: prefSkills,
        benefits: benArray,
        workingHours: vacForm.workingHours,
        positionsCount: vacForm.positionsCount,
        deadline: vacForm.deadline,
        expectedStartDate: vacForm.expectedStartDate,
        status: vacForm.status,
        isFeatured: vacForm.isFeatured,
        isUrgent: vacForm.isUrgent,
        seoTitle: vacForm.seoTitle || `${vacForm.title} | Neema HEEP Careers`,
        metaDescription: vacForm.metaDescription || vacForm.summary,
        slug: generatedSlug
      });
      if (vacForm.status === 'Scheduled') {
        showToast(`Vacancy "${vacForm.title}" scheduled for release on ${vacForm.scheduledDate} at ${vacForm.scheduledTime}!`);
      } else if (vacForm.status === 'Draft') {
        showToast(`Vacancy "${vacForm.title}" saved as draft.`);
      } else {
        showToast('New Vacancy published successfully!');
      }
    }
    setShowPublishForm(false);
    setEditingVacancyId(null);
    setActiveTab('all_vacancies');
  };

  // Batch vacancy publishing handler (posting more than one vacancy at a time)
  const handleBatchPublishVacancies = (e: React.FormEvent) => {
    e.preventDefault();
    if (batchVacancies.length === 0) {
      showToast('Error: Please add at least one vacancy to batch publish.');
      return;
    }
    let publishedCount = 0;
    batchVacancies.forEach(bv => {
      if (bv.title.trim()) {
        addVacancy({
          title: bv.title,
          refNumber: bv.refNumber || `NH-VAC-${Date.now()}`,
          department: bv.department || departments[0]?.name || 'Operations',
          category: bv.category || categories[0]?.name || 'Credit & Risk',
          employmentType: bv.employmentType || 'Full-Time',
          location: bv.location || 'Nyeri HQ',
          workArrangement: 'On-site',
          summary: bv.summary || `${bv.title} position at Neema HEEP Microfinance.`,
          responsibilities: ['Execute assigned microfinance duties according to policy.'],
          minQualifications: ['Relevant academic degree or diploma.'],
          requiredExperience: '2+ years relevant experience.',
          requiredSkills: ['Financial analysis', 'Customer service'],
          preferredSkills: ['Microfinance software'],
          benefits: ['Health insurance', 'Performance bonus'],
          workingHours: 'Mon - Fri 8:00 AM - 5:00 PM',
          positionsCount: bv.positionsCount || 1,
          deadline: bv.deadline || '2026-08-31',
          expectedStartDate: '2026-09-15',
          status: 'Published',
          isFeatured: false,
          isUrgent: false,
          seoTitle: `${bv.title} | Neema HEEP Careers`,
          metaDescription: bv.summary,
          slug: bv.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        });
        publishedCount++;
      }
    });
    showToast(`Successfully batch published ${publishedCount} vacancies simultaneously!`);
    setShowPublishForm(false);
    setActiveTab('all_vacancies');
  };

  // Handle publishing a scheduled vacancy live
  const handlePublishScheduledNow = (id: string) => {
    const item = scheduledVacancies.find(s => s.id === id);
    if (!item) return;
    addVacancy({
      title: item.title,
      refNumber: item.refNumber,
      department: item.department,
      category: item.category,
      employmentType: 'Full-Time',
      location: item.location,
      workArrangement: 'On-site',
      summary: item.summary,
      responsibilities: ['Perform key duties in line with organizational goals.'],
      minQualifications: ['Relevant qualifications required.'],
      requiredExperience: 'Relevant experience',
      requiredSkills: ['Core skills'],
      preferredSkills: [],
      benefits: ['Medical cover', 'Transport allowance'],
      workingHours: 'Mon - Fri 8:00 AM - 5:00 PM',
      positionsCount: item.positionsCount,
      deadline: item.deadline,
      expectedStartDate: '2026-09-15',
      status: 'Published',
      isFeatured: true,
      isUrgent: false,
      seoTitle: `${item.title} | Neema HEEP Careers`,
      metaDescription: item.summary,
      slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    });
    setScheduledVacancies(prev => prev.filter(s => s.id !== id));
    showToast(`Scheduled vacancy "${item.title}" is now LIVE on the portal!`);
  };

  // Filtered Vacancies list
  const filteredVacancies = useMemo(() => {
    return vacancies.filter(v => {
      // Automatically remove archived vacancies from vacancies directory
      if (v.status === 'Archived') return false;
      const matchSearch = v.title.toLowerCase().includes(vacSearch.toLowerCase()) || 
                          v.refNumber.toLowerCase().includes(vacSearch.toLowerCase()) ||
                          v.location.toLowerCase().includes(vacSearch.toLowerCase());
      const matchStatus = vacStatusFilter === 'All' || v.status === vacStatusFilter;
      const matchDept = vacDeptFilter === 'All' || v.department === vacDeptFilter;
      return matchSearch && matchStatus && matchDept;
    });
  }, [vacancies, vacSearch, vacStatusFilter, vacDeptFilter]);

  // Filtered Applications list
  const filteredApplications = useMemo(() => {
    return applications.filter(a => {
      const name = `${a.identity.firstName} ${a.identity.surname}`.toLowerCase();
      const matchSearch = name.includes(appSearch.toLowerCase()) || 
                          a.appNumber.toLowerCase().includes(appSearch.toLowerCase()) ||
                          a.vacancyTitle.toLowerCase().includes(appSearch.toLowerCase()) ||
                          a.identity.nationalId.includes(appSearch) ||
                          a.identity.kraPin.toLowerCase().includes(appSearch.toLowerCase()) ||
                          a.identity.phone.includes(appSearch) ||
                          a.identity.email.toLowerCase().includes(appSearch.toLowerCase());
      
      const matchStatus = appStatusFilter === 'All' || a.status === appStatusFilter;
      const matchDept = appDeptFilter === 'All' || a.department === appDeptFilter;
      const matchCounty = appCountyFilter === 'All' || a.identity.county === appCountyFilter;
      
      return matchSearch && matchStatus && matchDept && matchCounty;
    });
  }, [applications, appSearch, appStatusFilter, appDeptFilter, appCountyFilter]);

  // KPIs
  const activeVacanciesCount = vacancies.filter(v => v.status === 'Published').length;
  const closedVacanciesCount = vacancies.filter(v => v.status === 'Closed').length;
  const draftVacanciesCount = vacancies.filter(v => v.status === 'Draft').length;
  const totalAppsCount = applications.length;
  const totalViews = vacancies.reduce((acc, curr) => acc + curr.viewsCount, 0);
  const conversionRate = totalViews > 0 ? ((totalAppsCount / totalViews) * 100).toFixed(1) : '0.0';

  // Export handlers
  const handleExportApplicationsCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "App Number,Applicant Name,National ID,KRA PIN,Phone,Email,County,Vacancy,Department,Status,Submission Date\n";
    applications.forEach(a => {
      const name = `${a.identity.firstName} ${a.identity.surname}`;
      csvContent += `"${a.appNumber}","${name}","${a.identity.nationalId}","${a.identity.kraPin}","${a.identity.phone}","${a.identity.email}","${a.identity.county}","${a.vacancyTitle}","${a.department}","${a.status}","${a.submissionDate}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Neema_HEEP_Job_Applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Applications to CSV!');
  };

  // PDF Export for Vacancies
  const handleExportVacanciesPDF = () => {
    if (vacancies.length === 0) {
      showToast('No vacancies to export.');
      return;
    }
    const columns = ['Ref No.', 'Job Title', 'Department', 'Category', 'Type', 'Positions', 'Deadline', 'Status'];
    const rows = vacancies.map(v => [
      v.refNumber,
      v.title,
      v.department,
      v.category,
      v.employmentType,
      v.positionsCount,
      v.deadline,
      v.status
    ]);
    exportPdfReport({
      title: 'Neema HEEP Microfinance - Published Vacancies Roster',
      subtitle: `Total Active Vacancies: ${vacancies.length} | Official Human Resources Audit Report`,
      columns,
      rows,
      filename: `Neema_HEEP_Vacancies_${new Date().toISOString().split('T')[0]}.pdf`,
      orientation: 'landscape'
    });
    showToast('Downloaded Vacancies PDF Report!');
  };

  // Print Report for Vacancies
  const handlePrintVacanciesReport = () => {
    if (vacancies.length === 0) {
      showToast('No vacancies to print.');
      return;
    }
    const columns = ['Ref No.', 'Job Title', 'Department', 'Category', 'Type', 'Positions', 'Deadline', 'Status'];
    const rows = vacancies.map(v => [
      v.refNumber,
      v.title,
      v.department,
      v.category,
      v.employmentType,
      v.positionsCount,
      v.deadline,
      v.status
    ]);
    printHtmlReport({
      title: 'Published Vacancies & Positions Audit Roster',
      subtitle: `Total Active Positions: ${vacancies.length} | HR Management System`,
      columns,
      rows
    });
  };

  // PDF Export for Applications
  const handleExportApplicationsPDF = () => {
    if (applications.length === 0) {
      showToast('No job applications to export.');
      return;
    }
    const columns = ['App No.', 'Applicant Name', 'National ID', 'Phone', 'County', 'Target Vacancy', 'Status', 'Submitted'];
    const rows = applications.map(a => [
      a.appNumber,
      `${a.identity.firstName} ${a.identity.surname}`,
      a.identity.nationalId,
      a.identity.phone,
      a.identity.county,
      a.vacancyTitle,
      a.status,
      a.submissionDate
    ]);
    exportPdfReport({
      title: 'Neema HEEP Microfinance - Job Applications Master Report',
      subtitle: `Total Submitted Applications: ${applications.length} | Verified Recruitment Data`,
      columns,
      rows,
      filename: `Neema_HEEP_Job_Applications_${new Date().toISOString().split('T')[0]}.pdf`,
      orientation: 'landscape'
    });
    showToast('Downloaded Job Applications PDF Report!');
  };

  // Print Report for Applications
  const handlePrintApplicationsReport = () => {
    if (applications.length === 0) {
      showToast('No job applications to print.');
      return;
    }
    const columns = ['App No.', 'Applicant Name', 'National ID', 'Phone', 'County', 'Target Vacancy', 'Status', 'Submitted'];
    const rows = applications.map(a => [
      a.appNumber,
      `${a.identity.firstName} ${a.identity.surname}`,
      a.identity.nationalId,
      a.identity.phone,
      a.identity.county,
      a.vacancyTitle,
      a.status,
      a.submissionDate
    ]);
    printHtmlReport({
      title: 'Job Applications Audit Report',
      subtitle: `Total Submitted Applications: ${applications.length} | Recruitment & Selection Pipeline`,
      columns,
      rows
    });
  };

  // Live Listings Memoized Computations
  const publishedVacancies = useMemo(() => {
    return vacancies.filter(v => v.status === 'Published');
  }, [vacancies]);

  const expiredPublishedCount = useMemo(() => {
    return publishedVacancies.filter(v => v.deadline && new Date(v.deadline) < new Date()).length;
  }, [publishedVacancies]);

  const filteredListings = useMemo(() => {
    return publishedVacancies.filter(v => {
      const matchesSearch = v.title.toLowerCase().includes(listingsSearch.toLowerCase()) ||
                            v.refNumber.toLowerCase().includes(listingsSearch.toLowerCase());
      const matchesDept = listingsDeptFilter === 'All' || v.department === listingsDeptFilter;
      return matchesSearch && matchesDept;
    });
  }, [publishedVacancies, listingsSearch, listingsDeptFilter]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#074504] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#C0991B]/40 flex items-center gap-3 font-bold text-xs"
          >
            <ShieldCheck className="w-4 h-4 text-[#C0991B]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#074504] text-white p-6 md:p-8 rounded-2xl shadow-lg border border-[#C0991B]/30 relative overflow-hidden space-y-4">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <Briefcase className="w-48 h-48 text-[#C0991B]" />
        </div>

        {/* 1. Title */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-[#C0991B] shrink-0" />
            <span>VACANCIES MANAGEMENT MODULE</span>
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-[#C0991B] text-[#033B18] font-black text-[10px] uppercase tracking-wider rounded-full shadow-xs">
              Recruitment System
            </span>
            <span className="px-2.5 py-1 bg-white/10 text-white font-bold text-[10px] uppercase rounded-full border border-white/20">
              Data Protection Act Compliant
            </span>
          </div>
        </div>

        {/* 2. Description Text */}
        <p className="relative z-10 text-xs md:text-sm text-white/85 font-medium leading-relaxed max-w-4xl">
          Manage vacancy lifecycles, publish positions, review applications, and export HR recruitment reports.
        </p>

        {/* 3. CTA buttons */}
        <div className="relative z-10 pt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreateVacancy}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-[#C0991B] hover:bg-[#a88414] text-[#033B18] font-black text-xs uppercase rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Publish Vacancy</span>
          </button>
          <button
            type="button"
            onClick={handleExportVacanciesPDF}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            title="Export Vacancies PDF Report"
          >
            <Download className="w-4 h-4 text-[#C0991B]" />
            <span>Export PDF</span>
          </button>
          <button
            type="button"
            onClick={handlePrintVacanciesReport}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            title="Print Vacancies Report"
          >
            <Printer className="w-4 h-4 text-[#C0991B]" />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            title="View Reports & Analytics"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#C0991B]" />
            <span>Reports</span>
          </button>
        </div>

        {/* Module Sub-Navigation Bar */}
        <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-1.5 relative z-10">
          {[
            { id: 'dashboard', label: 'Overview', icon: BarChart3, badge: activeVacanciesCount },
            { id: 'listings', label: 'Listings', icon: Eye, badge: publishedVacancies.length },
            { id: 'all_vacancies', label: 'Vacancies', icon: Briefcase, badge: vacancies.length },
            { id: 'categories_departments', label: 'CAT & DEPT', icon: Layers, badge: categories.length + departments.length },
            { id: 'applications', label: 'Applications', icon: UserCheck, badge: totalAppsCount },
            { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive 
                    ? 'bg-white text-[#074504] shadow-xs font-black' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#074504]' : 'text-[#C0991B]'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                    isActive ? 'bg-[#074504] text-[#C0991B]' : 'bg-white/20 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB: LIVE LISTINGS SCREEN ================= */}
      {activeTab === 'listings' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Banner - Formatted as: Title -> Text -> Buttons */}
          <div className="bg-[#074504] p-6 rounded-3xl text-white shadow-lg flex flex-col gap-4 relative overflow-hidden border border-[#C0991B]/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C0991B] opacity-10 rounded-full blur-2xl pointer-events-none"></div>
            
            {/* 1. TITLE */}
            <div className="space-y-1.5 z-10">
              <div className="inline-flex items-center gap-2 bg-[#C0991B]/20 text-[#C0991B] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" /> Careers Portal Sync
              </div>
              <h3 className="font-black text-xl text-white uppercase tracking-tight flex items-center gap-2">
                Live Posted Vacancies ({publishedVacancies.length})
              </h3>
            </div>

            {/* 2. TEXT */}
            <p className="text-xs text-white/80 font-medium max-w-3xl leading-relaxed z-10">
              Positions listed here are live and viewable by candidates on the public Careers page. Manage, unlist upon deadline expiry, or permanently delete postings directly.
            </p>

            {/* 3. BUTTONS */}
            <div className="flex flex-wrap items-center gap-2.5 z-10 pt-1">
              <button
                type="button"
                onClick={() => {
                  let unlistedCount = 0;
                  vacancies.forEach(v => {
                    if (v.status === 'Published' && v.deadline && new Date(v.deadline) < new Date()) {
                      updateVacancy(v.id, { status: 'Closed' });
                      unlistedCount++;
                    }
                  });
                  if (unlistedCount > 0) {
                    showToast(`Successfully unlisted ${unlistedCount} expired vacancy/vacancies!`);
                  } else {
                    showToast('No published vacancies are currently expired.');
                  }
                }}
                className="px-4 py-2.5 bg-[#C0991B] text-[#033B18] hover:bg-amber-400 font-black text-xs uppercase rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                title="Unlist all vacancies past their closing deadline"
              >
                <Clock className="w-4 h-4" />
                <span>Unlist All Expired ({expiredPublishedCount})</span>
              </button>
              <button
                type="button"
                onClick={handleOpenCreateVacancy}
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-black text-xs uppercase rounded-xl transition-all cursor-pointer flex items-center gap-2 border border-white/20"
              >
                <Plus className="w-4 h-4 text-[#C0991B]" />
                <span>New Vacancy</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-[#074504] rounded-xl font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Live Listings</p>
                <p className="text-lg font-black text-[#074504]">{publishedVacancies.length}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
              <div className="p-3 bg-amber-100 text-amber-800 rounded-xl font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Expired (Pending Unlist)</p>
                <p className="text-lg font-black text-amber-800">{expiredPublishedCount}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-800 rounded-xl font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Total Applicants</p>
                <p className="text-lg font-black text-blue-900">
                  {publishedVacancies.reduce((acc, v) => acc + (v.applicationsCount || 0), 0)}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
              <div className="p-3 bg-purple-100 text-purple-800 rounded-xl font-bold">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Portal Impressions</p>
                <p className="text-lg font-black text-purple-900">
                  {publishedVacancies.reduce((acc, v) => acc + (v.viewsCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={listingsSearch}
                onChange={e => setListingsSearch(e.target.value)}
                placeholder="Filter live listings by title, ref..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#074504]"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={listingsDeptFilter}
                onChange={e => setListingsDeptFilter(e.target.value)}
                className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#074504]"
              >
                <option value="All">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Listings Cards / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredListings.length === 0 ? (
              <div className="col-span-full p-12 bg-white rounded-3xl border border-gray-200 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="font-black text-sm text-gray-700 uppercase">No Live Listings Match Criteria</h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Either no vacancies are currently set to "Published" or your search filter didn't return any matches.
                </p>
              </div>
            ) : (
              filteredListings.map(v => {
                const isExpired = v.deadline && new Date(v.deadline) < new Date();
                return (
                  <div key={v.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs hover:border-[#074504]/40 transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className="font-black text-sm text-[#074504] block">{v.title}</span>
                          <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md inline-block">
                            {v.refNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isExpired ? (
                            <span className="px-2.5 py-1 bg-red-100 text-red-800 text-[10px] font-black uppercase rounded-full flex items-center gap-1 animate-pulse">
                              <AlertCircle className="w-3 h-3" /> Expired
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase rounded-full flex items-center gap-1">
                              <Globe className="w-3 h-3" /> Live
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-gray-600">
                        <div>
                          <span className="text-[10px] text-gray-400 block font-bold uppercase">Department</span>
                          <span className="font-bold text-gray-800">{v.department}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block font-bold uppercase">Category</span>
                          <span className="font-bold text-gray-800">{v.category}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block font-bold uppercase">Location</span>
                          <span className="font-bold text-gray-800">{v.location}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block font-bold uppercase">Deadline</span>
                          <span className={`font-mono font-black ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                            {v.deadline}
                          </span>
                        </div>
                      </div>

                      {v.summary && (
                        <p className="text-xs text-gray-500 line-clamp-2 pt-1">
                          {v.summary}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-black text-gray-900">{v.applicationsCount || 0} Apps</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{v.viewsCount || 0} Views</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* UNLIST BUTTON */}
                        <button
                          type="button"
                          onClick={() => {
                            updateVacancy(v.id, { status: 'Closed' });
                            showToast(`Vacancy "${v.title}" unlisted from public careers page.`);
                          }}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1 border border-amber-200"
                          title="Unlist from public careers page"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          <span>Unlist</span>
                        </button>

                        {/* DELETE BUTTON WITH POP-UP DIALOGUE BOX */}
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteConfirmModal({
                              isOpen: true,
                              title: 'Delete Live Vacancy',
                              itemName: v.title,
                              message: `Are you sure you want to permanently delete vacancy "${v.title}" (${v.refNumber})? This will unlist it from the careers page and remove all associated records.`,
                              onConfirm: () => {
                                deleteVacancy(v.id);
                                showToast(`Vacancy "${v.title}" deleted successfully.`);
                              }
                            });
                          }}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                          title="Delete vacancy"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 1: VACANCIES OVERVIEW ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setActiveTab('all_vacancies')}
              className="px-4 py-2 bg-[#074504] text-[#C0991B] hover:bg-[#053203] font-bold text-xs uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Vacancies Screen</span>
            </button>
            <span className="font-black text-xs text-[#074504] uppercase flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#C0991B]" /> Vacancies Performance & Overview
            </span>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border-t-4 border-t-[#074504] border-x border-b border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">Active Vacancies</span>
                <Briefcase className="w-5 h-5 text-[#074504]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#074504]">{activeVacanciesCount}</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Published</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Accepting applications online</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">Applications Received</span>
                <Users className="w-5 h-5 text-[#C0991B]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900">{totalAppsCount}</span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-[#C0991B]/30">Verified</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">OTP identity verified submissions</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-t-4 border-t-blue-600 border-x border-b border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">Vacancy Views</span>
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900">{totalViews}</span>
                <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">Portal Visits</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Public job view impressions</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-t-4 border-t-purple-600 border-x border-b border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">Conversion Rate</span>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-900">{conversionRate}%</span>
                <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">App / Views</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Completed submission ratio</p>
            </div>
          </div>

          {/* Secondary Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recently Submitted Applications Widget */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#C0991B]" /> Recently Submitted Applications
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">Latest OTP-verified candidate submissions</p>
                </div>
                <button
                  onClick={() => setActiveTab('applications')}
                  className="text-xs font-bold text-[#074504] hover:text-[#C0991B] flex items-center gap-1 cursor-pointer"
                >
                  <span>View All ({totalAppsCount})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {applications.slice(0, 4).map(app => (
                  <div key={app.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#C0991B] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-xs text-[#074504]">
                          {app.identity.firstName} {app.identity.surname}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-800 text-[9px] font-mono font-bold rounded-md">
                          {app.appNumber}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5" /> Verified
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-700">{app.vacancyTitle} - <span className="text-gray-500 font-normal">{app.identity.county} County</span></p>
                      <span className="text-[10px] text-gray-400 font-mono">Submitted: {app.submissionDate}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${
                        app.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'Under Review' ? 'bg-amber-100 text-amber-900 border border-[#C0991B]/40' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {app.status}
                      </span>
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1.5 bg-[#074504] text-white rounded-lg text-xs font-bold uppercase cursor-pointer hover:bg-[#053203]"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines & Quick Status */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4">
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Calendar className="w-4 h-4 text-[#C0991B]" /> Upcoming Deadlines
                </h3>

                <div className="space-y-3">
                  {vacancies.slice(0, 3).map(v => (
                    <div key={v.id} className="p-3 bg-amber-50/60 rounded-xl border border-[#C0991B]/30 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#074504] truncate max-w-[180px]">{v.title}</span>
                        <span className="text-[10px] font-extrabold bg-[#C0991B] text-[#033B18] px-2 py-0.5 rounded-full">
                          {v.positionsCount} Slots
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-600 font-medium">
                        <span>Deadline: <strong className="text-amber-900">{v.deadline}</strong></span>
                        <span className="text-gray-500 font-mono">{v.applicationsCount} Apps</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recruitment Activity Timeline */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4">
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Clock className="w-4 h-4 text-[#C0991B]" /> Activity Feed
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-bold text-gray-900">New Application Submitted</p>
                      <p className="text-gray-500 text-[11px]">James Mwangi applied for Senior Credit Officer</p>
                      <span className="text-[9px] text-gray-400 font-mono">Today, 10:14 AM</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#C0991B] mt-1.5 shrink-0" />
                    <div>
                      <p className="font-bold text-gray-900">Vacancy Published</p>
                      <p className="text-gray-500 text-[11px]">IT Systems Specialist ref NH-VAC-2026-003</p>
                      <span className="text-[9px] text-gray-400 font-mono">Yesterday, 4:20 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: VACANCIES ================= */}
      {activeTab === 'all_vacancies' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Embedded Publish / Edit Vacancy Form */}
          {showPublishForm && (
            <div className="bg-white rounded-2xl border-2 border-[#074504]/20 shadow-lg p-6 space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowPublishForm(false); setEditingVacancyId(null); }}
                    className="px-3.5 py-2 bg-[#074504] text-[#C0991B] hover:bg-[#053203] font-bold text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Vacancies Screen</span>
                  </button>
                  <div>
                    <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#C0991B]" />
                      {editingVacancyId ? 'Edit Vacancy Specification' : 'Publish New Vacancy'}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">Capture comprehensive position details or post multiple vacancies at once</p>
                  </div>
                </div>

                {!editingVacancyId && (
                  <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setPostingMode('single')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        postingMode === 'single' ? 'bg-[#074504] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Single Vacancy
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostingMode('batch')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        postingMode === 'batch' ? 'bg-[#074504] text-[#C0991B] shadow-xs' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Batch Post Multiple ({batchVacancies.length})
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => { setShowPublishForm(false); setEditingVacancyId(null); }}
                  className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer shrink-0"
                >
                  Close Form
                </button>
              </div>

              {/* BATCH POSTING FORM */}
              {postingMode === 'batch' && !editingVacancyId ? (
                <form onSubmit={handleBatchPublishVacancies} className="space-y-6">
                  <div className="p-4 bg-amber-50 rounded-2xl border border-[#C0991B]/40 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="font-black text-xs text-[#074504] uppercase block">Multi-Vacancy Batch Publishing Mode</span>
                      <p className="text-[11px] text-gray-600 font-medium">Add, configure, and publish multiple open positions simultaneously in a single click.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setBatchVacancies(prev => [
                          ...prev,
                          {
                            id: `batch-${Date.now()}`,
                            title: '',
                            refNumber: `NH-VAC-2026-B0${prev.length + 1}`,
                            department: departments[0]?.name || 'Credit Operations',
                            category: categories[0]?.name || 'Credit & Risk',
                            employmentType: 'Full-Time',
                            location: 'Nyeri HQ',
                            positionsCount: 1,
                            deadline: '2026-08-30',
                            summary: ''
                          }
                        ]);
                      }}
                      className="px-3.5 py-2 bg-[#074504] text-[#C0991B] font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-[#053203]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Vacancy Row</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {batchVacancies.map((bv, idx) => (
                      <div key={bv.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                          <span className="font-black text-xs text-[#074504] uppercase">Position #{idx + 1}</span>
                          {batchVacancies.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setBatchVacancies(prev => prev.filter(b => b.id !== bv.id))}
                              className="text-red-600 hover:text-red-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" /> Remove Row
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                          <div className="space-y-1">
                            <label className="font-bold text-gray-700">Job Title *</label>
                            <input 
                              type="text"
                              value={bv.title}
                              onChange={e => {
                                const val = e.target.value;
                                setBatchVacancies(prev => prev.map(b => b.id === bv.id ? { ...b, title: val } : b));
                              }}
                              placeholder="e.g. Senior Credit Officer"
                              required
                              className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold text-gray-900"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-gray-700">Ref Number</label>
                            <input 
                              type="text"
                              value={bv.refNumber}
                              onChange={e => {
                                const val = e.target.value;
                                setBatchVacancies(prev => prev.map(b => b.id === bv.id ? { ...b, refNumber: val } : b));
                              }}
                              className="w-full p-2 bg-white border border-gray-300 rounded-xl font-mono text-gray-900"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-gray-700">Department</label>
                            <select
                              value={bv.department}
                              onChange={e => {
                                const val = e.target.value;
                                setBatchVacancies(prev => prev.map(b => b.id === bv.id ? { ...b, department: val } : b));
                              }}
                              className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold text-[#074504]"
                            >
                              {departments.map(d => (
                                <option key={d.id} value={d.name}>{d.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-gray-700">Category</label>
                            <select
                              value={bv.category}
                              onChange={e => {
                                const val = e.target.value;
                                setBatchVacancies(prev => prev.map(b => b.id === bv.id ? { ...b, category: val } : b));
                              }}
                              className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold text-[#074504]"
                            >
                              {categories.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-gray-700">Location</label>
                            <input 
                              type="text"
                              value={bv.location}
                              onChange={e => {
                                const val = e.target.value;
                                setBatchVacancies(prev => prev.map(b => b.id === bv.id ? { ...b, location: val } : b));
                              }}
                              className="w-full p-2 bg-white border border-gray-300 rounded-xl text-gray-900"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-gray-700">Slots (Positions)</label>
                            <input 
                              type="number"
                              min={1}
                              value={bv.positionsCount}
                              onChange={e => {
                                const val = parseInt(e.target.value) || 1;
                                setBatchVacancies(prev => prev.map(b => b.id === bv.id ? { ...b, positionsCount: val } : b));
                              }}
                              className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold text-gray-900"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-gray-700">Deadline</label>
                            <input 
                              type="date"
                              value={bv.deadline}
                              onChange={e => {
                                const val = e.target.value;
                                setBatchVacancies(prev => prev.map(b => b.id === bv.id ? { ...b, deadline: val } : b));
                              }}
                              className="w-full p-2 bg-white border border-gray-300 rounded-xl text-gray-900"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-gray-700">Employment Type</label>
                            <select
                              value={bv.employmentType}
                              onChange={e => {
                                const val = e.target.value as any;
                                setBatchVacancies(prev => prev.map(b => b.id === bv.id ? { ...b, employmentType: val } : b));
                              }}
                              className="w-full p-2 bg-white border border-gray-300 rounded-xl text-gray-900"
                            >
                              <option value="Full-Time">Full-Time</option>
                              <option value="Part-Time">Part-Time</option>
                              <option value="Contract">Contract</option>
                              <option value="Internship">Internship</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Role Summary</label>
                          <input 
                            type="text"
                            value={bv.summary}
                            onChange={e => {
                              const val = e.target.value;
                              setBatchVacancies(prev => prev.map(b => b.id === bv.id ? { ...b, summary: val } : b));
                            }}
                            placeholder="Brief description of responsibilities and scope..."
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowPublishForm(false)}
                      className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs uppercase rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl shadow-md hover:bg-[#053203] cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Publish All ({batchVacancies.length}) Vacancies Simultaneously</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSaveVacancy} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                      <h4 className="text-xs font-black text-[#074504] uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-[#C0991B]" /> Basic Information
                      </h4>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Job Title *</label>
                        <input 
                          type="text" 
                          value={vacForm.title}
                          onChange={e => setVacForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Senior Micro-Finance Credit Officer"
                          required
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#074504] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Ref Number</label>
                          <input 
                            type="text" 
                            value={vacForm.refNumber}
                            onChange={e => setVacForm(prev => ({ ...prev, refNumber: e.target.value }))}
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold text-[#074504]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Positions (Slots)</label>
                          <input 
                            type="number" 
                            min={1}
                            value={vacForm.positionsCount}
                            onChange={e => setVacForm(prev => ({ ...prev, positionsCount: parseInt(e.target.value) || 1 }))}
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Department</label>
                          <select 
                            value={vacForm.department}
                            onChange={e => setVacForm(prev => ({ ...prev, department: e.target.value }))}
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-[#074504]"
                          >
                            {departments.map(d => (
                              <option key={d.id} value={d.name}>{d.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Category</label>
                          <select 
                            value={vacForm.category}
                            onChange={e => setVacForm(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-[#074504]"
                          >
                            {categories.map(c => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Employment Type</label>
                          <select 
                            value={vacForm.employmentType}
                            onChange={e => setVacForm(prev => ({ ...prev, employmentType: e.target.value as any }))}
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                          >
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Work Arrangement</label>
                          <select 
                            value={vacForm.workArrangement}
                            onChange={e => setVacForm(prev => ({ ...prev, workArrangement: e.target.value as any }))}
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                          >
                            <option value="On-site">On-site</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Remote">Remote</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Primary Location / Branch</label>
                        <input 
                          type="text" 
                          value={vacForm.location}
                          onChange={e => setVacForm(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g. Nyeri HQ & Regional Branches"
                          className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Deadlines, Visibility & Active Publish Button */}
                    <div className="space-y-4 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                      <h4 className="text-xs font-black text-[#074504] uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#C0991B]" /> Deadlines & Publication Controls
                      </h4>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Application Deadline *</label>
                          <input 
                            type="date" 
                            value={vacForm.deadline}
                            onChange={e => setVacForm(prev => ({ ...prev, deadline: e.target.value }))}
                            required
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Expected Start Date</label>
                          <input 
                            type="date" 
                            value={vacForm.expectedStartDate}
                            onChange={e => setVacForm(prev => ({ ...prev, expectedStartDate: e.target.value }))}
                            className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900"
                          />
                        </div>
                      </div>

                      {/* PUBLISH OR SCHEDULE VACANCY CONTROLS */}
                      <div className="space-y-3 pt-3 border-t border-gray-200">
                        <label className="text-xs font-black text-[#074504] uppercase block tracking-wider">
                          Publishing & Scheduling Option *
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              setVacForm(prev => ({ ...prev, status: 'Published' }));
                              showToast('Selected "Publish Immediately" status for this vacancy.');
                            }}
                            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              vacForm.status === 'Published'
                                ? 'bg-[#074504] text-[#C0991B] ring-2 ring-[#074504] shadow-md'
                                : 'bg-emerald-50 border border-emerald-300 text-[#074504] hover:bg-emerald-100'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#C0991B]" />
                            <span>Publish Immediately</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setVacForm(prev => ({ ...prev, status: 'Scheduled' }));
                              showToast('Selected "Schedule for Future Release" mode. Fill scheduling details below.');
                            }}
                            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              vacForm.status === 'Scheduled'
                                ? 'bg-[#C0991B] text-[#033B18] ring-2 ring-[#C0991B] shadow-md font-black'
                                : 'bg-amber-50 border border-[#C0991B]/50 text-amber-900 hover:bg-amber-100'
                            }`}
                          >
                            <Calendar className="w-4 h-4 text-[#074504]" />
                            <span>Schedule Future Release</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setVacForm(prev => ({ ...prev, status: 'Draft' }));
                              showToast('Selected "Draft" status for this vacancy.');
                            }}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              vacForm.status === 'Draft'
                                ? 'bg-gray-800 text-white ring-2 ring-gray-800 shadow-xs'
                                : 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Save Draft</span>
                          </button>
                        </div>

                        {/* INLINE SCHEDULING FORM (APPEARS ONCE SCHEDULING OPTION IS CHOSEN) */}
                        {vacForm.status === 'Scheduled' && (
                          <div className="p-4 bg-amber-50/80 rounded-2xl border-2 border-[#C0991B] space-y-4 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between border-b border-[#C0991B]/30 pb-2">
                              <h5 className="font-black text-xs text-[#074504] uppercase flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-[#C0991B]" /> Vacancy Schedule Release Details
                              </h5>
                              <span className="px-2 py-0.5 bg-[#C0991B] text-[#033B18] text-[9px] font-black uppercase rounded-full">
                                Scheduled Mode Active
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="space-y-1">
                                <label className="font-bold text-gray-800">Scheduled Release Date *</label>
                                <input
                                  type="date"
                                  value={vacForm.scheduledDate}
                                  onChange={e => setVacForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                                  required
                                  className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold text-[#074504] focus:ring-2 focus:ring-[#074504]"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="font-bold text-gray-800">Scheduled Release Time *</label>
                                <input
                                  type="time"
                                  value={vacForm.scheduledTime}
                                  onChange={e => setVacForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                                  required
                                  className="w-full p-2 bg-white border border-gray-300 rounded-xl font-mono text-gray-900 focus:ring-2 focus:ring-[#074504]"
                                />
                              </div>
                            </div>

                            <div className="space-y-2 pt-1 border-t border-[#C0991B]/20">
                              <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={vacForm.scheduledNotifyApplicants}
                                  onChange={e => setVacForm(prev => ({ ...prev, scheduledNotifyApplicants: e.target.checked }))}
                                  className="rounded text-[#074504] focus:ring-[#074504] w-4 h-4"
                                />
                                <span>Send automated portal alert notification on scheduled release date</span>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex items-center gap-6">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={vacForm.isFeatured}
                            onChange={e => setVacForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                            className="rounded text-[#074504] focus:ring-[#074504] w-4 h-4"
                          />
                          <span>Featured Vacancy</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs font-bold text-red-700 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={vacForm.isUrgent}
                            onChange={e => setVacForm(prev => ({ ...prev, isUrgent: e.target.checked }))}
                            className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                          />
                          <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> Urgent Slot</span>
                        </label>
                      </div>

                      <div className="space-y-1 pt-2">
                        <label className="text-xs font-bold text-gray-700">Working Hours</label>
                        <input 
                          type="text" 
                          value={vacForm.workingHours}
                          onChange={e => setVacForm(prev => ({ ...prev, workingHours: e.target.value }))}
                          placeholder="e.g. Mon - Fri 8:00 AM - 5:00 PM"
                          className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Position Summary & Details */}
                  <div className="space-y-4 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                    <h4 className="text-xs font-black text-[#074504] uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#C0991B]" /> Job Summary & Detailed Requirements
                    </h4>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Role Summary / Executive Overview *</label>
                      <textarea 
                        rows={2}
                        value={vacForm.summary}
                        onChange={e => setVacForm(prev => ({ ...prev, summary: e.target.value }))}
                        placeholder="Provide a high-level overview of key objectives and impact of this role..."
                        required
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900 focus:ring-2 focus:ring-[#074504] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Key Responsibilities (One per line)</label>
                        <textarea 
                          rows={4}
                          value={vacForm.responsibilitiesStr}
                          onChange={e => setVacForm(prev => ({ ...prev, responsibilitiesStr: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Minimum Qualifications (One per line)</label>
                        <textarea 
                          rows={4}
                          value={vacForm.minQualificationsStr}
                          onChange={e => setVacForm(prev => ({ ...prev, minQualificationsStr: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Required Skills (Comma separated)</label>
                        <input 
                          type="text" 
                          value={vacForm.requiredSkillsStr}
                          onChange={e => setVacForm(prev => ({ ...prev, requiredSkillsStr: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Benefits & Perks (Comma separated)</label>
                        <input 
                          type="text" 
                          value={vacForm.benefitsStr}
                          onChange={e => setVacForm(prev => ({ ...prev, benefitsStr: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => { setShowPublishForm(false); setEditingVacancyId(null); }}
                      className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs uppercase rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl shadow-md hover:bg-[#053203] cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {editingVacancyId 
                          ? 'Save Position Changes' 
                          : vacForm.status === 'Scheduled' 
                            ? 'Schedule Vacancy Release' 
                            : vacForm.status === 'Draft' 
                              ? 'Save Position Draft' 
                              : 'Publish Vacancy Now'}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input 
                type="text" 
                value={vacSearch}
                onChange={e => setVacSearch(e.target.value)}
                placeholder="Search job title, ref number, location..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#074504] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
              <div className="flex items-center gap-2">
                <label className="text-xs font-black text-gray-600 uppercase">Status:</label>
                <select 
                  value={vacStatusFilter}
                  onChange={e => setVacStatusFilter(e.target.value)}
                  className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#074504]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Closed">Closed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-black text-gray-600 uppercase">Department:</label>
                <select 
                  value={vacDeptFilter}
                  onChange={e => setVacDeptFilter(e.target.value)}
                  className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#074504]"
                >
                  <option value="All">All Departments</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Vacancies List Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-black text-xs text-[#074504] uppercase">
                Vacancies Directory ({filteredVacancies.length})
              </h3>
              <button
                onClick={handleOpenCreateVacancy}
                className="px-3.5 py-1.5 bg-[#074504] text-[#C0991B] font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-[#053203]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Position</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-100">
                  <tr>
                    <th className="p-4">Vacancy Title & Ref</th>
                    <th className="p-4">Department & Category</th>
                    <th className="p-4">Type / Location</th>
                    <th className="p-4">Deadline</th>
                    <th className="p-4">Apps / Views</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {filteredVacancies.map(v => (
                    <tr key={v.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs text-gray-900">{v.title}</span>
                            {v.isUrgent && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[9px] font-black rounded-full flex items-center gap-1">
                                <Flame className="w-2.5 h-2.5 text-red-600" /> Urgent
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono block">{v.refNumber} • {v.positionsCount} Positions</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-gray-900 block">{v.department}</span>
                          <span className="text-[10px] text-gray-500">{v.category}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-gray-800 block">{v.employmentType} ({v.workArrangement})</span>
                          <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-gray-400" /> {v.location}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-gray-900">
                        {v.deadline}
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-black text-gray-900 block">{v.applicationsCount} Apps</span>
                          <span className="text-[10px] text-gray-400">{v.viewsCount} Views</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${
                          v.status === 'Published' ? 'bg-emerald-100 text-emerald-800' :
                          v.status === 'Draft' ? 'bg-amber-100 text-amber-800' :
                          v.status === 'Closed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditVacancy(v)}
                            title="Edit Vacancy"
                            className="p-1.5 bg-gray-100 hover:bg-[#074504] hover:text-white rounded-lg text-gray-600 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              const newStatus = v.status === 'Published' ? 'Closed' : 'Published';
                              updateVacancy(v.id, { status: newStatus });
                              showToast(`Vacancy status changed to ${newStatus}`);
                            }}
                            title={v.status === 'Published' ? 'Close Vacancy' : 'Publish Vacancy'}
                            className="p-1.5 bg-gray-100 hover:bg-[#C0991B] hover:text-[#033B18] rounded-lg text-gray-600 transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              updateVacancy(v.id, { status: 'Archived' });
                              showToast(`Vacancy "${v.title}" archived and automatically removed from directory.`);
                            }}
                            title="Archive Vacancy"
                            className="p-1.5 bg-amber-50 hover:bg-amber-600 hover:text-white rounded-lg text-amber-700 transition-colors cursor-pointer"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteConfirmModal({
                                isOpen: true,
                                title: 'Delete Vacancy Position',
                                itemName: v.title,
                                message: `Are you sure you want to permanently delete vacancy "${v.title}" (${v.refNumber})? This action cannot be undone.`,
                                onConfirm: () => {
                                  deleteVacancy(v.id);
                                  showToast(`Vacancy "${v.title}" permanently deleted.`);
                                }
                              });
                            }}
                            title="Delete Vacancy"
                            className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg text-red-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>









        </div>
      )}

      {/* ================= TAB 3: CAT & DEPT ================= */}
      {activeTab === 'categories_departments' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Banner - Formatted as: Title -> Text -> Buttons */}
          <div className="bg-[#074504] p-6 rounded-3xl text-white shadow-lg flex flex-col gap-4 relative overflow-hidden border border-[#C0991B]/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C0991B] opacity-10 rounded-full blur-2xl pointer-events-none"></div>

            {/* 1. TITLE */}
            <div className="space-y-1.5 z-10">
              <h3 className="font-black text-xl text-white uppercase tracking-tight flex items-center gap-2">
                CAT & DEPT Directory Management
              </h3>
            </div>

            {/* 2. TEXT */}
            <p className="text-xs text-white/80 font-medium max-w-3xl leading-relaxed z-10">
              Manage Neema HEEP CMS Job Categories (CAT) and Organizational Departments (DEPT). Create, update, or remove job classification categories and department units.
            </p>

            {/* 3. BUTTONS */}
            <div className="flex flex-wrap items-center gap-2.5 z-10 pt-1">
              <button
                type="button"
                onClick={() => {
                  setEditingCatId(null);
                  setNewCategoryForm({ name: '', code: '', description: '' });
                  setShowAddCategoryModal(true);
                }}
                className="px-4 py-2.5 bg-[#C0991B] text-[#033B18] hover:bg-amber-400 font-black text-xs uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category (CAT)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingDeptId(null);
                  setNewDeptForm({ name: '', code: '', head: '' });
                  setShowAddDeptModal(true);
                }}
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-black text-xs uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-white/20"
              >
                <Plus className="w-4 h-4 text-[#C0991B]" />
                <span>Add DEPT</span>
              </button>
            </div>
          </div>

          {/* ADD / EDIT CATEGORY SCREEN & FORM */}
          {showAddCategoryModal && (
            <div className="p-5 bg-amber-50 rounded-3xl border-2 border-[#C0991B] shadow-md space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#C0991B]/30 pb-3">
                <h4 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#C0991B]" /> {editingCatId ? 'Edit Job Category (CAT)' : 'Create New Job Category (CAT)'}
                </h4>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddCategoryModal(false);
                    setEditingCatId(null);
                  }}
                  className="p-1 hover:bg-amber-200 rounded-lg text-gray-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCategoryForm.name.trim()) {
                    showToast('Error: Category Name is required');
                    return;
                  }
                  const code = newCategoryForm.code.trim() || newCategoryForm.name.trim().substring(0, 3).toUpperCase();
                  if (editingCatId) {
                    setCategories(prev => prev.map(c => c.id === editingCatId ? {
                      ...c,
                      name: newCategoryForm.name.trim(),
                      code,
                      description: newCategoryForm.description.trim() || c.description
                    } : c));
                    showToast(`Category "${newCategoryForm.name}" updated successfully!`);
                  } else {
                    const newCat = {
                      id: `cat-${Date.now()}`,
                      name: newCategoryForm.name.trim(),
                      code,
                      vacanciesCount: 0,
                      description: newCategoryForm.description.trim() || `${newCategoryForm.name.trim()} positions in Neema HEEP.`
                    };
                    setCategories(prev => [...prev, newCat]);
                    showToast(`Category "${newCategoryForm.name}" created successfully!`);
                  }
                  setShowAddCategoryModal(false);
                  setEditingCatId(null);
                  setNewCategoryForm({ name: '', code: '', description: '' });
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-800">Category Name *</label>
                    <input
                      type="text"
                      value={newCategoryForm.name}
                      onChange={e => setNewCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Audit & Compliance"
                      required
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-[#074504]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-800">Category Code (3-4 chars)</label>
                    <input
                      type="text"
                      value={newCategoryForm.code}
                      onChange={e => setNewCategoryForm(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="e.g. AUD"
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-mono text-gray-900 uppercase focus:ring-2 focus:ring-[#074504]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-800">Category Description</label>
                  <input
                    type="text"
                    value={newCategoryForm.description}
                    onChange={e => setNewCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this job category..."
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#074504]"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#C0991B]/30">
                  {/* ACTIVATED DELETE BUTTON ON ADD/EDIT CATEGORY SCREEN */}
                  <button
                    type="button"
                    onClick={() => {
                      if (editingCatId) {
                        setDeleteConfirmModal({
                          isOpen: true,
                          title: 'Delete Job Category',
                          itemName: newCategoryForm.name || 'Selected Category',
                          message: `Are you sure you want to delete category "${newCategoryForm.name || 'selected'}"? This action cannot be undone.`,
                          onConfirm: () => {
                            setCategories(prev => prev.filter(c => c.id !== editingCatId));
                            showToast(`Category "${newCategoryForm.name}" deleted successfully.`);
                            setShowAddCategoryModal(false);
                            setEditingCatId(null);
                            setNewCategoryForm({ name: '', code: '', description: '' });
                          }
                        });
                      } else {
                        setNewCategoryForm({ name: '', code: '', description: '' });
                        showToast('Category form inputs cleared.');
                        setShowAddCategoryModal(false);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{editingCatId ? 'Delete Category' : 'Delete / Clear Form'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddCategoryModal(false);
                        setEditingCatId(null);
                      }}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl cursor-pointer shadow-sm hover:bg-[#053203]"
                    >
                      {editingCatId ? 'Update Category' : 'Save Category'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ADD / EDIT DEPARTMENT SCREEN & FORM */}
          {showAddDeptModal && (
            <div className="p-5 bg-emerald-50 rounded-3xl border-2 border-[#074504] shadow-md space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#074504]/20 pb-3">
                <h4 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#C0991B]" /> {editingDeptId ? 'Edit Department (DEPT)' : 'Create New Department (DEPT)'}
                </h4>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddDeptModal(false);
                    setEditingDeptId(null);
                  }}
                  className="p-1 hover:bg-emerald-200 rounded-lg text-gray-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newDeptForm.name.trim()) {
                    showToast('Error: Department Name is required');
                    return;
                  }
                  const code = newDeptForm.code.trim() || newDeptForm.name.trim().substring(0, 3).toUpperCase();
                  if (editingDeptId) {
                    setDepartments(prev => prev.map(d => d.id === editingDeptId ? {
                      ...d,
                      name: newDeptForm.name.trim(),
                      code,
                      head: newDeptForm.head.trim() || d.head
                    } : d));
                    showToast(`Department "${newDeptForm.name}" updated successfully!`);
                  } else {
                    const newDept = {
                      id: `dept-${Date.now()}`,
                      name: newDeptForm.name.trim(),
                      code,
                      head: newDeptForm.head.trim() || 'Department Lead',
                      vacanciesCount: 0
                    };
                    setDepartments(prev => [...prev, newDept]);
                    showToast(`Department "${newDeptForm.name}" created successfully!`);
                  }
                  setShowAddDeptModal(false);
                  setEditingDeptId(null);
                  setNewDeptForm({ name: '', code: '', head: '' });
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-800">Department Name *</label>
                    <input
                      type="text"
                      value={newDeptForm.name}
                      onChange={e => setNewDeptForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Finance & Treasury"
                      required
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-[#074504]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-800">DEPT Code</label>
                    <input
                      type="text"
                      value={newDeptForm.code}
                      onChange={e => setNewDeptForm(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="e.g. FIN"
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-mono text-gray-900 uppercase focus:ring-2 focus:ring-[#074504]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-800">Department Head / Lead</label>
                    <input
                      type="text"
                      value={newDeptForm.head}
                      onChange={e => setNewDeptForm(prev => ({ ...prev, head: e.target.value }))}
                      placeholder="e.g. Chief Finance Officer"
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#074504]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#074504]/20">
                  {/* ACTIVATED DELETE BUTTON ON ADD/EDIT DEPT SCREEN */}
                  <button
                    type="button"
                    onClick={() => {
                      if (editingDeptId) {
                        setDeleteConfirmModal({
                          isOpen: true,
                          title: 'Delete Department (DEPT)',
                          itemName: newDeptForm.name || 'Selected Department',
                          message: `Are you sure you want to delete department "${newDeptForm.name || 'selected'}"? This action cannot be undone.`,
                          onConfirm: () => {
                            setDepartments(prev => prev.filter(d => d.id !== editingDeptId));
                            showToast(`Department "${newDeptForm.name}" deleted successfully.`);
                            setShowAddDeptModal(false);
                            setEditingDeptId(null);
                            setNewDeptForm({ name: '', code: '', head: '' });
                          }
                        });
                      } else {
                        setNewDeptForm({ name: '', code: '', head: '' });
                        showToast('DEPT form inputs cleared.');
                        setShowAddDeptModal(false);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                    title="Delete DEPT"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{editingDeptId ? 'Delete DEPT' : 'Delete / Clear Form'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddDeptModal(false);
                        setEditingDeptId(null);
                      }}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl cursor-pointer shadow-sm hover:bg-[#053203]"
                    >
                      {editingDeptId ? 'Update DEPT' : 'Save DEPT'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categories (CAT) Section */}
            <div className="space-y-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#C0991B]" /> Job Categories (CAT) ({categories.length})
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCatId(null);
                    setNewCategoryForm({ name: '', code: '', description: '' });
                    setShowAddCategoryModal(true);
                  }}
                  className="px-3 py-1.5 bg-[#074504] text-[#C0991B] hover:bg-[#053203] font-bold text-xs uppercase rounded-xl flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Category
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map(c => (
                  <div key={c.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 hover:border-[#074504]/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-[#074504]">{c.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 bg-amber-100 text-[#826507] text-[9px] font-mono font-black rounded-full">
                          {c.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCatId(c.id);
                            setNewCategoryForm({ name: c.name, code: c.code, description: c.description || '' });
                            setShowAddCategoryModal(true);
                          }}
                          className="p-1 text-gray-600 hover:text-[#074504] hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteConfirmModal({
                              isOpen: true,
                              title: 'Delete Category',
                              itemName: c.name,
                              message: `Are you sure you want to delete category "${c.name}"?`,
                              onConfirm: () => {
                                setCategories(prev => prev.filter(cat => cat.id !== c.id));
                                showToast(`Category "${c.name}" deleted successfully.`);
                              }
                            });
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium line-clamp-2">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Departments (DEPT) Section */}
            <div className="space-y-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#C0991B]" /> Departments (DEPT) ({departments.length})
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setEditingDeptId(null);
                    setNewDeptForm({ name: '', code: '', head: '' });
                    setShowAddDeptModal(true);
                  }}
                  className="px-3 py-1.5 bg-[#074504] text-[#C0991B] hover:bg-[#053203] font-bold text-xs uppercase rounded-xl flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add DEPT
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {departments.map(d => (
                  <div key={d.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 hover:border-[#074504]/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-gray-900">{d.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-800 text-[9px] font-mono font-bold rounded-md">
                          {d.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDeptId(d.id);
                            setNewDeptForm({ name: d.name, code: d.code, head: d.head || '' });
                            setShowAddDeptModal(true);
                          }}
                          className="p-1 text-gray-600 hover:text-[#074504] hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                          title="Edit DEPT"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteConfirmModal({
                              isOpen: true,
                              title: 'Delete Department',
                              itemName: d.name,
                              message: `Are you sure you want to delete department "${d.name}"?`,
                              onConfirm: () => {
                                setDepartments(prev => prev.filter(dep => dep.id !== d.id));
                                showToast(`Department "${d.name}" deleted successfully.`);
                              }
                            });
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete DEPT"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-600 font-bold">Head: <span className="text-[#074504]">{d.head}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: ONLINE APPLICATIONS MANAGEMENT ================= */}
      {activeTab === 'applications' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setActiveTab('all_vacancies')}
              className="px-4 py-2 bg-[#074504] text-[#C0991B] hover:bg-[#053203] font-bold text-xs uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Vacancies Screen</span>
            </button>
            <span className="font-black text-xs text-[#074504] uppercase flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#C0991B]" /> Online Applications Portal ({filteredApplications.length})
            </span>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input 
                  type="text" 
                  value={appSearch}
                  onChange={e => setAppSearch(e.target.value)}
                  placeholder="Search candidate name, ID, KRA PIN, email, app number..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#074504] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportApplicationsCSV}
                  className="px-4 py-2 bg-[#074504] text-white font-bold text-xs uppercase rounded-xl flex items-center gap-2 cursor-pointer shadow-xs hover:bg-[#053203]"
                >
                  <Download className="w-3.5 h-3.5 text-[#C0991B]" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100 text-xs">
              <div>
                <label className="font-bold text-gray-600 block text-[10px] uppercase">Status:</label>
                <select
                  value={appStatusFilter}
                  onChange={e => setAppStatusFilter(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-[#074504]"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Hired">Hired</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-600 block text-[10px] uppercase">County (47 Counties):</label>
                <select
                  value={appCountyFilter}
                  onChange={e => setAppCountyFilter(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-[#074504]"
                >
                  <option value="All">All Counties</option>
                  {KENYAN_COUNTIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-600 block text-[10px] uppercase">Department:</label>
                <select
                  value={appDeptFilter}
                  onChange={e => setAppDeptFilter(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-[#074504]"
                >
                  <option value="All">All Departments</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-600 block text-[10px] uppercase">Verification:</label>
                <div className="p-2 bg-emerald-50 text-emerald-800 font-black rounded-xl text-[11px] flex items-center justify-center gap-1 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" /> SMS & Email OTP Verified
                </div>
              </div>
            </div>
          </div>

          {/* Applications Data Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-100">
                  <tr>
                    <th className="p-4">App Ref & Candidate</th>
                    <th className="p-4">National ID & KRA PIN</th>
                    <th className="p-4">Applied Vacancy</th>
                    <th className="p-4">County / Contact</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {filteredApplications.map(app => (
                    <tr key={app.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-black text-xs text-[#074504] block">
                            {app.identity.firstName} {app.identity.middleName || ''} {app.identity.surname}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono block">
                            {app.appNumber} • {app.submissionDate}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[11px]">
                        <div className="space-y-0.5">
                          <span className="font-bold text-gray-900 block">ID: {app.identity.nationalId}</span>
                          <span className="text-gray-500 block">PIN: {app.identity.kraPin}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-gray-900 block">{app.vacancyTitle}</span>
                          <span className="text-[10px] text-gray-500">{app.department}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-gray-900 block">{app.identity.county} County</span>
                          <span className="text-[10px] text-gray-500 block">{app.identity.phone}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${
                          app.status === 'New' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'Under Review' ? 'bg-amber-100 text-amber-900 border border-[#C0991B]/40' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1.5 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl hover:bg-[#053203] cursor-pointer shadow-xs"
                        >
                          Full Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* APPLICATION DETAILS MODAL */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 p-6 md:p-8 space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#074504] text-[#C0991B] text-[10px] font-mono font-black rounded-md">
                      {selectedApp.appNumber}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> OTP Verified
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-gray-900 uppercase">
                    Candidate: {selectedApp.identity.firstName} {selectedApp.identity.middleName || ''} {selectedApp.identity.surname}
                  </h2>
                  <p className="text-xs text-gray-500 font-bold">
                    Applied Position: <strong className="text-[#074504]">{selectedApp.vacancyTitle}</strong> ({selectedApp.department})
                  </p>
                </div>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Update Bar */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-[#C0991B]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-black text-amber-900 uppercase">Application Status:</label>
                  <select
                    value={selectedApp.status}
                    onChange={e => {
                      const newStatus = e.target.value as any;
                      updateApplicationStatus(selectedApp.id, newStatus);
                      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
                      showToast(`Status updated to ${newStatus}`);
                    }}
                    className="p-2 bg-white border border-[#C0991B]/50 rounded-xl text-xs font-bold text-[#074504]"
                  >
                    <option value="New">New</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Hired">Hired</option>
                  </select>
                </div>

                <div className="text-xs text-gray-600 font-mono">
                  Submitted: <strong>{selectedApp.submissionDate}</strong>
                </div>
              </div>

              {/* Section 1: Identity & Contact */}
              <div className="space-y-3 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                <h4 className="text-xs font-black text-[#074504] uppercase tracking-wider">
                  Step 1: Verified Identity & Legal Contact
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">National ID / Passport</span>
                    <strong className="text-gray-900 font-mono">{selectedApp.identity.nationalId}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">KRA PIN</span>
                    <strong className="text-gray-900 font-mono">{selectedApp.identity.kraPin}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">Phone Number</span>
                    <strong className="text-gray-900">{selectedApp.identity.phone}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">County of Residence</span>
                    <strong className="text-gray-900">{selectedApp.identity.county} County</strong>
                  </div>
                </div>
              </div>

              {/* Section 2: Uploaded Documents Vault */}
              <div className="space-y-3 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                <h4 className="text-xs font-black text-[#074504] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#C0991B]" /> Supporting Document Vault (Verified PDFs)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900 block text-[11px]">Curriculum Vitae (CV)</span>
                      <span className="text-[10px] text-gray-400 font-mono">{selectedApp.cv.fileName}</span>
                    </div>
                    <a href="#" onClick={(e) => { e.preventDefault(); showToast('Downloading candidate CV PDF...'); }} className="p-1.5 bg-[#074504] text-white rounded-lg">
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900 block text-[11px]">National ID Copy</span>
                      <span className="text-[10px] text-gray-400 font-mono">{selectedApp.identity.nationalIdDocName || 'ID_Copy.pdf'}</span>
                    </div>
                    <a href="#" onClick={(e) => { e.preventDefault(); showToast('Downloading National ID PDF...'); }} className="p-1.5 bg-[#074504] text-white rounded-lg">
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900 block text-[11px]">KRA PIN Certificate</span>
                      <span className="text-[10px] text-gray-400 font-mono">{selectedApp.identity.kraPinCertName || 'KRA_PIN.pdf'}</span>
                    </div>
                    <a href="#" onClick={(e) => { e.preventDefault(); showToast('Downloading KRA PIN Cert...'); }} className="p-1.5 bg-[#074504] text-white rounded-lg">
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Section 3: References (Exactly 4 Required) */}
              <div className="space-y-3 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                <h4 className="text-xs font-black text-[#074504] uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C0991B]" /> Professional References (4 Verified Contacts)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {selectedApp.references.map((ref, idx) => (
                    <div key={ref.id || idx} className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-gray-900">Ref #{idx + 1}: {ref.fullName}</span>
                        <span className="text-[10px] font-bold text-gray-500">{ref.yearsKnown}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 font-medium">{ref.titleRelationship} - {ref.company}</p>
                      <div className="text-[10px] text-gray-500 font-mono flex items-center gap-3 pt-1">
                        <span>📞 {ref.phone}</span>
                        <span>✉️ {ref.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Data Protection Declaration */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-2 font-black">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Data Protection Act, 2019 Legal Declaration</span>
                </div>
                <p className="text-[11px] font-medium text-emerald-800">
                  Applicant certified that all details are true and provided explicit consent for Neema HEEP recruitment processing.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs uppercase rounded-xl cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= TAB 7: REPORTS ================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setActiveTab('all_vacancies')}
              className="px-4 py-2 bg-[#074504] text-[#C0991B] hover:bg-[#053203] font-bold text-xs uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Vacancies Screen</span>
            </button>
            <h3 className="font-black text-xs text-[#074504] uppercase flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#C0991B]" /> Recruitment Reports Generator
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <h4 className="font-black text-xs text-[#074504] uppercase">Applications by County Report</h4>
              <p className="text-xs text-gray-500 font-medium">Detailed breakdown of applicant origins across all 47 Kenyan counties.</p>
              <div className="flex gap-2">
                <button 
                  onClick={handleExportApplicationsPDF}
                  className="flex-1 py-2 bg-[#074504] text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#C0991B]" /> PDF Report
                </button>
                <button 
                  onClick={handlePrintApplicationsReport}
                  className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C0991B]" /> Print
                </button>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <h4 className="font-black text-xs text-[#074504] uppercase">Vacancy Performance Summary</h4>
              <p className="text-xs text-gray-500 font-medium">Views, applications count, and conversion rates per vacancy position.</p>
              <div className="flex gap-2">
                <button 
                  onClick={handleExportVacanciesPDF}
                  className="flex-1 py-2 bg-[#074504] text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#C0991B]" /> PDF Report
                </button>
                <button 
                  onClick={handlePrintVacanciesReport}
                  className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C0991B]" /> Print
                </button>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <h4 className="font-black text-xs text-[#074504] uppercase">Data Protection Compliance Audit</h4>
              <p className="text-xs text-gray-500 font-medium">Consent timestamps and document verification audit for Kenyan DPA 2019.</p>
              <div className="flex gap-2">
                <button 
                  onClick={handleExportApplicationsPDF}
                  className="flex-1 py-2 bg-[#074504] text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#C0991B]" /> Download Audit PDF
                </button>
                <button 
                  onClick={handlePrintApplicationsReport}
                  className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C0991B]" /> Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL DELETE CONFIRMATION POP-UP DIALOGUE BOX */}
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-2 border-red-500 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-black text-base text-gray-900">{deleteConfirmModal.title}</h3>
                <p className="text-xs text-gray-500 font-medium">This action is permanent and cannot be undone.</p>
              </div>
            </div>

            {deleteConfirmModal.itemName && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold text-gray-800">
                Target Item: <span className="text-red-700 font-black">{deleteConfirmModal.itemName}</span>
              </div>
            )}

            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              {deleteConfirmModal.message || 'Are you sure you want to delete this item? It will be permanently removed from Neema HEEP CMS.'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteConfirmModal.onConfirm();
                  setDeleteConfirmModal(prev => ({ ...prev, isOpen: false }));
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
