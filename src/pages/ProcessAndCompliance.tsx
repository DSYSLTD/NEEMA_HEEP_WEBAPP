import { useState } from 'react';
import { ArrowRight, Download, FileText } from 'lucide-react';
import ProvenProcess from '../components/ProvenProcess';
import { exportPdfReport } from '../lib/pdfPrintUtils';

export default function ProcessAndCompliance() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadProcessPdf = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDownloading(true);
    try {
      const processColumns = ['Step #', 'Stage / Milestone', 'Operational Mandate', 'Compliance & Risk Controls', 'Timeline'];
      const processRows = [
        ['01', 'Initial Registration & KYC', 'National ID verification, KRA PIN validation, physical residence mapping in Embu & Mt Kenya.', 'Full AML/CFT screening against Central Bank regulatory criteria.', '1-2 Working Days'],
        ['02', 'Group Formation / Appraisal', 'Orientation of 5-10 group members, cross-guarantee vetting, business site inspection.', 'Credit bureau (CRB) appraisal, debt-to-income stress testing.', '2-3 Working Days'],
        ['03', 'Financial Literacy Training', 'Mandatory 4-module coaching on bookkeeping, cash-flow budgeting, and emergency reserves.', 'Attendance certification and mutual savings pledge verification.', '1 Week (Parallel)'],
        ['04', 'Underwriting & Approval', 'Credit committee review, interest transparency disclosure under Kenya Microfinance Act.', 'Dual-level sign-off: Branch Credit Officer & Regional Risk Manager.', '24-48 Hours'],
        ['05', 'Cashless Disbursement', 'Direct disbursement via Safaricom M-PESA B2C integration or official bank transfer.', 'Biometric & SMS token OTP verification, automated transaction receipts.', 'Instant upon Approval'],
        ['06', 'Ongoing Mentorship & Monitoring', 'Bi-weekly field officer advisory visits, enterprise growth milestones, business clinics.', 'Social impact measurement and continuous risk monitoring.', 'Throughout Loan Term']
      ];

      await exportPdfReport({
        title: 'Institutional Operations, Process & Compliance Blueprint',
        subtitle: 'Official Guidelines for Group Microfinance, Individual Enterprise Credit, and AML/CFT Risk Protocols',
        columns: processColumns,
        rows: processRows,
        filename: 'Neema_HEEP_Process_and_Compliance_Manual.pdf',
        issuingDepartment: 'Operations & Legal Regulatory Compliance',
        summaryMetrics: [
          { label: 'Operational Steps', value: '6 Stages' },
          { label: 'Disbursement Method', value: '100% Cashless' },
          { label: 'Branch Coverage', value: '6 Branches' },
          { label: 'Regulatory Framework', value: 'CBK Compliant' }
        ],
        showSignatureBlock: true
      });
    } catch (err) {
      console.error('Failed to download process PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center w-full bg-[#f8faf8] font-sans">
      <section className="w-full bg-[#074504] text-white pt-24 pb-20 px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 justify-center mb-4">
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">PROVEN PROCESS &amp; STANDARDS</span>
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1] uppercase">
            HOW WE <span className="text-[#C0991B]">WORK</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Transparency, integrity, and strict regulatory compliance are the foundation of everything we do at Neema HEEP.
          </p>
        </div>
      </section>

      <ProvenProcess />
      
      <div className="w-full py-16 text-center">
        <button
          onClick={handleDownloadProcessPdf}
          disabled={isDownloading}
          className="inline-flex items-center gap-3 bg-[#C0991B] hover:bg-[#A38217] text-[#074504] px-9 py-4 rounded-full font-black text-sm uppercase tracking-wider transition-all shadow-[0_4px_14px_rgba(212,175,55,0.4)] hover:shadow-lg cursor-pointer disabled:opacity-50"
        >
          <FileText className="w-5 h-5 text-[#074504]" />
          <span>{isDownloading ? 'Generating Letterhead PDF...' : 'Download Official Process PDF'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
}
