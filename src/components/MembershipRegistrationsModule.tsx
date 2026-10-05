import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Users, UserCheck, Search, Filter, Download, 
  FileSpreadsheet, Printer, CheckCircle2, Clock, Eye, RefreshCw, 
  Building2, MapPin, DollarSign, X, Check, ShieldCheck
} from 'lucide-react';
import { downloadExcel, downloadCSV, ColumnDef } from '../lib/excelReportExport';
import ReportModal from './ReportModal';

export type MembershipSubmodule = 'individual' | 'group';

interface MembershipRegistrationsModuleProps {
  initialSubmodule?: MembershipSubmodule;
  showToast?: (msg: string) => void;
}

export const MembershipRegistrationsModule: React.FC<MembershipRegistrationsModuleProps> = ({
  initialSubmodule = 'individual',
  showToast = (msg: string) => console.log(msg)
}) => {
  const [submodule, setSubmodule] = useState<MembershipSubmodule>(initialSubmodule);
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
      if (submodule === 'individual') {
        const { data, error } = await supabase
          .from('individual_registrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setItems(data);
        } else {
          setItems([]);
        }
      } else {
        const { data, error } = await supabase
          .from('group_registrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setItems(data);
        } else {
          setItems([]);
        }
      }
    } catch (err) {
      console.warn("Notice loading membership records:", err);
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
    showToast(`Updated registration status to "${newStatus}"`);

    const table = submodule === 'individual' ? 'individual_registrations' : 'group_registrations';
    try {
      await supabase.from(table).update({ status: newStatus }).eq('id', id);
    } catch (err) {
      console.warn("Status update notice:", err);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch = 
        (item.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.group_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.phone || '').includes(searchQuery) ||
        (item.representative_phone || '').includes(searchQuery) ||
        (item.county || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.registration_certificate_no || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [items, searchQuery, statusFilter]);

  const columns: ColumnDef[] = useMemo(() => {
    if (submodule === 'individual') {
      return [
        { key: 'full_name', label: 'Full Member Name' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'id_number', label: 'National ID' },
        { key: 'gender', label: 'Gender' },
        { key: 'county', label: 'County' },
        { key: 'occupation', label: 'Occupation / Business' },
        { key: 'registration_fee', label: 'Fee Paid (Kshs)' },
        { key: 'status', label: 'Membership Status' },
        { key: 'created_at', label: 'Registered Date' }
      ];
    } else {
      return [
        { key: 'group_name', label: 'Registered Group Name' },
        { key: 'group_type', label: 'Group Category' },
        { key: 'registration_certificate_no', label: 'Cert / Reg No' },
        { key: 'member_count', label: 'Active Members' },
        { key: 'total_registration_fee', label: 'Group Fee (Kshs)' },
        { key: 'county', label: 'County' },
        { key: 'representative_name', label: 'Official / Contact' },
        { key: 'representative_phone', label: 'Phone' },
        { key: 'status', label: 'Status' },
        { key: 'created_at', label: 'Registration Date' }
      ];
    }
  }, [submodule]);

  const summaryMetrics = useMemo(() => {
    return [
      { label: 'Total Registrations', value: items.length, color: 'text-gray-900' },
      { label: 'Active / Paid', value: items.filter(i => (i.status || '').toLowerCase().match(/paid|verified|active/)).length, color: 'text-emerald-700' },
      { label: 'Pending Verification', value: items.filter(i => (i.status || '').toLowerCase().includes('pending')).length, color: 'text-amber-700' },
      { label: submodule === 'individual' ? 'Fee per Member' : 'Fee per Member', value: submodule === 'individual' ? 'Kshs 2,000' : 'Kshs 600', color: 'text-[#074504]' }
    ];
  }, [items, submodule]);

  const submoduleTitle = submodule === 'individual' ? 'Individual Member Registrations' : "Group Members' Registrations";

  return (
    <div className="space-y-6">
      
      {/* Module Title & Tabs */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#074504]/10 text-[#074504]">
              Membership registrations management
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
            onClick={() => setSubmodule('individual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              submodule === 'individual' 
                ? 'bg-[#074504] text-white shadow-md' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Individual member registration</span>
          </button>
          <button
            onClick={() => setSubmodule('group')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              submodule === 'group' 
                ? 'bg-[#074504] text-white shadow-md' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Group members’ registration</span>
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
              placeholder={`Search ${submodule === 'individual' ? 'members' : 'chamas'} by name, phone, county...`}
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
              <option value="Paid">Paid</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadExcel(`${submodule}_registrations`, columns, filteredItems)}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border border-emerald-200"
            title="Download formatted Excel spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Download Excel</span>
          </button>

          <button
            onClick={() => downloadCSV(`${submodule}_registrations`, columns, filteredItems)}
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#074504] text-white uppercase text-[10px] font-black tracking-wider">
              <tr>
                <th className="py-3 px-4">{submodule === 'individual' ? 'Member Name' : 'Chama / Group Name'}</th>
                <th className="py-3 px-4">Contact / Phone</th>
                <th className="py-3 px-4">{submodule === 'individual' ? 'ID Number' : 'Cert / Reg No'}</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">{submodule === 'individual' ? 'Fee (Kshs)' : 'Members & Total Fee'}</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#074504]" />
                    <p className="text-xs font-bold">Querying live {submodule} registrations...</p>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 italic">
                    No registrations found matching the query.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-gray-900">
                        {submodule === 'individual' ? item.full_name : item.group_name}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {submodule === 'individual' ? item.occupation : item.group_type}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-800">
                        {submodule === 'individual' ? item.phone : item.representative_phone}
                      </div>
                      {submodule === 'group' && item.representative_name && (
                        <span className="text-[10px] text-gray-400 block">{item.representative_name}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-700">
                      {submodule === 'individual' ? item.id_number || '—' : item.registration_certificate_no || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-800">{item.county || 'Kenya'}</span>
                      {item.sub_county && <span className="text-[10px] text-gray-400 block">{item.sub_county}</span>}
                    </td>
                    <td className="py-3 px-4">
                      {submodule === 'individual' ? (
                        <span className="font-black text-[#074504]">{item.registration_fee || 'Kshs 2,000'}</span>
                      ) : (
                        <div>
                          <span className="font-bold text-gray-900">{item.member_count || 0} Members</span>
                          <div className="text-[10px] font-black text-[#074504]">{item.total_registration_fee || `Kshs ${Number(item.member_count || 0) * 600}`}</div>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={item.status || 'Paid'}
                        onChange={e => updateStatus(item.id, e.target.value)}
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full border cursor-pointer ${
                          (item.status || '').toLowerCase().match(/paid|verified|active/)
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="Paid">Paid</option>
                        <option value="Verified">Verified</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#074504] transition-all cursor-pointer"
                        title="View Full Registration Details"
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

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-black uppercase text-[#074504]">{submoduleTitle}</span>
                <h3 className="text-base font-black text-gray-900">
                  {submodule === 'individual' ? selectedItem.full_name : selectedItem.group_name}
                </h3>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div><strong className="text-gray-500 text-[10px] uppercase block">Location</strong> {selectedItem.county} {selectedItem.sub_county ? `• ${selectedItem.sub_county}` : ''}</div>
                <div><strong className="text-gray-500 text-[10px] uppercase block">Status</strong> {selectedItem.status || 'Paid'}</div>
                <div><strong className="text-gray-500 text-[10px] uppercase block">Phone</strong> {submodule === 'individual' ? selectedItem.phone : selectedItem.representative_phone}</div>
                <div><strong className="text-gray-500 text-[10px] uppercase block">Registration Date</strong> {new Date(selectedItem.created_at || Date.now()).toLocaleDateString()}</div>
              </div>

              {submodule === 'individual' ? (
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200 grid grid-cols-2 gap-2">
                  <div><strong className="text-emerald-800 text-[10px] uppercase block">National ID</strong> {selectedItem.id_number || '—'}</div>
                  <div><strong className="text-emerald-800 text-[10px] uppercase block">Registration Fee</strong> <span className="font-black text-[#074504]">{selectedItem.registration_fee || 'Kshs 2,000'}</span></div>
                  <div><strong className="text-emerald-800 text-[10px] uppercase block">Gender</strong> {selectedItem.gender || '—'}</div>
                  <div><strong className="text-emerald-800 text-[10px] uppercase block">Occupation</strong> {selectedItem.occupation || '—'}</div>
                </div>
              ) : (
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div><strong className="text-emerald-800 text-[10px] uppercase block">Cert / Reg No</strong> {selectedItem.registration_certificate_no || '—'}</div>
                    <div><strong className="text-emerald-800 text-[10px] uppercase block">Total Members</strong> {selectedItem.member_count} Members</div>
                  </div>
                  <div>
                    <strong className="text-emerald-800 text-[10px] uppercase block">Group Official</strong>
                    <span>{selectedItem.representative_name} ({selectedItem.representative_phone})</span>
                  </div>
                  <div>
                    <strong className="text-emerald-800 text-[10px] uppercase block">Total Group Fee (Kshs 600 / member)</strong>
                    <span className="font-black text-[#074504] text-sm">{selectedItem.total_registration_fee || `Kshs ${Number(selectedItem.member_count || 0) * 600}`}</span>
                  </div>
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
        moduleName="Membership registrations management"
        submoduleName={submoduleTitle}
        summaryMetrics={summaryMetrics}
        columns={columns}
        data={filteredItems}
        filterDescription={`Status: ${statusFilter} • Search: "${searchQuery || 'None'}"`}
      />

    </div>
  );
};

export default MembershipRegistrationsModule;
