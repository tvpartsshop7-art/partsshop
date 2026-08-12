import React from 'react';
import { Order, Product } from '../types';
import { generateAndDownloadPdf } from '../utils/pdfGenerator';
import {
  Download,
  FileText,
  X,
  Eye,
  ShieldCheck,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface MyDownloadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onOpenOnlineReader: (product: Product) => void;
}

export const MyDownloadsModal: React.FC<MyDownloadsModalProps> = ({
  isOpen,
  onClose,
  orders,
  onOpenOnlineReader
}) => {
  if (!isOpen) return null;

  // Flatten all purchased items across orders
  const allPurchases = orders.flatMap((order) =>
    order.items.map((item) => ({
      order,
      product: item.product,
    }))
  );

  return (
    <div id="my-downloads-backdrop" className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        id="my-downloads-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative text-slate-100 my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">My Purchased PDF Library</h2>
              <p className="text-xs text-slate-400">
                Lifetime Download Access for Your Purchased PDF Files
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
          {allPurchases.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-300">No PDF Downloads Found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Purchased PDF files will automatically appear here with instant download links.
              </p>
            </div>
          ) : (
            allPurchases.map(({ order, product }, idx) => (
              <div
                key={`${order.id}-${product.id}-${idx}`}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.imageCover}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-14 object-cover rounded-lg border border-slate-800"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.2 rounded">
                        PDF • {product.pdfPageCount} Pgs
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Order #{order.id}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-0.5">{product.title}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      Purchased on {order.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => onOpenOnlineReader(product)}
                    className="flex-1 sm:flex-none py-2 px-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center justify-center gap-1 min-h-[40px] touch-manipulation"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Read</span>
                  </button>

                  <button
                    onClick={() => generateAndDownloadPdf(product, order)}
                    className="flex-1 sm:flex-none py-2 px-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold rounded-lg shadow flex items-center justify-center gap-1 min-h-[40px] touch-manipulation"
                  >
                    <Download className="w-3.5 h-3.5 shrink-0" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" /> 100% Guaranteed Lifetime Downloads
          </span>

          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
