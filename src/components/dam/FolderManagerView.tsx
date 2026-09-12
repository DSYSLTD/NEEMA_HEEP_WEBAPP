import React, { useState } from 'react';
import { 
  Folder as FolderIcon, FolderPlus, ChevronRight, Edit3, Trash2, 
  MoreVertical, Shield, HardDrive, Plus, Check, X, Building2, Users, FileText, Layers
} from 'lucide-react';
import { damStore } from '../../lib/damStore';
import { Folder, FolderColor } from '../../types/dam';

interface Props {
  onSelectFolder: (folderId: string) => void;
  activeFolderId: string;
}

export function FolderManagerView({ onSelectFolder, activeFolderId }: Props) {
  const folders = damStore.getFolders();
  const media = damStore.getMedia();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState<FolderColor>('emerald');
  const [selectedParentId, setSelectedParentId] = useState<string>('folder_root');

  // Collection creation modal on folder view
  const [showCreateCollectionModal, setShowCreateCollectionModal] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');

  const colorClasses: Record<FolderColor, string> = {
    emerald: 'bg-emerald-50 text-[#074504] border-emerald-200 hover:border-[#074504]',
    gold: 'bg-amber-50 text-[#C0991B] border-[#C0991B]/30 hover:border-[#C0991B]',
    blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-500',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-500',
    amber: 'bg-amber-100 text-amber-800 border-amber-300 hover:border-amber-600',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-500',
    gray: 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-500'
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    damStore.createFolder(newFolderName.trim(), selectedParentId, newFolderColor);
    setNewFolderName('');
    setShowCreateModal(false);
  };

  const handleCreateCollection = () => {
    if (!newColName.trim()) return;
    damStore.createCollection(newColName.trim(), newColDesc.trim() || 'CMS Asset Collection');
    setNewColName('');
    setNewColDesc('');
    setShowCreateCollectionModal(false);
  };

  const handleDeleteFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this folder?')) {
      damStore.deleteFolder(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-3xl border border-gray-200 shadow-xs">
        <div>
          <h3 className="text-base font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <FolderIcon className="w-5 h-5 text-[#C0991B]" /> Enterprise Media Folders
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Structure corporate media into organized folders with custom color labels and role permissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowCreateCollectionModal(true)}
            className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-[#826507] border border-[#C0991B]/40 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#C0991B]" /> New Collection
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-[#074504] hover:bg-[#053203] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-[#C0991B]/40"
          >
            <Plus className="w-4 h-4 text-[#C0991B]" /> Create Folder
          </button>
        </div>
      </div>

      {/* Folder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {folders.map((folder) => {
          const count = media.filter((m) => m.folderId === folder.id).length;
          const isSelected = activeFolderId === folder.id;

          return (
            <div
              key={folder.id}
              onClick={() => onSelectFolder(folder.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                colorClasses[folder.colorLabel]
              } ${isSelected ? 'ring-2 ring-[#074504] shadow-md' : 'shadow-xs'}`}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/80 border border-black/5 flex items-center justify-center text-[#074504] shadow-xs">
                  <FolderIcon className="w-6 h-6 stroke-[2]" />
                </div>

                {!folder.isSystemFolder && (
                  <button
                    onClick={(e) => handleDeleteFolder(folder.id, e)}
                    className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Folder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-1">
                <h4 className="text-sm font-black text-gray-900 tracking-tight truncate">
                  {folder.name}
                </h4>
                <p className="text-[11px] font-mono font-bold text-gray-500">
                  {folder.path}
                </p>
                <div className="flex items-center justify-between text-[11px] font-extrabold text-gray-700 pt-2 border-t border-black/5">
                  <span>{count} Media Files</span>
                  <span className="text-[10px] uppercase font-mono bg-white px-2 py-0.5 rounded-full border border-black/10">
                    {folder.isSystemFolder ? 'System' : 'Custom'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Folder Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 border border-gray-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-black uppercase text-[#074504] flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#C0991B]" /> Create New Folder
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
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
                onClick={() => setShowCreateModal(false)}
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

      {/* Create Collection Modal */}
      {showCreateCollectionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 border border-gray-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-black uppercase text-[#074504] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C0991B]" /> Create New Collection
              </h3>
              <button onClick={() => setShowCreateCollectionModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Collection Title</label>
                <input
                  type="text"
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  placeholder="e.g. Annual Report Highlights"
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
                onClick={() => setShowCreateCollectionModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCollection}
                className="px-5 py-2 bg-[#074504] text-white font-extrabold text-xs rounded-xl"
              >
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
