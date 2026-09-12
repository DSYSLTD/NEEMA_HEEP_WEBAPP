import React, { useState, useEffect } from 'react';
import ArticleRichTextToolbar from './ArticleRichTextToolbar';
import { useAuth } from '../hooks/useAuth';
import { blogStore } from '../lib/blogStore';
import { 
  PenTool, CheckCircle, ArrowLeft, Save, Eye, Plus, 
  Trash2, ArrowUp, ArrowDown, Image as ImageIcon, FileText, 
  Heading, Quote, Send, Tag, Folder, User, Globe, Search, Award, Check,
  Upload, Link as LinkIcon, Video, Focus, ShieldCheck, Share2, Sliders, X, Maximize2, Layers, Film,
  Lock, FolderPlus, Layers3, Calendar, Clock, RotateCw, Archive, AlertCircle, CalendarDays
} from 'lucide-react';

export interface CreateArticleStudioProps {
  editingPostId?: string | null;
  editorTitle: string;
  setEditorTitle: (val: string) => void;
  editorSlug: string;
  setEditorSlug: (val: string) => void;
  editorExcerpt: string;
  setEditorExcerpt: (val: string) => void;
  editorCategory: string;
  setEditorCategory: (val: string) => void;
  editorTags: string[];
  setEditorTags: (val: string[] | ((prev: string[]) => string[])) => void;
  editorImage: string;
  setEditorImage: (val: string) => void;
  editorStatus: string;
  setEditorStatus: (val: string) => void;
  editorAuthorId: string;
  setEditorAuthorId: (val: string) => void;
  editorIsFeatured: boolean;
  setEditorIsFeatured: (val: boolean) => void;
  editorBlocks: any[];
  setEditorBlocks: (blocks: any[] | ((prev: any[]) => any[])) => void;
  editorSeoFocus: string;
  setEditorSeoFocus: (val: string) => void;
  editorMetaDesc: string;
  setEditorMetaDesc: (val: string) => void;
  editorAutosaveText: string;
  categories: any[];
  authors: any[];
  tags: any[];
  media: any[];
  onSavePost: () => void;
  onShowPreview: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onBackToPosts: () => void;
}

