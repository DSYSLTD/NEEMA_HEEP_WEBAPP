import React, { useState, useMemo, useEffect } from 'react';
import { 
  Shield, Server, Activity, Clock, Database, Globe, Smartphone, Mail, FileText, Settings, 
  BarChart3, Layers, Bell, Key, KeyRound, LockKeyhole, Terminal, ArrowRight, SmartphoneNfc, HelpCircle, 
  HardDrive, Wand2, Info, ChevronRight, ShieldQuestion, Fingerprint, Monitor, Radio, AlertCircle, 
  FileCode, CheckSquare, X, CheckCircle2, Lock, Unlock, Search, Filter, RefreshCw, Power, AlertTriangle, 
  UserX, Download, Plus, Trash2, Eye, ShieldAlert, Sliders, Play, Pause, RotateCw, UserCheck, UserPlus, Users, User,
  Briefcase, GraduationCap, Phone, Award, ShieldCheck, Check, Edit3, LayoutGrid, List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { profilesStore, ExtendedUserProfile } from '../lib/profilesStore';
import { fetchAuditLogsFromDB, logGlobalAudit, AuditLogEntry } from '../services/auditService';

// ================= TYPES & INTERFACES =================
export interface ActiveSession {
  id: string;
  userId: string;
  username: string;
  role: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  loginTime: string;
  duration: string;
  lastActivity: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  isCurrentSession?: boolean;
}

export interface TrustedDevice {
  id: string;
  userId: string;
  username: string;
  deviceName: string;
  os: string;
  browser: string;
  location: string;
  ipAddress: string;
  trustedSince: string;
  lastUsed: string;
  riskScore: number;
  status: 'Approved' | 'Blocked' | 'Pending Review';
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  actorRole: string;
  category: 'Auth' | 'Security Policy' | 'Session' | 'Device' | 'API' | 'System' | 'Backup';
  status: 'Success' | 'Failed' | 'Warning' | 'Blocked';
  ipAddress: string;
  location: string;
  details: string;
  riskScore: number;
}

export interface ApiToken {
  id: string;
  name: string;
  prefix: string;
  createdFor: string;
  scopes: string[];
  rateLimitReqPerMin: number;
  createdDate: string;
  expiresDate: string;
  lastUsed: string;
  status: 'Active' | 'Revoked' | 'Expired';
}

export interface UserAccountHealth {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Disabled' | 'Locked' | 'Pending';
  mfaEnabled: boolean;
  healthScore: number;
  passwordAgeDays: number;
  failedAttempts: number;
  lastLogin: string;
  ipAddress: string;
}

export interface AutomationTask {
  id: string;
  name: string;
  description: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: 'Idle' | 'Running' | 'Failed' | 'Disabled';
  executionCount: number;
  avgDurationMs: number;
}

// ================= MOCK DATA =================
const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: 'sess-1',
    userId: 'usr-1',
    username: 'admin_neema1',
    role: 'Web Master',
    device: 'MacBook Pro 16"',
    browser: 'Chrome 126.0',
    os: 'macOS Sonoma',
    ipAddress: '102.218.45.12',
    location: 'Nairobi, Kenya',
    loginTime: '2026-07-31 08:30',
    duration: '6 hrs 25 mins',
    lastActivity: 'Just Now',
    riskLevel: 'Low',
    isCurrentSession: true,
  },
  {
    id: 'sess-2',
    userId: 'usr-1',
    username: 'admin_neema1',
    role: 'Web Master',
    device: 'iPhone 15 Pro',
    browser: 'Mobile Safari 17.4',
    os: 'iOS 17',
    ipAddress: '102.218.45.12',
    location: 'Nairobi, Kenya',
    loginTime: '2026-07-31 11:15',
    duration: '3 hrs 40 mins',
    lastActivity: '10 mins ago',
    riskLevel: 'Low',
  },
  {
    id: 'sess-3',
    userId: 'usr-2',
    username: 'staff_editor',
    role: 'Editor',
    device: 'Dell XPS 15',
    browser: 'Firefox 127.0',
    os: 'Windows 11',
    ipAddress: '102.218.48.90',
    location: 'Nyeri, Kenya',
    loginTime: '2026-07-31 12:00',
    duration: '2 hrs 55 mins',
    lastActivity: '15 mins ago',
    riskLevel: 'Low',
  },
  {
    id: 'sess-4',
    userId: 'usr-3',
    username: 'author_sam',
    role: 'Author',
    device: 'HP EliteBook',
    browser: 'Chrome 126.0',
    os: 'Windows 11',
    ipAddress: '197.232.88.11',
    location: 'Meru, Kenya',
    loginTime: '2026-07-31 13:10',
    duration: '1 hr 45 mins',
    lastActivity: '32 mins ago',
    riskLevel: 'Low',
  },
  {
    id: 'sess-5',
    userId: 'usr-4',
    username: 'dr_jane_m',
    role: 'Webmaster',
    device: 'Galaxy S24 Ultra',
    browser: 'Chrome Mobile',
    os: 'Android 14',
    ipAddress: '41.203.11.89',
    location: 'Mombasa, Kenya',
    loginTime: '2026-07-31 14:05',
    duration: '50 mins',
    lastActivity: '5 mins ago',
    riskLevel: 'Medium',
  },
];

