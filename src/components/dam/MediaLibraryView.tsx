import React, { useState, useEffect } from 'react';
import { 
  Grid, List, LayoutGrid, Image as ImageIcon, Calendar, 
  Search, Filter, ArrowUpDown, CheckSquare, Square, 
  Eye, Crop, Download, Copy, Trash2, Tag, 
  Folder, MoreVertical, Check, ShieldCheck, Maximize2, Clock 
} from 'lucide-react';
import { damStore } from '../../lib/damStore';
import { MediaItem, ViewMode, MediaType } from '../../types/dam';
import { BrandedEmptyState } from './BrandedEmptyState';

interface Props {
  folderId?: string;
  collectionId?: string;
  isRecentlyAdded?: boolean;
  onPreviewMedia: (item: MediaItem) => void;
  onInspectMedia: (item: MediaItem) => void;
  onEditImage: (item: MediaItem) => void;
  onOpenAIAssistant: (item: MediaItem) => void;
  onRefreshMedia: () => void;
}

export function MediaLibraryView({
  folderId,
  collectionId,
  isRecentlyAdded = false,
  onPreviewMedia,
  onInspectMedia,
  onEditImage,
  onOpenAIAssistant,
  onRefreshMedia
}: Props) {
  const allMedia = damStore.getMedia();

  // State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size' | 'usage'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Keyboard navigation
  const [activeFocusedIndex, setActiveFocusedIndex] = useState<number>(0);

  // Filtering
  const filteredMedia = allMedia.filter((item) => {
    if (folderId && item.folderId !== folderId) return false;
    if (collectionId && !item.collectionIds.includes(collectionId)) return false;

    if (selectedType !== 'all') {
      if (selectedType === 'missing_alt' && item.metadata?.altText) return false;
      if (selectedType === 'unused' && item.usageCount > 0) return false;
      if (['image', 'video', 'audio', 'document', 'archive'].includes(selectedType) && item.fileType !== selectedType) {
        return false;
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = item.displayName.toLowerCase().includes(q) || item.filename.toLowerCase().includes(q);
      const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
      const matchFolder = item.folderName.toLowerCase().includes(q);
      const matchAlt = item.metadata?.altText?.toLowerCase().includes(q);
      return matchName || matchTag || matchFolder || matchAlt;
    }

    return true;
  });

  // Sorting
  const sortedMedia = [...filteredMedia].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'name') cmp = a.displayName.localeCompare(b.displayName);
    else if (sortBy === 'size') cmp = a.size - b.size;
    else if (sortBy === 'usage') cmp = a.usageCount - b.usageCount;
    else cmp = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();

    return sortOrder === 'desc' ? -cmp : cmp;
  });

  // Keyboard Navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sortedMedia.length) return;

      if (e.key === 'ArrowRight') {
        setActiveFocusedIndex((prev) => Math.min(sortedMedia.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveFocusedIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Enter') {
        if (sortedMedia[activeFocusedIndex]) {
          onPreviewMedia(sortedMedia[activeFocusedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sortedMedia, activeFocusedIndex, onPreviewMedia]);

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === sortedMedia.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedMedia.map((m) => m.id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Move ${selectedIds.length} assets to trash?`)) {
      selectedIds.forEach((id) => damStore.softDeleteMedia(id));
      setSelectedIds([]);
      onRefreshMedia();
    }
  };

  const handleCopyUrl = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.src);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (sortedMedia.length === 0) {
    return (
      <BrandedEmptyState
        type={search || selectedType !== 'all' ? 'no_search' : 'no_media'}
        onPrimaryAction={() => {
          setSearch('');
          setSelectedType('all');
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Control Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search & Filter Pills */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search filename, alt text, tags..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2.5 text-xs font-bold border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#074504]"
          >
            <option value="all">All Formats</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="document">Documents</option>
            <option value="archive">Archives</option>
            <option value="missing_alt">Missing Alt Text</option>
            <option value="unused">Unused Assets</option>
          </select>
        </div>

        {/* View Mode & Sort Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl text-xs font-extrabold">
            <button
              onClick={() => setSortBy('date')}
              className={`px-3 py-1.5 rounded-xl transition-all ${sortBy === 'date' ? 'bg-[#074504] text-white' : 'text-gray-600'}`}
            >
              Date
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-3 py-1.5 rounded-xl transition-all ${sortBy === 'name' ? 'bg-[#074504] text-white' : 'text-gray-600'}`}
            >
              Name
            </button>
            <button
              onClick={() => setSortBy('size')}
              className={`px-3 py-1.5 rounded-xl transition-all ${sortBy === 'size' ? 'bg-[#074504] text-white' : 'text-gray-600'}`}
            >
              Size
            </button>
          </div>

          {/* View Mode Switcher (5 Modes: Grid, List, Compact, Gallery, Timeline) */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-xs text-[#074504]' : 'text-gray-500'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-xs text-[#074504]' : 'text-gray-500'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'compact' ? 'bg-white shadow-xs text-[#074504]' : 'text-gray-500'}`}
              title="Compact View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('gallery')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'gallery' ? 'bg-white shadow-xs text-[#074504]' : 'text-gray-500'}`}
              title="Gallery View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'timeline' ? 'bg-white shadow-xs text-[#074504]' : 'text-gray-500'}`}
              title="Timeline View"
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#074504] text-white p-3 px-6 rounded-2xl flex items-center justify-between shadow-lg border border-[#C0991B]/40 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#C0991B]">
              {selectedIds.length} Assets Selected
            </span>
            <button
              onClick={handleSelectAll}
              className="text-xs font-bold text-white/80 hover:text-white underline cursor-pointer"
            >
              Deselect All
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDelete}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* Grid View Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {sortedMedia.map((item, index) => {
            const isSelected = selectedIds.includes(item.id);
            const isFocused = activeFocusedIndex === index;

            return (
              <div
                key={item.id}
                onClick={() => onInspectMedia(item)}
                className={`bg-white rounded-3xl border transition-all overflow-hidden group flex flex-col justify-between cursor-pointer relative ${
                  isSelected ? 'border-[#074504] ring-2 ring-[#074504] shadow-md' : 'border-gray-200 shadow-xs hover:border-[#074504]/50'
                } ${isFocused ? 'ring-2 ring-[#C0991B]' : ''}`}
              >
                {/* Image Header / Thumbnail */}
                <div className="h-44 bg-gray-900 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={item.thumbnailUrl || item.src}
                    alt={item.displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Multi-select Checkbox */}
                  <button
                    onClick={(e) => toggleSelect(item.id, e)}
                    className="absolute top-3 left-3 p-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[#074504] shadow-md z-10"
                  >
                    {isSelected ? <CheckSquare className="w-4 h-4 text-[#074504]" /> : <Square className="w-4 h-4 text-gray-400" />}
                  </button>

                  {/* Format Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20">
                      {item.extension}
                    </span>
                  </div>

                  {/* Hover Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewMedia(item);
                      }}
                      className="p-2 bg-white text-[#074504] hover:bg-[#C0991B] rounded-xl font-bold text-xs shadow-md"
                      title="Quick Lightbox Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {item.fileType === 'image' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditImage(item);
                        }}
                        className="p-2 bg-white text-[#074504] hover:bg-[#C0991B] rounded-xl font-bold text-xs shadow-md"
                        title="Canvas Image Editor"
                      >
                        <Crop className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAIAssistant(item);
                      }}
                      className="p-2 bg-white text-[#074504] hover:bg-[#C0991B] rounded-xl font-bold text-xs shadow-md"
                      title="Smart Alt Text Inspector"
                    >
                      <Tag className="w-4 h-4 text-[#C0991B]" />
                    </button>
                  </div>
                </div>

                {/* Card Info Body */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-gray-900 leading-snug truncate group-hover:text-[#074504]">
                      {item.displayName}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-medium truncate mt-0.5">
                      {item.metadata?.altText || 'No alt text provided'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-extrabold text-gray-600">
                    <span>{item.formattedSize}</span>
                    <span className="text-[#074504] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {item.folderName}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compact View Mode */}
      {viewMode === 'compact' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {sortedMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => onInspectMedia(item)}
              className="bg-white p-2.5 rounded-2xl border border-gray-200 hover:border-[#074504] transition-all cursor-pointer flex items-center gap-2.5 group shadow-xs"
            >
              <img
                src={item.thumbnailUrl || item.src}
                alt={item.displayName}
                className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-extrabold text-gray-900 truncate group-hover:text-[#074504]">
                  {item.displayName}
                </p>
                <p className="text-[9px] font-bold text-gray-400 uppercase">
                  {item.extension} • {item.formattedSize}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery View Mode (Hero & Large Previews) */}
      {viewMode === 'gallery' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => onInspectMedia(item)}
              className="bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer flex flex-col justify-between"
            >
              <div className="h-64 bg-gray-950 relative overflow-hidden flex items-center justify-center">
                <img
                  src={item.src}
                  alt={item.displayName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-[#074504] text-[#C0991B] font-black text-[10px] uppercase tracking-wider rounded-full border border-[#C0991B]/40">
                      {item.fileType}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewMedia(item);
                      }}
                      className="p-2 bg-white/90 text-[#074504] rounded-xl hover:bg-[#C0991B] transition-colors shadow-md"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white truncate">{item.displayName}</h3>
                    <p className="text-[11px] text-white/80 font-medium truncate">{item.metadata?.altText || item.filename}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-600">
                <span>Folder: {item.folderName}</span>
                <span className="text-[#074504] font-extrabold">{item.usageCount} active uses</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline View Mode */}
      {viewMode === 'timeline' && (
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-gradient-to-b before:from-[#074504] before:to-emerald-200">
          {sortedMedia.map((item, idx) => (
            <div key={item.id} className="relative pl-12 flex items-start gap-4 group">
              <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-[#074504] border-4 border-white ring-2 ring-[#C0991B] shrink-0" />
              <div
                onClick={() => onInspectMedia(item)}
                className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs hover:border-[#074504] transition-all cursor-pointer flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.thumbnailUrl || item.src}
                    alt={item.displayName}
                    className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-black text-gray-900 group-hover:text-[#074504] transition-colors">{item.displayName}</h4>
                    <p className="text-[10px] text-gray-500 font-medium">Uploaded by {item.uploadedBy || 'Admin'} on {new Date(item.uploadDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs font-extrabold">
                  <span className="px-2.5 py-1 bg-emerald-50 text-[#074504] rounded-lg border border-emerald-200 text-[10px]">
                    {item.folderName}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewMedia(item);
                    }}
                    className="p-2 bg-gray-100 hover:bg-[#074504] hover:text-white rounded-xl transition-colors text-gray-700"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