export default function CreateArticleStudio({
  editingPostId,
  editorTitle,
  setEditorTitle,
  editorSlug,
  setEditorSlug,
  editorExcerpt,
  setEditorExcerpt,
  editorCategory,
  setEditorCategory,
  editorTags,
  setEditorTags,
  editorImage,
  setEditorImage,
  editorStatus,
  setEditorStatus,
  editorAuthorId,
  setEditorAuthorId,
  editorIsFeatured,
  setEditorIsFeatured,
  editorBlocks,
  setEditorBlocks,
  editorSeoFocus,
  setEditorSeoFocus,
  editorMetaDesc,
  setEditorMetaDesc,
  editorAutosaveText,
  categories,
  authors,
  tags,
  media,
  onSavePost,
  onShowPreview,
  showToast,
  onBackToPosts,
}: CreateArticleStudioProps) {
  const { user } = useAuth();
  const [tagInput, setTagInput] = useState('');
  
  // Folders & Collections State
  const [selectedFolder, setSelectedFolder] = useState('Articles');
  const [selectedCollection, setSelectedCollection] = useState('Featured Media');
  const [folders, setFolders] = useState<string[]>([
    'Articles', 'Featured Media', 'Impact Stories', 'Press Releases', 'Reports'
  ]);
  const [collections, setCollections] = useState<string[]>([
    'Main Publication', 'Microfinance 2026', 'Community Outreach', 'Annual Reports'
  ]);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [newFolderNameInput, setNewFolderNameInput] = useState('');
  const [newCollectionNameInput, setNewCollectionNameInput] = useState('');

  // DAM Library Modal Filters
  const [damSearch, setDamSearch] = useState('');
  const [damFolderFilter, setDamFolderFilter] = useState('All');
  const [damCollectionFilter, setDamCollectionFilter] = useState('All');
  
  // Featured Media State
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState('');
  const [altText, setAltText] = useState('Featured article publication media asset');
  const [caption, setCaption] = useState('');
  const [credit, setCredit] = useState('');
  const [focusPoint, setFocusPoint] = useState<'center' | 'top' | 'bottom' | 'left' | 'right'>('center');
  const [isSocialShare, setIsSocialShare] = useState(true);
  const [showDamModal, setShowDamModal] = useState(false);
  const [showSocialPreview, setShowSocialPreview] = useState(false);

  // Article Scheduling State
  const [scheduleMode, setScheduleMode] = useState<'future' | 'immediate'>('future');
  const [publishDate, setPublishDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  });
  const [expiryDate, setExpiryDate] = useState('');
  const [autoArchive, setAutoArchive] = useState(true);
  const [recurringPattern, setRecurringPattern] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually'>('none');
  const [timezone, setTimezone] = useState('EAT (Nairobi, UTC+3)');
  const [localAutosaveText, setLocalAutosaveText] = useState('');

  // Auto-save effect for unpublished articles
  useEffect(() => {
    if (!editorTitle.trim()) return;
    const timer = setTimeout(() => {
      // If status is not explicitly Scheduled or Published or Archived, save as Draft automatically
      if (editorStatus !== 'Published' && editorStatus !== 'Scheduled' && editorStatus !== 'Archived') {
        if (editorStatus !== 'Draft') {
          setEditorStatus('Draft');
        }
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLocalAutosaveText(`Draft auto-saved at ${timeStr}`);
        (onSavePost as any)('Draft');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [editorTitle, editorExcerpt, editorBlocks, editorImage, editorCategory, editorTags, editorStatus]);

  const handlePublishNow = () => {
    let targetStatus = 'Published';
    if (expiryDate && new Date(expiryDate).getTime() <= Date.now() && autoArchive) {
      targetStatus = 'Archived';
    }
    setEditorStatus(targetStatus);
    (onSavePost as any)(targetStatus);
    showToast(`Article published live!`, 'success');
  };

  const handleSaveScheduled = () => {
    if (!publishDate) {
      showToast('Please select a target release date and time first', 'error');
      return;
    }
    let targetStatus = 'Scheduled';
    if (expiryDate && new Date(expiryDate).getTime() <= Date.now() && autoArchive) {
      targetStatus = 'Archived';
    }
    setEditorStatus(targetStatus);
    (onSavePost as any)(targetStatus);
    showToast(`Article scheduled for release on ${new Date(publishDate).toLocaleString()}`, 'success');
  };

  // Auto-Archive check effect for expired articles
  useEffect(() => {
    if (expiryDate && new Date(expiryDate).getTime() <= Date.now() && autoArchive) {
      if (editorStatus !== 'Archived') {
        setEditorStatus('Archived');
      }
    }
  }, [expiryDate, autoArchive, editorStatus, setEditorStatus]);

  // Default Author Profile based on Logged-In User
  const u = user as any;
  const activeUserAuthor = (authors || []).find(
    (a: any) => a.id === u?.uid || a.id === u?.id || a.email === u?.email || a.name === (u?.displayName || u?.name)
  ) || {
    id: u?.uid || u?.id || 'author_current_user',
    name: u?.displayName || u?.name || u?.email?.split('@')[0] || 'Patrick Munene',
    role: u?.role || 'Lead Editor & Contributor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    email: u?.email || 'ptrckmunene@gmail.com',
  };

  // Sync author ID to default logged-in user profile on load
  useEffect(() => {
    if (activeUserAuthor && activeUserAuthor.id && editorAuthorId !== activeUserAuthor.id) {
      setEditorAuthorId(activeUserAuthor.id);
    }
  }, [user, authors]);

  // Handle Folder Creation
  const handleCreateFolder = () => {
    if (!newFolderNameInput.trim()) return;
    const name = newFolderNameInput.trim();
    if (!folders.includes(name)) {
      setFolders(prev => [...prev, name]);
      setSelectedFolder(name);
      showToast(`Created folder "${name}" in Media Library`, 'success');
    } else {
      setSelectedFolder(name);
    }
    setNewFolderNameInput('');
    setShowNewFolderModal(false);
  };

  // Handle Collection Creation
  const handleCreateCollection = () => {
    if (!newCollectionNameInput.trim()) return;
    const name = newCollectionNameInput.trim();
    if (!collections.includes(name)) {
      setCollections(prev => [...prev, name]);
      setSelectedCollection(name);
      showToast(`Created collection "${name}" in Media Library`, 'success');
    } else {
      setSelectedCollection(name);
    }
    setNewCollectionNameInput('');
    setShowNewCollectionModal(false);
  };

  // Auto-generate slug when title changes if slug is empty or matches auto-slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEditorTitle(val);
    if (!editingPostId || !editorSlug) {
      setEditorSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  // Featured Media Upload handler with folder and collection storage
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          const imgUrl = evt.target.result as string;
          setEditorImage(imgUrl);

          // Store image in Media Library with selected folder & collection
          const newMediaAsset = {
            id: `media_${Date.now()}`,
            url: imgUrl,
            src: imgUrl,
            thumbnailUrl: imgUrl,
            displayName: file.name,
            filename: file.name,
            fileType: 'image',
            folder: selectedFolder,
            collection: selectedCollection,
            size: `${Math.round(file.size / 1024)} KB`,
            uploadDate: new Date().toISOString().split('T')[0],
            date: new Date().toISOString().split('T')[0],
          };

          const existingMedia = blogStore.getMedia() || [];
          blogStore.saveMedia([newMediaAsset, ...existingMedia]);
          showToast(`Image uploaded & stored in Media Library under folder "${selectedFolder}" & collection "${selectedCollection}"`, 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save current image URL into Media Library
  const handleSaveUrlToLibrary = () => {
    if (!editorImage) {
      showToast('Please enter an image URL first', 'error');
      return;
    }
    const newMediaAsset = {
      id: `media_${Date.now()}`,
      url: editorImage,
      src: editorImage,
      thumbnailUrl: editorImage,
      displayName: `Featured Article Media (${selectedFolder})`,
      filename: 'featured_article_image.webp',
      fileType: 'image',
      folder: selectedFolder,
      collection: selectedCollection,
      size: '240 KB',
      uploadDate: new Date().toISOString().split('T')[0],
      date: new Date().toISOString().split('T')[0],
    };
    const existingMedia = blogStore.getMedia() || [];
    blogStore.saveMedia([newMediaAsset, ...existingMedia]);
    showToast(`Saved image URL to Media Library under Folder "${selectedFolder}" and Collection "${selectedCollection}"`, 'success');
  };

  // Block management with standardized parameters per block type
  const handleAddBlock = (type: 'paragraph' | 'heading' | 'image' | 'quote' | 'tip') => {
    const newBlock = {
      id: `block_${Date.now()}`,
      type,
      content: type === 'heading' ? 'New Section Heading' : type === 'quote' ? 'Inspiring quote or key statement...' : type === 'tip' ? 'Key takeaway summary...' : '',
      headingLevel: 'h2',
      fontSize: 'normal',
      alignment: 'left',
      authorName: 'Neema HEEP Leadership',
      authorRole: 'Community Impact Director',
      calloutType: 'takeaway',
      imageLayout: 'full',
      imageCaption: '',
      imageAlt: ''
    };
    setEditorBlocks((prev: any[]) => [...(prev || []), newBlock]);
    showToast(`Added standardized ${type.toUpperCase()} block`, 'info');
  };

  const handleUpdateBlockField = (id: string, field: string, value: any) => {
    setEditorBlocks((prev: any[]) =>
      (prev || []).map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  const handleUpdateBlock = (id: string, content: string) => {
    setEditorBlocks((prev: any[]) =>
      (prev || []).map((b) => (b.id === id ? { ...b, content } : b))
    );
  };

  const handleRemoveBlock = (id: string) => {
    setEditorBlocks((prev: any[]) => (prev || []).filter((b) => b.id !== id));
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    setEditorBlocks((prev: any[]) => {
      const copy = [...(prev || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return copy;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!editorTags.includes(tagInput.trim())) {
      setEditorTags((prev: string[]) => [...prev, tagInput.trim()]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tToRemove: string) => {
    setEditorTags((prev: string[]) => prev.filter((t) => t !== tToRemove));
  };

  // SEO Score calculation
  const getSeoScore = () => {
    let score = 30;
    if (editorTitle.length > 10) score += 20;
    if (editorMetaDesc.length > 50) score += 20;
    if (editorSeoFocus.trim() && editorTitle.toLowerCase().includes(editorSeoFocus.toLowerCase())) score += 15;
    if (editorImage) score += 15;
    return Math.min(100, score);
  };

  const seoScore = getSeoScore();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-3xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPosts}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4 text-[#074504]" /> Articles
          </button>
          <div>
            <h2 className="text-base font-black uppercase text-gray-900 tracking-tight flex items-center gap-2">
              <PenTool className="w-5 h-5 text-[#C0991B]" />
              {editingPostId ? 'Edit Article' : 'Article Management Module'}
            </h2>
            <p className="text-[11px] text-gray-500 font-medium">
              {localAutosaveText || editorAutosaveText || 'Draft auto-saved in background'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onShowPreview}
            className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#074504]" /> Preview
          </button>

          <button
            type="button"
            onClick={handlePublishNow}
            className="px-5 py-2.5 bg-[#074504] hover:bg-[#053203] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-[#C0991B]/50"
          >
            <Send className="w-4 h-4 text-[#C0991B]" /> Publish Article Now
          </button>
        </div>
      </div>

      {/* Main Studio Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Editor Content (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug Box */}
          <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                Article Title
              </label>
              <input
                type="text"
                value={editorTitle}
                onChange={handleTitleChange}
                placeholder="e.g. Empowering Micro-Enterprises in Mount Kenya through HEEP Loans"
                className="w-full px-4 py-3 text-lg font-black text-gray-900 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#074504] placeholder:font-normal placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">
                Permalink / Slug URL
              </label>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono text-gray-600">
                <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-gray-400 shrink-0">neemaheep.org/blog/</span>
                <input
                  type="text"
                  value={editorSlug}
                  onChange={(e) => setEditorSlug(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-xs font-bold text-[#074504] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Short Excerpt / Summary
              </label>
              <textarea
                rows={2}
                value={editorExcerpt}
                onChange={(e) => setEditorExcerpt(e.target.value)}
                placeholder="Brief high-impact executive summary shown in blog post cards..."
                className="w-full px-3.5 py-2.5 text-xs font-medium border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
              />
            </div>
          </div>

          {/* FEATURED MEDIA BLOCK (FULL FEATURED MEDIA SUITE) */}
          <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#074504] text-[#C0991B] rounded-xl">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">
                    Featured Media
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold">
                    Primary publication image, video, thumbnail & social share card
                  </p>
                </div>
              </div>
            </div>

            {/* Media Type Tabs (Image vs Video) */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setMediaType('image')}
                className={`flex-1 py-2 text-xs font-black uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mediaType === 'image' ? 'bg-[#074504] text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-[#C0991B]" /> Featured Image
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`flex-1 py-2 text-xs font-black uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mediaType === 'video' ? 'bg-[#074504] text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Video className="w-4 h-4 text-[#C0991B]" /> Featured Video / Embed
              </button>
            </div>

            {/* Live Media Preview & Focus Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Side: Live Preview Box */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase text-gray-700 flex items-center justify-between">
                  <span>Live Thumbnail Preview</span>
                  <span className="text-[10px] text-emerald-700 font-bold">1200 × 630 px (16:9)</span>
                </label>

                {mediaType === 'image' ? (
                  editorImage ? (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 aspect-video group bg-gray-900 shadow-inner">
                      <img
                        src={editorImage}
                        alt={altText || 'Featured'}
                        className="w-full h-full object-cover transition-all duration-300"
                        style={{
                          objectPosition:
                            focusPoint === 'top'
                              ? 'center top'
                              : focusPoint === 'bottom'
                              ? 'center bottom'
                              : focusPoint === 'left'
                              ? 'left center'
                              : focusPoint === 'right'
                              ? 'right center'
                              : 'center center'
                        }}
                      />
                      {/* Focal Point Visual Marker */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-white/80 bg-[#074504]/40 flex items-center justify-center shadow-lg">
                          <Focus className="w-4 h-4 text-[#C0991B]" />
                        </div>
                      </div>

                      {/* Overlays */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                        <span className="px-2 py-0.5 bg-black/70 text-white font-mono text-[9px] rounded-lg">
                          Focus: {focusPoint.toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 bg-[#074504]/90 text-[#C0991B] font-black text-[9px] uppercase rounded-lg border border-[#C0991B]/40">
                          WebP 85% Opt
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditorImage('')}
                        className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-xl shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-gray-300 rounded-2xl text-center space-y-2 bg-gray-50/50">
                      <ImageIcon className="w-10 h-10 text-gray-300 mx-auto" />
                      <p className="text-xs font-bold text-gray-500">No featured image selected</p>
                      <p className="text-[10px] text-gray-400">Upload an image, enter a URL, or pick from Library</p>
                    </div>
                  )
                ) : (
                  <div className="space-y-3">
                    {videoUrl ? (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 aspect-video bg-gray-900 flex items-center justify-center">
                        {videoThumbnail ? (
                          <img src={videoThumbnail} alt="Video Poster" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4">
                            <Film className="w-10 h-10 text-[#C0991B] mx-auto mb-1" />
                            <p className="text-xs font-bold text-white">Video Embed Configured</p>
                            <p className="text-[10px] font-mono text-gray-400 truncate max-w-xs">{videoUrl}</p>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#074504] text-white text-[9px] font-black uppercase rounded-lg">
                          Video Asset
                        </span>
                      </div>
                    ) : (
                      <div className="p-8 border-2 border-dashed border-gray-300 rounded-2xl text-center space-y-2 bg-gray-50/50">
                        <Video className="w-10 h-10 text-gray-300 mx-auto" />
                        <p className="text-xs font-bold text-gray-500">No video embed configured</p>
                        <p className="text-[10px] text-gray-400">Enter a video URL & poster thumbnail below</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Image Focus Selector */}
                {mediaType === 'image' && (
                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1.5 flex items-center gap-1.5">
                      <Focus className="w-3.5 h-3.5 text-[#074504]" /> Image Focus Alignment Selector
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {(['center', 'top', 'bottom', 'left', 'right'] as const).map((fp) => (
                        <button
                          key={fp}
                          type="button"
                          onClick={() => setFocusPoint(fp)}
                          className={`py-1.5 px-2 rounded-xl text-[10px] font-black uppercase border transition-all cursor-pointer ${
                            focusPoint === fp
                              ? 'bg-[#074504] text-white border-[#074504] shadow-xs'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {fp}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: Upload, URL, Library & Metadata Inputs */}
              <div className="space-y-3.5">
                {mediaType === 'image' ? (
                  <>
                    {/* Media Folder & Collection Storage Destination */}
                    <div className="p-3 bg-amber-50/60 border border-[#C0991B]/40 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase text-[#074504] flex items-center gap-1.5">
                          <Folder className="w-3.5 h-3.5 text-[#C0991B]" /> Destination
                        </span>
                        <span className="text-[9px] font-bold text-gray-500">Auto-saved to Library</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {/* Folder Select + Create */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Folder</label>
                            <button
                              type="button"
                              onClick={() => setShowNewFolderModal(true)}
                              className="text-[9px] font-extrabold text-[#074504] hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              <FolderPlus className="w-2.5 h-2.5" /> + New
                            </button>
                          </div>
                          <select
                            value={selectedFolder}
                            onChange={(e) => setSelectedFolder(e.target.value)}
                            className="w-full p-1.5 text-xs font-bold border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#074504]"
                          >
                            {folders.map(f => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </div>

                        {/* Collection Select + Create */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Collection</label>
                            <button
                              type="button"
                              onClick={() => setShowNewCollectionModal(true)}
                              className="text-[9px] font-extrabold text-[#074504] hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              <Layers3 className="w-2.5 h-2.5" /> + New
                            </button>
                          </div>
                          <select
                            value={selectedCollection}
                            onChange={(e) => setSelectedCollection(e.target.value)}
                            className="w-full p-1.5 text-xs font-bold border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#074504]"
                          >
                            {collections.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Featured Image Upload / Library / URL buttons */}
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-1.5">
                        Choose Featured Image Source
                      </label>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {/* 1. Upload File */}
                        <label className="px-3 py-2 bg-[#074504] hover:bg-[#053203] text-white rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all">
                          <Upload className="w-3.5 h-3.5 text-[#C0991B]" />
                          <span>Upload</span>
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>

                        {/* 2. DAM Media Library */}
                        <button
                          type="button"
                          onClick={() => setShowDamModal(true)}
                          className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-[#074504] border border-[#C0991B]/50 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Layers className="w-3.5 h-3.5 text-[#C0991B]" />
                          <span>Library</span>
                        </button>

                        {/* 3. Social Share Preview */}
                        <button
                          type="button"
                          onClick={() => setShowSocialPreview(!showSocialPreview)}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Social</span>
                        </button>
                      </div>

                      {/* Image Direct URL input + Save to Library */}
                      <div className="space-y-1.5">
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input
                            type="text"
                            value={editorImage}
                            onChange={(e) => setEditorImage(e.target.value)}
                            placeholder="Or paste direct image URL (https://...)"
                            className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
                          />
                        </div>
                        {editorImage && (
                          <button
                            type="button"
                            onClick={handleSaveUrlToLibrary}
                            className="w-full py-1.5 bg-[#074504]/10 hover:bg-[#074504] text-[#074504] hover:text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <Save className="w-3 h-3 text-[#C0991B]" /> Save Image to Library under [{selectedFolder}] / [{selectedCollection}]
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Video Embed Inputs */}
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase text-gray-700">Video Embed URL</label>
                      <div className="relative">
                        <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                          type="text"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="YouTube, Vimeo or MP4 URL (e.g. https://youtube.com/watch?...)"
                          className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
                        />
                      </div>

                      <label className="block text-xs font-black uppercase text-gray-700 pt-1">Video Thumbnail Poster</label>
                      <input
                        type="text"
                        value={videoThumbnail}
                        onChange={(e) => setVideoThumbnail(e.target.value)}
                        placeholder="Video cover image URL..."
                        className="w-full px-3 py-2 text-xs font-mono border border-gray-200 rounded-xl"
                      />
                    </div>
                  </>
                )}

                {/* Alt Text, Caption & Credit Metadata */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-0.5">Alt Text (Accessibility & SEO)</label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Describe image for screen readers..."
                      className="w-full p-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-0.5">Caption</label>
                      <input
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Visible image caption..."
                        className="w-full p-2 text-xs border border-gray-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-0.5">Credit / Author</label>
                      <input
                        type="text"
                        value={credit}
                        onChange={(e) => setCredit(e.target.value)}
                        placeholder="Photo credit..."
                        className="w-full p-2 text-xs border border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Share Setting */}
                <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#074504]" />
                    <span className="text-xs font-bold text-emerald-900">Set as Social Share Card</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSocialShare}
                    onChange={(e) => setIsSocialShare(e.target.checked)}
                    className="w-4 h-4 rounded text-[#074504] focus:ring-[#074504] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Social Share Preview Modal / Accordion */}
            {showSocialPreview && (
              <div className="p-4 bg-gray-900 text-white rounded-2xl space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <span className="text-xs font-black uppercase text-[#C0991B] flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" /> Social Media OpenGraph Card Preview (Twitter / Facebook / LinkedIn)
                  </span>
                  <button onClick={() => setShowSocialPreview(false)} className="text-gray-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-white text-gray-900 rounded-xl overflow-hidden border border-gray-300 max-w-sm mx-auto shadow-lg">
                  <div className="h-40 bg-gray-200 relative overflow-hidden">
                    <img src={editorImage || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80'} alt="OG Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400">NEEMAHEEP.ORG</span>
                    <h4 className="text-xs font-black text-gray-900 line-clamp-1">{editorTitle || 'Untitled Article'}</h4>
                    <p className="text-[10px] text-gray-600 line-clamp-2">{editorExcerpt || editorMetaDesc || 'Discover empowering microfinance initiatives in Kenya.'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Add Content Block Section - Positioned immediately above Interactive Block Content Builder */}
          <div className="bg-white p-4.5 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-l-[#C0991B]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#074504]/10 rounded-2xl text-[#074504]">
                <Plus className="w-5 h-5 text-[#C0991B]" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#074504] block">
                  Add Content Block
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  Insert rich text, section headings, blockquotes, key takeaways, or media
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddBlock('paragraph')}
                className="px-3.5 py-2 bg-gray-100 hover:bg-[#074504] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer group shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600 group-hover:text-white" /> Paragraph
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('heading')}
                className="px-3.5 py-2 bg-gray-100 hover:bg-[#074504] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer group shadow-2xs"
              >
                <Heading className="w-3.5 h-3.5 text-[#074504] group-hover:text-white" /> Heading
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('quote')}
                className="px-3.5 py-2 bg-gray-100 hover:bg-[#C0991B] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer group shadow-2xs"
              >
                <Quote className="w-3.5 h-3.5 text-[#C0991B] group-hover:text-white" /> Blockquote
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('tip')}
                className="px-3.5 py-2 bg-gray-100 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer group shadow-2xs"
              >
                <Award className="w-3.5 h-3.5 text-amber-600 group-hover:text-white" /> Key Takeaway
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('image')}
                className="px-3.5 py-2 bg-gray-100 hover:bg-purple-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer group shadow-2xs"
              >
                <ImageIcon className="w-3.5 h-3.5 text-purple-600 group-hover:text-white" /> Inline Image
              </button>
            </div>
          </div>

          {/* Block-based Content Builder */}
          <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-xs space-y-5 border-t-4 border-t-[#C0991B]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#074504] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#C0991B]" /> Interactive Block Content Builder
                </h3>
                <p className="text-[10px] text-gray-500 font-semibold">
                  Standardized format automatically applied per added content block
                </p>
              </div>

              <span className="text-[11px] font-extrabold text-[#074504] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                {(editorBlocks || []).length} Blocks Active
              </span>
            </div>

            {/* Render Existing Blocks with Standardized Block Parameters */}
            <div className="space-y-4">
              {(editorBlocks || []).map((block, idx) => (
                <div key={block.id || idx} className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-3 relative group transition-all hover:border-gray-300">
                  {/* Block Header Controls */}
                  <div className="flex items-center justify-between text-[11px] font-extrabold uppercase text-gray-600 border-b border-gray-200/60 pb-2">
                    <span className="flex items-center gap-1.5">
                      {block.type === 'heading' && <Heading className="w-3.5 h-3.5 text-[#074504]" />}
                      {block.type === 'paragraph' && <FileText className="w-3.5 h-3.5 text-blue-600" />}
                      {block.type === 'quote' && <Quote className="w-3.5 h-3.5 text-[#C0991B]" />}
                      {block.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-purple-600" />}
                      {block.type === 'tip' && <Award className="w-3.5 h-3.5 text-amber-600" />}
                      <span className="text-[#074504] font-black">{block.type} Block</span>
                      <span className="text-[9px] font-bold text-gray-400 normal-case bg-white px-2 py-0.5 rounded-md border border-gray-200">
                        Auto-Formatted
                      </span>
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveBlock(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveBlock(idx, 'down')}
                        disabled={idx === (editorBlocks || []).length - 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveBlock(block.id)}
                        className="p-1 hover:bg-rose-100 text-rose-600 rounded cursor-pointer"
                        title="Remove Block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* STANDARDIZED HEADING BLOCK */}
                  {block.type === 'heading' && (
                    <div className="space-y-2.5">
                      <input
                        type="text"
                        value={block.content || ''}
                        onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                        placeholder="Enter section heading title..."
                        className="w-full px-3 py-2 text-sm font-extrabold text-[#074504] border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#074504]"
                      />

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Heading Hierarchy</label>
                          <select
                            value={block.headingLevel || 'h2'}
                            onChange={(e) => handleUpdateBlockField(block.id, 'headingLevel', e.target.value)}
                            className="w-full p-1.5 font-bold border border-gray-200 rounded-lg bg-white"
                          >
                            <option value="h1">H1 - Article Title / Major Display (30px)</option>
                            <option value="h2">H2 - Primary Section Heading (22px)</option>
                            <option value="h3">H3 - Sub-section Title (18px)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Text Alignment</label>
                          <select
                            value={block.alignment || 'left'}
                            onChange={(e) => handleUpdateBlockField(block.id, 'alignment', e.target.value)}
                            className="w-full p-1.5 font-bold border border-gray-200 rounded-lg bg-white"
                          >
                            <option value="left">Left Aligned (Standard)</option>
                            <option value="center">Centered Heading</option>
                            <option value="right">Right Aligned</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STANDARDIZED PARAGRAPH BLOCK */}
                  {block.type === 'paragraph' && (
                    <div className="space-y-2.5">
                      <textarea
                        rows={4}
                        value={block.content || ''}
                        onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                        placeholder="Write paragraph narrative here..."
                        className="w-full p-3 text-xs font-normal border border-gray-300 rounded-xl bg-white leading-relaxed focus:ring-2 focus:ring-[#074504]"
                      />

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Typography Style</label>
                          <select
                            value={block.fontSize || 'normal'}
                            onChange={(e) => handleUpdateBlockField(block.id, 'fontSize', e.target.value)}
                            className="w-full p-1.5 font-bold border border-gray-200 rounded-lg bg-white"
                          >
                            <option value="normal">Standard Body Text (16px)</option>
                            <option value="lead">Lead Paragraph / Excerpt (18px)</option>
                            <option value="compact">Compact Note Text (14px)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Paragraph Formatting</label>
                          <select
                            value={block.alignment || 'left'}
                            onChange={(e) => handleUpdateBlockField(block.id, 'alignment', e.target.value)}
                            className="w-full p-1.5 font-bold border border-gray-200 rounded-lg bg-white"
                          >
                            <option value="left">Standard Left Aligned</option>
                            <option value="justify">Justified Margins</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STANDARDIZED BLOCKQUOTE BLOCK */}
                  {block.type === 'quote' && (
                    <div className="space-y-2.5">
                      <textarea
                        rows={2}
                        value={block.content || ''}
                        onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                        placeholder="Enter quote or key beneficiary statement..."
                        className="w-full p-3 text-xs font-semibold italic text-[#074504] border border-[#C0991B]/50 rounded-xl bg-amber-50/30 focus:ring-2 focus:ring-[#074504]"
                      />

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Quote Speaker / Author Name</label>
                          <input
                            type="text"
                            value={block.authorName || 'Neema HEEP Beneficiary'}
                            onChange={(e) => handleUpdateBlockField(block.id, 'authorName', e.target.value)}
                            placeholder="Speaker Name"
                            className="w-full p-1.5 font-bold border border-gray-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Title / Organization Role</label>
                          <input
                            type="text"
                            value={block.authorRole || 'Microfinance Loan Recipient'}
                            onChange={(e) => handleUpdateBlockField(block.id, 'authorRole', e.target.value)}
                            placeholder="Role / Location"
                            className="w-full p-1.5 font-bold border border-gray-200 rounded-lg bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STANDARDIZED KEY TAKEAWAY / TIP BLOCK */}
                  {block.type === 'tip' && (
                    <div className="space-y-2.5">
                      <textarea
                        rows={2}
                        value={block.content || ''}
                        onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                        placeholder="Enter key takeaway summary or callout tip..."
                        className="w-full p-3 text-xs font-medium border border-emerald-300 rounded-xl bg-emerald-50/40 text-[#074504] focus:ring-2 focus:ring-[#074504]"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Callout Badge Type</label>
                          <select
                            value={block.calloutType || 'takeaway'}
                            onChange={(e) => handleUpdateBlockField(block.id, 'calloutType', e.target.value)}
                            className="w-full p-1.5 font-bold border border-gray-200 rounded-lg bg-white"
                          >
                            <option value="takeaway">Key Takeaway (Gold / Green)</option>
                            <option value="pro">Pro Tip (Blue Highlight)</option>
                            <option value="notice">Important Notice (Amber Warning)</option>
                            <option value="stat">Impact Metric Highlight</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STANDARDIZED INLINE IMAGE BLOCK */}
                  {block.type === 'image' && (
                    <div className="space-y-2.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={block.content || ''}
                          onChange={(e) => handleUpdateBlock(block.id, e.target.value)}
                          placeholder="Image URL (e.g. https://images.unsplash.com/...)"
                          className="flex-1 p-2 text-xs font-mono border border-gray-200 rounded-xl bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowDamModal(true)}
                          className="px-3 py-1.5 bg-[#074504] text-white text-xs font-black uppercase rounded-xl hover:bg-[#053203] flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5 text-[#C0991B]" /> Browse DAM
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Caption & Attribution</label>
                          <input
                            type="text"
                            value={block.imageCaption || ''}
                            onChange={(e) => handleUpdateBlockField(block.id, 'imageCaption', e.target.value)}
                            placeholder="Photo description / credit..."
                            className="w-full p-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Display Framing</label>
                          <select
                            value={block.imageLayout || 'full'}
                            onChange={(e) => handleUpdateBlockField(block.id, 'imageLayout', e.target.value)}
                            className="w-full p-1.5 font-bold border border-gray-200 rounded-lg bg-white"
                          >
                            <option value="full">Full Width Banner</option>
                            <option value="card">Bounded Media Card</option>
                            <option value="rounded">Rounded Frame with Soft Shadow</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Block Bar */}
            <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase text-gray-400 mr-2">Add Content Block:</span>
              <button
                type="button"
                onClick={() => handleAddBlock('paragraph')}
                className="px-3 py-1.5 bg-gray-100 hover:bg-[#074504] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Paragraph
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('heading')}
                className="px-3 py-1.5 bg-gray-100 hover:bg-[#074504] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Heading className="w-3.5 h-3.5" /> Heading
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('quote')}
                className="px-3 py-1.5 bg-gray-100 hover:bg-[#C0991B] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Quote className="w-3.5 h-3.5" /> Blockquote
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('tip')}
                className="px-3 py-1.5 bg-gray-100 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" /> Key Takeaway
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('image')}
                className="px-3 py-1.5 bg-gray-100 hover:bg-purple-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" /> Inline Image
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Publishing, Taxonomy & SEO Controls */}
        <div className="space-y-6">
          {/* Publication Status & CMS Rule Card */}
          <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C0991B]" /> Publication Status
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                editorStatus === 'Published' ? 'bg-emerald-600 text-white shadow-xs' :
                editorStatus === 'Scheduled' ? 'bg-blue-600 text-white shadow-xs' :
                editorStatus === 'Archived' ? 'bg-gray-600 text-white shadow-xs' :
                'bg-amber-500 text-white shadow-xs'
              }`}>
                {editorStatus || 'Draft'}
              </span>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs space-y-2 text-gray-600">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#074504] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong className="text-gray-900">CMS Rule:</strong> Unpublished articles are automatically saved as <strong>Drafts</strong>. Click the <strong>"Publish Article Now"</strong> button when your writer is ready to publish live.
                </p>
              </div>
              {expiryDate && (
                <div className="flex items-start gap-2 pt-2 border-t border-gray-200/60">
                  <Archive className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Article expiry limit set for <strong className="text-gray-900">{new Date(expiryDate).toLocaleString()}</strong>. Expired articles are automatically moved to <strong>Archived</strong> status.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* DEDICATED ARTICLE SCHEDULING FORM */}
          <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#C0991B]" /> Article Scheduling & Release
              </span>
              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-[#074504] text-white rounded-md">
                Automated
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Scheduled Target Date & Time */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#074504]" /> Scheduled Target Release Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full p-2.5 text-xs font-bold border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#074504]"
                />
              </div>

              {/* Timezone Support */}
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Timezone Support</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full p-2.5 text-xs font-bold border border-gray-300 rounded-xl bg-white"
                >
                  <option value="EAT (Nairobi, UTC+3)">EAT (Nairobi, UTC+3 - Default)</option>
                  <option value="EST (New York, UTC-5)">EST (New York, UTC-5)</option>
                  <option value="PST (Los Angeles, UTC-8)">PST (Los Angeles, UTC-8)</option>
                  <option value="GMT/UTC (London, UTC+0)">GMT/UTC (London, UTC+0)</option>
                  <option value="CET (Paris, UTC+1)">CET (Paris, UTC+1)</option>
                  <option value="GST (Dubai, UTC+4)">GST (Dubai, UTC+4)</option>
                </select>
              </div>

              {/* Article Expiry Date */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Article Expiry Date (Optional)
                  </label>
                  {expiryDate && (
                    <button
                      type="button"
                      onClick={() => setExpiryDate('')}
                      className="text-[9px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input
                  type="datetime-local"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-2.5 text-xs font-bold border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#074504]"
                />
              </div>

              {/* Auto Archive Toggle */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                    <Archive className="w-3.5 h-3.5 text-gray-500" /> Auto Archive on Expiry
                  </span>
                  <p className="text-[9px] text-gray-400 font-medium">Expired articles are automatically archived</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoArchive(!autoArchive)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    autoArchive ? 'bg-[#074504]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      autoArchive ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Recurring Publishing Pattern */}
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5 text-[#074504]" /> Recurring Publishing
                </label>
                <select
                  value={recurringPattern}
                  onChange={(e) => setRecurringPattern(e.target.value as any)}
                  className="w-full p-2.5 text-xs font-bold border border-gray-300 rounded-xl bg-white"
                >
                  <option value="none">None (One-time Article Release)</option>
                  <option value="daily">Daily Refresh</option>
                  <option value="weekly">Weekly Cycle (Every 7 Days)</option>
                  <option value="monthly">Monthly Digest Cycle</option>
                  <option value="quarterly">Quarterly Report Series</option>
                  <option value="annually">Annual Publication Cycle</option>
                </select>
              </div>

              {/* Action Button to Schedule */}
              <button
                type="button"
                onClick={handleSaveScheduled}
                className="w-full py-3 bg-[#074504] hover:bg-[#053203] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2 border border-[#C0991B]/50"
              >
                <Calendar className="w-4 h-4 text-[#C0991B]" /> Save and Schedule
              </button>
            </div>
          </div>

          {/* Author & Visibility Card */}
          <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                <span>Author Profile</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-[#074504] text-[9px] font-black uppercase rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#C0991B]" /> Logged-In User
                </span>
              </label>
              
              <div className="p-3 bg-amber-50/60 border border-[#C0991B]/40 rounded-2xl flex items-center gap-3">
                <img
                  src={activeUserAuthor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={activeUserAuthor.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#074504] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-black text-gray-900 truncate">{activeUserAuthor.name}</h4>
                  <p className="text-[10px] font-extrabold text-[#074504] uppercase">{activeUserAuthor.role || 'Active Session Editor'}</p>
                  <p className="text-[9px] text-gray-400 font-mono truncate">{activeUserAuthor.email}</p>
                </div>
                <div className="p-1.5 bg-[#074504] text-[#C0991B] rounded-xl shrink-0" title="Author profile locked to active logged-in user account">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-[9px] text-gray-400 font-semibold mt-1">
                Default author profile locked to logged-in user for editorial compliance.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-700">Featured Article</span>
              <button
                type="button"
                onClick={() => setEditorIsFeatured(!editorIsFeatured)}
                className={`w-11 h-6 rounded-full transition-colors p-1 cursor-pointer ${
                  editorIsFeatured ? 'bg-[#074504]' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    editorIsFeatured ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Taxonomy: Category & Tags */}
          <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Folder className="w-4 h-4 text-[#074504]" /> Category & Tags
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Primary Category</label>
              <select
                value={editorCategory}
                onChange={(e) => setEditorCategory(e.target.value)}
                className="w-full p-2.5 text-xs font-bold border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
              >
                {(categories || []).map((c) => (
                  <option key={c.id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Type tag & press Enter..."
                  className="flex-1 p-2 text-xs border border-gray-200 rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-[#074504] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(editorTags || []).map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 bg-emerald-50 text-[#074504] font-bold text-[11px] rounded-lg border border-emerald-200 flex items-center gap-1"
                  >
                    #{t}
                    <button onClick={() => handleRemoveTag(t)} className="hover:text-rose-600 cursor-pointer">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SEO & Meta Recommendation Engine */}
          <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-600" /> SEO Optimization
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono ${
                seoScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                Score: {seoScore}/100
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Focus Keyword</label>
              <input
                type="text"
                value={editorSeoFocus}
                onChange={(e) => setEditorSeoFocus(e.target.value)}
                placeholder="e.g. Microfinance Kenya"
                className="w-full p-2 text-xs border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Meta Description</label>
              <textarea
                rows={2}
                value={editorMetaDesc}
                onChange={(e) => setEditorMetaDesc(e.target.value)}
                placeholder="Google search snippet description..."
                className="w-full p-2 text-xs border border-gray-200 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* DAM MEDIA LIBRARY PICKER MODAL */}
      {showDamModal && (() => {
        const storeMedia = blogStore.getMedia() || [];
        const combinedMedia = storeMedia.length > 0 ? storeMedia : (media && media.length > 0 ? media : [
          { id: 'm1', displayName: 'Microfinance Beneficiaries Meeting', filename: 'beneficiaries.webp', src: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80', thumbnailUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80', folder: 'Articles', collection: 'Main Publication' },
          { id: 'm2', displayName: 'Kenya Small Business Workshop', filename: 'workshop.webp', src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', folder: 'Impact Stories', collection: 'Microfinance 2026' },
          { id: 'm3', displayName: 'Annual Report Impact Highlights', filename: 'annual_report.webp', src: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80', thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80', folder: 'Reports', collection: 'Annual Reports' },
          { id: 'm4', displayName: 'Women Leadership Grant Event', filename: 'women_grant.webp', src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80', thumbnailUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80', folder: 'Featured Media', collection: 'Community Outreach' },
        ]);

        const filtered = combinedMedia.filter((m: any) => {
          const matchSearch = !damSearch || (m.displayName || m.filename || '').toLowerCase().includes(damSearch.toLowerCase());
          const matchFolder = damFolderFilter === 'All' || m.folder === damFolderFilter;
          const matchCollection = damCollectionFilter === 'All' || m.collection === damCollectionFilter;
          return matchSearch && matchFolder && matchCollection;
        });

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col border border-gray-100">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#074504] text-[#C0991B] rounded-xl">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-gray-900">
                      Enterprise Digital Asset Management (DAM) Library
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold">
                      Select featured image or manage media folders & collections
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDamModal(false)}
                  className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Controls Bar: Search, Folder Filter, Collection Filter & Create Buttons */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl space-y-2 shrink-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={damSearch}
                      onChange={(e) => setDamSearch(e.target.value)}
                      placeholder="Search assets..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-white"
                    />
                  </div>

                  {/* Folder Filter */}
                  <select
                    value={damFolderFilter}
                    onChange={(e) => setDamFolderFilter(e.target.value)}
                    className="w-full p-1.5 text-xs font-bold border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="All">All Folders ({folders.length})</option>
                    {folders.map(f => (
                      <option key={f} value={f}>Folder: {f}</option>
                    ))}
                  </select>

                  {/* Collection Filter */}
                  <select
                    value={damCollectionFilter}
                    onChange={(e) => setDamCollectionFilter(e.target.value)}
                    className="w-full p-1.5 text-xs font-bold border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="All">All Collections ({collections.length})</option>
                    {collections.map(c => (
                      <option key={c} value={c}>Collection: {c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="font-extrabold text-[#074504]">
                    Showing {filtered.length} media assets
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowNewFolderModal(true)}
                      className="px-2.5 py-1 bg-white hover:bg-[#074504] hover:text-white border border-gray-200 text-[#074504] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <FolderPlus className="w-3 h-3 text-[#C0991B]" /> + New Folder
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewCollectionModal(true)}
                      className="px-2.5 py-1 bg-white hover:bg-[#074504] hover:text-white border border-gray-200 text-[#074504] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Layers3 className="w-3 h-3 text-[#C0991B]" /> + New Collection
                    </button>
                  </div>
                </div>
              </div>

              {/* Media Grid */}
              <div className="overflow-y-auto flex-1 pr-1 space-y-3 min-h-[220px]">
                {filtered.length === 0 ? (
                  <div className="text-center py-12 space-y-2 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <ImageIcon className="w-10 h-10 text-gray-300 mx-auto" />
                    <p className="text-xs font-bold text-gray-500">No media items found matching criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filtered.map((m: any) => {
                      const imgSrc = m.src || m.thumbnailUrl || m.url;
                      return (
                        <div
                          key={m.id}
                          onClick={() => {
                            setEditorImage(imgSrc);
                            if (m.folder) setSelectedFolder(m.folder);
                            if (m.collection) setSelectedCollection(m.collection);
                            setShowDamModal(false);
                            showToast(`Selected "${m.displayName || m.filename}" from DAM Library`, 'success');
                          }}
                          className="group bg-white border border-gray-200 hover:border-[#074504] hover:shadow-md rounded-2xl overflow-hidden cursor-pointer transition-all p-2 space-y-1.5 flex flex-col justify-between"
                        >
                          <div className="h-28 rounded-xl overflow-hidden bg-gray-100 relative">
                            <img src={imgSrc} alt={m.displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-[8px] font-mono rounded">
                              {m.folder || 'Articles'}
                            </span>
                          </div>
                          <div>
                            <p className="text-[11px] font-extrabold text-gray-900 truncate">{m.displayName || m.filename}</p>
                            <p className="text-[9px] font-bold text-[#074504] uppercase flex items-center gap-1">
                              <span>Collection: {m.collection || 'Featured Media'}</span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between shrink-0">
                <span className="text-[10px] text-gray-400 font-bold">
                  Click any image card to set as primary article featured image.
                </span>
                <button
                  onClick={() => setShowDamModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* CREATE NEW FOLDER MODAL */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#074504] text-[#C0991B] rounded-xl">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black uppercase text-gray-900">Create New Media Folder</h3>
              </div>
              <button onClick={() => setShowNewFolderModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Folder Name</label>
              <input
                type="text"
                value={newFolderNameInput}
                onChange={(e) => setNewFolderNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                placeholder="e.g. Field Photography, Annual Audits 2026..."
                className="w-full px-3.5 py-2.5 text-xs font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#074504]"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-[#074504] text-white text-xs font-black uppercase rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-[#C0991B]" /> Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW COLLECTION MODAL */}
      {showNewCollectionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#074504] text-[#C0991B] rounded-xl">
                  <Layers3 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black uppercase text-gray-900">Create New Collection</h3>
              </div>
              <button onClick={() => setShowNewCollectionModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Collection Name</label>
              <input
                type="text"
                value={newCollectionNameInput}
                onChange={(e) => setNewCollectionNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
                placeholder="e.g. Kenya Microloans Series, CSR Initiatives..."
                className="w-full px-3.5 py-2.5 text-xs font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#074504]"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowNewCollectionModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCollection}
                className="px-4 py-2 bg-[#074504] text-white text-xs font-black uppercase rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-[#C0991B]" /> Create Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

