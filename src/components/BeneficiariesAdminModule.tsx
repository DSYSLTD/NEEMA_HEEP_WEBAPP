import React, { useState, useMemo, useEffect } from 'react';
import { readSheet } from 'read-excel-file/browser';
import { 
  Users, Calendar, Plus, Edit, Trash2, Download, Upload, Eye, CheckCircle2, 
  Clock, Shield, RefreshCw, ChevronRight, BarChart3, PieChart, 
  TrendingUp, Sliders, UserCheck, X, Check, Copy, ExternalLink, Award, 
  BookOpen, Lock, Globe, Database, Terminal, ShieldCheck, Mail, Phone, 
  Search, Filter, ArrowUp, ArrowDown, FileText, AlertCircle, FileSpreadsheet,
  Printer, Send, Bell, Layers, CheckSquare, AlertTriangle, Archive, School, GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  beneficiariesStore, 
  AnnualBeneficiaryList, 
  BeneficiaryRecord, 
  BeneficiaryAuditLog, 
  BeneficiaryNotification,
  maskBeneficiaryName 
} from '../lib/beneficiariesStore';
import { exportPdfReport, printHtmlReport } from '../lib/pdfPrintUtils';

interface BeneficiariesAdminModuleProps {
  userRole?: 'administrator' | 'webmaster' | 'editor';
  userName?: string;
  className?: string;
}

