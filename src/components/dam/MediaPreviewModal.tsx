import React, { useState } from 'react';
import { 
  X, Download, Copy, Check, Crop, ExternalLink, 
  Info, Tag, Calendar, User, FileText, Music, Video, ShieldCheck 
} from 'lucide-react';
import { MediaItem } from '../../types/dam';

interface Props {
  media: MediaItem;
  onClose: () => void;
  onOpenEditor: (item: MediaItem) => void;
  onOpenAIAssistant: (item: MediaItem) => void;
}

export function MediaPreviewModal({ media, onClose, onOpenEditor, onOpenAIAssistant }: Props) {
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(media.src);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col md:flex-row max-h-[90vh]">
        {/* Preview Viewport */}
        <div className="md:w-2/3 bg-slate-950 p-6 flex items-center justify-center relative min-h-[320px]">
          {media.fileType === 'image' && (
            <img
              src={media.src}
              alt={media.displayName}
              className="max-h-[70vh] max-w-full object-contain shadow-2xl rounded-xl"
            />
          )}

          {media.fileType === 'video' && (
            <video
              src={media.src}
              controls
              className="max-h-[70vh] w-full rounded-xl shadow-2xl"
            />
          )}

          {media.fileType === 'audio' && (
            <div className="p-8 bg-slate-900 rounded-3xl border border-white/10 text-center space-y-4 w-full max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-[#074504] text-[#C0991B] flex items-center justify-center mx-auto shadow-md">
                <Music className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-extrabold text-white">{media.displayName}</h4>
              <audio src={media.src} controls className="w-full" />
            </div>
          )}

          {media.fileType === 'document' && (
            <div className="p-8 bg-slate-900 rounded-3xl border border-white/10 text-center space-y-4 w-full max-w-md text-white">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-extrabold">{media.displayName}</h4>
              <p className="text-xs text-gray-400 font-medium">Document Preview (.PDF)</p>
              <a
                href={media.src}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#074504] text-white font-extrabold text-xs rounded-xl inline-flex items-center gap-1.5"
              >
                Open Full Document <ExternalLink className="w-3.5 h-3.5 text-[#C0991B]" />
              </a>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="md:w-1/3 p-6 bg-white overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-black uppercase text-[#074504]">Quick Inspection</span>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-gray-900 leading-snug">{media.displayName}</h3>
              <p className="text-xs text-gray-500 font-medium italic">{media.metadata?.altText || 'No alt text'}</p>
            </div>

            <div className="space-y-2 text-xs font-medium text-gray-700 bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <div className="flex justify-between"><span>Format:</span><span className="font-bold uppercase">{media.extension}</span></div>
              <div className="flex justify-between"><span>Size:</span><span className="font-bold">{media.formattedSize}</span></div>
              <div className="flex justify-between"><span>Folder:</span><span className="font-bold">{media.folderName}</span></div>
              <div className="flex justify-between"><span>Uploaded:</span><span className="font-bold">{media.uploadDate}</span></div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenAIAssistant(media);
                }}
                className="p-2.5 bg-[#074504] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C0991B]" /> Metadata Inspector
              </button>

              {media.fileType === 'image' && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenEditor(media);
                  }}
                  className="p-2.5 bg-gray-100 text-gray-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1 hover:bg-gray-200 cursor-pointer"
                >
                  <Crop className="w-3.5 h-3.5 text-[#074504]" /> Canvas Editor
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleCopyUrl}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedUrl ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedUrl ? 'Copied' : 'Copy Direct URL'}</span>
            </button>

            <a
              href={media.src}
              download={media.filename}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-[#074504] hover:bg-[#053203] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer border border-[#C0991B]/40"
            >
              <Download className="w-4 h-4 text-[#C0991B]" /> Download File
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
