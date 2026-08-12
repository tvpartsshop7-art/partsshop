import React, { useState, useEffect, useRef } from 'react';
import { User, Order, Currency } from '../types';
import {
  X,
  User as UserIcon,
  Mail,
  ShieldCheck,
  ShoppingBag,
  DollarSign,
  FileText,
  Calendar,
  LogOut,
  Download,
  CheckCircle2,
  Phone,
  CreditCard,
  Camera,
  Upload,
  Edit2,
  Wrench,
  Sparkles,
  Award,
  Clock
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  orders: Order[];
  currency: Currency;
  onOpenMyDownloads: () => void;
  onLogout: () => void;
  onUpdateUser?: (updatedUser: User) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  orders,
  currency,
  onOpenMyDownloads,
  onLogout,
  onUpdateUser
}) => {
  if (!isOpen || !user) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.technicianName || user.name);
  const [editPhone, setEditPhone] = useState(user.whatsappNumber || user.phone || '');
  const [editAadhar, setEditAadhar] = useState(user.aadharNumber || '');
  const [editAvatar, setEditAvatar] = useState(user.avatar || PRESET_AVATARS[0]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.technicianName || user.name);
      setEditPhone(user.whatsappNumber || user.phone || '');
      setEditAadhar(user.aadharNumber || '');
      setEditAvatar(user.avatar || PRESET_AVATARS[0]);
    }
  }, [user, isOpen]);

  // Handle Avatar file change
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Format Aadhaar Number
  const handleAadharChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 12);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setEditAadhar(formatted);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert('Technician name cannot be empty.');
      return;
    }

    const updated: User = {
      ...user,
      name: editName.trim(),
      technicianName: editName.trim(),
      phone: editPhone.trim() || user.phone,
      whatsappNumber: editPhone.trim() || user.whatsappNumber,
      aadharNumber: editAadhar.trim() || user.aadharNumber,
      avatar: editAvatar
    };

    if (onUpdateUser) {
      onUpdateUser(updated);
    }

    setIsEditing(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  // Calculate order metrics
  const totalOrdersCount = orders.length;
  const totalSpentINR = orders.reduce((sum, order) => sum + (order.totalAmountINR || 0), 0);
  const totalDownloads = orders.reduce((sum, order) => sum + (order.downloadCount || 1), 0);

  return (
    <div
      id="user-profile-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        className="hidden"
      />

      <div
        id="user-profile-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden relative text-slate-100 my-auto flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Technician Account Profile</h2>
              <p className="text-xs text-slate-400">Manage your profile information, WhatsApp & Aadhaar ID</p>
            </div>
          </div>

          <button
            id="close-user-profile-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-xs flex-1">
          {saveSuccessMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Profile information updated & saved successfully!</span>
            </div>
          )}

          {/* EDIT PROFILE FORM */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Selector */}
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-blue-400" />
                    <span>Profile Photo</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 bg-blue-950 border border-blue-800 px-2.5 py-1 rounded-lg"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload New Photo</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 border-2 border-blue-500 shrink-0 shadow">
                    <img src={editAvatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditAvatar(url)}
                        className={`w-7 h-7 rounded-xl overflow-hidden border transition-all ${
                          editAvatar === url
                            ? 'border-blue-500 scale-110 shadow ring-1 ring-blue-400'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technician Name */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Full Name / Technician Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-white outline-none"
                />
              </div>

              {/* Mobile / WhatsApp */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Mobile No. / WhatsApp No. <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-white outline-none"
                />
              </div>

              {/* Aadhaar Number */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Aadhaar Card No. <span className="text-slate-500 font-normal">(12 Digits)</span>
                </label>
                <input
                  type="text"
                  maxLength={14}
                  value={editAadhar}
                  onChange={(e) => handleAadharChange(e.target.value)}
                  placeholder="XXXX XXXX XXXX"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-white outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          ) : (
            /* VIEW PROFILE MODE */
            <>
              {/* User Hero Box */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 shadow">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-600 text-white font-black text-xl flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm">{user.technicianName || user.name}</h3>
                      <span className="bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded-md text-[10px] font-bold">
                        VERIFIED TECHNICIAN
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 rounded-xl font-bold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              {/* Technician Identity Card */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2.5">
                <h4 className="font-bold text-slate-300 flex items-center gap-1.5 border-b border-slate-800/60 pb-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Technician Verified Credentials</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Technician Name:</span>
                    <span className="font-bold text-white">{user.technicianName || user.name}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] block">WhatsApp / Mobile No:</span>
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {user.whatsappNumber || user.phone || 'Not provided'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] block">Aadhaar Card No:</span>
                    <span className="font-mono text-slate-200">
                      {user.aadharNumber
                        ? `${user.aadharNumber.slice(0, 4)} XXXX ${user.aadharNumber.slice(-4)}`
                        : 'Verified Member'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] block">Member Since:</span>
                    <span>{new Date(user.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                  </div>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
                  <span className="text-slate-400 text-[10px] block">Total Orders</span>
                  <span className="text-base font-black text-white">{totalOrdersCount}</span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
                  <span className="text-slate-400 text-[10px] block">Total Spent</span>
                  <span className="text-base font-black text-emerald-400">
                    ₹{totalSpentINR.toLocaleString()}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
                  <span className="text-slate-400 text-[10px] block">PDF Downloads</span>
                  <span className="text-base font-black text-blue-400">{totalDownloads}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenMyDownloads();
            }}
            className="px-3.5 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>My Purchased PDFs</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="px-3.5 py-2 bg-red-950/40 hover:bg-red-950/70 text-red-400 border border-red-800/60 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
