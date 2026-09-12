import React, { useState, useMemo } from 'react';
import { 
  Shield, ShieldCheck, ShieldAlert, KeyRound, Lock, Users, UserCheck, UserX, 
  UserPlus, Sliders, Activity, Clock, AlertTriangle, CheckCircle2, XCircle, 
  Search, Filter, Download, Upload, Plus, Trash2, Edit3, Eye, Copy, Check, 
  RefreshCw, Cpu, Database, Globe, Smartphone, Mail, FileText, Settings, 
  BarChart3, Layers, Bell, Key, LockKeyhole, Terminal, ArrowRight, 
  SmartphoneNfc, HelpCircle, HardDrive, Wand2, Info, ChevronRight, ShieldQuestion,
  Fingerprint, Monitor, Radio, AlertCircle, FileCode, CheckSquare, X, LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ================= TYPES & INTERFACES =================
export interface EnterpriseRole {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  userCount: number;
  permissionsCount: number;
  color: string;
  category: 'System' | 'Editorial' | 'Operations' | 'Custom';
  canManageUsers: boolean;
  canManageRoles: boolean;
  canManageSecurity: boolean;
  canManageContent: boolean;
}

export interface EnterpriseUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Disabled' | 'Locked' | 'Pending';
  mfaEnabled: boolean;
  mfaType: 'TOTP' | 'SMS' | 'Email' | 'Hardware Key' | 'None';
  healthScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  lastLogin: string;
  ipAddress: string;
  location: string;
  passwordAgeDays: number;
  trustedDevicesCount: number;
  activeSessionsCount: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  actorRole: string;
  targetUser?: string;
  category: 'Auth' | 'Roles & Permissions' | 'Security Policy' | 'Session' | 'Device' | 'API' | 'System';
  status: 'Success' | 'Failed' | 'Warning' | 'Blocked';
  ipAddress: string;
  location: string;
  details: string;
  riskScore: number;
}

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

export interface SecurityPolicyConfig {
  minPasswordLength: number;
  passwordExpirationDays: number;
  preventPasswordReuseCount: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  maxFailedLogins: number;
  lockoutDurationMinutes: number;
  sessionTimeoutMinutes: number;
  maxConcurrentSessions: number;
  enforceMfaForAdmins: boolean;
  enforceMfaForStaff: boolean;
  ipAllowlist: string;
  ipDenylist: string;
  geoBlockingEnabled: boolean;
  blockedCountries: string[];
  workingHoursOnly: boolean;
}

// ================= DEFAULT INITIAL DATA =================
const DEFAULT_ROLES: EnterpriseRole[] = [
  {
    id: 'role-1',
    name: 'Site Administrator',
    description: 'Full unrestricted system administration access across all CMS modules, roles, and security policies.',
    isDefault: true,
    userCount: 2,
    permissionsCount: 224,
    color: '#074504',
    category: 'System',
    canManageUsers: true,
    canManageRoles: true,
    canManageSecurity: true,
    canManageContent: true,
  },
  {
    id: 'role-2',
    name: 'Editor',
    description: 'Full editorial control over articles, media, categories, comments moderation, and publishing workflows.',
    isDefault: true,
    userCount: 4,
    permissionsCount: 128,
    color: '#C0991B',
    category: 'Editorial',
    canManageUsers: false,
    canManageRoles: false,
    canManageSecurity: false,
    canManageContent: true,
  },
  {
    id: 'role-3',
    name: 'Author',
    description: 'Create and edit own articles, save drafts, upload media, and submit articles for editorial review.',
    isDefault: true,
    userCount: 8,
    permissionsCount: 42,
    color: '#2563EB',
    category: 'Editorial',
    canManageUsers: false,
    canManageRoles: false,
    canManageSecurity: false,
    canManageContent: true,
  },
  {
    id: 'role-4',
    name: 'Webmaster',
    description: 'Manage comment moderation, beneficiary stories, vacancies, SEO tags, and public website pages.',
    isDefault: true,
    userCount: 3,
    permissionsCount: 86,
    color: '#059669',
    category: 'Operations',
    canManageUsers: false,
    canManageRoles: false,
    canManageSecurity: false,
    canManageContent: true,
  },
];

