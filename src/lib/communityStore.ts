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

const INITIAL_USERS: ModeratedUser[] = [
  {
    id: 'usr-1',
    name: 'Dr. Samuel Maina',
    email: 'samuel.maina@embucounty.go.ke',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    status: 'Active',
    reputationScore: 880,
    reputationRank: 'Gold Ambassador',
    badges: ['Top Contributor', 'Verified Scholar', 'Community Mentor'],
    totalComments: 34,
    approvedComments: 34,
    rejectedComments: 0,
    spamViolations: 0,
    helpfulLikes: 142,
    reportsReceived: 0,
    ipAddress: '197.232.48.12',
    notes: 'Respected agricultural officer in Manyatta Constituency.'
  },
  {
    id: 'usr-2',
    name: 'Mercy Wambui Gitonga',
    email: 'mercy.wambui@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    status: 'Active',
    reputationScore: 650,
    reputationRank: 'Silver Contributor',
    badges: ['Table Banking Leader', 'Helpful Member'],
    totalComments: 18,
    approvedComments: 17,
    rejectedComments: 1,
    spamViolations: 0,
    helpfulLikes: 89,
    reportsReceived: 0,
    ipAddress: '102.222.144.5'
  },
  {
    id: 'usr-3',
    name: 'Jackson Kilonzo',
    email: 'kilonzojackson@yahoo.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    status: 'Warned',
    reputationScore: 310,
    reputationRank: 'New Contributor',
    badges: [],
    totalComments: 8,
    approvedComments: 5,
    rejectedComments: 3,
    spamViolations: 1,
    helpfulLikes: 12,
    reportsReceived: 2,
    ipAddress: '102.140.22.89',
    notes: 'Warned for aggressive promotional link posting.'
  },
  {
    id: 'usr-4',
    name: 'Crypto Loans Bot',
    email: 'fastcash247@disposablemail.org',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    status: 'Banned',
    reputationScore: 0,
    reputationRank: 'Flagged Account',
    badges: ['Banned'],
    totalComments: 12,
    approvedComments: 0,
    rejectedComments: 12,
    spamViolations: 12,
    helpfulLikes: 0,
    reportsReceived: 9,
    ipAddress: '41.203.210.4',
    notes: 'Permanently banned for spamming external whatsapp telegram links.'
  },
  {
    id: 'usr-5',
    name: 'Peter Njiru Ndwiga',
    email: 'peter.ndwiga@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    status: 'Active',
    reputationScore: 520,
    reputationRank: 'Bronze Advocate',
    badges: ['Agripreneur'],
    totalComments: 11,
    approvedComments: 10,
    rejectedComments: 1,
    spamViolations: 0,
    helpfulLikes: 44,
    reportsReceived: 0,
    ipAddress: '197.237.112.90'
  }
];

