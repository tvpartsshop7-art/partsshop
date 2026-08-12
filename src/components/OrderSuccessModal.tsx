import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Order, Product } from '../types';
import { generateAndDownloadPdf } from '../utils/pdfGenerator';
import {
  CheckCircle2,
  Download,
  FileText,
  Mail,
  Printer,
  Sparkles,
  X,
  Eye,
  ShieldCheck,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenOnlineReader: (product: Product) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onOpenOnlineReader
}) => {
  if (!order) return null;

  const [emailSent, setEmailSent] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Trigger celebration confetti
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleDownloadPdf = (product: Product) => {
    setDownloadingId(product.id);
    setTimeout(() => {
      generateAndDownloadPdf(product, order);
      setDownloadingId(null);
    }, 400);
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
  };

  return (
    <div id="order-success-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        id="order-success-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative text-slate-100 my-auto"
      >
        {/* Top Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-5 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-2 ring-4 ring-white/30">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">Payment Successful!</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Order #{order.id} • Verified Digital PDF License Issued
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Order Metadata Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Transaction Ref</span>
              <span className="font-mono font-bold text-slate-200 truncate block">
                {order.paymentReference}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Purchaser Email</span>
              <span className="font-bold text-slate-200 truncate block">{order.customerEmail}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Date & Time</span>
              <span className="font-semibold text-slate-300">{order.date}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Amount Paid</span>
              <span className="font-bold text-emerald-400">
                {order.currency === 'INR' ? `₹${order.totalAmountINR}` : `$${order.totalAmountUSD}`}
              </span>
            </div>
          </div>

          {/* PDF Files Instant Download Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Your Purchased PDF Files ({order.items.length})</span>
              </h3>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Instant Access Active
              </span>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.imageCover}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-14 object-cover rounded-lg border border-slate-800"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                        PDF • {item.product.pdfPageCount} Pages • {item.product.pdfFileSize}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-1">{item.product.title}</h4>
                      <p className="text-[11px] text-slate-400">By {item.product.authorName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Read & View Online Button */}
                    <button
                      id={`view-schematic-btn-${item.product.id}`}
                      onClick={() => {
                        onClose();
                        onOpenOnlineReader(item.product);
                      }}
                      className="w-full sm:w-auto py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 transition-all min-h-[40px] touch-manipulation"
                    >
                      <Eye className="w-4 h-4 shrink-0" />
                      <span>View Schematic Online</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instant Access Notice */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">
              Your schematic has been unlocked for online viewing under your account <strong className="text-white">{order.customerEmail}</strong>.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            PDFStore License Token: <code className="text-slate-400">{order.downloadToken}</code>
          </p>

          <button
            onClick={onClose}
            className="py-2 px-5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