const INITIAL_DEVICES: TrustedDevice[] = [
  {
    id: 'dev-1',
    userId: 'usr-1',
    username: 'admin_neema1',
    deviceName: 'Admin Workstation (MacBook Pro)',
    os: 'macOS Sonoma',
    browser: 'Chrome 126.0',
    location: 'Nairobi, Kenya',
    ipAddress: '102.218.45.12',
    trustedSince: '2026-01-15',
    lastUsed: 'Today 14:55',
    riskScore: 2,
    status: 'Approved',
  },
  {
    id: 'dev-2',
    userId: 'usr-1',
    username: 'admin_neema1',
    deviceName: 'Executive iPhone 15 Pro',
    os: 'iOS 17',
    browser: 'Safari',
    location: 'Nairobi, Kenya',
    ipAddress: '102.218.45.12',
    trustedSince: '2026-03-20',
    lastUsed: 'Today 11:15',
    riskScore: 5,
    status: 'Approved',
  },
  {
    id: 'dev-3',
    userId: 'usr-4',
    username: 'dr_jane_m',
    deviceName: 'Unrecognized Mobile Device',
    os: 'Android 14',
    browser: 'Chrome Mobile',
    location: 'Mombasa, Kenya',
    ipAddress: '41.203.11.89',
    trustedSince: '2026-07-28',
    lastUsed: 'Today 14:05',
    riskScore: 68,
    status: 'Pending Review',
  },
  {
    id: 'dev-4',
    userId: 'usr-5',
    username: 'auditor_pete',
    deviceName: 'Suspicious Remote Host',
    os: 'Linux x86_64',
    browser: 'Headless Chrome',
    location: 'Unknown Proxy Range',
    ipAddress: '197.254.12.44',
    trustedSince: '2026-07-30',
    lastUsed: '3 days ago',
    riskScore: 92,
    status: 'Blocked',
  },
];

const INITIAL_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'audit-101',
    timestamp: '2026-07-31 14:50:12',
    event: 'System Policy Configuration Sync',
    actor: 'admin_neema1',
    actorRole: 'Site Administrator',
    category: 'Security Policy',
    status: 'Success',
    ipAddress: '102.218.45.12',
    location: 'Nairobi, KE',
    details: 'Enforced password rotation cycle to 90 days across staff accounts.',
    riskScore: 10,
  },
  {
    id: 'audit-102',
    timestamp: '2026-07-31 14:15:00',
    event: 'Brute Force Login Threshold Exceeded',
    actor: 'unknown_ip',
    actorRole: 'Unauthenticated',
    category: 'Auth',
    status: 'Blocked',
    ipAddress: '197.254.12.44',
    location: 'Nakuru, KE',
    details: 'Auto-locked account "auditor_pete" after 5 consecutive bad password attempts.',
    riskScore: 88,
  },
  {
    id: 'audit-103',
    timestamp: '2026-07-31 13:20:18',
    event: 'MFA Security Token Verification',
    actor: 'staff_editor',
    actorRole: 'Editor',
    category: 'Auth',
    status: 'Success',
    ipAddress: '102.218.48.90',
    location: 'Nyeri, KE',
    details: 'Verified SMS OTP token on trusted device Dell XPS.',
    riskScore: 5,
  },
  {
    id: 'audit-104',
    timestamp: '2026-07-31 11:05:44',
    event: 'REST API Key Issued',
    actor: 'admin_neema1',
    actorRole: 'Site Administrator',
    category: 'API',
    status: 'Success',
    ipAddress: '102.218.45.12',
    location: 'Nairobi, KE',
    details: 'Generated bearer token "Mobile App Gateway" with read:articles scope.',
    riskScore: 15,
  },
  {
    id: 'audit-105',
    timestamp: '2026-07-31 09:12:30',
    event: 'Automated Database Backup Completed',
    actor: 'system_cron',
    actorRole: 'System Engine',
    category: 'Backup',
    status: 'Success',
    ipAddress: '127.0.0.1',
    location: 'Internal Cloud',
    details: 'Created encrypted snapshot (142.8 MB) stored to Firestore / Cloud Storage.',
    riskScore: 0,
  },
];

const INITIAL_API_TOKENS: ApiToken[] = [
  {
    id: 'tok-1',
    name: 'Neema Mobile App Service',
    prefix: 'nh_live_9f82...',
    createdFor: 'Mobile App Gateway',
    scopes: ['read:articles', 'read:beneficiaries', 'write:comments'],
    rateLimitReqPerMin: 1200,
    createdDate: '2026-02-10',
    expiresDate: '2027-02-10',
    lastUsed: '2 mins ago',
    status: 'Active',
  },
  {
    id: 'tok-2',
    name: 'M-PESA Webhook Consumer',
    prefix: 'nh_live_3k11...',
    createdFor: 'Finance Backend',
    scopes: ['read:beneficiaries', 'write:logs'],
    rateLimitReqPerMin: 300,
    createdDate: '2026-04-01',
    expiresDate: '2026-10-01',
    lastUsed: '1 hour ago',
    status: 'Active',
  },
];

const INITIAL_ACCOUNTS: UserAccountHealth[] = [
  {
    id: 'usr-1',
    username: 'admin_neema1',
    name: 'Neema Chief Administrator',
    email: 'admin@neemaheep.com',
    role: 'Site Administrator',
    status: 'Active',
    mfaEnabled: true,
    healthScore: 98,
    passwordAgeDays: 14,
    failedAttempts: 0,
    lastLogin: 'Just Now',
    ipAddress: '102.218.45.12',
  },
  {
    id: 'usr-2',
    username: 'staff_editor',
    name: 'Grace Wanjiku (Senior Editor)',
    email: 'grace.wanjiku@neemaheep.com',
    role: 'Editor',
    status: 'Active',
    mfaEnabled: true,
    healthScore: 92,
    passwordAgeDays: 28,
    failedAttempts: 0,
    lastLogin: '18 mins ago',
    ipAddress: '102.218.48.90',
  },
  {
    id: 'usr-3',
    username: 'author_sam',
    name: 'Samuel Ochieng',
    email: 'samuel.ochieng@neemaheep.com',
    role: 'Author',
    status: 'Active',
    mfaEnabled: true,
    healthScore: 85,
    passwordAgeDays: 45,
    failedAttempts: 1,
    lastLogin: '2 hours ago',
    ipAddress: '197.232.88.11',
  },
  {
    id: 'usr-4',
    username: 'dr_jane_m',
    name: 'Dr. Jane Muturi',
    email: 'jane.muturi@neemaheep.com',
    role: 'Webmaster',
    status: 'Active',
    mfaEnabled: false,
    healthScore: 68,
    passwordAgeDays: 82,
    failedAttempts: 2,
    lastLogin: '1 day ago',
    ipAddress: '41.203.11.89',
  },
  {
    id: 'usr-5',
    username: 'auditor_pete',
    name: 'Peter Kamau (Auditor)',
    email: 'peter.kamau@neemaheep.com',
    role: 'Auditor',
    status: 'Locked',
    mfaEnabled: true,
    healthScore: 35,
    passwordAgeDays: 110,
    failedAttempts: 5,
    lastLogin: '3 days ago',
    ipAddress: '197.254.12.44',
  },
];

