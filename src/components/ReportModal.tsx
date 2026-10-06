import React, { useState } from 'react';
import { X, Printer, Download, FileSpreadsheet, Building2, CheckCircle2, Calendar, ShieldCheck, Activity, FileText } from 'lucide-react';
import { ColumnDef, downloadExcel, downloadCSV } from '../lib/excelReportExport';
import { exportPdfReport, generateInstitutionalRef } from '../lib/pdfPrintUtils';

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
  const [isExportingPdf, setIsExportingPdf] = useState(false);

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

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      const colLabels = columns.map(c => c.label);
      const rowValues = data.map((row, idx) => {
        return columns.map(c => {
          const val = row[c.key];
          return val === null || val === undefined ? '—' : typeof val === 'object' ? JSON.stringify(val) : String(val);
        });
      });

      await exportPdfReport({
        title: title,
        subtitle: filterDescription ? `Scope Filter: ${filterDescription}` : `${moduleName} > ${submoduleName} Management Extract`,
        columns: colLabels,
        rows: rowValues,
        filename: `Neema_HEEP_${submoduleName.replace(/\s+/g, '_')}_Official_Report.pdf`,
        summaryMetrics: summaryMetrics,
        issuingDepartment: `${moduleName} Management`,
        showSignatureBlock: true
      });
    } catch (err) {
      console.error('Error generating letterhead PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const reportDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const refNumber = generateInstitutionalRef('NH-DOC');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden print:p-0 print:border-none print:shadow-none print:max-w-none print:max-h-none print:fixed print:inset-0 print:rounded-none">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-3 sm:p-4 px-4 sm:px-6 bg-[#074504] text-white flex flex-wrap items-center justify-between gap-3 print:hidden border-b-2 border-[#C0991B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white p-0.5 border border-[#C0991B] flex items-center justify-center shrink-0">
              <img
                src="/header_logo.jpeg"
                alt="Logo"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/NEEMA HEEP LOGO.jpeg';
                }}
              />
            </div>
            <div>
              <p className="text-xs font-black tracking-wide text-white uppercase">{moduleName} &gt; {submoduleName}</p>
              <p className="text-[10px] text-[#C0991B] font-bold">Official Neema HEEP Letterhead Report &amp; Data Export</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="px-3 py-1.5 bg-[#053203] hover:bg-[#042402] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-[#C0991B]/40"
              title="Download Excel Spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#C0991B]" />
              <span className="hidden sm:inline">Excel</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#C0991B] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/20"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#C0991B]" />
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-3.5 py-1.5 bg-[#C0991B] hover:bg-[#a98514] text-[#074504] rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              title="Download Letterhead PDF Document"
            >
              <Download className="w-3.5 h-3.5 text-[#074504]" />
              <span>{isExportingPdf ? 'Generating...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/20"
              title="Print Letterhead Document"
            >
              <Printer className="w-3.5 h-3.5 text-[#C0991B]" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-xl text-white/80 hover:text-white transition-all cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-4 sm:p-8 flex-1 overflow-y-auto space-y-5 bg-white print:p-6 print:overflow-visible">
          
          {/* Top Decorative Border for Print / Screen */}
          <div className="h-1.5 bg-[#074504] border-b border-[#C0991B] -mx-4 sm:-mx-8 -mt-4 sm:-mt-8 mb-4 print:hidden" />

          {/* ============================================================================== */}
          {/* OFFICIAL INSTITUTIONAL LETTERHEAD HEADER                                       */}
          {/* ============================================================================== */}
          <div className="border-b-2 border-[#074504] pb-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              
              {/* Brand Emblem & Corporate Names */}
              <div className="flex items-start gap-3.5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 border-2 border-[#C0991B] shadow-sm shrink-0 flex items-center justify-center">
                  <img
                    src="/header_logo.jpeg"
                    alt="Neema HEEP Logo"
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/NEEMA HEEP LOGO.jpeg';
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#074504] uppercase tracking-tight leading-none">
                    NEEMA HEEP MICROFINANCE
                  </h1>
                  <h2 className="text-xs sm:text-sm font-black text-[#C0991B] uppercase tracking-wider mt-1">
                    HOUSING &amp; ECONOMIC EMPOWERMENT PROGRAMME
                  </h2>
                  <p className="text-xs italic text-gray-600 font-medium mt-0.5">
                    &ldquo;Empowering Communities &bull; Transforming Livelihoods&rdquo;
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">
                    Reg. No. CPR/2014/149811 &bull; Licensed Microfinance Institution
                  </p>
                </div>
              </div>

              {/* Headquarters & Contact Details */}
              <div className="text-left sm:text-right text-xs text-gray-600 space-y-0.5 font-medium border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                <p className="font-black text-gray-900 text-xs uppercase">
                  HEAD OFFICE: Neema Plaza, 3rd Floor
                </p>
                <p>Mama Ngina Street, P.O. Box 2487 - 60100, Embu, Kenya</p>
                <p>Hotline: <strong className="text-gray-900">+254 705 759 365</strong> &bull; +254 722 000 000</p>
                <p>Email: <a href="mailto:info@neemaheep.com" className="text-[#074504] font-bold hover:underline">info@neemaheep.com</a> &bull; Web: <a href="https://www.neemaheep.com" className="text-[#074504] font-bold hover:underline">www.neemaheep.com</a></p>
              </div>

            </div>

            {/* Gold Divider Line */}
            <div className="h-0.5 bg-[#C0991B] mt-3" />

            {/* Branch Network Sub-banner */}
            <div className="bg-[#f8faf8] border border-gray-200 rounded-lg py-1 px-3 mt-2 text-center text-[10px] sm:text-[11px] font-black text-[#074504] uppercase tracking-wider">
              BRANCH NETWORK: EMBU HEADQUARTERS &bull; MAUA &bull; MERU &bull; CHUKA &bull; KERUGOYA &bull; KITUI
            </div>
          </div>

          {/* ============================================================================== */}
          {/* DOCUMENT TITLE & METADATA CONTROL BLOCK                                        */}
          {/* ============================================================================== */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#074504] uppercase tracking-wide">
                  {title}
                </h3>
                {filterDescription ? (
                  <p className="text-xs text-gray-600 italic">Filter Scope: <span className="font-bold text-[#074504]">{filterDescription}</span></p>
                ) : (
                  <p className="text-xs text-gray-600 italic">{moduleName} &gt; {submoduleName} Administrative Record</p>
                )}
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-right shrink-0">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Document Reference</p>
                <p className="text-xs font-mono font-black text-[#074504]">{refNumber}</p>
              </div>
            </div>

            {/* Meta Control Strip */}
            <div className="bg-gray-100/80 rounded-xl p-2.5 px-3 flex flex-wrap items-center justify-between text-[11px] font-bold text-gray-700 gap-2">
              <div><span className="text-gray-500 font-normal">Department:</span> {moduleName}</div>
              <div><span className="text-gray-500 font-normal">Issued By:</span> {generatedBy}</div>
              <div><span className="text-gray-500 font-normal">Date Issued:</span> {reportDate}</div>
              <div className="text-[#074504] font-black">CLASSIFICATION: OFFICIAL &amp; CONFIDENTIAL</div>
            </div>
          </div>

          {/* KPI Summary Cards */}
          {summaryMetrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {summaryMetrics.map((metric, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 border-t-3 border-t-[#074504] shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-0.5">
                    {metric.label}
                  </span>
                  <div className={`text-lg font-black ${metric.color || 'text-[#074504]'}`}>
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
                <thead className="bg-[#074504] text-[#C0991B] uppercase text-[10px] font-black tracking-wider">
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
                      <tr key={rowIdx} className="hover:bg-gray-50/80 transition-colors odd:bg-white even:bg-[#f8faf8]">
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

          {/* ============================================================================== */}
          {/* EXECUTIVE SIGN-OFF & CIRCULAR VERIFICATION SEAL (Visible in Print & Modal)       */}
          {/* ============================================================================== */}
          <div className="pt-6 border-t-2 border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6 print:pt-4">
            
            {/* Signatory 1 */}
            <div className="w-full sm:w-1/3 text-left">
              <div className="h-10 border-b border-gray-400 flex items-end pb-1 font-signature text-gray-500 text-xs italic">
                Authorized Signatory
              </div>
              <p className="text-[11px] font-black text-[#074504] uppercase mt-1">Managing Director / Credit Controller</p>
              <p className="text-[10px] text-gray-500">Neema HEEP Executive Management</p>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">Date: {reportDate.split(',')[0]}</p>
            </div>

            {/* Official Circular Seal */}
            <div className="shrink-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-2 border-double border-[#074504] ring-2 ring-[#C0991B] bg-[#C0991B]/5 flex flex-col items-center justify-center p-1 text-center -rotate-3 select-none">
                <span className="text-[8px] font-black text-[#074504] tracking-wider uppercase">NEEMA HEEP</span>
                <span className="text-[6.5px] font-extrabold text-[#C0991B] border-y border-[#C0991B] my-0.5 px-1 uppercase tracking-widest w-full">★ OFFICIAL SEAL ★</span>
                <span className="text-[7px] font-black text-[#074504] uppercase">EMBU HQ VERIFIED</span>
                <span className="text-[6px] text-gray-500 font-mono mt-0.5">{new Date().getFullYear()} AUDITED</span>
              </div>
            </div>

            {/* Signatory 2 */}
            <div className="w-full sm:w-1/3 text-left sm:text-right">
              <div className="h-10 border-b border-gray-400 flex items-end justify-start sm:justify-end pb-1 font-signature text-gray-500 text-xs italic">
                Compliance Officer
              </div>
              <p className="text-[11px] font-black text-[#074504] uppercase mt-1">Internal Audit &amp; Compliance</p>
              <p className="text-[10px] text-gray-500">Board Audit Committee Representative</p>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">Status: Verified &amp; Extracted</p>
            </div>

          </div>

          {/* Legal Footer Notice */}
          <div className="pt-3 border-t border-gray-200 text-center text-[9px] text-gray-400 space-y-0.5">
            <p className="font-medium text-gray-500">
              Neema HEEP Microfinance &bull; Neema Plaza, 3rd Floor, Mama Ngina Street, Embu &bull; Tel: 0705 759 365 &bull; Email: info@neemaheep.com
            </p>
            <p>
              This report is a certified extract from the Neema HEEP Microfinance enterprise system. Total Records: <strong className="text-gray-900 font-bold">{data.length}</strong>. Any unauthorized alteration or reproduction is strictly prohibited.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ReportModal;
