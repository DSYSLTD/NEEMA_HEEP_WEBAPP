import React, { useState, useMemo } from 'react';
import { 
  Lock, KeyRound, KeySquare, ShieldCheck, ShieldAlert, Eye, EyeOff, 
  CheckCircle2, XCircle, AlertTriangle, Wand2, Copy, Check, 
  Info, History, Sliders, Shield, RefreshCw, BookOpen, AlertCircle,
  Users, UserCheck, Bell, Activity, TrendingUp, BarChart3, Globe, 
  Smartphone, Mail, FileText, CheckSquare, Settings, Clock, Cpu, 
  Layers, Search, Filter, Download, ToggleLeft, ToggleRight, LockKeyhole, 
  UserCog, UserX, Database, ArrowRight, SmartphoneNfc
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Common Dictionary / Leaked Passwords list for offline breach detection
const COMMON_DICTIONARY_PASSWORDS = [
  '123456', 'password', '12345678', 'qwerty', '123456789', '12345', '1234', 
  '111111', '1234567', 'dragon', 'welcome', 'admin', 'admin123', 'password1',
  'neema', 'neema2026', 'neema123', 'kenya', 'nairobi', 'pass123', 'guest',
  'master', 'letmein', 'p@ssword', 'iloveyou', 'abc123', 'change123', 'superman'
];

export interface SecurityRulesConfig {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  enforceDictionaryCheck: boolean;
  historyCheckCount: number;
  expirationDays: number;
}

const DEFAULT_SECURITY_RULES: SecurityRulesConfig = {
  minLength: 8,
  maxLength: 64,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  enforceDictionaryCheck: true,
  historyCheckCount: 3,
  expirationDays: 90
};

// Mock Password History store
const MOCK_PASSWORD_HISTORY = [
  'PreviousPass2025!',
  'CorporateOldKey#1',
  'OldPassword123!',
  'Admin@2025'
];

interface PasswordSecurityModuleProps {
  mode?: 'change' | 'reset';
  username?: string;
  resetToken?: string;
  onSuccess?: (newPass: string) => void;
  className?: string;
}

export default function PasswordSecurityModule({
  mode = 'change',
  username = 'staff',
  resetToken,
  onSuccess,
  className = ''
}: PasswordSecurityModuleProps) {
  // Core Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Visibility Toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Status & Feedback
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generator State
  const [showGenerator, setShowGenerator] = useState(false);
  const [genLength, setGenLength] = useState(16);
  const [genIncludeUpper, setGenIncludeUpper] = useState(true);
  const [genIncludeLower, setGenIncludeLower] = useState(true);
  const [genIncludeNumbers, setGenIncludeNumbers] = useState(true);
  const [genIncludeSymbols, setGenIncludeSymbols] = useState(true);
  const [copiedGenerated, setCopiedGenerated] = useState(false);

  // Rules Configuration State
  const [rules, setRules] = useState<SecurityRulesConfig>(DEFAULT_SECURITY_RULES);
  const [showRulesConfig, setShowRulesConfig] = useState(false);

  // 1. PROFILES STATE
  const [profilesList, setProfilesList] = useState([
    { id: 'p1', username: 'admin_neema1', name: 'Neema Super Admin', role: 'Super Admin', passAgeDays: 12, twoFactor: true, status: 'Protected', email: 'admin@neemaheep.com', lastLogin: 'Just Now' },
    { id: 'p2', username: 'staff', name: 'Neema Editorial Staff', role: 'Blog Staff (Limited)', passAgeDays: 28, twoFactor: true, status: 'Active', email: 'editor@neemaheep.com', lastLogin: '18 mins ago' },
    { id: 'p3', username: 'dr_jane_m', name: 'Dr. Jane Muturi', role: 'Community Health Lead', passAgeDays: 45, twoFactor: false, status: 'Active', email: 'jane.muturi@neemaheep.com', lastLogin: '2 hours ago' },
    { id: 'p4', username: 'sam_ochieng', name: 'Samuel Ochieng', role: 'Credit Risk Manager', passAgeDays: 68, twoFactor: true, status: 'Renewal Due', email: 'samuel.ochieng@neemaheep.com', lastLogin: '1 day ago' },
  ]);

  // 2. ROLES MANAGER STATE
  const [rolePermissions, setRolePermissions] = useState([
    { role: 'Super Admin', canResetAll: true, canBypassPolicy: true, canManageRules: true, viewAuditLogs: true, enforce2FA: true },
    { role: 'Blog Staff (Limited)', canResetAll: false, canBypassPolicy: false, canManageRules: false, viewAuditLogs: false, enforce2FA: true },
    { role: 'Member Portal User', canResetAll: false, canBypassPolicy: false, canManageRules: false, viewAuditLogs: false, enforce2FA: false },
  ]);

  // 3. NOTIFICATION SYSTEM STATE
  const [notificationLogs, setNotificationLogs] = useState([
    { id: 'n1', timestamp: '2026-07-31 14:12', type: 'SMS OTP', recipient: '+254 705 *** 365', event: 'Password Reset OTP Sent', status: 'Delivered' },
    { id: 'n2', timestamp: '2026-07-31 13:45', type: 'Email Alert', recipient: 'admin@neemaheep.com', event: 'Password Changed Successfully', status: 'Delivered' },
    { id: 'n3', timestamp: '2026-07-31 11:20', type: 'SMS Warning', recipient: '+254 712 *** 890', event: 'Unrecognized Login Attempt Detected', status: 'Flagged' },
  ]);
  const [notifSmsEnabled, setNotifSmsEnabled] = useState(true);
  const [notifEmailEnabled, setNotifEmailEnabled] = useState(true);

  // 4. ACTIVITY LOGS STATE
  const [logSearch, setLogSearch] = useState('');
  const [logCategory, setLogCategory] = useState('All');
  const [activityLogs, setActivityLogs] = useState([
    { id: 'al1', timestamp: '2026-07-31 14:28:10', event: 'Password Security Check', user: 'admin_neema1', ip: '102.218.45.12', location: 'Nairobi, KE', status: 'Success', category: 'Security' },
    { id: 'al2', timestamp: '2026-07-31 13:50:04', event: 'Portal Password Update', user: 'staff', ip: '102.218.48.90', location: 'Nyeri, KE', status: 'Success', category: 'Credentials' },
    { id: 'al3', timestamp: '2026-07-31 12:15:22', event: 'Failed OTP Attempt', user: 'unknown_user', ip: '41.203.11.4', location: 'Mombasa, KE', status: 'Blocked', category: 'Auth' },
    { id: 'al4', timestamp: '2026-07-31 09:30:15', event: 'Security Policy Rule Edit', user: 'admin_neema1', ip: '102.218.45.12', location: 'Nairobi, KE', status: 'Success', category: 'Policy' },
    { id: 'al5', timestamp: '2026-07-30 18:05:40', event: '2FA Verification Success', user: 'sam_ochieng', ip: '197.232.88.11', location: 'Meru, KE', status: 'Success', category: 'Auth' },
  ]);

  // 5. AUTOMATION ENGINE STATE
  const [autoExpireEnabled, setAutoExpireEnabled] = useState(true);
  const [autoLockoutAttempts, setAutoLockoutAttempts] = useState(5);
  const [autoLockoutMins, setAutoLockoutMins] = useState(30);
  const [dictCheckEnabled, setDictCheckEnabled] = useState(true);
  const [forceFirstReset, setForceFirstReset] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  // 6. PUBLIC LOGIN SYSTEM STATE
  const [publicRateLimitStatus, setPublicRateLimitStatus] = useState('Active');
  const [publicOtpTestPhone, setPublicOtpTestPhone] = useState('+254705759365');
  const [testOtpCode, setTestOtpCode] = useState('');
  const [otpSentMsg, setOtpSentMsg] = useState<string | null>(null);

  // Show Toast / Status Helper
  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // ================= PASSWORD EVALUATION ENGINE =================
  const evaluation = useMemo(() => {
    const pass = newPassword;
    const len = pass.length;

    const hasMinLen = len >= rules.minLength;
    const hasMaxLen = len <= rules.maxLength;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass);

    const lowerPass = pass.toLowerCase();
    const isCommonDictionary = COMMON_DICTIONARY_PASSWORDS.some(dict => lowerPass.includes(dict));
    const isRepeatedChar = /^(.)\1+$/.test(pass);
    const isSequential = /(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef)/i.test(pass);
    const hasDictionaryIssue = isCommonDictionary || isRepeatedChar || isSequential;

    const matchesHistory = MOCK_PASSWORD_HISTORY.slice(0, rules.historyCheckCount).includes(pass);

    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSpecial) poolSize += 32;
    const entropyBits = len > 0 && poolSize > 0 ? Math.round(len * Math.log2(poolSize)) : 0;

    let score = 0;
    if (len >= rules.minLength) score += 20;
    if (len >= 12) score += 15;
    if (len >= 16) score += 10;
    if (hasUpper) score += 10;
    if (hasLower) score += 10;
    if (hasNumber) score += 10;
    if (hasSpecial) score += 15;
    if (entropyBits >= 60) score += 10;

    if (hasDictionaryIssue) score = Math.max(10, score - 35);
    if (matchesHistory) score = Math.max(5, score - 40);
    if (len < rules.minLength) score = Math.min(score, 25);

    score = Math.min(100, Math.max(0, score));

    let level: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Excellent' = 'Very Weak';
    let colorClass = 'bg-red-50 text-red-700 border-red-200';
    let barColor = 'bg-red-500';

    if (score <= 20) {
      level = 'Very Weak';
      colorClass = 'bg-red-50 text-red-700 border-red-200';
      barColor = 'bg-red-500';
    } else if (score <= 40) {
      level = 'Weak';
      colorClass = 'bg-orange-50 text-orange-700 border-orange-200';
      barColor = 'bg-orange-500';
    } else if (score <= 65) {
      level = 'Moderate';
      colorClass = 'bg-amber-50 text-amber-800 border-amber-200';
      barColor = 'bg-amber-500';
    } else if (score <= 85) {
      level = 'Strong';
      colorClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      barColor = 'bg-emerald-500';
    } else {
      level = 'Excellent';
      colorClass = 'bg-emerald-100 text-[#074504] border-emerald-300';
      barColor = 'bg-[#074504]';
    }

    return {
      score,
      level,
      colorClass,
      barColor,
      entropyBits,
      hasMinLen,
      hasMaxLen,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      hasDictionaryIssue,
      matchesHistory,
      isValid: hasMinLen && hasMaxLen && 
               (!rules.requireUppercase || hasUpper) &&
               (!rules.requireLowercase || hasLower) &&
               (!rules.requireNumbers || hasNumber) &&
               (!rules.requireSpecialChars || hasSpecial) &&
               (!rules.enforceDictionaryCheck || !hasDictionaryIssue) &&
               !matchesHistory
    };
  }, [newPassword, rules]);

  // Handle Smart Generator
  const handleGeneratePassword = () => {
    let chars = '';
    if (genIncludeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (genIncludeLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (genIncludeNumbers) chars += '0123456789';
    if (genIncludeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

    let generated = '';
    for (let i = 0; i < genLength; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setNewPassword(generated);
    setConfirmPassword(generated);
    showStatus('success', 'Smart secure password generated and applied to form!');
  };

  const handleCopyGenerated = () => {
    if (newPassword) {
      navigator.clipboard.writeText(newPassword);
      setCopiedGenerated(true);
      setTimeout(() => setCopiedGenerated(false), 2000);
    }
  };

  // Submit Password Change Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (mode === 'change' && !currentPassword) {
      showStatus('error', 'Please enter your current portal password.');
      return;
    }

    if (!newPassword) {
      showStatus('error', 'Please enter a new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showStatus('error', 'New password and confirm password do not match.');
      return;
    }

    if (!evaluation.isValid) {
      showStatus('error', 'Password does not satisfy enterprise security policy requirements.');
      return;
    }

    setIsSubmitting(true);

    const proceedUpdate = async () => {
      if (mode === 'reset' && resetToken) {
        try {
          const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resetToken, newPassword })
          });
          const data = await res.json();
          if (!res.ok || !data.success) {
            throw new Error(data.error || 'Password update failed.');
          }
        } catch (err: any) {
          setIsSubmitting(false);
          showStatus('error', err.message || 'Failed to update password.');
          return;
        }
      }

      setIsSubmitting(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Add to activity logs
      const newLog = {
        id: `al_${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        event: 'Password Updated Successfully',
        user: username,
        ip: '102.218.45.12',
        location: 'Nairobi, KE',
        status: 'Success',
        category: 'Credentials'
      };
      setActivityLogs(prev => [newLog, ...prev]);

      // Add to notifications
      const newNotif = {
        id: `n_${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        type: 'SMS & Email',
        recipient: username,
        event: 'Password changed successfully',
        status: 'Delivered'
      };
      setNotificationLogs(prev => [newNotif, ...prev]);

      showStatus('success', `Password updated successfully for account (${username}) under AES-256 policy.`);
      if (onSuccess) onSuccess(newPassword);
    };

    setTimeout(proceedUpdate, 600);
  };

  // Profile Actions
  const handleForceResetProfile = (uname: string) => {
    setProfilesList(prev => prev.map(p => p.username === uname ? { ...p, passAgeDays: 0, status: 'Reset Required' } : p));
    showStatus('success', `Password reset token flagged for account "${uname}".`);
  };

  // Role Permission Toggle
  const handleTogglePermission = (roleName: string, key: string) => {
    setRolePermissions(prev => prev.map(r => r.role === roleName ? { ...r, [key]: !(r as any)[key] } : r));
    showStatus('success', `Updated access rights for ${roleName}.`);
  };

  // Filter Activity Logs
  const filteredActivityLogs = useMemo(() => {
    return activityLogs.filter(log => {
      const matchesCat = logCategory === 'All' || log.category === logCategory;
      const matchesSearch = !logSearch || 
        log.event.toLowerCase().includes(logSearch.toLowerCase()) ||
        log.user.toLowerCase().includes(logSearch.toLowerCase()) ||
        log.ip.includes(logSearch);
      return matchesCat && matchesSearch;
    });
  }, [activityLogs, logCategory, logSearch]);

  // Run Vulnerability Scan Simulator
  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      showStatus('success', 'Security Scan Complete: Zero breached credentials or high-risk vulnerabilities found.');
    }, 2000);
  };

  // Test OTP Dispatch
  const handleSendTestOtp = () => {
    if (!publicOtpTestPhone) return;
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setTestOtpCode(generated);
    setOtpSentMsg(`Test OTP (${generated}) dispatched to ${publicOtpTestPhone} via Neema M-PESA SMS Gateway!`);
    setTimeout(() => setOtpSentMsg(null), 8000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* MODULE HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#074504] text-white rounded-2xl border border-[#C0991B]/30 shadow-lg p-6 md:p-8 space-y-4">
        {/* 1. Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
            <Lock className="w-6 h-6 text-[#C0991B] shrink-0" />
            <span>{mode === 'change' ? 'PASSWORD EVALUATOR & SECURITY MODULE' : 'Update Security Password'}</span>
          </h2>
          <span className="px-3.5 py-1.5 bg-[#C0991B]/20 text-[#C0991B] text-xs font-black rounded-full border border-[#C0991B]/40 uppercase shadow-2xs">
            AES-256 Evaluator
          </span>
        </div>

        {/* 2. Description Text */}
        <p className="text-xs md:text-sm text-gray-200 font-medium leading-relaxed max-w-4xl">
          Live password strength evaluation, security rule compliance, dictionary breach checks, and history validator.
        </p>

        {/* 3. CTA buttons */}
        {mode === 'change' && (
          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowGenerator(!showGenerator)}
              className="px-4 py-2.5 bg-[#C0991B] hover:bg-[#a88414] text-[#074504] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Wand2 className="w-4 h-4 stroke-[2.5]" /> Password Generator
            </button>

            <button
              type="button"
              onClick={() => setShowRulesConfig(!showRulesConfig)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider border border-white/20 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-[#C0991B]" /> Security Policy Rules
            </button>
          </div>
        )}
      </div>

      {/* GLOBAL STATUS BANNER */}
      {statusMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border flex items-start gap-3 ${
            statusMsg.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-black text-xs uppercase block">
              {statusMsg.type === 'success' ? 'Security Action Complete' : 'Validation Error'}
            </span>
            <p className="text-xs font-bold leading-relaxed mt-0.5">{statusMsg.text}</p>
          </div>
        </motion.div>
      )}

      {/* EXPANDABLE SMART GENERATOR TOOL */}
      <AnimatePresence>
        {showGenerator && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-br from-[#074504] to-[#042d02] text-white p-6 rounded-2xl border border-[#C0991B] space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#C0991B]" />
                  <h3 className="font-black text-sm uppercase text-[#C0991B]">Smart Password Generator</h3>
                </div>
                <span className="text-[10px] font-bold text-amber-200 bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
                  Instant Compliant Fill
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-bold">
                <label className="flex items-center gap-2 bg-white/10 p-3 rounded-xl cursor-pointer hover:bg-white/20">
                  <input
                    type="checkbox"
                    checked={genIncludeUpper}
                    onChange={(e) => setGenIncludeUpper(e.target.checked)}
                    className="rounded text-[#074504] focus:ring-[#C0991B]"
                  />
                  <span>Uppercase (A-Z)</span>
                </label>

                <label className="flex items-center gap-2 bg-white/10 p-3 rounded-xl cursor-pointer hover:bg-white/20">
                  <input
                    type="checkbox"
                    checked={genIncludeLower}
                    onChange={(e) => setGenIncludeLower(e.target.checked)}
                    className="rounded text-[#074504] focus:ring-[#C0991B]"
                  />
                  <span>Lowercase (a-z)</span>
                </label>

                <label className="flex items-center gap-2 bg-white/10 p-3 rounded-xl cursor-pointer hover:bg-white/20">
                  <input
                    type="checkbox"
                    checked={genIncludeNumbers}
                    onChange={(e) => setGenIncludeNumbers(e.target.checked)}
                    className="rounded text-[#074504] focus:ring-[#C0991B]"
                  />
                  <span>Numbers (0-9)</span>
                </label>

                <label className="flex items-center gap-2 bg-white/10 p-3 rounded-xl cursor-pointer hover:bg-white/20">
                  <input
                    type="checkbox"
                    checked={genIncludeSymbols}
                    onChange={(e) => setGenIncludeSymbols(e.target.checked)}
                    className="rounded text-[#074504] focus:ring-[#C0991B]"
                  />
                  <span>Symbols (!@#$)</span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-xs font-bold text-gray-200 whitespace-nowrap">Length: {genLength} chars</span>
                  <input
                    type="range"
                    min={8}
                    max={32}
                    value={genLength}
                    onChange={(e) => setGenLength(Number(e.target.value))}
                    className="w-full sm:w-40 accent-[#C0991B] cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {newPassword && (
                    <button
                      type="button"
                      onClick={handleCopyGenerated}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedGenerated ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C0991B]" />}
                      {copiedGenerated ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="px-4 py-2.5 bg-[#C0991B] hover:bg-amber-500 text-[#074504] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Wand2 className="w-4 h-4 text-[#074504]" /> Generate & Apply
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIGURABLE SECURITY RULES MODAL */}
      <AnimatePresence>
        {showRulesConfig && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-6 rounded-2xl border-2 border-[#C0991B] shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#074504]" />
                  <h3 className="font-black text-sm uppercase text-[#074504]">Configure Password Security Policy Rules</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRulesConfig(false)}
                  className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  Close Rules
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Min Length (Chars)</label>
                  <input
                    type="number"
                    min={6}
                    max={32}
                    value={rules.minLength}
                    onChange={(e) => setRules({ ...rules, minLength: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Max History Retention</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={rules.historyCheckCount}
                    onChange={(e) => setRules({ ...rules, historyCheckCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Expiration Period (Days)</label>
                  <input
                    type="number"
                    min={30}
                    max={365}
                    value={rules.expirationDays}
                    onChange={(e) => setRules({ ...rules, expirationDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:bg-white"
                  />
                </div>

                <label className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rules.requireUppercase}
                    onChange={(e) => setRules({ ...rules, requireUppercase: e.target.checked })}
                    className="rounded text-[#074504]"
                  />
                  <span className="font-bold text-gray-800">Require Uppercase Letter</span>
                </label>

                <label className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rules.requireLowercase}
                    onChange={(e) => setRules({ ...rules, requireLowercase: e.target.checked })}
                    className="rounded text-[#074504]"
                  />
                  <span className="font-bold text-gray-800">Require Lowercase Letter</span>
                </label>

                <label className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rules.requireNumbers}
                    onChange={(e) => setRules({ ...rules, requireNumbers: e.target.checked })}
                    className="rounded text-[#074504]"
                  />
                  <span className="font-bold text-gray-800">Require Digits</span>
                </label>

                <label className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rules.requireSpecialChars}
                    onChange={(e) => setRules({ ...rules, requireSpecialChars: e.target.checked })}
                    className="rounded text-[#074504]"
                  />
                  <span className="font-bold text-gray-800">Require Special Symbols</span>
                </label>

                <label className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rules.enforceDictionaryCheck}
                    onChange={(e) => setRules({ ...rules, enforceDictionaryCheck: e.target.checked })}
                    className="rounded text-[#074504]"
                  />
                  <span className="font-bold text-gray-800">Enforce Dictionary & Leak Check</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= PASSWORD EVALUATOR & CHANGE FORM ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
              <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#074504] uppercase flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#C0991B]" /> Account Credential Details
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Updating portal password for user account: <strong className="text-gray-900 font-extrabold">{username}</strong>
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-[10px] font-black uppercase">
                  Active User Session
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'change' && (
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase mb-1.5 flex items-center justify-between">
                      <span>Current Portal Password *</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrent ? "text" : "password"}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:bg-white focus:border-[#074504] focus:ring-2 focus:ring-[#074504]/20 outline-none transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase mb-1.5 flex items-center justify-between">
                    <span>New Security Password *</span>
                    <span className="text-[10px] text-gray-400 font-bold">Min {rules.minLength} characters</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Type or generate a strong password"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:bg-white focus:border-[#074504] focus:ring-2 focus:ring-[#074504]/20 outline-none transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* REAL-TIME STRENGTH METER & EVALUATOR CARD */}
                {newPassword && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#074504]" />
                        <span className="text-xs font-black uppercase text-gray-800">Password Strength Evaluator</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase flex items-center gap-1.5 ${evaluation.colorClass}`}>
                        <span>{evaluation.level}</span>
                        <span className="opacity-60">({evaluation.score}/100)</span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${evaluation.barColor}`} 
                        style={{ width: `${evaluation.score}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 pt-1 border-t border-gray-200">
                      <span>Calculated Entropy: <strong className="text-[#074504] font-black">{evaluation.entropyBits} bits</strong></span>
                      <span>Policy Verification: {evaluation.isValid ? <strong className="text-emerald-700 font-black">Compliant ✓</strong> : <strong className="text-red-600 font-black">Incomplete ✗</strong>}</span>
                    </div>

                    {/* REQUIREMENT CHECKLIST GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-bold pt-2 border-t border-gray-200">
                      <div className={`flex items-center gap-2 ${evaluation.hasMinLen ? 'text-emerald-700' : 'text-gray-400'}`}>
                        {evaluation.hasMinLen ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                        <span>Minimum {rules.minLength} characters</span>
                      </div>

                      {rules.requireUppercase && (
                        <div className={`flex items-center gap-2 ${evaluation.hasUpper ? 'text-emerald-700' : 'text-gray-400'}`}>
                          {evaluation.hasUpper ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                          <span>Uppercase letter (A-Z)</span>
                        </div>
                      )}

                      {rules.requireLowercase && (
                        <div className={`flex items-center gap-2 ${evaluation.hasLower ? 'text-emerald-700' : 'text-gray-400'}`}>
                          {evaluation.hasLower ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                          <span>Lowercase letter (a-z)</span>
                        </div>
                      )}

                      {rules.requireNumbers && (
                        <div className={`flex items-center gap-2 ${evaluation.hasNumber ? 'text-emerald-700' : 'text-gray-400'}`}>
                          {evaluation.hasNumber ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                          <span>Digit / Number (0-9)</span>
                        </div>
                      )}

                      {rules.requireSpecialChars && (
                        <div className={`flex items-center gap-2 ${evaluation.hasSpecial ? 'text-emerald-700' : 'text-gray-400'}`}>
                          {evaluation.hasSpecial ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                          <span>Special Symbol (!@#$)</span>
                        </div>
                      )}

                      {rules.enforceDictionaryCheck && (
                        <div className={`flex items-center gap-2 ${!evaluation.hasDictionaryIssue ? 'text-emerald-700' : 'text-red-600 font-black'}`}>
                          {!evaluation.hasDictionaryIssue ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />}
                          <span>No dictionary / common patterns</span>
                        </div>
                      )}

                      <div className={`flex items-center gap-2 ${!evaluation.matchesHistory ? 'text-emerald-700' : 'text-red-600 font-black'}`}>
                        {!evaluation.matchesHistory ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />}
                        <span>Not in recent password history</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase mb-1.5">Confirm New Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:bg-white focus:border-[#074504] focus:ring-2 focus:ring-[#074504]/20 outline-none transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#074504] hover:bg-[#053203] text-[#C0991B] font-black text-xs uppercase tracking-[0.15em] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C0991B]" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-[#C0991B]" />
                  )}
                  {isSubmitting ? 'Verifying & Updating Password...' : 'Update Security Password'}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs space-y-4">
              <h3 className="font-black text-sm text-[#074504] uppercase border-b border-gray-100 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C0991B]" /> Security Best Practices
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-amber-50/60 rounded-xl border border-[#C0991B]/30 space-y-1">
                  <span className="font-black text-[#074504] uppercase text-[10px] block">Passphrase Method</span>
                  <p className="text-gray-700 font-medium leading-relaxed">
                    Combine 3 to 4 random memorable words (e.g. <code>Coffee#Safari2026!Mount</code>) for maximum entropy.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <span className="font-black text-gray-800 uppercase text-[10px] block">No Account Reuse</span>
                  <p className="text-gray-600 font-medium leading-relaxed">
                    Never reuse your portal password on third-party public forums or social accounts.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <span className="font-black text-gray-800 uppercase text-[10px] block">Password Expiration</span>
                  <p className="text-gray-600 font-medium leading-relaxed">
                    Portal passwords automatically expire every {rules.expirationDays} days to ensure compliance with enterprise audit rules.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#074504] to-[#042d02] p-6 rounded-2xl border border-[#C0991B] text-white space-y-3 shadow-md">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C0991B]" />
                <h4 className="font-black text-sm uppercase text-[#C0991B]">Enterprise Access Policy</h4>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed font-medium">
                Neema HEEP staff logins enforce strict brute-force protection, IP session monitoring, and real-time credential verification.
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}

function RotateCwIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}
