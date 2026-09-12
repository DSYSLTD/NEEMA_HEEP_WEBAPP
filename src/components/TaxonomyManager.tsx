import React, { useState, useEffect, useMemo } from 'react';
import { 
  FolderTree, Tag as TagIcon, Plus, Search, Filter, 
  Trash2, Edit3, ArrowRight, Layers, CheckCircle2, AlertCircle, 
  RefreshCw, Download, Upload, Copy, ExternalLink, HelpCircle, 
  ChevronRight, ChevronDown, Check, ShieldCheck,
  List, Grid, Hash, AlertTriangle, X, Info
} from 'lucide-react';
import { blogStore, BlogCategory, BlogTag, BlogPostItem } from '../lib/blogStore';

interface TaxonomyManagerProps {
  onSelectCategoryFilter?: (catName: string) => void;
  onOpenArticleEditor?: () => void;
}

export const TaxonomyManager: React.FC<TaxonomyManagerProps> = ({
  onSelectCategoryFilter,
  onOpenArticleEditor
}) => {
  // Main view tab: Categories vs Tags
  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');

  // Core Data State
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [posts, setPosts] = useState<BlogPostItem[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParentFilter, setSelectedParentFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'posts' | 'newest'>('name');

  // Category Modal / Form State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catFormData, setCatFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#074504',
    parentCategory: '',
    seoTitle: '',
    seoDescription: ''
  });

  // Tag Modal / Form State
  const [showTagModal, setShowTagModal] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [tagFormData, setTagFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#074504'
  });

  // Tag Merge Modal State
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [sourceTagId, setSourceTagId] = useState<string>('');
  const [targetTagId, setTargetTagId] = useState<string>('');

  // Delete Confirmation Dialog State
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'category' | 'tag'; item: BlogCategory | BlogTag } | null>(null);

  // Notification / Toast Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load Data from blogStore
  const reloadData = () => {
    const loadedCats = blogStore.getCategories();
    const loadedTags = blogStore.getTags();
    const loadedPosts = blogStore.getPosts();

    // Recalculate post counts for categories and tags based on real posts
    const catsWithCounts = loadedCats.map(c => {
      const count = loadedPosts.filter(p => p.category === c.name).length;
      return { ...c, postCount: count };
    });

    const tagsWithCounts = loadedTags.map(t => {
      const count = loadedPosts.filter(p => p.tags && p.tags.includes(t.name)).length;
      return { ...t, postCount: count };
    });

    setCategories(catsWithCounts);
    setTags(tagsWithCounts);
    setPosts(loadedPosts);
  };

  useEffect(() => {
    reloadData();

    const handleUpdate = () => reloadData();
    window.addEventListener('neema_cms_categories_updated', handleUpdate);
    window.addEventListener('neema_cms_tags_updated', handleUpdate);
    window.addEventListener('neema_cms_posts_updated', handleUpdate);

    return () => {
      window.removeEventListener('neema_cms_categories_updated', handleUpdate);
      window.removeEventListener('neema_cms_tags_updated', handleUpdate);
      window.removeEventListener('neema_cms_posts_updated', handleUpdate);
    };
  }, []);

  // Helper for generating URL slugs
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // --- CATEGORY CRUD HANDLERS ---
  const handleOpenNewCategory = () => {
    setEditingCatId(null);
    setCatFormData({
      name: '',
      slug: '',
      description: '',
      color: '#074504',
      parentCategory: '',
      seoTitle: '',
      seoDescription: ''
    });
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat: BlogCategory) => {
    setEditingCatId(cat.id);
    setCatFormData({
      name: cat.name,
      slug: cat.slug || generateSlug(cat.name),
      description: cat.description || '',
      color: cat.color || '#074504',
      parentCategory: (cat as any).parentCategory || '',
      seoTitle: (cat as any).seoTitle || `${cat.name} | Neema Heep`,
      seoDescription: (cat as any).seoDescription || cat.description || ''
    });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormData.name.trim()) return;

    const slug = catFormData.slug.trim() ? generateSlug(catFormData.slug) : generateSlug(catFormData.name);

    if (editingCatId) {
      // Update
      const updatedCats = categories.map(c => {
        if (c.id === editingCatId) {
          const oldName = c.name;
          const updatedCat: BlogCategory = {
            ...c,
            name: catFormData.name.trim(),
            slug,
            description: catFormData.description.trim(),
            color: catFormData.color,
            ...(catFormData.parentCategory ? { parentCategory: catFormData.parentCategory } : {}),
            ...(catFormData.seoTitle ? { seoTitle: catFormData.seoTitle } : {}),
            ...(catFormData.seoDescription ? { seoDescription: catFormData.seoDescription } : {})
          } as any;

          // If category name changed, update posts referencing this category name
          if (oldName !== catFormData.name.trim()) {
            const updatedPosts = posts.map(p => {
              if (p.category === oldName) {
                return { ...p, category: catFormData.name.trim() };
              }
              return p;
            });
            blogStore.savePosts(updatedPosts);
          }

          return updatedCat;
        }
        return c;
      });

      blogStore.saveCategories(updatedCats);
      showToast(`Category "${catFormData.name}" updated successfully!`);
    } else {
      // Create New
      const newCat: BlogCategory = {
        id: `cat-${Date.now()}`,
        name: catFormData.name.trim(),
        slug,
        description: catFormData.description.trim(),
        color: catFormData.color,
        postCount: 0,
        ...(catFormData.parentCategory ? { parentCategory: catFormData.parentCategory } : {}),
        ...(catFormData.seoTitle ? { seoTitle: catFormData.seoTitle } : {}),
        ...(catFormData.seoDescription ? { seoDescription: catFormData.seoDescription } : {})
      } as any;

      blogStore.saveCategories([...categories, newCat]);
      showToast(`Category "${catFormData.name}" created!`);
    }

    setShowCategoryModal(false);
    reloadData();
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'category') {
      const cat = deleteTarget.item as BlogCategory;
      const filtered = categories.filter(c => c.id !== cat.id);
      blogStore.saveCategories(filtered);
      showToast(`Category "${cat.name}" deleted.`);
    } else {
      const tag = deleteTarget.item as BlogTag;
      const filtered = tags.filter(t => t.id !== tag.id);
      blogStore.saveTags(filtered);
      showToast(`Tag "#${tag.name}" deleted.`);
    }

    setDeleteTarget(null);
    reloadData();
  };

  // --- TAG CRUD HANDLERS ---
  const handleOpenNewTag = () => {
    setEditingTagId(null);
    setTagFormData({
      name: '',
      slug: '',
      description: '',
      color: '#074504'
    });
    setShowTagModal(true);
  };

  const handleOpenEditTag = (t: BlogTag) => {
    setEditingTagId(t.id);
    setTagFormData({
      name: t.name,
      slug: t.slug || generateSlug(t.name),
      description: (t as any).description || '',
      color: (t as any).color || '#074504'
    });
    setShowTagModal(true);
  };

  const handleSaveTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagFormData.name.trim()) return;

    const cleanName = tagFormData.name.replace(/^#/, '').trim();
    const slug = tagFormData.slug.trim() ? generateSlug(tagFormData.slug) : generateSlug(cleanName);

    if (editingTagId) {
      const updatedTags = tags.map(t => {
        if (t.id === editingTagId) {
          const oldName = t.name;
          const updated: BlogTag = {
            ...t,
            name: cleanName,
            slug,
            ...(tagFormData.description ? { description: tagFormData.description } : {}),
            ...(tagFormData.color ? { color: tagFormData.color } : {})
          } as any;

          // If tag name changed, update posts array
          if (oldName !== cleanName) {
            const updatedPosts = posts.map(p => {
              if (p.tags && p.tags.includes(oldName)) {
                return { ...p, tags: p.tags.map(tag => tag === oldName ? cleanName : tag) };
              }
              return p;
            });
            blogStore.savePosts(updatedPosts);
          }

          return updated;
        }
        return t;
      });

      blogStore.saveTags(updatedTags);
      showToast(`Tag "#${cleanName}" updated successfully!`);
    } else {
      const newTag: BlogTag = {
        id: `tag-${Date.now()}`,
        name: cleanName,
        slug,
        postCount: 0,
        ...(tagFormData.description ? { description: tagFormData.description } : {}),
        ...(tagFormData.color ? { color: tagFormData.color } : {})
      } as any;

      blogStore.saveTags([...tags, newTag]);
      showToast(`Tag "#${cleanName}" created!`);
    }

    setShowTagModal(false);
    reloadData();
  };

  // Merge Tags Logic
  const handleMergeTags = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceTagId || !targetTagId || sourceTagId === targetTagId) {
      showToast('Please select two distinct tags to merge.');
      return;
    }

    const sourceTag = tags.find(t => t.id === sourceTagId);
    const targetTag = tags.find(t => t.id === targetTagId);

    if (!sourceTag || !targetTag) return;

    // Replace source tag with target tag in all posts
    const updatedPosts = posts.map(p => {
      if (p.tags && p.tags.includes(sourceTag.name)) {
        const newTagsList = Array.from(new Set([...p.tags.filter(t => t !== sourceTag.name), targetTag.name]));
        return { ...p, tags: newTagsList };
      }
      return p;
    });

    blogStore.savePosts(updatedPosts);

    // Remove source tag
    const remainingTags = tags.filter(t => t.id !== sourceTagId);
    blogStore.saveTags(remainingTags);

    showToast(`Merged "#${sourceTag.name}" into "#${targetTag.name}". All articles updated.`);
    setShowMergeModal(false);
    setSourceTagId('');
    setTargetTagId('');
    reloadData();
  };

  // Filtered & Sorted Categories
  const filteredCategories = useMemo(() => {
    return categories
      .filter(c => {
        const matchesQuery = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesParent = selectedParentFilter === 'All' || 
                              (selectedParentFilter === 'TopLevel' && !(c as any).parentCategory) ||
                              (c as any).parentCategory === selectedParentFilter;

        return matchesQuery && matchesParent;
      })
      .sort((a, b) => {
        if (sortBy === 'posts') return (b.postCount || 0) - (a.postCount || 0);
        return a.name.localeCompare(b.name);
      });
  }, [categories, searchQuery, selectedParentFilter, sortBy]);

  // Filtered & Sorted Tags
  const filteredTags = useMemo(() => {
    return tags
      .filter(t => {
        return t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               t.slug.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        if (sortBy === 'posts') return (b.postCount || 0) - (a.postCount || 0);
        return a.name.localeCompare(b.name);
      });
  }, [tags, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#074504] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 border-2 border-[#C0991B]">
          <CheckCircle2 className="w-5 h-5 text-[#C0991B]" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#074504] text-white p-6 md:p-8 rounded-2xl shadow-lg border border-[#C0991B]/30 space-y-4">
        {/* 1. Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <FolderTree className="w-6 h-6 text-[#C0991B] shrink-0" />
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase">
              <span>Categories &amp; Taxonomy Management</span>
            </h1>
          </div>

          {/* Primary Tab Selector */}
          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-xl border border-white/20">
            <button
              type="button"
              onClick={() => { setActiveTab('categories'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#C0991B] text-[#074504] shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Categories ({categories.length})</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('tags'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                activeTab === 'tags'
                  ? 'bg-[#C0991B] text-[#074504] shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <TagIcon className="w-3.5 h-3.5" />
              <span>Tags ({tags.length})</span>
            </button>
          </div>
        </div>

        {/* 2. Description Text */}
        <p className="text-xs md:text-sm text-gray-200 font-medium leading-relaxed max-w-4xl">
          Create, edit, and manage blog categories and tags to organize publication content across your platform.
        </p>

        {/* 3. CTA buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleOpenNewCategory}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#C0991B] hover:bg-[#a88414] text-[#074504] rounded-xl text-xs font-black uppercase shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Category</span>
          </button>
          <button
            type="button"
            onClick={handleOpenNewTag}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-black uppercase shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C0991B]" />
            <span>New Tag</span>
          </button>
          <button
            type="button"
            onClick={() => setShowMergeModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-black uppercase shadow-md transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#C0991B]" />
            <span>Merge Tags</span>
          </button>
        </div>
      </div>

      {/* Control Action Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#C0991B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'categories' ? 'Search categories by name or slug...' : 'Search tags...'}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-[#C0991B] transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C0991B]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          
          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#C0991B] cursor-pointer"
          >
            <option value="name">Sort by Name (A-Z)</option>
            <option value="posts">Sort by Post Count</option>
          </select>

          {/* Tab Specific Action Buttons */}
          {activeTab === 'categories' ? (
            <button
              onClick={handleOpenNewCategory}
              className="flex items-center gap-2 px-4 py-2 bg-[#074504] hover:bg-[#C0991B] text-white hover:text-[#074504] border border-[#C0991B]/50 hover:border-[#074504] rounded-xl text-xs font-black uppercase shadow-xs transition-all duration-200 cursor-pointer group"
            >
              <Plus className="w-4 h-4 text-[#C0991B] group-hover:text-[#074504] transition-colors" />
              <span>New Category</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMergeModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-amber-50 hover:bg-[#074504] text-[#074504] hover:text-white border border-[#C0991B]/40 hover:border-[#C0991B] rounded-xl text-xs font-black uppercase transition-all duration-200 cursor-pointer group"
              >
                <Layers className="w-4 h-4 text-[#C0991B] group-hover:text-[#C0991B] transition-colors" />
                <span>Merge Tags</span>
              </button>
              <button
                onClick={handleOpenNewTag}
                className="flex items-center gap-2 px-4 py-2 bg-[#074504] hover:bg-[#C0991B] text-white hover:text-[#074504] border border-[#C0991B]/50 hover:border-[#074504] rounded-xl text-xs font-black uppercase shadow-xs transition-all duration-200 cursor-pointer group"
              >
                <Plus className="w-4 h-4 text-[#C0991B] group-hover:text-[#074504] transition-colors" />
                <span>New Tag</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CATEGORIES MANAGEMENT VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          
          {filteredCategories.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-4">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-[#C0991B] border border-[#C0991B]/30">
                <FolderTree className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-gray-800 uppercase">No Categories Found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  {searchQuery ? `No category matching "${searchQuery}"` : 'Get started by creating your first blog category.'}
                </p>
              </div>
              <button
                onClick={handleOpenNewCategory}
                className="px-4 py-2 bg-[#074504] hover:bg-[#C0991B] text-white hover:text-[#074504] border border-[#C0991B]/50 hover:border-[#074504] text-xs font-bold rounded-xl cursor-pointer transition-all duration-200"
              >
                + Create Category
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((cat) => (
                <div 
                  key={cat.id} 
                  className="bg-white rounded-2xl border-t-2 border-t-[#C0991B] border-x border-b border-gray-200 p-5 shadow-xs hover:border-[#C0991B] hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs border border-black/10" 
                          style={{ backgroundColor: cat.color || '#C0991B' }} 
                        />
                        <h3 className="font-black text-sm text-[#074504] uppercase tracking-tight group-hover:text-[#C0991B] transition-colors">
                          {cat.name}
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-50 text-[#7a600d] border border-[#C0991B]/30 rounded-full text-[10px] font-black shrink-0">
                        {cat.postCount} {cat.postCount === 1 ? 'post' : 'posts'}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-gray-500 bg-amber-50/50 border border-amber-100/80 px-2.5 py-1 rounded-lg inline-block">
                      /{cat.slug}
                    </div>

                    {cat.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 font-medium">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => onSelectCategoryFilter && onSelectCategoryFilter(cat.name)}
                      className="text-[11px] font-black text-[#074504] hover:text-[#C0991B] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>View Articles</span>
                      <ArrowRight className="w-3 h-3 text-[#C0991B]" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditCategory(cat)}
                        title="Edit Category"
                        className="p-1.5 bg-gray-100 hover:bg-[#074504] hover:text-white rounded-lg text-gray-600 transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: 'category', item: cat })}
                        title="Delete Category"
                        className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg text-red-600 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAGS MANAGEMENT VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'tags' && (
        <div className="bg-white p-6 rounded-2xl border-t-2 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-[#C0991B]" />
                All Blog Tags ({filteredTags.length})
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Click any tag to edit or delete. Tags organize articles across themes and keywords.
              </p>
            </div>
          </div>

          {filteredTags.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <TagIcon className="w-8 h-8 text-[#C0991B]/50 mx-auto" />
              <p className="text-xs text-gray-500 font-bold">No tags matching search.</p>
              <button
                onClick={handleOpenNewTag}
                className="px-4 py-2 bg-[#074504] hover:bg-[#C0991B] text-white hover:text-[#074504] border border-[#C0991B]/50 hover:border-[#074504] text-xs font-bold rounded-xl cursor-pointer transition-all duration-200"
              >
                + Create Tag
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {filteredTags.map((tag) => (
                <div 
                  key={tag.id}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 bg-amber-50/40 hover:bg-amber-50 border border-amber-200/80 hover:border-[#C0991B] rounded-xl transition-all"
                >
                  <span className="text-xs font-black text-[#074504]">
                    <span className="text-[#C0991B] mr-0.5">#</span>{tag.name}
                  </span>
                  
                  <span className="px-2 py-0.5 bg-white border border-[#C0991B]/30 group-hover:border-[#C0991B] rounded-full text-[10px] font-black text-[#7a600d]">
                    {tag.postCount}
                  </span>

                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity pl-1 border-l border-amber-200">
                    <button
                      onClick={() => handleOpenEditTag(tag)}
                      title="Edit Tag"
                      className="p-1 hover:text-[#074504] cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'tag', item: tag })}
                      title="Delete Tag"
                      className="p-1 hover:text-red-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE / EDIT CATEGORY */}
      {/* ========================================================================= */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 overflow-hidden space-y-0">
            
            {/* Modal Header */}
            <div className="bg-[#074504] text-white p-5 flex items-center justify-between border-b border-[#C0991B]/30">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#C0991B]" />
                <h3 className="font-black text-sm uppercase">
                  {editingCatId ? 'Edit Category' : 'Create New Category'}
                </h3>
              </div>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="text-white/80 hover:text-[#C0991B] p-1 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-[#074504] uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={catFormData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setCatFormData({
                      ...catFormData,
                      name,
                      slug: editingCatId ? catFormData.slug : generateSlug(name)
                    });
                  }}
                  placeholder="e.g. Agri-Business Loans"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-[#C0991B]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#074504] uppercase mb-1">
                  URL Slug
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#C0991B] font-bold">
                    /category/
                  </span>
                  <input
                    type="text"
                    value={catFormData.slug}
                    onChange={(e) => setCatFormData({ ...catFormData, slug: generateSlug(e.target.value) })}
                    placeholder="agri-business-loans"
                    className="w-full pl-24 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono outline-none focus:bg-white focus:border-[#C0991B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#074504] uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={catFormData.description}
                  onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                  placeholder="Brief description of the articles contained in this category..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-[#C0991B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#074504] uppercase mb-1">
                    Badge Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={catFormData.color}
                      onChange={(e) => setCatFormData({ ...catFormData, color: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-1 bg-white"
                    />
                    <span className="text-xs font-mono uppercase text-gray-600 font-bold">
                      {catFormData.color}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#074504] uppercase mb-1">
                    Parent Category
                  </label>
                  <select
                    value={catFormData.parentCategory}
                    onChange={(e) => setCatFormData({ ...catFormData, parentCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#C0991B] cursor-pointer"
                  >
                    <option value="">None (Top-Level Category)</option>
                    {categories.filter(c => c.id !== editingCatId).map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#074504] hover:bg-[#C0991B] border border-[#C0991B]/50 hover:border-[#074504] text-white hover:text-[#074504] rounded-xl text-xs font-black uppercase shadow-xs cursor-pointer transition-all duration-200"
                >
                  {editingCatId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CREATE / EDIT TAG */}
      {/* ========================================================================= */}
      {showTagModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 overflow-hidden">
            
            <div className="bg-[#074504] text-white p-5 flex items-center justify-between border-b border-[#C0991B]/30">
              <div className="flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-[#C0991B]" />
                <h3 className="font-black text-sm uppercase">
                  {editingTagId ? 'Edit Tag' : 'Create New Tag'}
                </h3>
              </div>
              <button 
                onClick={() => setShowTagModal(false)}
                className="text-white/80 hover:text-[#C0991B] p-1 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTag} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-[#074504] uppercase mb-1">
                  Tag Name *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-[#C0991B]">
                    #
                  </span>
                  <input
                    type="text"
                    required
                    value={tagFormData.name}
                    onChange={(e) => {
                      const val = e.target.value.replace(/^#/, '');
                      setTagFormData({
                        ...tagFormData,
                        name: val,
                        slug: editingTagId ? tagFormData.slug : generateSlug(val)
                      });
                    }}
                    placeholder="DairyLoans"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-[#C0991B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#074504] uppercase mb-1">
                  Tag Slug
                </label>
                <input
                  type="text"
                  value={tagFormData.slug}
                  onChange={(e) => setTagFormData({ ...tagFormData, slug: generateSlug(e.target.value) })}
                  placeholder="dairy-loans"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono outline-none focus:bg-white focus:border-[#C0991B]"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTagModal(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#074504] hover:bg-[#C0991B] border border-[#C0991B]/50 hover:border-[#074504] text-white hover:text-[#074504] rounded-xl text-xs font-black uppercase cursor-pointer transition-all duration-200"
                >
                  {editingTagId ? 'Save Changes' : 'Create Tag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: MERGE TAGS */}
      {/* ========================================================================= */}
      {showMergeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 overflow-hidden">
            
            <div className="bg-[#074504] text-white p-5 flex items-center justify-between border-b border-[#C0991B]/30">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#C0991B]" />
                <h3 className="font-black text-sm uppercase">Merge Duplicate Tags</h3>
              </div>
              <button 
                onClick={() => setShowMergeModal(false)}
                className="text-white/80 hover:text-[#C0991B] p-1 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMergeTags} className="p-6 space-y-4">
              <p className="text-xs text-gray-600 font-medium">
                Combine two tag keywords into one. All articles using the source tag will be re-assigned to the target tag, and the source tag will be deleted.
              </p>

              <div>
                <label className="block text-xs font-black text-red-600 uppercase mb-1">
                  Source Tag (To Remove)
                </label>
                <select
                  required
                  value={sourceTagId}
                  onChange={(e) => setSourceTagId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#C0991B] cursor-pointer"
                >
                  <option value="">-- Select tag to merge from --</option>
                  {tags.map(t => (
                    <option key={t.id} value={t.id}>#{t.name} ({t.postCount} posts)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#074504] uppercase mb-1">
                  Target Tag (To Keep)
                </label>
                <select
                  required
                  value={targetTagId}
                  onChange={(e) => setTargetTagId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-[#C0991B] cursor-pointer"
                >
                  <option value="">-- Select destination tag --</option>
                  {tags.filter(t => t.id !== sourceTagId).map(t => (
                    <option key={t.id} value={t.id}>#{t.name} ({t.postCount} posts)</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowMergeModal(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#C0991B] hover:bg-[#074504] text-[#074504] hover:text-white border border-[#C0991B] hover:border-[#074504] font-black rounded-xl text-xs uppercase cursor-pointer transition-all duration-200"
                >
                  Execute Merge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-200 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-sm text-gray-900 uppercase">
                Delete {deleteTarget.type === 'category' ? 'Category' : 'Tag'}?
              </h3>
              <p className="text-xs text-gray-600 font-medium">
                Are you sure you want to delete <strong className="text-black">{deleteTarget.item.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black uppercase shadow-xs cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TaxonomyManager;
