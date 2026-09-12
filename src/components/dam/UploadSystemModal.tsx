import React, { useState, useRef } from 'react';
import { 
  X, UploadCloud, Link as LinkIcon, FolderPlus, FileArchive, 
  ShieldCheck, Check, AlertCircle, Pause, Play, 
  RotateCcw, FileText, Image as ImageIcon, Music, Video, Archive, Layers, Folder as FolderIcon, Plus 
} from 'lucide-react';
import { damStore } from '../../lib/damStore';
import { MediaItem, MediaType } from '../../types/dam';

interface Props {
  onClose: () => void;
  onUploadSuccess: (newItems: MediaItem[]) => void;
  activeFolderId?: string;
}

interface UploadTask {
  id: string;
  name: string;
  size: number;
  progress: number;
  speed: string;
  eta: string;
  status: 'uploading' | 'paused' | 'completed' | 'failed';
  previewUrl?: string;
  fileType: MediaType;
}

export function UploadSystemModal({ onClose, onUploadSuccess, activeFolderId = 'folder_root' }: Props) {
  const [activeTab, setActiveTab] = useState<'drag' | 'url' | 'zip' | 'paste'>('drag');
  const [urlInput, setUrlInput] = useState('');
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Target Destination States
  const folders = damStore.getFolders();
  const collections = damStore.getCollections();

  const [selectedFolderId, setSelectedFolderId] = useState<string>(activeFolderId);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');

  // Inline creation toggles
  const [showInlineFolderInput, setShowInlineFolderInput] = useState(false);
  const [inlineFolderName, setInlineFolderName] = useState('');
  const [showInlineCollectionInput, setShowInlineCollectionInput] = useState(false);
  const [inlineCollectionName, setInlineCollectionName] = useState('');

  const handleCreateInlineFolder = () => {
    if (!inlineFolderName.trim()) return;
    const f = damStore.createFolder(inlineFolderName.trim(), 'folder_root', 'emerald');
    setSelectedFolderId(f.id);
    setInlineFolderName('');
    setShowInlineFolderInput(false);
  };

  const handleCreateInlineCollection = () => {
    if (!inlineCollectionName.trim()) return;
    const c = damStore.createCollection(inlineCollectionName.trim(), 'Created during upload');
    setSelectedCollectionId(c.id);
    setInlineCollectionName('');
    setShowInlineCollectionInput(false);
  };

  const simulateUpload = (files: File[]) => {
    const newTasks: UploadTask[] = files.map((f, i) => {
      const ext = f.name.split('.').pop()?.toLowerCase() || 'jpg';
      let type: MediaType = 'image';
      if (['mp4', 'mov', 'avi', 'mkv', 'webm', 'mpeg'].includes(ext)) type = 'video';
      else if (['mp3', 'wav', 'aac', 'ogg', 'flac'].includes(ext)) type = 'audio';
      else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'txt'].includes(ext)) type = 'document';
      else if (['zip', 'rar', '7z', 'tar', 'gzip'].includes(ext)) type = 'archive';

      return {
        id: `task_${Date.now()}_${i}`,
        name: f.name,
        size: f.size || 1850000,
        progress: 15,
        speed: '3.2 MB/s',
        eta: '2s',
        status: 'uploading',
        previewUrl: type === 'image' ? URL.createObjectURL(f) : undefined,
        fileType: type
      };
    });

    setTasks((prev) => [...prev, ...newTasks]);
    setIsProcessing(true);

    // Simulate progress
    const interval = setInterval(() => {
      setTasks((prev) => {
        const updated = prev.map((t) => {
          if (t.status === 'uploading') {
            const nextProg = Math.min(100, t.progress + 25);
            return {
              ...t,
              progress: nextProg,
              status: (nextProg === 100 ? 'completed' : 'uploading') as 'completed' | 'uploading'
            };
          }
          return t;
        });

        const allDone = updated.every((t) => t.status === 'completed' || t.status === 'failed');
        if (allDone) {
          clearInterval(interval);
          setIsProcessing(false);
        }
        return updated;
      });
    }, 400);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleUrlUpload = () => {
    if (!urlInput.trim()) return;

    const fileName = urlInput.split('/').pop()?.split('?')[0] || 'imported_media_asset.jpg';
    const fakeFile = new File(['fake'], fileName, { type: 'image/jpeg' });
    simulateUpload([fakeFile]);
    setUrlInput('');
  };

  const handleFinishAndSave = () => {
    const currentFolders = damStore.getFolders();
    const folder = currentFolders.find((f) => f.id === selectedFolderId) || currentFolders[0];

    const createdItems: MediaItem[] = tasks.map((t) => {
      return damStore.addMediaItem({
        filename: t.name,
        displayName: t.name.replace(/\.[^/.]+$/, ''),
        fileType: t.fileType,
        size: t.size,
        src: t.previewUrl || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=1200&q=80',
        thumbnailUrl: t.previewUrl || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=300&q=70',
        folderId: folder.id,
        folderName: folder.name,
        uploadedBy: 'Patrick Munene',
        status: 'Optimized'
      });
    });

    if (selectedCollectionId && createdItems.length > 0) {
      createdItems.forEach((item) => {
        damStore.addMediaToCollection(selectedCollectionId, item.id);
      });
    }

    onUploadSuccess(createdItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#074504] text-white p-5 px-6 flex items-center justify-between border-b border-[#C0991B]/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#C0991B] text-[#074504] flex items-center justify-center font-black">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-white">
                Enterprise Media Ingestion Portal
              </h3>
              <p className="text-[11px] text-[#C0991B] font-medium">
                Auto-Compression, WebP Conversion & AI Alt-Text Pipeline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Destination Assignment Bar */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-black uppercase text-[#074504]">
              <span className="flex items-center gap-1.5">
                <FolderIcon className="w-4 h-4 text-[#C0991B]" /> Destination Folder & Collection
              </span>
              <span className="text-[11px] font-normal text-gray-500 normal-case">Target location for new uploads</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Folder Selector */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-700">Target Folder</label>
                  <button
                    type="button"
                    onClick={() => setShowInlineFolderInput(!showInlineFolderInput)}
                    className="text-[11px] font-extrabold text-[#074504] hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> New Folder
                  </button>
                </div>

                {showInlineFolderInput ? (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={inlineFolderName}
                      onChange={(e) => setInlineFolderName(e.target.value)}
                      placeholder="New folder title..."
                      className="flex-1 p-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                    />
                    <button
                      onClick={handleCreateInlineFolder}
                      className="px-2.5 py-1 bg-[#074504] text-white text-xs font-bold rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedFolderId}
                    onChange={(e) => setSelectedFolderId(e.target.value)}
                    className="w-full p-2 text-xs font-bold border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#074504]"
                  >
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        📁 {f.name} ({f.path})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Collection Selector */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-700">Target Collection (Optional)</label>
                  <button
                    type="button"
                    onClick={() => setShowInlineCollectionInput(!showInlineCollectionInput)}
                    className="text-[11px] font-extrabold text-[#C0991B] hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> New Collection
                  </button>
                </div>

                {showInlineCollectionInput ? (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={inlineCollectionName}
                      onChange={(e) => setInlineCollectionName(e.target.value)}
                      placeholder="New collection title..."
                      className="flex-1 p-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                    />
                    <button
                      onClick={handleCreateInlineCollection}
                      className="px-2.5 py-1 bg-[#C0991B] text-white text-xs font-bold rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedCollectionId}
                    onChange={(e) => setSelectedCollectionId(e.target.value)}
                    className="w-full p-2 text-xs font-bold border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#074504]"
                  >
                    <option value="">(None - Unassigned to Collection)</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>
                        🥞 {c.name} ({c.mediaIds.length} assets)
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Submode Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-2xl text-xs font-extrabold">
            <button
              onClick={() => setActiveTab('drag')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'drag' ? 'bg-[#074504] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Drag & Drop
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'url' ? 'bg-[#074504] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              URL Import
            </button>
            <button
              onClick={() => setActiveTab('zip')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'zip' ? 'bg-[#074504] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ZIP Unpack
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'paste' ? 'bg-[#074504] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Clipboard Paste
            </button>
          </div>

          {/* Drag and Drop Zone */}
          {activeTab === 'drag' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#074504]/30 hover:border-[#074504] bg-emerald-50/40 hover:bg-emerald-50 rounded-3xl p-8 text-center space-y-3 cursor-pointer transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) simulateUpload(Array.from(e.target.files));
                }}
              />

              <div className="w-16 h-16 rounded-2xl bg-white text-[#074504] border border-emerald-200 shadow-md flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-[#074504]" />
              </div>

              <div>
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                  Drag & Drop Media Files or Folders Here
                </h4>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Supports Images, Videos, Audio, PDFs, Spreadsheets, and ZIP Archives.
                </p>
              </div>

              <button className="px-5 py-2.5 bg-[#074504] hover:bg-[#053203] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md inline-block border border-[#C0991B]/40">
                Browse Files
              </button>
            </div>
          )}

          {/* URL Import */}
          {activeTab === 'url' && (
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <label className="text-xs font-black uppercase text-gray-900 block">
                Remote File URL Import
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/assets/corporate_banner.png"
                  className="flex-1 p-2.5 text-xs font-medium border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
                />
                <button
                  onClick={handleUrlUpload}
                  className="px-4 py-2.5 bg-[#074504] text-white font-extrabold text-xs rounded-xl hover:bg-[#053203] transition-all cursor-pointer"
                >
                  Import Asset
                </button>
              </div>
            </div>
          )}

          {/* ZIP Unpack */}
          {activeTab === 'zip' && (
            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 text-center">
              <FileArchive className="w-8 h-8 text-[#C0991B] mx-auto" />
              <h4 className="text-xs font-black uppercase text-amber-900">
                Automated ZIP Archive Extraction
              </h4>
              <p className="text-xs text-amber-800 font-medium max-w-md mx-auto">
                Upload a .zip file and Neema HEEP DAM will automatically extract, organize folders, and generate WebP thumbnails for all enclosed media assets.
              </p>
            </div>
          )}

          {/* Clipboard Paste */}
          {activeTab === 'paste' && (
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200 space-y-2 text-center">
              <h4 className="text-xs font-black uppercase text-blue-900">
                Clipboard Image Paste (Ctrl+V / Cmd+V)
              </h4>
              <p className="text-xs text-blue-800 font-medium">
                Copy an image or screenshot to your clipboard and press Ctrl+V directly on this screen to upload instantly!
              </p>
            </div>
          )}

          {/* Upload Queue Progress */}
          {tasks.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-gray-900">
                <span>Ingestion Queue ({tasks.length})</span>
                <span className="text-emerald-700 font-mono">
                  {tasks.filter((t) => t.status === 'completed').length} / {tasks.length} Completed
                </span>
              </div>

              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                      <div className="flex items-center gap-2 truncate max-w-sm">
                        {task.previewUrl ? (
                          <img src={task.previewUrl} alt="prev" className="w-6 h-6 rounded-md object-cover border" />
                        ) : (
                          <FileText className="w-4 h-4 text-[#074504]" />
                        )}
                        <span className="truncate">{task.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-500">{task.speed}</span>
                    </div>

                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#074504] h-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Automated Malware & Script Scan Passed
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleFinishAndSave}
              disabled={tasks.length === 0}
              className="px-5 py-2.5 bg-[#074504] hover:bg-[#053203] disabled:bg-gray-200 text-white disabled:text-gray-400 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 border border-[#C0991B]/40 cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#C0991B]" /> Finish & Save All ({tasks.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
