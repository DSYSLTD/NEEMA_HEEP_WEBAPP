import React, { useState } from 'react';
import { 
  Trash2, RotateCcw, AlertTriangle, ShieldAlert, Check, X, FileText, Image as ImageIcon 
} from 'lucide-react';
import { damStore } from '../../lib/damStore';
import { MediaItem } from '../../types/dam';
import { BrandedEmptyState } from './BrandedEmptyState';

interface Props {
  onRefreshMedia: () => void;
}

export function TrashManagerView({ onRefreshMedia }: Props) {
  const trash = damStore.getTrash();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleRestore = (id: string) => {
    damStore.restoreFromTrash(id);
    onRefreshMedia();
  };

  const handlePermanentDelete = (id: string) => {
    if (window.confirm('This action cannot be undone. Permanently delete this media asset?')) {
      damStore.permanentlyDelete(id);
      onRefreshMedia();
    }
  };

  const handleEmptyTrash = () => {
    if (window.confirm('Empty entire trash bin? All soft-deleted assets will be permanently removed.')) {
      damStore.emptyTrash();
      onRefreshMedia();
    }
  };

  if (trash.length === 0) {
    return (
      <BrandedEmptyState
        type="trash_empty"
        onPrimaryAction={() => window.location.reload()}
        primaryActionLabel="Refresh Media Library"
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-5 bg-rose-50 rounded-3xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-rose-900 uppercase tracking-wide">
              Trash Bin ({trash.length} Recoverable Assets)
            </h3>
            <p className="text-xs text-rose-700 font-medium">
              Assets in trash are held for a 30-day recovery window before automated permanent purge.
            </p>
          </div>
        </div>

        <button
          onClick={handleEmptyTrash}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Trash2 className="w-4 h-4" /> Empty Trash
        </button>
      </div>

      {/* Trash Items List */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs font-black text-gray-500 uppercase">
          <span>Item</span>
          <span>Deleted Date</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-gray-100">
          {trash.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <img
                  src={item.thumbnailUrl || item.src}
                  alt={item.displayName}
                  className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                />
                <div>
                  <h4 className="text-xs font-extrabold text-gray-900">{item.displayName}</h4>
                  <span className="text-[10px] text-gray-500 font-mono">{item.formattedSize} • {item.folderName}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 font-mono font-medium">
                {item.deletedAt ? new Date(item.deletedAt).toLocaleDateString() : 'Recently'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRestore(item.id)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#074504] font-extrabold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-emerald-200"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#599200]" /> Restore
                </button>
                <button
                  onClick={() => handlePermanentDelete(item.id)}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-all border border-rose-200 cursor-pointer"
                >
                  Purge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
