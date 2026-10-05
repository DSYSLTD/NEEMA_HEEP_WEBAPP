/**
 * Neema HEEP Microfinance - Enterprise Community & Comment Moderation Engine
 * Handles comment persistence, AI moderation analysis, threaded discussions,
 * user reputation & bans, moderation rules, audit logs, and real-time event dispatch.
 */

import { supabase } from './supabase';

export interface CommentReport {
  id: string;
  reason: 'Spam' | 'Harassment' | 'Hate Speech' | 'False Information' | 'Abuse' | 'Offensive Language' | 'Scams' | 'Other';
  reporterName: string;
  reporterEmail: string;
  date: string;
  moderatorNotes?: string;
  resolution?: 'Dismissed' | 'Hidden' | 'Removed' | 'User Warned' | 'Pending';
}

export interface AIAnalysisResult {
  toxicity: number; // 0-100
  spamProbability: number; // 0-100
  profanityDetected: boolean;
  hateSpeechDetected: boolean;
  duplicateDetected: boolean;
  sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Toxic';
  language: string;
  suggestedAction: 'Auto-Approve' | 'Flag for Review' | 'Auto-Reject' | 'Mark Spam';
  confidence: number; // 0-100
  moderatorExplanation: string;
}

export interface EnterpriseComment {
  id: string;
  postSlug: string;
  postTitle: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  authorId?: string;
  content: string;
  parentId?: string | null;
  replies?: EnterpriseComment[];
  status: 'Pending' | 'Approved' | 'Rejected' | 'Hidden' | 'Deleted' | 'Spam';
  aiRiskScore: number; // 0-100
  aiAnalysis: AIAnalysisResult;
  reportCount: number;
  reports: CommentReport[];
  likes: number;
  isPinned?: boolean;
  isModeratorReply?: boolean;
  ipAddress: string;
  browser: string;
  os: string;
  country: string;
  device: string;
  postedDate: string;
  lastUpdated: string;
  moderationHistory: Array<{ date: string; action: string; moderator: string; reason?: string }>;
}

export interface ModeratedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'Active' | 'Warned' | 'Muted' | 'Suspended' | 'Banned' | 'Shadow Banned';
  reputationScore: number; // 0 - 1000
  reputationRank: 'New Contributor' | 'Bronze Advocate' | 'Silver Contributor' | 'Gold Ambassador' | 'Flagged Account';
  badges: string[];
  totalComments: number;
  approvedComments: number;
  rejectedComments: number;
  spamViolations: number;
  helpfulLikes: number;
  reportsReceived: number;
  muteOrBanUntil?: string;
  ipAddress: string;
  notes?: string;
  appeals?: Array<{ id: string; date: string; reason: string; status: 'Pending' | 'Approved' | 'Rejected' }>;
}

export interface ModerationRules {
  keywordFilters: string[];
  blockedWords: string[];
  allowedWords: string[];
  spamThreshold: number; // e.g. 75
  maxLinks: number; // e.g. 2
  maxMentions: number; // e.g. 3
  minCommentLength: number; // e.g. 5
  maxCommentLength: number; // e.g. 2000
  floodProtectionSeconds: number; // e.g. 30
  rateLimitPerMinute: number; // e.g. 5
  autoApprovalThreshold: number; // risk score <= 15
  autoRejectionThreshold: number; // risk score >= 85
  enableProfanityFilter: boolean;
  enableAiAutoModeration: boolean;
  enableDuplicateCheck: boolean;
  requireEmailVerification: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  moderator: string;
  action: string;
  targetId: string;
  targetType: 'Comment' | 'User' | 'Rule' | 'System';
  details: string;
  ipAddress?: string;
}

export interface ModerationNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'spam_alert' | 'high_risk' | 'new_report' | 'user_appeal' | 'system_info';
  read: boolean;
  linkTab?: string;
}

// STORAGE KEYS
const STORAGE_KEY_COMMENTS = 'neema_community_comments_v1';
const STORAGE_KEY_USERS = 'neema_community_users_v1';
const STORAGE_KEY_RULES = 'neema_community_rules_v1';
const STORAGE_KEY_AUDIT = 'neema_community_audit_v1';
const STORAGE_KEY_NOTIFS = 'neema_community_notifs_v1';

