import React, { useState } from 'react';
import { FileText, CheckCircle2, AlertCircle, Info, ShieldCheck, Camera, FileCheck, ArrowRight, HelpCircle } from 'lucide-react';

export interface RequiredDocumentItem {
  name: string;
  description: string;
  acceptedFormats: string;
  maxSize: string;
  required: boolean;
  sampleTip?: string;
}

interface UploadRequirementsNoticeProps {
  title?: string;
  subtitle?: string;
  formType: 'registration' | 'job_application' | 'sponsorship' | 'general';
  documents: RequiredDocumentItem[];
  onAcknowledge?: () => void;
  acknowledged?: boolean;
  setAcknowledged?: (val: boolean) => void;
  compact?: boolean;
}

export default function UploadRequirementsNotice({
  title = "Important: Document & Upload Requirements",
  subtitle = "Please ensure you have the following documents ready on your device before commencing step one.",
  formType,
  documents,
  onAcknowledge,
  acknowledged,
  setAcknowledged,
  compact = false
}: UploadRequirementsNoticeProps) {
  const [internalAck, setInternalAck] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const isAck = acknowledged !== undefined ? acknowledged : internalAck;
  const handleToggleAck = (checked: boolean) => {
    if (setAcknowledged) {
      setAcknowledged(checked);
    } else {
      setInternalAck(checked);
    }
    if (checked && onAcknowledge) {
      onAcknowledge();
    }
  };

  return (
    <div className={`rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/40 p-6 md:p-8 shadow-sm space-y-6 ${compact ? 'text-xs' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-amber-100 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                Pre-Application Notice
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Before Step 1
              </span>
            </div>
            <h3 className="text-base md:text-lg font-black text-[#074504] uppercase tracking-tight mt-1">
              {title}
            </h3>
            <p className="text-xs text-gray-600 font-medium mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTips(!showTips)}
          className="text-[11px] font-black text-[#074504] hover:text-[#599200] flex items-center gap-1.5 shrink-0 bg-white px-3 py-1.5 rounded-xl border border-gray-200 hover:border-[#074504] transition-all cursor-pointer shadow-2xs"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#C0991B]" />
          <span>{showTips ? 'Hide Tips' : 'Photo / Scan Tips'}</span>
        </button>
      </div>

      {/* Helpful Mobile Camera & Scanning Tips */}
      {showTips && (
        <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-100 text-xs text-emerald-900 space-y-2 animate-in fade-in duration-200">
          <div className="font-bold flex items-center gap-2 text-[#074504]">
            <Camera className="w-4 h-4 text-[#599200]" />
            <span>Best Practices for Uploading Clear Documents:</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-gray-700 font-medium pl-6 list-disc">
            <li>Place your document on a flat, dark or contrasting surface.</li>
            <li>Capture under bright natural daylight to avoid shadows or flash glare.</li>
            <li>Ensure all 4 corners of the document are visible without fingers covering text.</li>
            <li>PDF documents or clear JPEG/PNG camera images are accepted.</li>
          </ul>
        </div>
      )}

      {/* Documents Grid */}
      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#074504]">
          Documents Expected for This Process:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs hover:border-[#599200]/40 transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#074504] flex items-center justify-center text-xs font-black shrink-0">
                    {idx + 1}
                  </div>
                  <h4 className="text-xs font-black text-gray-900 leading-tight">
                    {doc.name}
                  </h4>
                </div>
                {doc.required ? (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-red-50 text-red-700 px-2 py-0.5 rounded-full shrink-0">
                    Mandatory
                  </span>
                ) : (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full shrink-0">
                    Optional
                  </span>
                )}
              </div>

              <p className="text-[11px] text-gray-600 font-medium leading-relaxed pl-8">
                {doc.description}
              </p>

              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold border-t border-gray-50 pt-2 pl-8">
                <span>Format: {doc.acceptedFormats}</span>
                <span>Max: {doc.maxSize}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification & Privacy Assurance */}
      <div className="flex items-center gap-3 bg-white/80 p-3.5 rounded-2xl border border-gray-100 text-[11px] text-gray-600 font-medium">
        <ShieldCheck className="w-5 h-5 text-[#599200] shrink-0" />
        <span>
          <strong>Data Protection Notice:</strong> Uploaded identification and supporting documents are strictly encrypted and processed in compliance with the <strong>Kenyan Data Protection Act, 2019</strong>.
        </span>
      </div>

      {/* Applicant Acknowledgement Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-amber-200 cursor-pointer hover:bg-amber-50/40 transition-colors group">
          <input
            type="checkbox"
            checked={isAck}
            onChange={(e) => handleToggleAck(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-[#074504] focus:ring-[#599200] border-gray-300 cursor-pointer"
          />
          <span className="text-xs font-bold text-gray-800 leading-snug group-hover:text-[#074504]">
            I have confirmed the list above and have all required documents ready on my device to proceed with the application.
          </span>
        </label>
      </div>
    </div>
  );
}
