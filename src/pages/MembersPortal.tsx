import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, User, ShieldCheck, ShieldAlert, LogIn,
  Loader2, KeySquare, Eye, EyeOff, BookOpen,
  Mail, Phone, ArrowLeft, CheckCircle2, RotateCw, KeyRound,
  Shield, UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { trackMemberDashboardVisit } from '../services/trackingService';
import PasswordSecurityModule from '../components/PasswordSecurityModule';

type ViewMode = 'login' | 'forgot-identifier' | 'forgot-otp' | 'forgot-new-password';

export default function MembersPortal() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, loginWithUsernamePassword, signInWithGoogle } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password & OTP Flow State
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'phone'>('email');
  const [resetToken, setResetToken] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    trackMemberDashboardVisit();
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (viewMode === 'forgot-otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [viewMode, countdown]);

  const handleCredentialsLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please provide your staff username or email and security password.');
      return;
    }
    setIsAuthenticating(true);
    setError(null);

    try {
      if (loginWithUsernamePassword) {
        await loginWithUsernamePassword(username.trim(), password);
        navigate('/admin');
      }
    } catch (err: any) {
      console.error("[PORTAL LOGIN ERROR]", err);
      setError(err.message || 'Access Denied: Invalid credentials or unapproved staff user.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setError(null);
    try {
      if (signInWithGoogle) {
        await signInWithGoogle();
      }
    } catch (err: any) {
      console.error("[GOOGLE LOGIN ERROR]", err);
      setError(err.message || 'Google Sign-In failed. Please verify that your Google email is an approved CMS user.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handler: Request OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = forgotIdentifier.trim();
    if (!val) {
      setError(`Please enter your registered ${deliveryMethod === 'email' ? 'email address' : 'phone number'}.`);
      return;
    }

    setIsSubmittingForgot(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotIdentifier.trim(), deliveryMethod })
      });
      const data = await res.json();
      if (data.success) {
        setCountdown(60);
        setViewMode('forgot-otp');
        setEnteredOtp('');
      } else {
        setError(data.error || 'Failed to dispatch verification code.');
      }
    } catch {
      setError('Could not reach the authentication server. Please check your network connection.');
    } finally {
      setIsSubmittingForgot(false);
    }
  };

  // Handler: Verify OTP Code
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!enteredOtp.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setIsSubmittingForgot(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotIdentifier.trim(), otp: enteredOtp.trim() })
      });
      const data = await res.json();
      if (data.success && data.resetToken) {
        setResetToken(data.resetToken);
        setError(null);
        setViewMode('forgot-new-password');
      } else {
        setError(data.error || 'Invalid or expired verification code. Please try again.');
      }
    } catch {
      setError('Verification service unavailable. Please check connection and try again.');
    } finally {
      setIsSubmittingForgot(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7F6] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#074504] animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8faf8] flex flex-col items-center justify-center py-20 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#074504] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#074504] uppercase tracking-tighter">
            {viewMode === 'login' ? (
              <>Staff <span className="text-[#C0991B]">Login</span></>
            ) : (
              <>Forgot <span className="text-[#C0991B]">Password</span></>
            )}
          </h1>
          <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mt-2 px-4 leading-relaxed text-center">
            Enterprise Staff Portal Access • Neema HEEP
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-left"
          >
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
               <p className="text-[11px] font-black text-red-600 uppercase tracking-tight">
                 Access Error
               </p>
               <p className="text-[11px] font-bold text-red-500 mt-0.5 leading-relaxed">{error}</p>
            </div>
          </motion.div>
        )}

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-left"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
               <p className="text-[11px] font-black text-emerald-800 uppercase tracking-tight">
                 Success
               </p>
               <p className="text-[11px] font-bold text-emerald-700 mt-0.5 leading-relaxed">{successMsg}</p>
            </div>
          </motion.div>
        )}

        {/* VIEW 1: REGULAR LOGIN FORM */}
        {viewMode === 'login' && (
          <form onSubmit={handleCredentialsLogin} className="space-y-6">
            <div className="bg-[#074504]/5 p-4 rounded-2xl border border-[#074504]/10 flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-[#074504] shrink-0" />
              <p className="text-[11px] font-bold text-[#074504] leading-tight">
                Log in to access the <span className="font-black text-[#C0991B]">CMS Admin & Editorial Dashboard</span>.
              </p>
            </div>

            {/* Google OAuth Provider Sign In (Approved Staff Only) */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isAuthenticating}
                className="w-full bg-white border-2 border-gray-200 hover:border-[#074504] text-gray-800 py-4 px-6 rounded-2xl font-extrabold text-xs tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google <span className="text-[#C0991B] font-black">(Approved Staff Only)</span></span>
              </button>
              <p className="text-[10px] text-center text-gray-500 font-bold mt-2">
                Note: Google SSO is restricted to pre-approved CMS users registered by Superadmin.
              </p>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-black uppercase tracking-widest">Or Sign In with Username / Email</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-5 top-5 text-gray-400">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="Email or Username (e.g. ptrckmunene@gmail.com)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isAuthenticating}
                  className="w-full bg-gray-50 border border-gray-200 pl-14 pr-6 py-5 rounded-3xl font-bold text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#074504]/20 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <div className="relative">
                  <span className="absolute left-5 top-5 text-gray-400">
                    <KeySquare className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Security Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isAuthenticating}
                    className="w-full bg-gray-50 border border-gray-200 pl-14 pr-14 py-5 rounded-3xl font-bold text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#074504]/20 focus:bg-white transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex justify-end pt-2 pr-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotIdentifier(username || '');
                      setError(null);
                      setSuccessMsg(null);
                      setViewMode('forgot-identifier');
                    }}
                    className="text-xs font-black text-[#074504] hover:text-[#599200] hover:underline transition-all cursor-pointer flex items-center gap-1"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#C0991B]" /> Forgot Password?
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-[#074504] text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-[#053203] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
            >
              {isAuthenticating ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#C0991B]" />
              ) : (
                <LogIn className="w-4 h-4 text-[#C0991B]" />
              )}
              {isAuthenticating ? 'Authorizing Session...' : 'Enter CMS Dashboard'}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD STEPS */}
        {viewMode === 'forgot-identifier' && (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div className="p-4 bg-amber-50/60 border border-[#C0991B]/30 rounded-2xl text-left space-y-1">
              <span className="text-[10px] font-black uppercase text-[#074504] tracking-wider block">
                Step 1 of 3: Verification Method & Target
              </span>
              <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                Choose how you would like to receive your 6-digit OTP code, then enter your registered address or mobile number.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 text-left">
                Select Dispatch Method:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setDeliveryMethod('email'); setError(null); }}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    deliveryMethod === 'email'
                      ? 'bg-[#074504] text-white border-[#074504] shadow-sm'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Mail className="w-4 h-4 text-[#C0991B]" /> Send via Email
                </button>
                <button
                  type="button"
                  onClick={() => { setDeliveryMethod('phone'); setError(null); }}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    deliveryMethod === 'phone'
                      ? 'bg-[#074504] text-white border-[#074504] shadow-sm'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Phone className="w-4 h-4 text-[#C0991B]" /> Send via SMS / Phone
                </button>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-[11px] font-black uppercase text-[#074504] flex items-center justify-between">
                <span>{deliveryMethod === 'email' ? 'Registered Email Address' : 'Registered Phone Number'}</span>
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">Required</span>
              </label>

              <div className="relative">
                <span className="absolute left-5 top-4.5 text-gray-400">
                  {deliveryMethod === 'email' ? <Mail className="w-5 h-5 text-[#074504]" /> : <Phone className="w-5 h-5 text-[#074504]" />}
                </span>
                <input
                  type={deliveryMethod === 'email' ? 'email' : 'tel'}
                  placeholder={deliveryMethod === 'email' ? 'e.g. ptrckmunene@gmail.com' : 'e.g. 0712345678'}
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  disabled={isSubmittingForgot}
                  className="w-full bg-gray-50 border border-gray-200 pl-14 pr-6 py-4 rounded-2xl font-bold text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#074504]/20 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingForgot}
              className="w-full bg-[#074504] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-wider shadow-md hover:bg-[#053203] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingForgot ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#C0991B]" />
              ) : deliveryMethod === 'email' ? (
                <Mail className="w-4 h-4 text-[#C0991B]" />
              ) : (
                <Phone className="w-4 h-4 text-[#C0991B]" />
              )}
              {isSubmittingForgot ? 'Dispatching OTP...' : `Send OTP to ${deliveryMethod === 'email' ? 'Email' : 'Phone'}`}
            </button>

            <button
              type="button"
              onClick={() => { setViewMode('login'); setError(null); }}
              className="w-full text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
            </button>
          </form>
        )}

        {viewMode === 'forgot-otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left space-y-1">
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                Step 2 of 3: Enter Verification Code
              </span>
              <p className="text-[11px] text-emerald-700 font-medium leading-relaxed">
                OTP sent to <strong className="text-gray-900">{forgotIdentifier}</strong>.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
              <p className="text-[11px] font-bold text-[#074504] flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#599200]" /> A secure 6-digit verification code has been dispatched.
              </p>
              <p className="text-[10px] text-gray-500">
                Please check your {deliveryMethod === 'email' ? 'email inbox' : 'SMS text messages'} and enter the code below.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-center font-mono text-2xl font-black tracking-widest text-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#074504]"
              />

              <div className="flex items-center justify-between text-[11px] text-gray-500 font-bold px-1">
                <span>{countdown > 0 ? `Resend code in ${countdown}s` : 'Code expired'}</span>
                {countdown === 0 && (
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    className="text-[#074504] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3 text-[#C0991B]" /> Resend OTP
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#074504] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-wider shadow-md hover:bg-[#053203] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#C0991B]" /> Verify Code & Continue
            </button>

            <button
              type="button"
              onClick={() => { setViewMode('forgot-identifier'); setError(null); }}
              className="w-full text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Change Target / Method
            </button>
          </form>
        )}

        {viewMode === 'forgot-new-password' && (
          <div className="space-y-6">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left space-y-1">
              <span className="text-[10px] font-black uppercase text-[#074504] tracking-wider block">
                Step 3 of 3: Create New Password
              </span>
              <p className="text-[11px] text-gray-700 font-medium leading-relaxed">
                OTP verified! Choose a new password for <strong className="text-gray-900">{forgotIdentifier}</strong>.
              </p>
            </div>

            <PasswordSecurityModule
              mode="reset"
              username={forgotIdentifier}
              resetToken={resetToken}
              onSuccess={() => {
                setSuccessMsg('Your security password has been updated successfully! Log in now with your new password.');
                setViewMode('login');
              }}
            />

            <button
              type="button"
              onClick={() => { setViewMode('login'); setError(null); }}
              className="w-full text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer py-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
            </button>
          </div>
        )}

        <div className="mt-10 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-5 h-5 text-[#599200] shrink-0 mt-1" />
            <div>
              <p className="text-[10px] font-black text-[#074504] uppercase tracking-widest mb-1">Corporate Security & Centralized Auth Engine</p>
              <p className="text-[9px] text-gray-500 font-bold leading-relaxed">
                All logins and actions are synced directly with the corporate cloud backend. New users can only be registered and assigned roles by the Superadmin.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
