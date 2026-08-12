import React, { useState } from 'react';
import { User } from '../types';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  BookOpen,
  PlusCircle,
  Zap
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  authNotice?: string;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  authNotice,
  onClose,
  onLoginSuccess
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isForgotPassword) {
      if (!email.trim()) {
        setErrorMsg('Please enter your email address to reset password.');
        return;
      }
      setForgotEmailSent(true);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: mode === 'signup' ? fullName : email.split('@')[0] || 'Member User',
      email: email,
      role: mode === 'signup' ? role : 'buyer',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop`,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    setSuccessMsg(mode === 'login' ? 'Successfully logged in!' : 'Account created successfully!');
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 600);
  };

  // Preset quick login for easy demo testing
  const handleQuickDemoLogin = (demoType: 'buyer' | 'seller') => {
    const demoUser: User = demoType === 'buyer'
      ? {
          id: 'usr_demo_buyer',
          name: 'Alex Johnson',
          email: 'alex.buyer@pdfstore.com',
          role: 'buyer',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
          createdAt: 'Jan 2026'
        }
      : {
          id: 'usr_demo_seller',
          name: 'Sarah Chen (PDF Author)',
          email: 'sarah.creator@pdfstore.com',
          role: 'seller',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
          createdAt: 'Nov 2025'
        };

    setSuccessMsg(`Logged in as ${demoUser.name}`);
    setTimeout(() => {
      onLoginSuccess(demoUser);
      onClose();
    }, 500);
  };

  return (
    <div id="auth-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        id="auth-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative text-slate-100 my-auto"
      >
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isForgotPassword
                  ? 'Reset Your Password'
                  : mode === 'login'
                  ? 'Welcome Back'
                  : 'Create PDFStore Account'}
              </h2>
              <p className="text-xs text-slate-400">
                {isForgotPassword
                  ? 'We will send a password reset link'
                  : mode === 'login'
                  ? 'Sign in to access your purchased PDF library'
                  : 'Join creators and readers buying & selling PDFs'}
              </p>
            </div>
          </div>

          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Optional Context Notice (e.g. Purchase Requirement) */}
        {authNotice && (
          <div className="bg-amber-950/70 border-b border-amber-800/80 px-4 py-2.5 text-xs text-amber-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold">{authNotice}</span>
          </div>
        )}

        {/* Tab Switcher (Login vs Sign Up) */}
        {!isForgotPassword && (
          <div className="grid grid-cols-2 p-1.5 bg-slate-950 border-b border-slate-800 text-xs font-bold text-center">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Log In
            </button>
            <button
              id="auth-tab-signup"
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Body Form */}
        <div className="p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Social Sign-In Buttons */}
          {!isForgotPassword && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('buyer')}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('seller')}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              <div className="relative my-3 text-center">
                <hr className="border-slate-800" />
                <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-2 bg-slate-900 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Or continue with email
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            {/* Full Name for Sign Up */}
            {mode === 'signup' && !isForgotPassword && (
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="signup-fullname-input"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Alex Johnson"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password Field */}
            {!isForgotPassword && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-300">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[11px] text-blue-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="auth-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Role Preference for Sign Up */}
            {mode === 'signup' && !isForgotPassword && (
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Primary Account Interest</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      role === 'buyer'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <span className="font-bold block text-xs">PDF Reader / Buyer</span>
                      <span className="text-[10px] text-slate-400">Download eBooks & Guides</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      role === 'seller'
                        ? 'bg-emerald-600/20 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold block text-xs">PDF Creator / Seller</span>
                      <span className="text-[10px] text-slate-400">Sell your PDF files</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me Checkbox */}
            {mode === 'login' && !isForgotPassword && (
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
                />
                <span className="text-[11px]">Keep me signed in on this browser</span>
              </label>
            )}

            {/* Submit Button */}
            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 mt-2 min-h-[46px] touch-manipulation"
            >
              <span>
                {isForgotPassword
                  ? 'Send Reset Link'
                  : mode === 'login'
                  ? 'Sign In to Account'
                  : 'Create PDFStore Account'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Preset Quick Demo Logins Bar */}
          {!isForgotPassword && (
            <div className="pt-3 border-t border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                ⚡ Quick Demo Logins (One-Click)
              </span>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('buyer')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-blue-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 min-h-[40px] touch-manipulation"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Demo Buyer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('seller')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-emerald-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 min-h-[40px] touch-manipulation"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Demo Creator</span>
                </button>
              </div>
            </div>
          )}

          {isForgotPassword && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-xs text-blue-400 hover:underline font-semibold"
              >
                ← Back to Log In
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit SSL Encrypted Account Authentication</span>
        </div>
      </div>
    </div>
  );
};
