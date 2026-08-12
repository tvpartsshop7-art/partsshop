import React, { useState, useEffect } from 'react';
import { Product, Currency, Order, CartItem, User } from '../types';
import {
  X,
  ShieldCheck,
  Lock,
  QrCode,
  CreditCard,
  Building2,
  Wallet,
  CheckCircle2,
  Loader2,
  Sparkles,
  Zap,
  ArrowRight,
  FileCheck
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  discountAmount: number;
  onPaymentSuccess: (order: Order) => void;
  currentUser?: User | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  discountAmount,
  onPaymentSuccess,
  currentUser
}) => {
  if (!isOpen || items.length === 0) return null;

  const [customerName, setCustomerName] = useState(currentUser?.name || 'Rahul Sharma');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'rahul.sharma@example.com');

  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name);
      setCustomerEmail(currentUser.email);
    }
  }, [currentUser]);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');

  // Form states
  const [upiId, setUpiId] = useState('rahul@upi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('789');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);

  const subtotalINR = items.reduce((sum, i) => sum + i.product.priceINR * i.quantity, 0);
  const subtotalUSD = items.reduce((sum, i) => sum + i.product.priceUSD * i.quantity, 0);

  const totalINR = Math.max(0, subtotalINR - discountAmount);
  const totalUSD = Math.max(0, subtotalUSD - discountAmount);

  const displayTotal = currency === 'INR' ? `₹${totalINR}` : `$${totalUSD}`;

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim() || !customerName.trim()) {
      alert('Please provide your name and email for PDF delivery license.');
      return;
    }

    setIsProcessing(true);
    setProcessStep(1);

    // Simulate real-time payment authentication pipeline
    await new Promise((r) => setTimeout(r, 1000));
    setProcessStep(2);

    await new Promise((r) => setTimeout(r, 1200));
    setProcessStep(3);

    await new Promise((r) => setTimeout(r, 1000));

    // Create Order object
    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      customerName,
      customerEmail,
      items,
      totalAmountINR: totalINR,
      totalAmountUSD: totalUSD,
      currency,
      paymentMethod,
      paymentReference: `PAY_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      downloadToken: Math.random().toString(36).substring(2, 15)
    };

    setIsProcessing(false);
    setProcessStep(0);
    onPaymentSuccess(newOrder);
  };

  return (
    <div id="payment-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        id="payment-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden relative text-slate-100 my-auto"
      >
        {/* Gateway Branding Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">PDFStore Checkout</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  256-Bit SSL
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Instant Digital File Access Guarantee</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Processing State Overlay */}
        {isProcessing ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center mx-auto text-blue-400 animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                Processing Secure Payment...
              </h3>
              <p className="text-xs text-slate-400">
                Please do not refresh or close this browser tab.
              </p>
            </div>

            {/* Stepper info */}
            <div className="max-w-xs mx-auto space-y-2 text-xs text-left bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className={`flex items-center gap-2 ${processStep >= 1 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>1. Verifying Payment Method & Auth</span>
              </div>
              <div className={`flex items-center gap-2 ${processStep >= 2 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>2. Generating Digital License & Watermark</span>
              </div>
              <div className={`flex items-center gap-2 ${processStep >= 3 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>3. Issuing Instant PDF File Download Link</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePayNow} className="p-5 sm:p-6 space-y-5">
            {/* Order Summary Ribbon */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">Total Payable</span>
                <span className="text-lg font-black text-blue-400">{displayTotal}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Items</span>
                <span className="font-bold text-slate-200">{items.length} PDF Digital File(s)</span>
              </div>
            </div>

            {/* Buyer Email & Name for License */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Your Full Name <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Rahul Sharma"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Email (For PDF License) <span className="text-blue-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="rahul@example.com"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 min-h-[50px] touch-manipulation ${
                    paymentMethod === 'upi'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4 shrink-0" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 min-h-[50px] touch-manipulation ${
                    paymentMethod === 'card'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>Credit/Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 min-h-[50px] touch-manipulation ${
                    paymentMethod === 'netbanking'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span>Netbanking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 min-h-[50px] touch-manipulation ${
                    paymentMethod === 'wallet'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Wallet className="w-4 h-4 shrink-0" />
                  <span>Wallets</span>
                </button>
              </div>
            </div>

            {/* Payment Method Details Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              {paymentMethod === 'upi' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">Scan QR or Enter UPI ID</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                      Zero Processing Fee
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="bg-white p-2 rounded-lg text-slate-900 flex flex-col items-center">
                      <QrCode className="w-20 h-20" />
                      <span className="text-[9px] font-bold mt-1 text-slate-700">SCAN & PAY WITH ANY UPI APP</span>
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <p className="text-slate-400">Google Pay • PhonePe • Paytm • BHIM</p>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Enter UPI ID</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-400 block">Select Popular Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-slate-100 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="space-y-2 text-slate-300">
                  <p>Choose Instant Wallet:</p>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <span className="p-2 bg-slate-900 border border-slate-800 rounded font-semibold text-blue-400">Paytm</span>
                    <span className="p-2 bg-slate-900 border border-slate-800 rounded font-semibold text-purple-400">PhonePe</span>
                    <span className="p-2 bg-slate-900 border border-slate-800 rounded font-semibold text-amber-400">Amazon Pay</span>
                  </div>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <button
              id="confirm-payment-btn"
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Pay {displayTotal} & Download PDF Instantly</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
