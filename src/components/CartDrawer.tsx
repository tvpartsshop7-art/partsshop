import React, { useState } from 'react';
import { CartItem, Currency } from '../types';
import {
  X,
  Trash2,
  FileText,
  ShieldCheck,
  Tag,
  ArrowRight,
  Plus,
  Minus,
  Lock,
  Zap
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  currency: Currency;
  onProceedToCheckout: (discountAmount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  currency,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);

  const subtotalINR = cartItems.reduce(
    (sum, item) => sum + item.product.priceINR * item.quantity,
    0
  );
  const subtotalUSD = cartItems.reduce(
    (sum, item) => sum + item.product.priceUSD * item.quantity,
    0
  );

  const discountAmountINR = Math.round((subtotalINR * discountPercent) / 100);
  const discountAmountUSD = Number(((subtotalUSD * discountPercent) / 100).toFixed(2));

  const totalINR = Math.max(0, subtotalINR - discountAmountINR);
  const totalUSD = Math.max(0, subtotalUSD - discountAmountUSD);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'INSTANT20' || code === 'PDF20' || code === 'WELCOME20') {
      setAppliedPromo(code);
      setDiscountPercent(20);
    } else if (code === 'PDF10' || code === 'SAVE10') {
      setAppliedPromo(code);
      setDiscountPercent(10);
    } else {
      alert('Invalid Promo Code. Try "INSTANT20" or "PDF10"');
    }
  };

  return (
    <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div
        id="cart-drawer-container"
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl text-slate-100 relative"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Your Cart</h2>
              <p className="text-[11px] text-slate-400">
                {cartItems.length} {cartItems.length === 1 ? 'PDF Product' : 'PDF Products'}
              </p>
            </div>
          </div>

          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">Your cart is empty</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our digital PDF store and add top eBooks, cheat sheets, or templates.
              </p>
              <button
                onClick={onClose}
                className="mt-2 py-2 px-4 bg-blue-600 text-white rounded-xl text-xs font-bold shadow"
              >
                Browse Digital Store
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemPrice =
                currency === 'INR'
                  ? `₹${item.product.priceINR}`
                  : `$${item.product.priceUSD}`;

              return (
                <div
                  key={item.product.id}
                  className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center gap-3 relative group"
                >
                  {/* Thumbnail Cover */}
                  <img
                    src={item.product.imageCover}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-16 object-cover rounded-lg border border-slate-800"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded">
                      PDF • {item.product.pdfPageCount} Pgs
                    </span>
                    <h4 className="text-xs font-bold text-white truncate mt-0.5">
                      {item.product.title}
                    </h4>
                    <p className="text-xs font-extrabold text-amber-400 mt-1">{itemPrice}</p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-slate-800 border border-slate-700 rounded-md">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder='Promo code (e.g. "INSTANT20")'
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 uppercase focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg border border-slate-700"
              >
                Apply
              </button>
            </form>

            {appliedPromo && (
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Promo Code "{appliedPromo}" applied ({discountPercent}% Discount)!
              </p>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-200 font-semibold">
                  {currency === 'INR' ? `₹${subtotalINR}` : `$${subtotalUSD}`}
                </span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Discount ({discountPercent}%)</span>
                  <span>
                    -{currency === 'INR' ? `₹${discountAmountINR}` : `$${discountAmountUSD}`}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Instant Digital Delivery Tax</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Amount</span>
                <span className="text-blue-400 text-base">
                  {currency === 'INR' ? `₹${totalINR}` : `$${totalUSD}`}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="proceed-checkout-btn"
              onClick={() => onProceedToCheckout(currency === 'INR' ? discountAmountINR : discountAmountUSD)}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Proceed to Instant Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              UPI • Credit Card • Netbanking • Instant File License
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
