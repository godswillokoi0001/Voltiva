import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  X,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup' | 'forgot';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode = 'login', onClose }) => {
  const { 
    login, 
    loginWithGoogle, 
    loginAsDemoAdmin, 
    loginAsDemoCustomer, 
    signup,
    authError,
    setAuthError 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'otp'>(initialMode);

  // Form Fields
  const [fullName, setFullName] = useState<string>('Tunde Adeleke');
  const [email, setEmail] = useState<string>('tunde.adeleke@example.com');
  const [phone, setPhone] = useState<string>('08149823411');
  const [password, setPassword] = useState<string>('password123');
  const [otp, setOtp] = useState<string>('');
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setLocalLoading(true);
    try {
      const ok = await loginWithGoogle();
      setLocalLoading(false);
      if (ok) {
        onClose();
      }
    } catch {
      setLocalLoading(false);
    }
  };

  const handleAdminDemo = async () => {
    setAuthError(null);
    setLocalLoading(true);
    await loginAsDemoAdmin();
    setLocalLoading(false);
    onClose();
  };

  const handleCustomerDemo = async () => {
    setAuthError(null);
    setLocalLoading(true);
    await loginAsDemoCustomer();
    setLocalLoading(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLocalLoading(true);

    try {
      if (mode === 'login') {
        const ok = await login(email, password);
        setLocalLoading(false);
        if (ok) onClose();
      } else if (mode === 'signup') {
        setLocalLoading(false);
        setMode('otp');
      } else if (mode === 'otp') {
        if (otp !== '1234' && otp.length !== 4) {
          setAuthError('Invalid OTP code. Enter demo OTP: 1234');
          setLocalLoading(false);
          return;
        }
        const ok = await signup(fullName, email, phone, password);
        setLocalLoading(false);
        if (ok) onClose();
      } else if (mode === 'forgot') {
        await new Promise(r => setTimeout(r, 600));
        setLocalLoading(false);
        setLocalMessage(`Password reset link sent to ${email}`);
        setTimeout(() => {
          setLocalMessage(null);
          setMode('login');
        }, 3000);
      }
    } catch {
      setLocalLoading(false);
      setAuthError('Authentication encountered an unexpected error. Please retry.');
    }
  };

  return (
    <div id="auth-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        id="auth-modal-container"
        className="relative w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 text-slate-900 dark:text-slate-100 max-h-[92vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 font-display text-lg shadow-xs">
            V
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">Voltiva</span>
            <span className="text-[10px] block text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">Authentication & RBAC</span>
          </div>
        </div>

        <div className="mb-5">
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create an Account' : mode === 'otp' ? 'Verify Mobile OTP' : 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'login'
              ? 'Sign in to access your wallet, bills, and payment records.'
              : mode === 'signup'
              ? 'Join fast, reliable everyday VTU utility payments in Nigeria.'
              : mode === 'otp'
              ? `We sent a 4-digit verification code to ${phone}`
              : 'Enter your account email to receive recovery instructions.'}
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {localMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{localMessage}</span>
          </div>
        )}

        {/* Primary Firebase Auth Action: Google Sign In */}
        <div className="space-y-3 mb-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={localLoading}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
            <span className="bg-white dark:bg-[#0f172a] px-2 text-[10px] uppercase font-semibold text-slate-400 shrink-0">
              Or email / demo access
            </span>
            <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
          </div>
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Legal Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Babatunde Adeleke"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08012345678"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white font-mono placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {mode !== 'otp' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>
          )}

          {mode === 'otp' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 text-center">Enter 4-digit SMS OTP</label>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1234"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-3 text-center text-2xl font-mono tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                required
              />
              <p className="text-[11px] text-slate-500 text-center mt-1.5">Demo OTP is: 1234</p>
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={localLoading}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-3 cursor-pointer shadow-xs"
          >
            {localLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>
              {mode === 'login'
                ? 'Sign In with Email'
                : mode === 'signup'
                ? 'Continue to Phone OTP'
                : mode === 'otp'
                ? 'Verify & Open Account'
                : 'Send Recovery Code'}
            </span>
          </button>
        </form>

        {/* Instant Role-Based Demo Switchers */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-center">
            One-Click Test Accounts (Instant Verification)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAdminDemo}
              disabled={localLoading}
              className="px-2.5 py-2 rounded-xl bg-purple-500/10 dark:bg-purple-950/40 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800/60 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin (Census Okoi)</span>
            </button>
            <button
              type="button"
              onClick={handleCustomerDemo}
              disabled={localLoading}
              className="px-2.5 py-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Customer (Tunde)</span>
            </button>
          </div>

          <div className="text-center pt-2">
            {mode === 'login' ? (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer">
                  Create an Account
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer">
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