const DEFAULT_USERS: EnterpriseUser[] = [
  {
    id: 'usr-1',
    username: 'admin_neema1',
    name: 'Neema Chief Administrator',
    email: 'admin@neemaheep.com',
    role: 'Site Administrator',
    department: 'Executive Administration',
    status: 'Active',
    mfaEnabled: true,
    mfaType: 'TOTP',
    healthScore: 98,
    riskLevel: 'Low',
    lastLogin: 'Just Now',
    ipAddress: '102.218.45.12',
    location: 'Nairobi, KE',
    passwordAgeDays: 14,
    trustedDevicesCount: 3,
    activeSessionsCount: 2,
  },
  {
    id: 'usr-2',
    username: 'staff_editor',
    name: 'Grace Wanjiku (Senior Editor)',
    email: 'grace.wanjiku@neemaheep.com',
    role: 'Editor',
    department: 'Editorial & Content',
    status: 'Active',
    mfaEnabled: true,
    mfaType: 'SMS',
    healthScore: 92,
    riskLevel: 'Low',
    lastLogin: '18 mins ago',
    ipAddress: '102.218.48.90',
    location: 'Nyeri, KE',
    passwordAgeDays: 28,
    trustedDevicesCount: 2,
    activeSessionsCount: 1,
  },
  {
    id: 'usr-3',
    username: 'author_sam',
    name: 'Samuel Ochieng',
    email: 'samuel.ochieng@neemaheep.com',
    role: 'Author',
    department: 'Microfinance Insights',
    status: 'Active',
    mfaEnabled: true,
    mfaType: 'Email',
    healthScore: 85,
    riskLevel: 'Low',
    lastLogin: '2 hours ago',
    ipAddress: '197.232.88.11',
    location: 'Meru, KE',
    passwordAgeDays: 45,
    trustedDevicesCount: 1,
    activeSessionsCount: 1,
  },
  {
    id: 'usr-4',
    username: 'dr_jane_m',
    name: 'Dr. Jane Muturi',
    email: 'jane.muturi@neemaheep.com',
    role: 'Webmaster',
    department: 'Community Outreach',
    status: 'Active',
    mfaEnabled: false,
    mfaType: 'None',
    healthScore: 68,
    riskLevel: 'Medium',
    lastLogin: '1 day ago',
    ipAddress: '41.203.11.89',
    location: 'Mombasa, KE',
    passwordAgeDays: 82,
    trustedDevicesCount: 1,
    activeSessionsCount: 1,
  },
  {
    id: 'usr-5',
    username: 'auditor_pete',
    name: 'Peter Kamau (Auditor)',
    email: 'peter.kamau@neemaheep.com',
    role: 'Auditor',
    department: 'Internal Audit',
    status: 'Locked',
    mfaEnabled: true,
    mfaType: 'TOTP',
    healthScore: 42,
    riskLevel: 'High',
    lastLogin: '3 days ago',
    ipAddress: '197.254.12.44',
    location: 'Nakuru, KE',
    passwordAgeDays: 110,
    trustedDevicesCount: 0,
    activeSessionsCount: 0,
  },
];

const DEFAULT_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'audit-1',
    timestamp: '2026-07-31 14:40:12',
    event: 'Role Permissions Modified',
    actor: 'admin_neema1',
    actorRole: 'Site Administrator',
    targetUser: 'Role: Editor',
    category: 'Roles & Permissions',
    status: 'Success',
    ipAddress: '102.218.45.12',
    location: 'Nairobi, KE',
    details: 'Enabled comment deletion rights for Editor role.',
    riskScore: 12,
  },
  {
    id: 'audit-2',
    timestamp: '2026-07-31 14:15:00',
    event: 'Failed Login Threshold Exceeded',
    actor: 'unknown_ip',
    actorRole: 'Unauthenticated',
    targetUser: 'auditor_pete',
    category: 'Auth',
    status: 'Blocked',
    ipAddress: '197.254.12.44',
    location: 'Nakuru, KE',
    details: 'Auto-locked account after 5 consecutive bad password attempts.',
    riskScore: 88,
  },
  {
    id: 'audit-3',
    timestamp: '2026-07-31 13:20:18',
    event: 'MFA Security Token Verification',
    actor: 'staff_editor',
    actorRole: 'Editor',
    category: 'Auth',
    status: 'Success',
    ipAddress: '102.218.48.90',
    location: 'Nyeri, KE',
    details: 'Verified SMS OTP token on device Macbook Pro.',
    riskScore: 5,
  },
  {
    id: 'audit-4',
    timestamp: '2026-07-31 11:05:44',
    event: 'Security Policy Rule Configured',
    actor: 'admin_neema1',
    actorRole: 'Site Administrator',
    category: 'Security Policy',
    status: 'Success',
    ipAddress: '102.218.45.12',
    location: 'Nairobi, KE',
    details: 'Updated password expiration from 120 days to 90 days.',
    riskScore: 15,
  },
  {
    id: 'audit-5',
    timestamp: '2026-07-31 09:30:00',
    event: 'REST API Token Issued',
    actor: 'admin_neema1',
    actorRole: 'Site Administrator',
    category: 'API',
    status: 'Success',
    ipAddress: '102.218.45.12',
    location: 'Nairobi, KE',
    details: 'Generated token "Mobile App Integration" with read:articles scope.',
    riskScore: 20,
  },
];

const DEFAULT_SESSIONS: ActiveSession[] = [
  {
    id: 'sess-1',
    userId: 'usr-1',
    username: 'admin_neema1',
    role: 'Site Administrator',
    device: 'MacBook Pro 16"',
    browser: 'Chrome 126.0',
    os: 'macOS Sonoma',
    ipAddress: '102.218.45.12',
    location: 'Nairobi, Kenya',
    loginTime: '2026-07-31 08:30',
    duration: '6 hrs 10 mins',
    lastActivity: 'Just Now',
    riskLevel: 'Low',
    isCurrentSession: true,
  },
  {
    id: 'sess-2',
    userId: 'usr-1',
    username: 'admin_neema1',
    role: 'Site Administrator',
    device: 'iPhone 15 Pro',
    browser: 'Mobile Safari 17.4',
    os: 'iOS 17',
    ipAddress: '102.218.45.12',
    location: 'Nairobi, Kenya',
    loginTime: '2026-07-31 11:15',
    duration: '3 hrs 25 mins',
    lastActivity: '12 mins ago',
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
    duration: '2 hrs 40 mins',
    lastActivity: '18 mins ago',
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
    duration: '1 hr 30 mins',
    lastActivity: '45 mins ago',
    riskLevel: 'Low',
  },
];

