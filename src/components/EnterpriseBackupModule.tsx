import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  HardDrive,
  Cloud,
  CloudDownload,
  CloudUpload,
  RefreshCw,
  Clock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  Square,
  Trash2,
  Download,
  Upload,
  Search,
  Filter,
  Sliders,
  Settings,
  FileText,
  FileSpreadsheet,
  Server,
  Lock,
  Unlock,
  Key,
  Cpu,
  Plus,
  Minus,
  Eye,
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
  Folder,
  FolderArchive,
  FileCode,
  Terminal,
  Send,
  Bell,
  Mail,
  Phone,
  BarChart3,
  PieChart,
  Activity,
  Gauge,
  LifeBuoy,
  RotateCcw,
  Check,
  X,
  Radio,
  FileCheck,
  Globe,
  Wifi,
  History,
  Archive,
  AlertOctagon,
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { blogStore } from '../lib/blogStore';

export type BackupSubTab =
  | 'dashboard'
  | 'jobs'
  | 'manual'
  | 'cloud'
  | 'repository'
  | 'restore'
  | 'timeline'
  | 'reports';

export type BackupType = 'Full' | 'Database' | 'Files' | 'Media' | 'Themes' | 'Plugins' | 'Configuration';
export type StorageDestination = 'Google Drive' | 'Supabase';
export type BackupStatus = 'Completed' | 'In Progress' | 'Failed' | 'Queued' | 'Verifying' | 'Archived';

export interface BackupItem {
  id: string;
  name: string;
  type: BackupType;
  sizeMB: number;
  createdAt: string;
  destination: StorageDestination;
  status: BackupStatus;
  encryption: 'AES-256' | 'GZIP-Encrypted' | 'None';
  validationStatus: 'Passed' | 'Warning' | 'Pending' | 'Failed';
  expiryDate: string;
  tags: string[];
  description: string;
  fileCount: number;
  dbTablesCount?: number;
  checksum: string;
}

export interface BackupJob {
  id: string;
  name: string;
  type: BackupType;
  triggerSource: 'Scheduled' | 'Manual' | 'Pre-Update Trigger' | 'System Auto';
  status: 'Running' | 'Completed' | 'Failed' | 'Queued';
  progress: number; // 0 to 100
  startedAt: string;
  durationSec: number;
  destination: StorageDestination;
  priority: 'Low' | 'Normal' | 'High' | 'Critical';
  logs: string[];
}

export interface ScheduleRule {
  id: string;
  title: string;
  type: BackupType;
  frequency: 'Hourly' | 'Every 6 Hours' | 'Every 12 Hours' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Custom Cron';
  cronExpression?: string;
  enabled: boolean;
  destination: StorageDestination;
  nextRun: string;
  timeZone: string;
  businessHoursOnly: boolean;
  offPeakOnly: boolean;
  retentionDays: number;
}

export interface EnterpriseBackupModuleProps {
  userRole?: string;
  userName?: string;
  className?: string;
}

