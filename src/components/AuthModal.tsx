import React, { useState, useRef } from 'react';
import { User } from '../types';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  CreditCard,
  Camera,
  Upload,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  BookOpen,
  PlusCircle,
  Zap,
  Wrench,
  MessageSquare
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  authNotice?: string;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  authNotice,
  onClose,
  onLoginSuccess
}) => {
  if (!isOpen) return null;

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign-Up Specific Fields
  const [technicianName, setTechnicianName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);

  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);

  // Handle Local Avatar Picture Upload
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Format Aadhaar Number nicely (XXXX XXXX XXXX)
  const handleAadharChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 12);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setAadharNumber(formatted);
  };

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

    if (mode === 'signup') {
      if (!technicianName.trim()) {
        setErrorMsg('Please enter your Full Name / Technician Name.');
        return;
      }

      if (!whatsappNumber.trim()) {
        setErrorMsg('Please enter your Mobile / WhatsApp Number.');
        return;
      }

      const cleanAadhar = aadharNumber.replace(/\s/g, '');
      if (cleanAadhar && cleanAadhar.length !== 12) {
        setErrorMsg('Aadhaar number must be exactly 12 digits.');
        return;
      }
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: mode === 'signup' ? technicianName.trim() : email.split('@')[0] || 'Member User',
      technicianName: mode === 'signup' ? technicianName.trim() : undefined,
      email: email.trim(),
      phone: mode === 'signup' ? whatsappNumber.trim() : '+91 98765 00000',
      whatsappNumber: mode === 'signup' ? whatsappNumber.trim() : undefined,
      aadharNumber: mode === 'signup' ? aadharNumber.trim() : undefined,
      role: mode === 'signup' ? role : 'buyer',
      avatar: avatar,
      status: 'active',
      totalPurchases: 0,
      totalSpentINR: 0,
      totalDownloads: 0,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    setSuccessMsg(mode === 'login' ? 'Successfully logged in!' : 'Profile created & registered successfully!');
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 600);
  };

  // Preset quick login for easy demo testing
  const handleQuickDemoLogin = (demoType: 'technician' | 'buyer') => {
    const demoUser: User =
      demoType === 'technician'
        ? {
            id: 'usr_demo_tech',
            name: 'Aarav Sharma (Certified TV Technician)',
            technicianName: 'Aarav Sharma',
            email: 'aarav.tech@partsshop.com',
            phone: '+91 98765 43210',
            whatsappNumber: '+91 98765 43210',
            aadharNumber: '5412 8891 0023',
            role: 'buyer',
            status: 'active',
            avatar: PRESET_AVATARS[1],
            createdAt: 'Jan 2026'
          }
        : {
            id: 'usr_demo_buyer',
            name: 'Priya Patel',
            technicianName: 'Priya Patel',
            email: 'priya.patel@techworld.in',
            phone: '+91 98234 56789',
            whatsappNumber: '+91 98234 56789',
            aadharNumber: '8910 2234 5511',
            role: 'buyer',
            status: 'active',
            avatar: PRESET_AVATARS[0],
            createdAt: 'Feb 2026'
          };

    setSuccessMsg(`Logged in as ${demoUser.name}`);
    setTimeout(() => {
      onLoginSuccess(demoUser);
      onClose();
    }, 500);
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      {/* Hidden Avatar File Input */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        className="hidden"
      />

      <div
        id="auth-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative text-slate-100 my-6 max-h-[92vh] flex flex-col"
      >
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
              {mode === 'signup' ? <Wrench className="w-5 h-5 text-blue-400" /> : <Lock className="w-5 h-5 text-blue-400" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isForgotPassword
                  ? 'Reset Your Password'
                  : mode === 'login'
                  ? 'Welcome Back — Log In'
                  : 'Technician / User Registration'}
              </h2>
              <p className="text-xs text-slate-400">
                {isForgotPassword
                  ? 'We will send a password reset link'
                  : mode === 'login'
                  ? 'Sign in to access schematics, PDFs & instant purchases'
                  : 'Register your technician profile & get instant PDF access'}
              </p>
            </div>
          </div>

          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Optional Context Notice */}
        {authNotice && (
          <div className="bg-amber-950/70 border-b border-amber-800/80 px-5 py-2.5 text-xs text-amber-200 flex items-center gap-2">
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
              className={`py-2.5 rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
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
              className={`py-2.5 rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up / Register Profile
            </button>
          </div>
        )}

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-800/80 rounded-xl text-red-300 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800/80 rounded-xl text-emerald-300 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Demo Login Option */}
          {mode === 'login' && !isForgotPassword && (
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-200 text-xs block">Quick Test Logins:</span>
                <span className="text-[11px] text-slate-400">1-click demo technician login</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('technician')}
                  className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-lg text-[11px] font-bold"
                >
                  ⚡ Technician
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('buyer')}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[11px] font-bold"
                >
                  👤 Buyer
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* SIGN-UP FIELDS */}
            {mode === 'signup' && !isForgotPassword && (
              <>
                {/* 1. Profile Picture / Avatar Picker */}
                <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-blue-400" />
                      <span>Profile Picture / Photo</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 bg-blue-950/80 border border-blue-800/60 px-2.5 py-1 rounded-lg"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload from Device</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 border-2 border-blue-500/50 shrink-0 shadow">
                      <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1">
                      <span className="text-[10px] text-slate-400 block mb-1">Or choose preset avatar:</span>
                      <div className="flex items-center gap-1.5">
                        {PRESET_AVATARS.map((pUrl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatar(pUrl)}
                            className={`w-7 h-7 rounded-xl overflow-hidden border transition-all ${
                              avatar === pUrl
                                ? 'border-blue-500 scale-110 shadow-md ring-1 ring-blue-400'
                                : 'border-slate-800 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={pUrl} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Full Name / Technician Name */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Full Name / Technician Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={technicianName}
                      onChange={(e) => setTechnicianName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar (Electronics Tech)"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 placeholder-slate-500 outline-none"
                    />
                  </div>
                </div>

                {/* 3. Mobile No. / WhatsApp No. */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Mobile No. / WhatsApp No. <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                    <input
                      type="tel"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+91 98765 43210 (For instant order PDF updates)"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-slate-100 placeholder-slate-500 outline-none"
                    />
                  </div>
                </div>

                {/* 4. Aadhar Number */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-300">
                      Aadhaar Card No. <span className="text-slate-500 font-normal">(Optional Verification)</span>
                    </label>
                    <span className="text-[10px] text-slate-500">12 Digits ID</span>
                  </div>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
                    <input
                      type="text"
                      maxLength={14}
                      value={aadharNumber}
                      onChange={(e) => handleAadharChange(e.target.value)}
                      placeholder="XXXX XXXX XXXX"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 placeholder-slate-500 outline-none font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Email Address <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="technician@example.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            {!isForgotPassword && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-300">
                    Password <span className="text-blue-400">*</span>
                  </label>
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
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="auth-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-slate-100 placeholder-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Save & Submit Button */}
            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all mt-3"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isForgotPassword
                  ? 'Send Reset Link'
                  : mode === 'login'
                  ? 'Log In & Continue'
                  : 'Save Profile & Complete Registration'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