const INITIAL_AUTOMATION_TASKS: AutomationTask[] = [
  {
    id: 'task-1',
    name: 'Database Encrypted Snapshot',
    description: 'Daily automated snapshot of Firestore collections and CMS media manifests.',
    schedule: 'Daily at 02:00 EAT',
    lastRun: '2026-07-31 02:00',
    nextRun: '2026-08-01 02:00',
    status: 'Idle',
    executionCount: 214,
    avgDurationMs: 4200,
  },
  {
    id: 'task-2',
    name: 'Session Inactivity Auto-Purge',
    description: 'Terminates idle sessions exceeding 60 minutes and clears memory tokens.',
    schedule: 'Every 15 Minutes',
    lastRun: '2026-07-31 14:45',
    nextRun: '2026-07-31 15:00',
    status: 'Idle',
    executionCount: 8412,
    avgDurationMs: 310,
  },
  {
    id: 'task-3',
    name: 'Security Vulnerability & Port Scanner',
    description: 'Scans REST endpoints, CORS headers, and API token rate limits for anomalies.',
    schedule: 'Hourly at :30',
    lastRun: '2026-07-31 14:30',
    nextRun: '2026-07-31 15:30',
    status: 'Idle',
    executionCount: 1420,
    avgDurationMs: 1850,
  },
];

