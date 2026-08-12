import React from 'react';
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
  ExternalLink,
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
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  orders,
  currency,
  onOpenMyDownloads,
  onLogout
}) => {
  if (!isOpen || !user) return null;

  // Calculate order metrics
  const totalOrdersCount = orders.length;

  const totalSpentINR = orders.reduce((sum, order) => sum + (order.totalAmountINR || 0), 0);
  const totalSpentUSD = orders.reduce((sum, order) => sum + (order.totalAmountUSD || 0), 0);

  const totalPdfsPurchased = orders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);

  return (
    <div
      id="user-profile-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="user-profile-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden relative text-slate-100 my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">User Account Profile</h2>
              <p className="text-xs text-slate-400">Account overview & order spending summary</p>
            </div>
          </div>

          <button
            id="close-user-profile-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* User Details Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/50 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow">
                {user.name.charAt(0)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-extrabold text-white truncate">{user.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {user.role === 'seller' ? 'Creator / Seller' : 'Verified Buyer'}
                </span>
              </div>

              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>

              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Member since {user.createdAt || 'Jan 2026'}
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  SSL Secured
                </span>
              </div>
            </div>
          </div>

          {/* Spending & Order Summary Cards */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Purchasing & Spend Summary
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Total Orders */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px]">Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-xl font-extrabold text-white">{totalOrdersCount}</p>
                <p className="text-[10px] text-slate-500">{totalPdfsPurchased} PDF files purchased</p>
              </div>

              {/* Total Spent Amount */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px]">Total Amount Spent</span>
                  <Award className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xl font-extrabold text-emerald-400">
                  {currency === 'INR' ? `₹${totalSpentINR}` : `$${totalSpentUSD.toFixed(2)}`}
                </p>
                <p className="text-[10px] text-slate-500">
                  {currency === 'INR' ? `$${totalSpentUSD.toFixed(2)} USD equiv` : `₹${totalSpentINR} INR equiv`}
                </p>
              </div>

              {/* Digital Library Access */}
              <div className="col-span-2 sm:col-span-1 bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px]">License Status</span>
                  <FileText className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-xs font-bold text-slate-200 pt-1">Lifetime Instant Access</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Watermarked PDFs
                </p>
              </div>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Order History ({orders.length})
              </h4>
              {orders.length > 0 && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenMyDownloads();
                  }}
                  className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>View All Downloads</span>
                  <Download className="w-3 h-3" />
                </button>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="bg-slate-950/60 p-6 rounded-xl border border-slate-800 text-center space-y-2">
                <Clock className="w-6 h-6 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-400">No orders placed yet</p>
                <p className="text-[11px] text-slate-500">
                  Your purchased PDF files and receipts will automatically appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-200">Order #{ord.id}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Paid
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {ord.items.length} PDF Item(s) • {ord.date}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-emerald-400 block">
                        {ord.currency === 'INR' ? `₹${ord.totalAmountINR}` : `$${ord.totalAmountUSD}`}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block truncate max-w-[100px]">
                        {ord.paymentReference}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="px-3.5 py-2 bg-red-950/40 hover:bg-red-900/50 text-red-400 hover:text-red-300 font-bold text-xs rounded-xl border border-red-800/60 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