const DEFAULT_DEVICES: TrustedDevice[] = [
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
    lastUsed: 'Today 14:40',
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
    deviceName: 'Unrecognized Android Device',
    os: 'Android 14',
    browser: 'Chrome Mobile',
    location: 'Mombasa, Kenya',
    ipAddress: '41.203.11.89',
    trustedSince: '2026-07-28',
    lastUsed: 'Yesterday 18:20',
    riskScore: 68,
    status: 'Pending Review',
  },
];

const DEFAULT_API_TOKENS: ApiToken[] = [
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

const DEFAULT_SECURITY_POLICY: SecurityPolicyConfig = {
  minPasswordLength: 12,
  passwordExpirationDays: 90,
  preventPasswordReuseCount: 5,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
  maxFailedLogins: 5,
  lockoutDurationMinutes: 30,
  sessionTimeoutMinutes: 60,
  maxConcurrentSessions: 3,
  enforceMfaForAdmins: true,
  enforceMfaForStaff: true,
  ipAllowlist: '102.218.0.0/16, 197.232.0.0/16',
  ipDenylist: '41.203.11.4',
  geoBlockingEnabled: true,
  blockedCountries: ['High Risk Network Ranges'],
  workingHoursOnly: false,
};

// All CMS Modules for Permission Matrix
const CMS_MODULES = [
  { id: 'mod_articles', name: 'Articles & Content' },
  { id: 'mod_media', name: 'Media Library (DAM)' },
  { id: 'mod_categories', name: 'Categories & Tags' },
  { id: 'mod_comments', name: 'Comments & Moderation' },
  { id: 'mod_beneficiaries', name: 'Beneficiaries & Loans' },
  { id: 'mod_vacancies', name: 'Careers & Vacancies' },
  { id: 'mod_analytics', name: 'Analytics & Reports' },
  { id: 'mod_roles', name: 'Roles & Permissions' },
  { id: 'mod_security', name: 'Security & Auth Policies' },
  { id: 'mod_system', name: 'System Settings & Backups' },
];

const PERMISSION_ACTIONS = [
  'View', 'Create', 'Edit', 'Delete', 'Publish', 'Moderate', 'Approve', 'Configure', 'Export'
];

export default function EnterpriseAdminModule({ className = '' }: { className?: string }) {
  // Navigation Sub-tab inside Enterprise Administration Command Center
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'roles' | 'permissions' | 'users' | 'passwords' | 'mfa' | 
    'devices' | 'sessions' | 'login_history' | 'recovery' | 'health' | 
    'lockout' | 'policies' | 'audit_logs' | 'automation' | 'api_access' | 
    'analytics' | 'system'
  >('dashboard');

  // Master State Arrays
  const [roles, setRoles] = useState<EnterpriseRole[]>(DEFAULT_ROLES);
  const [users, setUsers] = useState<EnterpriseUser[]>(DEFAULT_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(DEFAULT_AUDIT_LOGS);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(DEFAULT_SESSIONS);
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>(DEFAULT_DEVICES);
  const [apiTokens, setApiTokens] = useState<ApiToken[]>(DEFAULT_API_TOKENS);
  const [policy, setPolicy] = useState<SecurityPolicyConfig>(DEFAULT_SECURITY_POLICY);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  const [auditCategoryFilter, setAuditCategoryFilter] = useState('All');

  // Interactive Modals State
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleCategory, setNewRoleCategory] = useState<'Custom' | 'Editorial' | 'Operations'>('Custom');

  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Author');
  const [newUserDept, setNewUserDept] = useState('Editorial');

  const [showNewTokenModal, setShowNewTokenModal] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenScopes, setNewTokenScopes] = useState<string[]>(['read:articles']);

  // Dynamic Permission Matrix Matrix state [roleId][moduleId][action]
  const [permissionMatrix, setPermissionMatrix] = useState<Record<string, Record<string, Record<string, boolean>>>>(() => {
    const initial: Record<string, Record<string, Record<string, boolean>>> = {};
    DEFAULT_ROLES.forEach(r => {
      initial[r.id] = {};
      CMS_MODULES.forEach(m => {
        initial[r.id][m.id] = {};
        PERMISSION_ACTIONS.forEach(act => {
          // Site admin gets all true; others get selective
          if (r.id === 'role-1') {
            initial[r.id][m.id][act] = true;
          } else if (r.id === 'role-2') {
            initial[r.id][m.id][act] = ['View', 'Create', 'Edit', 'Publish', 'Moderate', 'Approve'].includes(act) && !m.id.includes('security') && !m.id.includes('system');
          } else {
            initial[r.id][m.id][act] = act === 'View' || (act === 'Create' && m.id === 'mod_articles');
          }
        });
      });
    });
    return initial;
  });

  // Status Toast Helper
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Log Audit Action Helper
  const logAuditAction = (event: string, details: string, category: AuditLogItem['category'] = 'Roles & Permissions', status: AuditLogItem['status'] = 'Success') => {
    const newLog: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      event,
      actor: 'admin_neema1',
      actorRole: 'Site Administrator',
      category,
      status,
      ipAddress: '102.218.45.12',
      location: 'Nairobi, KE',
      details,
      riskScore: status === 'Blocked' ? 75 : 10,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Calculated High-level Security Metrics
  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'Active').length;
    const disabledUsers = users.filter(u => u.status === 'Disabled').length;
    const lockedUsers = users.filter(u => u.status === 'Locked').length;
    const mfaCount = users.filter(u => u.mfaEnabled).length;
    const mfaRate = Math.round((mfaCount / (totalUsers || 1)) * 100);
    const avgHealth = Math.round(users.reduce((acc, u) => acc + u.healthScore, 0) / (totalUsers || 1));
    
    return {
      totalUsers,
      activeUsers,
      disabledUsers,
      lockedUsers,
      mfaRate,
      avgHealth,
      totalRoles: roles.length,
      activeSessionsCount: activeSessions.length,
      trustedDevicesCount: trustedDevices.filter(d => d.status === 'Approved').length,
      pendingDevicesCount: trustedDevices.filter(d => d.status === 'Pending Review').length,
      auditEventsCount: auditLogs.length,
    };
  }, [users, roles, activeSessions, trustedDevices, auditLogs]);

  // Handlers for Roles
  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;
    const newRole: EnterpriseRole = {
      id: `role-${Date.now()}`,
      name: newRoleName,
      description: newRoleDesc || 'Custom enterprise administrative role.',
      isDefault: false,
      userCount: 0,
      permissionsCount: 16,
      color: '#8B5CF6',
      category: newRoleCategory,
      canManageUsers: false,
      canManageRoles: false,
      canManageSecurity: false,
      canManageContent: true,
    };

    // Initialize permission matrix for new role
    setPermissionMatrix(prev => {
      const next = { ...prev };
      next[newRole.id] = {};
      CMS_MODULES.forEach(m => {
        next[newRole.id][m.id] = {};
        PERMISSION_ACTIONS.forEach(act => {
          next[newRole.id][m.id][act] = act === 'View';
        });
      });
      return next;
    });

    setRoles(prev => [...prev, newRole]);
    setNewRoleName('');
    setNewRoleDesc('');
    setShowCreateRoleModal(false);
    showToast(`Role "${newRoleName}" created successfully.`);
    logAuditAction('Role Created', `Created custom role: ${newRoleName}`, 'Roles & Permissions');
  };

  const handleDeleteRole = (roleId: string, roleName: string) => {
    if (roles.find(r => r.id === roleId)?.isDefault) {
      showToast('System default roles cannot be deleted.', 'error');
      return;
    }
    setRoles(prev => prev.filter(r => r.id !== roleId));
    showToast(`Deleted role "${roleName}".`);
    logAuditAction('Role Deleted', `Archived and removed role: ${roleName}`, 'Roles & Permissions');
  };

  // Handlers for Users
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    const newUser: EnterpriseUser = {
      id: `usr-${Date.now()}`,
      username: newUserEmail.split('@')[0].toLowerCase(),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDept,
      status: 'Active',
      mfaEnabled: true,
      mfaType: 'Email',
      healthScore: 88,
      riskLevel: 'Low',
      lastLogin: 'Never',
      ipAddress: '102.218.45.12',
      location: 'Nairobi, KE',
      passwordAgeDays: 0,
      trustedDevicesCount: 0,
      activeSessionsCount: 0,
    };
    setUsers(prev => [newUser, ...prev]);
    setNewUserName('');
    setNewUserEmail('');
    setShowCreateUserModal(false);
    showToast(`User invitation and login credentials created for ${newUserName}.`);
    logAuditAction('User Created', `Added user account: ${newUserEmail} with role ${newUserRole}`, 'Auth');
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Disabled' : 'Active';
        showToast(`User account ${u.username} status changed to ${nextStatus}.`);
        logAuditAction('User Status Toggled', `User ${u.username} changed to ${nextStatus}`, 'Auth');
        return { ...u, status: nextStatus as any };
      }
      return u;
    }));
  };

  const handleUnlockUser = (userId: string, username: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Active', healthScore: 85, riskLevel: 'Low' } : u));
    showToast(`Account "${username}" unlocked and security clearance restored.`);
    logAuditAction('Account Unlocked', `Administrator manually unlocked account: ${username}`, 'Security Policy');
  };

  // Handlers for Sessions
  const handleTerminateSession = (sessionId: string, username: string) => {
    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
    showToast(`Terminated active session for ${username}.`);
    logAuditAction('Session Terminated', `Force-closed session ${sessionId} for ${username}`, 'Session');
  };

  const handleTerminateAllSessions = () => {
    setActiveSessions(prev => prev.filter(s => s.isCurrentSession));
    showToast('All other active sessions revoked across devices.');
    logAuditAction('Bulk Session Termination', 'Terminated all active user sessions except current admin console', 'Session');
  };

  // Handlers for Devices
  const handleToggleDeviceApproval = (devId: string) => {
    setTrustedDevices(prev => prev.map(d => {
      if (d.id === devId) {
        const nextStatus = d.status === 'Approved' ? 'Blocked' : 'Approved';
        showToast(`Device ${d.deviceName} set to ${nextStatus}.`);
        logAuditAction('Device Access Changed', `Device ${d.deviceName} updated to ${nextStatus}`, 'Device');
        return { ...d, status: nextStatus as any };
      }
      return d;
    }));
  };

  // Handlers for API Tokens
  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenName) return;
    const newToken: ApiToken = {
      id: `tok-${Date.now()}`,
      name: newTokenName,
      prefix: `nh_live_${Math.random().toString(36).substring(2, 8)}...`,
      createdFor: 'Admin Integration',
      scopes: newTokenScopes,
      rateLimitReqPerMin: 600,
      createdDate: new Date().toISOString().split('T')[0],
      expiresDate: '2027-07-31',
      lastUsed: 'Just Now',
      status: 'Active',
    };
    setApiTokens(prev => [newToken, ...prev]);
    setNewTokenName('');
    setShowNewTokenModal(false);
    showToast(`Generated API Token "${newTokenName}".`);
    logAuditAction('API Token Created', `Issued token: ${newTokenName} with scopes ${newTokenScopes.join(', ')}`, 'API');
  };

  const handleRevokeToken = (tokenId: string, name: string) => {
    setApiTokens(prev => prev.map(t => t.id === tokenId ? { ...t, status: 'Revoked' } : t));
    showToast(`Revoked API Token "${name}".`);
    logAuditAction('API Token Revoked', `Revoked token: ${name}`, 'API');
  };

  // Permission Matrix Toggle
  const handleToggleMatrixPermission = (roleId: string, moduleId: string, action: string) => {
    setPermissionMatrix(prev => {
      const next = { ...prev };
      if (!next[roleId]) next[roleId] = {};
      if (!next[roleId][moduleId]) next[roleId][moduleId] = {};
      next[roleId][moduleId][action] = !next[roleId][moduleId][action];
      return next;
    });
    showToast('Permission matrix updated in memory cache.');
  };

  // Filter Users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = !searchQuery || 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
      const matchesStatus = userStatusFilter === 'All' || u.status === userStatusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, userRoleFilter, userStatusFilter]);

  // Filter Audit Logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesCategory = auditCategoryFilter === 'All' || log.category === auditCategoryFilter;
      const matchesSearch = !searchQuery || 
        log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [auditLogs, auditCategoryFilter, searchQuery]);

  // MAIN TAB DEFINITIONS
  const ADMIN_TABS = [
    { id: 'dashboard', label: 'Overview', icon: LayoutGrid, badge: 'Core' },
    { id: 'roles', label: 'Roles Manager', icon: Sliders, badge: `${roles.length}` },
    { id: 'permissions', label: 'Permissions Matrix', icon: ShieldCheck, badge: 'Matrix' },
    { id: 'users', label: 'Users & Access', icon: Users, badge: `${users.length}` },
    { id: 'passwords', label: 'Password Policy', icon: KeyRound, badge: 'AES' },
    { id: 'mfa', label: 'MFA Enforcement', icon: SmartphoneNfc, badge: `${metrics.mfaRate}%` },
    { id: 'devices', label: 'Trusted Devices', icon: Monitor, badge: `${metrics.trustedDevicesCount}` },
    { id: 'sessions', label: 'Active Sessions', icon: Activity, badge: `${metrics.activeSessionsCount}` },
    { id: 'login_history', label: 'Login History', icon: Clock, badge: 'Audit' },
    { id: 'health', label: 'Account Health', icon: ShieldCheck, badge: `${metrics.avgHealth}/100` },
    { id: 'lockout', label: 'Account Lockout', icon: Lock, badge: `${metrics.lockedUsers}` },
    { id: 'policies', label: 'Security Policies', icon: ShieldAlert, badge: 'Rules' },
    { id: 'audit_logs', label: 'Audit Logs', icon: FileText, badge: `${auditLogs.length}` },
    { id: 'automation', label: 'Automation Engine', icon: Cpu, badge: 'Auto' },
    { id: 'api_access', label: 'API Access & Keys', icon: Terminal, badge: `${apiTokens.length}` },
    { id: 'analytics', label: 'Security Analytics', icon: BarChart3, badge: 'Live' },
    { id: 'system', label: 'System Settings', icon: Settings, badge: 'Config' },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* MODULE HEADER BANNER */}
      <div className="bg-white rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-sm p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#074504] text-[#C0991B] flex items-center justify-center font-black shadow-md border border-[#C0991B]/40 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#074504] uppercase tracking-tight flex items-center gap-2 flex-wrap">
              <span>ENTERPRISE ROLES, PERMISSIONS & ADMINISTRATION MODULE</span>
              <span className="px-2.5 py-0.5 bg-amber-50 text-[#826507] text-[9px] font-black rounded-full border border-[#C0991B]/30 uppercase">
                Neema HEEP Command Center
              </span>
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Enterprise roles, active sessions, trusted devices, MFA enforcement, account health & audit logging
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowCreateUserModal(true)}
            className="px-3.5 py-2.5 bg-[#074504] hover:bg-[#053203] text-[#C0991B] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#C0991B]" /> Add New User
          </button>
          <button
            type="button"
            onClick={() => setShowCreateRoleModal(true)}
            className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-[#074504] border border-[#C0991B]/40 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#074504]" /> Create Role
          </button>
        </div>
      </div>

      {/* GLOBAL TOAST NOTIFICATION */}
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
        {ADMIN_TABS.map(tab => {
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

      {/* ================= TAB 1: EXECUTIVE ADMINISTRATION DASHBOARD ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* USER & SECURITY KPI GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border-t-4 border-t-[#074504] border-x border-b border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">Total Portal Users</span>
                <Users className="w-5 h-5 text-[#074504]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#074504]">{metrics.totalUsers}</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {metrics.activeUsers} Active
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                {metrics.disabledUsers} Disabled • {metrics.lockedUsers} Locked
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">MFA Adoption Rate</span>
                <SmartphoneNfc className="w-5 h-5 text-[#C0991B]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900">{metrics.mfaRate}%</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Enforced</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">TOTP, SMS & Email OTP Gateways Active</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-t-4 border-t-emerald-600 border-x border-b border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">System Health Index</span>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-700">{metrics.avgHealth}/100</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">A+ Excellent</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">AES-256 Hashing & Token Caching</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-t-4 border-t-[#074504] border-x border-b border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">Active Sessions</span>
                <Activity className="w-5 h-5 text-[#074504]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#074504]">{metrics.activeSessionsCount}</span>
                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{metrics.trustedDevicesCount} Devices</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Nairobi, Nyeri, Meru & Mombasa</p>
            </div>
          </div>

          {/* MAIN DASHBOARD CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ROLE DISTRIBUTION & PERMISSION MATRIX OVERVIEW */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#C0991B]" /> Enterprise Roles & Access Matrix
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('roles')}
                    className="text-xs font-bold text-[#074504] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Manage Roles <ChevronRight className="w-3.5 h-3.5 text-[#C0991B]" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roles.map(r => (
                    <div key={r.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#074504] uppercase flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                          {r.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-gray-200 rounded-full text-gray-700">
                          {r.userCount} Users
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-relaxed font-medium line-clamp-2">{r.description}</p>
                      <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[10px] font-bold text-gray-500">
                        <span>Permissions: {r.permissionsCount} rights</span>
                        <span className="text-[#C0991B] font-black">{r.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RECENT AUDIT TRAIL LOGS */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C0991B]" /> Live Administrative Audit Log
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
                        <p className="text-[10px] text-gray-400 font-mono">Actor: {log.actor} ({log.actorRole}) • {log.ipAddress} ({log.location})</p>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AUTOMATED SECURITY INSPECTOR & QUICK COMMANDS */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#074504] to-[#042d02] p-6 rounded-2xl border border-[#C0991B] text-white space-y-4 shadow-md">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <ShieldCheck className="w-5 h-5 text-[#C0991B]" />
                  <h3 className="font-black text-sm uppercase text-[#C0991B]">Automated Security Inspector</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white/10 rounded-xl border border-white/20 space-y-1">
                    <span className="font-black text-[#C0991B] uppercase text-[10px] block">MFA Adoption Warning</span>
                    <p className="text-gray-200 font-medium leading-relaxed">
                      1 account (Dr. Jane Muturi) currently bypasses 2FA enforcement. Require MFA to reach 100% compliance.
                    </p>
                  </div>

                  <div className="p-3 bg-white/10 rounded-xl border border-white/20 space-y-1">
                    <span className="font-black text-emerald-400 uppercase text-[10px] block">Password Expiration Check</span>
                    <p className="text-gray-200 font-medium leading-relaxed">
                      All admin passwords are under 30 days old. AES-256 policies compliant.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Security Audit Complete: System state optimal.')}
                  className="w-full py-2.5 bg-[#C0991B] hover:bg-amber-500 text-[#074504] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Cpu className="w-4 h-4 text-[#074504]" /> Run Deep Security Audit
                </button>
              </div>

              {/* QUICK ADMIN ACTIONS */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <h4 className="font-black text-xs text-[#074504] uppercase border-b border-gray-100 pb-2">Quick Administration Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={handleTerminateAllSessions}
                    className="w-full p-2.5 bg-gray-50 hover:bg-red-50 text-red-700 font-bold text-xs rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer"
                  >
                    <span>Force Logout Other Sessions</span>
                    <LockKeyhole className="w-3.5 h-3.5 text-red-600" />
                  </button>

                  <button
                    onClick={() => setActiveTab('permissions')}
                    className="w-full p-2.5 bg-gray-50 hover:bg-amber-50 text-[#074504] font-bold text-xs rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer"
                  >
                    <span>Edit Permission Matrix</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C0991B]" />
                  </button>

                  <button
                    onClick={() => setActiveTab('api_access')}
                    className="w-full p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-xs rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer"
                  >
                    <span>Manage REST API Tokens</span>
                    <Terminal className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= TAB 2: ROLES MANAGER ================= */}
      {activeTab === 'roles' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <div>
              <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#C0991B]" /> Enterprise Role Definitions
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Configure default and custom roles, assign permissions, and restrict module access
              </p>
            </div>
            <button
              onClick={() => setShowCreateRoleModal(true)}
              className="px-4 py-2.5 bg-[#074504] hover:bg-[#053203] text-[#C0991B] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-[#C0991B]" /> Create Custom Role
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map(role => (
              <div key={role.id} className="bg-white p-6 rounded-2xl border-t-4 border-t-[#074504] border-x border-b border-gray-200 shadow-xs space-y-4 hover:border-[#C0991B]/60 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: role.color }} />
                    <h4 className="font-black text-sm text-[#074504]">{role.name}</h4>
                  </div>
                  {role.isDefault ? (
                    <span className="px-2 py-0.5 bg-amber-50 text-[#826507] text-[9px] font-black rounded-full border border-[#C0991B]/30 uppercase">
                      Default
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-800 text-[9px] font-black rounded-full border border-purple-200 uppercase">
                      Custom
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed font-medium">{role.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2 border-t border-gray-100 text-gray-700">
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 uppercase block">Assigned Users</span>
                    <span className="text-sm font-black text-[#074504]">{role.userCount}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 uppercase block">Permissions</span>
                    <span className="text-sm font-black text-gray-900">{role.permissionsCount} Rights</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setActiveTab('permissions')}
                    className="text-xs font-bold text-[#074504] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Edit Rights <ShieldCheck className="w-3.5 h-3.5 text-[#C0991B]" />
                  </button>

                  {!role.isDefault && (
                    <button
                      onClick={() => handleDeleteRole(role.id, role.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                      title="Delete Custom Role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: DYNAMIC PERMISSIONS MATRIX ================= */}
      {activeTab === 'permissions' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C0991B]" /> Enterprise Dynamic Permission Matrix
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Granular action rights per CMS module across all system and custom roles
                </p>
              </div>
              <button
                onClick={() => showToast('Saved permission matrix configuration!')}
                className="px-4 py-2 bg-[#074504] hover:bg-[#053203] text-[#C0991B] font-black text-xs uppercase rounded-xl shadow-md cursor-pointer"
              >
                Save Matrix Changes
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-black uppercase text-gray-700">
                    <th className="p-3">CMS Module</th>
                    {PERMISSION_ACTIONS.map(act => (
                      <th key={act} className="p-3 text-center">{act}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {CMS_MODULES.map(mod => (
                    <tr key={mod.id} className="hover:bg-gray-50/80">
                      <td className="p-3 font-bold text-[#074504]">{mod.name}</td>
                      {PERMISSION_ACTIONS.map(act => {
                        const isChecked = permissionMatrix['role-1']?.[mod.id]?.[act] ?? true;
                        return (
                          <td key={act} className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleMatrixPermission('role-1', mod.id, act)}
                              className="rounded text-[#074504] focus:ring-[#C0991B] cursor-pointer"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: USERS & ACCESS MANAGEMENT ================= */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C0991B]" /> User Accounts & Access Control
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Manage team credentials, assigned roles, status, and security health
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-[#074504]"
                />
                <button
                  onClick={() => setShowCreateUserModal(true)}
                  className="px-3.5 py-2 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl cursor-pointer"
                >
                  New User
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-black uppercase text-gray-700">
                    <th className="p-3">User & Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">MFA Status</th>
                    <th className="p-3">Health Score</th>
                    <th className="p-3">Account Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50/80">
                      <td className="p-3">
                        <span className="font-black text-[#074504] block">{u.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{u.email}</span>
                      </td>
                      <td className="p-3 font-bold text-gray-800">{u.role}</td>
                      <td className="p-3 text-gray-600">{u.department}</td>
                      <td className="p-3">
                        {u.mfaEnabled ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-full">
                            {u.mfaType} ACTIVE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[9px] font-black rounded-full">
                            NONE
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`font-black ${u.healthScore > 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {u.healthScore}/100
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-full ${
                          u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                          u.status === 'Locked' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {u.status === 'Locked' ? (
                          <button
                            onClick={() => handleUnlockUser(u.id, u.username)}
                            className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px] uppercase cursor-pointer"
                          >
                            Unlock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg text-[10px] uppercase cursor-pointer"
                          >
                            {u.status === 'Active' ? 'Disable' : 'Enable'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: ACTIVE SESSIONS MANAGER ================= */}
      {activeTab === 'sessions' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#C0991B]" /> Active User Sessions Monitor
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Real-time session state, IP locations, connected devices & session kill options
                </p>
              </div>
              <button
                onClick={handleTerminateAllSessions}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl shadow-md cursor-pointer"
              >
                Terminate All Other Sessions
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSessions.map(sess => (
                <div key={sess.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-[#074504]" />
                      <span className="font-black text-xs text-[#074504]">{sess.username} ({sess.role})</span>
                    </div>
                    {sess.isCurrentSession && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-full">
                        CURRENT SESSION
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-700 font-bold">{sess.device} • {sess.browser}</p>
                  <p className="text-[11px] text-gray-500 font-mono">IP: {sess.ipAddress} ({sess.location})</p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-[10px] font-bold text-gray-500">
                    <span>Logged In: {sess.loginTime} ({sess.duration})</span>
                    {!sess.isCurrentSession && (
                      <button
                        onClick={() => handleTerminateSession(sess.id, sess.username)}
                        className="text-red-600 hover:underline font-black cursor-pointer"
                      >
                        Kill Session
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: AUDIT LOGS & FORENSICS ================= */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#C0991B]" /> Security & Administrative Audit Trail
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Immutable forensic logs of administrative actions, authentication triggers, and policy edits
                </p>
              </div>

              <button
                onClick={() => showToast('Exported Audit Trail in JSON format.')}
                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Audit Logs
              </button>
            </div>

            <div className="space-y-3">
              {filteredAuditLogs.map(log => (
                <div key={log.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-[#074504]">{log.event}</span>
                    <span className="text-[10px] font-mono text-gray-400">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium">{log.details}</p>
                  <p className="text-[10px] text-gray-500 font-mono pt-1">
                    Actor: {log.actor} ({log.actorRole}) • Category: {log.category} • IP: {log.ipAddress} ({log.location})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: SECURITY POLICIES ================= */}
      {activeTab === 'policies' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#C0991B]" /> Enterprise Security Policy Rules
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Configure global authentication parameters, lockout sensitivity, and session timeouts
              </p>
            </div>
            <button
              onClick={() => showToast('Security Policies updated & applied across server nodes.')}
              className="px-4 py-2 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl cursor-pointer"
            >
              Save Policy Rules
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-bold">
            <div>
              <label className="block text-gray-700 uppercase mb-1">Min Password Length</label>
              <input
                type="number"
                value={policy.minPasswordLength}
                onChange={(e) => setPolicy({ ...policy, minPasswordLength: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-gray-700 uppercase mb-1">Password Expiration (Days)</label>
              <input
                type="number"
                value={policy.passwordExpirationDays}
                onChange={(e) => setPolicy({ ...policy, passwordExpirationDays: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-gray-700 uppercase mb-1">Max Failed Login Attempts</label>
              <input
                type="number"
                value={policy.maxFailedLogins}
                onChange={(e) => setPolicy({ ...policy, maxFailedLogins: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-gray-700 uppercase mb-1">Session Timeout (Mins)</label>
              <input
                type="number"
                value={policy.sessionTimeoutMinutes}
                onChange={(e) => setPolicy({ ...policy, sessionTimeoutMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-gray-700 uppercase mb-1">Max Concurrent Sessions</label>
              <input
                type="number"
                value={policy.maxConcurrentSessions}
                onChange={(e) => setPolicy({ ...policy, maxConcurrentSessions: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                checked={policy.enforceMfaForAdmins}
                onChange={(e) => setPolicy({ ...policy, enforceMfaForAdmins: e.target.checked })}
                className="rounded text-[#074504]"
              />
              <span className="text-gray-800">Enforce Mandatory MFA for All Admins</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= OTHER TABS (API ACCESS, TRUSTED DEVICES, HEALTH, ETC.) ================= */}
      {activeTab === 'api_access' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#C0991B]" /> REST API Access Tokens
              </h3>
              <p className="text-xs text-gray-500 font-medium">Issue and scope REST API keys for webhooks and mobile integrations</p>
            </div>
            <button
              onClick={() => setShowNewTokenModal(true)}
              className="px-4 py-2 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl cursor-pointer"
            >
              Generate API Token
            </button>
          </div>

          <div className="space-y-3">
            {apiTokens.map(tok => (
              <div key={tok.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between gap-4">
                <div>
                  <span className="font-black text-xs text-[#074504] block">{tok.name}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{tok.prefix} • Scopes: {tok.scopes.join(', ')}</span>
                </div>
                <button
                  onClick={() => handleRevokeToken(tok.id, tok.name)}
                  className="px-3 py-1 bg-red-100 text-red-800 font-bold text-xs rounded-lg cursor-pointer"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE ROLE */}
      <AnimatePresence>
        {showCreateRoleModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-6 rounded-2xl border-2 border-[#C0991B] max-w-md w-full space-y-4 shadow-xl"
            >
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-black text-sm text-[#074504] uppercase">Create Custom Role</h3>
                <button onClick={() => setShowCreateRoleModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateRole} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-gray-700 uppercase mb-1">Role Name *</label>
                  <input
                    type="text"
                    required
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="e.g. Regional Field Auditor"
                    className="w-full p-2.5 bg-gray-50 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 uppercase mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newRoleDesc}
                    onChange={(e) => setNewRoleDesc(e.target.value)}
                    placeholder="Describe role scope and privileges..."
                    className="w-full p-2.5 bg-gray-50 border rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#074504] text-[#C0991B] font-black uppercase rounded-xl shadow-md cursor-pointer"
                >
                  Create & Initialize Role
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CREATE USER */}
      <AnimatePresence>
        {showCreateUserModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-6 rounded-2xl border-2 border-[#C0991B] max-w-md w-full space-y-4 shadow-xl"
            >
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-black text-sm text-[#074504] uppercase">Add New Team Member</h3>
                <button onClick={() => setShowCreateUserModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-gray-700 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="e.g. Mary Njoroge"
                    className="w-full p-2.5 bg-gray-50 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="mary.njoroge@neemaheep.com"
                    className="w-full p-2.5 bg-gray-50 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 uppercase mb-1">Assigned Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#074504] text-[#C0991B] font-black uppercase rounded-xl shadow-md cursor-pointer"
                >
                  Send Invite & Save Account
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CREATE API TOKEN */}
      <AnimatePresence>
        {showNewTokenModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-6 rounded-2xl border-2 border-[#C0991B] max-w-md w-full space-y-4 shadow-xl"
            >
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-black text-sm text-[#074504] uppercase">Generate REST API Key</h3>
                <button onClick={() => setShowNewTokenModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateToken} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-gray-700 uppercase mb-1">Token Name *</label>
                  <input
                    type="text"
                    required
                    value={newTokenName}
                    onChange={(e) => setNewTokenName(e.target.value)}
                    placeholder="e.g. Mobile App Gateway Token"
                    className="w-full p-2.5 bg-gray-50 border rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#074504] text-[#C0991B] font-black uppercase rounded-xl shadow-md cursor-pointer"
                >
                  Generate Bearer Key
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
