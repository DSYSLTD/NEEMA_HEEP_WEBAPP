import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  HeartHandshake, Handshake, Search, Filter, Download, 
  FileSpreadsheet, Printer, CheckCircle2, Clock, Eye, RefreshCw, 
  Building2, MapPin, DollarSign, X, Check, ShieldCheck
} from 'lucide-react';
import { downloadExcel, downloadCSV, ColumnDef } from '../lib/excelReportExport';
import ReportModal from './ReportModal';

export type SponsorPartnerSubmodule = 'sponsorship' | 'partnership';

interface SponsorshipPartnershipsModuleProps {
  initialSubmodule?: SponsorPartnerSubmodule;
  showToast?: (msg: string) => void;
}

export const SponsorshipPartnershipsModule: React.FC<SponsorshipPartnershipsModuleProps> = ({
  initialSubmodule = 'sponsorship',
  showToast = (msg: string) => console.log(msg)
}) => {
  const [submodule, setSubmodule] = useState<SponsorPartnerSubmodule>(initialSubmodule);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    setSubmodule(initialSubmodule);
  }, [initialSubmodule]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (submodule === 'sponsorship') {
        const { data, error } = await supabase
          .from('sponsorship_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setItems(data);
        } else {
          setItems([]);
        }
      } else {
        const { data, error } = await supabase
          .from('partnership_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setItems(data);
        } else {
          setItems([]);
        }
      }
    } catch (err) {
      console.warn("Notice loading sponsorship/partnerships data:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [submodule]);

  const updateStatus = async (id: string, newStatus: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    showToast(`Updated status to "${newStatus}"`);

    const table = submodule === 'sponsorship' ? 'sponsorship_requests' : 'partnership_requests';
    try {
      await supabase.from(table).update({ status: newStatus }).eq('id', id);
    } catch (err) {
      console.warn("Status update notice:", err);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch = 
        (item.applicant_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.organization_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.contact_person || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.student_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.phone || '').includes(searchQuery) ||
        (item.county || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.partnership_type || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [items, searchQuery, statusFilter]);

  const columns: ColumnDef[] = useMemo(() => {
    if (submodule === 'sponsorship') {
      return [
        { key: 'applicant_name', label: 'Applicant / Guardian' },
        { key: 'student_name', label: 'Student / Beneficiary' },
        { key: 'school_name', label: 'School / Institution' },
        { key: 'county', label: 'County' },
        { key: 'sponsorship_amount', label: 'Amount (Kshs)' },
        { key: 'social_status', label: 'Vulnerability Category' },
        { key: 'phone', label: 'Contact Phone' },
        { key: 'status', label: 'Review Status' },
        { key: 'created_at', label: 'Request Date' }
      ];
    } else {
      return [
        { key: 'organization_name', label: 'Partner Organization' },
        { key: 'contact_person', label: 'Contact Person' },
        { key: 'partnership_type', label: 'Partnership Category' },
        { key: 'county', label: 'County' },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'scope', label: 'Proposed Scope' },
        { key: 'status', label: 'Status' },
        { key: 'created_at', label: 'Submission Date' }
      ];
    }
  }, [submodule]);

  const summaryMetrics = useMemo(() => {
    return [
      { label: 'Total Requests', value: items.length, color: 'text-gray-900' },
      { label: 'Approved / Partnered', value: items.filter(i => (i.status || '').toLowerCase().includes('approved')).length, color: 'text-emerald-700' },
      { label: 'Under Review', value: items.filter(i => (i.status || '').toLowerCase().includes('review')).length, color: 'text-blue-700' },
      { label: 'Pending', value: items.filter(i => (i.status || '').toLowerCase().includes('pending')).length, color: 'text-amber-700' }
    ];
  }, [items]);

  const submoduleTitle = submodule === 'sponsorship' ? 'Sponsorship Requests' : 'Partnership Requests';

  return (
    <div className="space-y-6">
      
      {/* Title & Tabs */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#074504]/10 text-[#074504]">
              Sponsorship and Partnerships management
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs font-bold text-[#C0991B]">{submoduleTitle}</span>
          </div>
          <h2 className="text-xl font-black text-gray-900 mt-1">
            {submoduleTitle}
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Displays only corresponding filtered data from the verified database with Excel download and analytical report generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSubmodule('sponsorship')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              submodule === 'sponsorship' 
                ? 'bg-[#074504] text-white shadow-md' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Sponsorship requests</span>
          </button>
          <button
            onClick={() => setSubmodule('partnership')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              submodule === 'partnership' 
                ? 'bg-[#074504] text-white shadow-md' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Handshake className="w-3.5 h-3.5" />
            <span>Partnership requests</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search ${submodule === 'sponsorship' ? 'sponsorships' : 'partnerships'}...`}
              className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-2 rounded-xl text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#074504]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#074504]"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadExcel(`${submodule}_requests`, columns, filteredItems)}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border border-emerald-200"
            title="Download formatted Excel spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Download Excel</span>
          </button>

          <button
            onClick={() => downloadCSV(`${submodule}_requests`, columns, filteredItems)}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border border-gray-200 shadow-2xs"
            title="Export CSV data file"
          >
            <Download className="w-4 h-4 text-[#C0991B]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 bg-[#074504] hover:bg-[#052d03] text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-sm border border-[#C0991B]/40"
            title="Generate printable audit report"
          >
            <Printer className="w-4 h-4 text-[#C0991B]" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#074504] text-white uppercase text-[10px] font-black tracking-wider">
              <tr>
                <th className="py-3 px-4">{submodule === 'sponsorship' ? 'Applicant & Student' : 'Organization & Contact'}</th>
                <th className="py-3 px-4">Phone / Contact</th>
                <th className="py-3 px-4">{submodule === 'sponsorship' ? 'Institution / Category' : 'Partnership Focus'}</th>
                <th className="py-3 px-4">County</th>
                <th className="py-3 px-4">{submodule === 'sponsorship' ? 'Pledged Amount' : 'Scope Summary'}</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#074504]" />
                    <p className="text-xs font-bold">Querying live {submodule} records...</p>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 italic">
                    No {submoduleTitle.toLowerCase()} match the search query.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-gray-900">
                        {submodule === 'sponsorship' ? item.applicant_name : item.organization_name}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {submodule === 'sponsorship' ? `Student: ${item.student_name || 'N/A'}` : `Rep: ${item.contact_person || 'N/A'}`}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-800">{item.phone || '—'}</div>
                      {item.email && <div className="text-[10px] text-gray-400">{item.email}</div>}
                    </td>
                    <td className="py-3 px-4">
                      {submodule === 'sponsorship' ? (
                        <div>
                          <span className="font-bold text-gray-800">{item.school_name || 'School'}</span>
                          <span className="text-[10px] text-gray-400 block">{item.social_status}</span>
                        </div>
                      ) : (
                        <div className="font-bold text-gray-800">{item.partnership_type || 'General'}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-800">
                      {item.county || 'Kenya'}
                    </td>
                    <td className="py-3 px-4">
                      {submodule === 'sponsorship' ? (
                        <span className="font-black text-[#074504]">{item.sponsorship_amount || 'Kshs 30,000'}</span>
                      ) : (
                        <span className="text-[11px] text-gray-600 line-clamp-1">{item.scope || 'Collaborative Intervention'}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={item.status || 'Pending'}
                        onChange={e => updateStatus(item.id, e.target.value)}
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full border cursor-pointer ${
                          (item.status || '').toLowerCase().includes('approved')
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : (item.status || '').toLowerCase().includes('review')
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#074504] transition-all cursor-pointer"
                        title="View Full Submission Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-black uppercase text-[#074504]">{submoduleTitle} Dossier</span>
                <h3 className="text-base font-black text-gray-900">
                  {submodule === 'sponsorship' ? selectedItem.applicant_name : selectedItem.organization_name}
                </h3>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div><strong className="text-gray-500 text-[10px] uppercase block">Phone</strong> {selectedItem.phone}</div>
                <div><strong className="text-gray-500 text-[10px] uppercase block">Email</strong> {selectedItem.email || '—'}</div>
                <div><strong className="text-gray-500 text-[10px] uppercase block">County</strong> {selectedItem.county}</div>
                <div><strong className="text-gray-500 text-[10px] uppercase block">Status</strong> {selectedItem.status || 'Pending'}</div>
              </div>

              {submodule === 'sponsorship' ? (
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div><strong className="text-emerald-800 text-[10px] uppercase block">Student Name</strong> {selectedItem.student_name}</div>
                    <div><strong className="text-emerald-800 text-[10px] uppercase block">School</strong> {selectedItem.school_name}</div>
                  </div>
                  <div>
                    <strong className="text-emerald-800 text-[10px] uppercase block">Sponsorship Amount</strong>
                    <span className="font-black text-[#074504] text-sm">{selectedItem.sponsorship_amount || 'Kshs 30,000'}</span>
                  </div>
                  {selectedItem.justification && (
                    <div>
                      <strong className="text-emerald-800 text-[10px] uppercase block">Need / Justification</strong>
                      <p className="text-gray-700 leading-relaxed mt-0.5">{selectedItem.justification}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div><strong className="text-emerald-800 text-[10px] uppercase block">Contact Person</strong> {selectedItem.contact_person}</div>
                    <div><strong className="text-emerald-800 text-[10px] uppercase block">Category</strong> {selectedItem.partnership_type}</div>
                  </div>
                  {selectedItem.scope && (
                    <div>
                      <strong className="text-emerald-800 text-[10px] uppercase block">Proposed Partnership Scope</strong>
                      <p className="text-gray-700 leading-relaxed mt-0.5">{selectedItem.scope}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title={`${submoduleTitle} Audit Extract`}
        moduleName="Sponsorship and Partnerships management"
        submoduleName={submoduleTitle}
        summaryMetrics={summaryMetrics}
        columns={columns}
        data={filteredItems}
        filterDescription={`Status: ${statusFilter} • Search: "${searchQuery || 'None'}"`}
      />

    </div>
  );
};

export default SponsorshipPartnershipsModule;