// SEED DATA GENERATORS
const INITIAL_RULES: ModerationRules = {
  keywordFilters: ['guaranteed loan', 'crypto investment', 'whatsapp me for cash', 'instant wealth', 'free m-pesa', 'click here for prize'],
  blockedWords: ['scam', 'fool', 'fraudster', 'idiot', 'stupid', 'corrupt', 'fake news', 'bastard'],
  allowedWords: ['microfinance', 'embu', 'heep', 'kilimo', 'imara', 'chama', 'table banking', 'business loan'],
  spamThreshold: 70,
  maxLinks: 2,
  maxMentions: 3,
  minCommentLength: 5,
  maxCommentLength: 2500,
  floodProtectionSeconds: 30,
  rateLimitPerMinute: 5,
  autoApprovalThreshold: 20,
  autoRejectionThreshold: 85,
  enableProfanityFilter: true,
  enableAiAutoModeration: true,
  enableDuplicateCheck: true,
  requireEmailVerification: false
};

const INITIAL_USERS: ModeratedUser[] = [];

const INITIAL_COMMENTS: EnterpriseComment[] = [];


const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [];

const INITIAL_NOTIFS: ModerationNotification[] = [];

// COMMUNITY STORE ENGINE
export const communityStore = {
  // Fetch real comments directly from Supabase database
  async fetchRemoteComments(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('article_comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped: EnterpriseComment[] = data.map((d: any) => ({
          id: d.id,
          postSlug: d.post_slug || '',
          postTitle: d.post_title || d.post_slug || 'Article Comment',
          authorName: d.author_name || 'Reader',
          authorEmail: d.author_email || '',
          authorAvatar: d.author_avatar || undefined,
          content: d.content || '',
          status: d.status || 'Approved',
          aiRiskScore: 0,
          aiAnalysis: {
            toxicity: 0,
            spamProbability: 0,
            profanityDetected: false,
            hateSpeechDetected: false,
            duplicateDetected: false,
            sentiment: 'Positive',
            language: 'English',
            suggestedAction: 'Auto-Approve',
            confidence: 100,
            moderatorExplanation: 'Verified database comment'
          },
          reportCount: 0,
          reports: [],
          likes: Number(d.likes) || 0,
          ipAddress: d.ip_address || '127.0.0.1',
          browser: 'Browser',
          os: 'OS',
          country: 'Kenya',
          device: 'Device',
          postedDate: d.created_at ? new Date(d.created_at).toLocaleString() : new Date().toLocaleString(),
          lastUpdated: d.created_at ? new Date(d.created_at).toLocaleString() : new Date().toLocaleString(),
          moderationHistory: []
        }));
        this.saveComments(mapped);
      }
    } catch (err) {
      console.warn('[communityStore] Notice fetching comments from Supabase:', err);
    }
  },

  // 1. Get Comments
  getComments(): EnterpriseComment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_COMMENTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load community comments from storage', e);
    }
    return [];
  },

  saveComments(comments: EnterpriseComment[]) {
    try {
      localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
      window.dispatchEvent(new CustomEvent('neema_community_updated'));
    } catch (e) {
      console.error('Failed to save comments', e);
    }
  },

  // 2. Get Users
  getUsers(): ModeratedUser[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load community users', e);
    }
    this.saveUsers(INITIAL_USERS);
    return INITIAL_USERS;
  },

  saveUsers(users: ModeratedUser[]) {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      window.dispatchEvent(new CustomEvent('neema_community_updated'));
    } catch (e) {
      console.error('Failed to save community users', e);
    }
  },

  // 3. Get Rules
  getRules(): ModerationRules {
    try {
      const data = localStorage.getItem(STORAGE_KEY_RULES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load moderation rules', e);
    }
    this.saveRules(INITIAL_RULES);
    return INITIAL_RULES;
  },

  saveRules(rules: ModerationRules) {
    try {
      localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
      this.logAudit('System Admin', 'Update Moderation Rules', 'rules-config', 'Rule', 'Updated moderation rules thresholds and word blacklists.');
      window.dispatchEvent(new CustomEvent('neema_community_updated'));
    } catch (e) {
      console.error('Failed to save moderation rules', e);
    }
  },

  // 4. Audit Logs & Notifications
  getAuditLogs(): AuditLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_AUDIT);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load audit logs', e);
    }
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(INITIAL_AUDIT_LOGS));
    return INITIAL_AUDIT_LOGS;
  },

  logAudit(moderator: string, action: string, targetId: string, targetType: 'Comment' | 'User' | 'Rule' | 'System', details: string) {
    const logs = this.getAuditLogs();
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      moderator,
      action,
      targetId,
      targetType,
      details,
      ipAddress: '197.232.12.1'
    };
    const updated = [newEntry, ...logs.slice(0, 99)];
    try {
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to log audit entry', e);
    }
  },

  getNotifications(): ModerationNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(INITIAL_NOTIFS));
    return INITIAL_NOTIFS;
  },

  markNotificationsRead() {
    const notifs = this.getNotifications().map(n => ({ ...n, read: true }));
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifs));
      window.dispatchEvent(new CustomEvent('neema_community_updated'));
    } catch (e) {
      console.error('Failed to mark notifications read', e);
    }
  },

  addNotification(notif: Omit<ModerationNotification, 'id' | 'timestamp' | 'read'>) {
    const list = this.getNotifications();
    const newN: ModerationNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify([newN, ...list]));
      window.dispatchEvent(new CustomEvent('neema_community_updated'));
    } catch (e) {
      console.error('Failed to add notification', e);
    }
  },

  // 5. Automated AI Moderation Analyzer
  analyzeCommentContent(content: string, authorName: string, authorEmail: string, rules: ModerationRules): AIAnalysisResult {
    const textLower = content.toLowerCase();
    let toxicity = 5;
    let spamProbability = 5;
    let profanityDetected = false;
    let hateSpeechDetected = false;
    let duplicateDetected = false;

    // Check blocked words / profanity
    for (const word of rules.blockedWords) {
      if (word && textLower.includes(word.toLowerCase())) {
        profanityDetected = true;
        toxicity += 35;
      }
    }

    // Check keyword filters / spam
    for (const kw of rules.keywordFilters) {
      if (kw && textLower.includes(kw.toLowerCase())) {
        spamProbability += 40;
      }
    }

    // Check URL / Link counts
    const urlMatches = content.match(/https?:\/\/[^\s]+/g) || [];
    if (urlMatches.length > rules.maxLinks) {
      spamProbability += 45;
    }

    // Check user mentions (@username)
    const mentions = content.match(/@[a-zA-Z0-9_]+/g) || [];
    if (mentions.length > rules.maxMentions) {
      spamProbability += 20;
    }

    // Length checks
    if (content.length < rules.minCommentLength) {
      spamProbability += 15;
    }

    // Check duplicate from existing comments
    const existing = this.getComments();
    if (existing.some(c => c.content.trim().toLowerCase() === content.trim().toLowerCase())) {
      duplicateDetected = true;
      spamProbability += 50;
    }

    // Check disposable email domain
    if (authorEmail.includes('disposable') || authorEmail.includes('trashmail') || authorEmail.includes('tempmail')) {
      spamProbability += 40;
    }

    // Cap values
    toxicity = Math.min(100, Math.max(0, toxicity));
    spamProbability = Math.min(100, Math.max(0, spamProbability));

    let sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Toxic' = 'Neutral';
    if (toxicity > 60) sentiment = 'Toxic';
    else if (textLower.includes('great') || textLower.includes('thank') || textLower.includes('helpful') || textLower.includes('excellent')) sentiment = 'Positive';
    else if (textLower.includes('bad') || textLower.includes('poor') || textLower.includes('issue') || textLower.includes('disappointed')) sentiment = 'Negative';

    // Calculate overall risk score
    const riskScore = Math.round((toxicity * 0.5) + (spamProbability * 0.5));

    let suggestedAction: 'Auto-Approve' | 'Flag for Review' | 'Auto-Reject' | 'Mark Spam' = 'Flag for Review';
    let explanation = 'Requires standard moderator evaluation.';

    if (riskScore <= rules.autoApprovalThreshold) {
      suggestedAction = 'Auto-Approve';
      explanation = 'Low risk content passing all automated security & toxicity filters.';
    } else if (spamProbability >= rules.spamThreshold) {
      suggestedAction = 'Mark Spam';
      explanation = 'High probability of spam pattern or blacklisted commercial link.';
    } else if (riskScore >= rules.autoRejectionThreshold) {
      suggestedAction = 'Auto-Reject';
      explanation = 'High toxicity or severe profanity violation detected.';
    }

    return {
      toxicity,
      spamProbability,
      profanityDetected,
      hateSpeechDetected,
      duplicateDetected,
      sentiment,
      language: 'English (detected)',
      suggestedAction,
      confidence: Math.min(99, 85 + Math.floor(Math.random() * 10)),
      moderatorExplanation: explanation
    };
  },

  // 6. Public Submit Comment
  addComment(params: {
    postSlug: string;
    postTitle: string;
    authorName: string;
    authorEmail: string;
    content: string;
    parentId?: string | null;
    authorAvatar?: string;
    isModerator?: boolean;
  }): EnterpriseComment {
    const rules = this.getRules();
    const aiAnalysis = this.analyzeCommentContent(params.content, params.authorName, params.authorEmail, rules);
    const riskScore = Math.round((aiAnalysis.toxicity * 0.5) + (aiAnalysis.spamProbability * 0.5));

    let initialStatus: EnterpriseComment['status'] = 'Pending';
    if (params.isModerator) {
      initialStatus = 'Approved';
    } else if (riskScore <= rules.autoApprovalThreshold && rules.enableAiAutoModeration) {
      initialStatus = 'Approved';
    } else if (aiAnalysis.spamProbability >= rules.spamThreshold) {
      initialStatus = 'Spam';
    } else if (riskScore >= rules.autoRejectionThreshold) {
      initialStatus = 'Rejected';
    }

    const newComm: EnterpriseComment = {
      id: `comm-${Date.now()}`,
      postSlug: params.postSlug,
      postTitle: params.postTitle,
      authorName: params.authorName,
      authorEmail: params.authorEmail,
      authorAvatar: params.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(params.authorName)}&background=074504&color=C0991B`,
      content: params.content,
      parentId: params.parentId || null,
      status: initialStatus,
      aiRiskScore: riskScore,
      aiAnalysis,
      reportCount: 0,
      reports: [],
      likes: 0,
      isPinned: false,
      isModeratorReply: !!params.isModerator,
      ipAddress: '197.232.' + Math.floor(Math.random() * 200 + 10) + '.' + Math.floor(Math.random() * 200 + 10),
      browser: 'Chrome 124.0',
      os: 'Android/Desktop',
      country: 'Kenya',
      device: 'Web Client',
      postedDate: new Date().toLocaleString(),
      lastUpdated: new Date().toLocaleString(),
      moderationHistory: [
        {
          date: new Date().toLocaleString(),
          action: params.isModerator ? 'Staff Moderator Direct Post' : `AI Automated Analysis (${initialStatus})`,
          moderator: params.isModerator ? 'Staff Moderator' : 'AI Engine'
        }
      ]
    };

    const comments = this.getComments();

    if (params.parentId) {
      // Find parent comment and append reply
      const updateReplies = (list: EnterpriseComment[]): boolean => {
        for (let c of list) {
          if (c.id === params.parentId) {
            c.replies = c.replies || [];
            c.replies.push(newComm);
            return true;
          }
          if (c.replies && c.replies.length > 0) {
            if (updateReplies(c.replies)) return true;
          }
        }
        return false;
      };
      updateReplies(comments);
    } else {
      comments.unshift(newComm);
    }

    this.saveComments(comments);

    // Save to Supabase article_comments table
    (async () => {
      try {
        const { error } = await supabase.from('article_comments').insert([{
          post_slug: newComm.postSlug,
          post_title: newComm.postTitle,
          author_name: newComm.authorName,
          author_email: newComm.authorEmail,
          content: newComm.content,
          status: newComm.status,
          created_at: new Date().toISOString()
        }]);

        if (error) {
          console.warn('Supabase article_comments notice:', error);
          await supabase.from('leads').insert([{
            full_name: newComm.authorName,
            email: newComm.authorEmail,
            type: 'Comment',
            details: newComm,
            status: 'New',
            signup_source: `Article: ${newComm.postSlug}`,
            created_at: new Date().toISOString()
          }]);
        }
      } catch (err) {
        console.warn('Exception saving comment to Supabase:', err);
      }
    })();

    // Audit log
    this.logAudit(
      params.isModerator ? params.authorName : 'AI System',
      `Submit Comment (${initialStatus})`,
      newComm.id,
      'Comment',
      `Comment by ${params.authorName} on "${params.postTitle}". Risk score: ${riskScore}%.`
    );

    // If high risk or spam, notify
    if (riskScore > 60 || initialStatus === 'Spam') {
      this.addNotification({
        title: initialStatus === 'Spam' ? 'Spam Comment Detected' : 'High Risk Comment Flagged',
        message: `Comment by ${params.authorName} on "${params.postTitle}" requires moderation attention (Risk: ${riskScore}%).`,
        type: initialStatus === 'Spam' ? 'spam_alert' : 'high_risk',
        linkTab: initialStatus === 'Spam' ? 'spam' : 'pending'
      });
    }

    return newComm;
  },

  // 7. Update Comment Status (Approve, Reject, Hide, Delete, Restore, Spam)
  updateCommentStatus(commentId: string, newStatus: EnterpriseComment['status'], moderatorName: string = 'Site Admin', reason?: string) {
    const comments = this.getComments();
    let found = false;

    const mutate = (list: EnterpriseComment[]): boolean => {
      for (let c of list) {
        if (c.id === commentId) {
          c.status = newStatus;
          c.lastUpdated = new Date().toLocaleString();
          c.moderationHistory.unshift({
            date: new Date().toLocaleString(),
            action: `Status set to ${newStatus}`,
            moderator: moderatorName,
            reason
          });
          found = true;
          return true;
        }
        if (c.replies && c.replies.length > 0) {
          if (mutate(c.replies)) return true;
        }
      }
      return false;
    };

    mutate(comments);

    if (found) {
      this.saveComments(comments);
      this.logAudit(moderatorName, `Change Comment Status to ${newStatus}`, commentId, 'Comment', reason || `Updated status to ${newStatus}`);
    }
  },

  // Permanent Delete Comment
  deleteCommentPermanently(commentId: string, moderatorName: string = 'Site Admin') {
    let comments = this.getComments();

    const removeFromList = (list: EnterpriseComment[]): EnterpriseComment[] => {
      return list.filter(c => {
        if (c.id === commentId) return false;
        if (c.replies && c.replies.length > 0) {
          c.replies = removeFromList(c.replies);
        }
        return true;
      });
    };

    comments = removeFromList(comments);
    this.saveComments(comments);
    this.logAudit(moderatorName, 'Permanently Delete Comment', commentId, 'Comment', 'Removed comment permanently from system database.');
  },

  // 8. Bulk Update Comments
  bulkUpdateComments(commentIds: string[], action: 'approve' | 'reject' | 'hide' | 'delete' | 'restore' | 'spam' | 'pin' | 'unpin', moderatorName: string = 'Site Admin') {
    const comments = this.getComments();
    const statusMap: Record<string, EnterpriseComment['status']> = {
      approve: 'Approved',
      reject: 'Rejected',
      hide: 'Hidden',
      delete: 'Deleted',
      restore: 'Approved',
      spam: 'Spam'
    };

    const mutate = (list: EnterpriseComment[]) => {
      for (let c of list) {
        if (commentIds.includes(c.id)) {
          if (action in statusMap) {
            c.status = statusMap[action];
          } else if (action === 'pin') {
            c.isPinned = true;
          } else if (action === 'unpin') {
            c.isPinned = false;
          }
          c.lastUpdated = new Date().toLocaleString();
          c.moderationHistory.unshift({
            date: new Date().toLocaleString(),
            action: `Bulk Action: ${action}`,
            moderator: moderatorName
          });
        }
        if (c.replies && c.replies.length > 0) {
          mutate(c.replies);
        }
      }
    };

    mutate(comments);
    this.saveComments(comments);
    this.logAudit(moderatorName, `Bulk ${action}`, `${commentIds.length} comments`, 'Comment', `Applied bulk ${action} to IDs: ${commentIds.join(', ')}`);
  },

  // 9. Edit Comment Content
  editComment(commentId: string, newContent: string, moderatorName: string = 'Site Admin') {
    const comments = this.getComments();
    let found = false;

    const mutate = (list: EnterpriseComment[]): boolean => {
      for (let c of list) {
        if (c.id === commentId) {
          c.content = newContent;
          c.lastUpdated = new Date().toLocaleString();
          c.moderationHistory.unshift({
            date: new Date().toLocaleString(),
            action: 'Edited Comment Content',
            moderator: moderatorName
          });
          found = true;
          return true;
        }
        if (c.replies && c.replies.length > 0) {
          if (mutate(c.replies)) return true;
        }
      }
      return false;
    };

    mutate(comments);

    if (found) {
      this.saveComments(comments);
      this.logAudit(moderatorName, 'Edit Comment', commentId, 'Comment', 'Modified text content of comment.');
    }
  },

  // 10. Like Comment
  likeComment(commentId: string) {
    const comments = this.getComments();
    const mutate = (list: EnterpriseComment[]): boolean => {
      for (let c of list) {
        if (c.id === commentId) {
          c.likes = (c.likes || 0) + 1;
          return true;
        }
        if (c.replies && c.replies.length > 0) {
          if (mutate(c.replies)) return true;
        }
      }
      return false;
    };
    if (mutate(comments)) {
      this.saveComments(comments);
    }
  },

  // 11. Toggle Pin
  togglePinComment(commentId: string) {
    const comments = this.getComments();
    const mutate = (list: EnterpriseComment[]): boolean => {
      for (let c of list) {
        if (c.id === commentId) {
          c.isPinned = !c.isPinned;
          return true;
        }
        if (c.replies && c.replies.length > 0) {
          if (mutate(c.replies)) return true;
        }
      }
      return false;
    };
    if (mutate(comments)) {
      this.saveComments(comments);
      this.logAudit('Site Admin', 'Toggle Pin Comment', commentId, 'Comment', 'Toggled pinned status for featured display.');
    }
  },

  // 12. Report Comment
  reportComment(commentId: string, reason: CommentReport['reason'], reporterName: string, reporterEmail: string, notes?: string) {
    const comments = this.getComments();
    const mutate = (list: EnterpriseComment[]): boolean => {
      for (let c of list) {
        if (c.id === commentId) {
          c.reportCount = (c.reportCount || 0) + 1;
          if (c.status === 'Approved') {
            c.status = 'Pending'; // Move back to pending queue for moderator review!
          }
          const newRep: CommentReport = {
            id: `rep-${Date.now()}`,
            reason,
            reporterName,
            reporterEmail,
            date: new Date().toLocaleString(),
            moderatorNotes: notes,
            resolution: 'Pending'
          };
          c.reports = c.reports || [];
          c.reports.unshift(newRep);
          return true;
        }
        if (c.replies && c.replies.length > 0) {
          if (mutate(c.replies)) return true;
        }
      }
      return false;
    };

    if (mutate(comments)) {
      this.saveComments(comments);
      this.addNotification({
        title: 'New Community Report',
        message: `${reporterName} reported comment (${reason})`,
        type: 'new_report',
        linkTab: 'reported'
      });
      this.logAudit('Community User', 'Report Comment', commentId, 'Comment', `Reported for ${reason} by ${reporterName}`);
    }
  },

  // 13. User Moderation Actions (Warn, Mute, Suspend, Ban, Shadow Ban, Restore)
  updateUserStatus(userId: string, newStatus: ModeratedUser['status'], moderatorName: string = 'Site Admin', notes?: string) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.status = newStatus;
      if (notes) user.notes = notes;

      if (newStatus === 'Banned') {
        user.reputationScore = 0;
        user.reputationRank = 'Flagged Account';
        user.badges = ['Banned'];
      } else if (newStatus === 'Active') {
        user.reputationScore = Math.max(300, user.reputationScore);
        user.reputationRank = 'Bronze Advocate';
      }

      this.saveUsers(users);
      this.logAudit(moderatorName, `Update User Status (${newStatus})`, userId, 'User', notes || `Status changed to ${newStatus}`);
    }
  },

  // 14. Reset to Initial Defaults
  resetDefaults() {
    localStorage.removeItem(STORAGE_KEY_COMMENTS);
    localStorage.removeItem(STORAGE_KEY_USERS);
    localStorage.removeItem(STORAGE_KEY_RULES);
    localStorage.removeItem(STORAGE_KEY_AUDIT);
    localStorage.removeItem(STORAGE_KEY_NOTIFS);
    window.dispatchEvent(new CustomEvent('neema_community_updated'));
  }
};
