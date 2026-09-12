import React, { useState } from 'react';
import { 
  Layers, Plus, Search, Share2, Copy, Check, Trash2, 
  FileText, Award, Briefcase, Users, FileCheck, Folder as FolderIcon, FolderPlus, X
} from 'lucide-react';
import { damStore } from '../../lib/damStore';
import { Collection, FolderColor } from '../../types/dam';

interface Props {
  onSelectCollection: (colId: string) => void;
  activeCollectionId?: string;
}

export function CollectionsView({ onSelectCollection, activeCollectionId }: Props) {
  const collections = damStore.getCollections();
  const media = damStore.getMedia();

  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');

  // Folder creation modal on collection view
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState<FolderColor>('emerald');

  const colorClasses: Record<FolderColor, string> = {
    emerald: 'bg-emerald-50 text-[#074504] border-emerald-200 hover:border-[#074504]',
    gold: 'bg-amber-50 text-[#C0991B] border-[#C0991B]/30 hover:border-[#C0991B]',
    blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-500',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-500',
    amber: 'bg-amber-100 text-amber-800 border-amber-300 hover:border-amber-600',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-500',
    gray: 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-500'
  };

  const filtered = collections.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyShare = (col: Collection, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = col.shareUrl || `${window.location.origin}/admin/media?col=${col.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(col.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = () => {
    if (!newColName.trim()) return;
    damStore.createCollection(newColName.trim(), newColDesc.trim() || 'Reusable CMS Collection');
    setNewColName('');
    setNewColDesc('');
    setShowCreateModal(false);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    damStore.createFolder(newFolderName.trim(), 'folder_root', newFolderColor);
    setNewFolderName('');
    setShowCreateFolderModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-3xl border border-gray-200 shadow-xs">
        <div>
          <h3 className="text-base font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C0991B]" /> Reusable Media Collections
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Group assets across folders into shared collections for Blog Posts, Vacancies, Beneficiary Stories, and Annual Reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowCreateFolderModal(true)}
            className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#074504] border border-emerald-200 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <FolderIcon className="w-4 h-4 text-[#074504]" /> Create Folder
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-[#074504] hover:bg-[#053203] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-[#C0991B]/40"
          >
            <Plus className="w-4 h-4 text-[#C0991B]" /> New Collection
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search collections..."
          className="w-full pl-10 pr-4 py-2.5 text-xs font-medium border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
        />
      </div>

      {/* Collection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((col) => {
          const itemCount = col.mediaIds.length;
          const isSelected = activeCollectionId === col.id;

          return (
            <div
              key={col.id}
              onClick={() => onSelectCollection(col.id)}
              className={`p-6 bg-white rounded-3xl border transition-all cursor-pointer relative group flex flex-col justify-between space-y-4 ${
                isSelected ? 'border-[#074504] ring-2 ring-[#074504] shadow-md' : 'border-gray-200 shadow-xs hover:border-[#074504]/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: col.color || '#074504' }}
                >
                  <Layers className="w-6 h-6" />
                </div>

                <button
                  onClick={(e) => handleCopyShare(col, e)}
                  className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 font-bold text-xs flex items-center gap-1 transition-all"
                  title="Copy Shareable Link"
                >
                  {copiedId === col.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedId === col.id ? 'Copied' : 'Share'}</span>
                </button>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-black text-gray-900 tracking-tight">
                  {col.name}
                </h4>
                <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
                  {col.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-extrabold text-gray-700">
                <span className="text-[#074504]">{itemCount} Curated Assets</span>
                <span className="text-[10px] font-mono font-bold text-gray-400">
                  Updated {col.updatedAt}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 border border-gray-200">
            <h3 className="text-sm font-black uppercase text-[#074504]">Create Reusable Collection</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Collection Title</label>
                <input
                  type="text"
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  placeholder="e.g. Beneficiary Impact Gallery"
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newColDesc}
                  onChange={(e) => setNewColDesc(e.target.value)}
                  placeholder="Purpose and guidelines for this collection..."
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-5 py-2 bg-[#074504] text-white font-extrabold text-xs rounded-xl"
              >
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 border border-gray-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-black uppercase text-[#074504] flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#C0991B]" /> Create New Folder
              </h3>
              <button onClick={() => setShowCreateFolderModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Folder Name</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Branch Launch Event Photos"
                  className="w-full p-2.5 text-xs font-medium border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Color Label</label>
                <div className="flex items-center gap-2">
                  {(['emerald', 'gold', 'blue', 'purple', 'amber', 'rose', 'gray'] as FolderColor[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewFolderColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        newFolderColor === c ? 'scale-110 border-black' : 'border-transparent'
                      } ${colorClasses[c].split(' ')[0]}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateFolderModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-5 py-2 bg-[#074504] text-white font-extrabold text-xs rounded-xl hover:bg-[#053203]"
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
