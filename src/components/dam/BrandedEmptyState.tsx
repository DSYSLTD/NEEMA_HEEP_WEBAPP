import React from 'react';
import { 
  FolderOpen, SearchX, Trash2, FileX, Image as ImageIcon, 
  Layers, UploadCloud, Plus 
} from 'lucide-react';

interface Props {
  type: 'no_media' | 'no_search' | 'empty_folder' | 'no_collections' | 'trash_empty' | 'no_unused';
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
  customTitle?: string;
  customDesc?: string;
}

export function BrandedEmptyState({
  type,
  onPrimaryAction,
  primaryActionLabel,
  customTitle,
  customDesc
}: Props) {
  const configs = {
    no_media: {
      icon: ImageIcon,
      title: customTitle || 'No Media Assets Found',
      desc: customDesc || 'Your Digital Asset Management library is currently empty. Upload high-resolution images, videos, documents, or brand assets to get started.',
      action: primaryActionLabel || 'Upload First Asset',
      color: 'bg-[#074504]/10 text-[#074504] border-[#074504]/20'
    },
    no_search: {
      icon: SearchX,
      title: customTitle || 'No Matching Assets Found',
      desc: customDesc || 'We couldn’t find any assets matching your active filters or search terms. Try clearing search keywords or switching categories.',
      action: primaryActionLabel || 'Reset All Filters',
      color: 'bg-[#C0991B]/10 text-[#C0991B] border-[#C0991B]/30'
    },
    empty_folder: {
      icon: FolderOpen,
      title: customTitle || 'This Folder is Empty',
      desc: customDesc || 'No files have been organized into this folder yet. Drag and drop assets here or upload directly to populate this directory.',
      action: primaryActionLabel || 'Upload to Folder',
      color: 'bg-emerald-50 text-[#074504] border-emerald-200'
    },
    no_collections: {
      icon: Layers,
      title: customTitle || 'No Reusable Collections Yet',
      desc: customDesc || 'Collections let you organize reusable asset sets for Blog Posts, Beneficiaries, Vacancies, and Marketing collateral.',
      action: primaryActionLabel || 'Create New Collection',
      color: 'bg-amber-50 text-[#C0991B] border-[#C0991B]/30'
    },
    trash_empty: {
      icon: Trash2,
      title: customTitle || 'Trash is Empty',
      desc: customDesc || 'No soft-deleted files are currently in the trash bin. Deleted files stay recoverable for 30 days before permanent purging.',
      action: primaryActionLabel || 'Back to Media Library',
      color: 'bg-gray-100 text-gray-600 border-gray-200'
    },
    no_unused: {
      icon: FileX,
      title: customTitle || 'All Assets are Active!',
      desc: customDesc || 'Great news! Every media asset in your library is currently linked to published articles, categories, or site pages.',
      action: primaryActionLabel || 'View All Media',
      color: 'bg-emerald-50 text-[#599200] border-[#599200]/30'
    }
  };

  const cfg = configs[type] || configs.no_media;
  const Icon = cfg.icon;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-10 md:p-14 text-center max-w-xl mx-auto shadow-xs my-8 space-y-5">
      {/* Visual Emblem */}
      <div className={`w-20 h-20 rounded-3xl border flex items-center justify-center mx-auto shadow-sm ${cfg.color}`}>
        <Icon className="w-10 h-10 stroke-[1.75]" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-black text-gray-900 tracking-tight">
          {cfg.title}
        </h3>
        <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-md mx-auto">
          {cfg.desc}
        </p>
      </div>

      {onPrimaryAction && (
        <button
          onClick={onPrimaryAction}
          className="px-6 py-3 bg-[#074504] hover:bg-[#053203] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-105 inline-flex items-center gap-2 border border-[#C0991B]/40 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C0991B]" />
          <span>{cfg.action}</span>
        </button>
      )}
    </div>
  );
}
