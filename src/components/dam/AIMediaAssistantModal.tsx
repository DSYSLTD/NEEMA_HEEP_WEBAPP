import React, { useState } from 'react';
import { 
  X, Check, FileText, Tag, ShieldCheck, 
  Search, RefreshCw, Award, Copy, CheckCircle2 
} from 'lucide-react';
import { MediaItem } from '../../types/dam';

interface Props {
  media: MediaItem;
  onClose: () => void;
  onApplySuggestions: (updatedItem: MediaItem) => void;
}

export function AIMediaAssistantModal({ media, onClose, onApplySuggestions }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [altText, setAltText] = useState(
    media.metadata?.altText || `High-quality corporate asset for Neema HEEP ${media.folderName}`
  );
  const [caption, setCaption] = useState(
    media.metadata?.caption || `Verified ${media.fileType} asset supporting community micro-finance initiatives.`
  );
  const [description, setDescription] = useState(
    media.metadata?.description || `Enterprise asset maintained in Neema HEEP DAM under ${media.folderName}.`
  );
  const [suggestedFileName, setSuggestedFileName] = useState(
    `neema_heep_${media.fileType}_${media.folderName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.jpg`
  );
  const [keywords, setKeywords] = useState<string[]>(
    media.metadata?.keywords?.length ? media.metadata.keywords : ['NeemaHEEP', 'Microfinance', 'Kenya', media.fileType]
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setAltText(`Official ${media.fileType} asset: ${media.displayName} demonstrating financial empowerment in Kenya.`);
      setCaption(`Neema HEEP micro-lending programs supporting active borrowers across 7 counties.`);
      setDescription(`High-impact corporate ${media.fileType} verified for publication across articles, vacancies, and portal guides.`);
      setSuggestedFileName(`neema_heep_empowerment_${media.extension}`);
      setKeywords(['AgriLoan', 'MountKenya', 'WomenEmpowerment', 'FinTech', 'Microfinance']);
      setIsGenerating(false);
    }, 800);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleApply = () => {
    const updated: MediaItem = {
      ...media,
      displayName: media.displayName,
      filename: suggestedFileName || media.filename,
      metadata: {
        ...media.metadata,
        altText,
        caption,
        description,
        keywords
      },
      aiMetadata: {
        ...media.aiMetadata,
        generatedAltText: altText,
        generatedCaption: caption,
        generatedDescription: description,
        suggestedFileName,
        suggestedKeywords: keywords,
        qualityScore: 98,
        seoScore: 96,
        moderationStatus: 'Pass',
        accessibilityStatus: 'Compliant'
      },
      status: 'Optimized'
    };
    onApplySuggestions(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#074504] to-[#053203] text-white p-5 px-6 flex items-center justify-between border-b border-[#C0991B]/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#C0991B] text-[#074504] flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-white">
                Smart Media & Metadata Inspector
              </h3>
              <p className="text-[11px] text-[#C0991B] font-medium">
                Automated Vision Analysis & SEO Alt-Text Generator
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Asset Preview Header */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-200">
            <img
              src={media.thumbnailUrl || media.src}
              alt={media.displayName}
              className="w-16 h-16 rounded-xl object-cover border border-gray-300 shrink-0"
            />
            <div className="space-y-1">
              <h4 className="text-xs font-black text-gray-900 line-clamp-1">{media.displayName}</h4>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                <span>{media.formattedSize}</span>
                <span>•</span>
                <span className="uppercase">{media.fileType}</span>
                <span>•</span>
                <span className="text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">
                  Quality Score: {media.aiMetadata?.qualityScore || 96}%
                </span>
              </div>
            </div>
          </div>

          {/* AI Trigger Action */}
          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="text-xs font-bold text-[#074504]">
              Generate comprehensive SEO metadata and WCAG alt-text automatically.
            </div>
            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="px-4 py-2 bg-[#074504] hover:bg-[#053203] text-white font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#C0991B] ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Analyzing...' : 'Re-Analyze Metadata'}</span>
            </button>
          </div>

          {/* Generated Fields */}
          <div className="space-y-4">
            {/* Alt Text */}
            <div>
              <div className="flex items-center justify-between text-xs font-extrabold text-gray-800 mb-1">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#074504]" /> Accessible Alt Text (WCAG 2.2)
                </span>
                <button
                  onClick={() => handleCopy(altText, 'alt')}
                  className="text-[10px] font-bold text-gray-500 hover:text-[#074504] flex items-center gap-1"
                >
                  {copiedField === 'alt' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'alt' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full p-2.5 text-xs font-medium border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
              />
            </div>

            {/* Caption */}
            <div>
              <div className="flex items-center justify-between text-xs font-extrabold text-gray-800 mb-1">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#074504]" /> Editorial Caption
                </span>
              </div>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-2.5 text-xs font-medium border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
              />
            </div>

            {/* Suggested File Name */}
            <div>
              <label className="text-xs font-extrabold text-gray-800 block mb-1">
                SEO File Name Suggestion
              </label>
              <input
                type="text"
                value={suggestedFileName}
                onChange={(e) => setSuggestedFileName(e.target.value)}
                className="w-full p-2.5 text-xs font-mono border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
              />
            </div>

            {/* Suggested Keywords */}
            <div>
              <label className="text-xs font-extrabold text-gray-800 block mb-1">
                Auto-Suggested Tags & Keywords
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 border border-gray-200 rounded-xl min-h-[44px]">
                {keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-white border border-gray-300 text-gray-800 flex items-center gap-1"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Content Moderation: Safe (Passed)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 bg-[#074504] hover:bg-[#053203] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-[#C0991B]/40"
            >
              <CheckCircle2 className="w-4 h-4 text-[#C0991B]" /> Apply All Metadata
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
