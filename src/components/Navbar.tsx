import React, { useState } from 'react';
import { Currency, User } from '../types';
import {
  FileText,
  Search,
  ShoppingCart,
  Download,
  PlusCircle,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  User as UserIcon,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenMyDownloads: () => void;
  onOpenSellerStudio: () => void;
  onOpenAdmin: () => void;
  myDownloadsCount: number;
  user: User | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenProfile: () => void;
}

const CATEGORIES = [
  'All',
  'eBook',
  'Guide',
  'Cheat Sheet',
  'Template',
  'Workbook',
  'Finance'
];

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  onCurrencyChange,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  cartCount,
  onOpenCart,
  onOpenMyDownloads,
  onOpenSellerStudio,
  onOpenAdmin,
  myDownloadsCount,
  user,
  onOpenAuth,
  onLogout,
  onOpenProfile
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  return (
    <header id="main-header" className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Top Notification Bar */}
      <div id="trust-banner" className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-1.5 text-xs text-center font-medium text-white flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>Instant Digital Delivery: Get immediate PDF access right after payment!</span>
        <span className="hidden sm:inline-block bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
          100% Verified PDFs
        </span>
      </div>

      {/* Primary Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div id="brand-logo-container" className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectCategory('All')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-white">PDF<span className="text-blue-400">Store</span></span>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-blue-500/30">
                Digital Files Only
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Instant PDF Marketplace & Creator Hub
            </p>
          </div>
        </div>

        {/* Search Input Bar */}
        <div id="search-input-wrapper" className="flex-1 max-w-md hidden md:block relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-pdf-input"
            type="text"
            placeholder="Search eBooks, guides, cheat sheets, templates..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Header Right Actions */}
        <div id="header-actions" className="flex items-center gap-2 sm:gap-3">
          {/* Admin Panel Quick Link Button */}
          <button
            id="header-admin-btn"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white text-xs font-bold border border-red-800/60 transition-all shadow-sm"
            title="Open Admin Console (/admin)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* My Purchases / Downloads */}
          <button
            id="my-downloads-btn"
            onClick={onOpenMyDownloads}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 relative transition-colors"
            title="View My Purchased PDF Downloads"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">My Downloads</span>
            {myDownloadsCount > 0 && (
              <span id="downloads-badge" className="bg-emerald-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {myDownloadsCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            id="cart-drawer-trigger"
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all relative"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span id="cart-counter-badge" className="bg-amber-400 text-slate-900 text-[11px] font-extrabold px-1.5 py-0.2 rounded-full ring-2 ring-slate-900">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Auth Section */}
          <div className="relative pl-1 border-l border-slate-800">
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-trigger"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-100 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-blue-500"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="hidden sm:inline font-bold truncate max-w-[100px]">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    id="user-profile-dropdown"
                    className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1"
                  >
                    <div
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenProfile();
                      }}
                      className="p-2.5 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800/80 mb-1 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white truncate group-hover:text-blue-400 transition-colors">{user.name}</p>
                        <UserIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400" />
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {user.role === 'seller' ? 'Creator / Seller' : 'PDF Buyer'}
                      </span>
                    </div>

                    <button
                      id="view-profile-menu-btn"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2 font-semibold"
                    >
                      <UserIcon className="w-4 h-4 text-purple-400" />
                      <span>View Profile & Spend Summary</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenMyDownloads();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-blue-400" />
                      <span>My Purchased PDFs</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenSellerStudio();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-400" />
                      <span>List PDF for Sale</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenAdmin();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-950/30 text-red-300 flex items-center gap-2 font-semibold"
                    >
                      <ShieldCheck className="w-4 h-4 text-red-400" />
                      <span>Admin Management Console</span>
                    </button>

                    <hr className="border-slate-800 my-1" />

                    <button
                      id="logout-btn"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-950/40 text-red-400 hover:text-red-300 flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  id="header-login-btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-400" />
                  <span>Log In</span>
                </button>

                <button
                  id="header-signup-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow transition-all flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search PDF eBooks & Guides..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

    </header>
  );
};