export const EnterpriseBackupModule: React.FC<EnterpriseBackupModuleProps> = ({
  userRole = 'Administrator',
  userName = 'Site Administrator',
  className = ''
}) => {
  const isSiteAdmin = userRole.toLowerCase().includes('admin') || userRole.toLowerCase().includes('webmaster') || userRole.toLowerCase().includes('super');

  // Sub-navigation tab
  const [activeTab, setActiveTab] = useState<BackupSubTab>('cloud');

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Mock Repositories
  const [backups, setBackups] = useState<BackupItem[]>([
    {
      id: 'bk-8902',
      name: 'Neema_CMS_Full_Snapshot_2026-08-04',
      type: 'Full',
      sizeMB: 482.5,
      createdAt: '2026-08-04 01:15:00',
      destination: 'Google Drive',
      status: 'Completed',
      encryption: 'AES-256',
      validationStatus: 'Passed',
      expiryDate: '2026-09-04',
      tags: ['#daily-auto', '#full-backup', '#production'],
      description: 'Automated full system snapshot including SQL DB, Media Uploads, Themes, and Config.',
      fileCount: 4210,
      dbTablesCount: 18,
      checksum: 'sha256-a8f3b2c9e1d0411a7f'
    },
    {
      id: 'bk-8899',
      name: 'SQL_CoreDatabase_Dump_2026-08-03',
      type: 'Database',
      sizeMB: 34.2,
      createdAt: '2026-08-03 18:00:00',
      destination: 'Supabase',
      status: 'Completed',
      encryption: 'AES-256',
      validationStatus: 'Passed',
      expiryDate: '2026-11-03',
      tags: ['#database-only', '#hourly-sync'],
      description: 'Standalone SQL relational dump covering articles, beneficiaries, users, and comments.',
      fileCount: 1,
      dbTablesCount: 18,
      checksum: 'sha256-f9d2e1c0b3a451'
    },
    {
      id: 'bk-8894',
      name: 'Media_Library_Assets_2026-08-02',
      type: 'Media',
      sizeMB: 320.1,
      createdAt: '2026-08-02 03:30:00',
      destination: 'Google Drive',
      status: 'Completed',
      encryption: 'GZIP-Encrypted',
      validationStatus: 'Passed',
      expiryDate: '2026-09-02',
      tags: ['#media-assets', '#weekly'],
      description: 'Compressed archive of media uploads, avatars, banner images, and PDF attachments.',
      fileCount: 3890,
      checksum: 'sha256-99c0d1e2f3a4'
    },
    {
      id: 'bk-8888',
      name: 'PreUpdate_CMSCore_v4.2.1',
      type: 'Configuration',
      sizeMB: 12.8,
      createdAt: '2026-08-01 12:00:00',
      destination: 'Supabase',
      status: 'Completed',
      encryption: 'AES-256',
      validationStatus: 'Passed',
      expiryDate: '2026-12-01',
      tags: ['#pre-update', '#cms-patch'],
      description: 'Automatic pre-update backup snapshot before CMS Core patch v4.2.1.',
      fileCount: 145,
      checksum: 'sha256-112233445566'
    },
    {
      id: 'bk-8870',
      name: 'Themes_And_Plugins_Bundle',
      type: 'Themes',
      sizeMB: 88.4,
      createdAt: '2026-07-28 00:00:00',
      destination: 'Google Drive',
      status: 'Archived',
      encryption: 'AES-256',
      validationStatus: 'Warning',
      expiryDate: '2026-10-28',
      tags: ['#custom-theme', '#plugins'],
      description: 'Theme assets, Tailwind CSS configurations, and active plugins.',
      fileCount: 650,
      checksum: 'sha256-778899aabbcc'
    }
  ]);

  // Active Jobs State
  const [activeJobs, setActiveJobs] = useState<BackupJob[]>([
    {
      id: 'job-901',
      name: 'Automated Hourly DB Sync',
      type: 'Database',
      triggerSource: 'Scheduled',
      status: 'Running',
      progress: 68,
      startedAt: '2026-08-04 01:30:00',
      durationSec: 42,
      destination: 'Supabase',
      priority: 'High',
      logs: [
        '01:30:00 - Initializing database lock...',
        '01:30:05 - Exporting SQL schema & 18 data tables...',
        '01:30:20 - Compressing dump with AES-256 Gzip...',
        '01:30:35 - Streaming chunk 3/5 to Supabase Storage bucket neema-backups-vault...'
      ]
    },
    {
      id: 'job-902',
      name: 'Pre-Update Module Trigger Backup',
      type: 'Full',
      triggerSource: 'Pre-Update Trigger',
      status: 'Queued',
      progress: 0,
      startedAt: '2026-08-04 01:32:00',
      durationSec: 0,
      destination: 'Google Drive',
      priority: 'Critical',
      logs: ['Waiting for active database job completion...']
    }
  ]);

  // Schedules State
  const [schedules, setSchedules] = useState<ScheduleRule[]>([
    {
      id: 'sch-101',
      title: 'Daily Full System Snapshot',
      type: 'Full',
      frequency: 'Daily',
      enabled: true,
      destination: 'Google Drive',
      nextRun: '2026-08-05 02:00:00',
      timeZone: 'UTC',
      businessHoursOnly: false,
      offPeakOnly: true,
      retentionDays: 30
    },
    {
      id: 'sch-102',
      title: 'Hourly SQL DB Backup',
      type: 'Database',
      frequency: 'Hourly',
      enabled: true,
      destination: 'Supabase',
      nextRun: '2026-08-04 02:00:00',
      timeZone: 'UTC',
      businessHoursOnly: false,
      offPeakOnly: false,
      retentionDays: 14
    },
    {
      id: 'sch-103',
      title: 'Weekly Media & Files Sync',
      type: 'Media',
      frequency: 'Weekly',
      enabled: true,
      destination: 'Google Drive',
      nextRun: '2026-08-10 03:00:00',
      timeZone: 'EAT (UTC+3)',
      businessHoursOnly: false,
      offPeakOnly: true,
      retentionDays: 60
    }
  ]);

  // Pre-Update Triggers State
  const [preUpdateTriggers, setPreUpdateTriggers] = useState({
    cmsCoreUpdates: true,
    themeUpdates: true,
    pluginUpdates: true,
    moduleUpdates: true,
    systemConfigChanges: true
  });

  // Cloud Destinations Configuration (Google Drive, Supabase, and Cloudinary)
  const [cloudProviders, setCloudProviders] = useState([
    { id: 'gdrive', name: 'Google Drive Vault', providerType: 'Google Drive', connected: true, account: 'backups@neema-heep.org', storageUsedGB: 18.4, isDefault: true, folderId: '1B2c3D4e5F6g7H8i9J0k' },
    { id: 'supabase', name: 'Supabase Postgres & Storage Vault', providerType: 'Supabase', connected: true, account: 'https://neema-heep-backup.supabase.co', storageUsedGB: 12.8, isDefault: false, bucket: 'neema-backups-vault' },
    { id: 'cloudinary', name: 'Cloudinary Vault', providerType: 'Cloudinary', connected: true, account: 'cloudinary://neema-heep-backup', storageUsedGB: 45.2, isDefault: false, bucket: 'neema-heep-media-backup' }
  ]);

  // Code & API Injection State for AWS S3
  const [s3Injection, setS3Injection] = useState({
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: '••••••••••••••••••••••••••••••••',
    region: 'eu-west-2',
    bucketName: 'neema-heep-cold-vault-2026',
    customScriptCode: `// AWS S3 Glacier SDK Backup Hook
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
export async function uploadToAWSGlacier(stream, filename) {
  const client = new S3Client({ region: "eu-west-2" });
  return await client.send(new PutObjectCommand({
    Bucket: "neema-heep-cold-vault-2026",
    Key: filename,
    StorageClass: "GLACIER",
    Body: stream
  }));
}`
  });

  // Code & API Injection State for Google Drive
  const [gdriveInjection, setGdriveInjection] = useState({
    clientId: '784920192837-neemaheep.apps.googleusercontent.com',
    clientSecret: '••••••••••••••••••••••••••••••••',
    refreshToken: '1//04_gDrive_RefreshToken_NeemaVault_2026',
    folderId: '1B2c3D4e5F6g7H8i9J0k',
    customScriptCode: `// Google Drive API Custom Backup Injection Hook
export async function uploadToGoogleDrive(backupBuffer, metadata) {
  const drive = google.drive({ version: 'v3', auth });
  return await drive.files.create({
    requestBody: {
      name: metadata.filename,
      parents: [metadata.folderId || '1B2c3D4e5F6g7H8i9J0k']
    },
    media: { mimeType: 'application/gzip', body: backupBuffer }
  });
}`
  });

  // Code & API Injection State for Supabase
  const [supabaseInjection, setSupabaseInjection] = useState({
    projectUrl: 'https://neema-heep-backup.supabase.co',
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.neemaheep_service_role_key_2026',
    bucketName: 'neema-backups-vault',
    customScriptCode: `-- Supabase Vault Automated Database Snapshot Hook
CREATE OR REPLACE FUNCTION trigger_neema_backup_snapshot()
RETURNS jsonb LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO storage.objects (bucket_id, name, owner)
  VALUES ('neema-backups-vault', 'snapshot_' || NOW() || '.sql.gz', auth.uid());
  RETURN jsonb_build_object('status', 'success', 'timestamp', NOW());
END;
$$;`
  });

  // SFTP Settings Form
  const [sftpConfig, setSftpConfig] = useState({
    serverAddress: 'backup.neema-heep.org',
    port: '2222',
    username: 'neema_sftp_user',
    password: '••••••••••••',
    privateKey: '-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAABG...',
    remoteFolder: '/var/backups/neema_cms/',
    encryptionVerified: true
  });

  // Manual Backup Form State
  const [manualForm, setManualForm] = useState({
    name: `Neema_CMS_Manual_${new Date().toISOString().split('T')[0]}`,
    type: 'Full' as BackupType,
    description: 'Manual backup triggered by site administrator.',
    tags: '#manual, #audit',
    priority: 'Normal' as 'Low' | 'Normal' | 'High' | 'Critical',
    compressionLevel: 'Balanced AES-256' as string,
    destination: 'Google Drive' as StorageDestination,
    exclusions: {
      cache: true,
      logs: true,
      tempFiles: true,
      sessions: true,
      nodeModules: true,
      buildDirs: true,
      thumbnails: false,
      oldArchives: true
    },
    customFolders: '/var/cache/tmp, /tmp/downloads'
  });

  // Calculated estimated size
  const estimatedSizeMB = useMemo(() => {
    let base = 500;
    if (manualForm.type === 'Database') base = 35;
    if (manualForm.type === 'Files') base = 150;
    if (manualForm.type === 'Media') base = 320;
    if (manualForm.type === 'Themes') base = 40;
    if (manualForm.type === 'Plugins') base = 45;
    if (manualForm.type === 'Configuration') base = 10;

    let excludedSize = 0;
    if (manualForm.exclusions.cache) excludedSize += 120;
    if (manualForm.exclusions.logs) excludedSize += 45;
    if (manualForm.exclusions.tempFiles) excludedSize += 80;
    if (manualForm.exclusions.nodeModules) excludedSize += 210;

    return Math.max(5, base - (manualForm.type === 'Full' ? excludedSize : 10));
  }, [manualForm.type, manualForm.exclusions]);

  // Modal States
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedBackupForRestore, setSelectedBackupForRestore] = useState<BackupItem | null>(null);
  const [restoreConfirmationText, setRestoreConfirmationText] = useState('');
  const [restoreScope, setRestoreScope] = useState<'Full' | 'Database Only' | 'Files Only' | 'Configuration'>('Full');
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);

  // Search & Filter State in Repository
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterDestination, setFilterDestination] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Preview Backup Details Modal
  const [previewBackupItem, setPreviewBackupItem] = useState<BackupItem | null>(null);

  // Execution Modal for Manual Backup
  const [isExecutingBackup, setIsExecutingBackup] = useState(false);
  const [backupExecutionProgress, setBackupExecutionProgress] = useState(0);

  // Validation Test Suite State
  const [isValidating, setIsValidating] = useState(false);
  const [validationLogs, setValidationLogs] = useState<string[]>([]);

  // Retention Settings State
  const [retentionPolicy, setRetentionPolicy] = useState({
    maxBackups: 50,
    daysToRetain: 60,
    storageQuotaGB: 100,
    autoCleanup: true,
    archiveOlder: true,
    warnLowStorage: true,
    warningThresholdPercent: 85
  });

  // Filtered Backups for Repository
  const filteredBackups = useMemo(() => {
    return backups.filter(b => {
      const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            b.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'All' || b.type === filterType;
      const matchesDestination = filterDestination === 'All' || b.destination === filterDestination;
      const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
      return matchesSearch && matchesType && matchesDestination && matchesStatus;
    });
  }, [backups, searchQuery, filterType, filterDestination, filterStatus]);

  // Statistics
  const totalBackupsCount = backups.length;
  const totalStorageMB = backups.reduce((acc, curr) => acc + curr.sizeMB, 0);
  const storageUsedGB = (totalStorageMB / 1024).toFixed(2);
  const failedJobsCount = 0;
  const healthScore = 98;
  const recoveryReadinessScore = 100;

  // Handle Triggering Manual Backup Execution
  const handleRunManualBackup = () => {
    setIsExecutingBackup(true);
    setBackupExecutionProgress(10);

    const interval = setInterval(() => {
      setBackupExecutionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExecutingBackup(false);
          // Add new backup
          const newBk: BackupItem = {
            id: `bk-${Math.floor(1000 + Math.random() * 9000)}`,
            name: manualForm.name,
            type: manualForm.type,
            sizeMB: estimatedSizeMB,
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            destination: manualForm.destination,
            status: 'Completed',
            encryption: 'AES-256',
            validationStatus: 'Passed',
            expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            tags: manualForm.tags.split(',').map(t => t.trim()).filter(Boolean),
            description: manualForm.description,
            fileCount: manualForm.type === 'Database' ? 1 : 1240,
            dbTablesCount: 18,
            checksum: `sha256-${Math.random().toString(36).substring(2, 12)}`
          };
          setBackups(prevBk => [newBk, ...prevBk]);
          showToast(`Backup "${manualForm.name}" created and verified successfully!`);
          setActiveTab('repository');
          return 100;
        }
        return prev + 22;
      });
    }, 400);
  };

  // Handle Restore Action
  const handleInitiateRestore = (backup: BackupItem) => {
    setSelectedBackupForRestore(backup);
    setRestoreConfirmationText('');
    setRestoreProgress(0);
    setShowRestoreModal(true);
  };

  const handleExecuteRestore = () => {
    if (restoreConfirmationText !== 'CONFIRM RESTORE') {
      showToast('Please type "CONFIRM RESTORE" to safety verify the action.');
      return;
    }
    setIsRestoring(true);
    setRestoreProgress(15);

    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRestoring(false);
          setShowRestoreModal(false);
          showToast(`System successfully restored to backup point: ${selectedBackupForRestore?.name}`);
          return 100;
        }
        return prev + 25;
      });
    }, 500);
  };

  // Handle Delete Backup
  const handleDeleteBackup = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete backup "${name}"?`)) {
      setBackups(prev => prev.filter(b => b.id !== id));
      showToast(`Backup "${name}" permanently purged from repository.`);
    }
  };

  // Handle Validation Suite Run
  const handleRunValidationSuite = () => {
    setIsValidating(true);
    setValidationLogs([
      '01:32:00 - Starting automated file checksum audit...',
      '01:32:01 - Validating SQL schema DDL integrity and table relational references...',
      '01:32:02 - Verifying AES-256 decryption keys and compressed stream headers...',
      '01:32:03 - Testing cloud storage retrieval on Amazon S3 and Google Drive endpoints...'
    ]);

    setTimeout(() => {
      setValidationLogs(prev => [
        ...prev,
        '01:32:04 - Checksum SHA-256 match 100% verified across 5 backup packages.',
        '01:32:05 - VALIDATION PASSED: All backups are 100% intact and ready for emergency recovery.'
      ]);
      setIsValidating(false);
      showToast('Backup Validation Suite completed: 100% Health Check Passed!');
    }, 2500);
  };

  // Handle Export Backup JSON file from store
  const handleDownloadStoreJSON = () => {
    const jsonStr = blogStore.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neema_cms_database_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Downloaded full CMS database snapshot (JSON format)');
  };

  // If user is NOT Site Administrator
  if (!isSiteAdmin) {
    return (
      <div className={`p-8 bg-amber-50 rounded-2xl border-2 border-[#C0991B] max-w-2xl mx-auto my-12 text-center space-y-4 shadow-md ${className}`}>
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-[#C0991B] shadow-inner">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-amber-900 uppercase tracking-tight">
          Site Administrator Access Restricted
        </h2>
        <p className="text-xs text-amber-800 font-medium leading-relaxed">
          The Enterprise Backup &amp; Disaster Recovery Command Center is strictly protected under Site Administrator privilege (RBAC Level 1). You are currently logged in with role: <strong className="uppercase font-black text-[#074504]">{userRole}</strong>.
        </p>
        <div className="pt-2">
          <span className="px-3 py-1 bg-[#074504] text-[#C0991B] text-[10px] font-black uppercase rounded-full border border-[#C0991B]/40">
            Contact Super Administrator for Permission Request
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* 1. MODULE HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#074504] text-white rounded-2xl border border-[#C0991B]/30 shadow-lg p-6 md:p-8 space-y-4">
        {/* Title & Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
            <Database className="w-7 h-7 text-[#C0991B] shrink-0" />
            <span>BACKUP MODULE</span>
          </h2>
        </div>

        {/* Description Text */}
        <p className="text-xs md:text-sm text-gray-200 font-medium leading-relaxed max-w-4xl">
          Automated incremental &amp; full site backup engine, Google Drive &amp; cloud vault synchronization, 1-click website restoration, pre-update triggers, and cryptographic checksum validation.
        </p>

        {/* Header Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className="px-4 py-2.5 bg-[#C0991B] hover:bg-[#a88414] text-[#074504] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Create Manual Backup
            </button>
            <button
              type="button"
              onClick={handleDownloadStoreJSON}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#C0991B]" /> Export SQL/JSON Dump
            </button>
          </div>

          <div className="text-xs font-semibold text-gray-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C0991B]" />
            <span>Next Auto Backup: <strong className="text-white">Today at 02:00 UTC</strong></span>
          </div>
        </div>

        {/* SUBMODULE NAVIGATION TABS */}
        <div className="pt-3 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1">
          {[
            { id: 'dashboard', label: 'Overview', icon: Gauge },
            { id: 'manual', label: 'Manual Backup', icon: Plus },
            { id: 'cloud', label: 'Cloud Storage', icon: Cloud },
            { id: 'restore', label: 'Restore', icon: RotateCcw, badge: backups.length }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as BackupSubTab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#C0991B] text-[#074504] shadow-md scale-[1.02]'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-[#074504]' : 'text-[#C0991B]'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-full ${
                    isActive ? 'bg-[#074504] text-white' : 'bg-[#C0991B] text-[#074504]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TOAST NOTIFICATION BANNER */}
      {toastMessage && (
        <div className="p-4 bg-[#074504] text-white rounded-xl border border-[#C0991B] shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#C0991B]" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-gray-300 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= SUBMODULE 1: DASHBOARD OVERVIEW ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* KPI CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* KPI 1 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Backup Health</span>
                <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg"><ShieldCheck className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl font-black text-[#074504]">{healthScore}%</div>
              <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> System Vault Fully Protected
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${healthScore}%` }} />
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Total Backups</span>
                <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg"><Archive className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl font-black text-gray-900">{totalBackupsCount} Snapshots</div>
              <div className="text-[11px] font-bold text-gray-500">
                5 Local • 3 Cloud Offsite
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Storage Used</span>
                <span className="p-1.5 bg-amber-50 text-[#826507] rounded-lg"><HardDrive className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl font-black text-[#074504]">{storageUsedGB} GB</div>
              <div className="text-[11px] font-bold text-gray-500">
                Quota: {retentionPolicy.storageQuotaGB} GB ({((parseFloat(storageUsedGB) / retentionPolicy.storageQuotaGB) * 100).toFixed(1)}%)
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Recovery Readiness</span>
                <span className="p-1.5 bg-purple-50 text-purple-700 rounded-lg"><Gauge className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl font-black text-purple-900">{recoveryReadinessScore}% Ready</div>
              <div className="text-[11px] font-bold text-purple-700">
                Estimated RTO: &lt; 3 mins
              </div>
            </div>

            {/* KPI 5 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Failed Jobs</span>
                <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg"><CheckCircle2 className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl font-black text-emerald-700">0 Errors</div>
              <div className="text-[11px] font-bold text-emerald-600">
                100% Success Rate
              </div>
            </div>

          </div>

          {/* ENTERPRISE STORAGE EFFICIENCY & STRATEGY PANEL */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Storage Strategy Panel */}
            <div className="lg:col-span-2 bg-gradient-to-br from-emerald-950 via-[#074504] to-emerald-900 text-white p-6 rounded-2xl border border-[#C0991B]/40 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#C0991B]" />
                  <h3 className="font-black text-sm uppercase tracking-wider text-white">
                    Enterprise Storage Efficiency &amp; Strategy Panel
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 bg-[#C0991B] text-[#074504] text-[9px] font-black rounded-full uppercase">
                  Vault Strategy
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-white">AES-256 Gzip Compression &amp; Checksum Verification</h4>
                    <p className="text-[11px] text-gray-200 mt-0.5">
                      Relational SQL dumps and media archives are compressed using Gzip streams (42% storage reduction) with SHA-256 verification before vaulting.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-start gap-3">
                  <Cloud className="w-5 h-5 text-[#C0991B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-white">Dual Offsite Cloud Vault Synchronization</h4>
                    <p className="text-[11px] text-gray-200 mt-0.5">
                      Backups mirror seamlessly across Google Drive and encrypted cloud storage vaults to guarantee high availability and redundant access.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-white">Pre-Update Snapshot Safety Hooks</h4>
                    <p className="text-[11px] text-gray-200 mt-0.5">
                      System automatically creates full snapshot restore points prior to core CMS updates, theme edits, or role permission modifications.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cloud Storage Quick Status */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="font-black text-xs text-[#074504] uppercase flex items-center justify-between">
                <span>Cloud Vault Status</span>
                <Cloud className="w-4 h-4 text-[#C0991B]" />
              </h3>

              <div className="space-y-3">
                {cloudProviders.map(cp => (
                  <div key={cp.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${cp.connected ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                      <span className="font-bold text-gray-800">{cp.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-gray-500">
                      {cp.connected ? `${cp.storageUsedGB} GB` : 'Offline'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RECENT BACKUP ACTIVITY FEED */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                <History className="w-4 h-4 text-[#C0991B]" /> Recent System Backup Activity
              </h3>
              <button 
                onClick={() => setActiveTab('timeline')}
                className="text-xs font-black text-[#074504] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Full Timeline <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {backups.slice(0, 4).map(bk => (
                <div key={bk.id} className="p-4 bg-gray-50 hover:bg-gray-100/80 rounded-xl border border-gray-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#074504]/10 text-[#074504] flex items-center justify-center font-bold shrink-0">
                      <Database className="w-5 h-5 text-[#C0991B]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-gray-900">{bk.name}</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-md uppercase">
                          {bk.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                        Created at {bk.createdAt} • Size: {bk.sizeMB} MB • Vault: {bk.destination}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => handleInitiateRestore(bk)}
                      className="px-3 py-1.5 bg-[#074504] hover:bg-[#053203] text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <RotateCcw className="w-3 h-3 text-[#C0991B]" /> Restore
                    </button>
                    <button
                      onClick={() => setPreviewBackupItem(bk)}
                      className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}



      {/* ================= SUBMODULE 3: MANUAL BACKUP ================= */}
      {activeTab === 'manual' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-black text-base text-[#074504] uppercase flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#C0991B]" /> Create On-Demand Manual Backup
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Configure standalone snapshots with customized file exclusions, encryption levels, and target vault destinations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form Controls */}
              <div className="lg:col-span-2 space-y-5">
                
                {/* 1. Backup Name & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Backup Name</label>
                    <input
                      type="text"
                      value={manualForm.name}
                      onChange={e => setManualForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#074504]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Backup Scope Component</label>
                    <select
                      value={manualForm.type}
                      onChange={e => setManualForm(p => ({ ...p, type: e.target.value as BackupType }))}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#074504] cursor-pointer"
                    >
                      <option value="Full">Full Website &amp; Database</option>
                      <option value="Database">SQL Database Dump Only</option>
                      <option value="Files">Core Code &amp; System Files</option>
                      <option value="Media">Media Uploads &amp; Attachments</option>
                      <option value="Themes">Themes &amp; Styling Assets</option>
                      <option value="Plugins">Active Extensions &amp; Modules</option>
                      <option value="Configuration">System Settings &amp; Rules</option>
                    </select>
                  </div>
                </div>

                {/* 2. Destination & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Storage Destination</label>
                    <select
                      value={manualForm.destination}
                      onChange={e => setManualForm(p => ({ ...p, destination: e.target.value as StorageDestination }))}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#074504] cursor-pointer"
                    >
                      <option value="Amazon S3">Amazon S3 Vault</option>
                      <option value="Google Drive">Google Drive</option>
                      <option value="SFTP Remote">SFTP Remote Server</option>
                      <option value="Local Storage">Local Server Storage</option>
                      <option value="Dropbox">Dropbox Enterprise</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-gray-700">Execution Priority</label>
                    <select
                      value={manualForm.priority}
                      onChange={e => setManualForm(p => ({ ...p, priority: e.target.value as any }))}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#074504] cursor-pointer"
                    >
                      <option value="Low">Low (Background Task)</option>
                      <option value="Normal">Normal Priority</option>
                      <option value="High">High Priority</option>
                      <option value="Critical">Critical Immediate</option>
                    </select>
                  </div>
                </div>

                {/* Selective Exclusions Checkboxes */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <h4 className="text-xs font-black uppercase text-[#074504] flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#C0991B]" /> Selective Folder Exclusions (Space Optimization)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-gray-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={manualForm.exclusions.cache}
                        onChange={e => setManualForm(p => ({ ...p, exclusions: { ...p.exclusions, cache: e.target.checked } }))}
                        className="rounded text-[#074504] focus:ring-[#074504]"
                      />
                      <span>Exclude Cache</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={manualForm.exclusions.logs}
                        onChange={e => setManualForm(p => ({ ...p, exclusions: { ...p.exclusions, logs: e.target.checked } }))}
                        className="rounded text-[#074504] focus:ring-[#074504]"
                      />
                      <span>Exclude System Logs</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={manualForm.exclusions.tempFiles}
                        onChange={e => setManualForm(p => ({ ...p, exclusions: { ...p.exclusions, tempFiles: e.target.checked } }))}
                        className="rounded text-[#074504] focus:ring-[#074504]"
                      />
                      <span>Exclude Temp Files</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={manualForm.exclusions.nodeModules}
                        onChange={e => setManualForm(p => ({ ...p, exclusions: { ...p.exclusions, nodeModules: e.target.checked } }))}
                        className="rounded text-[#074504] focus:ring-[#074504]"
                      />
                      <span>Exclude node_modules</span>
                    </label>
                  </div>
                </div>

                {/* Description & Tags */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-700">Notes &amp; Description</label>
                  <input
                    type="text"
                    value={manualForm.description}
                    onChange={e => setManualForm(p => ({ ...p, description: e.target.value }))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#074504]"
                  />
                </div>

              </div>

              {/* Execution Summary Box */}
              <div className="bg-[#074504] text-white p-6 rounded-2xl border border-[#C0991B]/40 shadow-lg space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase text-[#C0991B] border-b border-white/10 pb-3 flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> Backup Size Calculation
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Estimated Package Size:</span>
                      <strong className="text-white text-base font-black">{estimatedSizeMB} MB</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Encryption Method:</span>
                      <strong className="text-emerald-400 font-mono">AES-256 Gzip</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Target Vault:</span>
                      <strong className="text-amber-300 font-bold">{manualForm.destination}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Verification Checksum:</span>
                      <strong className="text-emerald-400 font-mono">SHA-256 Auto</strong>
                    </div>
                  </div>
                </div>

                {isExecutingBackup ? (
                  <div className="space-y-2 p-4 bg-white/10 rounded-xl border border-white/20">
                    <div className="flex items-center justify-between text-xs font-black">
                      <span>Compressing &amp; Uploading...</span>
                      <span>{backupExecutionProgress}%</span>
                    </div>
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#C0991B] h-full rounded-full transition-all duration-300" style={{ width: `${backupExecutionProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleRunManualBackup}
                    className="w-full py-3.5 bg-[#C0991B] hover:bg-[#a88414] text-[#074504] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" /> Execute On-Demand Backup
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}



      {/* ================= SUBMODULE 5: CLOUD STORAGE ================= */}
      {activeTab === 'cloud' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Cloud Providers Grid */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-black text-base text-[#074504] uppercase flex items-center gap-2">
                <Cloud className="w-5 h-5 text-[#C0991B]" /> Cloud Storage Vault Integrations
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Off-site cloud storage targets for secondary and tertiary backup redundancy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cloudProviders.map(cp => (
                <div key={cp.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Cloud className="w-5 h-5 text-[#074504]" />
                        <h4 className="font-black text-sm text-gray-900">{cp.name}</h4>
                      </div>
                      {cp.isDefault && (
                        <span className="px-2.5 py-0.5 bg-[#C0991B] text-[#074504] text-[9px] font-black rounded-full uppercase">
                          Default Target
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-600 font-semibold space-y-1">
                      <div className="flex justify-between">
                        <span>Account/Bucket:</span>
                        <strong className="text-gray-900 font-mono text-[11px]">{cp.bucket || cp.account}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Vault Usage:</span>
                        <strong className="text-[#074504]">{cp.storageUsedGB} GB</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                    <button
                      onClick={() => {
                        showToast(`Connection test passed for ${cp.name}! Status: 200 OK`);
                      }}
                      className="px-3 py-1.5 bg-[#074504] hover:bg-[#053203] text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                    >
                      Test Connection
                    </button>
                    {!cp.isDefault && cp.connected && (
                      <button
                        onClick={() => {
                          setCloudProviders(prev => prev.map(x => ({ ...x, isDefault: x.id === cp.id })));
                          showToast(`${cp.name} set as default backup vault!`);
                        }}
                        className="text-xs font-bold text-[#074504] hover:underline cursor-pointer"
                      >
                        Set Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GOOGLE DRIVE, SUPABASE & AWS S3 CODE AND API INJECTION PANELS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* GOOGLE DRIVE API INJECTION PANEL */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-[#C0991B]" /> Google Drive API Injection
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-[#074504] text-[9px] font-black rounded-full uppercase">
                  OAuth 2.0 Live
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-700">Client ID</label>
                  <input
                    type="text"
                    value={gdriveInjection.clientId}
                    onChange={e => setGdriveInjection(p => ({ ...p, clientId: e.target.value }))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:border-[#074504] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-700">Client Secret</label>
                    <input
                      type="password"
                      value={gdriveInjection.clientSecret}
                      onChange={e => setGdriveInjection(p => ({ ...p, clientSecret: e.target.value }))}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:border-[#074504] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-700">Target Folder ID</label>
                    <input
                      type="text"
                      value={gdriveInjection.folderId}
                      onChange={e => setGdriveInjection(p => ({ ...p, folderId: e.target.value }))}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:border-[#074504] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-700 flex items-center justify-between">
                    <span>Google Drive Script</span>
                    <span className="text-[9px] text-[#074504] font-bold">Node SDK</span>
                  </label>
                  <textarea
                    rows={4}
                    value={gdriveInjection.customScriptCode}
                    onChange={e => setGdriveInjection(p => ({ ...p, customScriptCode: e.target.value }))}
                    className="w-full p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] leading-relaxed rounded-xl border border-slate-700 focus:border-[#C0991B] outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    showToast('Google Drive API Credentials & Custom Code Injection Applied!');
                  }}
                  className="w-full py-2.5 bg-[#074504] hover:bg-[#053203] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4 text-[#C0991B]" /> Inject Google Drive Code
                </button>
              </div>
            </div>

            {/* SUPABASE STORAGE & DATABASE INJECTION PANEL */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#C0991B]" /> Supabase Storage Injection
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-[#074504] text-[9px] font-black rounded-full uppercase">
                  Relational Vault
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-700">Project URL</label>
                  <input
                    type="text"
                    value={supabaseInjection.projectUrl}
                    onChange={e => setSupabaseInjection(p => ({ ...p, projectUrl: e.target.value }))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:border-[#074504] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-700">Service Role Key</label>
                    <input
                      type="password"
                      value={supabaseInjection.apiKey}
                      onChange={e => setSupabaseInjection(p => ({ ...p, apiKey: e.target.value }))}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:border-[#074504] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-700">Storage Bucket</label>
                    <input
                      type="text"
                      value={supabaseInjection.bucketName}
                      onChange={e => setSupabaseInjection(p => ({ ...p, bucketName: e.target.value }))}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:border-[#074504] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-700 flex items-center justify-between">
                    <span>Supabase SQL Hook</span>
                    <span className="text-[9px] text-[#074504] font-bold">PL/pgSQL</span>
                  </label>
                  <textarea
                    rows={4}
                    value={supabaseInjection.customScriptCode}
                    onChange={e => setSupabaseInjection(p => ({ ...p, customScriptCode: e.target.value }))}
                    className="w-full p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] leading-relaxed rounded-xl border border-slate-700 focus:border-[#C0991B] outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    showToast('Supabase API & Custom SQL Injection Script Compiled Successfully!');
                  }}
                  className="w-full py-2.5 bg-[#074504] hover:bg-[#053203] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Terminal className="w-4 h-4 text-[#C0991B]" /> Inject Supabase Code
                </button>
              </div>
            </div>

            {/* CLOUDINARY STORAGE INJECTION PANEL */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#C0991B]" /> Cloudinary Vault Injection
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-[#074504] text-[9px] font-black rounded-full uppercase">
                  Media Vault
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-700">AWS Access Key ID</label>
                  <input
                    type="text"
                    value={s3Injection.accessKeyId}
                    onChange={e => setS3Injection(p => ({ ...p, accessKeyId: e.target.value }))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:border-[#074504] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-700">Secret Key</label>
                    <input
                      type="password"
                      value={s3Injection.secretAccessKey}
                      onChange={e => setS3Injection(p => ({ ...p, secretAccessKey: e.target.value }))}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:border-[#074504] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-700">Region &amp; Bucket</label>
                    <input
                      type="text"
                      value={s3Injection.bucketName}
                      onChange={e => setS3Injection(p => ({ ...p, bucketName: e.target.value }))}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:border-[#074504] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-700 flex items-center justify-between">
                    <span>AWS Glacier Hook</span>
                    <span className="text-[9px] text-[#074504] font-bold">AWS SDK v3</span>
                  </label>
                  <textarea
                    rows={4}
                    value={s3Injection.customScriptCode}
                    onChange={e => setS3Injection(p => ({ ...p, customScriptCode: e.target.value }))}
                    className="w-full p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] leading-relaxed rounded-xl border border-slate-700 focus:border-[#C0991B] outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    showToast('AWS S3 Glacier Credentials & SDK Hook Injected!');
                  }}
                  className="w-full py-2.5 bg-[#074504] hover:bg-[#053203] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#C0991B]" /> Inject AWS S3 Glacier Code
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ================= SUBMODULE 7: RESTORE (INCORPORATES REPOSITORY & ONE-CLICK RECOVERY) ================= */}
      {activeTab === 'restore' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* 1. Repository Snapshots Search & Filter Table */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="border-b border-gray-100 pb-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <FolderArchive className="w-4 h-4 text-[#C0991B]" /> Backup Snapshot Repository
                </h3>
                <p className="text-xs text-gray-500 font-medium">Search, filter, inspect and restore from archived snapshots</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="Full">Full</option>
                  <option value="Database">Database</option>
                  <option value="Media">Media</option>
                  <option value="Configuration">Configuration</option>
                </select>

                <select
                  value={filterDestination}
                  onChange={e => setFilterDestination(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer"
                >
                  <option value="All">All Storage</option>
                  <option value="Amazon S3">Amazon S3</option>
                  <option value="Google Drive">Google Drive</option>
                  <option value="SFTP Remote">SFTP Remote</option>
                  <option value="Local Storage">Local Storage</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search backups by name, tag, or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#074504]"
              />
            </div>

            {/* Backups Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] font-black uppercase text-gray-500">
                    <th className="p-3">Backup Snapshot</th>
                    <th className="p-3">Component Type</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Vault Location</th>
                    <th className="p-3">Checksum Check</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredBackups.map(bk => (
                    <tr key={bk.id} className="hover:bg-gray-50/80 transition-all">
                      <td className="p-3">
                        <div className="font-bold text-gray-900">{bk.name}</div>
                        <div className="text-[10px] text-gray-400">{bk.createdAt}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-md uppercase">
                          {bk.type}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-gray-700">{bk.sizeMB} MB</td>
                      <td className="p-3 font-semibold text-gray-700">{bk.destination}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Validated
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleInitiateRestore(bk)}
                            className="px-3 py-1.5 bg-[#074504] text-white text-[10px] font-bold uppercase rounded-lg hover:bg-[#053203] transition-all cursor-pointer shadow-2xs"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => setPreviewBackupItem(bk)}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBackup(bk.id, bk.name)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer"
                            title="Delete Snapshot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. One-Click Recovery Grid */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-black text-base text-[#074504] uppercase flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#C0991B]" /> One-Click Recovery &amp; Restoration
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Select a verified snapshot to execute complete system recovery, partial database restoration, or targeted media deployment.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {backups.map(bk => (
                <div key={bk.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#074504]">{bk.id}</span>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase">
                        {bk.validationStatus === 'Passed' ? '100% Ready' : 'Validation Required'}
                      </span>
                    </div>

                    <h4 className="font-black text-sm text-gray-900">{bk.name}</h4>
                    <p className="text-xs text-gray-600 font-medium">{bk.description}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-gray-500">{bk.sizeMB} MB</span>
                    <button
                      onClick={() => handleInitiateRestore(bk)}
                      className="px-4 py-2 bg-[#074504] hover:bg-[#053203] text-white font-bold text-xs uppercase rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#C0991B]" /> Initiate Restoration
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}



      {/* ================= RESTORE CONFIRMATION MODAL ================= */}
      {showRestoreModal && selectedBackupForRestore && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-red-600">
                <RotateCcw className="w-5 h-5" />
                <h3 className="font-black text-base uppercase">Confirm System Restoration</h3>
              </div>
              <button onClick={() => setShowRestoreModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-900 space-y-2">
              <strong className="block font-black uppercase">Warning: System Overwrite Action</strong>
              <p>
                You are about to restore <strong className="font-bold">{selectedBackupForRestore.name}</strong> created on {selectedBackupForRestore.createdAt}.
                This operation will overwrite current website state with the backup snapshot.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-700">Type &quot;CONFIRM RESTORE&quot; to authorize:</label>
              <input
                type="text"
                placeholder="CONFIRM RESTORE"
                value={restoreConfirmationText}
                onChange={e => setRestoreConfirmationText(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 uppercase"
              />
            </div>

            {isRestoring && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-black text-[#074504]">
                  <span>Restoring System Data...</span>
                  <span>{restoreProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#074504] h-full rounded-full transition-all duration-300" style={{ width: `${restoreProgress}%` }} />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRestore}
                disabled={restoreConfirmationText !== 'CONFIRM RESTORE' || isRestoring}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-40"
              >
                Execute Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PREVIEW BACKUP ITEM MODAL ================= */}
      {previewBackupItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-base text-[#074504] uppercase flex items-center gap-2">
                <Database className="w-5 h-5 text-[#C0991B]" /> Backup Snapshot Details
              </h3>
              <button onClick={() => setPreviewBackupItem(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Snapshot Name</span>
                <div className="font-black text-gray-900">{previewBackupItem.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Size</span>
                  <div className="font-bold text-gray-800">{previewBackupItem.sizeMB} MB</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Vault Location</span>
                  <div className="font-bold text-gray-800">{previewBackupItem.destination}</div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Checksum Hash</span>
                <div className="font-mono text-[11px] text-emerald-700 font-bold">{previewBackupItem.checksum}</div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setPreviewBackupItem(null)}
                className="px-5 py-2.5 bg-[#074504] text-white text-xs font-black uppercase rounded-xl cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