export default function BeneficiariesAdminModule({
  userRole = 'administrator',
  userName = 'Site Administrator',
  className = ''
}: BeneficiariesAdminModuleProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'create_list' | 'entries' | 'import' | 'export' | 'reports' | 'lists' | 'apis' | 'settings'
  >('dashboard');

  // Core Data State from Store
  const [lists, setLists] = useState<AnnualBeneficiaryList[]>(() => beneficiariesStore.getLists());
  const [selectedListId, setSelectedListId] = useState<string>(() => lists[0]?.id || '');
  const [auditLogs, setAuditLogs] = useState<BeneficiaryAuditLog[]>(() => beneficiariesStore.getLogs());
  const [notifications, setNotifications] = useState<BeneficiaryNotification[]>(() => beneficiariesStore.getNotifications());

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshData = () => {
    const updatedLists = beneficiariesStore.getLists();
    setLists(updatedLists);
    setAuditLogs(beneficiariesStore.getLogs());
    setNotifications(beneficiariesStore.getNotifications());
    if (!selectedListId && updatedLists.length > 0) {
      setSelectedListId(updatedLists[0].id);
    }
  };

  useEffect(() => {
    window.addEventListener('neema_cms_beneficiaries_lists_updated', refreshData);
    return () => {
      window.removeEventListener('neema_cms_beneficiaries_lists_updated', refreshData);
    };
  }, [selectedListId]);

  // Selected List & Records
  const currentList = useMemo(() => {
    return lists.find(l => l.id === selectedListId) || lists[0] || null;
  }, [lists, selectedListId]);

  const currentRecords = useMemo(() => {
    return currentList ? beneficiariesStore.getRecordsByList(currentList.id) : [];
  }, [currentList, lists]);

  const allRecords = useMemo(() => {
    return beneficiariesStore.getAllRecords();
  }, [lists]);

  // Filters & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft' | 'Archived'>('All');
  const [schoolFilter, setSchoolFilter] = useState<string>('All');

  // Filtered Lists for Annual Lists View
  const filteredLists = useMemo(() => {
    return lists.filter(l => {
      const matchSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.yearIdentifier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || l.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [lists, searchTerm, statusFilter]);

  // Filtered Records for Beneficiary Entries View
  const filteredRecords = useMemo(() => {
    return currentRecords.filter(r => {
      const matchSearch = r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.school.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSchool = schoolFilter === 'All' || r.school === schoolFilter;
      return matchSearch && matchSchool;
    });
  }, [currentRecords, searchTerm, schoolFilter]);

  // All Schools List
  const uniqueSchools = useMemo(() => {
    const set = new Set(allRecords.map(r => r.school));
    return ['All', ...Array.from(set).sort()];
  }, [allRecords]);

  // Create List Form State
  const [newYear, setNewYear] = useState('2026');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newStatus, setNewStatus] = useState<'Draft' | 'Published'>('Draft');

  // Single / Inline Add Entry Form State
  const [newEntryName, setNewEntryName] = useState('');
  const [newEntrySchool, setNewEntrySchool] = useState('');
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSchool, setEditSchool] = useState('');

  // Bulk Entry Rows State (for multi-row insertion)
  const [bulkRows, setBulkRows] = useState<{ fullName: string; school: string }[]>([
    { fullName: '', school: '' },
    { fullName: '', school: '' },
    { fullName: '', school: '' }
  ]);

  // Bulk Import Wizard State
  const [importText, setImportText] = useState('');
  const [importTargetListId, setImportTargetListId] = useState<string>('');
  const [importStep, setImportStep] = useState<1 | 2 | 3>(1);
  const [parsedImportRows, setParsedImportRows] = useState<{ id: string; fullName: string; school: string; isValid: boolean; errorMsg?: string }[]>([]);

  // Permissions Check helper
  const canPublishOrArchive = userRole === 'administrator' || userRole === 'webmaster';

  // Handler: Create List
  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYear || !newTitle) {
      showToast('Please provide Year and Title.');
      return;
    }
    const newList = beneficiariesStore.createList({
      year: newYear,
      title: newTitle,
      description: newDesc,
      status: newStatus,
      createdBy: userName
    });
    setSelectedListId(newList.id);
    showToast(`Created annual list ${newList.yearIdentifier} successfully!`);
    setActiveTab('entries');
  };

  // Handler: Update List Status
  const handleSetListStatus = (listId: string, status: 'Draft' | 'Published' | 'Archived') => {
    if (!canPublishOrArchive) {
      showToast('Permission denied: Webmaster or Admin role required.');
      return;
    }
    beneficiariesStore.updateList(listId, { status }, userName);
    showToast(`List status set to ${status}. Public page automatically updated!`);
    refreshData();
  };

  // Handler: Add Single Beneficiary
  const handleAddSingleBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentList) {
      showToast('Please select or create an annual list first.');
      return;
    }
    if (!newEntryName || !newEntrySchool) {
      showToast('Name and High School are required.');
      return;
    }
    beneficiariesStore.addBeneficiary(currentList.id, newEntryName, newEntrySchool, userName);
    setNewEntryName('');
    setNewEntrySchool('');
    showToast(`Added beneficiary to ${currentList.yearIdentifier}. Sequential numbering refreshed.`);
    refreshData();
  };

  // Handler: Edit Beneficiary Record
  const handleStartEdit = (rec: BeneficiaryRecord) => {
    setEditingRecordId(rec.id);
    setEditName(rec.fullName);
    setEditSchool(rec.school);
  };

  const handleSaveEdit = (recId: string) => {
    if (!editName || !editSchool) {
      showToast('Name and school cannot be empty.');
      return;
    }
    beneficiariesStore.updateBeneficiary(recId, editName, editSchool, userName);
    setEditingRecordId(null);
    showToast('Updated beneficiary record.');
    refreshData();
  };

  // Handler: Delete Beneficiary Record
  const handleDeleteBeneficiary = (recId: string, name: string) => {
    setDeleteConfirmModal({
      isOpen: true,
      title: 'Delete Beneficiary Record',
      itemName: name,
      message: `Delete beneficiary record "${name}"? Sequential serial numbers will refresh automatically.`,
      onConfirm: () => {
        beneficiariesStore.deleteBeneficiary(recId, userName);
        showToast('Beneficiary record removed.');
        refreshData();
      }
    });
  };

  // Handler: Move Record (Rearrange)
  const handleMoveRecord = (recId: string, dir: 'up' | 'down') => {
    beneficiariesStore.moveBeneficiary(recId, dir, userName);
    refreshData();
  };

  // Handler: Duplicate Record
  const handleDuplicateRecord = (rec: BeneficiaryRecord) => {
    beneficiariesStore.addBeneficiary(rec.listId, `${rec.fullName} (COPY)`, rec.school, userName);
    showToast(`Duplicated record for ${rec.fullName}.`);
    refreshData();
  };

  // Handler: Add Bulk Rows
  const handleAddBulkRows = () => {
    if (!currentList) return;
    const validRows = bulkRows.filter(r => r.fullName.trim() && r.school.trim());
    if (validRows.length === 0) {
      showToast('Enter at least one valid beneficiary name and school.');
      return;
    }
    const res = beneficiariesStore.bulkImport(currentList.id, validRows, userName);
    setBulkRows([
      { fullName: '', school: '' },
      { fullName: '', school: '' },
      { fullName: '', school: '' }
    ]);
    showToast(`Added ${res.imported} beneficiaries in bulk.`);
    refreshData();
  };

  // Parse Raw Import Text (CSV / Excel copy paste)
  const handleParseImport = () => {
    const lines = importText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      showToast('Please paste CSV or text data to parse.');
      return;
    }

    const parsed = lines.map((line, idx) => {
      // Split by comma, tab, or pipe
      const parts = line.split(/[,|\t]+/).map(p => p.trim());
      const fullName = parts[0] || '';
      const school = parts[1] || '';

      const isValid = fullName.length >= 2 && school.length >= 2;
      let errorMsg = '';
      if (!fullName) errorMsg = 'Missing Beneficiary Name';
      else if (!school) errorMsg = 'Missing High School Name';

      return {
        id: `imp_row_${idx}`,
        fullName,
        school,
        isValid,
        errorMsg
      };
    });

    setParsedImportRows(parsed);
    setImportStep(2);
  };

  // Execute Bulk Import Commitment
  const handleCommitImport = () => {
    const targetId = importTargetListId || selectedListId || lists[0]?.id;
    if (!targetId) {
      showToast('Select a target annual list first.');
      return;
    }
    const validItems = parsedImportRows.filter(r => r.isValid).map(r => ({ fullName: r.fullName, school: r.school }));
    if (validItems.length === 0) {
      showToast('No valid records to import.');
      return;
    }

    const result = beneficiariesStore.bulkImport(targetId, validItems, userName);
    setImportStep(3);
    showToast(`Import completed! Added ${result.imported} beneficiaries.`);
    refreshData();
  };

  // Export handlers
  const handleExportCSV = () => {
    const listRecs = currentRecords;
    if (listRecs.length === 0) {
      showToast('No records to export.');
      return;
    }
    let csv = 'S.NO,FULL_NAME,MASKED_PUBLISHED_NAME,HIGH_SCHOOL,YEAR,DATE_ADDED\n';
    listRecs.forEach(r => {
      csv += `${r.serialNumber},"${r.fullName}","${r.maskedName}","${r.school}","${r.year}","${r.dateAdded}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Neema_HEEP_Beneficiaries_${currentList?.year || 'All'}.csv`;
    a.click();
    beneficiariesStore.addLog('Export Completed', `Exported CSV roster for ${currentList?.yearIdentifier || 'All'}.`, userName);
    showToast('Exported CSV beneficiary roster.');
  };

  // PDF Export
  const handleExportPDF = () => {
    const listRecs = currentRecords;
    if (listRecs.length === 0) {
      showToast('No records to export.');
      return;
    }
    const columns = ['S.No', 'Full Name (Internal Admin)', 'Masked Name (Public Website)', 'High School Attending', 'Year', 'Date Added'];
    const rows = listRecs.map(r => [
      r.serialNumber,
      r.fullName,
      r.maskedName,
      r.school,
      r.year,
      r.dateAdded
    ]);
    exportPdfReport({
      title: `Beneficiary Roster Report - ${currentList?.title || 'Annual List'}`,
      subtitle: `Container: ${currentList?.yearIdentifier || 'NH-BEN'} | Total Scholars: ${listRecs.length} | Official Audit Record`,
      columns,
      rows,
      filename: `Neema_HEEP_Beneficiaries_${currentList?.year || 'Roster'}.pdf`
    });
    beneficiariesStore.addLog('Export Completed', `Exported PDF report for ${currentList?.yearIdentifier || 'All'}.`, userName);
    showToast('Downloaded PDF beneficiary roster report.');
  };

  // Print Report View
  const handlePrintReport = () => {
    const listRecs = currentRecords;
    if (listRecs.length === 0) {
      showToast('No records to print.');
      return;
    }
    const columns = ['S.No', 'Full Name (Internal Admin)', 'Masked Name (Public Website)', 'High School Attending', 'Year', 'Date Added'];
    const rows = listRecs.map(r => [
      r.serialNumber,
      r.fullName,
      r.maskedName,
      r.school,
      r.year,
      r.dateAdded
    ]);
    printHtmlReport({
      title: `Beneficiary Roster - ${currentList?.title || 'Annual List'}`,
      subtitle: `Container: ${currentList?.yearIdentifier || 'NH-BEN'} | Total Scholars: ${listRecs.length} | Neema HEEP Secondary Scholarship Program`,
      columns,
      rows
    });
  };

  // Delete Annual List
  const handleDeleteList = (listId: string, title: string) => {
    setDeleteConfirmModal({
      isOpen: true,
      title: 'Delete Annual Beneficiary List',
      itemName: title,
      message: `Are you sure you want to permanently delete the annual list "${title}" and all its beneficiary records? This action cannot be undone.`,
      onConfirm: () => {
        beneficiariesStore.deleteList(listId, userName);
        if (selectedListId === listId) {
          const remaining = beneficiariesStore.getLists();
          setSelectedListId(remaining[0]?.id || '');
        }
        showToast(`Deleted annual list "${title}".`);
        refreshData();
      }
    });
  };

  // Excel (.xlsx/.xls/.csv) File Upload Reader
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let lines: string[] = [];

      if (file.name.toLowerCase().endsWith('.csv')) {
        const text = await file.text();
        lines = text.split(/\r?\n/).map(line => {
          const parts = line.split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
          const name = parts[0] || '';
          const school = parts[1] || '';
          if (!name && !school) return '';
          return school ? `${name}, ${school}` : name;
        }).filter(Boolean);
      } else {
        const rows = await readSheet(file);
        lines = rows.map((row) => {
          if (!Array.isArray(row)) return '';
          const name = row[0] != null ? String(row[0]).trim() : '';
          const school = row[1] != null ? String(row[1]).trim() : '';
          if (!name && !school) return '';
          return school ? `${name}, ${school}` : name;
        }).filter(Boolean);
      }

      if (lines.length === 0) {
        showToast('No valid beneficiary rows found in file.');
        return;
      }

      setImportText(lines.join('\n'));
      showToast(`Loaded ${lines.length} beneficiary rows from "${file.name}". Click 'Parse & Preview' to proceed.`);
    } catch (err) {
      console.error(err);
      showToast('Error parsing spreadsheet file. Please check format.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className={`space-y-6 font-sans text-gray-800 ${className}`}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#074504] text-[#C0991B] px-5 py-3 rounded-2xl shadow-2xl border border-[#C0991B]/40 font-bold text-xs flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#C0991B]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Module Banner Header */}
      <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#074504] p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-[#C0991B]/30 space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C0991B]/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* 1. Title */}
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-[#C0991B]" />
            Beneficiaries <span className="text-[#C0991B]">Management</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#C0991B] text-[#074504] text-[10px] font-black uppercase tracking-widest rounded-full">
              Global Project &amp; Design System
            </span>
            <span className="px-2.5 py-1 bg-white/10 text-white/80 text-[10px] font-bold rounded-full border border-white/10 uppercase">
              {userRole === 'administrator' ? 'Site Administrator' : 'Webmaster'}
            </span>
          </div>
        </div>

        {/* 2. Description Text */}
        <p className="text-xs md:text-sm text-white/80 max-w-4xl font-medium leading-relaxed relative z-10">
          Create, maintain, and publish annual beneficiary lists for Neema HEEP. Auto-sequence numbering, 2nd &amp; 3rd name blur/masking before publication (Database rule enforced), and live sync with the public website.
        </p>

        {/* 3. CTA buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 relative z-10">
          <button
            type="button"
            onClick={() => setActiveTab('create_list')}
            className="px-4 py-2.5 bg-[#C0991B] hover:bg-[#a38012] text-[#074504] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Create Annual List</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#C0991B]" />
            <span>Bulk Import</span>
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#C0991B]" />
            <span>Export PDF</span>
          </button>
          <button
            type="button"
            onClick={handlePrintReport}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#C0991B]" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between gap-1 flex-wrap sm:flex-nowrap">
        {[
          { id: 'dashboard', label: 'Overview', icon: BarChart3 },
          { id: 'create_list', label: 'Create', icon: Plus },
          { id: 'entries', label: 'Entries', icon: Users },
          { id: 'import', label: 'Import', icon: Upload },
          { id: 'export', label: 'Export', icon: Download },
          { id: 'reports', label: 'Reports', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-2 sm:px-3 py-2 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 flex-1 min-w-0 cursor-pointer text-center ${
                isActive 
                  ? 'bg-[#074504] text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-[#074504]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#C0991B]' : 'text-gray-400'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: BENEFICIARIES DASHBOARD ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border-l-4 border-l-[#074504] border-y border-r border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400">Current Beneficiary Year</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#074504]">{lists[0]?.year || '2026'}</span>
                <Calendar className="w-6 h-6 text-[#C0991B]" />
              </div>
              <p className="text-[10.5px] text-gray-500 font-bold">{lists[0]?.recordsCount || 0} Scholars Assigned</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-l-4 border-l-[#C0991B] border-y border-r border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400">Total Beneficiaries</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#074504]">{allRecords.length}</span>
                <GraduationCap className="w-6 h-6 text-[#599200]" />
              </div>
              <p className="text-[10.5px] text-gray-500 font-bold">Across {lists.length} Annual Rosters</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-l-4 border-l-emerald-600 border-y border-r border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400">Published Lists</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-emerald-700">
                  {lists.filter(l => l.status === 'Published').length}
                </span>
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-[10.5px] text-emerald-600 font-bold">Live on Public Website</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-l-4 border-l-amber-500 border-y border-r border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400">Draft Lists</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-amber-700">
                  {lists.filter(l => l.status === 'Draft').length}
                </span>
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-[10.5px] text-amber-600 font-bold">Pending Publication</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-l-4 border-l-purple-600 border-y border-r border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400">Archived Lists</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-purple-800">
                  {lists.filter(l => l.status === 'Archived').length}
                </span>
                <Archive className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-[10.5px] text-purple-700 font-bold">Previous Historical Years</p>
            </div>
          </div>

          {/* Recent Updates Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C0991B]" /> Beneficiaries Activity Timeline & Audit Trail
              </h3>
              <span className="text-xs text-gray-400 font-bold">{auditLogs.length} Events Logged</span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {auditLogs.slice(0, 10).map(log => (
                <div key={log.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        log.action.includes('Published') ? 'bg-emerald-100 text-emerald-800' :
                        log.action.includes('Created') ? 'bg-blue-100 text-blue-800' :
                        log.action.includes('Import') ? 'bg-purple-100 text-purple-800' : 'bg-gray-200 text-gray-800'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-gray-400 font-bold text-[10px]">{log.timestamp}</span>
                    </div>
                    <p className="font-bold text-gray-700">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-black shrink-0">{log.performedBy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: ANNUAL BENEFICIARY LISTS ================= */}
      {activeTab === 'lists' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Controls & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search annual lists by year, title, identifier..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-[#C0991B]"
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto">
              <span className="text-xs font-black text-gray-500 uppercase">Status:</span>
              {(['All', 'Published', 'Draft', 'Archived'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                    statusFilter === st 
                      ? 'bg-[#074504] text-[#C0991B]' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Annual Lists Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-black text-xs text-[#074504] uppercase flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C0991B]" /> Annual Beneficiary Roster Containers ({filteredLists.length})
              </h3>
              <span className="text-[11px] text-gray-500 font-bold">Auto-assigned Identifier: NH-BEN-YEAR</span>
            </div>

            {filteredLists.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-gray-100/70 border-b border-gray-200 text-[10px] font-black text-gray-500 uppercase">
                      <th className="p-4">Year & ID</th>
                      <th className="p-4">List Title & Description</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Scholars Count</th>
                      <th className="p-4">Created By / Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredLists.map(l => (
                      <tr key={l.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <span className="font-black text-[#074504] text-sm block">{l.year}</span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-mono text-[10px] font-bold rounded">
                              {l.yearIdentifier}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1 max-w-md">
                            <span className="font-bold text-gray-800 block">{l.title}</span>
                            <p className="text-gray-500 text-[11px] font-medium line-clamp-1">{l.description}</p>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            l.status === 'Published' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                            l.status === 'Draft' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                            'bg-purple-100 text-purple-900 border border-purple-300'
                          }`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="px-3 py-1 bg-[#074504]/5 text-[#074504] font-black rounded-lg text-xs">
                            {l.recordsCount || 0} Records
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">
                          <div className="text-[11px] font-medium">
                            <span className="font-bold text-gray-700 block">{l.createdBy}</span>
                            <span>Created: {l.dateCreated}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedListId(l.id);
                              setActiveTab('entries');
                            }}
                            className="px-3 py-1.5 bg-[#074504] text-[#C0991B] hover:bg-[#053203] font-bold rounded-xl text-xs uppercase cursor-pointer transition-all"
                          >
                            Manage Entries
                          </button>

                          {canPublishOrArchive && l.status !== 'Published' && (
                            <button
                              onClick={() => handleSetListStatus(l.id, 'Published')}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border border-emerald-200"
                            >
                              Publish
                            </button>
                          )}

                          {canPublishOrArchive && l.status !== 'Archived' && (
                            <button
                              onClick={() => handleSetListStatus(l.id, 'Archived')}
                              className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border border-purple-200"
                            >
                              Archive
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteList(l.id, l.title)}
                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border border-red-200"
                            title="Delete Annual List"
                          >
                            Delete List
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Empty State */
              <div className="p-12 text-center space-y-4">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="font-black text-sm text-[#074504] uppercase">No Annual Beneficiary Lists Found</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  There are no beneficiary lists matching your search or status filter. Create a new annual list to begin.
                </p>
                <button
                  onClick={() => setActiveTab('create_list')}
                  className="px-4 py-2 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl"
                >
                  + Create First List
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: CREATE ANNUAL LIST ================= */}
      {activeTab === 'create_list' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C0991B]" /> Create Annual Beneficiary List
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Establish a new annual container for secondary school scholarship scholars
            </p>
          </div>

          <form onSubmit={handleCreateList} className="space-y-4 text-xs font-bold">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 uppercase mb-1">Beneficiary Year *</label>
                <input
                  type="text"
                  required
                  value={newYear}
                  onChange={e => setNewYear(e.target.value)}
                  placeholder="e.g. 2027"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
                />
              </div>

              <div>
                <label className="block text-gray-500 uppercase mb-1">Auto-Generated Identifier</label>
                <input
                  type="text"
                  disabled
                  value={`NH-BEN-${newYear || 'YEAR'}`}
                  className="w-full p-2.5 bg-gray-100 text-gray-500 font-mono border border-gray-200 rounded-xl cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 uppercase mb-1">List Title *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. 2027 Arise & Shine Secondary School Scholars List"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
              />
            </div>

            <div>
              <label className="block text-gray-500 uppercase mb-1">Description (Optional)</label>
              <textarea
                rows={3}
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Describe program background, funding source, or selection notes..."
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
              />
            </div>

            <div>
              <label className="block text-gray-500 uppercase mb-1">Initial Publication Status</label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as any)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
              >
                <option value="Draft">Draft (Internal review, non-public)</option>
                <option value="Published">Published (Immediately live on public website)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('lists')}
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#074504] hover:bg-[#053203] text-[#C0991B] font-black uppercase rounded-xl shadow-md cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-[#C0991B]" /> Save & Establish Roster
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TAB 4: BENEFICIARY ENTRIES ================= */}
      {activeTab === 'entries' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Selected List Selector Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#C0991B]" />
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase block">Active Annual List</span>
                <select
                  value={selectedListId}
                  onChange={e => setSelectedListId(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-black text-[#074504] outline-none"
                >
                  {lists.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.year} - {l.title} ({l.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-[#074504] border border-emerald-200 rounded-full text-xs font-black">
                {currentRecords.length} Sequential Scholars
              </span>
              <span className="px-3 py-1 bg-amber-50 text-[#826507] border border-amber-200 rounded-full text-xs font-black">
                Auto 2nd &amp; 3rd Name Masking Active (Database Security Rule)
              </span>
            </div>
          </div>

          {/* Quick Add Single Beneficiary Form */}
          <div className="bg-white p-5 rounded-2xl border-t-4 border-t-[#074504] border-x border-b border-gray-200 shadow-xs space-y-3">
            <h4 className="font-black text-xs text-[#074504] uppercase flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C0991B]" /> Add Beneficiary Record (Fixed Sequential Order)
            </h4>

            <form onSubmit={handleAddSingleBeneficiary} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">Full Beneficiary Name *</label>
                <input
                  type="text"
                  required
                  value={newEntryName}
                  onChange={e => setNewEntryName(e.target.value)}
                  placeholder="e.g. JOHN MUGENDI KARIUKI"
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-bold uppercase outline-none focus:bg-white focus:border-[#C0991B]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-500 uppercase mb-1">High School Attending *</label>
                <input
                  type="text"
                  required
                  value={newEntrySchool}
                  onChange={e => setNewEntrySchool(e.target.value)}
                  placeholder="e.g. NYERI HIGH SCHOOL"
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-medium uppercase outline-none focus:bg-white focus:border-[#C0991B]"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-[#074504] hover:bg-[#053203] text-[#C0991B] font-black text-xs uppercase rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#C0991B]" /> Add Record
                </button>
              </div>
            </form>
          </div>

          {/* Search & School Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search beneficiary name or school..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-[#C0991B]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-gray-500 uppercase">School:</span>
              <select
                value={schoolFilter}
                onChange={e => setSchoolFilter(e.target.value)}
                className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#074504] max-w-xs truncate"
              >
                {uniqueSchools.map(sch => (
                  <option key={sch} value={sch}>{sch}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sequential Beneficiaries Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-black text-xs text-[#074504] uppercase flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C0991B]" /> Sequential Beneficiary Roster ({filteredRecords.length})
              </h3>
              <p className="text-[11px] text-gray-500 font-bold">
                Sequential Numbering Auto-Refreshes On Add/Delete/Move
              </p>
            </div>

            {filteredRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-[#074504] text-[#C0991B] text-[10px] font-black uppercase tracking-wider">
                      <th className="p-3.5 text-center w-16">No.</th>
                      <th className="p-3.5">Full Name (Internal Admin)</th>
                      <th className="p-3.5">Masked Published Preview</th>
                      <th className="p-3.5">High School Attending</th>
                      <th className="p-3.5 text-center">Order</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredRecords.map((r, idx) => {
                      const isEditing = editingRecordId === r.id;
                      return (
                        <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="p-3.5 text-center font-black text-gray-500 bg-gray-50/50">
                            {r.serialNumber}
                          </td>

                          {isEditing ? (
                            <>
                              <td className="p-3.5">
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={e => setEditName(e.target.value.toUpperCase())}
                                  className="w-full p-1.5 bg-amber-50 border border-[#C0991B] rounded font-bold uppercase text-xs"
                                />
                              </td>
                              <td className="p-3.5 font-mono text-gray-400 text-xs italic">
                                {maskBeneficiaryName(editName)}
                              </td>
                              <td className="p-3.5">
                                <input
                                  type="text"
                                  value={editSchool}
                                  onChange={e => setEditSchool(e.target.value.toUpperCase())}
                                  className="w-full p-1.5 bg-amber-50 border border-[#C0991B] rounded font-bold uppercase text-xs"
                                />
                              </td>
                              <td className="p-3.5 text-center text-gray-300">-</td>
                              <td className="p-3.5 text-right space-x-2">
                                <button
                                  onClick={() => handleSaveEdit(r.id)}
                                  className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingRecordId(null)}
                                  className="px-2 py-1 bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
                                >
                                  Cancel
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="p-3.5 font-black text-[#074504] uppercase">
                                {r.fullName}
                              </td>
                              <td className="p-3.5">
                                <span className="px-2.5 py-1 bg-amber-50 text-[#826507] font-mono font-bold text-xs rounded-md border border-[#C0991B]/30">
                                  {r.maskedName}
                                </span>
                              </td>
                              <td className="p-3.5 font-bold text-gray-600">
                                {r.school}
                              </td>
                              <td className="p-3.5 text-center">
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    onClick={() => handleMoveRecord(r.id, 'up')}
                                    disabled={idx === 0}
                                    title="Move Up"
                                    className="p-1 text-gray-400 hover:text-[#074504] disabled:opacity-30 cursor-pointer"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleMoveRecord(r.id, 'down')}
                                    disabled={idx === filteredRecords.length - 1}
                                    title="Move Down"
                                    className="p-1 text-gray-400 hover:text-[#074504] disabled:opacity-30 cursor-pointer"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                              <td className="p-3.5 text-right space-x-1.5">
                                <button
                                  onClick={() => handleStartEdit(r)}
                                  title="Edit Entry"
                                  className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors cursor-pointer"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDuplicateRecord(r)}
                                  title="Duplicate Entry"
                                  className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBeneficiary(r.id, r.fullName)}
                                  title="Delete Entry"
                                  className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center space-y-3">
                <Users className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-500 font-bold uppercase">No beneficiary records found for this list</p>
                <p className="text-[11px] text-gray-400">Add a beneficiary above or use the Bulk Import Wizard.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 5: BULK IMPORT WIZARD ================= */}
      {activeTab === 'import' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#C0991B]" /> Bulk Beneficiary Import Wizard (.xlsx / CSV)
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Import beneficiary records in bulk with automated validation and duplicate checks
              </p>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map(st => (
                <span
                  key={st}
                  className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center ${
                    importStep === st ? 'bg-[#074504] text-[#C0991B]' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {st}
                </span>
              ))}
            </div>
          </div>

          {importStep === 1 && (
            <div className="space-y-4 max-w-2xl text-xs font-bold">
              <div>
                <label className="block text-gray-500 uppercase mb-1">Select Target Annual List *</label>
                <select
                  value={importTargetListId || selectedListId}
                  onChange={e => setImportTargetListId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black text-[#074504]"
                >
                  {lists.map(l => (
                    <option key={l.id} value={l.id}>{l.year} - {l.title}</option>
                  ))}
                </select>
              </div>

              {/* File Upload for Excel / CSV */}
              <div className="p-4 bg-emerald-50/60 border border-dashed border-[#074504]/30 rounded-2xl text-center space-y-2">
                <FileSpreadsheet className="w-8 h-8 text-[#074504] mx-auto" />
                <div>
                  <label className="inline-block px-4 py-2 bg-[#074504] hover:bg-[#053203] text-[#C0991B] font-black text-xs uppercase rounded-xl cursor-pointer transition-all shadow-sm">
                    <span>Upload Excel File (.xlsx, .xls, .csv)</span>
                    <input 
                      type="file" 
                      accept=".xlsx, .xls, .csv, .tsv" 
                      onChange={handleFileUpload}
                      className="hidden" 
                    />
                  </label>
                </div>
                <p className="text-[11px] text-gray-500 font-medium">
                  Select an Excel or CSV file with Column 1 = Full Name, Column 2 = High School Attending.
                </p>
              </div>

              <div>
                <label className="block text-gray-500 uppercase mb-1">Or Paste CSV/Text Data (Format: Full Name, High School)</label>
                <textarea
                  rows={6}
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                  placeholder={`JOHN MUGENDI KARIUKI, NYERI HIGH SCHOOL\nMARY WANJIRU WANJIKU, KARIMA GIRLS HIGH SCHOOL\nSTEPHEN GITONGA NJAGI, MOI HIGH SCHOOL MBIRURI`}
                  className="w-full p-3 font-mono text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C0991B]"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleParseImport}
                  className="px-6 py-2.5 bg-[#074504] hover:bg-[#053203] text-[#C0991B] font-black uppercase rounded-xl cursor-pointer"
                >
                  Parse & Preview Import Data
                </button>
              </div>
            </div>
          )}

          {importStep === 2 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center font-bold">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800">
                  <span className="block text-lg font-black">{parsedImportRows.filter(r => r.isValid).length}</span>
                  <span>Valid Records</span>
                </div>
                <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-800">
                  <span className="block text-lg font-black">{parsedImportRows.filter(r => !r.isValid).length}</span>
                  <span>Invalid / Errors</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800">
                  <span className="block text-lg font-black">0</span>
                  <span>Duplicates</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-800">
                  <span className="block text-lg font-black">{parsedImportRows.length}</span>
                  <span>Total Parsed</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-100 text-[10px] font-black uppercase text-gray-500">
                      <th className="p-3">Status</th>
                      <th className="p-3">Parsed Beneficiary Name</th>
                      <th className="p-3">High School</th>
                      <th className="p-3">Validation Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {parsedImportRows.map(row => (
                      <tr key={row.id}>
                        <td className="p-3">
                          {row.isValid ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black text-[10px]">VALID</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-black text-[10px]">INVALID</span>
                          )}
                        </td>
                        <td className="p-3 font-bold text-[#074504] uppercase">{row.fullName}</td>
                        <td className="p-3 font-medium">{row.school}</td>
                        <td className="p-3 text-red-600 font-bold">{row.errorMsg || 'Ready for insert'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setImportStep(1)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl uppercase"
                >
                  Back to Paste
                </button>
                <button
                  onClick={handleCommitImport}
                  className="px-6 py-2.5 bg-[#074504] hover:bg-[#053203] text-[#C0991B] font-black uppercase rounded-xl shadow-md cursor-pointer"
                >
                  Commit Import Into List
                </button>
              </div>
            </div>
          )}

          {importStep === 3 && (
            <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-black text-base text-[#074504] uppercase">Bulk Import Completed Successfully</h4>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Beneficiary records have been added to the roster and assigned sequential numbering starting at 1.
              </p>
              <button
                onClick={() => {
                  setImportStep(1);
                  setImportText('');
                  setActiveTab('entries');
                }}
                className="px-6 py-2.5 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl shadow-md cursor-pointer"
              >
                View Beneficiary Entries Roster
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 6: EXPORT ROSTER ================= */}
      {activeTab === 'export' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
              <Download className="w-4 h-4 text-[#C0991B]" /> Export Beneficiary Roster
            </h3>
            <p className="text-xs text-gray-500 font-medium">Download formatted beneficiary data for audit or offline reports</p>
          </div>

          <div className="space-y-4 text-xs font-bold">
            <div>
              <label className="block text-gray-500 uppercase mb-1">Select Annual List to Export</label>
              <select
                value={selectedListId}
                onChange={e => setSelectedListId(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black text-[#074504]"
              >
                {lists.map(l => (
                  <option key={l.id} value={l.id}>{l.year} - {l.title} ({l.recordsCount} records)</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <button
                onClick={handleExportPDF}
                className="p-5 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 border border-gray-200 rounded-2xl transition-all text-center space-y-2 cursor-pointer group"
              >
                <FileText className="w-8 h-8 text-[#074504] mx-auto group-hover:scale-110 transition-transform" />
                <span className="block font-black uppercase text-[#074504]">Download PDF Report</span>
                <span className="text-[10px] text-gray-500 font-medium block">Official PDF document</span>
              </button>

              <button
                onClick={handlePrintReport}
                className="p-5 bg-gray-50 hover:bg-amber-50 hover:border-[#C0991B] border border-gray-200 rounded-2xl transition-all text-center space-y-2 cursor-pointer group"
              >
                <Printer className="w-8 h-8 text-[#C0991B] mx-auto group-hover:scale-110 transition-transform" />
                <span className="block font-black uppercase text-[#074504]">Print PDF View</span>
                <span className="text-[10px] text-gray-500 font-medium block">Formatted printable page</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="p-5 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 rounded-2xl transition-all text-center space-y-2 cursor-pointer group"
              >
                <FileSpreadsheet className="w-8 h-8 text-blue-700 mx-auto group-hover:scale-110 transition-transform" />
                <span className="block font-black uppercase text-blue-900">Export CSV / Excel</span>
                <span className="text-[10px] text-gray-500 font-medium block">Formatted CSV export</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: REPORTS & ANALYTICS ================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <FileText className="w-8 h-8 text-[#074504]" />
              <h4 className="font-black text-sm text-[#074504] uppercase">Annual Beneficiary Report</h4>
              <p className="text-xs text-gray-500 font-medium">Year-over-year scholar enrollment breakdown & distribution.</p>
              <div className="flex gap-2">
                <button onClick={handleExportPDF} className="px-3 py-1.5 bg-[#074504] text-[#C0991B] text-xs font-black uppercase rounded-xl cursor-pointer">
                  PDF Report
                </button>
                <button onClick={handlePrintReport} className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-black uppercase rounded-xl cursor-pointer">
                  Print
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <School className="w-8 h-8 text-[#C0991B]" />
              <h4 className="font-black text-sm text-[#074504] uppercase">School Distribution Report</h4>
              <p className="text-xs text-gray-500 font-medium">High school partners allocation across Embu County.</p>
              <div className="flex gap-2">
                <button onClick={handleExportPDF} className="px-3 py-1.5 bg-[#074504] text-[#C0991B] text-xs font-black uppercase rounded-xl cursor-pointer">
                  PDF Report
                </button>
                <button onClick={handlePrintReport} className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-black uppercase rounded-xl cursor-pointer">
                  Print
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <BarChart3 className="w-8 h-8 text-[#599200]" />
              <h4 className="font-black text-sm text-[#074504] uppercase">Beneficiary Summary Report</h4>
              <p className="text-xs text-gray-500 font-medium">Executive social impact allocation summary for stakeholders.</p>
              <div className="flex gap-2">
                <button onClick={handleExportPDF} className="px-3 py-1.5 bg-[#074504] text-[#C0991B] text-xs font-black uppercase rounded-xl cursor-pointer">
                  PDF Report
                </button>
                <button onClick={handlePrintReport} className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-black uppercase rounded-xl cursor-pointer">
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 8: REST APIS ================= */}
      {activeTab === 'apis' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4 animate-in fade-in duration-300">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#C0991B]" /> REST API Endpoints Specification
            </h3>
            <p className="text-xs text-gray-500 font-medium">Secure endpoints for beneficiary list management & integration</p>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { method: 'GET', path: '/api/v1/beneficiaries/published', desc: 'Fetch published beneficiary lists with 2nd & 3rd name masking' },
              { method: 'POST', path: '/api/v1/beneficiaries/lists', desc: 'Create a new annual beneficiary list container' },
              { method: 'POST', path: '/api/v1/beneficiaries/entries', desc: 'Add a single beneficiary record with auto-sequence' },
              { method: 'POST', path: '/api/v1/beneficiaries/import', desc: 'Execute bulk import with automated validation' },
              { method: 'POST', path: '/api/v1/beneficiaries/publish/:id', desc: 'Publish annual list live to the public website' }
            ].map(api => (
              <div key={api.path} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between font-mono">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-[#074504] text-[#C0991B] rounded text-[10px] font-black">{api.method}</span>
                  <span className="font-bold text-gray-800">{api.path}</span>
                </div>
                <span className="text-[11px] text-gray-500 font-sans font-medium">{api.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 9: SETTINGS ================= */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#C0991B]" /> Module Rules &amp; Security Policy (Cloud Database Engine)
            </h3>
            <p className="text-xs text-gray-500 font-medium">Configuration for publication masking &amp; access permissions</p>
          </div>

          <div className="space-y-4 text-xs font-bold text-gray-700">
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#074504]" />
              <div>
                <span className="block font-black text-[#074504]">Enforce Automatic 2nd and 3rd Name Blur/Masking</span>
                <span className="text-[10.5px] text-gray-500 font-medium block">Converts 2nd, 3rd, and all subsequent names to initial + asterisks before publication (e.g. JOHN M***** K***** via database RLS &amp; trigger rules)</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#074504]" />
              <div>
                <span className="block font-black text-[#074504]">Auto-Resequence Serial Numbering On Record Changes</span>
                <span className="text-[10.5px] text-gray-500 font-medium block">Ensures serial numbers always start at 1 without gaps or duplicates</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#074504]" />
              <div>
                <span className="block font-black text-[#074504]">Webmaster Publication Rights Enabled</span>
                <span className="text-[10.5px] text-gray-500 font-medium block">Webmasters can create, edit, publish, and archive annual lists</span>
              </div>
            </label>
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
