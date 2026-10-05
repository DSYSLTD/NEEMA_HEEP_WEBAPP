import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  ShieldAlert, Activity, Search, Filter, Download, 
  FileSpreadsheet, Printer, CheckCircle2, Clock, Eye, RefreshCw, 
  User, Shield, Lock, AlertTriangle, AlertCircle, FileText, ChevronRight,
  Database, Globe, Server, Check, X
} from 'lucide-react';
import { downloadExcel, downloadCSV, ColumnDef } from '../lib/excelReportExport';
import ReportModal from './ReportModal';

export interface AuditLogItem {
  id: string;
  user_email: string;
  user_name: string;
  user_role: string;
  action: string;
  module: string;
  details: string;
  ip_address: string;
  status: 'Success' | 'Failed' | 'Warning';
  created_at: string;
}

export const AuditLogsAdminModule: React.FC<{ showToast?: (msg: string) => void }> = ({
  showToast = (msg: string) => console.log(msg)
}) => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setLogs(data.map((d: any) => ({
          id: d.id,
          user_email: d.user_email || d.email || 'system@neemaheep.com',
          user_name: d.user_name || d.name || 'System Operator',
          user_role: d.user_role || d.role || 'Superadmin',
          action: d.action || d.event || 'System Event',
          module: d.module || d.category || 'System',
          details: d.details || d.description || '',
          ip_address: d.ip_address || '127.0.0.1',
          status: (d.status as any) || 'Success',
          created_at: d.created_at || new Date().toISOString()
        })));
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.warn("Notice fetching audit_logs from Supabase:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns: ColumnDef[] = [
    { key: 'created_at', label: 'Timestamp', type: 'date' },
    { key: 'user_name', label: 'User Name' },
    { key: 'user_email', label: 'User Email' },
    { key: 'user_role', label: 'Role' },
    { key: 'module', label: 'Module' },
    { key: 'action', label: 'Action Executed' },
    { key: 'details', label: 'Details' },
    { key: 'ip_address', label: 'IP Address' },
    { key: 'status', label: 'Status' }
  ];

  const filteredLogs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return logs.filter(item => {
      const matchesSearch = !q ||
        item.user_name.toLowerCase().includes(q) ||
        item.user_email.toLowerCase().includes(q) ||
        item.action.toLowerCase().includes(q) ||
        item.details.toLowerCase().includes(q) ||
        item.ip_address.includes(q);

      const matchesModule = moduleFilter === 'All' || item.module === moduleFilter;
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

      return matchesSearch && matchesModule && matchesStatus;
    });
  }, [logs, searchQuery, moduleFilter, statusFilter]);

  const summaryMetrics = useMemo(() => {
    return [
      { label: 'Total Events Logged', value: filteredLogs.length, color: '#074504' },
      { label: 'Security & Admin Events', value: logs.filter(l => l.module === 'Administration').length, color: '#C0991B' },
      { label: 'Warnings / Flagged', value: logs.filter(l => l.status === 'Warning' || l.status === 'Failed').length, color: '#dc2626' }
    ];
  }, [filteredLogs, logs]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#074504]/10 text-[#074504] uppercase">
                System Governance
              </span>
              <span className="text-xs font-bold text-gray-400">Administration &gt; Audit Logs</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 mt-1 flex items-center gap-2.5">
              <ShieldAlert className="w-6 h-6 text-[#074504]" />
              <span>Enterprise Audit Trail &amp; System Logs</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => downloadExcel('System_Audit_Logs', columns, filteredLogs)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Excel</span>
            </button>

            <button
              onClick={() => downloadCSV('System_Audit_Logs', columns, filteredLogs)}
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
              onClick={fetchLogs}
              className="p-2.5 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#074504]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, action, IP or details..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
            />
          </div>

          <div>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
            >
              <option value="All">All Modules</option>
              <option value="Administration">Administration</option>
              <option value="Blog Management">Blog Management</option>
              <option value="Lead and Inquiries">Lead and Inquiries</option>
              <option value="Applications & Subscriptions">Applications &amp; Subscriptions</option>
              <option value="Beneficiary Management">Beneficiary Management</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
            >
              <option value="All">All Severity / Statuses</option>
              <option value="Success">Success (Normal Audit)</option>
              <option value="Warning">Warning (Security Alerts)</option>
              <option value="Failed">Failed (Restricted / Blocked)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-500 uppercase tracking-wider">
                <th className="p-4">Timestamp</th>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Module</th>
                <th className="p-4">Action</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400 font-bold">
                    No audit records matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 font-mono text-[11px] text-gray-500">
                      {new Date(l.created_at).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{l.user_name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{l.user_email}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {l.user_role}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-[#074504]">{l.module}</td>
                    <td className="p-4 font-bold text-gray-800">{l.action}</td>
                    <td className="p-4 font-mono text-[11px] text-gray-500">{l.ip_address}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        l.status === 'Success' ? 'bg-emerald-100 text-emerald-800' :
                        l.status === 'Warning' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedLog(l)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-[#074504] hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 uppercase flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#074504]" />
                <span>Audit Event Record</span>
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl font-medium">
                <div><span className="text-gray-400 font-bold block text-[10px] uppercase">User</span> {selectedLog.user_name}</div>
                <div><span className="text-gray-400 font-bold block text-[10px] uppercase">Role</span> {selectedLog.user_role}</div>
                <div><span className="text-gray-400 font-bold block text-[10px] uppercase">Email</span> {selectedLog.user_email}</div>
                <div><span className="text-gray-400 font-bold block text-[10px] uppercase">IP Address</span> {selectedLog.ip_address}</div>
                <div><span className="text-gray-400 font-bold block text-[10px] uppercase">Module</span> {selectedLog.module}</div>
                <div><span className="text-gray-400 font-bold block text-[10px] uppercase">Timestamp</span> {new Date(selectedLog.created_at).toLocaleString()}</div>
              </div>

              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase mb-1">Action Description</span>
                <p className="text-gray-800 font-bold bg-gray-50 p-3 rounded-xl">{selectedLog.action}</p>
              </div>

              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase mb-1">Payload &amp; Audit Trace</span>
                <p className="text-gray-700 font-medium bg-gray-50 p-3 rounded-xl leading-relaxed">{selectedLog.details}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Enterprise System Governance Audit Trail Report"
        moduleName="Administration, Users & Permissions"
        submoduleName="Audit Logs"
        summaryMetrics={summaryMetrics}
        columns={columns}
        data={filteredLogs}
        filterDescription={`Module: ${moduleFilter} | Status: ${statusFilter} | Search: "${searchQuery || 'All'}"`}
      />

    </div>
  );
};

export default AuditLogsAdminModule;
