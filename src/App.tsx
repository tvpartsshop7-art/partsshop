import React, { useState, useEffect } from 'react';
import { Product, Currency, CartItem, Order, User, StoreSettings } from './types';
import { MOCK_PRODUCTS } from './data/mockProducts';
import { MOCK_USERS } from './data/mockUsers';
import { MOCK_INITIAL_ORDERS } from './data/mockOrders';
import { DEFAULT_STORE_SETTINGS } from './data/mockSettings';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { MyDownloadsModal } from './components/MyDownloadsModal';
import { OnlinePdfReaderModal } from './components/OnlinePdfReaderModal';
import { SellerStudioModal } from './components/SellerStudioModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPanel } from './components/admin/AdminPanel';
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
  Megaphone
} from 'lucide-react';

export default function App() {
  // Routing State: 'store' | 'admin'
  const [currentRoute, setCurrentRoute] = useState<'store' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.startsWith('/admin') || hash === '#admin') {
        return 'admin';
      }
    }
    return 'store';
  });

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('pdfstore_admin_auth');
    }
    return false;
  });

  // Listen to browser URL changes & back/forward navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.startsWith('/admin') || hash === '#admin') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('store');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
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

  useEffect(() => {
    if (user) {
      localStorage.setItem('pdfstore_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pdfstore_user');
    }
  }, [user]);

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Master Products State (with localStorage persistence)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pdfstore_products_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return MOCK_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('pdfstore_products_db', JSON.stringify(products));
  }, [products]);

  // Master Users State (with localStorage persistence)
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('pdfstore_users_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return MOCK_USERS;
  });

  useEffect(() => {
    localStorage.setItem('pdfstore_users_db', JSON.stringify(users));
  }, [users]);

  // Master Orders State (with localStorage persistence)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pdfstore_orders_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return MOCK_INITIAL_ORDERS;
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
  const [isMyDownloadsOpen, setIsMyDownloadsOpen] = useState(false);
  const [onlineReaderProduct, setOnlineReaderProduct] = useState<Product | null>(null);
  const [isSellerStudioOpen, setIsSellerStudioOpen] = useState(false);
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

  // Direct Buy Now handler
  const handleBuyNow = (product: Product) => {
    setCheckoutItems([{ product, quantity: 1 }]);
    setCheckoutDiscount(0);
    setIsPaymentModalOpen(true);
  };

  // Proceed to Checkout from Cart Drawer
  const handleProceedToCheckoutFromCart = (discount: number) => {
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

    // Update salesCount on purchased products
    const purchasedIds = new Set(newOrder.items.map((i) => i.product.id));
    setProducts((prev) =>
      prev.map((p) => {
        if (purchasedIds.has(p.id)) {
          return { ...p, salesCount: (p.salesCount || 0) + 1 };
        }
        return p;
      })
    );

    // If user is logged in or new buyer, update/add user statistics
    setUsers((prev) => {
      const existingUser = prev.find(
        (u) => u.email.toLowerCase() === newOrder.customerEmail.toLowerCase()
      );
      if (existingUser) {
        return prev.map((u) =>
          u.id === existingUser.id
            ? {
                ...u,
                totalPurchases: (u.totalPurchases || 0) + 1,
                totalSpentINR: (u.totalSpentINR || 0) + (newOrder.totalAmountINR || 0),
                totalDownloads: (u.totalDownloads || 0) + (newOrder.downloadCount || 1)
              }
            : u
        );
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
        return [newUser, ...prev];
      }
    });
  };

  // Add Custom Product from Seller Studio
  const handleAddCustomProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  // Filtered Active Products List for Storefront
  const filteredProducts = products.filter((p) => {
    if (p.isActive === false) return false;
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.authorName && p.authorName.toLowerCase().includes(q));

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
      <AdminPanel
        products={products}
        users={users}
        orders={orders}
        settings={settings}
        onUpdateProducts={setProducts}
        onUpdateUsers={setUsers}
        onUpdateSettings={setSettings}
        onLogoutAdmin={handleAdminLogout}
        onBackToStore={() => navigateTo('store')}
      />
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
        onOpenMyDownloads={() => setIsMyDownloadsOpen(true)}
        onOpenSellerStudio={() => setIsSellerStudioOpen(true)}
        myDownloadsCount={orders.length}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Hero Section */}
      <section id="hero-section" className="relative bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800/80 pt-10 pb-12 overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 fill-blue-400" />
            <span>Digital Product Store • PDF Schematics & Guides</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Instant Digital PDF Store & Instant Delivery Gateway
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Buy verified technical schematics, circuit manuals, full-stack roadmaps, and cheat sheets.
            Get watermarked PDF downloads directly to your device right after payment.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Instant PDF Download</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Secure UPI & Card Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>100% Watermarked License</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Store Area */}
      <main id="main-store-container" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Section Title & Filter Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span>
                {selectedCategory === 'All' ? 'All Featured Digital PDF Products' : `${selectedCategory} PDF Files`}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Showing {filteredProducts.length} high-quality PDF files ready for instant access
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSellerStudioOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
            >
              <span>+ Quick Creator Upload</span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
            <FileText className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No PDF files found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              We couldn't find any products matching your query "{searchQuery}". Try selecting a different category or resetting your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <section className="mt-16 pt-8 border-t border-slate-800/80">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-lg font-bold text-white">Why Buy Digital PDFs Here?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Zero shipping delays, zero paper waste. Clean, high-resolution vector PDF formats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Instant Dynamic Delivery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                As soon as your payment is authorized, your custom PDF document is compiled and delivered instantly.
              </p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Verified Buyer Licensing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every downloaded PDF file features a personalized buyer license seal and order watermark.
              </p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Read Online or Offline</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Access your purchased PDF documents inside our built-in browser reader or download for offline reading.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-slate-300">PartsShop</span>
            <span>— Digital PDF Schematics & Technical Marketplace</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>256-Bit SSL Encrypted</span>
            <span>Instant Access Guarantee</span>
            <button
              onClick={() => navigateTo('admin')}
              className="text-slate-400 hover:text-blue-400 font-semibold flex items-center gap-1 transition-colors border border-slate-800 px-2 py-1 rounded-lg bg-slate-900/50"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Portal (/admin)</span>
            </button>
          </div>
        </div>
      </footer>

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

      <MyDownloadsModal
        isOpen={isMyDownloadsOpen}
        onClose={() => setIsMyDownloadsOpen(false)}
        orders={orders}
        onOpenOnlineReader={(p) => setOnlineReaderProduct(p)}
      />

      <OnlinePdfReaderModal
        product={onlineReaderProduct}
        onClose={() => setOnlineReaderProduct(null)}
      />

      <SellerStudioModal
        isOpen={isSellerStudioOpen}
        onClose={() => setIsSellerStudioOpen(false)}
        onAddProduct={handleAddCustomProduct}
      />

      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        orders={orders}
        currency={currency}
        onOpenMyDownloads={() => setIsMyDownloadsOpen(true)}
        onLogout={handleLogout}
      />
    </div>
  );
}