export default function SystemAdminModule({ className = '' }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'sessions' | 'passwords_mfa' | 'audit_logs' | 'profile_manager'
  >('overview');

  // Master Module State
  const [sessions, setSessions] = useState<ActiveSession[]>(INITIAL_SESSIONS);
  const [devices, setDevices] = useState<TrustedDevice[]>(INITIAL_DEVICES);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [apiTokens, setApiTokens] = useState<ApiToken[]>(INITIAL_API_TOKENS);
  const [accounts, setAccounts] = useState<UserAccountHealth[]>(INITIAL_ACCOUNTS);
  const [automationTasks, setAutomationTasks] = useState<AutomationTask[]>(INITIAL_AUTOMATION_TASKS);

  // Profile Manager State (Synced live with profilesStore)
  const [profiles, setProfiles] = useState<ExtendedUserProfile[]>(() => profilesStore.getProfiles());
  const [profileSearchQuery, setProfileSearchQuery] = useState('');
  const [profileRoleFilter, setProfileRoleFilter] = useState('All');
  const [profileStatusFilter, setProfileStatusFilter] = useState('All');
  const [profileViewMode, setProfileViewMode] = useState<'cards' | 'table'>('cards');

  // Profile Modals
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ExtendedUserProfile | null>(null);
  const [inspectingProfile, setInspectingProfile] = useState<ExtendedUserProfile | null>(null);
  const [profileFormData, setProfileFormData] = useState<Partial<ExtendedUserProfile>>({
    firstName: '',
    middleName: '',
    lastName: '',
    displayName: '',
    username: '',
    email: '',
    phone: '+254 ',
    whatsApp: '+254 ',
    gender: 'Prefer not to say',
    dateOfBirth: '',
    jobTitle: '',
    department: 'Operations',
    employeeId: '',
    departmentExtension: 'Ext. 100',
    canCreateArticles: true,
    physicalAddress: 'Neema HEEP HQ, Nyeri',
    role: 'Author',
    status: 'Active',
    verificationStatus: 'Verified',
    profilePhoto: '/developer_teaching_coding.jpg',
    coverPhoto: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    bio: '',
    shortBio: '',
    levelOfEducation: 'Bachelor Degree',
    yearsOfExperience: '3+ Years',
  });

  // Global Delete Confirmation Modal
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    itemName: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    itemName: '',
    message: '',
    onConfirm: () => {}
  });

  // Subscribe to profilesStore live updates and DB audit logs
  useEffect(() => {
    const unsubscribe = profilesStore.subscribe((updatedProfiles) => {
      setProfiles(updatedProfiles);
    });

    const loadAuditLogs = async () => {
      const logs = await fetchAuditLogsFromDB();
      if (logs && logs.length > 0) {
        setAuditLogs(logs as any);
      }
    };

    loadAuditLogs();

    const handleAuditUpdate = () => {
      loadAuditLogs();
    };

    window.addEventListener('neema_audit_log_updated', handleAuditUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('neema_audit_log_updated', handleAuditUpdate);
    };
  }, []);

  // Security Policy Controls
  const [policy, setPolicy] = useState({
    minPasswordLength: 12,
    passwordExpirationDays: 90,
    preventPasswordReuseCount: 5,
    maxFailedLogins: 5,
    lockoutDurationMinutes: 30,
    sessionTimeoutMinutes: 60,
    ipAllowlist: '102.218.0.0/16, 197.232.0.0/16',
    ipDenylist: '41.203.11.4',
    geoBlockingEnabled: true,
    maintenanceMode: false,
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [auditCategoryFilter, setAuditCategoryFilter] = useState('All');

  // Modal State
  const [showNewTokenModal, setShowNewTokenModal] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenScopes, setNewTokenScopes] = useState<string[]>(['read:articles']);

  // Toast System
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const logAuditAction = (event: string, details: string, category: SystemAuditLog['category'] = 'System', status: SystemAuditLog['status'] = 'Success') => {
    logGlobalAudit(event, details, category, status, 'Patrick Munene', 'Superadmin');
  };

  // Handlers
  const handleTerminateSession = (id: string, name: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    showToast(`Terminated active session for ${name}.`);
    logAuditAction('Session Force Terminated', `Admin revoked session ${id} for user ${name}`, 'Session');
  };

  const handleTerminateAllSessions = () => {
    setSessions(prev => prev.filter(s => s.isCurrentSession));
    showToast('All other active sessions revoked across devices.');
    logAuditAction('Bulk Session Purge', 'Terminated all active sessions except current admin console', 'Session');
  };

  const handleDeviceStatus = (devId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Approved' ? 'Blocked' : 'Approved';
    setDevices(prev => prev.map(d => d.id === devId ? { ...d, status: nextStatus as any } : d));
    showToast(`Device status changed to ${nextStatus}.`);
    logAuditAction('Device Access Toggled', `Changed device ${devId} status to ${nextStatus}`, 'Device');
  };

  const handleUnlockAccount = (userId: string, username: string) => {
    setAccounts(prev => prev.map(a => a.id === userId ? { ...a, status: 'Active', failedAttempts: 0, healthScore: 88 } : a));
    showToast(`Unlocked account ${username} and restored security clearance.`);
    logAuditAction('Account Unlocked', `Administrator manually unlocked account ${username}`, 'Auth');
  };

  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenName) return;
    const token: ApiToken = {
      id: `tok-${Date.now()}`,
      name: newTokenName,
      prefix: `nh_live_${Math.random().toString(36).substring(2, 8)}...`,
      createdFor: 'Admin Service',
      scopes: newTokenScopes,
      rateLimitReqPerMin: 600,
      createdDate: new Date().toISOString().split('T')[0],
      expiresDate: '2027-07-31',
      lastUsed: 'Just Now',
      status: 'Active',
    };
    setApiTokens(prev => [token, ...prev]);
    setNewTokenName('');
    setShowNewTokenModal(false);
    showToast(`Generated API key "${newTokenName}".`);
    logAuditAction('REST API Token Created', `Generated token ${newTokenName}`, 'API');
  };

  const handleRevokeToken = (id: string, name: string) => {
    setApiTokens(prev => prev.map(t => t.id === id ? { ...t, status: 'Revoked' } : t));
    showToast(`Revoked API key "${name}".`);
    logAuditAction('REST API Token Revoked', `Revoked token ${name}`, 'API');
  };

  const handleTriggerTask = (taskId: string, taskName: string) => {
    setAutomationTasks(prev => prev.map(t => t.id === taskId ? { 
      ...t, 
      lastRun: new Date().toLocaleString(),
      executionCount: t.executionCount + 1,
      status: 'Running'
    } : t));
    showToast(`Executing task "${taskName}" in background...`);
    setTimeout(() => {
      setAutomationTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Idle' } : t));
      showToast(`Task "${taskName}" executed successfully.`);
      logAuditAction('Automation Task Executed', `Triggered background job ${taskName}`, 'System');
    }, 1200);
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('System security policies updated and synced to runtime environment.');
    logAuditAction('Security Policy Updated', 'Modified global password expiration, lockout, and IP controls', 'Security Policy');
  };

  // Metrics
  const lockedCount = accounts.filter(a => a.status === 'Locked').length;
  const mfaRate = Math.round((accounts.filter(a => a.mfaEnabled).length / (accounts.length || 1)) * 100);
  const avgHealth = Math.round(accounts.reduce((acc, a) => acc + a.healthScore, 0) / (accounts.length || 1));

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesCat = auditCategoryFilter === 'All' || log.category === auditCategoryFilter;
      const matchesSearch = !searchQuery || 
        log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [auditLogs, auditCategoryFilter, searchQuery]);

  // Filtered Profiles for Super Admin Profile Manager Sub-Module
  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      const matchesRole = profileRoleFilter === 'All' || p.role === profileRoleFilter;
      const matchesStatus = profileStatusFilter === 'All' || p.status === profileStatusFilter;
      const q = profileSearchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        p.displayName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        p.jobTitle.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        (p.createdBy && p.createdBy.toLowerCase().includes(q));
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [profiles, profileRoleFilter, profileStatusFilter, profileSearchQuery]);

  // Profile Action Handlers
  const handleCreateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileFormData.firstName?.trim() || !profileFormData.lastName?.trim() || !profileFormData.email?.trim()) {
      showToast('First Name, Last Name, and Email are required fields.', 'error');
      return;
    }

    const created = profilesStore.createProfile(profileFormData, 'Patrick Munene (Super Admin)');
    logAuditAction(
      'User Profile Created',
      `Super admin created user profile for "${created.displayName}" (${created.role}). Created by Patrick Munene (Super Admin).`,
      'Auth'
    );
    showToast(`Created user profile for "${created.displayName}" successfully.`);
    setIsCreateProfileModalOpen(false);
  };

  const handleEditProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;
    if (!profileFormData.firstName?.trim() || !profileFormData.lastName?.trim() || !profileFormData.email?.trim()) {
      showToast('First Name, Last Name, and Email are required fields.', 'error');
      return;
    }

    const updated = profilesStore.updateProfile(editingProfile.id, profileFormData, 'Patrick Munene (Super Admin)');
    if (updated) {
      logAuditAction(
        'User Profile Updated',
        `Super admin updated user profile for "${updated.displayName}" (${updated.role}). Updated by Patrick Munene (Super Admin).`,
        'Auth'
      );
      showToast(`Updated profile for "${updated.displayName}".`);
    }
    setEditingProfile(null);
  };

  const handleDeleteProfileClick = (p: ExtendedUserProfile) => {
    const articlesCount = p.stats?.articlesPublished || 0;
    const isArchivedTarget = articlesCount > 0;
    setDeleteConfirmModal({
      isOpen: true,
      title: isArchivedTarget ? 'Archive User Profile (Articles Found)' : 'Delete User Profile',
      itemName: p.displayName,
      message: isArchivedTarget
        ? `This user profile has ${articlesCount} published articles. Deleting will ARCHIVE the profile, preserving article attribution while revoking login and removing them from active profile directories.`
        : `Are you sure you want to permanently delete the profile for "${p.displayName}" (${p.username})? This will immediately remove their access and sync with the User Profiles module.`,
      onConfirm: () => {
        const res = profilesStore.deleteOrArchiveProfile(p.id, 'Patrick Munene (Super Admin)');
        if (res.action === 'archived') {
          logAuditAction(
            'User Profile Archived',
            `Super admin archived user profile for "${p.displayName}" (${articlesCount} articles preserved)`,
            'Auth',
            'Warning'
          );
          showToast(`User profile for "${p.displayName}" archived. Content attribution preserved.`);
        } else {
          logAuditAction(
            'User Profile Deleted',
            `Super admin permanently deleted user profile for "${p.displayName}" (${p.username})`,
            'Auth',
            'Warning'
          );
          showToast(`User profile for "${p.displayName}" permanently deleted.`);
        }
      }
    });
  };

  const handleToggleProfileStatus = (p: ExtendedUserProfile) => {
    const nextStatus = p.status === 'Active' ? 'Suspended' : 'Active';
    profilesStore.updateProfile(p.id, { status: nextStatus }, 'Patrick Munene (Super Admin)');
    logAuditAction(
      'User Profile Status Toggled',
      `Super admin set status of profile "${p.displayName}" to ${nextStatus}`,
      'Auth'
    );
    showToast(`Profile status for "${p.displayName}" set to ${nextStatus}.`);
  };

  const SUB_TABS = [
    { id: 'overview', label: 'Overview', icon: Server, badge: 'Live' },
    { id: 'profile_manager', label: 'Profile Manager', icon: UserCheck, badge: `${profiles.length}` },
    { id: 'audit_logs', label: 'Audit Trail Logs', icon: FileText, badge: `${auditLogs.length}` },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* MODULE HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#074504] text-white rounded-2xl border border-[#C0991B]/30 shadow-lg p-5 md:p-6 space-y-3">
        {/* 1. Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
            <Server className="w-6 h-6 text-[#C0991B] shrink-0" />
            <span>ADMINISTRATION MODULE</span>
          </h2>
          <span className="px-3 py-1 bg-[#C0991B] text-[#074504] text-[10px] font-black rounded-full uppercase flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#074504] animate-pulse" /> Operational • AES-256
          </span>
        </div>

        {/* 2. Description Text */}
        <p className="text-xs md:text-sm text-gray-200 font-medium leading-relaxed max-w-4xl">
          Core server status, active session manager, security policies, and system audit logs.
        </p>

        {/* 3. CTA buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleTerminateAllSessions}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <LockKeyhole className="w-4 h-4 text-white" /> Purge Sessions
          </button>
          <button
            type="button"
            onClick={() => {
              setPolicy(p => ({ ...p, maintenanceMode: !p.maintenanceMode }));
              showToast(`Maintenance Mode set to ${!policy.maintenanceMode ? 'ENABLED' : 'DISABLED'}`);
            }}
            className={`px-4 py-2.5 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer border shadow-sm ${
              policy.maintenanceMode
                ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <Power className="w-4 h-4 text-[#C0991B]" />
            {policy.maintenanceMode ? 'Maintenance Mode ACTIVE' : 'Maintenance Mode OFF'}
          </button>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-md ${
              toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
              toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-900' :
              'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-black uppercase">
              <CheckCircle2 className="w-4 h-4 text-[#074504]" />
              <span>{toast.msg}</span>
            </div>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODULE NAVIGATION TABS */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {SUB_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                isActive
                  ? 'bg-[#074504] text-white border-[#074504] shadow-xs'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C0991B]' : 'text-gray-500'}`} />
              <span>{tab.label}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black ${
                isActive ? 'bg-[#C0991B] text-[#074504]' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 2: PROFILE MANAGER (SUPER ADMIN) ================= */}
      {activeTab === 'profile_manager' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header Banner - Formatted as: Title -> Text -> Buttons */}
          <div className="bg-[#074504] p-6 rounded-3xl text-white shadow-lg flex flex-col gap-4 relative overflow-hidden border border-[#C0991B]/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C0991B] opacity-10 rounded-full blur-2xl pointer-events-none"></div>

            {/* 1. TITLE */}
            <div className="space-y-1.5 z-10">
              <div className="inline-flex items-center gap-2 bg-[#C0991B]/20 text-[#C0991B] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Access Management
              </div>
              <h3 className="font-black text-xl text-white uppercase tracking-tight flex items-center gap-2">
                USER PROFILE MANAGER ({filteredProfiles.length})
              </h3>
            </div>

            {/* 2. TEXT */}
            <p className="text-xs text-white/80 font-medium max-w-3xl leading-relaxed z-10">
              Create, edit, inspect, and remove enterprise user profiles. Profiles managed here are synchronized live with the User Profiles module, tracking exact creation timestamps and originating administrator identity.
            </p>

            {/* 3. BUTTONS */}
            <div className="flex flex-wrap items-center gap-2.5 z-10 pt-1">
              <button
                type="button"
                onClick={() => {
                  setProfileFormData({
                    firstName: '',
                    middleName: '',
                    lastName: '',
                    displayName: '',
                    username: '',
                    email: '',
                    phone: '+254 ',
                    whatsApp: '+254 ',
                    gender: 'Prefer not to say',
                    dateOfBirth: '',
                    jobTitle: '',
                    department: 'Operations',
                    employeeId: `NH-EMP-2026-${Math.floor(100 + Math.random() * 900)}`,
                    departmentExtension: 'Ext. 100',
                    canCreateArticles: true,
                    physicalAddress: 'Neema HEEP HQ, Nyeri',
                    role: 'Author',
                    status: 'Active',
                    verificationStatus: 'Verified',
                    profilePhoto: '/developer_teaching_coding.jpg',
                    coverPhoto: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
                    bio: '',
                    shortBio: '',
                    levelOfEducation: 'Bachelor Degree',
                    yearsOfExperience: '3+ Years',
                  });
                  setIsCreateProfileModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#C0991B] text-[#033B18] hover:bg-amber-400 font-black text-xs uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create User Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfiles(profilesStore.getProfiles());
                  showToast('User profiles synchronized with database.');
                }}
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-black text-xs uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-white/20"
              >
                <RefreshCw className="w-4 h-4 text-[#C0991B]" />
                <span>Sync Profiles</span>
              </button>
            </div>
          </div>

          {/* Search, Filter & View Mode Controls */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, email, username, job title, created by..."
                  value={profileSearchQuery}
                  onChange={(e) => setProfileSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#074504] outline-none"
                />
              </div>

              <select
                value={profileRoleFilter}
                onChange={(e) => setProfileRoleFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#074504]"
              >
                <option value="All">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Web Master">Web Master</option>
                <option value="Editor">Editor</option>
                <option value="Author">Author</option>
                <option value="Loan Officer">Loan Officer</option>
                <option value="Auditor">Auditor</option>
              </select>

              <select
                value={profileStatusFilter}
                onChange={(e) => setProfileStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#074504]"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                title="Grid / Cards View"
                onClick={() => setProfileViewMode('cards')}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  profileViewMode === 'cards' ? 'bg-[#074504] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="List / Table View"
                onClick={() => setProfileViewMode('table')}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  profileViewMode === 'table' ? 'bg-[#074504] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PROFILE DISPLAY GRID / CARDS */}
          {profileViewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProfiles.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
                  <div>
                    {/* Header Banner Image */}
                    <div className="h-20 bg-gradient-to-r from-[#074504] to-[#0a6006] relative">
                      {p.coverPhoto && (
                        <img src={p.coverPhoto} alt="Cover" className="w-full h-full object-cover opacity-60" />
                      )}
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          p.status === 'Active' ? 'bg-emerald-500 text-white' :
                          p.status === 'Suspended' ? 'bg-red-600 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {p.status}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#C0991B] text-[#074504]">
                          {p.role}
                        </span>
                      </div>
                    </div>

                    {/* Profile Header Info */}
                    <div className="p-4 pt-0 relative space-y-3">
                      <div className="flex items-end justify-between -mt-9">
                        <img
                          src={p.profilePhoto || '/developer_teaching_coding.jpg'}
                          alt={p.displayName}
                          className="w-16 h-16 rounded-2xl object-cover border-3 border-white shadow-md bg-white"
                        />
                        <div className="text-right">
                          <span className="text-[10px] font-mono font-bold text-gray-400 block">{p.employeeId}</span>
                          <span className="text-[10px] font-black text-[#074504] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            @{p.username}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-black text-base text-gray-900">{p.displayName}</h4>
                        <p className="text-xs text-[#074504] font-bold">{p.jobTitle} • <span className="text-gray-500">{p.department}</span></p>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{p.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{p.phone}</span>
                        </div>
                      </div>

                      {/* PROVENANCE METADATA: WHEN AND BY WHO CREATED */}
                      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 space-y-1 text-[11px] font-medium text-gray-700">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-gray-500 font-bold uppercase text-[9px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#C0991B]" /> Created On:
                          </span>
                          <span className="font-bold text-gray-900">{p.createdAt || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-gray-500 font-bold uppercase text-[9px] flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-[#074504]" /> Created By:
                          </span>
                          <span className="font-black text-[#074504]">{p.createdBy || 'Super Admin'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setInspectingProfile(p)}
                      className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs rounded-lg border border-gray-200 cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-gray-500" /> Inspect
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleProfileStatus(p)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          p.status === 'Active' 
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                        title={p.status === 'Active' ? 'Suspend User' : 'Activate User'}
                      >
                        {p.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingProfile(p);
                          setProfileFormData(p);
                        }}
                        className="p-1.5 bg-white hover:bg-amber-50 text-amber-700 border border-gray-200 rounded-lg cursor-pointer"
                        title="Edit Profile"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProfileClick(p)}
                        className="p-1.5 bg-white hover:bg-red-50 text-red-600 border border-gray-200 rounded-lg cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* TABLE GRID VIEW */
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-black text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-3">Profile Info</th>
                      <th className="px-4 py-3">Role & Dept</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Created When</th>
                      <th className="px-4 py-3">Created By</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProfiles.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.profilePhoto || '/developer_teaching_coding.jpg'}
                              alt={p.displayName}
                              className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                            />
                            <div>
                              <div className="font-black text-xs text-gray-900">{p.displayName}</div>
                              <div className="text-[10px] text-gray-500 font-mono">@{p.username} • {p.employeeId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#C0991B] text-[#074504] inline-block mb-1">
                            {p.role}
                          </span>
                          <div className="text-xs font-bold text-gray-800">{p.jobTitle}</div>
                          <div className="text-[10px] text-gray-500">{p.department}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          <div>{p.email}</div>
                          <div className="text-[10px] text-gray-400">{p.phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            p.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                            p.status === 'Suspended' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-gray-800">
                          {p.createdAt || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-xs font-black text-[#074504]">
                          {p.createdBy || 'Super Admin'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setInspectingProfile(p)}
                              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer"
                              title="Inspect"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProfile(p);
                                setProfileFormData(p);
                              }}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProfileClick(p)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 1: OVERVIEW DASHBOARD ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* SYSTEM COMMAND METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border-t-4 border-t-[#074504] border-x border-b border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">System Health Index</span>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#074504]">{avgHealth}/100</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Optimal</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Memory Cache 28% • Response 42ms</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">Active User Sessions</span>
                <Activity className="w-5 h-5 text-[#C0991B]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900">{sessions.length}</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">5 Devices</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Nairobi, Nyeri, Meru & Mombasa</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-t-4 border-t-blue-600 border-x border-b border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">MFA Security Adoption</span>
                <SmartphoneNfc className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900">{mfaRate}%</span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">Enforced</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">TOTP, SMS & Email OTP Enabled</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-t-4 border-t-purple-600 border-x border-b border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">API Throughput</span>
                <Terminal className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900">1,500</span>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">Req/Min Limit</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">{apiTokens.filter(t => t.status === 'Active').length} Active Tokens</p>
            </div>
          </div>

          {/* MAIN SYSTEM DASHBOARD LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LIVE SYSTEM STATUS & RECENT AUDIT LOGS */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#C0991B]" /> System Runtime Infrastructure Status
                  </h3>
                  <span className="text-xs font-bold text-gray-400">Node.js ES Modules • Vite 5</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Database Engine</span>
                    <span className="text-sm font-black text-[#074504] block">Firestore / Cloud DB</span>
                    <p className="text-[10px] text-emerald-600 font-bold">Connected • Latency 14ms</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Authentication Vault</span>
                    <span className="text-sm font-black text-gray-900 block">AES-256 Password Hash</span>
                    <p className="text-[10px] text-emerald-600 font-bold">MFA Required for Staff</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Background Jobs</span>
                    <span className="text-sm font-black text-gray-900 block">3 Active Tasks</span>
                    <p className="text-[10px] text-emerald-600 font-bold">Cron Engine Idle</p>
                  </div>
                </div>
              </div>

              {/* RECENT AUDIT TRAIL LOGS */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C0991B]" /> Recent System Audit Activity
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('audit_logs')}
                    className="text-xs font-bold text-[#074504] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All Logs <ChevronRight className="w-3.5 h-3.5 text-[#C0991B]" />
                  </button>
                </div>

                <div className="space-y-3">
                  {auditLogs.slice(0, 4).map(log => (
                    <div key={log.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs text-[#074504]">{log.event}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-black rounded-md ${
                            log.status === 'Success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 font-medium">{log.details}</p>
                        <p className="text-[10px] text-gray-400 font-mono">Actor: {log.actor} • {log.ipAddress} ({log.location})</p>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS & RIGHT COLUMN */}
            <div className="space-y-6">
              {/* QUICK ACTIONS */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <h4 className="font-black text-xs text-[#074504] uppercase border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#C0991B]" /> Quick Administration Tasks
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('sessions')}
                    className="w-full p-2.5 bg-gray-50 hover:bg-emerald-50 text-[#074504] font-bold text-xs rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span>Manage Active Sessions</span>
                    <Activity className="w-3.5 h-3.5 text-[#C0991B]" />
                  </button>

                  <button
                    onClick={() => setActiveTab('passwords_mfa')}
                    className="w-full p-2.5 bg-gray-50 hover:bg-amber-50 text-[#074504] font-bold text-xs rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span>Password & MFA Policy</span>
                    <KeyRound className="w-3.5 h-3.5 text-[#C0991B]" />
                  </button>

                  <button
                    onClick={() => setActiveTab('profile_manager')}
                    className="w-full p-2.5 bg-gray-50 hover:bg-purple-50 text-purple-950 font-bold text-xs rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span>User Profile Directory</span>
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                  </button>

                  <button
                    onClick={() => setActiveTab('audit_logs')}
                    className="w-full p-2.5 bg-gray-50 hover:bg-blue-50 text-blue-900 font-bold text-xs rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span>Audit Trail Logs</span>
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                  </button>
                </div>
              </div>

              {/* SYSTEM SECURITY & ACCESS POLICY */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="font-black text-xs text-[#074504] uppercase flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#C0991B]" /> Security &amp; Access Policy
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Enforced
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="font-bold text-gray-700">MFA Standard</span>
                    <span className="font-black text-emerald-700">TOTP &amp; SMS OTP</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="font-bold text-gray-700">Session Timeout</span>
                    <span className="font-black text-gray-900">15 Mins Idle</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="font-bold text-gray-700">Password Encryption</span>
                    <span className="font-black text-gray-900">PBKDF2 / AES-256</span>
                  </div>
                </div>
              </div>

              {/* BACKUP & MAINTENANCE STATUS */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="font-black text-xs text-[#074504] uppercase flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#C0991B]" /> Database Vault &amp; Backups
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Automated
                  </span>
                </div>

                <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                  Daily snapshot backups synced automatically with encrypted cloud storage vault.
                </p>

                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-bold text-[11px]">Last Backup: Today, 04:00 EAT</span>
                  <button
                    type="button"
                    onClick={() => showToast('System Cache: Flush executed successfully.')}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-[#074504] font-black text-[10px] uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3 text-[#C0991B]" /> Flush Cache
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}



      {/* ================= TAB 6: AUDIT LOGS ================= */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <div>
              <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C0991B]" /> System Security Audit Trail
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Immutable administrative log records and authentication triggers</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-[#C0991B]"
              />
              <button
                type="button"
                onClick={() => showToast('Audit Trail exported to JSON / CSV format.')}
                className="px-3 py-2 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2 overflow-x-auto">
              {['All', 'Auth', 'Security Policy', 'Session', 'Device', 'API', 'Backup'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setAuditCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    auditCategoryFilter === cat
                      ? 'bg-[#074504] text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="divide-y divide-gray-100">
              {filteredAuditLogs.map(log => (
                <div key={log.id} className="p-4 hover:bg-gray-50 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-[#074504]">{log.event}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-md ${
                        log.status === 'Success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.status}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[9px] font-bold rounded-md">
                        {log.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">{log.details}</p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      Actor: {log.actor} ({log.actorRole}) • IP: {log.ipAddress} ({log.location})
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE USER PROFILE MODAL */}
      {isCreateProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border-2 border-[#074504] p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-base text-[#074504] uppercase flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#C0991B]" /> Create New User Profile
              </h3>
              <button onClick={() => setIsCreateProfileModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProfileSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={profileFormData.firstName || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={profileFormData.middleName || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, middleName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={profileFormData.lastName || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Display Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Jane Muturi"
                    value={profileFormData.displayName || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, displayName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="jmuturi"
                    value={profileFormData.username || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, username: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={profileFormData.email || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profileFormData.phone || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">System Role *</label>
                  <select
                    value={profileFormData.role || 'Author'}
                    onChange={(e) => setProfileFormData({ ...profileFormData, role: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Site Administrator">Site Administrator</option>
                    <option value="Editor">Editor</option>
                    <option value="Author">Author</option>
                    <option value="Loan Officer">Loan Officer</option>
                    <option value="Webmaster">Webmaster</option>
                    <option value="Auditor">Auditor</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Credit Officer"
                    value={profileFormData.jobTitle || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Operations & Credit"
                    value={profileFormData.department || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Account Status</label>
                  <select
                    value={profileFormData.status || 'Active'}
                    onChange={(e) => setProfileFormData({ ...profileFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Verification Status</label>
                  <select
                    value={profileFormData.verificationStatus || 'Verified'}
                    onChange={(e) => setProfileFormData({ ...profileFormData, verificationStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                    <option value="Unverified">Unverified</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 uppercase block mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of professional background..."
                  value={profileFormData.bio || ''}
                  onChange={(e) => setProfileFormData({ ...profileFormData, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] font-bold text-amber-900">
                Audit Stamping: Creation date will be recorded as today and creator attributed as "Patrick Munene (Super Admin)".
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateProfileModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#074504] text-[#C0991B] rounded-xl font-black uppercase cursor-pointer shadow-md"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER PROFILE MODAL */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border-2 border-[#C0991B] p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-base text-[#074504] uppercase flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#C0991B]" /> Edit Profile: {editingProfile.displayName}
              </h3>
              <button onClick={() => setEditingProfile(null)} className="p-2 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProfileSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={profileFormData.firstName || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={profileFormData.middleName || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, middleName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={profileFormData.lastName || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Display Name</label>
                  <input
                    type="text"
                    value={profileFormData.displayName || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, displayName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">System Role</label>
                  <select
                    value={profileFormData.role || 'Author'}
                    onChange={(e) => setProfileFormData({ ...profileFormData, role: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Site Administrator">Site Administrator</option>
                    <option value="Editor">Editor</option>
                    <option value="Author">Author</option>
                    <option value="Loan Officer">Loan Officer</option>
                    <option value="Webmaster">Webmaster</option>
                    <option value="Auditor">Auditor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Job Title</label>
                  <input
                    type="text"
                    value={profileFormData.jobTitle || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Department</label>
                  <input
                    type="text"
                    value={profileFormData.department || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={profileFormData.email || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Phone</label>
                  <input
                    type="text"
                    value={profileFormData.phone || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Account Status</label>
                  <select
                    value={profileFormData.status || 'Active'}
                    onChange={(e) => setProfileFormData({ ...profileFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 uppercase block mb-1">Verification Status</label>
                  <select
                    value={profileFormData.verificationStatus || 'Verified'}
                    onChange={(e) => setProfileFormData({ ...profileFormData, verificationStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#074504]"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                    <option value="Unverified">Unverified</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] font-medium text-gray-600 flex justify-between">
                <span>Created On: <strong className="text-gray-900">{editingProfile.createdAt || 'N/A'}</strong></span>
                <span>Created By: <strong className="text-[#074504]">{editingProfile.createdBy || 'Super Admin'}</strong></span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#074504] text-[#C0991B] rounded-xl font-black uppercase cursor-pointer shadow-md"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT USER PROFILE MODAL */}
      {inspectingProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border-2 border-[#074504] p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-base text-[#074504] uppercase flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#C0991B]" /> User Profile Audit Inspection
              </h3>
              <button onClick={() => setInspectingProfile(null)} className="p-2 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <img
                  src={inspectingProfile.profilePhoto || '/developer_teaching_coding.jpg'}
                  alt={inspectingProfile.displayName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C0991B]"
                />
                <div>
                  <h4 className="font-black text-base text-gray-900">{inspectingProfile.displayName}</h4>
                  <p className="text-xs text-[#074504] font-bold">{inspectingProfile.jobTitle}</p>
                  <p className="text-[11px] text-gray-500 font-medium">{inspectingProfile.department} • @{inspectingProfile.username}</p>
                </div>
              </div>

              {/* CREATION PROVENANCE METADATA */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <h4 className="font-black text-xs text-[#074504] uppercase flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#C0991B]" /> Creation & Provenance Audit
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block text-[10px] font-bold uppercase">Created On:</span>
                    <span className="font-black text-gray-900">{inspectingProfile.createdAt || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] font-bold uppercase">Created By:</span>
                    <span className="font-black text-[#074504]">{inspectingProfile.createdBy || 'Super Admin'}</span>
                  </div>
                  {inspectingProfile.updatedAt && (
                    <div>
                      <span className="text-gray-500 block text-[10px] font-bold uppercase">Last Updated On:</span>
                      <span className="font-bold text-gray-800">{inspectingProfile.updatedAt}</span>
                    </div>
                  )}
                  {inspectingProfile.updatedBy && (
                    <div>
                      <span className="text-gray-500 block text-[10px] font-bold uppercase">Last Updated By:</span>
                      <span className="font-bold text-gray-800">{inspectingProfile.updatedBy}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-gray-400 font-bold block uppercase text-[10px]">Email:</span>
                  <span className="font-bold text-gray-800">{inspectingProfile.email}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-gray-400 font-bold block uppercase text-[10px]">Phone:</span>
                  <span className="font-bold text-gray-800">{inspectingProfile.phone}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-gray-400 font-bold block uppercase text-[10px]">Role:</span>
                  <span className="font-bold text-[#074504]">{inspectingProfile.role}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-gray-400 font-bold block uppercase text-[10px]">Employee ID:</span>
                  <span className="font-bold text-gray-800">{inspectingProfile.employeeId}</span>
                </div>
              </div>

              {inspectingProfile.bio && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                  <span className="text-gray-400 font-bold block uppercase text-[10px] mb-1">Biography:</span>
                  <p className="text-gray-700 font-medium leading-relaxed">{inspectingProfile.bio}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setInspectingProfile(null)}
                className="px-5 py-2 bg-gray-100 text-gray-800 rounded-xl font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL DELETE CONFIRMATION POP-UP DIALOGUE BOX */}
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-2 border-red-500 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-black text-base text-gray-900">{deleteConfirmModal.title}</h3>
                <p className="text-xs text-gray-500 font-medium">This action is permanent and cannot be undone.</p>
              </div>
            </div>

            {deleteConfirmModal.itemName && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold text-gray-800">
                Target Item: <span className="text-red-700 font-black">{deleteConfirmModal.itemName}</span>
              </div>
            )}

            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              {deleteConfirmModal.message}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteConfirmModal.onConfirm();
                  setDeleteConfirmModal(prev => ({ ...prev, isOpen: false }));
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