const INITIAL_COMMENTS: EnterpriseComment[] = [
  {
    id: 'comm-101',
    postSlug: 'embu-youth-empowerment-fund-2026',
    postTitle: 'Embu County Youth Empowerment Fund 2026 Disbursement Guidelines',
    authorName: 'Dr. Samuel Maina',
    authorEmail: 'samuel.maina@embucounty.go.ke',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    authorId: 'usr-1',
    content: 'This microfinance framework provides a vital bridge for young entrepreneurs in Runyenjes and Mbeere South. We encourage all youth-led agricultural cooperatives to submit their registration documents before the July deadline.',
    status: 'Approved',
    aiRiskScore: 4,
    aiAnalysis: {
      toxicity: 2,
      spamProbability: 3,
      profanityDetected: false,
      hateSpeechDetected: false,
      duplicateDetected: false,
      sentiment: 'Positive',
      language: 'English',
      suggestedAction: 'Auto-Approve',
      confidence: 98,
      moderatorExplanation: 'Constructive community feedback from verified local agricultural officer.'
    },
    reportCount: 0,
    reports: [],
    likes: 28,
    isPinned: true,
    isModeratorReply: false,
    ipAddress: '197.232.48.12',
    browser: 'Chrome 124.0',
    os: 'Windows 11',
    country: 'Kenya (Nairobi)',
    device: 'Desktop',
    postedDate: '2026-07-28 09:14 AM',
    lastUpdated: '2026-07-28 09:14 AM',
    moderationHistory: [
      { date: '2026-07-28 09:15 AM', action: 'Auto-Approved by AI Moderation System', moderator: 'AI Bot System' }
    ],
    replies: [
      {
        id: 'comm-101-r1',
        postSlug: 'embu-youth-empowerment-fund-2026',
        postTitle: 'Embu County Youth Empowerment Fund 2026 Disbursement Guidelines',
        authorName: 'Mercy Wambui Gitonga',
        authorEmail: 'mercy.wambui@gmail.com',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        authorId: 'usr-2',
        content: 'Thank you Dr. Maina! Does our poultry farming group in Mbeere North qualify under the Kilimo Imara agribusiness bracket?',
        parentId: 'comm-101',
        status: 'Approved',
        aiRiskScore: 8,
        aiAnalysis: {
          toxicity: 3,
          spamProbability: 5,
          profanityDetected: false,
          hateSpeechDetected: false,
          duplicateDetected: false,
          sentiment: 'Positive',
          language: 'English',
          suggestedAction: 'Auto-Approve',
          confidence: 96,
          moderatorExplanation: 'Inquisitive member comment.'
        },
        reportCount: 0,
        reports: [],
        likes: 12,
        ipAddress: '102.222.144.5',
        browser: 'Safari 17.4',
        os: 'iOS 17',
        country: 'Kenya (Embu)',
        device: 'Mobile',
        postedDate: '2026-07-28 10:02 AM',
        lastUpdated: '2026-07-28 10:02 AM',
        moderationHistory: [
          { date: '2026-07-28 10:03 AM', action: 'Auto-Approved', moderator: 'AI Bot' }
        ]
      },
      {
        id: 'comm-101-r2',
        postSlug: 'embu-youth-empowerment-fund-2026',
        postTitle: 'Embu County Youth Empowerment Fund 2026 Disbursement Guidelines',
        authorName: 'Patrick Munene (Neema HEEP Officer)',
        authorEmail: 'admin@neemaheep.co.ke',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        content: 'Yes Mercy! Poultry cooperatives with active group registration qualify for up to KES 350,000 under Kilimo Imara with grace periods.',
        parentId: 'comm-101',
        status: 'Approved',
        aiRiskScore: 2,
        aiAnalysis: {
          toxicity: 1,
          spamProbability: 1,
          profanityDetected: false,
          hateSpeechDetected: false,
          duplicateDetected: false,
          sentiment: 'Positive',
          language: 'English',
          suggestedAction: 'Auto-Approve',
          confidence: 100,
          moderatorExplanation: 'Official staff response.'
        },
        reportCount: 0,
        reports: [],
        likes: 19,
        isModeratorReply: true,
        ipAddress: '197.232.12.1',
        browser: 'Edge 124.0',
        os: 'MacOS Sonoma',
        country: 'Kenya (Embu)',
        device: 'Desktop',
        postedDate: '2026-07-28 10:30 AM',
        lastUpdated: '2026-07-28 10:30 AM',
        moderationHistory: [
          { date: '2026-07-28 10:30 AM', action: 'Staff Moderator Fast Track', moderator: 'System' }
        ]
      }
    ]
  },
  {
    id: 'comm-102',
    postSlug: 'financial-literacy-for-smes-kenya',
    postTitle: 'Financial Literacy & Cashflow Mastery for Kenyan SMEs',
    authorName: 'Jackson Kilonzo',
    authorEmail: 'kilonzojackson@yahoo.com',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    authorId: 'usr-3',
    content: 'Get guaranteed instant loan without CRB check! Click www.fast-cash-embu-loans.click or whatsapp 0712345678 now for 50k cash!!!',
    status: 'Spam',
    aiRiskScore: 96,
    aiAnalysis: {
      toxicity: 15,
      spamProbability: 98,
      profanityDetected: false,
      hateSpeechDetected: false,
      duplicateDetected: true,
      sentiment: 'Neutral',
      language: 'English',
      suggestedAction: 'Mark Spam',
      confidence: 99,
      moderatorExplanation: 'High spam probability: contains suspicious external link, instant loan promises, and whatsapp number stuffing.'
    },
    reportCount: 3,
    reports: [
      {
        id: 'rep-1',
        reason: 'Spam',
        reporterName: 'Mercy Wambui',
        reporterEmail: 'mercy.wambui@gmail.com',
        date: '2026-07-29 11:20 AM',
        moderatorNotes: 'Commercial loan phishing link.',
        resolution: 'Removed'
      },
      {
        id: 'rep-2',
        reason: 'Scams',
        reporterName: 'Dr. Samuel Maina',
        reporterEmail: 'samuel.maina@embucounty.go.ke',
        date: '2026-07-29 11:35 AM',
        moderatorNotes: 'Fake loan link.',
        resolution: 'Removed'
      }
    ],
    likes: 0,
    ipAddress: '102.140.22.89',
    browser: 'Chrome 122.0',
    os: 'Android 14',
    country: 'Kenya (Mombasa)',
    device: 'Mobile',
    postedDate: '2026-07-29 11:10 AM',
    lastUpdated: '2026-07-29 11:40 AM',
    moderationHistory: [
      { date: '2026-07-29 11:10 AM', action: 'Flagged by AI Spam Filter', moderator: 'AI Bot' },
      { date: '2026-07-29 11:40 AM', action: 'Marked as Spam & Hidden', moderator: 'Admin Moderator' }
    ]
  },
  {
    id: 'comm-103',
    postSlug: 'table-banking-success-stories',
    postTitle: 'Transforming Rural Household Economies Through Table Banking',
    authorName: 'Anonymized Member',
    authorEmail: 'anon.user@gmail.com',
    content: 'These politicians and microfinance managers are all corrupt frauds who steal our money! Fools!',
    status: 'Pending',
    aiRiskScore: 82,
    aiAnalysis: {
      toxicity: 88,
      spamProbability: 12,
      profanityDetected: true,
      hateSpeechDetected: true,
      duplicateDetected: false,
      sentiment: 'Toxic',
      language: 'English',
      suggestedAction: 'Flag for Review',
      confidence: 94,
      moderatorExplanation: 'Profanity and insult keywords detected ("fools", "corrupt frauds"). Requires manual review for hostility.'
    },
    reportCount: 1,
    reports: [
      {
        id: 'rep-3',
        reason: 'Offensive Language',
        reporterName: 'Peter Ndwiga',
        reporterEmail: 'peter.ndwiga@gmail.com',
        date: '2026-07-30 08:10 AM',
        moderatorNotes: 'Abusive comment toward staff.',
        resolution: 'Pending'
      }
    ],
    likes: 1,
    ipAddress: '41.89.22.10',
    browser: 'Firefox 125.0',
    os: 'Linux Ubuntu',
    country: 'Kenya (Nairobi)',
    device: 'Desktop',
    postedDate: '2026-07-30 07:55 AM',
    lastUpdated: '2026-07-30 07:55 AM',
    moderationHistory: [
      { date: '2026-07-30 07:55 AM', action: 'Held in Pending Queue for Admin Toxicity Review', moderator: 'AI System' }
    ]
  },
  {
    id: 'comm-104',
    postSlug: 'agribusiness-financing-guide',
    postTitle: 'Complete Agri-Business Financing Guide for Smallholder Farmers',
    authorName: 'Peter Njiru Ndwiga',
    authorEmail: 'peter.ndwiga@gmail.com',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    authorId: 'usr-5',
    content: 'We implemented the drip irrigation schedule described in section 3. The yields for our French beans in Gachoka doubled this harvest season! Great article.',
    status: 'Approved',
    aiRiskScore: 3,
    aiAnalysis: {
      toxicity: 1,
      spamProbability: 2,
      profanityDetected: false,
      hateSpeechDetected: false,
      duplicateDetected: false,
      sentiment: 'Positive',
      language: 'English',
      suggestedAction: 'Auto-Approve',
      confidence: 99,
      moderatorExplanation: 'Praiseworthy farmer testimonial.'
    },
    reportCount: 0,
    reports: [],
    likes: 15,
    ipAddress: '197.237.112.90',
    browser: 'Chrome 124.0',
    os: 'Android 13',
    country: 'Kenya (Embu)',
    device: 'Mobile',
    postedDate: '2026-07-31 02:15 PM',
    lastUpdated: '2026-07-31 02:15 PM',
    moderationHistory: [
      { date: '2026-07-31 02:15 PM', action: 'Auto-Approved', moderator: 'AI System' }
    ]
  },
  {
    id: 'comm-105',
    postSlug: 'agribusiness-financing-guide',
    postTitle: 'Complete Agri-Business Financing Guide for Smallholder Farmers',
    authorName: 'Ghost Account',
    authorEmail: 'tempuser99@trashmail.com',
    content: 'Nice post. Very informative. Check my bio.',
    status: 'Hidden',
    aiRiskScore: 65,
    aiAnalysis: {
      toxicity: 5,
      spamProbability: 68,
      profanityDetected: false,
      hateSpeechDetected: false,
      duplicateDetected: false,
      sentiment: 'Neutral',
      language: 'English',
      suggestedAction: 'Flag for Review',
      confidence: 85,
      moderatorExplanation: 'Disposable email domain detected. Generic low-effort filler comment.'
    },
    reportCount: 0,
    reports: [],
    likes: 0,
    ipAddress: '102.166.45.12',
    browser: 'Chrome 120.0',
    os: 'Windows 10',
    country: 'Kenya (Nakuru)',
    device: 'Desktop',
    postedDate: '2026-08-01 10:05 AM',
    lastUpdated: '2026-08-01 11:00 AM',
    moderationHistory: [
      { date: '2026-08-01 11:00 AM', action: 'Hidden from Public Stream by Moderator', moderator: 'Admin User' }
    ]
  },
  {
    id: 'comm-106',
    postSlug: 'financial-literacy-for-smes-kenya',
    postTitle: 'Financial Literacy & Cashflow Mastery for Kenyan SMEs',
    authorName: 'Crypto Loans Bot',
    authorEmail: 'fastcash247@disposablemail.org',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    authorId: 'usr-4',
    content: 'DELETED SPAM: Buy bitcoin now! Call 0700000000',
    status: 'Deleted',
    aiRiskScore: 99,
    aiAnalysis: {
      toxicity: 10,
      spamProbability: 99,
      profanityDetected: false,
      hateSpeechDetected: false,
      duplicateDetected: true,
      sentiment: 'Neutral',
      language: 'English',
      suggestedAction: 'Auto-Reject',
      confidence: 99,
      moderatorExplanation: 'Blacklisted banned user account and duplicate spam pattern.'
    },
    reportCount: 4,
    reports: [],
    likes: 0,
    ipAddress: '41.203.210.4',
    browser: 'Bot Script',
    os: 'Linux',
    country: 'Unknown',
    device: 'Automated Bot',
    postedDate: '2026-08-01 01:20 PM',
    lastUpdated: '2026-08-01 01:30 PM',
    moderationHistory: [
      { date: '2026-08-01 01:30 PM', action: 'Permanently Soft-Deleted', moderator: 'Admin User' }
    ]
  }
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    timestamp: '2026-08-01 01:30 PM',
    moderator: 'Admin Moderator',
    action: 'Delete Comment',
    targetId: 'comm-106',
    targetType: 'Comment',
    details: 'Moved duplicate crypto bot comment to Deleted queue.',
    ipAddress: '197.232.12.1'
  },
  {
    id: 'aud-2',
    timestamp: '2026-08-01 11:00 AM',
    moderator: 'Admin Moderator',
    action: 'Hide Comment',
    targetId: 'comm-105',
    targetType: 'Comment',
    details: 'Hidden low-quality disposable email comment from public view.'
  },
  {
    id: 'aud-3',
    timestamp: '2026-07-29 11:40 AM',
    moderator: 'Admin Moderator',
    action: 'Mark Spam & Ban User',
    targetId: 'usr-4',
    targetType: 'User',
    details: 'Permanently banned Crypto Loans Bot (fastcash247@disposablemail.org).'
  },
  {
    id: 'aud-4',
    timestamp: '2026-07-28 09:15 AM',
    moderator: 'AI Bot System',
    action: 'Auto Approval',
    targetId: 'comm-101',
    targetType: 'Comment',
    details: 'Auto-approved comment by Dr. Samuel Maina (Risk score: 4%).'
  }
];

const INITIAL_NOTIFS: ModerationNotification[] = [
  {
    id: 'notif-1',
    timestamp: '10 mins ago',
    title: 'High AI Toxicity Risk Alert',
    message: 'Comment comm-103 flagged with 82% risk score (profanity keywords detected).',
    type: 'high_risk',
    read: false,
    linkTab: 'pending'
  },
  {
    id: 'notif-2',
    timestamp: '1 hour ago',
    title: 'New Community Report Submitted',
    message: 'User reported comment on "Financial Literacy" for Scam & Malicious links.',
    type: 'new_report',
    read: false,
    linkTab: 'reported'
  },
  {
    id: 'notif-3',
    timestamp: 'Yesterday',
    title: 'Spam Attack Mitigated',
    message: 'AI Spam Filter blocked 12 bot postings from 41.203.210.4.',
    type: 'spam_alert',
    read: true,
    linkTab: 'spam'
  }
];

// COMMUNITY STORE ENGINE
export const communityStore = {
  // 1. Get Comments
  getComments(): EnterpriseComment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_COMMENTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load community comments from storage', e);
    }
    this.saveComments(INITIAL_COMMENTS);
    return INITIAL_COMMENTS;
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
