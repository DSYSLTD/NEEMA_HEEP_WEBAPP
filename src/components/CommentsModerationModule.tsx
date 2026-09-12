import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, ShieldAlert, CheckCircle2, AlertTriangle, Trash2, Eye, EyeOff, 
  Search, Filter, RefreshCw, UserX, Ban, UserCheck, Flag, Download, 
  Printer, Plus, ChevronRight, ChevronDown, ChevronUp, Edit3, CornerDownRight, 
  Clock, Award, Activity, BarChart2, Shield, Settings, Sliders, Check, X, 
  Info, Cpu, ExternalLink, ThumbsUp, Send, User, Layers, FileText, Globe, Smartphone, Monitor, Lock, Wand2
} from 'lucide-react';
import { 
  communityStore, EnterpriseComment, ModeratedUser, ModerationRules, 
  AuditLogEntry, ModerationNotification, CommentReport 
} from '../lib/communityStore';
import { exportPdfReport, printHtmlReport } from '../lib/pdfPrintUtils';

export default function CommentsModerationModule({ className = '' }: { className?: string }) {
  // Store States
  const [comments, setComments] = useState<EnterpriseComment[]>([]);
  const [users, setUsers] = useState<ModeratedUser[]>([]);
  const [rules, setRules] = useState<ModerationRules>(communityStore.getRules());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [notifications, setNotifications] = useState<ModerationNotification[]>([]);

  // Navigation Submodule Tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'all' | 'pending' | 'approved' | 'reported' | 'spam' | 'hidden' | 'deleted' | 'users' | 'analytics'
  >('dashboard');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [articleFilter, setArticleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'risk_desc' | 'likes_desc' | 'reports_desc'>('newest');
  
  // Selection & Bulk Action State
  const [selectedCommentIds, setSelectedCommentIds] = useState<string[]>([]);
  
  // Active Detail Panel State
  const [selectedComment, setSelectedComment] = useState<EnterpriseComment | null>(null);
  
  // Edit Modal State
  const [editingComment, setEditingComment] = useState<EnterpriseComment | null>(null);
  const [editText, setEditText] = useState('');

  // AI Workbench Workbench Test State
  const [aiTestInput, setAiTestInput] = useState('');
  const [aiTestResult, setAiTestResult] = useState<any | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // User Action Modal State
  const [selectedUserForAction, setSelectedUserForAction] = useState<ModeratedUser | null>(null);
  const [userBanReason, setUserBanReason] = useState('');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Subscribe to communityStore updates
  useEffect(() => {
    const loadData = () => {
      setComments(communityStore.getComments());
      setUsers(communityStore.getUsers());
      setRules(communityStore.getRules());
      setAuditLogs(communityStore.getAuditLogs());
      setNotifications(communityStore.getNotifications());
    };

    loadData();

    window.addEventListener('neema_community_updated', loadData);
    return () => window.removeEventListener('neema_community_updated', loadData);
  }, []);

  // Flatten comments including nested replies for list views
  const flattenedComments = useMemo(() => {
    const list: EnterpriseComment[] = [];
    const traverse = (items: EnterpriseComment[]) => {
      for (const c of items) {
        list.push(c);
        if (c.replies && c.replies.length > 0) {
          traverse(c.replies);
        }
      }
    };
    traverse(comments);
    return list;
  }, [comments]);

  // Submodule Tab Specific Filtering
  const tabFilteredComments = useMemo(() => {
    let base = flattenedComments;
    if (activeTab === 'pending') base = base.filter(c => c.status === 'Pending');
    else if (activeTab === 'approved') base = base.filter(c => c.status === 'Approved');
    else if (activeTab === 'reported') base = base.filter(c => c.reportCount > 0 || c.reports.length > 0);
    else if (activeTab === 'spam') base = base.filter(c => c.status === 'Spam');
    else if (activeTab === 'hidden') base = base.filter(c => c.status === 'Hidden');
    else if (activeTab === 'deleted') base = base.filter(c => c.status === 'Deleted');

    // Apply Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter(c => 
        c.content.toLowerCase().includes(q) ||
        c.authorName.toLowerCase().includes(q) ||
        c.authorEmail.toLowerCase().includes(q) ||
        c.postTitle.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.ipAddress.includes(q)
      );
    }

    // Apply Article Filter
    if (articleFilter !== 'All') {
      base = base.filter(c => c.postSlug === articleFilter || c.postTitle === articleFilter);
    }

    // Apply Status Filter (for 'all' tab)
    if (activeTab === 'all' && statusFilter !== 'All') {
      base = base.filter(c => c.status === statusFilter);
    }

    // Apply Risk Filter
    if (riskFilter === 'Low') base = base.filter(c => c.aiRiskScore <= 25);
    else if (riskFilter === 'Medium') base = base.filter(c => c.aiRiskScore > 25 && c.aiRiskScore <= 60);
    else if (riskFilter === 'High') base = base.filter(c => c.aiRiskScore > 60);

    // Sorting
    return [...base].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      if (sortBy === 'oldest') return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
      if (sortBy === 'risk_desc') return b.aiRiskScore - a.aiRiskScore;
      if (sortBy === 'likes_desc') return b.likes - a.likes;
      if (sortBy === 'reports_desc') return b.reportCount - a.reportCount;
      return 0;
    });
  }, [flattenedComments, activeTab, searchQuery, articleFilter, statusFilter, riskFilter, sortBy]);

  // Unique Article Options for Filters
  const uniqueArticles = useMemo(() => {
    const set = new Set<string>();
    flattenedComments.forEach(c => set.add(c.postTitle));
    return Array.from(set);
  }, [flattenedComments]);

  // Dashboard Stats Calculations
  const stats = useMemo(() => {
    const total = flattenedComments.length;
    const pending = flattenedComments.filter(c => c.status === 'Pending').length;
    const approved = flattenedComments.filter(c => c.status === 'Approved').length;
    const spam = flattenedComments.filter(c => c.status === 'Spam').length;
    const reported = flattenedComments.filter(c => c.reportCount > 0 || c.reports.length > 0).length;
    const hidden = flattenedComments.filter(c => c.status === 'Hidden').length;
    const deleted = flattenedComments.filter(c => c.status === 'Deleted').length;
    const blockedUsersCount = users.filter(u => u.status === 'Banned' || u.status === 'Suspended' || u.status === 'Muted').length;

    // AI Confidence Average
    const avgConfidence = Math.round(
      flattenedComments.reduce((acc, curr) => acc + (curr.aiAnalysis?.confidence || 90), 0) / (total || 1)
    );

    // Health Score calculation (100 - spam/reports ratio)
    const healthScore = Math.max(65, Math.min(100, Math.round(100 - ((spam * 2 + reported * 3) / (total || 1)) * 10)));

    return {
      total, pending, approved, spam, reported, hidden, deleted, blockedUsersCount,
      avgConfidence, healthScore, activeDiscussions: uniqueArticles.length,
      responseTime: '4.2 Minutes'
    };
  }, [flattenedComments, users, uniqueArticles]);

  // Bulk Actions
  const handleBulkAction = (action: 'approve' | 'reject' | 'hide' | 'delete' | 'delete_perm' | 'restore' | 'spam' | 'pin' | 'unpin') => {
    if (selectedCommentIds.length === 0) {
      showToast('Please select at least one comment for bulk action.');
      return;
    }
    if (action === 'delete_perm') {
      selectedCommentIds.forEach(id => communityStore.deleteCommentPermanently(id, 'Site Admin'));
      showToast(`Permanently deleted ${selectedCommentIds.length} comment(s)!`);
      setSelectedCommentIds([]);
      return;
    }
    communityStore.bulkUpdateComments(selectedCommentIds, action as any, 'Site Admin');
    showToast(`Successfully applied bulk ${action.toUpperCase()} to ${selectedCommentIds.length} comments!`);
    setSelectedCommentIds([]);
  };

  // PDF Export
  const handleExportPDF = () => {
    if (tabFilteredComments.length === 0) {
      showToast('No comments match the current filter to export.');
      return;
    }
    const columns = ['Comment ID', 'Author', 'Article', 'Comment Excerpt', 'Status', 'Reports', 'Date'];
    const rows = tabFilteredComments.map(c => [
      c.id,
      c.authorName,
      c.postTitle.length > 30 ? c.postTitle.slice(0, 28) + '...' : c.postTitle,
      c.content.length > 40 ? c.content.slice(0, 38) + '...' : c.content,
      c.status,
      c.reportCount,
      c.postedDate
    ]);

    exportPdfReport({
      title: `Neema HEEP Community Comments Report (${activeTab.toUpperCase()})`,
      subtitle: `Exported ${tabFilteredComments.length} Records | Enterprise Moderation Log`,
      columns,
      rows,
      filename: `Neema_HEEP_Comments_${activeTab}_${new Date().toISOString().split('T')[0]}.pdf`,
      orientation: 'landscape'
    });
    showToast('Downloaded Community Moderation PDF Report!');
  };

  // Print Report
  const handlePrint = () => {
    if (tabFilteredComments.length === 0) {
      showToast('No comments to print.');
      return;
    }
    const columns = ['ID', 'Author', 'Article', 'Comment Text', 'Status', 'Posted Date'];
    const rows = tabFilteredComments.map(c => [
      c.id,
      `${c.authorName} (${c.authorEmail})`,
      c.postTitle,
      c.content,
      c.status,
      c.postedDate
    ]);

    printHtmlReport({
      title: `Neema HEEP - Community Moderation Audit Roster (${activeTab.toUpperCase()})`,
      subtitle: `Total Filtered Comments: ${tabFilteredComments.length} | Generated: ${new Date().toLocaleString()}`,
      columns,
      rows
    });
  };

  // AI Workbench Live Test
  const handleRunAiWorkbenchTest = () => {
    if (!aiTestInput.trim()) return;
    setIsAiLoading(true);
    setTimeout(() => {
      const res = communityStore.analyzeCommentContent(aiTestInput, 'Test Moderator', 'test@neemaheep.co.ke', rules);
      setAiTestResult(res);
      setIsAiLoading(false);
      showToast('AI Toxicity & Spam Analysis Completed!');
    }, 600);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#074504] text-[#C0991B] px-5 py-3 rounded-2xl shadow-2xl border border-[#C0991B] font-black text-xs uppercase flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <RefreshCw className="w-4 h-4 text-[#C0991B] animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR WITH BRAND GOLD ACCENTS */}
      <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#074504] p-6 md:p-8 rounded-3xl border border-[#C0991B]/30 text-white shadow-xl space-y-4">
        {/* 1. Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
            <MessageSquare className="w-7 h-7 text-[#C0991B] shrink-0" />
            <span>COMMENTS MODERATION MODULE</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#C0991B]/20 text-[#C0991B] border border-[#C0991B]/40 rounded-full text-[10px] font-black uppercase tracking-wider">
              Enterprise Community Suite
            </span>
            <span className="text-xs text-emerald-300 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Smart Moderation Live
            </span>
          </div>
        </div>

        {/* 2. Description Text */}
        <p className="text-xs md:text-sm text-gray-200 font-medium leading-relaxed max-w-4xl">
          Automated toxicity filtering, spam protection, threaded discussions, and user reputation controls safeguarding community discussions.
        </p>

        {/* 3. CTA buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-[#C0991B]" />
            <span>Export PDF</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-[#C0991B]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* SUBMODULE NAVIGATION TABS */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between gap-1 flex-wrap sm:flex-nowrap">
        {[
          { id: 'dashboard', label: 'Overview', icon: BarChart2 },
          { id: 'all', label: 'All', icon: MessageSquare, count: stats.total },
          { id: 'pending', label: 'Pending', icon: Clock, count: stats.pending, alert: stats.pending > 0 },
          { id: 'approved', label: 'Approved', icon: CheckCircle2, count: stats.approved },
          { id: 'reported', label: 'Reported', icon: Flag, count: stats.reported, alert: stats.reported > 0 },
          { id: 'spam', label: 'Spam', icon: ShieldAlert, count: stats.spam, alert: stats.spam > 0 },
          { id: 'deleted', label: 'Deleted', icon: Trash2, count: stats.deleted },
          { id: 'users', label: 'Blocked', icon: UserX, count: stats.blockedUsersCount }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedCommentIds([]);
              }}
              className={`px-2 sm:px-2.5 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 flex-1 min-w-0 cursor-pointer text-center ${
                isActive
                  ? 'bg-[#074504] text-[#C0991B] shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#C0991B]' : 'text-gray-500'}`} />
              <span className="truncate">{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black shrink-0 ${
                  tab.alert 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= 1. MODERATION DASHBOARD ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* TOP KPI CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white p-4 rounded-2xl border-t-4 border-t-[#074504] border-x border-b border-gray-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase text-gray-400">Total Comments</span>
              <div className="text-2xl font-black text-[#074504]">{stats.total}</div>
              <span className="text-[10px] font-bold text-gray-500">Across {stats.activeDiscussions} Articles</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border-t-4 border-t-amber-500 border-x border-b border-gray-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase text-gray-400">Pending Approval</span>
              <div className="text-2xl font-black text-amber-600 flex items-center gap-2">
                {stats.pending}
                {stats.pending > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
              </div>
              <span className="text-[10px] font-bold text-amber-700">Needs moderator review</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border-t-4 border-t-emerald-600 border-x border-b border-gray-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase text-gray-400">Approved Live</span>
              <div className="text-2xl font-black text-emerald-700">{stats.approved}</div>
              <span className="text-[10px] font-bold text-emerald-800">Publicly visible</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border-t-4 border-t-purple-600 border-x border-b border-gray-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase text-gray-400">Reported Items</span>
              <div className="text-2xl font-black text-purple-700">{stats.reported}</div>
              <span className="text-[10px] font-bold text-purple-800">Community flagged</span>
            </div>

          </div>

          {/* MAIN DASHBOARD GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT 2 COLS: PENDING QUEUE QUICK MODERATION */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <h3 className="font-black text-sm text-[#074504] uppercase">
                      Pending Moderation Queue ({stats.pending})
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveTab('pending')}
                    className="text-xs font-bold text-[#074504] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All Queue <ChevronRight className="w-4 h-4 text-[#C0991B]" />
                  </button>
                </div>

                {stats.pending === 0 ? (
                  <div className="py-12 text-center space-y-3 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-black text-sm text-emerald-900 uppercase">Queue Fully Moderated!</h4>
                    <p className="text-xs text-emerald-700 font-medium">No pending comments requiring manual moderator review at this time.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tabFilteredComments.filter(c => c.status === 'Pending').slice(0, 4).map(c => (
                      <div key={c.id} className="p-4 bg-gray-50 hover:bg-amber-50/30 rounded-2xl border border-gray-200 transition-all space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <img src={c.authorAvatar} alt="" className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                            <div>
                              <span className="font-black text-xs text-[#074504] uppercase block">{c.authorName}</span>
                              <span className="text-[10px] text-gray-400 font-bold">{c.authorEmail} • {c.postedDate}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-gray-800 font-medium bg-white p-3 rounded-xl border border-gray-100 italic">
                          "{c.content}"
                        </p>

                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 pt-1">
                          <span className="truncate max-w-[250px]">Article: {c.postTitle}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                communityStore.updateCommentStatus(c.id, 'Approved', 'Site Admin');
                                showToast('Approved comment');
                              }}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black uppercase cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                communityStore.updateCommentStatus(c.id, 'Rejected', 'Site Admin');
                                showToast('Rejected comment');
                              }}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-black uppercase cursor-pointer"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => setSelectedComment(c)}
                              className="p-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 cursor-pointer"
                              title="Inspect Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">

              {/* QUICK NAVIGATION */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
                <h4 className="font-black text-xs text-[#074504] uppercase border-b border-gray-100 pb-2">Moderation Submodules</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('spam')}
                    className="w-full p-3 bg-gray-50 hover:bg-red-50 hover:border-red-300 text-gray-800 font-bold text-xs rounded-2xl border border-gray-200 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-red-600" /> Spam Queue</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-[10px] font-black">{stats.spam}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('reported')}
                    className="w-full p-3 bg-gray-50 hover:bg-purple-50 hover:border-purple-300 text-gray-800 font-bold text-xs rounded-2xl border border-gray-200 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span className="flex items-center gap-2"><Flag className="w-4 h-4 text-purple-600" /> User Reports</span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-[10px] font-black">{stats.reported}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('users')}
                    className="w-full p-3 bg-gray-50 hover:bg-amber-50 hover:border-[#C0991B] text-gray-800 font-bold text-xs rounded-2xl border border-gray-200 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span className="flex items-center gap-2"><UserX className="w-4 h-4 text-[#C0991B]" /> Blocked / Muted Users</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-black">{stats.blockedUsersCount}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================= 2. ALL COMMENTS & SUBMODULE LIST VIEWS ================= */}
      {['all', 'pending', 'approved', 'reported', 'spam', 'hidden', 'deleted'].includes(activeTab) && (
        <div className="space-y-4 animate-in fade-in duration-300">
          
          {/* RELEVANT METRICS BAR (ALL COMMENTS SCREEN) */}
          {activeTab === 'all' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border-l-4 border-l-[#074504] border-y border-r border-gray-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 block">Total Volume</span>
                  <span className="text-xl font-black text-[#074504]">{stats.total} Comments</span>
                </div>
                <MessageSquare className="w-5 h-5 text-[#074504]/40" />
              </div>

              <div className="bg-white p-3.5 rounded-2xl border-l-4 border-l-emerald-600 border-y border-r border-gray-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 block">Approved Live</span>
                  <span className="text-xl font-black text-emerald-700">{stats.approved} Active</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600/40" />
              </div>

              <div className="bg-white p-3.5 rounded-2xl border-l-4 border-l-amber-500 border-y border-r border-gray-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 block">Pending Moderation</span>
                  <span className="text-xl font-black text-amber-600">{stats.pending} Queue</span>
                </div>
                <Clock className="w-5 h-5 text-amber-500/40" />
              </div>

              <div className="bg-white p-3.5 rounded-2xl border-l-4 border-l-red-600 border-y border-r border-gray-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 block">Flagged / Spam</span>
                  <span className="text-xl font-black text-red-600">{stats.spam + stats.reported} Blocked</span>
                </div>
                <AlertTriangle className="w-5 h-5 text-red-600/40" />
              </div>
            </div>
          )}

          {/* SEARCH, FILTER & ACTION BAR */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              
              {/* Search input */}
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search comment, author, email, IP..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#C0991B]"
                />
              </div>

              {/* Article Filter */}
              <div>
                <select
                  value={articleFilter}
                  onChange={e => setArticleFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none"
                >
                  <option value="All">All Articles</option>
                  {uniqueArticles.map((art, idx) => (
                    <option key={idx} value={art}>{art.length > 25 ? art.slice(0, 25) + '...' : art}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="likes_desc">Most Liked</option>
                  <option value="reports_desc">Most Reported</option>
                </select>
              </div>

              {/* Status Filter (if in All tab) */}
              {activeTab === 'all' && (
                <div>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Spam">Spam</option>
                    <option value="Hidden">Hidden</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Deleted">Deleted</option>
                  </select>
                </div>
              )}

            </div>

            {/* BULK TOOLBAR */}
            {selectedCommentIds.length > 0 && (
              <div className="p-3 bg-[#074504] text-white rounded-xl flex items-center justify-between gap-3 text-xs font-bold animate-in fade-in">
                <span>{selectedCommentIds.length} comments selected</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => handleBulkAction('approve')} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg uppercase text-[10px]">Approve</button>
                  <button onClick={() => handleBulkAction('reject')} className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg uppercase text-[10px]">Reject</button>
                  <button onClick={() => handleBulkAction('spam')} className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg uppercase text-[10px]">Mark Spam</button>
                  <button onClick={() => handleBulkAction('hide')} className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg uppercase text-[10px]">Hide</button>
                  <button onClick={() => handleBulkAction('delete')} className="px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white rounded-lg uppercase text-[10px]">Move to Trash</button>
                  <button onClick={() => handleBulkAction('delete_perm')} className="px-2.5 py-1 bg-rose-950 hover:bg-black text-white rounded-lg uppercase text-[10px] border border-red-500/40">Delete Permanently</button>
                  <button onClick={() => setSelectedCommentIds([])} className="px-2.5 py-1 bg-white/20 text-white rounded-lg uppercase text-[10px]">Clear</button>
                </div>
              </div>
            )}
          </div>

          {/* MAIN COMMENTS TABLE / ROSTER */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            {tabFilteredComments.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="font-black text-sm text-gray-700 uppercase">No Comments Found</h4>
                <p className="text-xs text-gray-400 font-medium">No comments match the selected tab filter or search query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black uppercase text-gray-500 tracking-wider">
                      <th className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={selectedCommentIds.length === tabFilteredComments.length && tabFilteredComments.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedCommentIds(tabFilteredComments.map(c => c.id));
                            else setSelectedCommentIds([]);
                          }}
                          className="rounded text-[#074504]"
                        />
                      </th>
                      <th className="py-3.5 px-4">Author / User</th>
                      <th className="py-3.5 px-4">Comment Preview</th>
                      <th className="py-3.5 px-4">Target Article</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Posted Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-bold">
                    {tabFilteredComments.map(c => {
                      const isSelected = selectedCommentIds.includes(c.id);
                      return (
                        <tr key={c.id} className={`hover:bg-gray-50/80 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                          <td className="py-3.5 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedCommentIds([...selectedCommentIds, c.id]);
                                else setSelectedCommentIds(selectedCommentIds.filter(id => id !== c.id));
                              }}
                              className="rounded text-[#074504]"
                            />
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <img src={c.authorAvatar} alt="" className="w-8 h-8 rounded-full border border-gray-200 object-cover shrink-0" />
                              <div>
                                <span className="font-black text-xs text-[#074504] uppercase flex items-center gap-1">
                                  {c.authorName}
                                  {c.isPinned && <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded">Pinned</span>}
                                </span>
                                <span className="text-[10px] text-gray-400 font-bold block">{c.authorEmail}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="text-gray-800 line-clamp-2 font-medium">"{c.content}"</p>
                            {c.reportCount > 0 && (
                              <span className="text-[10px] text-purple-700 font-bold block mt-0.5">
                                🚩 {c.reportCount} Report(s) Logged
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 max-w-[180px]">
                            <span className="text-gray-600 line-clamp-1 font-bold text-[11px]">{c.postTitle}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                              c.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                              c.status === 'Pending' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                              c.status === 'Spam' ? 'bg-red-100 text-red-800' :
                              c.status === 'Hidden' ? 'bg-gray-100 text-gray-700' : 'bg-red-200 text-red-900'
                            }`}>
                              {c.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-gray-400 font-medium text-[10px]">
                            {c.postedDate}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {c.status !== 'Approved' && (
                                <button
                                  onClick={() => {
                                    communityStore.updateCommentStatus(c.id, 'Approved', 'Site Admin');
                                    showToast('Comment Approved');
                                  }}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase rounded cursor-pointer"
                                >
                                  Approve
                                </button>
                              )}
                              {c.status !== 'Spam' && (
                                <button
                                  onClick={() => {
                                    communityStore.updateCommentStatus(c.id, 'Spam', 'Site Admin');
                                    showToast('Moved to Spam Queue');
                                  }}
                                  className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase rounded cursor-pointer"
                                >
                                  Spam
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedComment(c)}
                                className="p-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingComment(c);
                                  setEditText(c.content);
                                }}
                                className="p-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded cursor-pointer"
                                title="Edit Text"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              {c.status !== 'Deleted' ? (
                                <button
                                  onClick={() => {
                                    communityStore.updateCommentStatus(c.id, 'Deleted', 'Site Admin');
                                    showToast('Moved comment to Trash');
                                  }}
                                  className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded cursor-pointer"
                                  title="Move to Trash"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    communityStore.updateCommentStatus(c.id, 'Approved', 'Site Admin');
                                    showToast('Restored comment to Approved');
                                  }}
                                  className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black uppercase rounded cursor-pointer"
                                  title="Restore Comment"
                                >
                                  Restore
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to permanently delete this comment?')) {
                                    communityStore.deleteCommentPermanently(c.id, 'Site Admin');
                                    showToast('Comment permanently deleted!');
                                  }
                                }}
                                className="p-1.5 bg-rose-900 hover:bg-black text-white text-[10px] font-black rounded cursor-pointer border border-red-500/30"
                                title="Permanently Delete Comment"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ================= 3. BLOCKED USERS SUBMODULE ================= */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <UserX className="w-5 h-5 text-red-600" /> Community User Moderation & Banned Accounts
                </h3>
                <p className="text-xs text-gray-500 font-medium">Manage user bans, warnings, mute timeouts, and reputation scores.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(u => (
                <div key={u.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={u.avatar} alt="" className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
                      <div>
                        <h4 className="font-black text-xs text-[#074504] uppercase">{u.name}</h4>
                        <span className="text-[10px] text-gray-400 block font-medium">{u.email}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                      u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                      u.status === 'Warned' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      u.status === 'Banned' ? 'bg-red-600 text-white' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {u.status}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-gray-100 text-[11px] space-y-1 font-medium text-gray-600">
                    <div className="flex justify-between">
                      <span>Reputation Score:</span>
                      <strong className="text-[#074504]">{u.reputationScore} / 1000</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Rank:</span>
                      <strong className="text-[#C0991B]">{u.reputationRank}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Approved Comments:</span>
                      <strong>{u.approvedComments}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Spam Violations:</span>
                      <strong className="text-red-600">{u.spamViolations}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {u.status !== 'Active' ? (
                      <button
                        onClick={() => {
                          communityStore.updateUserStatus(u.id, 'Active', 'Site Admin', 'Restored to Active status.');
                          showToast(`Restored user ${u.name}`);
                        }}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl cursor-pointer"
                      >
                        Unban / Restore
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedUserForAction(u)}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl cursor-pointer"
                      >
                        Ban / Suspend
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL FOR SELECTED COMMENT */}
      {selectedComment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-sm text-[#074504] uppercase">Comment Details Panel ({selectedComment.id})</h3>
              <button onClick={() => setSelectedComment(null)} className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-gray-50 rounded-2xl space-y-2 border border-gray-200">
                <span className="font-black text-[#074504] uppercase block">{selectedComment.authorName} ({selectedComment.authorEmail})</span>
                <p className="text-gray-800 font-medium italic">"{selectedComment.content}"</p>
                <div className="text-[10px] text-gray-400 font-bold">Target Article: {selectedComment.postTitle}</div>
              </div>

              <div className="text-[11px] font-bold text-gray-600">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                  <span>IP Address:</span> <strong>{selectedComment.ipAddress}</strong><br />
                  <span>Country:</span> <strong>{selectedComment.country}</strong><br />
                  <span>Browser:</span> <strong>{selectedComment.browser}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    communityStore.updateCommentStatus(selectedComment.id, 'Deleted', 'Site Admin');
                    showToast('Moved comment to Trash');
                    setSelectedComment(null);
                  }}
                  className="px-3.5 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-extrabold text-xs uppercase rounded-xl cursor-pointer"
                >
                  Move to Trash
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Permanently remove this comment from database?')) {
                      communityStore.deleteCommentPermanently(selectedComment.id, 'Site Admin');
                      showToast('Comment permanently deleted!');
                      setSelectedComment(null);
                    }
                  }}
                  className="px-3.5 py-2 bg-red-800 hover:bg-black text-white font-extrabold text-xs uppercase rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Permanently
                </button>
              </div>

              <button onClick={() => setSelectedComment(null)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold uppercase text-xs rounded-xl cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CONTENT MODAL */}
      {editingComment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-black text-sm text-[#074504] uppercase">Edit Comment Content</h3>
            <textarea
              rows={4}
              value={editText}
              onChange={e => setEditText(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#C0991B]"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingComment(null)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold uppercase text-xs rounded-xl cursor-pointer">Cancel</button>
              <button
                onClick={() => {
                  communityStore.editComment(editingComment.id, editText, 'Site Admin');
                  setEditingComment(null);
                  showToast('Edited comment text');
                }}
                className="px-4 py-2 bg-[#074504] text-[#C0991B] font-black uppercase text-xs rounded-xl cursor-pointer"
              >
                Save Edits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER BAN / SUSPEND MODAL */}
      {selectedUserForAction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-black text-sm text-red-600 uppercase">Ban / Suspend Account ({selectedUserForAction.name})</h3>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Ban Reason / Moderator Notes</label>
              <input
                type="text"
                value={userBanReason}
                onChange={e => setUserBanReason(e.target.value)}
                placeholder="e.g. Repeated commercial spam link violations"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedUserForAction(null)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold uppercase text-xs rounded-xl cursor-pointer">Cancel</button>
              <button
                onClick={() => {
                  communityStore.updateUserStatus(selectedUserForAction.id, 'Banned', 'Site Admin', userBanReason || 'Violated community guidelines.');
                  setSelectedUserForAction(null);
                  setUserBanReason('');
                  showToast(`Permanently banned user ${selectedUserForAction.name}`);
                }}
                className="px-4 py-2 bg-red-600 text-white font-black uppercase text-xs rounded-xl cursor-pointer"
              >
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
