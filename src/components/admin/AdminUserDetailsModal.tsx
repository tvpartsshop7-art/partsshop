import React from 'react';
import { User, Order } from '../../types';
import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Download,
  ShoppingBag,
  ShieldCheck,
  Lock,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

interface AdminUserDetailsModalProps {
  user: User | null;
  orders: Order[];
  onClose: () => void;
  onToggleUserStatus: (userId: string) => void;
}

export const AdminUserDetailsModal: React.FC<AdminUserDetailsModalProps> = ({
  user,
  orders,
  onClose,
  onToggleUserStatus
}) => {
  if (!user) return null;

  // Filter orders made by this user (by email or customer name)
  const userOrders = orders.filter(
    (o) =>
      o.customerEmail.toLowerCase() === user.email.toLowerCase() ||
      o.customerName.toLowerCase() === user.name.toLowerCase()
  );

  const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalAmountINR || 0), 0);
  const totalDownloads = userOrders.reduce((sum, o) => sum + (o.downloadCount || 1), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-6 h-6 text-blue-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{user.name}</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${
                    user.role === 'admin'
                      ? 'bg-purple-950/80 text-purple-300 border-purple-800'
                      : 'bg-blue-950/80 text-blue-300 border-blue-800'
                  }`}
                >
                  {user.role}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    user.status === 'suspended'
                      ? 'bg-red-950/80 text-red-300 border-red-800'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                  }`}
                >
                  {user.status || 'active'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
              <div className="text-slate-400 mb-1 font-medium">Total Orders</div>
              <div className="text-lg font-black text-white">{userOrders.length || user.totalPurchases || 0}</div>
            </div>
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
              <div className="text-slate-400 mb-1 font-medium">Total Spent</div>
              <div className="text-lg font-black text-emerald-400">
                ₹{(totalSpent || user.totalSpentINR || 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
              <div className="text-slate-400 mb-1 font-medium">Total Downloads</div>
              <div className="text-lg font-black text-blue-400">{totalDownloads || user.totalDownloads || 0}</div>
            </div>
          </div>

          {/* User Details Box */}
          <div className="bg-slate-950/50 rounded-2xl border border-slate-800/80 p-4 space-y-2.5">
            <h3 className="font-bold text-slate-200 text-xs flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Account Credentials & Meta</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
              <div>
                <span className="text-slate-500 block">User ID:</span>
                <span className="font-mono text-slate-300">{user.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Phone Number:</span>
                <span>{user.phone || '+91 98765 00000'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Registration Date:</span>
                <span>{new Date(user.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Last Active Session:</span>
                <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Recently active'}</span>
              </div>
            </div>
          </div>

          {/* User Purchase & Download History */}
          <div>
            <h3 className="font-bold text-slate-200 text-xs flex items-center gap-1.5 mb-3">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Purchase & Download Records ({userOrders.length})</span>
            </h3>

            {userOrders.length === 0 ? (
              <div className="p-6 text-center bg-slate-950/40 rounded-2xl border border-slate-800/60 text-slate-500">
                No purchases made yet by this user.
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{order.id}</span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          {order.paymentMethod.toUpperCase()} PAID
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {order.items.map((i) => i.product.title).join(', ')}
                      </p>
                      <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                        <span>Token: <span className="font-mono text-slate-400">{order.downloadToken}</span></span>
                        <span>•</span>
                        <span>{new Date(order.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-white block">
                        ₹{order.totalAmountINR}
                      </span>
                      <span className="text-[10px] text-blue-400">
                        {order.downloadCount || 1} Downloads
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <button
            onClick={() => onToggleUserStatus(user.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              user.status === 'suspended'
                ? 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/40'
                : 'bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/40'
            }`}
          >
            {user.status === 'suspended' ? 'Re-activate User' : 'Suspend User Account'}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
