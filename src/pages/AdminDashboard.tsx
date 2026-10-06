import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, FilePlus, Image as ImageIcon, 
  BarChart2, Award, LayoutGrid, Settings, User, LogOut, Search, Plus, Trash2, 
  Eye, Edit3, Check, Lock, UploadCloud, Copy, ExternalLink, 
  ChevronLeft, ChevronRight, Bell, ChevronDown, Bold, 
  Italic, Underline, List, ListOrdered, Quote, Link as LinkIcon, 
  Code, Table, AlignLeft, AlignCenter, AlignRight, CheckCircle2,
  X, RefreshCw, Shield, Building2, UserPlus, Users, UserCheck, MessageSquare, AlertCircle,
  FolderTree, Tag, Mail, Palette, Globe, Download, Upload, Play, CheckSquare, Flame, Rss, ArrowUpRight, Send,
  Key, KeyRound, LockKeyhole, Activity, TrendingUp, PieChart, Filter, HelpCircle, Menu, Briefcase, Layers,
  Wallet, Coins, ShieldCheck, Clock, Sun, Home, ArrowUp, HardDrive, Sliders, Calendar as CalendarIcon, ArrowDown, Share2, PenTool,
  ShieldAlert, FileSpreadsheet, Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { 
  blogStore, BlogPostItem, BlogCategory, BlogTag, BlogAuthor, 
  BlogComment, NewsletterSubscriber, MediaItem, SiteSettings, UserAccount, BlogBlock,
  Beneficiary, Vacancy
} from '../lib/blogStore';
import CreateArticleStudio from '../components/CreateArticleStudio';
import { MediaManagerDAM } from '../components/MediaManagerDAM';
import TaxonomyManager from '../components/TaxonomyManager';
import UserProfileManager from '../components/UserProfileManager';
import MessagesFolderView from '../components/MessagesFolderView';
import PasswordSecurityModule from '../components/PasswordSecurityModule';
import RolesManagerModule from '../components/RolesManagerModule';
import VacanciesAdminModule from '../components/VacanciesAdminModule';
import BeneficiariesAdminModule from '../components/BeneficiariesAdminModule';
import CommentsModerationModule from '../components/CommentsModerationModule';
import LeadInquiriesManager from '../components/LeadInquiriesManager';
import MembershipRegistrationsModule from '../components/MembershipRegistrationsModule';
import SponsorshipPartnershipsModule from '../components/SponsorshipPartnershipsModule';
import ApplicationsSubscriptionsModule from '../components/ApplicationsSubscriptionsModule';
import AuditLogsAdminModule from '../components/AuditLogsAdminModule';
import SocialMediaAdminModule from '../components/SocialMediaAdminModule';
import { downloadExcel, downloadCSV, ColumnDef } from '../lib/excelReportExport';
import ReportModal from '../components/ReportModal';
import { articleService } from '../services/articleService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const u = user as any;
  
  // Navigation State (Dashboard and Analytics removed as requested)
  // Modules: Blog Management, Beneficiary Management, Lead & Inquiries, Membership Registrations,
  // Sponsorship & Partnerships, Applications & Subscriptions, Administration
  const [activeNav, setActiveNav] = useState<
    // 1. Blog Management
    | 'blog_articles'
    | 'blog_comments'
    | 'blog_media'
    | 'add_post'
    // 2. Beneficiary management
    | 'beneficiary_entries'
    | 'beneficiary_lists'
    // 3. Lead and inquiries management
    | 'lead_prequal'
    | 'lead_callbacks'
    | 'lead_contacts'
    // 4. Membership registrations management
    | 'member_individual'
    | 'member_group'
    // 5. Sponsorship and Partnerships management
    | 'sponsor_requests'
    | 'partner_requests'
    // 6. Applications and subscriptions
    | 'apps_jobs'
    | 'apps_job_applications'
    | 'apps_volunteer'
    | 'apps_newsletter'
    // 7. Site Administration
    | 'admin_profiles'
    | 'admin_roles'
    | 'admin_custom_roles'
    | 'admin_passwords'
    | 'admin_social'
    | 'admin_audit_logs'
    // Legacy aliases
    | 'posts' | 'media' | 'comments' | 'beneficiaries' | 'vacancies' | 'messages' | 'authors' | 'password_manager' | 'roles_manager' | 'profile' | 'categories_tags'
  >(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) {
      if (tab === 'posts' || tab === 'articles') return 'blog_articles';
      if (tab === 'comments') return 'blog_comments';
      if (tab === 'media') return 'blog_media';
      if (tab === 'beneficiaries') return 'beneficiary_entries';
      if (tab === 'vacancies' || tab === 'jobs') return 'apps_jobs';
      if (tab === 'messages' || tab === 'leads') return 'lead_prequal';
      if (tab === 'authors' || tab === 'profile' || tab === 'profiles') return 'admin_profiles';
      if (tab === 'roles_manager' || tab === 'roles' || tab === 'custom_roles' || tab === 'admin_custom_roles') return 'admin_roles';
      if (tab === 'password_manager' || tab === 'passwords') return 'admin_passwords';
      return tab as any;
    }
    return 'blog_articles';
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // User Role & Permissions (Only: Superadmin, Content editor, Administrator, Reviewer)
  const userRole = user?.role || 'Superadmin';
  const isSuperAdmin = 
    user?.email?.toLowerCase() === 'ptrckmunene@gmail.com' ||
    userRole === 'Superadmin' || 
    userRole === 'Super Admin' || 
    userRole === 'admin' || 
    userRole === 'superadmin' || 
    !user?.role;
  const isAdministrator = isSuperAdmin || userRole === 'Administrator';
  const isContentEditor = userRole === 'Content editor' || userRole === 'Content Editor' || userRole === 'Editor' || userRole === 'Author';
  const isReviewer = userRole === 'Reviewer';
  const canUserCreateArticles = isSuperAdmin || isAdministrator || isContentEditor || (user as any)?.canCreateArticles !== false;

  useEffect(() => {
    if (isReviewer && !['apps_jobs', 'apps_job_applications', 'apps_volunteer', 'apps_newsletter', 'lead_prequal', 'lead_callbacks', 'lead_contacts', 'beneficiary_entries', 'beneficiary_lists', 'member_individual', 'member_group', 'sponsor_requests', 'partner_requests', 'blog_comments'].includes(activeNav)) {
      setActiveNav('apps_job_applications');
    }
    if (isContentEditor && !['blog_articles', 'blog_comments', 'blog_media', 'add_post', 'admin_social', 'admin_profiles'].includes(activeNav)) {
      setActiveNav('blog_articles');
    }
  }, [isReviewer, isContentEditor, activeNav]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut();
      showToast('Logged out successfully');
      navigate('/staff-portal');
    } catch (err) {
      console.error("Logout error", err);
      window.location.href = '/staff-portal';
    }
  };

  // Sub-tab states
  const [mediaSubTab, setMediaSubTab] = useState<'library' | 'add_new'>('library');
  const [authorSubTab, setAuthorSubTab] = useState<'edit' | 'create'>('edit');
  const [selectedAuthorForEdit, setSelectedAuthorForEdit] = useState<string | null>('auth-1');

  // Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Header Popovers state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [trafficTimeRange, setTrafficTimeRange] = useState<'7D' | '30D' | '90D' | '1Y' | 'LIVE'>('30D');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Real-time website performance metrics state
  const [liveVisitors, setLiveVisitors] = useState(54);
  const [livePageviewsToday, setLivePageviewsToday] = useState(14380);
  const [lastPingTime, setLastPingTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  // Dynamic currentDate
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Real-time metrics dynamic pulse simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(38, prev + delta);
      });
      setLivePageviewsToday((prev) => prev + Math.floor(Math.random() * 3));
      setLastPingTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Quick Publish Widget State
  const [quickPublishTitle, setQuickPublishTitle] = useState('');
  const [quickPublishCategory, setQuickPublishCategory] = useState('Financial Literacy');

  // Articles Module Enhanced Blueprint States
  const [articleSubView, setArticleSubView] = useState<'all' | 'dashboard'>('all');
  const [articleLayoutType, setArticleLayoutType] = useState<'table' | 'grid'>('table');
  const [articleCategoryFilter, setArticleCategoryFilter] = useState('All');
  const [articleAuthorFilter, setArticleAuthorFilter] = useState('All');
  const [articleTagFilter, setArticleTagFilter] = useState('All');
  const [articleSeoFilter, setArticleSeoFilter] = useState('All');
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);

  // Store States
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(blogStore.getSettings());
  const [usersList, setUsersList] = useState<UserAccount[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  // Beneficiary Form State
  const [newBenName, setNewBenName] = useState('');
  const [newBenLocation, setNewBenLocation] = useState('');
  const [newBenLoanType, setNewBenLoanType] = useState('Imara Business Loan');
  const [newBenBusinessType, setNewBenBusinessType] = useState('');
  const [newBenImpactStory, setNewBenImpactStory] = useState('');
  const [newBenAmount, setNewBenAmount] = useState('KES 150,000');
  const [newBenPhoto, setNewBenPhoto] = useState('/Grace Wanjiku.jpeg');

  // Vacancy Form State
  const [newVacTitle, setNewVacTitle] = useState('');
  const [newVacDept, setNewVacDept] = useState('Credit & Operations');
  const [newVacLocation, setNewVacLocation] = useState('Nyeri Main Branch');
  const [newVacType, setNewVacType] = useState<'Full-Time' | 'Part-Time' | 'Contract'>('Full-Time');
  const [newVacDesc, setNewVacDesc] = useState('');
  const [newVacReqs, setNewVacReqs] = useState('');
  const [newVacDeadline, setNewVacDeadline] = useState('2026-03-30');

  // Feedback banner state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Load Store Data
  const refreshStoreData = () => {
    // Immediate synchronous load from cache
    setPosts(blogStore.getPosts());
    setCategories(blogStore.getCategories());
    setTags(blogStore.getTags());
    setAuthors(blogStore.getAuthors());
    setComments(blogStore.getComments());
    setSubscribers(blogStore.getSubscribers());
    setMedia(blogStore.getMedia());
    setSiteSettings(blogStore.getSettings());
    setUsersList(blogStore.getUsers());
    setBlacklistedEmails(blogStore.getBlacklistedEmails());
    setBeneficiaries(blogStore.getBeneficiaries());
    setVacancies(blogStore.getVacancies());

    // Asynchronous background sync from Supabase
    articleService.fetchAllArticlesForAdmin().then(remoteArticles => {
      if (Array.isArray(remoteArticles)) {
        setPosts(remoteArticles);
      }
    }).catch(err => {
      console.warn('[Admin Articles Sync Notice]:', err);
    });
  };

  useEffect(() => {
    refreshStoreData();

    const handleUpdate = () => refreshStoreData();
    window.addEventListener('neema_cms_posts_updated', handleUpdate);
    window.addEventListener('neema_cms_categories_updated', handleUpdate);
    window.addEventListener('neema_cms_tags_updated', handleUpdate);
    window.addEventListener('neema_cms_authors_updated', handleUpdate);
    window.addEventListener('neema_cms_comments_updated', handleUpdate);
    window.addEventListener('neema_cms_subscribers_updated', handleUpdate);
    window.addEventListener('neema_cms_media_updated', handleUpdate);
    window.addEventListener('neema_cms_settings_updated', handleUpdate);
    window.addEventListener('neema_cms_users_updated', handleUpdate);
    window.addEventListener('neema_cms_beneficiaries_updated', handleUpdate);
    window.addEventListener('neema_cms_vacancies_updated', handleUpdate);

    return () => {
      window.removeEventListener('neema_cms_posts_updated', handleUpdate);
      window.removeEventListener('neema_cms_categories_updated', handleUpdate);
      window.removeEventListener('neema_cms_tags_updated', handleUpdate);
      window.removeEventListener('neema_cms_authors_updated', handleUpdate);
      window.removeEventListener('neema_cms_comments_updated', handleUpdate);
      window.removeEventListener('neema_cms_subscribers_updated', handleUpdate);
      window.removeEventListener('neema_cms_media_updated', handleUpdate);
      window.removeEventListener('neema_cms_settings_updated', handleUpdate);
      window.removeEventListener('neema_cms_users_updated', handleUpdate);
      window.removeEventListener('neema_cms_beneficiaries_updated', handleUpdate);
      window.removeEventListener('neema_cms_vacancies_updated', handleUpdate);
    };
  }, []);

  // Filter States for Post Management
  const [postFilterStatus, setPostFilterStatus] = useState<'All' | 'Published' | 'Draft' | 'Scheduled' | 'Archived' | 'Trash'>('All');
  const [postSearchQuery, setPostSearchQuery] = useState('');

  // Post Editor State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorSlug, setEditorSlug] = useState('');
  const [editorExcerpt, setEditorExcerpt] = useState('');
  const [editorCategory, setEditorCategory] = useState('Financial Literacy');
  const [editorTags, setEditorTags] = useState<string[]>(['Microfinance', 'Kenya']);
  const [editorImage, setEditorImage] = useState('/imara_loan.jpg');
  const [editorStatus, setEditorStatus] = useState<'Published' | 'Draft' | 'Scheduled' | 'Archived' | 'Trash'>('Published');
  const [editorAuthorId, setEditorAuthorId] = useState('auth-1');
  const [editorIsFeatured, setEditorIsFeatured] = useState(false);
  const [editorBlocks, setEditorBlocks] = useState<BlogBlock[]>([
    { id: 'b-1', type: 'headline', content: 'Transforming Micro-Lending in Mt. Kenya' },
    { id: 'b-2', type: 'text', content: 'Neema Heep Microfinance continues to champion access to flexible, growth-oriented capital for women entrepreneurs and SMEs.' },
    { id: 'b-3', type: 'tip', content: 'Combine your business capital reserves with regular financial literacy audits to build credit resiliency.' },
    { id: 'b-4', type: 'cta', content: 'Explore Biashara Loans', settings: { link: '/loans' } }
  ]);
  const [editorSeoFocus, setEditorSeoFocus] = useState('microfinance Kenya');
  const [editorMetaDesc, setEditorMetaDesc] = useState('Explore how Neema Heep Microfinance empowers local entrepreneurs across Mount Kenya with low-interest business loans.');
  const [editorAutosaveText, setEditorAutosaveText] = useState('Autosaved 1 min ago');

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('#074504');
  
  // Category Edit Modal State
  const [editingCat, setEditingCat] = useState<BlogCategory | null>(null);

  // Tag Form State
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);

  // Author Form State
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAuthorRole, setNewAuthorRole] = useState('');
  const [newAuthorBio, setNewAuthorBio] = useState('');
  const [newAuthorEmail, setNewAuthorEmail] = useState('');

  // Password Manager State
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passStatus, setPassStatus] = useState<string | null>(null);

  // New User / Dashboard Admin Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Editor' | 'Author'>('Author');

  // Media state
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaAltText, setNewMediaAltText] = useState('');
  const [newMediaDescription, setNewMediaDescription] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video' | 'document'>('image');
  const [editingMediaModal, setEditingMediaModal] = useState<MediaItem | null>(null);

  // Blacklist & Commenter Moderation state
  const [blacklistedEmails, setBlacklistedEmails] = useState<string[]>([]);
  const [newBlacklistEmail, setNewBlacklistEmail] = useState('');
  const [commentFilterStatus, setCommentFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Spam' | 'Blacklisted'>('All');

  // Backup file state
  const [sitemapXmlPreview, setSitemapXmlPreview] = useState<string | null>(null);

  // Quick Open Editor for Create/Edit
  const handleOpenNewPost = () => {
    if (!canUserCreateArticles) {
      showToast('Article creation privilege is restricted by Site Admin for your user account.');
      return;
    }
    setEditingPostId(null);
    setEditorTitle('');
    setEditorSlug('');
    setEditorExcerpt('');
    setEditorCategory(categories[0]?.name || 'Financial Literacy');
    setEditorTags(['Microfinance']);
    setEditorImage('/imara_loan.jpg');
    setEditorStatus('Published');
    setEditorIsFeatured(false);
    setEditorBlocks([
      { id: `b-${Date.now()}-1`, type: 'headline', content: 'New Article Headline' },
      { id: `b-${Date.now()}-2`, type: 'text', content: 'Write your article body here...' }
    ]);
    setEditorSeoFocus('microfinance');
    setEditorMetaDesc('');
    setActiveNav('add_post');
  };

  const handleOpenEditPost = (post: BlogPostItem) => {
    setEditingPostId(post.id);
    setEditorTitle(post.title);
    setEditorSlug(post.slug);
    setEditorExcerpt(post.excerpt);
    setEditorCategory(post.category);
    setEditorTags(post.tags || []);
    setEditorImage(post.image);
    setEditorStatus((post.status as any) || 'Draft');
    setEditorAuthorId(post.authorId || 'auth-1');
    setEditorIsFeatured(!!post.isFeatured);
    setEditorBlocks(post.blocks || [
      { id: 'b-1', type: 'text', content: post.content || post.excerpt }
    ]);
    setEditorSeoFocus(post.seo?.focusKeyword || 'microfinance');
    setEditorMetaDesc(post.seo?.metaDescription || post.excerpt);
    setActiveNav('add_post');
  };

  const handleSavePost = async (publishNow: boolean | string = true) => {
    if (!editorTitle.trim()) {
      showToast('Please enter an article title');
      return;
    }

    const matchedAuthor = authors.find(a => a.id === editorAuthorId) || authors[0] || {
      id: 'auth_pm',
      name: 'Patrick Munene',
      initials: 'PM',
      role: 'Managing Director & Superadmin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
    const generatedSlug = (editorSlug || editorTitle)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `article-${Date.now()}`;

    let finalStatus = 'Draft';
    if (typeof publishNow === 'string') {
      finalStatus = publishNow;
    } else if (publishNow === true) {
      finalStatus = 'Published';
    } else {
      finalStatus = editorStatus || 'Draft';
    }

    const newPostData: BlogPostItem = {
      id: editingPostId || undefined,
      slug: generatedSlug,
      title: editorTitle.trim(),
      excerpt: editorExcerpt || editorTitle.trim(),
      category: editorCategory || 'Financial Literacy',
      tags: editorTags,
      authorId: matchedAuthor.id,
      authorName: matchedAuthor.name,
      authorInitials: matchedAuthor.initials || 'PM',
      authorAvatar: matchedAuthor.avatar,
      authorRole: matchedAuthor.role,
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      readTime: `${Math.max(2, Math.ceil(editorBlocks.map(b => b.content).join(' ').split(' ').length / 150))} min read`,
      image: editorImage || '/imara_loan.jpg',
      views: editingPostId ? (posts.find(p => p.id === editingPostId)?.views || 100) : 1,
      likes: editingPostId ? (posts.find(p => p.id === editingPostId)?.likes || 10) : 0,
      status: finalStatus as any,
      isFeatured: editorIsFeatured,
      blocks: editorBlocks,
      content: editorExcerpt + '\n\n' + editorBlocks.map(b => b.content).join('\n\n'),
      seo: {
        metaTitle: `${editorTitle.trim()} | Neema Heep Journal`,
        metaDescription: editorMetaDesc || editorExcerpt || editorTitle.trim(),
        ogTitle: editorTitle.trim(),
        ogImage: editorImage,
        twitterCard: 'summary_large_image',
        canonicalUrl: `https://www.neemaheep.com/blog/${generatedSlug}`,
        focusKeyword: editorSeoFocus,
        schemaType: 'BlogPosting'
      }
    };

    showToast(finalStatus === 'Published' ? 'Saving & Publishing article to Supabase...' : 'Saving draft to Supabase...');

    try {
      const result = await articleService.saveArticle(newPostData);
      if (result.success) {
        showToast(
          finalStatus === 'Published'
            ? `Article "${editorTitle}" successfully published and live on public blog!`
            : `Draft "${editorTitle}" saved in Supabase!`
        );
        const refreshed = await articleService.fetchAllArticlesForAdmin();
        setPosts(refreshed);
        setActiveNav('posts');
      }
    } catch (saveErr: any) {
      console.error('Error saving article to Supabase:', saveErr);
      showToast(`Database Notice: ${saveErr.message || 'Saved in local session.'}`);
      const fallbackList = blogStore.getPosts();
      setPosts(fallbackList);
      setActiveNav('posts');
    }
  };

  const handleTrashPost = async (postId: string) => {
    const target = posts.find(p => p.id === postId);
    if (target?.slug) {
      await articleService.updateArticleStatus(target.slug, 'Trash');
    }
    const updated = posts.map(p => p.id === postId ? { ...p, status: 'Trash' as const } : p);
    blogStore.savePosts(updated);
    setPosts(updated);
    showToast('Moved article to Trash in Supabase');
  };

  const handleRestorePost = async (postId: string) => {
    const target = posts.find(p => p.id === postId);
    if (target?.slug) {
      await articleService.updateArticleStatus(target.slug, 'Published');
    }
    const updated = posts.map(p => p.id === postId ? { ...p, status: 'Published' as const } : p);
    blogStore.savePosts(updated);
    setPosts(updated);
    showToast('Restored article to Published in Supabase');
  };

  const handleDeletePermanent = async (postId: string) => {
    const target = posts.find(p => p.id === postId);
    if (target?.slug) {
      await articleService.deleteArticle(target.slug);
    }
    const updated = posts.filter(p => p.id !== postId);
    blogStore.savePosts(updated);
    setPosts(updated);
    showToast('Permanently deleted article from Supabase');
  };

  // Block editor helpers
  const addBlock = (type: BlogBlock['type']) => {
    const newBlock: BlogBlock = {
      id: `b-${Date.now()}`,
      type,
      content: type === 'headline' ? 'Section Subheading' : type === 'tip' ? 'Financial Tip' : type === 'cta' ? 'Apply For Loan' : 'Paragraph text...'
    };
    setEditorBlocks([...editorBlocks, newBlock]);
  };

  const updateBlockContent = (id: string, content: string) => {
    setEditorBlocks(editorBlocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const removeBlock = (id: string) => {
    setEditorBlocks(editorBlocks.filter(b => b.id !== id));
  };

  // Password submit
  const handlePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassStatus('New passwords do not match');
      return;
    }
    const auth = useAuth() as any;
    const success = auth.changeCustomPassword ? auth.changeCustomPassword(currPassword, newPassword) : true;
    if (success) {
      setPassStatus('Password changed successfully!');
      setCurrPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPassStatus('Incorrect current password');
    }
  };

  // Category CRUD
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    const slug = newCatSlug || newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: BlogCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      slug,
      description: newCatDesc || 'Category description',
      color: newCatColor,
      postCount: 0
    };
    const updated = [...categories, newCat];
    blogStore.saveCategories(updated);
    setCategories(updated);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
    showToast(`Added category "${newCatName}"`);
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    const updated = categories.map(c => c.id === editingCat.id ? editingCat : c);
    blogStore.saveCategories(updated);
    setCategories(updated);
    setEditingCat(null);
    showToast(`Updated category "${editingCat.name}"`);
  };

  const handleDeleteCategory = (catId: string) => {
    const target = categories.find(c => c.id === catId);
    if (!target) return;
    const updated = categories.filter(c => c.id !== catId);
    blogStore.saveCategories(updated);
    setCategories(updated);
    showToast(`Deleted category "${target.name}"`);
  };

  // Tag CRUD
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName) return;
    const slug = newTagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newTag: BlogTag = {
      id: `tag-${Date.now()}`,
      name: newTagName,
      slug,
      postCount: 0
    };
    const updated = [...tags, newTag];
    blogStore.saveTags(updated);
    setTags(updated);
    setNewTagName('');
    showToast(`Added tag #${newTagName}`);
  };

  const handleUpdateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;
    const updated = tags.map(t => t.id === editingTag.id ? editingTag : t);
    blogStore.saveTags(updated);
    setTags(updated);
    setEditingTag(null);
    showToast(`Updated tag #${editingTag.name}`);
  };

  const handleDeleteTag = (tagId: string) => {
    const target = tags.find(t => t.id === tagId);
    if (!target) return;
    const updated = tags.filter(t => t.id !== tagId);
    blogStore.saveTags(updated);
    setTags(updated);
    showToast(`Deleted tag #${target.name}`);
  };

  // Author Profile CRUD
  const handleAddAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthorName) return;
    const initials = newAuthorName.split(' ').map(n => n[0]).join('').toUpperCase();
    const newAuth: BlogAuthor = {
      id: `auth-${Date.now()}`,
      name: newAuthorName,
      initials,
      role: newAuthorRole || 'Contributor',
      bio: newAuthorBio || 'Microfinance & editorial contributor',
      avatar: '/developer_teaching_coding.jpg',
      email: newAuthorEmail || `${newAuthorName.toLowerCase().replace(/\s+/g, '')}@neemaheep.co.ke`,
      status: isSuperAdmin ? 'Approved' : 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
      socials: {}
    };
    const updated = [...authors, newAuth];
    blogStore.saveAuthors(updated);
    setAuthors(updated);
    setNewAuthorName('');
    setNewAuthorRole('');
    setNewAuthorBio('');
    setNewAuthorEmail('');
    showToast(isSuperAdmin ? `Created and approved author profile for ${newAuthorName}` : `Submitted author profile for ${newAuthorName} (Pending Super Admin Approval)`);
  };

  const handleSaveAuthorEdit = (updatedAuth: BlogAuthor) => {
    blogStore.updateAuthor(updatedAuth);
    setAuthors(blogStore.getAuthors());
    showToast(`Saved author profile for ${updatedAuth.name}`);
  };

  const handleApproveAuthor = (authorId: string) => {
    blogStore.approveAuthor(authorId);
    setAuthors(blogStore.getAuthors());
    showToast('Approved author profile!');
  };

  const handleRejectAuthor = (authorId: string) => {
    blogStore.rejectAuthor(authorId);
    setAuthors(blogStore.getAuthors());
    showToast('Rejected author profile.');
  };

  const handleDeleteAuthor = (authorId: string) => {
    blogStore.deleteAuthor(authorId);
    setAuthors(blogStore.getAuthors());
    showToast('Author profile deleted');
  };

  // Media Management
  const handleAddMediaItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaUrl) return;
    const newItem: MediaItem = {
      id: `media-${Date.now()}`,
      title: newMediaTitle || 'Media Asset',
      filename: newMediaTitle ? `${newMediaTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpeg` : 'Uploaded Asset.jpeg',
      url: newMediaUrl,
      thumbnail: newMediaUrl,
      size: '420 KB',
      dimensions: '1200x800',
      uploadDate: new Date().toISOString().split('T')[0],
      optimized: true,
      altText: newMediaAltText || newMediaTitle || 'Neema Heep Microfinance visual asset',
      description: newMediaDescription || 'Media asset for blog SEO, AEO, and GEO generative engine optimization.',
      mediaType: newMediaType
    };
    const updated = [newItem, ...media];
    blogStore.saveMedia(updated);
    setMedia(updated);
    setNewMediaTitle('');
    setNewMediaUrl('');
    setNewMediaAltText('');
    setNewMediaDescription('');
    setNewMediaType('image');
    setMediaSubTab('library');
    showToast('New media asset added to library!');
  };

  const handleSaveMediaModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMediaModal) return;
    blogStore.updateMediaItem(editingMediaModal);
    setMedia(blogStore.getMedia());
    setEditingMediaModal(null);
    showToast(`Updated SEO & ALT details for "${editingMediaModal.filename}"`);
  };

  const handleDeleteMedia = (mediaId: string) => {
    blogStore.deleteMediaItem(mediaId);
    setMedia(blogStore.getMedia());
    showToast('Media item deleted');
  };

  // Beneficiaries handlers
  const handleAddBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBenName) return;
    const item: Beneficiary = {
      id: `ben-${Date.now()}`,
      name: newBenName,
      location: newBenLocation || 'Nyeri, Kenya',
      loanType: newBenLoanType,
      businessType: newBenBusinessType || 'Micro-Enterprise',
      impactStory: newBenImpactStory || 'Expanded business capacity through Neema Heep microfinance support.',
      amountDisbursed: newBenAmount || 'KES 150,000',
      photoUrl: newBenPhoto || '/Grace Wanjiku.jpeg',
      status: 'Approved',
      dateAdded: new Date().toISOString().split('T')[0]
    };
    const updated = [item, ...beneficiaries];
    blogStore.saveBeneficiaries(updated);
    setBeneficiaries(updated);
    setNewBenName('');
    setNewBenLocation('');
    setNewBenBusinessType('');
    setNewBenImpactStory('');
    showToast(`Added beneficiary story for ${item.name}`);
  };

  const handleToggleFeatureBeneficiary = (id: string) => {
    const updated = beneficiaries.map(b => b.id === id ? { ...b, status: b.status === 'Featured' ? 'Approved' as const : 'Featured' as const } : b);
    blogStore.saveBeneficiaries(updated);
    setBeneficiaries(updated);
    showToast('Updated beneficiary status');
  };

  const handleDeleteBeneficiary = (id: string) => {
    const updated = beneficiaries.filter(b => b.id !== id);
    blogStore.saveBeneficiaries(updated);
    setBeneficiaries(updated);
    showToast('Beneficiary story deleted');
  };

  // Vacancies handlers
  const handleAddVacancy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVacTitle) return;
    const reqsArray = newVacReqs.split('\n').filter(r => r.trim().length > 0);
    const item: Vacancy = {
      id: `vac-${Date.now()}`,
      title: newVacTitle,
      department: newVacDept || 'Operations',
      location: newVacLocation || 'Nyeri',
      type: newVacType,
      description: newVacDesc || 'Join Neema Heep Microfinance team in advancing financial inclusion.',
      requirements: reqsArray.length > 0 ? reqsArray : ['Diploma/Degree in relevant field', 'Strong analytical & interpersonal skills'],
      deadline: newVacDeadline || '2026-03-30',
      status: 'Open',
      applicantsCount: 0
    };
    const updated = [item, ...vacancies];
    blogStore.saveVacancies(updated);
    setVacancies(updated);
    setNewVacTitle('');
    setNewVacDesc('');
    setNewVacReqs('');
    showToast(`Posted job vacancy for ${item.title}`);
  };

  const handleToggleVacancyStatus = (id: string) => {
    const updated = vacancies.map(v => v.id === id ? { ...v, status: v.status === 'Open' ? 'Closed' as const : 'Open' as const } : v);
    blogStore.saveVacancies(updated);
    setVacancies(updated);
    showToast('Updated vacancy status');
  };

  const handleDeleteVacancy = (id: string) => {
    const updated = vacancies.filter(v => v.id !== id);
    blogStore.saveVacancies(updated);
    setVacancies(updated);
    showToast('Job vacancy deleted');
  };

  // Comments & Blacklisting handlers
  const handleApproveComment = (commId: string) => {
    const updated = comments.map(c => c.id === commId ? { ...c, status: 'Approved' as const } : c);
    blogStore.saveComments(updated);
    setComments(updated);
    showToast('Comment approved for public display');
  };

  const handleSpamComment = (commId: string) => {
    const updated = comments.map(c => c.id === commId ? { ...c, status: 'Spam' as const } : c);
    blogStore.saveComments(updated);
    setComments(updated);
    showToast('Comment marked as Spam');
  };

  const handleDeleteComment = (commId: string) => {
    const updated = comments.filter(c => c.id !== commId);
    blogStore.saveComments(updated);
    setComments(updated);
    showToast('Comment deleted');
  };

  const handleBlacklistCommenter = (email: string) => {
    blogStore.blacklistCommenter(email);
    setComments(blogStore.getComments());
    setBlacklistedEmails(blogStore.getBlacklistedEmails());
    showToast(`Blacklisted commenter ${email}`);
  };

  const handleRemoveFromBlacklist = (email: string) => {
    blogStore.unblacklistCommenter(email);
    setBlacklistedEmails(blogStore.getBlacklistedEmails());
    showToast(`Removed ${email} from blacklist`);
  };

  const handleManualAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlacklistEmail) return;
    blogStore.blacklistCommenter(newBlacklistEmail.trim());
    setComments(blogStore.getComments());
    setBlacklistedEmails(blogStore.getBlacklistedEmails());
    setNewBlacklistEmail('');
    showToast(`Added ${newBlacklistEmail} to global blacklist`);
  };

  // User Role Management
  const handleUpdateUserRole = (userId: string, newRole: 'Editor' | 'Author') => {
    blogStore.updateUserRole(userId, newRole);
    setUsersList(blogStore.getUsers());
    showToast(`Updated user role to ${newRole}`);
  };

  // Add User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      avatar: '/developer_teaching_coding.jpg',
      status: 'Active'
    };
    const updated = [...usersList, newUser];
    blogStore.saveUsers(updated);
    setUsersList(updated);
    setNewUserName('');
    setNewUserEmail('');
    showToast(`Added staff account for ${newUserName}`);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const jsonStr = blogStore.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neema_cms_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Downloaded full CMS backup JSON');
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = blogStore.importBackupJSON(content);
      if (success) {
        refreshStoreData();
        showToast('Successfully restored CMS database from backup!');
      } else {
        showToast('Failed to parse backup JSON file');
      }
    };
    reader.readAsText(file);
  };

  // Calculate live SEO score for editor
  const liveSeo = blogStore.calculateSeoScore({
    title: editorTitle,
    slug: editorSlug,
    excerpt: editorExcerpt,
    image: editorImage,
    content: editorExcerpt + ' ' + editorBlocks.map(b => b.content).join(' '),
    seo: {
      metaTitle: `${editorTitle} | Neema Heep Journal`,
      metaDescription: editorMetaDesc,
      ogTitle: editorTitle,
      ogImage: editorImage,
      twitterCard: 'summary_large_image',
      canonicalUrl: `https://neemaheep.co.ke/blog/${editorSlug}`,
      focusKeyword: editorSeoFocus,
      schemaType: 'BlogPosting'
    }
  });

  const filteredPostsList = posts.filter(p => {
    const matchesStatus = postFilterStatus === 'All' 
      ? p.status !== 'Trash' 
      : p.status === postFilterStatus;
    const matchesSearch = p.title.toLowerCase().includes(postSearchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
                          (p.authorName && p.authorName.toLowerCase().includes(postSearchQuery.toLowerCase()));
    const matchesCategory = articleCategoryFilter === 'All' || p.category === articleCategoryFilter;
    const matchesAuthor = articleAuthorFilter === 'All' || p.authorName === articleAuthorFilter;
    const matchesTag = articleTagFilter === 'All' || (p.tags && p.tags.includes(articleTagFilter));
    return matchesStatus && matchesSearch && matchesCategory && matchesAuthor && matchesTag;
  });

  const [showArticlesReportModal, setShowArticlesReportModal] = useState(false);
  const articleReportColumns: ColumnDef[] = [
    { key: 'title', label: 'Article Title' },
    { key: 'category', label: 'Category' },
    { key: 'authorName', label: 'Author' },
    { key: 'status', label: 'Status' },
    { key: 'publishedAt', label: 'Published Date', type: 'date' },
    { key: 'viewsCount', label: 'Views', type: 'number' },
    { key: 'likesCount', label: 'Likes', type: 'number' }
  ];

  const activeAuthorToEdit = authors.find(a => a.id === selectedAuthorForEdit) || authors[0];

  return (
    <div className="min-h-screen bg-[#F5F7F9] flex font-sans text-gray-800 relative">
      
      {/* Toast Banner */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-[#074504] text-[#C0991B] px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-3 border border-[#C0991B]/30"
          >
            <CheckCircle2 className="w-5 h-5 text-[#599200]" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ARTICLE LIVE PREVIEW MODAL */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 bg-[#074504] text-white flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#C0991B]" />
                  <span className="font-black text-xs uppercase tracking-wider">Live Reader Article Preview</span>
                </div>
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-6 flex-1">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-[#599200]">
                  <span>{editorCategory}</span>
                  <span>•</span>
                  <span className="text-gray-400">Preview Mode</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-black text-[#074504] leading-tight">
                  {editorTitle || 'Untitled Article'}
                </h1>

                <div className="flex items-center gap-4 py-3 border-y border-gray-100 text-xs font-bold text-gray-500">
                  <span>Author: {authors.find(a => a.id === editorAuthorId)?.name || 'Editorial Team'}</span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>

                <img 
                  src={editorImage || '/imara_loan.jpg'} 
                  alt="Cover Preview" 
                  className="w-full max-h-80 object-cover rounded-2xl shadow-sm border border-gray-100" 
                />

                <p className="text-sm font-semibold text-gray-700 italic bg-gray-50 p-4 rounded-xl border-l-4 border-[#074504]">
                  {editorExcerpt || 'Summary excerpt will appear here...'}
                </p>

                <div className="space-y-4 pt-4">
                  {editorBlocks.map((block) => (
                    <div key={block.id}>
                      {block.type === 'headline' && (
                        <h2 className="text-lg font-black text-[#074504] uppercase mt-4 mb-2">{block.content}</h2>
                      )}
                      {block.type === 'text' && (
                        <p className="text-sm text-gray-700 leading-relaxed font-normal">{block.content}</p>
                      )}
                      {block.type === 'tip' && (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-[#074504] flex items-center gap-3">
                          <Award className="w-5 h-5 text-[#599200] shrink-0" />
                          <span>{block.content}</span>
                        </div>
                      )}
                      {block.type === 'cta' && (
                        <div className="p-6 bg-[#074504] text-white rounded-2xl text-center space-y-3">
                          <h3 className="font-black text-sm uppercase">{block.content}</h3>
                          <a href="/loans" className="inline-block px-6 py-2 bg-[#C0991B] text-[#074504] rounded-xl font-black text-xs uppercase">
                            Learn More & Apply
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-xl text-xs font-bold uppercase cursor-pointer"
                >
                  Close Preview
                </button>
                <button 
                  onClick={() => { setShowPreviewModal(false); handleSavePost(true); }}
                  className="px-6 py-2 bg-[#074504] text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Publish Article Live
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SIDEBAR (Dark Forest Green #033B18 with Brand Gold #C0991B Accents) */}
      <aside className={`bg-[#033B18] text-white transition-all duration-300 z-30 flex flex-col border-r border-[#C0991B]/20 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        
        {/* Brand Logo & Tagline Header */}
        <div className="p-4 border-b border-[#C0991B]/30 flex items-center justify-between bg-[#033B18] sticky top-0 z-40">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src="/NEEMA HEEP LOGO.jpeg" alt="Neema Heep Logo" className="w-9 h-9 rounded-xl object-cover shrink-0 border-2 border-[#C0991B] bg-white shadow-sm" />
            {sidebarOpen && (
              <div>
                <h1 className="font-black text-xs text-white uppercase tracking-tight leading-none">NEEMA HEEP</h1>
                <p className="text-[9px] font-black text-[#C0991B] tracking-wider leading-tight">MICROFINANCE</p>
                <p className="text-[7px] text-white/70 truncate">Empowering Lives, Transforming Communities</p>
              </div>
            )}
          </div>
        </div>

        {/* Search Menu Input */}
        {sidebarOpen && (
          <div className="px-3 pt-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#C0991B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search menu..." 
                className="w-full bg-white/10 border border-[#C0991B]/30 rounded-xl pl-8 pr-12 py-1.5 text-xs text-white placeholder:text-white/40 outline-none focus:bg-white/15 focus:border-[#C0991B]"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[#C0991B] bg-white/10 px-1 rounded">Ctrl /</span>
            </div>
          </div>
        )}

        {/* Sidebar Nav Sections */}
        <div className="p-3 space-y-4 flex-1 overflow-y-auto scrollbar-hide">
          
          {/* 1. BLOG MANAGEMENT */}
          {(!isReviewer) && (
            <div>
              <div className={`px-3 py-1 text-[10px] font-extrabold text-[#C0991B] uppercase tracking-wider ${!sidebarOpen && 'hidden'}`}>
                Blog Management
              </div>
              <div className="space-y-1 mt-1">
                <button
                  onClick={() => setActiveNav('blog_articles')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'blog_articles' || activeNav === 'posts' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <FileText className={`w-4 h-4 shrink-0 ${activeNav === 'blog_articles' || activeNav === 'posts' ? 'text-[#C0991B]' : ''}`} />
                  {sidebarOpen && <span>Articles</span>}
                </button>

                <button
                  onClick={() => setActiveNav('blog_comments')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'blog_comments' || activeNav === 'comments' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className={`w-4 h-4 shrink-0 ${activeNav === 'blog_comments' || activeNav === 'comments' ? 'text-[#C0991B]' : ''}`} />
                    {sidebarOpen && <span>Comments</span>}
                  </div>
                </button>

                <button
                  onClick={() => setActiveNav('blog_media')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'blog_media' || activeNav === 'media' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <ImageIcon className={`w-4 h-4 shrink-0 ${activeNav === 'blog_media' || activeNav === 'media' ? 'text-[#C0991B]' : ''}`} />
                  {sidebarOpen && <span>Media</span>}
                </button>

                <button
                  onClick={() => setActiveNav('categories_tags')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'categories_tags' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <FolderTree className={`w-4 h-4 shrink-0 ${activeNav === 'categories_tags' ? 'text-[#C0991B]' : ''}`} />
                  {sidebarOpen && <span>Categories &amp; Tags</span>}
                </button>
              </div>
            </div>
          )}

          {/* 2. BENEFICIARY MANAGEMENT */}
          {(!isContentEditor) && (
            <div>
              <div className={`px-3 py-1 text-[10px] font-extrabold text-[#C0991B] uppercase tracking-wider ${!sidebarOpen && 'hidden'}`}>
                Beneficiary Management
              </div>
              <div className="space-y-1 mt-1">
                <button
                  onClick={() => setActiveNav('beneficiary_entries')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'beneficiary_entries' || activeNav === 'beneficiaries' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className={`w-4 h-4 shrink-0 ${activeNav === 'beneficiary_entries' || activeNav === 'beneficiaries' ? 'text-[#C0991B]' : ''}`} />
                    {sidebarOpen && <span>Beneficiaries</span>}
                  </div>
                </button>

                <button
                  onClick={() => setActiveNav('beneficiary_lists')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'beneficiary_lists' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers className={`w-4 h-4 shrink-0 ${activeNav === 'beneficiary_lists' ? 'text-[#C0991B]' : ''}`} />
                    {sidebarOpen && <span>Beneficiary Lists</span>}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 3. LEAD AND INQUIRIES MANAGEMENT */}
          {(!isContentEditor) && (
            <div>
              <div className={`px-3 py-1 text-[10px] font-extrabold text-[#C0991B] uppercase tracking-wider ${!sidebarOpen && 'hidden'}`}>
                Lead &amp; Inquiries Management
              </div>
              <div className="space-y-1 mt-1">
                <button
                  onClick={() => setActiveNav('lead_prequal')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'lead_prequal' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className={`w-4 h-4 shrink-0 ${activeNav === 'lead_prequal' ? 'text-[#C0991B]' : ''}`} />
                    {sidebarOpen && <span>Prequalification</span>}
                  </div>
                </button>

                <button
                  onClick={() => setActiveNav('lead_callbacks')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'lead_callbacks' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className={`w-4 h-4 shrink-0 ${activeNav === 'lead_callbacks' ? 'text-[#C0991B]' : ''}`} />
                    {sidebarOpen && <span>Call Back Request</span>}
                  </div>
                </button>

                <button
                  onClick={() => setActiveNav('lead_contacts')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'lead_contacts' || activeNav === 'messages' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Mail className={`w-4 h-4 shrink-0 ${activeNav === 'lead_contacts' || activeNav === 'messages' ? 'text-[#C0991B]' : ''}`} />
                    {sidebarOpen && <span>Contact Us Messages</span>}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 4. MEMBERSHIP REGISTRATIONS MANAGEMENT */}
          {(!isContentEditor) && (
            <div>
              <div className={`px-3 py-1 text-[10px] font-extrabold text-[#C0991B] uppercase tracking-wider ${!sidebarOpen && 'hidden'}`}>
                Membership Registrations
              </div>
              <div className="space-y-1 mt-1">
                <button
                  onClick={() => setActiveNav('member_individual')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'member_individual' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className={`w-4 h-4 shrink-0 ${activeNav === 'member_individual' ? 'text-[#C0991B]' : ''}`} />
                    {sidebarOpen && <span>Individual Member Reg.</span>}
                  </div>
                </button>

                <button
                  onClick={() => setActiveNav('member_group')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'member_group' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className={`w-4 h-4 shrink-0 ${activeNav === 'member_group' ? 'text-[#C0991B]' : ''}`} />
                    {sidebarOpen && <span>Group Members’ Reg.</span>}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 5. SPONSORSHIP AND PARTNERSHIPS MANAGEMENT */}
          {(!isContentEditor) && (
            <div>
              <div className={`px-3 py-1 text-[10px] font-extrabold text-[#C0991B] uppercase tracking-wider ${!sidebarOpen && 'hidden'}`}>
                Sponsorship &amp; Partnerships
              </div>
              <div className="space-y-1 mt-1">
                <button
                  onClick={() => setActiveNav('sponsor_requests')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'sponsor_requests' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Award className={`w-4 h-4 shrink-0 ${activeNav === 'sponsor_requests' ? 'text-[#C0991B]' : ''}`} />
                    {sidebarOpen && <span>Sponsorship Requests</span>}
                  </div>
                </button>

                <button
                  onClick={() => setActiveNav('partner_requests')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'partner_requests' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className={`w-4 h-4 shrink-0 ${activeNav === 'partner_requests' ? 'text-[#C0991B]' : ''}`} />
                    {sidebarOpen && <span>Partnership Requests</span>}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 6. APPLICATIONS AND SUBSCRIPTIONS */}
          {(!isContentEditor) && (
            <div>
              <div className={`px-3 py-1 text-[10px] font-extrabold text-[#C0991B] uppercase tracking-wider ${!sidebarOpen && 'hidden'}`}>
                Applications &amp; Subscriptions
              </div>
              <div className="space-y-1 mt-1">
                <button
                  onClick={() => setActiveNav('apps_jobs')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'apps_jobs' || activeNav === 'vacancies' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className={`w-4 h-4 shrink-0 ${activeNav === 'apps_jobs' || activeNav === 'vacancies' ? 'text-[#C0991B]' : ''}`} />
                    {sidebarOpen && <span>Jobs (Vacancies)</span>}
                  </div>
                </button>

                <button
                  onClick={() => setActiveNav('apps_job_applications')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'apps_job_applications' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className={`w-4 h-4 shrink-0 ${activeNav === 'apps_job_applications' ? 'text-[#C0991B]' : ''}`} />
                    {sidebarOpen && <span>Job Applications</span>}
                  </div>
                </button>

                <button
                  onClick={() => setActiveNav('apps_volunteer')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'apps_volunteer' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserPlus className={`w-4 h-4 shrink-0 ${activeNav === 'apps_volunteer' ? 'text-[#C0991B]' : ''}`} />
                    {sidebarOpen && <span>Volunteer Applications</span>}
                  </div>
                </button>

                <button
                  onClick={() => setActiveNav('apps_newsletter')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'apps_newsletter' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Mail className={`w-4 h-4 shrink-0 ${activeNav === 'apps_newsletter' ? 'text-[#C0991B]' : ''}`} />
                    {sidebarOpen && <span>Newsletter Subscriptions</span>}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 7. SITE ADMINISTRATION */}
          <div>
            <div className={`px-3 py-1 text-[10px] font-extrabold text-[#C0991B] uppercase tracking-wider ${!sidebarOpen && 'hidden'}`}>
              Site Administration
            </div>
            <div className="space-y-1 mt-1">
              <button
                onClick={() => setActiveNav('admin_profiles')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeNav === 'admin_profiles' || activeNav === 'authors' || activeNav === 'profile' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <User className={`w-4 h-4 shrink-0 ${activeNav === 'admin_profiles' || activeNav === 'authors' || activeNav === 'profile' ? 'text-[#C0991B]' : ''}`} />
                {sidebarOpen && <span>Profiles</span>}
              </button>

              {(!isReviewer && !isContentEditor) && (
                <>
                  <button
                    onClick={() => {
                      if (isSuperAdmin || isAdministrator) {
                        setActiveNav('admin_roles');
                      } else {
                        showToast('Access Restricted: Administrator privilege required for Roles Manager.');
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeNav === 'admin_roles' || activeNav === 'roles_manager' || activeNav === 'admin_custom_roles' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sliders className={`w-4 h-4 shrink-0 ${activeNav === 'admin_roles' || activeNav === 'roles_manager' || activeNav === 'admin_custom_roles' ? 'text-[#C0991B]' : ''}`} />
                      {sidebarOpen && <span>User Roles</span>}
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      if (!isSuperAdmin && !isAdministrator) {
                        showToast('Access Restricted: Administrative access required for Password Management.');
                      } else {
                        setActiveNav('admin_passwords');
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeNav === 'admin_passwords' || activeNav === 'password_manager' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <KeyRound className={`w-4 h-4 shrink-0 ${activeNav === 'admin_passwords' || activeNav === 'password_manager' ? 'text-[#C0991B]' : ''}`} />
                    {sidebarOpen && <span>Passwords</span>}
                  </button>
                </>
              )}

              {(!isReviewer) && (
                <button
                  onClick={() => setActiveNav('admin_social')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'admin_social' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Share2 className={`w-4 h-4 shrink-0 ${activeNav === 'admin_social' ? 'text-[#C0991B]' : ''}`} />
                  {sidebarOpen && <span>Social Media</span>}
                </button>
              )}

              {(!isReviewer && !isContentEditor) && (
                <button
                  onClick={() => setActiveNav('admin_audit_logs')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeNav === 'admin_audit_logs' ? 'bg-white/10 text-white shadow-md border-l-4 border-[#C0991B]' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <ShieldAlert className={`w-4 h-4 shrink-0 ${activeNav === 'admin_audit_logs' ? 'text-[#C0991B]' : ''}`} />
                  {sidebarOpen && <span>Audit Logs</span>}
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Footer User Card & Collapse Controls */}
        <div className="p-3 border-t border-[#C0991B]/20 space-y-3">
          {sidebarOpen && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-[#C0991B]/30">
              <div className="flex items-center gap-2.5 min-w-0">
                <img 
                  src={u?.photoURL || u?.avatar || '/developer_teaching_coding.jpg'} 
                  alt={u?.displayName || u?.name || "Staff User"} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#C0991B] shrink-0" 
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{u?.displayName || u?.name || (isSuperAdmin ? 'Neema Super Admin' : 'Neema Blog Staff')}</p>
                  <p className="text-[10px] text-[#C0991B] font-semibold truncate">
                    {user?.role || (isSuperAdmin ? 'Super Admin' : 'Blog Staff (Limited Rights)')}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[#C0991B] shrink-0" />
            </div>
          )}

          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <ChevronLeft className={`w-4 h-4 text-[#C0991B] shrink-0 transition-transform ${!sidebarOpen && 'rotate-180'}`} />
            {sidebarOpen && <span>Collapse Sidebar</span>}
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#F8FAFC]">
        
        {/* Top Header Bar Inspired directly by Attached Image */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-between shadow-2xs">
          
          {/* Left: Hamburger menu toggle + Global Search bar */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative hidden md:block w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Search global..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-14 py-2 text-xs font-medium text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#033B18] focus:bg-white transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">Ctrl + K</span>
            </div>
          </div>

          {/* Right: Date, Notifications, Messages, Profile */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Dynamic Today's Date with Interactive Calendar Card Popover */}
            <div className="relative">
              <button 
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="hidden lg:flex items-center gap-2 text-xs font-extrabold text-gray-700 bg-emerald-50/70 hover:bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-200/80 transition-all cursor-pointer shadow-2xs group"
                title="Click to open Editorial Calendar"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-[#C0991B] group-hover:scale-110 transition-transform" />
                <span>{currentDateFormatted}</span>
                <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${calendarOpen ? 'rotate-180 text-[#C0991B]' : ''}`} />
              </button>

              {/* Interactive Calendar Card Popover */}
              {calendarOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 p-4 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-[#C0991B]" />
                      <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Editorial Calendar</span>
                    </div>
                    <button onClick={() => setCalendarOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Calendar Grid Header */}
                  <div className="flex items-center justify-between px-1">
                    <p className="text-xs font-black text-[#033B18]">
                      {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                    <span className="px-2 py-0.5 bg-[#C0991B]/15 text-[#826507] text-[10px] font-black rounded-md uppercase">Live Schedule</span>
                  </div>

                  {/* Days of week */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-gray-400 uppercase">
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                      const isToday = day === new Date().getDate();
                      const isEventDay = day === 15 || day === 24 || day === 28;
                      return (
                        <button
                          key={day}
                          onClick={() => showToast(`Selected date: ${new Date().toLocaleDateString('en-US', { month: 'short' })} ${day}, ${new Date().getFullYear()}`)}
                          className={`h-7 rounded-lg flex items-center justify-center relative cursor-pointer text-xs transition-all ${
                            isToday 
                              ? 'bg-[#033B18] text-white font-black shadow-xs border-b-2 border-[#C0991B]' 
                              : isEventDay 
                              ? 'bg-amber-50 text-[#826507] font-bold border border-[#C0991B]/30' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {day}
                          {isEventDay && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#C0991B]" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Schedule Highlights */}
                  <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-[11px]">
                      <span className="font-extrabold text-[#033B18]">Today: Real-Time Site Sync Active</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-200/60 text-[11px]">
                      <span className="font-bold text-amber-900">May 28: Microfinance Q2 Report</span>
                      <span className="text-[10px] font-black text-[#826507] uppercase">Scheduled</span>
                    </div>
                  </div>
                </div>
              )}
            </div>



            {/* User Profile Dropdown Button */}
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
              >
                <img 
                  src={u?.photoURL || u?.avatar || '/developer_teaching_coding.jpg'} 
                  alt={u?.displayName || u?.name || "Staff"} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#033B18]" 
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-extrabold text-gray-900 leading-tight">
                    {u?.displayName || u?.name || (isSuperAdmin ? 'Neema Super Admin' : 'Neema Blog Staff')}
                  </p>
                  <p className="text-[10px] text-[#074504] font-bold leading-none">
                    {user?.role || (isSuperAdmin ? 'Super Admin' : 'Blog Staff (Limited Rights)')}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 p-2 space-y-1 animate-in fade-in duration-200">
                  <div className="p-2.5 border-b border-gray-100">
                    <p className="text-xs font-black text-gray-900">{user?.displayName || (isSuperAdmin ? 'Neema Super Admin' : 'Neema Blog Staff')}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user?.email || 'admin@neemaheep.com'}</p>
                  </div>
                  <button 
                    onClick={() => { setActiveNav('authors'); setUserDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-[#033B18]" />
                    Profiles
                  </button>
                  <button 
                    onClick={() => { setActiveNav('password_manager'); setUserDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl flex items-center gap-2"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#033B18]" />
                    Passwords
                  </button>
                  <div className="pt-1 border-t border-gray-100">
                    <button 
                      onClick={() => { setUserDropdownOpen(false); handleLogout(); }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-600" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Sub-Header Breadcrumb & Action Toolbar - Hidden on Webmaster & Site Administration Modules */}
        {!['beneficiaries', 'vacancies', 'comments', 'messages', 'roles_manager'].includes(activeNav) && (
          <div className="bg-white border-b border-gray-200 px-6 md:px-8 py-3 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <Home className="w-3.5 h-3.5 text-gray-400" />
              <span>CMS</span>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="font-extrabold text-gray-900">
                {activeNav.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold border border-gray-200 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Quick Actions</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {quickActionsOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 z-40 p-2 space-y-1">
                    {canUserCreateArticles && (
                      <button onClick={() => { handleOpenNewPost(); setQuickActionsOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl">
                        + New Article
                      </button>
                    )}
                    <button onClick={() => { setActiveNav('media'); setQuickActionsOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl">
                      + Upload Asset
                    </button>
                    <button onClick={() => { setActiveNav('beneficiaries'); setQuickActionsOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl">
                      + Add Beneficiary
                    </button>
                  </div>
                )}
              </div>

              {canUserCreateArticles && (
                <button 
                  onClick={handleOpenNewPost}
                  className="px-5 py-2 bg-[#033B18] hover:bg-[#022A10] text-white rounded-xl text-xs font-extrabold uppercase tracking-wide flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Article</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* PAGE BODY CONTENT */}
        <main className="p-6 md:p-8 space-y-8 max-w-[1700px] mx-auto w-full">

          {/* 1. MEDIA MODULE (ENTERPRISE DIGITAL ASSET MANAGEMENT SYSTEM) */}
          {(activeNav === 'blog_media' || activeNav === 'media') && (
            <MediaManagerDAM media={media} showToast={showToast} />
          )}

          {/* 2. POST MANAGEMENT MODULE */}
          {(activeNav === 'blog_articles' || activeNav === 'posts') && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* TOP HEADER BAR */}
              <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#074504] p-6 md:p-8 rounded-2xl border border-[#C0991B]/30 text-white shadow-lg space-y-4">
                {/* 1. Title */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
                    <FileText className="w-6 h-6 text-[#C0991B] shrink-0" />
                    <span>ARTICLE MANAGEMENT MODULE</span>
                  </h3>
                  <span className="px-3.5 py-1.5 bg-[#C0991B]/20 text-[#C0991B] border border-[#C0991B]/40 rounded-full text-xs font-black shadow-2xs">
                    {posts.filter(p => p.status === 'Published').length} Published
                  </span>
                </div>

                {/* 2. Description Text */}
                <p className="text-xs md:text-sm text-gray-200 font-medium leading-relaxed max-w-4xl">
                  Browse, filter, edit, and organize all published and draft articles across your website.
                </p>

                {/* 3. CTA buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={handleOpenNewPost}
                    className="px-4 py-2.5 bg-[#C0991B] hover:bg-[#a88414] text-[#074504] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" /> + New Article
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadExcel('Neema_HEEP_Articles_Directory', articleReportColumns, filteredPostsList)}
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Download Excel
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadCSV('Neema_HEEP_Articles_Directory', articleReportColumns, filteredPostsList)}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-[#C0991B]/40 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#C0991B]" /> Export CSV
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowArticlesReportModal(true)}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-[#C0991B]/40 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-[#C0991B]" /> Generate Report
                  </button>
                </div>
              </div>

              {/* ARTICLES TABLE & FILTERS */}
              <div className="space-y-6">
                  {/* Status Bar Tabs & Filters */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                      {/* Status Tabs */}
                      <div className="flex flex-wrap bg-gray-100 p-1 rounded-xl gap-1">
                        {(['All', 'Published', 'Draft', 'Scheduled', 'Archived', 'Trash'] as const).map(st => (
                          <button
                            key={st}
                            onClick={() => setPostFilterStatus(st)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap ${
                              postFilterStatus === st ? 'bg-[#074504] text-white shadow-xs' : 'text-gray-500 hover:text-[#074504]'
                            }`}
                          >
                            {st} ({posts.filter(p => st === 'All' ? true : p.status === st).length})
                          </button>
                        ))}
                      </div>

                      {/* Layout Toggle */}
                      <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 p-1 rounded-xl gap-1 shrink-0">
                          <button
                            onClick={() => setArticleLayoutType('table')}
                            className={`p-2 rounded-lg cursor-pointer transition-colors ${articleLayoutType === 'table' ? 'bg-white text-[#074504] shadow-2xs' : 'text-gray-400'}`}
                            title="Table View"
                          >
                            <Layers className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setArticleLayoutType('grid')}
                            className={`p-2 rounded-lg cursor-pointer transition-colors ${articleLayoutType === 'grid' ? 'bg-white text-[#074504] shadow-2xs' : 'text-gray-400'}`}
                            title="Grid Cards View"
                          >
                            <LayoutGrid className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Filters Dropdown Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
                      <div>
                        <label className="block text-[10px] uppercase text-gray-400 font-black mb-1">Category</label>
                        <select
                          value={articleCategoryFilter}
                          onChange={(e) => setArticleCategoryFilter(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
                        >
                          <option value="All">All Categories</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-gray-400 font-black mb-1">Author</label>
                        <select
                          value={articleAuthorFilter}
                          onChange={(e) => setArticleAuthorFilter(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
                        >
                          <option value="All">All Authors</option>
                          {authors.map(a => (
                            <option key={a.id} value={a.name}>{a.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-gray-400 font-black mb-1">Tags</label>
                        <select
                          value={articleTagFilter}
                          onChange={(e) => setArticleTagFilter(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#C0991B]"
                        >
                          <option value="All">All Tags</option>
                          {tags.map(t => (
                            <option key={t.id} value={t.name}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Bulk Actions Floating Bar */}
                  {selectedArticleIds.length > 0 && (
                    <div className="bg-[#074504] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <span className="text-xs font-black uppercase tracking-wider text-[#C0991B]">
                        {selectedArticleIds.length} Article{selectedArticleIds.length > 1 ? 's' : ''} Selected
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={async () => {
                            const updated = posts.map(p => selectedArticleIds.includes(p.id) ? { ...p, status: 'Published' as const } : p);
                            blogStore.savePosts(updated);
                            setPosts(updated);
                            for (const id of selectedArticleIds) {
                              const item = posts.find(p => p.id === id);
                              if (item?.slug) {
                                await articleService.updateArticleStatus(item.slug, 'Published');
                              }
                            }
                            setSelectedArticleIds([]);
                            showToast('Published selected articles in Supabase');
                          }}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Publish Selected
                        </button>
                        <button 
                          onClick={async () => {
                            const updated = posts.map(p => selectedArticleIds.includes(p.id) ? { ...p, status: 'Trash' as const } : p);
                            blogStore.savePosts(updated);
                            setPosts(updated);
                            for (const id of selectedArticleIds) {
                              const item = posts.find(p => p.id === id);
                              if (item?.slug) {
                                await articleService.updateArticleStatus(item.slug, 'Trash');
                              }
                            }
                            setSelectedArticleIds([]);
                            showToast('Moved selected articles to Trash in Supabase');
                          }}
                          className="px-3 py-1.5 bg-red-800 hover:bg-red-700 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Move to Trash
                        </button>
                        <button 
                          onClick={() => setSelectedArticleIds([])}
                          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TABLE VIEW */}
                  {articleLayoutType === 'table' && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black uppercase text-gray-500 tracking-wider">
                              <th className="py-3.5 px-4 w-10">
                                <input 
                                  type="checkbox"
                                  checked={selectedArticleIds.length === filteredPostsList.length && filteredPostsList.length > 0}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedArticleIds(filteredPostsList.map(p => p.id));
                                    } else {
                                      setSelectedArticleIds([]);
                                    }
                                  }}
                                  className="rounded text-[#074504] focus:ring-[#074504]"
                                />
                              </th>
                              <th className="py-3 px-3">Article Title</th>
                              <th className="py-3 px-3">Author</th>
                              <th className="py-3 px-3">Category</th>
                              <th className="py-3 px-3">Status</th>
                              <th className="py-3 px-3">Date</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-xs font-bold">
                            {filteredPostsList.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="py-12 text-center text-gray-400">
                                  No articles found matching filters.
                                </td>
                              </tr>
                            ) : (
                              filteredPostsList.map((p) => {
                                const isSelected = selectedArticleIds.includes(p.id);
                                return (
                                  <tr key={p.id} className={`hover:bg-gray-50/80 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                                    <td className="py-3 px-3">
                                      <input 
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedArticleIds([...selectedArticleIds, p.id]);
                                          } else {
                                            setSelectedArticleIds(selectedArticleIds.filter(id => id !== p.id));
                                          }
                                        }}
                                        className="rounded text-[#074504] focus:ring-[#074504]"
                                      />
                                    </td>
                                    <td className="py-3 px-3">
                                      <div className="flex items-center gap-2.5">
                                        <img src={p.image} alt={p.title} className="w-10 h-8 rounded-lg object-cover border border-gray-200 shrink-0" />
                                        <div className="min-w-0">
                                          <h4 className="text-xs font-black text-gray-900 line-clamp-1">{p.title}</h4>
                                          <span className="text-[10px] text-gray-400 font-normal">{p.readTime} • {p.slug}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-3 px-3 text-gray-700 whitespace-nowrap">{p.authorName}</td>
                                    <td className="py-3 px-3 whitespace-nowrap">
                                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-lg text-[10px] font-bold">
                                        {p.category}
                                      </span>
                                    </td>
                                    <td className="py-3 px-3 whitespace-nowrap">
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                                        p.status === 'Published' ? 'bg-emerald-100 text-emerald-800' :
                                        p.status === 'Draft' ? 'bg-amber-100 text-amber-800' :
                                        p.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                      }`}>
                                        {p.status}
                                      </span>
                                    </td>
                                    <td className="py-3 px-3 text-gray-500 font-normal whitespace-nowrap">{p.date}</td>
                                    <td className="py-3 px-4 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        {p.status !== 'Trash' ? (
                                          <>
                                            <button 
                                              onClick={() => handleOpenEditPost(p)}
                                              title="Edit Article Studio"
                                              className="p-1.5 bg-gray-100 hover:bg-[#074504] hover:text-white rounded-lg text-gray-600 transition-colors cursor-pointer"
                                            >
                                              <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <a 
                                              href={`/blog/${p.slug}`} 
                                              target="_blank" 
                                              rel="noreferrer"
                                              title="View Live"
                                              className="p-1.5 bg-gray-100 hover:bg-[#599200] hover:text-white rounded-lg text-gray-600 transition-colors cursor-pointer"
                                            >
                                              <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                            <button 
                                              onClick={() => handleTrashPost(p.id)}
                                              title="Move to Trash"
                                              className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg text-red-600 transition-colors cursor-pointer"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button 
                                              onClick={() => handleRestorePost(p.id)}
                                              title="Restore"
                                              className="p-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-lg text-emerald-600 transition-colors cursor-pointer"
                                            >
                                              <RefreshCw className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                              onClick={() => handleDeletePermanent(p.id)}
                                              title="Delete Permanently"
                                              className="p-1.5 bg-red-100 hover:bg-red-700 hover:text-white rounded-lg text-red-700 transition-colors cursor-pointer"
                                            >
                                              <X className="w-3.5 h-3.5" />
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* GRID VIEW */}
                  {articleLayoutType === 'grid' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPostsList.map((p) => (
                        <div key={p.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
                          <div className="relative h-44 overflow-hidden bg-gray-100">
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                            <div className="absolute top-3 left-3 flex gap-2">
                              <span className="px-2.5 py-1 bg-[#074504] text-[#C0991B] text-[9px] font-black uppercase rounded-lg shadow-xs">
                                {p.category}
                              </span>
                            </div>
                            <div className="absolute top-3 right-3">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${
                                p.status === 'Published' ? 'bg-emerald-600 text-white' :
                                p.status === 'Draft' ? 'bg-amber-500 text-white' :
                                p.status === 'Scheduled' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
                              }`}>
                                {p.status}
                              </span>
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                              <h4 className="text-sm font-black text-gray-900 line-clamp-2">{p.title}</h4>
                              <p className="text-xs font-medium text-gray-500 line-clamp-2 mt-1">{p.excerpt}</p>
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                              <span className="text-gray-500 font-bold text-[11px] truncate max-w-[100px]">{p.authorName}</span>
                              <div className="flex items-center gap-1.5">
                                {p.status !== 'Trash' ? (
                                  <>
                                    <button 
                                      onClick={() => handleOpenEditPost(p)}
                                      className="px-2.5 py-1 bg-[#074504] text-white text-[10px] font-extrabold rounded-lg uppercase hover:bg-[#085205] cursor-pointer"
                                      title="Edit Article"
                                    >
                                      Edit
                                    </button>
                                    <a 
                                      href={`/blog/${p.slug}`} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="p-1 bg-gray-100 hover:bg-[#599200] hover:text-white rounded-lg text-gray-600 transition-colors cursor-pointer"
                                      title="View Live"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                    <button 
                                      onClick={() => handleTrashPost(p.id)}
                                      className="p-1 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg text-red-600 transition-colors cursor-pointer"
                                      title="Move to Trash"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button 
                                      onClick={() => handleRestorePost(p.id)}
                                      className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white text-[10px] font-bold rounded-lg cursor-pointer"
                                      title="Restore"
                                    >
                                      Restore
                                    </button>
                                    <button 
                                      onClick={() => handleDeletePermanent(p.id)}
                                      className="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-700 hover:text-white text-[10px] font-bold rounded-lg cursor-pointer"
                                      title="Delete Permanently"
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination Bar */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-500">
                    <span>Showing 1 - {filteredPostsList.length} of {posts.length} articles</span>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-50" disabled>
                        Previous
                      </button>
                      <button className="px-3 py-1.5 bg-[#074504] text-white rounded-lg font-black">1</button>
                      <button className="px-3 py-1.5 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">2</button>
                      <button className="px-3 py-1.5 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">Next</button>
                    </div>
                  </div>

                  {/* Formal Management Audit & Export Report Modal */}
                  <ReportModal
                    isOpen={showArticlesReportModal}
                    onClose={() => setShowArticlesReportModal(false)}
                    title="Blog Articles Editorial Management Audit Report"
                    moduleName="Blog Management"
                    submoduleName="Articles"
                    summaryMetrics={[
                      { label: 'Total Articles', value: posts.length, color: '#074504' },
                      { label: 'Filtered Articles', value: filteredPostsList.length, color: '#16a34a' },
                      { label: 'Published Articles', value: posts.filter(p => p.status === 'Published').length, color: '#C0991B' }
                    ]}
                    columns={articleReportColumns}
                    data={filteredPostsList}
                    filterDescription={`Status: ${postFilterStatus} | Category: ${articleCategoryFilter} | Author: ${articleAuthorFilter} | Search: "${postSearchQuery || 'All'}"`}
                  />

                </div>

            </div>
          )}

          {/* CREATE / EDIT ARTICLE EDITOR */}
          {activeNav === 'add_post' && (
            <CreateArticleStudio 
              editingPostId={editingPostId}
              editorTitle={editorTitle}
              setEditorTitle={setEditorTitle}
              editorSlug={editorSlug}
              setEditorSlug={setEditorSlug}
              editorExcerpt={editorExcerpt}
              setEditorExcerpt={setEditorExcerpt}
              editorCategory={editorCategory}
              setEditorCategory={setEditorCategory}
              editorTags={editorTags}
              setEditorTags={setEditorTags}
              editorImage={editorImage}
              setEditorImage={setEditorImage}
              editorStatus={editorStatus}
              setEditorStatus={(val: any) => setEditorStatus(val)}
              editorAuthorId={editorAuthorId}
              setEditorAuthorId={setEditorAuthorId}
              editorIsFeatured={editorIsFeatured}
              setEditorIsFeatured={setEditorIsFeatured}
              editorBlocks={editorBlocks}
              setEditorBlocks={setEditorBlocks}
              editorSeoFocus={editorSeoFocus}
              setEditorSeoFocus={setEditorSeoFocus}
              editorMetaDesc={editorMetaDesc}
              setEditorMetaDesc={setEditorMetaDesc}
              editorAutosaveText={editorAutosaveText}
              categories={categories}
              authors={authors}
              tags={tags}
              media={media}
              onSavePost={handleSavePost}
              onShowPreview={() => setShowPreviewModal(true)}
              showToast={showToast}
              onBackToPosts={() => setActiveNav('posts')}
            />
          )}

          {/* 1. BLOG MANAGEMENT - COMMENTS */}
          {(activeNav === 'blog_comments' || activeNav === 'comments') && (
            <CommentsModerationModule />
          )}

          {/* 2. BENEFICIARY MANAGEMENT */}
          {(activeNav === 'beneficiary_entries' || activeNav === 'beneficiaries') && (
            <BeneficiariesAdminModule 
              initialSubmodule="entries"
              userRole={userRole.toLowerCase().includes('webmaster') ? 'webmaster' : 'administrator'}
              userName={u?.name || u?.displayName || 'Site Administrator'}
            />
          )}

          {activeNav === 'beneficiary_lists' && (
            <BeneficiariesAdminModule 
              initialSubmodule="lists"
              userRole={userRole.toLowerCase().includes('webmaster') ? 'webmaster' : 'administrator'}
              userName={u?.name || u?.displayName || 'Site Administrator'}
            />
          )}

          {/* 3. LEAD AND INQUIRIES MANAGEMENT */}
          {activeNav === 'lead_prequal' && (
            <LeadInquiriesManager initialSubmodule="prequalifications" showToast={showToast} />
          )}

          {activeNav === 'lead_callbacks' && (
            <LeadInquiriesManager initialSubmodule="callbacks" showToast={showToast} />
          )}

          {(activeNav === 'lead_contacts' || activeNav === 'messages') && (
            <LeadInquiriesManager initialSubmodule="contacts" showToast={showToast} />
          )}

          {/* 4. MEMBERSHIP REGISTRATIONS MANAGEMENT */}
          {activeNav === 'member_individual' && (
            <MembershipRegistrationsModule initialSubmodule="individual" showToast={showToast} />
          )}

          {activeNav === 'member_group' && (
            <MembershipRegistrationsModule initialSubmodule="group" showToast={showToast} />
          )}

          {/* 5. SPONSORSHIP AND PARTNERSHIPS MANAGEMENT */}
          {activeNav === 'sponsor_requests' && (
            <SponsorshipPartnershipsModule initialSubmodule="sponsorship" showToast={showToast} />
          )}

          {activeNav === 'partner_requests' && (
            <SponsorshipPartnershipsModule initialSubmodule="partnership" showToast={showToast} />
          )}

          {/* 6. APPLICATIONS AND SUBSCRIPTIONS */}
          {(activeNav === 'apps_jobs' || activeNav === 'vacancies') && (
            <ApplicationsSubscriptionsModule initialSubmodule="jobs" showToast={showToast} />
          )}

          {activeNav === 'apps_job_applications' && (
            <ApplicationsSubscriptionsModule initialSubmodule="job_applications" showToast={showToast} />
          )}

          {activeNav === 'apps_volunteer' && (
            <ApplicationsSubscriptionsModule initialSubmodule="volunteer_applications" showToast={showToast} />
          )}

          {activeNav === 'apps_newsletter' && (
            <ApplicationsSubscriptionsModule initialSubmodule="newsletter" showToast={showToast} />
          )}

          {/* 7. ADMINISTRATION, USERS AND PERMISSIONS */}
          {(activeNav === 'admin_profiles' || activeNav === 'authors' || activeNav === 'profile') && (
            <UserProfileManager />
          )}

          {(activeNav === 'admin_roles' || activeNav === 'roles_manager' || activeNav === 'admin_custom_roles') && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {!isSuperAdmin && !isAdministrator ? (
                <div className="bg-amber-50 rounded-2xl border-2 border-[#C0991B] p-8 text-center space-y-4 max-w-xl mx-auto my-12 shadow-xs">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-[#C0991B]">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-amber-900 uppercase">Super Admin Privilege Required</h3>
                  <p className="text-xs text-amber-800 font-medium">
                    Roles Manager Module is restricted to Super Admin accounts. You are currently logged in as <strong className="uppercase">{userRole}</strong>.
                  </p>
                  <button 
                    onClick={() => setActiveNav('admin_profiles')}
                    className="px-5 py-2.5 bg-[#074504] text-[#C0991B] rounded-xl text-xs font-bold uppercase cursor-pointer shadow-sm hover:bg-[#053203]"
                  >
                    Go to User Profile
                  </button>
                </div>
              ) : (
                <RolesManagerModule />
              )}
            </div>
          )}

          {(activeNav === 'admin_passwords' || activeNav === 'password_manager') && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <PasswordSecurityModule 
                mode="change" 
                username={user?.displayName || 'Admin'} 
                onSuccess={() => setPassStatus('Password updated successfully!')}
              />
            </div>
          )}

          {activeNav === 'admin_social' && (
            <SocialMediaAdminModule />
          )}

          {activeNav === 'admin_audit_logs' && (
            <AuditLogsAdminModule showToast={showToast} />
          )}

          {/* 5. TAXONOMY MANAGEMENT SYSTEM */}
          {activeNav === 'categories_tags' && (
            <TaxonomyManager 
              onSelectCategoryFilter={(catName) => {
                setArticleCategoryFilter(catName);
                setActiveNav('blog_articles');
              }}
              onOpenArticleEditor={() => setActiveNav('add_post')}
            />
          )}

        </main>
      </div>

    </div>
  );
}
