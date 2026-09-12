import React, { useState } from 'react';
import { 
  FileCheck, Image as ImageIcon, Video, Music, FileText, 
  Archive, ChevronDown, ChevronUp, ShieldCheck 
} from 'lucide-react';

export function SupportedFileTypesBanner() {
  const [expanded, setExpanded] = useState(false);

  const categories = [
    {
      title: 'Images',
      icon: ImageIcon,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      extensions: ['JPG', 'JPEG', 'PNG', 'GIF', 'SVG', 'WEBP', 'AVIF', 'BMP', 'TIFF', 'ICO']
    },
    {
      title: 'Video',
      icon: Video,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
      extensions: ['MP4', 'MOV', 'AVI', 'MKV', 'WEBM', 'MPEG']
    },
    {
      title: 'Audio',
      icon: Music,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      extensions: ['MP3', 'WAV', 'AAC', 'OGG', 'FLAC']
    },
    {
      title: 'Documents',
      icon: FileText,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      extensions: ['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'CSV', 'PPT', 'PPTX', 'TXT', 'RTF', 'ODT', 'ODS']
    },
    {
      title: 'Archives',
      icon: Archive,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      extensions: ['ZIP', 'RAR', '7Z', 'TAR', 'GZIP']
    }
  ];

  return (
    <div className="bg-gradient-to-r from-[#074504]/5 via-[#C0991B]/10 to-emerald-50 rounded-2xl border border-[#074504]/20 p-4 transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#074504] text-[#C0991B] flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide flex items-center gap-2">
              <span>Universal Enterprise Asset Compatibility</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#C0991B] text-[#074504]">
                38+ Formats
              </span>
            </h4>
            <p className="text-[11px] text-gray-600 font-medium">
              Neema HEEP DAM supports full auto-optimization, security scanning, and WebP/AVIF compression for all corporate media formats.
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-[11px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1 shrink-0 transition-all cursor-pointer"
        >
          <span>{expanded ? 'Hide Formats' : 'View All Supported Formats'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-3 border-t border-[#074504]/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 animate-in fade-in duration-200">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className={`p-3 rounded-xl border ${cat.color} space-y-1.5`}>
                <div className="flex items-center gap-1.5 font-extrabold text-xs">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.title}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {cat.extensions.map((ext) => (
                    <span
                      key={ext}
                      className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-white/80 border border-black/5 text-gray-800"
                    >
                      .{ext}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
