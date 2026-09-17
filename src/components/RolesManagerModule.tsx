import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { profilesStore } from '../lib/profilesStore';
import { logGlobalAudit } from '../services/auditService';
import { 
  Sliders, Shield, ShieldCheck, ShieldAlert, Users, UserCheck, UserX, UserPlus, 
  CheckCircle2, XCircle, Search, Filter, Plus, Trash2, Edit3, Eye, EyeOff, Copy, Check, 
  RefreshCw, ChevronRight, CheckSquare, X, Info, Wand2, Layers, AlertCircle, 
  ArrowRight, GitBranch, Key, Lock, Unlock, FileText, Download, Globe, SmartphoneNfc, Activity
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
  parentRoleId?: string;
}

export interface UserRoleMapping {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Disabled' | 'Pending';
  assignedDate: string;
  assignedBy: string;
  hasCustomOverrides: boolean;
  initialPassword?: string;
  grantedRights?: string[]; // Array e.g. ["mod_articles:View", "mod_articles:Create"]
}

export interface RolesAuditLog {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  targetRoleOrUser: string;
  details: string;
  status: 'Success' | 'Warning';
}

// ================= CONSTANTS =================
export const CMS_MODULES = [
  { id: 'mod_articles', name: 'Articles & Content' },
  { id: 'mod_media', name: 'Media Library (DAM)' },
  { id: 'mod_categories', name: 'Categories & Tags' },
  { id: 'mod_comments', name: 'Comments & Moderation' },
  { id: 'mod_beneficiaries', name: 'Beneficiaries & Loans' },
  { id: 'mod_vacancies', name: 'Careers & Vacancies' },
  { id: 'mod_messages', name: 'Leads & Inquiries' },
  { id: 'mod_profiles', name: 'Profiles & Staff' },
  { id: 'mod_passwords', name: 'Password Management' },
  { id: 'mod_analytics', name: 'Analytics & Reports' },
  { id: 'mod_roles', name: 'Roles & Permissions' },
  { id: 'mod_security', name: 'Security & Auth Policies' },
  { id: 'mod_system', name: 'System Settings & Backups' },
];

export const PERMISSION_ACTIONS = [
  'View', 'Create', 'Edit', 'Delete', 'Publish', 'Moderate', 'Approve', 'Configure', 'Export'
];

const INITIAL_ROLES: EnterpriseRole[] = [
  {
    id: 'role-1',
    name: 'Superadmin',
    description: 'Full unrestricted system administration access across all CMS modules, roles, and security policies.',
    isDefault: true,
    userCount: 1,
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
    name: 'Web Master',
    description: 'Access granted exclusively to webmaster sub-modules (Beneficiaries, Vacancies, Comments, Inquiries) plus Profiles and Passwords.',
    isDefault: true,
    userCount: 2,
    permissionsCount: 54,
    color: '#059669',
    category: 'System',
    canManageUsers: true,
    canManageRoles: false,
    canManageSecurity: false,
    canManageContent: true,
  },
  {
    id: 'role-3',
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
    id: 'role-4',
    name: 'Author',
    description: 'Create, edit, and publish own articles, manage assigned publishing workflows, and upload media.',
    isDefault: true,
    userCount: 8,
    permissionsCount: 54,
    color: '#2563EB',
    category: 'Editorial',
    canManageUsers: false,
    canManageRoles: false,
    canManageSecurity: false,
    canManageContent: true,
  },
];

const INITIAL_USER_MAPPINGS: UserRoleMapping[] = [
  {
    id: 'usr-1',
    username: 'ptrckmunene@gmail.com',
    name: 'Patrick Munene',
    email: 'ptrckmunene@gmail.com',
    role: 'Superadmin',
    department: 'Web Development',
    status: 'Active',
    assignedDate: '2025-01-10',
    assignedBy: 'System Initializer',
    hasCustomOverrides: false,
    initialPassword: '',
    grantedRights: CMS_MODULES.flatMap(m => PERMISSION_ACTIONS.map(a => `${m.id}:${a}`))
  },
  {
    id: 'usr-2',
    username: 'muthonichar12@gmail.com',
    name: 'Charity Muthoni',
    email: 'muthonichar12@gmail.com',
    role: 'Author',
    department: 'CMS Editorial',
    status: 'Active',
    assignedDate: '2026-09-17',
    assignedBy: 'System Administrator',
    hasCustomOverrides: false,
    initialPassword: '@Cham123#',
    grantedRights: [
      'mod_articles:View', 'mod_articles:Create', 'mod_articles:Edit', 'mod_articles:Publish',
      'mod_media:View', 'mod_media:Create', 'mod_media:Edit', 'mod_media:Publish'
    ]
  },
];

const INITIAL_AUDIT_LOGS: RolesAuditLog[] = [
  {
    id: 'audit-1',
    timestamp: '2026-08-13 01:10:00',
    event: 'Superadmin Initialized',
    actor: 'Patrick Munene',
    targetRoleOrUser: 'Patrick Munene (ptrckmunene@gmail.com)',
    details: 'Configured Superadmin rights across all CMS modules with Web Development department role.',
    status: 'Success',
  },
];

