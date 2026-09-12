import React, { useState } from 'react';
import { 
  X, Check, Search, Filter, Image as ImageIcon, 
  UploadCloud, Folder 
} from 'lucide-react';
import { damStore } from '../../lib/damStore';
import { MediaItem } from '../../types/dam';

interface Props {
  onClose: () => void;
  onSelectMedia: (item: MediaItem) => void;
  filterType?: 'image' | 'video' | 'audio' | 'document' | 'archive';
  title?: string;
}

export function MediaPickerModal({ onClose, onSelectMedia, filterType, title = 'Select Asset from DAM Library' }: Props) {
  const media = damStore.getMedia();
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const folders = damStore.getFolders();

  const filtered = media.filter((item) => {
    if (filterType && item.fileType !== filterType) return false;
    if (selectedFolder !== 'all' && item.folderId !== selectedFolder) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.displayName.toLowerCase().includes(q) ||
        item.filename.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-gray-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#074504] text-white p-4 px-6 flex items-center justify-between border-b border-[#C0991B]/30">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#C0991B]" />
            <h3 className="text-sm font-black uppercase tracking-wide text-white">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Folder Controls */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
            />
          </div>

          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="p-2 text-xs font-bold border border-gray-200 rounded-xl bg-white"
          >
            <option value="all">All Folders</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        {/* Media Grid */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectMedia(item);
                onClose();
              }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:border-[#074504] hover:ring-2 hover:ring-[#074504] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="h-32 bg-gray-900 overflow-hidden relative flex items-center justify-center">
                <img
                  src={item.thumbnailUrl || item.src}
                  alt={item.displayName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="p-3">
                <h4 className="text-xs font-bold text-gray-900 truncate">{item.displayName}</h4>
                <div className="text-[10px] text-gray-500 font-mono mt-0.5">{item.formattedSize}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
