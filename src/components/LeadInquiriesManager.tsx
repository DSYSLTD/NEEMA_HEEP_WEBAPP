import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Mail, Phone, Calendar, User, Search, Filter, Download, 
  FileSpreadsheet, Printer, CheckCircle2, Clock, Eye, RefreshCw, 
  ChevronRight, Tag, AlertCircle, ArrowUpRight, MessageSquare, Check, X,
  Building2, MapPin, DollarSign, FileText, ChevronLeft, Trash2
} from 'lucide-react';
import { downloadExcel, downloadCSV, ColumnDef } from '../lib/excelReportExport';
import ReportModal from './ReportModal';

export type LeadSubmodule = 'prequalifications' | 'callbacks' | 'contacts';

interface LeadInquiriesManagerProps {
  initialSubmodule?: LeadSubmodule;
  showToast?: (msg: string) => void;
}

export interface LeadRecord {
  id: string;
  form_type: string;
  full_name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  status?: string;
  source_page?: string;
  details?: Record<string, any>;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export const LeadInquiriesManager: React.FC<LeadInquiriesManagerProps> = ({
  initialSubmodule = 'prequalifications',
  showToast = (msg: string) => console.log(msg)
}) => {
  const [submodule, setSubmodule] = useState<LeadSubmodule>(initialSubmodule);
  const [items, setItems] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<LeadRecord | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    setSubmodule(initialSubmodule);
    setCurrentPage(1);
  }, [initialSubmodule]);

  // Form type filter mapping for the single source of truth: public.leads
  const formTypeFilter = useMemo(() => {
    if (submodule === 'prequalifications') {
      return ['prequalification', 'Pre-Qualification', 'prequalifications', 'pre_qualification'];
    }
    if (submodule === 'callbacks') {
      return ['callback', 'Callback', 'callbacks', 'call_back', 'callback_requests'];
    }
    return ['contact', 'Contact', 'contacts', 'contact_messages', 'contact_us'];
  }, [submodule]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Query single source of truth: public.leads
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .in('form_type', formTypeFilter)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn(`[LeadInquiriesManager] Error querying public.leads:`, error.message);
        setItems([]);
      } else {
        setItems(data || []);
      }
    } catch (err: any) {
      console.warn("Lead fetch exception:", err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [submodule, formTypeFilter]);

  // Handle status update persistent in public.leads
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const current = items.find(i => i.id === id);
      const updatedDetails = { ...(current?.details || {}), status: newStatus };

      // Update both status and details->status for complete compatibility
      const { error } = await supabase
        .from('leads')
        .update({ 
          status: newStatus,
          details: updatedDetails,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        // Fallback update details only if status column is pending migration
        await supabase
          .from('leads')
          .update({ 
            details: updatedDetails,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
      }

      setItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus, details: updatedDetails } : item));
      if (selectedItem?.id === id) {
        setSelectedItem(prev => prev ? { ...prev, status: newStatus, details: updatedDetails } : null);
      }
      showToast(`Status updated to "${newStatus}"`);
    } catch (err) {
      console.error('Update status error:', err);
      showToast('Status updated locally.');
    }
  };

  // Handle lead deletion
  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead record? This action cannot be undone.')) {
      return;
    }
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      setItems(prev => prev.filter(i => i.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
      showToast('Lead record deleted successfully from database.');
    } catch (err: any) {
      console.error('Delete error:', err);
      showToast(`Delete failed: ${err.message}`);
    }
  };

  // Helper to extract effective status from row or details JSON
  const getLeadStatus = (row: LeadRecord): string => {
    return row.status || row.details?.status || 'New';
  };

  // Filter & Search logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const status = getLeadStatus(item);
      const matchesStatus = statusFilter === 'All' || status.toLowerCase() === statusFilter.toLowerCase();
      
      const detailsStr = item.details ? JSON.stringify(item.details) : '';
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        (item.full_name && item.full_name.toLowerCase().includes(query)) ||
        (item.email && item.email.toLowerCase().includes(query)) ||
        (item.phone && item.phone.toLowerCase().includes(query)) ||
        (item.subject && item.subject.toLowerCase().includes(query)) ||
        (item.message && item.message.toLowerCase().includes(query)) ||
        detailsStr.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [items, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Column definitions for Excel & CSV Exports
  const columns: ColumnDef[] = useMemo(() => {
    if (submodule === 'prequalifications') {
      return [
        { key: 'full_name', label: 'Applicant Name' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'email', label: 'Email' },
        { key: 'loan_product', label: 'Loan Product' },
        { key: 'requested_amount', label: 'Requested Capital' },
        { key: 'monthly_turnover', label: 'Monthly Turnover' },
        { key: 'business_type', label: 'Business Enterprise' },
        { key: 'source_page', label: 'Source Page' },
        { key: 'status', label: 'Review Status' },
        { key: 'created_at', label: 'Submission Date' }
      ];
    }
    if (submodule === 'callbacks') {
      return [
        { key: 'full_name', label: 'Contact Name' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'email', label: 'Email' },
        { key: 'preferred_time', label: 'Preferred Callback Time' },
        { key: 'subject', label: 'Inquiry Category' },
        { key: 'source_page', label: 'Source Page' },
        { key: 'status', label: 'Call Status' },
        { key: 'created_at', label: 'Request Date' }
      ];
    }
    return [
      { key: 'full_name', label: 'Sender Name' },
      { key: 'email', label: 'Email Address' },
      { key: 'phone', label: 'Phone Number' },
      { key: 'subject', label: 'Subject / Category' },
      { key: 'message', label: 'Message Content' },
      { key: 'source_page', label: 'Source Page' },
      { key: 'status', label: 'Status' },
      { key: 'created_at', label: 'Date Submitted' }
    ];
  }, [submodule]);

  // Flattened row data for export
  const exportRows = useMemo(() => {
    return filteredItems.map(item => {
      const d = item.details || {};
      return {
        id: item.id,
        full_name: item.full_name || 'Anonymous',
        phone: item.phone || 'N/A',
        email: item.email || 'N/A',
        subject: item.subject || d.subject || d.interest || 'General',
        message: item.message || d.message || d.notes || '',
        loan_product: d.loan_product || d.recommendedProduct || d.product || 'Standard Loan',
        requested_amount: d.requested_amount || d.requestedAmount || d.amount || 'N/A',
        monthly_turnover: d.monthly_turnover || d.monthlyTurnover || 'N/A',
        business_type: d.business_type || d.businessType || 'N/A',
        preferred_time: d.preferred_time || d.preferredTime || 'Anytime',
        source_page: item.source_page || d.signupSource || 'Website',
        status: getLeadStatus(item),
        created_at: new Date(item.created_at).toLocaleString()
      };
    });
  }, [filteredItems, submodule]);

  const handleExportExcel = () => {
    downloadExcel(`Neema_HEEP_${submodule}_Export`, columns, exportRows);
    showToast('Downloaded Excel Spreadsheet (.xlsx)!');
  };

  const handleExportCSV = () => {
    downloadCSV(`Neema_HEEP_${submodule}_Export`, columns, exportRows);
    showToast('Downloaded CSV (.csv)!');
  };

  const getSubmoduleTitle = () => {
    switch (submodule) {
      case 'prequalifications': return 'Loan Pre-Qualification Inquiries';
      case 'callbacks': return 'Phone Callback Requests';
      case 'contacts': return 'Contact Us Inquiries & Messages';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#074504] p-6 md:p-8 rounded-3xl border border-[#C0991B]/30 text-white shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 bg-[#C0991B]/20 text-[#C0991B] border border-[#C0991B]/40 rounded-full text-xs font-black uppercase">
              Single Source of Truth: public.leads
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <Mail className="w-6 h-6 text-[#C0991B]" />
              <span>{getSubmoduleTitle()}</span>
            </h2>
            <p className="text-xs md:text-sm text-gray-200 font-medium">
              Manage incoming public website customer inquiries, loan requests, and visitor contact messages.
            </p>
          </div>

          {/* Submodule Navigation Switcher */}
          <div className="flex items-center gap-1.5 bg-black/30 p-1.5 rounded-2xl border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setSubmodule('prequalifications')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                submodule === 'prequalifications' ? 'bg-[#C0991B] text-[#074504] shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              Prequalification
            </button>
            <button
              type="button"
              onClick={() => setSubmodule('callbacks')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                submodule === 'callbacks' ? 'bg-[#C0991B] text-[#074504] shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              Callback Requests
            </button>
            <button
              type="button"
              onClick={() => setSubmodule('contacts')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                submodule === 'contacts' ? 'bg-[#C0991B] text-[#074504] shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              Contact Messages
            </button>
          </div>
        </div>

        {/* Toolbar: Stats & Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="text-gray-300">
              Total In Database: <strong className="text-white">{items.length}</strong>
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-[#C0991B]">
              Filtered Results: <strong>{filteredItems.length}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={fetchData}
              title="Refresh from Supabase"
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer border border-white/20"
            >
              <RefreshCw className={`w-4 h-4 text-[#C0991B] ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3.5 py-2 bg-[#C0991B] hover:bg-[#a98514] text-[#074504] font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#C0991B]" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-[#C0991B]" />
              <span>Print Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder={`Search ${getSubmoduleTitle()} by name, phone, email, details...`}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:bg-white focus:border-[#C0991B]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 font-bold text-xs">
              ×
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-gray-500 uppercase flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#C0991B]" /> Status:
          </span>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#074504] outline-none cursor-pointer focus:border-[#C0991B]"
          >
            <option value="All">All Statuses</option>
            <option value="New">New / Unread</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#074504] animate-spin" />
            <p className="text-xs font-black text-gray-500 uppercase">Loading records from public.leads in Supabase...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-black text-gray-700 uppercase">No {getSubmoduleTitle()} matching filters</p>
            <p className="text-xs text-gray-400 font-medium">
              Submissions from the public website {submodule === 'prequalifications' ? 'loan prequalification quiz' : submodule === 'callbacks' ? 'callback request service' : 'contact form'} will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#074504] text-[#C0991B] text-[10px] font-black uppercase tracking-wider">
                  <th className="p-4 w-12 text-center">#</th>
                  <th className="p-4">Contact Person</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Email</th>
                  {submodule === 'prequalifications' && <th className="p-4">Loan Inquired</th>}
                  {submodule === 'callbacks' && <th className="p-4">Callback Window</th>}
                  {submodule === 'contacts' && <th className="p-4">Message Excerpt</th>}
                  <th className="p-4">Source Page</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium">
                {paginatedItems.map((item, idx) => {
                  const d = item.details || {};
                  const status = getLeadStatus(item);
                  const absoluteIdx = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4 text-center font-bold text-gray-400 bg-gray-50/30">
                        {absoluteIdx}
                      </td>
                      <td className="p-4 font-bold text-gray-900">
                        {item.full_name || 'Anonymous'}
                      </td>
                      <td className="p-4 text-gray-700 font-mono">
                        {item.phone || 'N/A'}
                      </td>
                      <td className="p-4 text-gray-600">
                        {item.email || 'N/A'}
                      </td>
                      {submodule === 'prequalifications' && (
                        <td className="p-4 font-bold text-[#074504]">
                          {d.loan_product || d.recommendedProduct || d.product || 'Standard Micro-Loan'}
                        </td>
                      )}
                      {submodule === 'callbacks' && (
                        <td className="p-4 text-gray-600 font-medium">
                          {d.preferred_time || d.preferredTime || 'Morning (8am - 12pm)'}
                        </td>
                      )}
                      {submodule === 'contacts' && (
                        <td className="p-4 text-gray-600 max-w-xs truncate">
                          {item.message || d.message || d.notes || item.subject || '—'}
                        </td>
                      )}
                      <td className="p-4 text-gray-500 font-medium max-w-[150px] truncate">
                        {item.source_page || d.signupSource || 'Website'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          status === 'New' ? 'bg-blue-100 text-blue-800' :
                          status === 'Contacted' ? 'bg-amber-100 text-amber-800' :
                          status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          status === 'In Progress' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedItem(item)}
                            title="Inspect Details"
                            className="p-1.5 bg-gray-100 hover:bg-[#074504] hover:text-[#C0991B] rounded-lg transition-colors cursor-pointer text-gray-700"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLead(item.id)}
                            title="Delete Lead"
                            className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-colors cursor-pointer text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && filteredItems.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-gray-600">
            <div>
              Showing {Math.min((currentPage - 1) * pageSize + 1, filteredItems.length)} to{' '}
              {Math.min(currentPage * pageSize, filteredItems.length)} of {filteredItems.length} records
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-black text-[#074504]">
                Page {currentPage} of {totalPages}
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Record Details View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 border border-gray-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#074504] text-[#C0991B] flex items-center justify-center font-black">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">{selectedItem.full_name || 'Anonymous Applicant'}</h3>
                  <p className="text-xs text-gray-500 font-bold">{selectedItem.form_type} Submission • ID: {selectedItem.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Change Selector */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-gray-400 block">Workflow Status</span>
                <span className="text-xs font-black text-[#074504]">{getLeadStatus(selectedItem)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {['New', 'Contacted', 'In Progress', 'Completed'].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(selectedItem.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      getLeadStatus(selectedItem) === st 
                        ? 'bg-[#074504] text-[#C0991B] shadow-xs' 
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Phone Contact</span>
                <p className="font-bold text-gray-900 font-mono flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C0991B]" />
                  <a href={`tel:${selectedItem.phone}`} className="hover:underline">{selectedItem.phone || 'N/A'}</a>
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Email Address</span>
                <p className="font-bold text-gray-900 flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-[#C0991B]" />
                  <a href={`mailto:${selectedItem.email}`} className="hover:underline">{selectedItem.email || 'N/A'}</a>
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Source Page / Form</span>
                <p className="font-bold text-gray-900">{selectedItem.source_page || selectedItem.details?.signupSource || 'Website'}</p>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Submission Timestamp</span>
                <p className="font-bold text-gray-900">{new Date(selectedItem.created_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Inquiries & Pre-qualification Responses */}
            {selectedItem.message && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase text-gray-500">Inquiry Message</span>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-800 leading-relaxed">
                  {selectedItem.message}
                </div>
              </div>
            )}

            {selectedItem.details && Object.keys(selectedItem.details).length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase text-gray-500">Form Submission Answers &amp; Data</span>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
                  {Object.entries(selectedItem.details).map(([k, v]) => {
                    if (['status', 'test', 'userAgent'].includes(k)) return null;
                    return (
                      <div key={k} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-1.5 gap-1">
                        <span className="text-gray-500 font-bold uppercase text-[10px]">{k.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-black text-gray-900">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formal Management Audit & Reporting Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title={`${getSubmoduleTitle()} Operations Audit Report`}
        moduleName="Lead & Inquiries Management"
        submoduleName={getSubmoduleTitle()}
        summaryMetrics={[
          { label: 'Total Inquiries', value: items.length, color: '#074504' },
          { label: 'Filtered Inquiries', value: filteredItems.length, color: '#16a34a' },
          { label: 'New / Unread', value: items.filter(i => getLeadStatus(i) === 'New').length, color: '#C0991B' }
        ]}
        columns={columns}
        data={exportRows}
        filterDescription={`Form Type: ${submodule} | Status Filter: ${statusFilter} | Search Query: "${searchQuery || 'All'}"`}
      />

    </div>
  );
};

export default LeadInquiriesManager;
