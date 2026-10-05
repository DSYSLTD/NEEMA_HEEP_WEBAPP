import React from 'react';
import { X, Printer, Download, FileSpreadsheet, Building2, CheckCircle2, Calendar, ShieldCheck, Activity, FileText } from 'lucide-react';
import { ColumnDef, downloadExcel, downloadCSV } from '../lib/excelReportExport';

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  moduleName: string;
  submoduleName: string;
  generatedBy?: string;
  summaryMetrics?: { label: string; value: string | number; color?: string }[];
  columns: ColumnDef[];
  data: any[];
  filterDescription?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  title,
  moduleName,
  submoduleName,
  generatedBy = 'Neema Staff Administrator',
  summaryMetrics = [],
  columns,
  data,
  filterDescription
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    downloadExcel(`${submoduleName}_Report`, columns, data);
  };

  const handleExportCSV = () => {
    downloadCSV(`${submoduleName}_Report`, columns, data);
  };

  const reportDate = new Date().toLocaleDateString('en-KE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden print:p-0 print:border-none print:shadow-none print:max-w-none print:max-h-none print:fixed print:inset-0">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 px-6 bg-gray-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C0991B] flex items-center justify-center text-[#074504] font-black">
              NH
            </div>
            <div>
              <p className="text-xs font-black tracking-wide text-white uppercase">{moduleName} &gt; {submoduleName}</p>
              <p className="text-[10px] text-gray-400">Formal Management Audit Report &amp; Data Export</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-1.5 bg-[#074504] hover:bg-[#052d03] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-[#C0991B]/40"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#C0991B]" />
              <span>Excel (.xlsx)</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-[#C0991B] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/20"
            >
              <Download className="w-3.5 h-3.5 text-[#C0991B]" />
              <span>CSV (.csv)</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
          
          {/* Institutional Letterhead Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#074504] pb-5 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#074504] flex items-center justify-center text-[#C0991B] font-black text-xl shadow-md">
                NH
              </div>
              <div>
                <h2 className="text-lg font-black text-[#074504] uppercase tracking-wide">
                  NEEMA HEEP MICROFINANCE
                </h2>
                <p className="text-xs font-bold text-gray-600">Enterprise Operations &amp; CMS Management Reporting System</p>
                <p className="text-[10px] text-gray-400">Currency Standard: Kenyan Shillings (Kshs) • Regional Headquarters: Embu / Mount Kenya</p>
              </div>
            </div>
            <div className="sm:text-right text-xs text-gray-500 font-medium">
              <p><strong className="text-gray-900 font-bold">Report:</strong> {title}</p>
              <p><strong className="text-gray-900 font-bold">Generated:</strong> {reportDate}</p>
              <p><strong className="text-gray-900 font-bold">Officer:</strong> {generatedBy}</p>
              {filterDescription && (
                <p className="text-[11px] text-[#074504] font-bold mt-0.5">Filter: {filterDescription}</p>
              )}
            </div>
          </div>

          {/* KPI Summary Cards */}
          {summaryMetrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {summaryMetrics.map((metric, idx) => (
                <div key={idx} className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-1">
                    {metric.label}
                  </span>
                  <div className={`text-xl font-black ${metric.color || 'text-[#074504]'}`}>
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Data Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-[#074504] text-white uppercase text-[10px] font-black tracking-wider">
                  <tr>
                    <th className="py-3 px-3.5 w-10 text-center">#</th>
                    {columns.map((col, idx) => (
                      <th key={idx} className="py-3 px-3.5 whitespace-nowrap">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="py-8 text-center text-gray-400 italic">
                        No corresponding records match the selected filter criteria.
                      </td>
                    </tr>
                  ) : (
                    data.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-gray-50/80 transition-colors odd:bg-white even:bg-gray-50/30">
                        <td className="py-2.5 px-3.5 text-center text-gray-400 font-mono text-[10px]">
                          {rowIdx + 1}
                        </td>
                        {columns.map((col, cIdx) => {
                          const val = row[col.key];
                          return (
                            <td key={cIdx} className="py-2.5 px-3.5 whitespace-nowrap max-w-[240px] truncate text-gray-800">
                              {val === null || val === undefined ? '—' : typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Sign-off (Especially visible on prints) */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-gray-400 gap-2">
            <p>Certified Management Extract • Confidential Enterprise Data • Neema HEEP Microfinance</p>
            <p>Total Records Extracted: <strong className="text-gray-900 font-bold">{data.length}</strong></p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ReportModal;
