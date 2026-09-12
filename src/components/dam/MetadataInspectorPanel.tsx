import React, { useState } from 'react';
import { 
  X, Tag, Calendar, User, Eye, Download, Copy, 
  ExternalLink, Crop, Trash2, Check, ShieldCheck, 
  Building2, FileText, Share2, Info 
} from 'lucide-react';
import { MediaItem } from '../../types/dam';

interface Props {
  media: MediaItem;
  onClose: () => void;
  onEditImage: (item: MediaItem) => void;
  onOpenAIAssistant: (item: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
  onUpdateMetadata: (updated: MediaItem) => void;
}

export function MetadataInspectorPanel({
  media,
  onClose,
  onEditImage,
  onOpenAIAssistant,
  onDeleteMedia,
  onUpdateMetadata
}: Props) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form States
  const [displayName, setDisplayName] = useState(media.displayName);
  const [altText, setAltText] = useState(media.metadata?.altText || '');
  const [caption, setCaption] = useState(media.metadata?.caption || '');
  const [description, setDescription] = useState(media.metadata?.description || '');
  const [copyright, setCopyright] = useState(media.metadata?.copyright || '© 2026 Neema HEEP Microfinance Ltd.');
  const [photographer, setPhotographer] = useState(media.metadata?.photographer || media.uploadedBy);
  const [license, setLicense] = useState(media.metadata?.license || 'Proprietary - Neema HEEP');

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(media.src);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSaveMetadata = () => {
    const updatedItem: MediaItem = {
      ...media,
      displayName,
      metadata: {
        ...media.metadata,
        displayName,
        altText,
        caption,
        description,
        copyright,
        photographer,
        license
      }
    };
    onUpdateMetadata(updatedItem);
    setIsEditing(false);
  };

  return (
    <div className="w-full lg:w-96 bg-white border-l border-gray-200 h-full overflow-y-auto flex flex-col justify-between shadow-lg animate-in slide-in-from-right duration-200">
      {/* Top Header */}
      <div className="p-4 px-5 bg-[#074504] text-white flex items-center justify-between border-b border-[#C0991B]/30 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#C0991B]" />
          <h3 className="text-xs font-black uppercase tracking-wider text-white">
            Asset Metadata & Usage
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-5 space-y-6 flex-1">
        {/* Preview Container */}
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-900 group max-h-56 flex items-center justify-center">
            <img
              src={media.thumbnailUrl || media.src}
              alt={media.displayName}
              className="max-h-56 w-auto object-contain"
            />
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black text-white uppercase">
              {media.extension}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-gray-700">
            <span>{media.formattedSize}</span>
            {media.dimensions && (
              <span>{media.dimensions.width} × {media.dimensions.height} px</span>
            )}
            <span className="text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">
              {media.status}
            </span>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenAIAssistant(media)}
            className="p-2.5 bg-gradient-to-r from-[#074504] to-[#053203] text-white text-xs font-extrabold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 border border-[#C0991B]/40 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C0991B]" /> Auto Metadata
          </button>

          {media.fileType === 'image' && (
            <button
              onClick={() => onEditImage(media)}
              className="p-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Crop className="w-3.5 h-3.5 text-[#074504]" /> Canvas Editor
            </button>
          )}
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyUrl}
            className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUrl ? 'URL Copied' : 'Copy URL'}</span>
          </button>

          <a
            href={media.src}
            download={media.filename}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Metadata Fields Section */}
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">
              Detailed Metadata
            </h4>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-extrabold text-[#074504] hover:underline cursor-pointer"
            >
              {isEditing ? 'Cancel' : 'Edit Metadata'}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#074504]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Alt Text (Accessibility)</label>
                <textarea
                  rows={2}
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#074504]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Caption</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#074504]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#074504]"
                />
              </div>

              <button
                onClick={handleSaveMetadata}
                className="w-full py-2 bg-[#074504] text-white text-xs font-extrabold rounded-xl hover:bg-[#053203] transition-all cursor-pointer"
              >
                Save Metadata Changes
              </button>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Display Name</span>
                <span className="font-extrabold text-gray-900">{media.displayName}</span>
              </div>

              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Alt Text</span>
                <p className="font-medium text-gray-700 italic">
                  {media.metadata?.altText || 'No alt text set.'}
                </p>
              </div>

              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Caption</span>
                <p className="font-medium text-gray-700">
                  {media.metadata?.caption || 'No caption set.'}
                </p>
              </div>

              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Keywords / Tags</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {media.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-gray-400 font-bold block text-[10px] uppercase">Copyright & License</span>
                <span className="font-bold text-gray-800 block">{media.metadata?.copyright}</span>
                <span className="text-gray-500 text-[10px]">{media.metadata?.license}</span>
              </div>
            </div>
          )}
        </div>

        {/* Usage Locations Breakdown */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">
              CMS Usage Index ({media.usageCount})
            </h4>
          </div>

          {media.usageLocations.length > 0 ? (
            <div className="space-y-2">
              {media.usageLocations.map((loc) => (
                <div key={loc.id} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-gray-900">
                    <span className="truncate">{loc.title}</span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-[#074504]/10 text-[#074504]">
                      {loc.type}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">{loc.url}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 font-bold">
              Unused Asset: This media is not linked to any active blog post or page.
            </div>
          )}
        </div>
      </div>

      {/* Footer Soft Delete */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => {
            onDeleteMedia(media.id);
            onClose();
          }}
          className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl transition-all border border-rose-200 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Move Asset to Trash
        </button>
      </div>
    </div>
  );
}
