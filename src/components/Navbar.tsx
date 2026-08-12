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
  ChevronDown,
  Menu,
  X,
  Zap,
  Tag
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
  myDownloadsCount: number;
  user: User | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenProfile: () => void;
}

const CATEGORIES = [
  'All',
  'Schematics & Hardware',
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
  myDownloadsCount,
  user,
  onOpenAuth,
  onLogout,
  onOpenProfile
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 text-slate-100 shadow-2xl">
      {/* Top Trust Banner (Ultra-compact on Mobile) */}
      <div id="trust-banner" className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-3 py-1 text-[11px] sm:text-xs text-center font-semibold text-white flex items-center justify-center gap-1.5 shadow-inner">
        <Sparkles className="w-3 h-3 shrink-0 animate-pulse text-amber-300" />
        <span className="truncate">Instant Delivery: Verified PDF schematics delivered directly after payment!</span>
        <span className="hidden md:inline-block bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
          100% Watermarked
        </span>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Brand Logo */}
        <div
          id="brand-logo-container"
          className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0"
          onClick={() => onSelectCategory('All')}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/20 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-black text-lg sm:text-xl tracking-tight text-white">
                Parts<span className="text-blue-400">Shop</span>
              </span>
              <span className="bg-blue-500/20 text-blue-300 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-500/30">
                PDF
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden lg:block leading-tight">
              Schematics, Circuit Manuals & Technical E-Books
            </p>
          </div>
        </div>

        {/* Search Input Bar (Desktop) */}
        <div id="search-input-wrapper" className="flex-1 max-w-md hidden md:block relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-pdf-input"
            type="text"
            placeholder="Search TV schematics, circuit diagrams, books..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
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
        <div id="header-actions" className="flex items-center gap-1.5 sm:gap-3">
          {/* Currency Toggle */}
          <button
            onClick={() => onCurrencyChange(currency === 'INR' ? 'USD' : 'INR')}
            className="px-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-[11px] font-black border border-slate-700 transition-colors"
            title="Switch Currency"
          >
            {currency === 'INR' ? '₹ INR' : '$ USD'}
          </button>

          {/* My Purchases / Downloads */}
          <button
            id="my-downloads-btn"
            onClick={onOpenMyDownloads}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700/80 relative transition-colors"
            title="My Purchased Downloads"
          >
            <Download className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="hidden md:inline">My Downloads</span>
            {myDownloadsCount > 0 && (
              <span id="downloads-badge" className="bg-emerald-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {myDownloadsCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            id="cart-drawer-trigger"
            onClick={onOpenCart}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all relative"
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span id="cart-counter-badge" className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-slate-900">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth Button */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-trigger"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-100 text-xs font-bold border border-slate-700 transition-colors"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 sm:w-5 sm:h-5 rounded-full object-cover ring-1 ring-blue-500 shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="hidden sm:inline truncate max-w-[90px]">{user.technicianName || user.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    id="user-profile-dropdown"
                    className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1"
                  >
                    <div
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenProfile();
                      }}
                      className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 mb-1 cursor-pointer transition-colors"
                    >
                      <p className="font-bold text-white truncate">{user.technicianName || user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Technician Account
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2 font-bold"
                    >
                      <UserIcon className="w-4 h-4 text-blue-400" />
                      <span>My Profile & WhatsApp ID</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenMyDownloads();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2 font-medium"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>My Purchased PDFs</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenSellerStudio();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2 font-medium"
                    >
                      <PlusCircle className="w-4 h-4 text-amber-400" />
                      <span>Upload & Sell Schematics</span>
                    </button>

                    <hr className="border-slate-800 my-1" />

                    <button
                      id="logout-btn"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-950/40 text-red-400 hover:text-red-300 flex items-center gap-2 font-bold"
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
                  className="px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-400" />
                  <span>Log In</span>
                </button>

                <button
                  id="header-signup-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="hidden sm:flex px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow transition-all items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (Full Width on Mobile) */}
      <div className="px-3 pb-2 md:hidden">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search TV schematics, PDFs & manuals..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Swipeable Horizontal Category Tabs Bar (Mobile Optimized) */}
      <div className="border-t border-slate-800/80 bg-slate-950/90 px-3 py-2 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-2 min-w-max max-w-7xl mx-auto">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat === 'All' && <Tag className="w-3 h-3 text-blue-300" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
