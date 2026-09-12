import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, Folder, Layers, UploadCloud, Clock, 
  Trash2, BarChart3, ShieldAlert, Plus, Search, 
  Check, Filter, ShieldCheck, Bell, RefreshCw 
} from 'lucide-react';
import { damStore } from '../lib/damStore';
import { MediaItem, DAMSubModule } from '../types/dam';
import { SupportedFileTypesBanner } from './dam/SupportedFileTypesBanner';
import { MediaDashboard } from './dam/MediaDashboard';
import { FolderManagerView } from './dam/FolderManagerView';
import { CollectionsView } from './dam/CollectionsView';
import { TrashManagerView } from './dam/TrashManagerView';
import { MediaLibraryView } from './dam/MediaLibraryView';
import { UploadSystemModal } from './dam/UploadSystemModal';
import { ImageEditorModal } from './dam/ImageEditorModal';
import { AIMediaAssistantModal } from './dam/AIMediaAssistantModal';
import { DuplicateHealthCenterModal } from './dam/DuplicateHealthCenterModal';
import { MetadataInspectorPanel } from './dam/MetadataInspectorPanel';
import { MediaPreviewModal } from './dam/MediaPreviewModal';

interface Props {
  media?: any[];
  showToast?: (msg: string) => void;
}

export function MediaManagerDAM({ showToast }: Props) {
  const [submodule, setSubmodule] = useState<DAMSubModule>('dashboard');
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  
  // Selection & Navigation State
  const [activeFolderId, setActiveFolderId] = useState<string>('folder_root');
  const [activeCollectionId, setActiveCollectionId] = useState<string | undefined>();
  const [inspectedMedia, setInspectedMedia] = useState<MediaItem | null>(null);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [aiAssistantMedia, setAiAssistantMedia] = useState<MediaItem | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

  const loadData = () => {
    setMediaList(damStore.getMedia());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('neema_cms_media_updated', handleUpdate);
    return () => window.removeEventListener('neema_cms_media_updated', handleUpdate);
  }, []);

  const triggerToast = (msg: string) => {
    if (showToast) showToast(msg);
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'library', label: 'Library', icon: ImageIcon },
    { id: 'folders', label: 'Folders', icon: Folder },
    { id: 'collections', label: 'Collections', icon: Layers },
    { id: 'uploads', label: 'Uploads', icon: UploadCloud },
    { id: 'recently_added', label: 'Recants', icon: Clock },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner & Submodule Navigation */}
      <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#074504] rounded-3xl border border-[#C0991B]/30 p-6 md:p-8 text-white shadow-lg space-y-4">
        {/* 1. Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-[#C0991B] shrink-0" />
            <span>Digital Asset Management Module</span>
          </h1>
          <span className="px-3.5 py-1.5 bg-[#C0991B]/20 text-[#C0991B] border border-[#C0991B]/40 rounded-full text-xs font-black shadow-2xs">
            {mediaList.length} Assets Stored
          </span>
        </div>

        {/* 2. Description Text */}
        <p className="text-xs md:text-sm text-gray-200 font-medium leading-relaxed max-w-4xl">
          Centralized corporate repository with automated WebP compression, AI alt-text, nested folder permissions, and live usage tracking.
        </p>

        {/* 3. CTA buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-[#C0991B] hover:bg-[#a88414] text-[#074504] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Upload Media
          </button>
        </div>

        {/* Submodule Tabs Bar */}
        <div className="flex items-center justify-between gap-1 pt-2 border-t border-white/10 flex-wrap sm:flex-nowrap">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = item.id === 'uploads' ? showUploadModal : (submodule === item.id && !showUploadModal);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'uploads') {
                    setShowUploadModal(true);
                  } else {
                    setSubmodule(item.id as DAMSubModule);
                  }
                }}
                className={`px-2 sm:px-2.5 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-1 min-w-0 text-center ${
                  isSelected
                    ? 'bg-[#C0991B] text-[#074504] shadow-md scale-[1.01]'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#074504]' : 'text-[#C0991B]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Universal File Compatibility Banner */}
      <SupportedFileTypesBanner />

      {/* Main Workspace Layout with Optional Metadata Drawer */}
      <div className="flex flex-col lg:flex-row gap-6 relative items-start">
        <div className="flex-1 w-full min-w-0">
          {/* Submodule 1: Media Dashboard */}
          {submodule === 'dashboard' && (
            <MediaDashboard
              onNavigateSubmodule={(sub) => {
                if (sub === 'uploads') {
                  setShowUploadModal(true);
                } else {
                  setSubmodule(sub as DAMSubModule);
                }
              }}
              onPreviewMedia={(item) => setPreviewMedia(item)}
            />
          )}

          {/* Submodule 2: Folder Manager */}
          {submodule === 'folders' && (
            <FolderManagerView
              activeFolderId={activeFolderId}
              onSelectFolder={(fId) => {
                setActiveFolderId(fId);
                setSubmodule('library');
              }}
            />
          )}

          {/* Submodule 3: Collections View */}
          {submodule === 'collections' && (
            <CollectionsView
              activeCollectionId={activeCollectionId}
              onSelectCollection={(cId) => {
                setActiveCollectionId(cId);
                setSubmodule('library');
              }}
            />
          )}

          {/* Submodule 4: Trash Bin */}
          {submodule === 'trash' && (
            <TrashManagerView
              onRefreshMedia={() => {
                loadData();
                triggerToast('Trash updated');
              }}
            />
          )}

          {/* Submodule 5: Media Library (Default / Recently Added / Uploads) */}
          {(submodule === 'library' || submodule === 'recently_added' || submodule === 'uploads') && (
            <MediaLibraryView
              isRecentlyAdded={submodule === 'recently_added'}
              folderId={submodule === 'library' && activeFolderId !== 'folder_root' ? activeFolderId : undefined}
              collectionId={activeCollectionId}
              onPreviewMedia={(item) => setPreviewMedia(item)}
              onInspectMedia={(item) => setInspectedMedia(item)}
              onEditImage={(item) => setEditingMedia(item)}
              onOpenAIAssistant={(item) => setAiAssistantMedia(item)}
              onRefreshMedia={() => {
                loadData();
                triggerToast('Media library refreshed');
              }}
            />
          )}
        </div>

        {/* Slide-over Metadata Inspector Panel */}
        {inspectedMedia && (
          <MetadataInspectorPanel
            media={inspectedMedia}
            onClose={() => setInspectedMedia(null)}
            onEditImage={(item) => setEditingMedia(item)}
            onOpenAIAssistant={(item) => setAiAssistantMedia(item)}
            onDeleteMedia={(id) => {
              damStore.softDeleteMedia(id);
              setInspectedMedia(null);
              loadData();
              triggerToast('Asset moved to trash');
            }}
            onUpdateMetadata={(updated) => {
              damStore.updateMediaItem(updated.id, updated);
              setInspectedMedia(updated);
              loadData();
              triggerToast('Metadata updated');
            }}
          />
        )}
      </div>

      {/* Modals */}
      {showUploadModal && (
        <UploadSystemModal
          activeFolderId={activeFolderId}
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={(newItems) => {
            loadData();
            triggerToast(`Successfully uploaded ${newItems.length} media asset(s)!`);
          }}
        />
      )}

      {showHealthModal && (
        <DuplicateHealthCenterModal
          onClose={() => setShowHealthModal(false)}
          onRefreshMedia={() => {
            loadData();
            triggerToast('Health audit remediation applied');
          }}
        />
      )}

      {editingMedia && (
        <ImageEditorModal
          media={editingMedia}
          onClose={() => setEditingMedia(null)}
          onSave={(updatedItem) => {
            damStore.updateMediaItem(updatedItem.id, updatedItem);
            setEditingMedia(null);
            loadData();
            triggerToast('Image canvas edit saved successfully!');
          }}
        />
      )}

      {aiAssistantMedia && (
        <AIMediaAssistantModal
          media={aiAssistantMedia}
          onClose={() => setAiAssistantMedia(null)}
          onApplySuggestions={(updatedItem) => {
            damStore.updateMediaItem(updatedItem.id, updatedItem);
            setAiAssistantMedia(null);
            loadData();
            triggerToast('AI metadata suggestions applied!');
          }}
        />
      )}

      {previewMedia && (
        <MediaPreviewModal
          media={previewMedia}
          onClose={() => setPreviewMedia(null)}
          onOpenEditor={(item) => setEditingMedia(item)}
          onOpenAIAssistant={(item) => setAiAssistantMedia(item)}
        />
      )}
    </div>
  );
}

export default MediaManagerDAM;
