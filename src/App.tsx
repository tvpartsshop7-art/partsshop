import React, { useState, useEffect } from 'react';
import { Product, Currency, CartItem, Order, User, StoreSettings } from './types';
import { DEFAULT_STORE_SETTINGS } from './data/mockSettings';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OnlinePdfReaderModal } from './components/OnlinePdfReaderModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminErrorBoundary } from './components/admin/AdminErrorBoundary';
import {
  saveUserToSupabase,
  fetchUsersFromSupabase,
  saveProductToSupabase,
  deleteProductFromSupabase,
  fetchProductsFromSupabase,
  saveOrderToSupabase,
  fetchOrdersFromSupabase,
  saveSettingsToSupabase,
  fetchSettingsFromSupabase,
  subscribeToRealtimeChanges
} from './services/supabaseService';
import {
  FileText,
  ShieldCheck,
  Zap,
  Download,
  Lock,
  Sparkles,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Star,
  Megaphone,
  ShoppingCart,
  User as UserIcon
} from 'lucide-react';

export default function App() {
  const checkIsAdminRoute = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      return (
        path.startsWith('/admin') ||
        path.includes('admin') ||
        hash.includes('admin') ||
        search.includes('admin')
      );
    }
    return false;
  };

  // Routing State: 'store' | 'admin'
  const [currentRoute, setCurrentRoute] = useState<'store' | 'admin'>(() => {
    return checkIsAdminRoute() ? 'admin' : 'store';
  });

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('pdfstore_admin_auth');
    }
    return false;
  });

  // Listen to browser URL changes, hash changes & back/forward navigation
  useEffect(() => {
    const handleLocationChange = () => {
      if (checkIsAdminRoute()) {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('store');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Programmatic router navigation helper
  const navigateTo = (route: 'store' | 'admin') => {
    if (route === 'admin') {
      window.history.pushState(null, '', '/admin');
      setCurrentRoute('admin');
    } else {
      window.history.pushState(null, '', '/');
      setCurrentRoute('store');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('pdfstore_admin_auth');
    setIsAdminAuthenticated(false);
  };

  // Store Currency
  const [currency, setCurrency] = useState<Currency>('INR');

  // User Auth State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pdfstore_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authNotice, setAuthNotice] = useState('');
  const [pendingCheckout, setPendingCheckout] = useState<{ items: CartItem[]; discount: number } | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pdfstore_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pdfstore_user');
    }
  }, [user]);

  const handleOpenAuth = (mode: 'login' | 'signup', notice: string = '') => {
    setAuthMode(mode);
    setAuthNotice(notice);
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthOpen(false);
    setAuthNotice('');

    // Save/sync user profile directly to Supabase cloud
    saveUserToSupabase(loggedInUser);

    // If a purchase was initiated before logging in, resume it immediately!
    if (pendingCheckout) {
      setCheckoutItems(pendingCheckout.items);
      setCheckoutDiscount(pendingCheckout.discount);
      setIsPaymentModalOpen(true);
      setPendingCheckout(null);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCloudSyncing, setIsCloudSyncing] = useState(true);

  // Master Products State (Loaded purely from Supabase)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pdfstore_products_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('pdfstore_products_db', JSON.stringify(products));
  }, [products]);

  // Master Users State (Loaded purely from Supabase)
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('pdfstore_users_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('pdfstore_users_db', JSON.stringify(users));
  }, [users]);

  // Master Orders State (Loaded purely from Supabase)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pdfstore_orders_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('pdfstore_orders_db', JSON.stringify(orders));
  }, [orders]);

  // Store Settings (Announcement, Coupons, etc.)
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('pdfstore_settings_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.storeName) {
          return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_STORE_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('pdfstore_settings_db', JSON.stringify(settings));
  }, [settings]);

  // Cloud Fetch & Synchronization with Supabase
  const handleRefreshFromCloud = async () => {
    setIsCloudSyncing(true);
    try {
      const [cloudProducts, cloudUsers, cloudOrders, cloudSettings] = await Promise.all([
        fetchProductsFromSupabase(),
        fetchUsersFromSupabase(),
        fetchOrdersFromSupabase(),
        fetchSettingsFromSupabase()
      ]);

      if (cloudProducts !== null) {
        setProducts(cloudProducts);
      }
      if (cloudUsers !== null) {
        setUsers(cloudUsers);
      }
      if (cloudOrders !== null) {
        setOrders(cloudOrders);
      }
      if (cloudSettings !== null) {
        setSettings(cloudSettings);
      }
    } catch (err) {
      console.warn('Supabase sync note:', err);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    handleRefreshFromCloud();

    // Live Real-Time Supabase Listener across all tables
    const unsubscribe = subscribeToRealtimeChanges({
      onProductsUpdate: async () => {
        const fresh = await fetchProductsFromSupabase();
        if (fresh !== null) setProducts(fresh);
      },
      onOrdersUpdate: async () => {
        const fresh = await fetchOrdersFromSupabase();
        if (fresh !== null) setOrders(fresh);
      },
      onUsersUpdate: async () => {
        const fresh = await fetchUsersFromSupabase();
        if (fresh !== null) setUsers(fresh);
      },
      onSettingsUpdate: async () => {
        const fresh = await fetchSettingsFromSupabase();
        if (fresh !== null) setSettings(fresh);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pdfstore_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('pdfstore_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Modal Controls
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [initialProductTab, setInitialProductTab] = useState<'overview' | 'sample' | 'toc' | 'ai'>('overview');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);

  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [onlineReaderProduct, setOnlineReaderProduct] = useState<Product | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Cart helper actions
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Direct Buy Now handler (Strictly requires User Login/Signup first)
  const handleBuyNow = (product: Product) => {
    if (!user) {
      setPendingCheckout({ items: [{ product, quantity: 1 }], discount: 0 });
      setSelectedProduct(null);
      handleOpenAuth('login', 'Please log in or create an account first to purchase & instantly view this schematic online.');
      return;
    }
    setCheckoutItems([{ product, quantity: 1 }]);
    setCheckoutDiscount(0);
    setIsPaymentModalOpen(true);
  };

  // Proceed to Checkout from Cart Drawer (Strictly requires User Login/Signup first)
  const handleProceedToCheckoutFromCart = (discount: number) => {
    if (!user) {
      setPendingCheckout({ items: cartItems, discount });
      setIsCartOpen(false);
      handleOpenAuth('login', 'Please log in or create an account first to complete your checkout and view your purchased schematics online.');
      return;
    }
    setCheckoutItems(cartItems);
    setCheckoutDiscount(discount);
    setIsCartOpen(false);
    setIsPaymentModalOpen(true);
  };

  // Payment Success Handler (Updates Orders, Sales Count & User History in real-time)
  const handlePaymentSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setIsPaymentModalOpen(false);
    setCartItems([]); // Clear cart
    setLatestOrder(newOrder); // Open Order Success Modal

    // Save order directly to Supabase cloud
    saveOrderToSupabase(newOrder);

    // Update salesCount on purchased products and sync each to Supabase
    const purchasedIds = new Set(newOrder.items.map((i) => i.product.id));
    setProducts((prev) =>
      prev.map((p) => {
        if (purchasedIds.has(p.id)) {
          const updated = { ...p, salesCount: (p.salesCount || 0) + 1 };
          saveProductToSupabase(updated);
          return updated;
        }
        return p;
      })
    );

    // If user is logged in or new buyer, update/add user statistics & sync to Supabase
    setUsers((prev) => {
      const existingUser = prev.find(
        (u) => u.email.toLowerCase() === newOrder.customerEmail.toLowerCase()
      );
      if (existingUser) {
        const updatedUser: User = {
          ...existingUser,
          totalPurchases: (existingUser.totalPurchases || 0) + 1,
          totalSpentINR: (existingUser.totalSpentINR || 0) + (newOrder.totalAmountINR || 0),
          totalDownloads: (existingUser.totalDownloads || 0) + (newOrder.downloadCount || 1)
        };
        saveUserToSupabase(updatedUser);
        return prev.map((u) => (u.id === existingUser.id ? updatedUser : u));
      } else {
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: newOrder.customerName || 'Customer',
          email: newOrder.customerEmail,
          phone: newOrder.customerPhone || '+91 98765 00000',
          role: 'buyer',
          status: 'active',
          totalPurchases: 1,
          totalSpentINR: newOrder.totalAmountINR || 0,
          totalDownloads: newOrder.downloadCount || 1,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        saveUserToSupabase(newUser);
        return [newUser, ...prev];
      }
    });
  };

  // Admin sync helpers
  const handleAdminUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    newProducts.forEach((p) => saveProductToSupabase(p));
  };

  const handleAdminUpdateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    newUsers.forEach((u) => saveUserToSupabase(u));
  };

  const handleAdminUpdateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    saveSettingsToSupabase(newSettings);
  };

  // Filtered Active Products List for Storefront (100% Null-Safe)
  const filteredProducts = products.filter((p) => {
    if (!p) return false;
    if (p.isActive === false) return false;
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return matchesCategory;

    const titleStr = (p.title || '').toLowerCase();
    const subStr = (p.subtitle || '').toLowerCase();
    const descStr = (p.description || '').toLowerCase();
    const authorStr = (p.authorName || '').toLowerCase();
    const catStr = (p.category || '').toLowerCase();

    const matchesSearch =
      titleStr.includes(q) ||
      subStr.includes(q) ||
      descStr.includes(q) ||
      authorStr.includes(q) ||
      catStr.includes(q);

    return matchesCategory && matchesSearch;
  });

  const cartTotalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // -------------------------------------------------------------
  // ROUTE: ADMIN PANEL
  // -------------------------------------------------------------
  if (currentRoute === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => setIsAdminAuthenticated(true)}
          onBackToStore={() => navigateTo('store')}
        />
      );
    }

    return (
      <AdminErrorBoundary onBackToStore={() => navigateTo('store')}>
        <AdminPanel
          products={products}
          users={users}
          orders={orders}
          settings={settings}
          onUpdateProducts={handleAdminUpdateProducts}
          onUpdateUsers={handleAdminUpdateUsers}
          onUpdateSettings={handleAdminUpdateSettings}
          onLogoutAdmin={handleAdminLogout}
          onBackToStore={() => navigateTo('store')}
          onRefreshFromCloud={handleRefreshFromCloud}
          isRefreshingCloud={isCloudSyncing}
        />
      </AdminErrorBoundary>
    );
  }

  // -------------------------------------------------------------
  // ROUTE: PUBLIC STOREFRONT (DEFAULT)
  // -------------------------------------------------------------
  return (
    <div id="app-root" className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white flex flex-col">
      {/* Top Announcement Banner (Controlled from Admin) */}
      {settings.announcementActive && settings.announcementText && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 text-xs font-black py-2 px-4 text-center flex items-center justify-center gap-2 shadow-md relative z-40">
          <Megaphone className="w-3.5 h-3.5 shrink-0" />
          <span>{settings.announcementText}</span>
        </div>
      )}

      {/* Header Navigation Bar */}
      <Navbar
        currency={currency}
        onCurrencyChange={setCurrency}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Hero Section (Optimized for Mobile View) */}
      <section id="hero-section" className="relative bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800/80 pt-6 sm:pt-10 pb-8 sm:pb-12 overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[200px] sm:h-[300px] bg-blue-600/10 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] sm:text-xs font-bold">
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-blue-400" />
            <span>Digital PDF Store • Schematics & Service Manuals</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Technical TV Schematics & Instant PDF Hub
          </h1>

          <p className="text-xs sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
            Instant online access to verified technical schematics, circuit manuals, motherboard guides, and diagrams.
          </p>

          {/* Quick Metrics Bar (Responsive Grid on Mobile) */}
          <div className="pt-2 sm:pt-4 grid grid-cols-3 gap-2 sm:gap-6 max-w-2xl mx-auto text-[10px] sm:text-xs text-slate-300 font-semibold">
            <div className="bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant Online View</span>
            </div>
            <div className="bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <Lock className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Secure UPI & Cards</span>
            </div>
            <div className="bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Verified Schematics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Store Area */}
      <main id="main-store-container" className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8 pb-24 md:pb-10">
        {/* Section Title & Filter Summary */}
        <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0" />
              <span className="truncate">
                All Featured Technical Schematics
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Showing {filteredProducts.length} schematics ready for instant online access
            </p>
          </div>
        </div>

        {/* Product Grid (Pure Supabase Live Data) */}
        {isCloudSyncing && products.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-base font-bold text-white">Connecting to Supabase Database...</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Fetching live technical schematics, products, and configurations.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-slate-900/50 rounded-3xl border border-slate-800 p-6">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">
              {products.length === 0 ? 'No Products in Supabase Yet' : 'No PDF files found'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {products.length === 0
                ? 'Your Supabase database is connected! Upload your first TV circuit schematic or PDF product in the Admin Panel.'
                : `We couldn't find any products matching "${searchQuery}". Try resetting your filter.`}
            </p>
            {products.length === 0 ? (
              <button
                onClick={() => navigateTo('admin')}
                className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Go to Admin Panel to Upload
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setInitialProductTab('overview');
                }}
                onPreviewSample={(p) => {
                  setSelectedProduct(p);
                  setInitialProductTab('sample');
                }}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                isInCart={cartItems.some((item) => item.product.id === product.id)}
              />
            ))}
          </div>
        )}

        {/* Feature Highlights Banner */}
        <section className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-slate-800/80">
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8 px-2">
            <h3 className="text-base sm:text-lg font-bold text-white">Why Buy Technical Schematics Here?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Zero shipping delays, instant online access, clean high-resolution schematics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6">
            <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Instant Online Access</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                As soon as your payment is authorized, your schematic is unlocked instantly for online viewing.
              </p>
            </div>

            <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Verified Technician Licensing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every schematic features a personalized buyer license seal and secure watermark overlay.
              </p>
            </div>

            <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Protected Viewer</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Access your purchased documents securely inside our built-in secure browser reader.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 mt-10 py-6 sm:py-8 text-xs text-slate-500 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-slate-300">PartsShop</span>
            <span>— Technical PDF Schematics Marketplace</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>256-Bit SSL Encrypted</span>
            <span>Instant Access Guarantee</span>
          </div>
        </div>
      </footer>

      {/* Floating Mobile Bottom Navigation Bar (Visible only on mobile/tablet screens) */}
      <nav id="mobile-bottom-nav" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-2 py-2 flex items-center justify-around text-[10px] text-slate-400 shadow-2xl safe-area-bottom">
        {/* Store / Home */}
        <button
          onClick={() => {
            setSelectedCategory('All');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-colors ${
            selectedCategory === 'All' ? 'text-blue-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span>Store</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl hover:text-slate-200 transition-colors relative"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-blue-400" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-400 text-slate-950 text-[9px] font-black px-1 rounded-full">
                {cartTotalCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        {/* User Profile / Login */}
        <button
          onClick={() => (user ? setIsProfileOpen(true) : handleOpenAuth('login'))}
          className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl hover:text-slate-200 transition-colors"
        >
          {user ? (
            user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-blue-400"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                {user.name.charAt(0)}
              </div>
            )
          ) : (
            <UserIcon className="w-5 h-5 text-slate-400" />
          )}
          <span className="truncate max-w-[60px]">{user ? 'Profile' : 'Log In'}</span>
        </button>
      </nav>

      {/* Modals & Overlays */}
      <ProductDetailModal
        product={selectedProduct}
        currency={currency}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        initialTab={initialProductTab}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        currency={currency}
        onProceedToCheckout={handleProceedToCheckoutFromCart}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        items={checkoutItems}
        currency={currency}
        discountAmount={checkoutDiscount}
        onPaymentSuccess={handlePaymentSuccess}
        currentUser={user}
      />

      <OrderSuccessModal
        order={latestOrder}
        onClose={() => setLatestOrder(null)}
        onOpenOnlineReader={(p) => setOnlineReaderProduct(p)}
      />

      <OnlinePdfReaderModal
        product={onlineReaderProduct}
        onClose={() => setOnlineReaderProduct(null)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        authNotice={authNotice}
        onClose={() => {
          setIsAuthOpen(false);
          setAuthNotice('');
          setPendingCheckout(null);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        orders={orders}
        currency={currency}
        onOpenOnlineReader={(p) => setOnlineReaderProduct(p)}
        onLogout={handleLogout}
        onUpdateUser={(updated) => {
          setUser(updated);
          setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        }}
      />
    </div>
  );
}