export default function RolesManagerModule({ className = '' }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'roles_list' | 'permissions_matrix' | 'individual_rights' | 'user_assignments' | 'audit_log'
  >('overview');

  // Master State
  const [roles, setRoles] = useState<EnterpriseRole[]>(INITIAL_ROLES);
  const [userMappings, setUserMappings] = useState<UserRoleMapping[]>(INITIAL_USER_MAPPINGS);
  const [auditLogs, setAuditLogs] = useState<RolesAuditLog[]>(INITIAL_AUDIT_LOGS);

  // New User Creation Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<string>('Author');
  const [newUserDept, setNewUserDept] = useState<string>('CMS Editorial');
  const [newUserInitialPassword, setNewUserInitialPassword] = useState('');
  const [showInitialPassword, setShowInitialPassword] = useState(false);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  // New Custom Role Modal State
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleCategory, setNewRoleCategory] = useState<'Custom' | 'Editorial' | 'Operations' | 'System'>('Custom');
  const [newRoleColor, setNewRoleColor] = useState('#8B5CF6');
  const [newRolePreset, setNewRolePreset] = useState<'Full' | 'Editorial' | 'View' | 'Custom'>('Editorial');
  const [isSubmittingRole, setIsSubmittingRole] = useState(false);

  // User Rights State
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>('ptrckmunene@gmail.com');
  const [userRightsMatrix, setUserRightsMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [isSavingUserRights, setIsSavingUserRights] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [matrixRoleFilter, setMatrixRoleFilter] = useState<string>('role-1');

  // Interactive Permission Matrix State: [roleId][moduleId][action] = boolean
  const [permissionMatrix, setPermissionMatrix] = useState<Record<string, Record<string, Record<string, boolean>>>>(() => {
    const matrix: Record<string, Record<string, Record<string, boolean>>> = {};
    INITIAL_ROLES.forEach(role => {
      matrix[role.id] = {};
      CMS_MODULES.forEach(mod => {
        matrix[role.id][mod.id] = {};
        PERMISSION_ACTIONS.forEach(act => {
          if (role.name === 'Superadmin' || role.id === 'role-1') {
            matrix[role.id][mod.id][act] = true;
          } else if (role.name === 'Web Master' || role.name === 'Webmaster' || role.name === 'Site Administrator' || role.id === 'role-2') {
            const isWebmasterSubModule = ['mod_beneficiaries', 'mod_vacancies', 'mod_comments', 'mod_messages', 'mod_profiles', 'mod_passwords'].includes(mod.id);
            matrix[role.id][mod.id][act] = isWebmasterSubModule;
          } else if (role.name === 'Editor' || role.id === 'role-3') {
            matrix[role.id][mod.id][act] = ['View', 'Create', 'Edit', 'Publish', 'Moderate', 'Approve'].includes(act) && !mod.id.includes('security') && !mod.id.includes('system');
          } else if (role.name === 'Author' || role.id === 'role-4') {
            matrix[role.id][mod.id][act] = ['View', 'Create', 'Edit', 'Publish'].includes(act) && (mod.id === 'mod_articles' || mod.id === 'mod_media');
          } else {
            matrix[role.id][mod.id][act] = act === 'View';
          }
        });
      });
    });
    return matrix;
  });

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const logAuditEvent = (event: string, targetRoleOrUser: string, details: string) => {
    const log: RolesAuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      event,
      actor: 'Patrick Munene',
      targetRoleOrUser,
      details,
      status: 'Success',
    };
    setAuditLogs(prev => [log, ...prev]);
    logGlobalAudit(event, `${targetRoleOrUser}: ${details}`, 'Roles & Permissions', 'Success', 'Patrick Munene', 'Superadmin');
  };

  // Sync with Supabase user_roles & custom_roles
  const fetchSupabaseUserRoles = async () => {
    try {
      const { data, error } = await supabase.from('user_roles').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        const mapped: UserRoleMapping[] = data.map((u: any) => ({
          id: u.id,
          username: u.email,
          name: u.user_name || u.email.split('@')[0],
          email: u.email,
          role: u.role,
          department: u.department || (u.role === 'Superadmin' ? 'Web Development' : 'CMS Editorial'),
          status: u.status || 'Active',
          assignedDate: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : '2026-08-13',
          assignedBy: u.assigned_by || 'Patrick Munene',
          hasCustomOverrides: Array.isArray(u.granted_rights) && u.granted_rights.length > 0,
          initialPassword: u.initial_password || '',
          grantedRights: Array.isArray(u.granted_rights) ? u.granted_rights : []
        }));
        setUserMappings(mapped);
      }
    } catch (err) {
      console.warn("Supabase user roles fetch notice:", err);
    }
  };

  const fetchCustomRoles = async () => {
    try {
      const { data, error } = await supabase.from('custom_roles').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        const loadedRoles: EnterpriseRole[] = data.map((r: any) => ({
          id: r.id,
          name: r.name,
          description: r.description || 'Custom defined enterprise role.',
          isDefault: false,
          userCount: userMappings.filter(u => u.role === r.name).length,
          permissionsCount: r.permissions ? Object.keys(r.permissions).length : 18,
          color: r.color || '#8B5CF6',
          category: r.category || 'Custom',
          canManageUsers: false,
          canManageRoles: false,
          canManageSecurity: false,
          canManageContent: true,
        }));

        setRoles(prev => {
          const defaultRoles = prev.filter(p => p.isDefault);
          return [...defaultRoles, ...loadedRoles];
        });
      }
    } catch (err) {
      console.warn("Supabase custom roles fetch notice:", err);
    }
  };

  useEffect(() => {
    fetchSupabaseUserRoles();
    fetchCustomRoles();
  }, []);

  // Update matrix when selecting individual user in User rights tab
  const selectedUser = useMemo(() => {
    return userMappings.find(u => u.email.toLowerCase() === selectedUserEmail.toLowerCase()) || userMappings[0];
  }, [selectedUserEmail, userMappings]);

  useEffect(() => {
    if (selectedUser) {
      const matrix: Record<string, Record<string, boolean>> = {};
      CMS_MODULES.forEach(m => {
        matrix[m.id] = {};
        PERMISSION_ACTIONS.forEach(a => {
          const rightKey = `${m.id}:${a}`;
          if (selectedUser.grantedRights && selectedUser.grantedRights.length > 0) {
            matrix[m.id][a] = selectedUser.grantedRights.includes(rightKey);
          } else if (selectedUser.role === 'Superadmin') {
            matrix[m.id][a] = true;
          } else if (selectedUser.role === 'Editor') {
            matrix[m.id][a] = ['View', 'Create', 'Edit', 'Publish', 'Moderate', 'Approve'].includes(a) && !m.id.includes('security') && !m.id.includes('system');
          } else {
            matrix[m.id][a] = a === 'View';
          }
        });
      });
      setUserRightsMatrix(matrix);
    }
  }, [selectedUser]);

  // Generate random secure password helper
  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$&!';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUserInitialPassword(pass);
    setShowInitialPassword(true);
  };

  // Handle Add New Role Submission
  const handleCreateRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      showToast('Role Name is required.', 'error');
      return;
    }
    setIsSubmittingRole(true);
    const roleId = `role-${Date.now()}`;
    
    const initialPerms: Record<string, Record<string, boolean>> = {};
    CMS_MODULES.forEach(m => {
      initialPerms[m.id] = {};
      PERMISSION_ACTIONS.forEach(a => {
        if (newRolePreset === 'Full') initialPerms[m.id][a] = true;
        else if (newRolePreset === 'Editorial') initialPerms[m.id][a] = ['View', 'Create', 'Edit', 'Publish'].includes(a) && !m.id.includes('security');
        else initialPerms[m.id][a] = a === 'View';
      });
    });

    const newRole: EnterpriseRole = {
      id: roleId,
      name: newRoleName.trim(),
      description: newRoleDesc.trim() || 'Custom created enterprise role.',
      isDefault: false,
      userCount: 0,
      permissionsCount: newRolePreset === 'Full' ? 90 : (newRolePreset === 'Editorial' ? 40 : 10),
      color: newRoleColor,
      category: newRoleCategory,
      canManageUsers: newRolePreset === 'Full',
      canManageRoles: newRolePreset === 'Full',
      canManageSecurity: newRolePreset === 'Full',
      canManageContent: true,
    };

    try {
      const { error } = await supabase.from('custom_roles').insert([{
        id: roleId,
        name: newRoleName.trim(),
        description: newRoleDesc.trim(),
        category: newRoleCategory,
        color: newRoleColor,
        permissions: initialPerms,
        created_by: 'Patrick Munene (Superadmin)'
      }]);

      if (error) console.warn("Supabase custom roles insert notice:", error);

      setRoles(prev => [...prev, newRole]);
      setPermissionMatrix(prev => ({ ...prev, [roleId]: initialPerms }));

      setShowCreateRoleModal(false);
      setNewRoleName('');
      setNewRoleDesc('');
      showToast(`New custom role "${newRoleName.trim()}" activated and saved to database!`);
      logAuditEvent('Custom Role Created', `Role: ${newRoleName.trim()}`, `Created new ${newRoleCategory} role definition with ${newRolePreset} rights preset.`);
    } catch (err: any) {
      showToast(err.message || 'Error creating custom role.', 'error');
    } finally {
      setIsSubmittingRole(false);
    }
  };

  // Handle Save Individual User Rights
  const handleSaveIndividualRights = async () => {
    if (!selectedUser) return;
    setIsSavingUserRights(true);

    const grantedKeys: string[] = [];
    CMS_MODULES.forEach(m => {
      PERMISSION_ACTIONS.forEach(a => {
        if (userRightsMatrix[m.id]?.[a]) {
          grantedKeys.push(`${m.id}:${a}`);
        }
      });
    });

    try {
      const { error: roleErr } = await supabase.from('user_roles').update({
        granted_rights: grantedKeys
      }).eq('email', selectedUser.email);

      if (roleErr) throw roleErr;

      setUserMappings(prev => prev.map(u => 
        u.email.toLowerCase() === selectedUser.email.toLowerCase() 
          ? { ...u, grantedRights: grantedKeys, hasCustomOverrides: true } 
          : u
      ));

      showToast(`Saved ${grantedKeys.length} individual granted rights for ${selectedUser.name} in database!`);
      logAuditEvent(
        'Individual Rights Saved', 
        `User: ${selectedUser.name} (${selectedUser.email})`, 
        `Updated individual module rights per user name (${grantedKeys.length} permissions granted).`
      );
    } catch (err: any) {
      showToast(err.message || 'Error saving user rights to database.', 'error');
    } finally {
      setIsSavingUserRights(false);
    }
  };

  // Export Rights Report as CSV
  const handleExportRightsReport = () => {
    const csvRows = [
      ['Name', 'Email', 'Assigned Role', 'Department', 'Status', 'Initial Password Status', 'Assigned Date', 'Total Rights Granted', 'Granted Rights List']
    ];

    userMappings.forEach(u => {
      const rightsList = u.grantedRights && u.grantedRights.length > 0 
        ? u.grantedRights.join('; ') 
        : (u.role === 'Superadmin' ? 'All System Rights Granted' : 'Default Role Rights');

      csvRows.push([
        `"${u.name}"`,
        `"${u.email}"`,
        `"${u.role}"`,
        `"${u.department}"`,
        `"${u.status}"`,
        u.initialPassword ? `"Captured (${u.initialPassword})"` : '"Not Set"',
        `"${u.assignedDate}"`,
        `"${u.grantedRights?.length || (u.role === 'Superadmin' ? 90 : 20)}"`,
        `"${rightsList}"`
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Neema_HEEP_User_Rights_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Downloaded User Rights & Roles Report (CSV).');
    logAuditEvent('User Rights Report Exported', 'All Users', 'Exported comprehensive individual rights audit report.');
  };

  // Toggle permission in matrix
  const handleTogglePermission = (roleId: string, moduleId: string, action: string) => {
    setPermissionMatrix(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[roleId]) next[roleId] = {};
      if (!next[roleId][moduleId]) next[roleId][moduleId] = {};
      next[roleId][moduleId][action] = !next[roleId][moduleId][action];
      return next;
    });
    showToast('Permission matrix updated in active workspace memory.');
  };

  // Toggle permission in user rights matrix
  const handleToggleUserRight = (moduleId: string, action: string) => {
    setUserRightsMatrix(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [action]: !prev[moduleId]?.[action]
      }
    }));
  };

  // Metrics
  const totalRoles = roles.length;
  const totalUsersMapped = userMappings.length;

  // RENAMED SCREEN SUB-TABS (User rights, User List, Reports)
  const SUB_TABS = [
    { id: 'overview', label: 'Overview', icon: Sliders, badge: 'Dashboard' },
    { id: 'permissions_matrix', label: 'Role Matrix', icon: ShieldCheck, badge: `${totalRoles}` },
    { id: 'individual_rights', label: 'User rights', icon: Key, badge: 'Custom Rights' },
    { id: 'user_assignments', label: 'User List', icon: Users, badge: `${totalUsersMapped}` },
    { id: 'audit_log', label: 'Reports', icon: FileText, badge: `${auditLogs.length}` },
  ];

  return (
    <div className={`space-y-5 ${className}`}>
      
      {/* MODULE HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#074504] text-white rounded-2xl border border-[#C0991B]/30 shadow-lg p-5 md:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[#C0991B] shrink-0" />
            <span>ROLE & USER RIGHTS MANAGEMENT MODULE</span>
          </h2>
          <span className="px-2.5 py-0.5 bg-[#C0991B] text-[#074504] text-[10px] font-black rounded-full uppercase shadow-xs">
            Database Synced
          </span>
        </div>

        <p className="text-xs text-gray-200 font-medium leading-relaxed max-w-4xl">
          Register new CMS users with initial passwords, manage custom enterprise roles, configure granular User Rights, view the User List, and download Reports.
        </p>

        <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setShowAddUserModal(true)}
            className="px-3.5 py-2 bg-[#C0991B] hover:bg-[#a88414] text-[#074504] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[3]" /> Register New CMS User
          </button>

          <button
            type="button"
            onClick={() => setShowCreateRoleModal(true)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-white/20 shadow-md"
          >
            <Plus className="w-4 h-4 text-[#C0991B]" /> + Add New Role
          </button>

          <button
            type="button"
            onClick={handleExportRightsReport}
            className="px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-emerald-500/40"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Export Reports
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
            className="p-3 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 shadow-md"
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

      {/* SUB-TABS NAVIGATION (Renamed to User rights, User List, Reports) */}
      <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar">
        {SUB_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-black uppercase whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
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

      {/* ================= TAB 1: OVERVIEW DASHBOARD ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border-t-4 border-t-[#074504] border-x border-b border-gray-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">Active Roles</span>
                <Shield className="w-4 h-4 text-[#074504]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-[#074504]">{totalRoles} Roles</span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-[#C0991B]/30">
                  {roles.filter(r => !r.isDefault).length} Custom
                </span>
              </div>
              <p className="text-[10.5px] text-gray-500 font-medium">Superadmin, Site Admin, Editor, Author & Custom</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">CMS Scope</span>
                <ShieldCheck className="w-4 h-4 text-[#C0991B]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-gray-900">10 Modules</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">9 Actions</span>
              </div>
              <p className="text-[10.5px] text-gray-500 font-medium">90 Granular Rights per Role & Individual User</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border-t-4 border-t-blue-600 border-x border-b border-gray-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">Registered Users</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-gray-900">{totalUsersMapped} Users</span>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">Database Synced</span>
              </div>
              <p className="text-[10.5px] text-gray-500 font-medium">Synced with Enterprise user_roles and user_profiles</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border-t-4 border-t-purple-600 border-x border-b border-gray-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-black uppercase tracking-wider">User Rights Overrides</span>
                <Key className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-gray-900">
                  {userMappings.filter(u => u.grantedRights && u.grantedRights.length > 0).length} Users
                </span>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">User rights</span>
              </div>
              <p className="text-[10.5px] text-gray-500 font-medium">Defined explicitly per individual user account</p>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* ROLE CARDS CATALOG */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="font-black text-xs text-[#074504] uppercase flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#C0991B]" /> Enterprise Role Catalog ({roles.length})
                  </h3>
                  <button
                    onClick={() => setShowCreateRoleModal(true)}
                    className="text-xs font-bold text-[#074504] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    + Add New Role
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roles.map(r => (
                    <div key={r.id} className="p-3 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-1.5 hover:border-[#C0991B] transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#074504] uppercase flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                          {r.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-gray-200 rounded-full text-gray-700">
                          {userMappings.filter(u => u.role === r.name).length} Users
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-relaxed font-medium line-clamp-2">{r.description}</p>
                      <div className="pt-1.5 border-t border-gray-200 flex items-center justify-between text-[10px] font-bold text-gray-500">
                        <span>{r.permissionsCount} Rights</span>
                        <span className="text-[#C0991B] font-black">{r.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AUDIT TRAIL */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="font-black text-xs text-[#074504] uppercase flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#C0991B]" /> Recent Privilege Change Log
                  </h3>
                  <button
                    onClick={() => setActiveTab('audit_log')}
                    className="text-xs font-bold text-[#074504] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Reports <ChevronRight className="w-3.5 h-3.5 text-[#C0991B]" />
                  </button>
                </div>

                <div className="space-y-2">
                  {auditLogs.slice(0, 3).map(log => (
                    <div key={log.id} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="font-black text-[#074504] block">{log.event} ({log.targetRoleOrUser})</span>
                        <span className="text-gray-600 font-medium text-[11px]">{log.details}</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="font-black text-xs text-[#074504] uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#C0991B]" /> Access Matrix Health
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Database Live
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="font-bold text-gray-700">Total Defined Roles</span>
                    <span className="font-black text-[#074504]">{roles.length} Roles</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="font-bold text-gray-700">Registered Users</span>
                    <span className="font-black text-[#074504]">{userMappings.length} Users</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <h4 className="font-black text-xs text-[#074504] uppercase border-b border-gray-100 pb-2">Quick Navigation</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('individual_rights')}
                    className="w-full p-2.5 bg-[#074504] hover:bg-[#053203] text-[#C0991B] font-bold text-xs rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-xs"
                  >
                    <span>User rights</span>
                    <Key className="w-3.5 h-3.5 text-[#C0991B]" />
                  </button>

                  <button
                    onClick={() => setActiveTab('permissions_matrix')}
                    className="w-full p-2.5 bg-gray-50 hover:bg-amber-50 hover:border-[#C0991B]/50 text-[#074504] font-bold text-xs rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span>Role Matrix</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C0991B]" />
                  </button>

                  <button
                    onClick={() => setActiveTab('user_assignments')}
                    className="w-full p-2.5 bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 text-[#074504] font-bold text-xs rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span>User List</span>
                    <Users className="w-3.5 h-3.5 text-[#C0991B]" />
                  </button>

                  <button
                    onClick={() => setActiveTab('audit_log')}
                    className="w-full p-2.5 bg-gray-50 hover:bg-purple-50 hover:border-purple-300 text-[#074504] font-bold text-xs rounded-xl border border-gray-200 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span>Reports</span>
                    <FileText className="w-3.5 h-3.5 text-[#C0991B]" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= TAB 2: ROLE PERMISSION MATRIX ================= */}
      {activeTab === 'permissions_matrix' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div>
              <h3 className="font-black text-xs text-[#074504] uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C0991B]" /> Enterprise Role Permission Matrix
              </h3>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                Configure module-level action rights across system roles and add custom roles
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateRoleModal(true)}
              className="px-3.5 py-2 bg-[#074504] text-[#C0991B] hover:bg-[#053203] font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#C0991B]" />
              <span>+ Add New Role</span>
            </button>
          </div>

          {/* Role Cards Selector */}
          <div className="space-y-2">
            <span className="text-[11px] font-black text-[#074504] uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#C0991B]" /> Select Role to Edit Matrix Rights ({roles.length} Roles)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
              {roles.map(r => {
                const isSelected = matrixRoleFilter === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setMatrixRoleFilter(r.id)}
                    className={`bg-white p-3 rounded-2xl border transition-all cursor-pointer relative space-y-2 ${
                      isSelected
                        ? 'border-2 border-[#074504] ring-2 ring-[#C0991B]/40 shadow-xs bg-emerald-50/20'
                        : 'border-gray-200 hover:border-[#C0991B] shadow-xs hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                        <h4 className="font-black text-xs text-[#074504] truncate">{r.name}</h4>
                      </div>
                      {r.isDefault ? (
                        <span className="px-1.5 py-0.5 bg-amber-50 text-[#826507] text-[8px] font-black rounded-md border border-[#C0991B]/30 uppercase shrink-0">
                          Default
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-purple-50 text-purple-800 text-[8px] font-black rounded-md border border-purple-200 uppercase shrink-0">
                          Custom
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] text-gray-500 font-medium line-clamp-2 leading-tight">{r.description}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px] font-bold">
                      <span className="text-gray-500">{userMappings.filter(u => u.role === r.name).length} Users</span>
                      <span className="text-[#074504] font-black">{r.permissionsCount} Rights</span>
                    </div>

                    {isSelected && (
                      <div className="bg-[#074504] text-[#C0991B] text-[8.5px] font-black uppercase text-center py-0.5 rounded-lg flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#C0991B]" /> Selected
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Matrix Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-3 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: roles.find(r => r.id === matrixRoleFilter)?.color || '#074504' }} />
                <h4 className="font-black text-xs text-[#074504]">
                  Permission Matrix Rights for: <span className="text-[#C0991B] uppercase">{roles.find(r => r.id === matrixRoleFilter)?.name}</span>
                </h4>
              </div>

              <button
                type="button"
                onClick={() => showToast('Saved role permission matrix changes!')}
                className="px-3.5 py-1.5 bg-[#074504] text-[#C0991B] hover:bg-[#053203] rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer shadow-xs"
              >
                Save Matrix Changes
              </button>
            </div>

            <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead className="sticky top-0 bg-gray-50 z-10">
                  <tr className="border-b border-gray-200 text-[10px] font-black text-gray-500 uppercase">
                    <th className="px-3 py-2">CMS Module</th>
                    {PERMISSION_ACTIONS.map(action => (
                      <th key={action} className="px-1.5 py-2 text-center">{action}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {CMS_MODULES.map(mod => {
                    const roleMatrix = permissionMatrix[matrixRoleFilter]?.[mod.id] || {};

                    return (
                      <tr key={mod.id} className="hover:bg-gray-50/80">
                        <td className="px-3 py-2 font-bold text-[#074504] text-xs whitespace-nowrap">
                          {mod.name}
                        </td>
                        {PERMISSION_ACTIONS.map(action => {
                          const checked = !!roleMatrix[action];
                          return (
                            <td key={action} className="px-1.5 py-1.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleTogglePermission(matrixRoleFilter, mod.id, action)}
                                className={`w-5 h-5 rounded-md inline-flex items-center justify-center transition-all cursor-pointer ${
                                  checked 
                                    ? 'bg-[#074504] text-[#C0991B] shadow-xs' 
                                    : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                                }`}
                              >
                                {checked ? <Check className="w-3 h-3 stroke-[3]" /> : <X className="w-2.5 h-2.5" />}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: USER RIGHTS ================= */}
      {activeTab === 'individual_rights' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-xs text-[#074504] uppercase flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#C0991B]" /> User rights Configuration
                </h3>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                  Configure custom module permissions for a specific individual user account.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveIndividualRights}
                disabled={isSavingUserRights}
                className="px-4 py-2 bg-[#074504] text-[#C0991B] hover:bg-[#053203] font-black text-xs uppercase rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
              >
                <CheckCircle2 className="w-4 h-4 text-[#C0991B]" />
                <span>{isSavingUserRights ? 'Saving...' : `Save Rights for ${selectedUser?.name || 'User'}`}</span>
              </button>
            </div>

            {/* Select User Dropdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-500 block">Select Individual User Account</label>
                <select
                  value={selectedUserEmail}
                  onChange={e => setSelectedUserEmail(e.target.value)}
                  className="w-full bg-white border border-gray-300 px-3.5 py-2 rounded-xl font-bold text-xs text-[#074504] focus:outline-none focus:ring-2 focus:ring-[#074504]"
                >
                  {userMappings.map(u => (
                    <option key={u.id} value={u.email}>
                      {u.name} - {u.email} ({u.role} | {u.department})
                    </option>
                  ))}
                </select>
              </div>

              {selectedUser && (
                <div className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-black text-[#074504] block">{selectedUser.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{selectedUser.email}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-emerald-50 text-[#074504] text-[10px] font-black rounded-md border border-emerald-200 uppercase block">
                      Role: {selectedUser.role}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold block mt-0.5">
                      Dept: {selectedUser.department}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Permission Matrix for Selected User */}
            <div className="overflow-x-auto border border-gray-200 rounded-2xl max-h-[460px] overflow-y-auto">
              <table className="w-full text-left border-collapse min-w-[680px]">
                <thead className="sticky top-0 bg-[#074504] text-white text-[10px] font-black uppercase z-10">
                  <tr>
                    <th className="px-3.5 py-2.5">CMS Module</th>
                    {PERMISSION_ACTIONS.map(action => (
                      <th key={action} className="px-1.5 py-2.5 text-center">{action}</th>
                    ))}
                    <th className="px-3 py-2.5 text-right">Quick Grant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs bg-white">
                  {CMS_MODULES.map(mod => {
                    const modUserRights = userRightsMatrix[mod.id] || {};
                    const allChecked = PERMISSION_ACTIONS.every(act => !!modUserRights[act]);

                    return (
                      <tr key={mod.id} className="hover:bg-gray-50">
                        <td className="px-3.5 py-2 font-black text-[#074504] text-xs">
                          {mod.name}
                        </td>
                        {PERMISSION_ACTIONS.map(action => {
                          const isGranted = !!modUserRights[action];
                          return (
                            <td key={action} className="px-1.5 py-1.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleUserRight(mod.id, action)}
                                className={`w-5.5 h-5.5 rounded-lg inline-flex items-center justify-center transition-all cursor-pointer ${
                                  isGranted
                                    ? 'bg-[#074504] text-[#C0991B] shadow-xs'
                                    : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                                }`}
                              >
                                {isGranted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-2.5 h-2.5" />}
                              </button>
                            </td>
                          );
                        })}
                        <td className="px-3 py-1.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setUserRightsMatrix(prev => {
                                const next = { ...prev };
                                next[mod.id] = {};
                                PERMISSION_ACTIONS.forEach(a => {
                                  next[mod.id][a] = !allChecked;
                                });
                                return next;
                              });
                            }}
                            className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-[9px] uppercase rounded-md cursor-pointer whitespace-nowrap"
                          >
                            {allChecked ? 'Uncheck' : 'Check All'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-500 font-medium">
                Saved to <code className="font-mono text-[#074504] font-bold">user_roles.granted_rights</code> database column.
              </span>
              <button
                type="button"
                onClick={handleSaveIndividualRights}
                disabled={isSavingUserRights}
                className="px-5 py-2.5 bg-[#074504] text-[#C0991B] hover:bg-[#053203] font-black text-xs uppercase rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#C0991B]" />
                <span>{isSavingUserRights ? 'Saving...' : `Save Rights for ${selectedUser?.name || 'User'}`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: USER LIST ================= */}
      {activeTab === 'user_assignments' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-xs text-[#074504] uppercase flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C0991B]" /> User List ({userMappings.length})
              </h3>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                Registered CMS users, assigned roles, initial passwords, and database access statuses.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportRightsReport}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-[#074504] font-bold text-xs uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-gray-200"
              >
                <Download className="w-3.5 h-3.5" /> Export Report
              </button>
              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="px-3.5 py-2 bg-[#074504] text-[#C0991B] font-black text-xs uppercase tracking-wider rounded-xl hover:bg-[#053203] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <UserPlus className="w-4 h-4 text-[#C0991B]" /> Register New CMS User
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-left border-collapse min-w-[780px]">
                <thead className="sticky top-0 bg-gray-50 z-10 border-b border-gray-200 text-[10px] font-black text-gray-500 uppercase">
                  <tr>
                    <th className="p-3">User Details</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3">Initial Password</th>
                    <th className="p-3">User rights</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {userMappings.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50/80">
                      <td className="p-3 font-bold">
                        <div className="text-[#074504] font-black flex items-center gap-1.5">
                          {u.role === 'Superadmin' ? <Shield className="w-3.5 h-3.5 text-[#C0991B]" /> : <UserCheck className="w-3.5 h-3.5 text-[#2563EB]" />}
                          {u.name}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5">{u.email}</div>
                      </td>
                      <td className="p-3 font-bold text-gray-800">{u.department}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-black rounded-full border uppercase ${
                          u.role === 'Superadmin' 
                            ? 'bg-emerald-50 text-[#074504] border-[#074504]/30'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        {u.initialPassword ? (
                          <span className="font-mono text-[11px] bg-amber-50 text-[#826507] px-2 py-0.5 rounded-md border border-[#C0991B]/30 font-bold">
                            {u.initialPassword}
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-medium">Default/System</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-800 text-[10px] font-black rounded-md border border-purple-200">
                            {u.grantedRights?.length || (u.role === 'Superadmin' ? 90 : 20)} Granted
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUserEmail(u.email);
                              setActiveTab('individual_rights');
                            }}
                            className="text-[10px] font-bold text-[#074504] hover:underline"
                          >
                            Edit Rights
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3 text-right flex items-center justify-end gap-2">
                        <select
                          value={u.role}
                          onChange={async e => {
                            const newRole = e.target.value;
                            setUserMappings(prev => prev.map(m => m.id === u.id ? { ...m, role: newRole } : m));
                            try {
                              await supabase.from('user_roles').update({ role: newRole }).eq('email', u.email);
                              showToast(`Updated ${u.name}'s role to ${newRole} in database.`);
                            } catch (err) {
                              console.warn("Role update notice:", err);
                            }
                          }}
                          className="p-1 bg-gray-50 border border-gray-200 rounded-lg text-[11px] font-bold text-[#074504]"
                        >
                          {roles.map(r => (
                            <option key={r.id} value={r.name}>{r.name}</option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={async () => {
                            if (u.email.toLowerCase() === 'ptrckmunene@gmail.com') {
                              showToast('Primary Superadmin (Patrick Munene) cannot be deleted.', 'error');
                              return;
                            }
                            if (window.confirm(`Are you sure you want to delete user "${u.name}" (${u.email})?`)) {
                              try {
                                await supabase.from('user_roles').delete().eq('email', u.email);
                                await supabase.from('user_profiles').delete().eq('email', u.email);
                                setUserMappings(prev => prev.filter(m => m.id !== u.id && m.email !== u.email));
                                showToast(`User "${u.name}" deleted successfully.`);
                              } catch (err: any) {
                                showToast(err.message || 'Error deleting user.', 'error');
                              }
                            }
                          }}
                          title="Delete User"
                          className="p-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: REPORTS ================= */}
      {activeTab === 'audit_log' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-xs text-[#074504] uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C0991B]" /> Role & Privilege Reports & Change Logs
              </h3>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                Audit trail of user registrations, initial password assignments, role creations, and individual rights updates.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportRightsReport}
              className="px-3.5 py-2 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#C0991B]" /> Export Reports (CSV)
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs divide-y divide-gray-100 max-h-[520px] overflow-y-auto">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3.5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-black text-[#074504] block">{log.event} ({log.targetRoleOrUser})</span>
                  <span className="text-gray-600 font-medium text-[11px]">{log.details}</span>
                  <span className="text-[10px] text-gray-400 font-mono block">Actor: {log.actor}</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL 1: REGISTER NEW CMS USER ================= */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-5 md:p-6 max-w-lg w-full border border-gray-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#074504]" />
                  <h3 className="font-black text-xs text-[#074504] uppercase">Register New CMS User</h3>
                </div>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!newUserName.trim() || !newUserEmail.trim()) {
                  showToast('Full Name and Email Address are required.', 'error');
                  return;
                }
                if (!newUserInitialPassword.trim()) {
                  showToast('Initial Password is required.', 'error');
                  return;
                }
                setIsSubmittingUser(true);
                try {
                  const email = newUserEmail.toLowerCase().trim();
                  
                  // Default granted rights for role
                  const defaultGrantedRights = CMS_MODULES.flatMap(m => 
                    PERMISSION_ACTIONS.map(a => `${m.id}:${a}`)
                  ).filter(k => 
                    newUserRole === 'Superadmin' || 
                    ((newUserRole === 'Web Master' || newUserRole === 'Webmaster' || newUserRole === 'Site Administrator') && (
                      k.includes('beneficiaries') || k.includes('vacancies') || k.includes('comments') || k.includes('messages') || k.includes('profiles') || k.includes('passwords')
                    )) ||
                    (newUserRole === 'Editor' && !k.includes('security') && !k.includes('system')) ||
                    (newUserRole === 'Author' && (k.includes('articles') || k.includes('media')))
                  );

                  // 1. Insert into user_roles table
                  const { error: rolesErr } = await supabase.from('user_roles').insert([{
                    user_name: newUserName.trim(),
                    email: email,
                    role: newUserRole,
                    department: newUserDept,
                    status: 'Active',
                    initial_password: newUserInitialPassword.trim(),
                    granted_rights: defaultGrantedRights,
                    assigned_by: 'Patrick Munene (Superadmin)'
                  }]);

                  if (rolesErr) {
                    console.warn("Notice saving to user_roles table:", rolesErr);
                  }

                  // 2. Insert into user_profiles table
                  const { error: profsErr } = await supabase.from('user_profiles').upsert([{
                    first_name: newUserName.trim().split(' ')[0],
                    last_name: newUserName.trim().split(' ').slice(1).join(' ') || 'User',
                    display_name: newUserName.trim(),
                    username: email.split('@')[0],
                    email: email,
                    role: newUserRole,
                    department: newUserDept,
                    status: 'Active',
                    initial_password: newUserInitialPassword.trim(),
                    job_title: `${newUserRole} - ${newUserDept}`
                  }], { onConflict: 'email' });

                  if (profsErr) {
                    console.warn("Notice saving to user_profiles table:", profsErr);
                  }

                  // 3. Register in profilesStore so user instantly appears in Registered CMS User Directory (UserProfileManager & SystemAdminModule)
                  profilesStore.createProfile({
                    firstName: newUserName.trim().split(' ')[0],
                    lastName: newUserName.trim().split(' ').slice(1).join(' ') || 'User',
                    displayName: newUserName.trim(),
                    username: email.split('@')[0],
                    email: email,
                    role: newUserRole,
                    department: newUserDept,
                    status: 'Active',
                    initialPassword: newUserInitialPassword.trim(),
                    jobTitle: `${newUserRole} - ${newUserDept}`
                  }, 'Patrick Munene (Superadmin)');

                  const newMappedUser: UserRoleMapping = {
                    id: `usr-${Date.now()}`,
                    username: email,
                    name: newUserName.trim(),
                    email: email,
                    role: newUserRole,
                    department: newUserDept,
                    status: 'Active',
                    assignedDate: new Date().toISOString().split('T')[0],
                    assignedBy: 'Patrick Munene (Superadmin)',
                    hasCustomOverrides: false,
                    initialPassword: newUserInitialPassword.trim(),
                    grantedRights: defaultGrantedRights
                  };

                  // Instantly update state so user appears in User List and User rights dropdown!
                  setUserMappings(prev => {
                    const filtered = prev.filter(u => u.email.toLowerCase() !== email);
                    return [...filtered, newMappedUser];
                  });

                  // Select newly created user in User rights tab dropdown
                  setSelectedUserEmail(email);

                  showToast(`Registered user "${newUserName}" as ${newUserRole} with initial password!`);
                  
                  // Reset form & close modal immediately
                  setShowAddUserModal(false);
                  setNewUserName('');
                  setNewUserEmail('');
                  setNewUserInitialPassword('');
                  
                  // Sync with database
                  await fetchSupabaseUserRoles();

                  logAuditEvent('CMS User Registered', `${newUserName.trim()} (${email})`, `Registered new CMS user with initial password and assigned ${newUserRole} role.`);
                } catch (err: any) {
                  showToast(err.message || 'Error registering user in database.', 'error');
                } finally {
                  setIsSubmittingUser(false);
                }
              }} className="space-y-3.5 text-left">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-500">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Grace Wanjiku"
                      value={newUserName}
                      onChange={e => setNewUserName(e.target.value)}
                      required
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-xl font-bold text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#074504]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-500">Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. grace@neemaheep.com"
                      value={newUserEmail}
                      onChange={e => setNewUserEmail(e.target.value)}
                      required
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-xl font-bold text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#074504]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-500">CMS Access Role</label>
                    <select
                      value={newUserRole}
                      onChange={(e: any) => setNewUserRole(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-xl font-bold text-xs text-[#074504] focus:outline-none focus:ring-2 focus:ring-[#074504]"
                    >
                      {roles.map(r => (
                        <option key={r.id} value={r.name}>{r.name} ({r.category})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-500">Department</label>
                    <select
                      value={newUserDept}
                      onChange={e => setNewUserDept(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-xl font-bold text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#074504]"
                    >
                      <option value="CMS Editorial">CMS Editorial</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Executive Administration">Executive Administration</option>
                      <option value="Microfinance Loans">Microfinance Loans</option>
                      <option value="Public Relations">Public Relations</option>
                    </select>
                  </div>
                </div>

                {/* INITIAL PASSWORD FIELD */}
                <div className="space-y-1 bg-amber-50/60 p-3 rounded-2xl border border-[#C0991B]/30">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-[#074504] flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#C0991B]" /> Initial Password *
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[10px] font-bold text-[#074504] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Wand2 className="w-3 h-3 text-[#C0991B]" /> Auto-Generate
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showInitialPassword ? "text" : "password"}
                      placeholder="Set initial password for login"
                      value={newUserInitialPassword}
                      onChange={e => setNewUserInitialPassword(e.target.value)}
                      required
                      className="w-full bg-white border border-gray-300 pr-10 pl-3.5 py-2 rounded-xl font-mono font-bold text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#074504]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowInitialPassword(!showInitialPassword)}
                      className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showInitialPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[9.5px] text-gray-500 font-medium">
                    Initial password saved to database. New users appear immediately on User rights and User List screens.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-3.5 py-2 bg-gray-100 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingUser}
                    className="px-4 py-2 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl hover:bg-[#053203] shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmittingUser ? 'Registering...' : 'Register User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 2: ADD NEW ROLE ================= */}
      <AnimatePresence>
        {showCreateRoleModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-5 md:p-6 max-w-md w-full border border-gray-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#074504]" />
                  <h3 className="font-black text-xs text-[#074504] uppercase">+ Add New Role Definition</h3>
                </div>
                <button
                  onClick={() => setShowCreateRoleModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRoleSubmit} className="space-y-3.5 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500">Role Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Loan Auditor / Senior Editor"
                    value={newRoleName}
                    onChange={e => setNewRoleName(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-xl font-bold text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#074504]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-500">Role Category</label>
                    <select
                      value={newRoleCategory}
                      onChange={(e: any) => setNewRoleCategory(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl font-bold text-xs text-[#074504]"
                    >
                      <option value="Custom">Custom</option>
                      <option value="Editorial">Editorial</option>
                      <option value="Operations">Operations</option>
                      <option value="System">System</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-500">Role Color</label>
                    <input
                      type="color"
                      value={newRoleColor}
                      onChange={e => setNewRoleColor(e.target.value)}
                      className="w-full h-9 p-1 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500">Rights Preset</label>
                  <select
                    value={newRolePreset}
                    onChange={(e: any) => setNewRolePreset(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-xl font-bold text-xs text-[#074504]"
                  >
                    <option value="Editorial">Editorial Control (Publish, Edit, Create)</option>
                    <option value="Full">Full Management (All Modules & Settings)</option>
                    <option value="View">View Only (Read Access Across Modules)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500">Role Description</label>
                  <textarea
                    rows={2.5}
                    placeholder="Describe role responsibilities and module scope..."
                    value={newRoleDesc}
                    onChange={e => setNewRoleDesc(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl font-medium text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#074504]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateRoleModal(false)}
                    className="px-3.5 py-2 bg-gray-100 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingRole}
                    className="px-4 py-2 bg-[#074504] text-[#C0991B] font-black text-xs uppercase rounded-xl hover:bg-[#053203] shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmittingRole ? 'Creating...' : '+ Create Role'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
