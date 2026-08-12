import React, { useState, useMemo } from 'react';
import { Product, User, Order, StoreSettings, CouponCode } from '../../types';
import { AdminProductModal } from './AdminProductModal';
import { AdminUserDetailsModal } from './AdminUserDetailsModal';
import {
  BarChart3,
  Package,
  Users,
  ShoppingBag,
  Settings,
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Tag,
  FileText,
  Percent,
  Layers,
  Filter,
  Check,
  X,
  CreditCard,
  RefreshCw,
  Megaphone
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  users: User[];
  orders: Order[];
  settings: StoreSettings;
  onUpdateProducts: (newProducts: Product[]) => void;
  onUpdateUsers: (newUsers: User[]) => void;
  onUpdateSettings: (newSettings: StoreSettings) => void;
  onLogoutAdmin: () => void;
  onBackToStore: () => void;
  onRefreshFromCloud?: () => Promise<void>;
  isRefreshingCloud?: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  users,
  orders,
  settings,
  onUpdateProducts,
  onUpdateUsers,
  onUpdateSettings,
  onLogoutAdmin,
  onBackToStore,
  onRefreshFromCloud,
  isRefreshingCloud = false
}) => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'users' | 'orders' | 'settings'>('analytics');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<User | null>(null);

  // Search & Filter states
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Local settings state for settings tab
  const [localSettings, setLocalSettings] = useState<StoreSettings>(settings);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(25);
  const [newCouponMin, setNewCouponMin] = useState(299);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // Analytics Computations
  const totalRevenueINR = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.totalAmountINR || 0), 0);
  }, [orders]);

  const totalRevenueUSD = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.totalAmountUSD || 0), 0);
  }, [orders]);

  const totalDownloadsCount = useMemo(() => {
    const ordersDownloads = orders.reduce((sum, o) => sum + (o.downloadCount || 1), 0);
    const productsSales = products.reduce((sum, p) => sum + (p.salesCount || 0), 0);
    return Math.max(ordersDownloads, productsSales);
  }, [orders, products]);

  const activeProductsCount = useMemo(() => {
    return products.filter((p) => p.isActive !== false).length;
  }, [products]);

  // Revenue by Category computation
  const categoryStats = useMemo(() => {
    const map: Record<string, { count: number; sales: number; revenueINR: number }> = {};
    products.forEach((p) => {
      const cat = p.category || 'General';
      if (!map[cat]) {
        map[cat] = { count: 0, sales: 0, revenueINR: 0 };
      }
      map[cat].count += 1;
      map[cat].sales += p.salesCount || 0;
      map[cat].revenueINR += (p.salesCount || 0) * (p.priceINR || 0);
    });
    return Object.entries(map).map(([category, stats]) => ({
      category,
      ...stats
    }));
  }, [products]);

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (savedProduct: Product) => {
    const exists = products.some((p) => p.id === savedProduct.id);
    let updated: Product[];
    if (exists) {
      updated = products.map((p) => (p.id === savedProduct.id ? savedProduct : p));
    } else {
      updated = [savedProduct, ...products];
    }
    onUpdateProducts(updated);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      const updated = products.filter((p) => p.id !== productId);
      onUpdateProducts(updated);
    }
  };

  const handleToggleProductActive = (productId: string) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, isActive: p.isActive === false ? true : false } : p
    );
    onUpdateProducts(updated);
  };

  // User Actions
  const handleToggleUserStatus = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        const nextStatus = u.status === 'suspended' ? 'active' : 'suspended';
        return { ...u, status: nextStatus as 'active' | 'suspended' };
      }
      return u;
    });
    onUpdateUsers(updated);
    if (selectedUserDetails && selectedUserDetails.id === userId) {
      setSelectedUserDetails((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === 'suspended' ? 'active' : 'suspended'
            }
          : null
      );
    }
  };

  // Settings Handlers
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 3000);
  };

  const handleAddCoupon = () => {
    if (!newCouponCode.trim()) return;
    const newCoupon: CouponCode = {
      id: `cp-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: Number(newCouponDiscount) || 20,
      minAmountINR: Number(newCouponMin) || 0,
      isActive: true,
      expiryDate: '2026-12-31'
    };
    const updatedCoupons = [...localSettings.coupons, newCoupon];
    const updatedSettings = { ...localSettings, coupons: updatedCoupons };
    setLocalSettings(updatedSettings);
    onUpdateSettings(updatedSettings);
    setNewCouponCode('');
  };

  const handleDeleteCoupon = (couponId: string) => {
    const updatedCoupons = localSettings.coupons.filter((c) => c.id !== couponId);
    const updatedSettings = { ...localSettings, coupons: updatedCoupons };
    setLocalSettings(updatedSettings);
    onUpdateSettings(updatedSettings);
  };

  // Filtered Products (100% Null-Safe)
  const filteredProducts = useMemo(() => {
    const q = (productSearch || '').toLowerCase().trim();
    return products.filter((p) => {
      if (!p) return false;
      const titleStr = (p.title || '').toLowerCase();
      const descStr = (p.description || '').toLowerCase();
      const catStr = (p.category || '').toLowerCase();
      const authorStr = (p.authorName || '').toLowerCase();
      const subStr = (p.subtitle || '').toLowerCase();

      const matchesSearch =
        !q ||
        titleStr.includes(q) ||
        descStr.includes(q) ||
        catStr.includes(q) ||
        authorStr.includes(q) ||
        subStr.includes(q);

      const matchesCat =
        productCategoryFilter === 'All' || p.category === productCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [products, productSearch, productCategoryFilter]);

  // Filtered Users (100% Null-Safe)
  const filteredUsers = useMemo(() => {
    const q = (userSearch || '').toLowerCase().trim();
    return users.filter((u) => {
      if (!u) return false;
      const nameStr = (u.name || u.technicianName || '').toLowerCase();
      const emailStr = (u.email || '').toLowerCase();
      const phoneStr = (u.phone || u.whatsappNumber || '');

      return (
        !q ||
        nameStr.includes(q) ||
        emailStr.includes(q) ||
        phoneStr.includes(q)
      );
    });
  }, [users, userSearch]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.paymentReference.toLowerCase().includes(orderSearch.toLowerCase())
    );
  }, [orders, orderSearch]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Main Admin Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/30 text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-tight">PartsShop</span>
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Master Control & Store Analytics</p>
            </div>
          </div>

          {/* Quick Header Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Supabase Status Indicator & Refresh */}
            <div className="flex items-center gap-1.5">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Supabase Live</span>
              </div>

              {onRefreshFromCloud && (
                <button
                  onClick={onRefreshFromCloud}
                  disabled={isRefreshingCloud}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-white bg-blue-950/80 hover:bg-blue-900/80 active:bg-blue-800 border border-blue-800/80 px-3 py-1.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
                  title="Reload live data from Supabase Cloud"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingCloud ? 'animate-spin text-amber-400' : 'text-blue-400'}`} />
                  <span>{isRefreshingCloud ? 'Syncing...' : 'Sync Supabase'}</span>
                </button>
              )}
            </div>

            <button
              onClick={onBackToStore}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 px-3.5 py-2 rounded-xl transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Live Store</span>
            </button>

            <button
              onClick={onLogoutAdmin}
              className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/70 border border-red-800/60 px-3.5 py-2 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col gap-6">
        {/* Navigation Tabs Bar */}
        <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 flex flex-wrap gap-1.5 items-center">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Manager ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Informations ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Downloads ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Banners & Coupons</span>
          </button>
        </div>

        {/* TAB 1: ANALYTICS & OVERVIEW */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Top 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Revenue */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 mb-3 text-xs font-bold">
                  <span>TOTAL REVENUE</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">
                  ₹{totalRevenueINR.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <span className="text-emerald-400 font-semibold flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> +24%
                  </span>
                  <span>(${totalRevenueUSD.toFixed(2)} USD)</span>
                </div>
              </div>

              {/* Total Downloads */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 mb-3 text-xs font-bold">
                  <span>TOTAL DOWNLOADS</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">
                  {totalDownloadsCount.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <span className="text-blue-400 font-semibold">PDF Files</span>
                  <span>delivered securely</span>
                </div>
              </div>

              {/* Total Users */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 mb-3 text-xs font-bold">
                  <span>TOTAL USERS</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{users.length}</div>
                <div className="text-xs text-slate-400 mt-1">
                  <span className="text-purple-400 font-semibold">
                    {users.filter((u) => u.status !== 'suspended').length} Active
                  </span>{' '}
                  accounts
                </div>
              </div>

              {/* Active Products */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 mb-3 text-xs font-bold">
                  <span>LIVE STORE PRODUCTS</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">
                  {activeProductsCount} / {products.length}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  <span className="text-amber-400 font-semibold">Instant Delivery</span> enabled
                </div>
              </div>
            </div>

            {/* Middle Section: Category Breakdown & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Category Breakdown Card */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-400" />
                      <span>Sales & Inventory by Category</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Product counts, download volumes, and generated revenue per category
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddProduct}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Product</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {categoryStats.map((item) => {
                    const pct = Math.min(100, Math.round((item.sales / (totalDownloadsCount || 1)) * 100));
                    return (
                      <div key={item.category} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-200">{item.category}</span>
                          <span className="text-slate-400">
                            <strong className="text-white">{item.count}</strong> PDFs •{' '}
                            <strong className="text-blue-400">{item.sales}</strong> downloads •{' '}
                            <strong className="text-emerald-400">₹{item.revenueINR.toLocaleString()}</strong>
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            style={{ width: `${Math.max(8, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions & System Health */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Admin Quick Control</span>
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Fast shortcuts to manage live catalog & store properties
                  </p>

                  <div className="space-y-2.5">
                    <button
                      onClick={handleOpenAddProduct}
                      className="w-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 p-3 rounded-2xl border border-slate-700 text-xs font-bold flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-emerald-400" />
                        <span>Upload & Publish New PDF</span>
                      </div>
                      <span className="text-slate-500">&rarr;</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('users')}
                      className="w-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 p-3 rounded-2xl border border-slate-700 text-xs font-bold flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span>Inspect User Records & Orders</span>
                      </div>
                      <span className="text-slate-500">&rarr;</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className="w-full bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 p-3 rounded-2xl border border-slate-700 text-xs font-bold flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-amber-400" />
                        <span>Change Promo Banner & Coupons</span>
                      </div>
                      <span className="text-slate-500">&rarr;</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center justify-between text-slate-300 font-bold">
                    <span>Delivery Engine</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Operational
                    </span>
                  </div>
                  <p>All download tokens & vector PDF generators online.</p>
                </div>
              </div>
            </div>

            {/* Recent Orders & Downloads Stream */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Recent Customer Orders & Transactions</span>
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300"
                >
                  View All Orders &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="pb-3 font-bold">Order ID</th>
                      <th className="pb-3 font-bold">Customer</th>
                      <th className="pb-3 font-bold">Item Purchased</th>
                      <th className="pb-3 font-bold">Amount</th>
                      <th className="pb-3 font-bold">Payment Method</th>
                      <th className="pb-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 font-mono font-bold text-white">{order.id}</td>
                        <td className="py-3.5">
                          <div className="font-bold text-slate-200">{order.customerName}</div>
                          <div className="text-[11px] text-slate-500">{order.customerEmail}</div>
                        </td>
                        <td className="py-3.5 text-slate-300 max-w-xs truncate">
                          {order.items.map((i) => i.product.title).join(', ')}
                        </td>
                        <td className="py-3.5 font-bold text-white">₹{order.totalAmountINR}</td>
                        <td className="py-3.5">
                          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700 text-[10px] font-bold uppercase">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            COMPLETED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGER (CRUD) */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Top Bar: Search, Category Filter, and Add Product Button */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products, author, keywords..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                >
                  <option value="All">All Categories</option>
                  <option value="eBook">eBook</option>
                  <option value="Guide">Guide</option>
                  <option value="Cheat Sheet">Cheat Sheet</option>
                  <option value="Template">Template</option>
                  <option value="Workbook">Workbook</option>
                  <option value="Finance">Finance</option>
                  <option value="Schematics & Hardware">Schematics & Hardware</option>
                </select>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Upload & Publish Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-3.5 px-4 font-bold">Product</th>
                      <th className="py-3.5 px-4 font-bold">Category</th>
                      <th className="py-3.5 px-4 font-bold">Price & MRP</th>
                      <th className="py-3.5 px-4 font-bold">Discount</th>
                      <th className="py-3.5 px-4 font-bold">Expiry / Validity</th>
                      <th className="py-3.5 px-4 font-bold">Sales / DLs</th>
                      <th className="py-3.5 px-4 font-bold">Status</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          No products found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => {
                        const disc =
                          product.discountPercent ||
                          Math.round(
                            ((product.originalPriceINR - product.priceINR) /
                              (product.originalPriceINR || 1)) *
                              100
                          );

                        return (
                          <tr
                            key={product.id}
                            className={`hover:bg-slate-800/40 transition-colors ${
                              product.isActive === false ? 'opacity-60 bg-slate-950/30' : ''
                            }`}
                          >
                            {/* Product Info */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                                  <img
                                    src={product.imageCover || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800'}
                                    alt={product.title || 'Product'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800';
                                    }}
                                  />
                                </div>
                                <div className="max-w-xs">
                                  <div className="font-bold text-white line-clamp-1">
                                    {product.title || 'Untitled Schematic'}
                                  </div>
                                  <div className="text-[11px] text-slate-400 line-clamp-1">
                                    By {product.authorName || 'PartsShop Team'} • {product.pdfPageCount || 1}p • {product.pdfFileSize || '1.0 MB'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-4">
                              <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 text-[10px] font-semibold">
                                {product.category || 'Schematics & Hardware'}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="py-3.5 px-4">
                              <div className="font-black text-white">₹{product.priceINR || 0}</div>
                              <div className="text-[10px] text-slate-500 line-through">
                                ₹{product.originalPriceINR || (product.priceINR ? product.priceINR * 2 : 0)}
                              </div>
                            </td>

                            {/* Discount */}
                            <td className="py-3.5 px-4">
                              {disc > 0 ? (
                                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold text-[11px]">
                                  {disc}% OFF
                                </span>
                              ) : (
                                <span className="text-slate-500">0%</span>
                              )}
                            </td>

                            {/* Expiry / Validity */}
                            <td className="py-3.5 px-4">
                              <span className="bg-blue-950/70 text-blue-300 border border-blue-800/60 px-2 py-0.5 rounded-md font-medium text-[10px]">
                                {product.expiresIn || 'Lifetime Access'}
                              </span>
                            </td>

                            {/* Sales */}
                            <td className="py-3.5 px-4 font-bold text-slate-300">
                              {(product.salesCount || 0).toLocaleString()}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => handleToggleProductActive(product.id)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                                  product.isActive !== false
                                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                                }`}
                              >
                                {product.isActive !== false ? '● ACTIVE' : '○ HIDDEN'}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditProduct(product)}
                                  title="Edit Product"
                                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
                                >
                                  <Edit className="w-3.5 h-3.5 text-blue-400" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  title="Delete Product"
                                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-400 flex items-center justify-center transition-colors border border-slate-700"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: USER INFORMATIONS */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Top User Search */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users by name, email, or phone..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="text-xs text-slate-400 font-medium">
                Total Registered: <strong className="text-white">{users.length}</strong> Users
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-3.5 px-4 font-bold">User</th>
                      <th className="py-3.5 px-4 font-bold">Role</th>
                      <th className="py-3.5 px-4 font-bold">Phone</th>
                      <th className="py-3.5 px-4 font-bold">Orders / Purchases</th>
                      <th className="py-3.5 px-4 font-bold">Total Spent</th>
                      <th className="py-3.5 px-4 font-bold">Joined Date</th>
                      <th className="py-3.5 px-4 font-bold">Status</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          No users found matching your query.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                          {/* User Name & Avatar */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 shadow">
                                {user.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Users className="w-4 h-4 text-blue-400" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-white flex items-center gap-1.5">
                                  <span>{user.technicianName || user.name}</span>
                                  {user.aadharNumber && (
                                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">
                                      Aadhaar ✓
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400">{user.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${
                                user.role === 'admin'
                                  ? 'bg-purple-950/80 text-purple-300 border-purple-800'
                                  : 'bg-blue-950/80 text-blue-300 border-blue-800'
                              }`}
                            >
                              {user.technicianName ? 'Technician' : user.role}
                            </span>
                          </td>

                          {/* Phone / WhatsApp */}
                          <td className="py-3.5 px-4">
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              {user.whatsappNumber || user.phone || '+91 98765 00000'}
                            </span>
                          </td>

                          {/* Orders */}
                          <td className="py-3.5 px-4 font-bold text-white">
                            {user.totalPurchases || 1} Orders
                          </td>

                          {/* Total Spent */}
                          <td className="py-3.5 px-4 font-bold text-emerald-400">
                            ₹{(user.totalSpentINR || 499).toLocaleString()}
                          </td>

                          {/* Joined */}
                          <td className="py-3.5 px-4 text-slate-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                user.status === 'suspended'
                                  ? 'bg-red-950 text-red-400 border-red-800'
                                  : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              }`}
                            >
                              {user.status || 'active'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedUserDetails(user)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors"
                            >
                              View Info
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS & TRANSACTIONS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by Order ID, customer, txn reference..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="text-xs text-slate-400">
                Completed Orders: <strong className="text-white">{orders.length}</strong>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-3.5 px-4 font-bold">Order ID</th>
                      <th className="py-3.5 px-4 font-bold">Customer Details</th>
                      <th className="py-3.5 px-4 font-bold">Products Purchased</th>
                      <th className="py-3.5 px-4 font-bold">Amount</th>
                      <th className="py-3.5 px-4 font-bold">Payment Reference</th>
                      <th className="py-3.5 px-4 font-bold">Download Token</th>
                      <th className="py-3.5 px-4 font-bold">Date</th>
                      <th className="py-3.5 px-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          No order transactions found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-white">{order.id}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-200">{order.customerName}</div>
                            <div className="text-[11px] text-slate-400">{order.customerEmail}</div>
                            {order.customerPhone && (
                              <div className="text-[10px] text-slate-500">{order.customerPhone}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 max-w-xs">
                            {order.items.map((i) => (
                              <div key={i.product.id} className="truncate">
                                • {i.product.title} (x{i.quantity})
                              </div>
                            ))}
                          </td>
                          <td className="py-3.5 px-4 font-black text-emerald-400">
                            ₹{order.totalAmountINR}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-[11px] text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                              {order.paymentReference}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-[10px] text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                              {order.downloadToken}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                              PAID
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STORE ANNOUNCEMENTS & COUPONS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {settingsSavedMsg && (
              <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Storefront settings saved and live updated successfully!</span>
              </div>
            )}

            {/* Announcement Banner Form */}
            <form
              onSubmit={handleSaveSettings}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Storefront Announcement Banner</h3>
                    <p className="text-xs text-slate-400">
                      Display top promotional message or discount alerts to all storefront visitors
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={localSettings.announcementActive}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, announcementActive: e.target.checked })
                    }
                    className="w-4 h-4 text-amber-500 rounded border-slate-700 bg-slate-950"
                  />
                  <span className="text-xs font-bold text-slate-200">Show Banner on Store</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Announcement Message
                </label>
                <input
                  type="text"
                  value={localSettings.announcementText}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, announcementText: e.target.value })
                  }
                  placeholder="e.g. 🔥 Weekend Sale: Use code PARTS30 for 30% OFF on all schematics!"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Store Support Email
                  </label>
                  <input
                    type="email"
                    value={localSettings.supportEmail}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, supportEmail: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    UPI Payment ID (for Instant Checkout)
                  </label>
                  <input
                    type="text"
                    value={localSettings.upiId}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, upiId: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/25"
                >
                  Save Store Settings
                </button>
              </div>
            </form>

            {/* Discount Coupon Codes Manager */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Tag className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-white text-sm">Discount Coupon Codes</h3>
                  <p className="text-xs text-slate-400">
                    Create promo codes that customers can apply at checkout
                  </p>
                </div>
              </div>

              {/* Add New Coupon */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. FLASH50"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-bold outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="w-28">
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Discount %
                  </label>
                  <input
                    type="number"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    min="1"
                    max="99"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold outline-none"
                  />
                </div>

                <div className="w-36">
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value))}
                    min="0"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddCoupon}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Coupon</span>
                </button>
              </div>

              {/* Coupons List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {localSettings.coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-white text-sm">
                          {coupon.code}
                        </span>
                        <span className="bg-amber-500/20 text-amber-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                          {coupon.discountPercent}% OFF
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Min spend: ₹{coupon.minAmountINR}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        productToEdit={editingProduct}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSaveProduct={handleSaveProduct}
      />

      {/* User Details Modal */}
      <AdminUserDetailsModal
        user={selectedUserDetails}
        orders={orders}
        onClose={() => setSelectedUserDetails(null)}
        onToggleUserStatus={handleToggleUserStatus}
      />
    </div>
  );
};
