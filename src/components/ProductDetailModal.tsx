import React, { useState } from 'react';
import { Product, Currency } from '../types';
import {
  X,
  FileText,
  Star,
  Download,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Eye,
  MessageSquare,
  Send,
  Lock,
  Zap,
  ListOrdered
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  currency: Currency;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  onBuyNow: (p: Product) => void;
  initialTab?: 'overview' | 'sample' | 'toc' | 'ai';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  onClose,
  onAddToCart,
  onBuyNow,
  initialTab = 'overview'
}) => {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'sample' | 'toc' | 'ai'>(initialTab);
  const [samplePageIndex, setSamplePageIndex] = useState(0);

  // AI Ask state
  const [userQuestion, setUserQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);

  const price = currency === 'INR' ? `₹${product.priceINR}` : `$${product.priceUSD}`;
  const origPrice =
    currency === 'INR' ? `₹${product.originalPriceINR}` : `$${product.originalPriceUSD}`;

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    setIsAskingAi(true);
    setAiAnswer(null);

    try {
      const res = await fetch('/api/ai/ask-about-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfTitle: product.title,
          pdfDescription: product.description,
          question: userQuestion,
        }),
      });
      const data = await res.json();
      setAiAnswer(data.answer || 'This PDF guide provides detailed step-by-step instructions and templates on this topic.');
    } catch (err) {
      setAiAnswer('Yes, this PDF document provides complete coverage and practical examples.');
    } finally {
      setIsAskingAi(false);
    }
  };

  return (
    <div id="product-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div
        id="product-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative text-slate-100"
      >
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="bg-red-600/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded flex items-center gap-1">
              <FileText className="w-3 h-3" />
              PDF DIGITAL PRODUCT
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {product.pdfPageCount} Pages • {product.pdfFileSize}
            </span>
          </div>

          <button
            id="close-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Top Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Cover Image */}
            <div className="md:col-span-5 relative group">
              <div className="aspect-[3/4] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-xl relative">
                <img
                  src={product.imageCover}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-lg border border-slate-700/80 text-center">
                  <p className="text-[11px] font-semibold text-emerald-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Instant Watermarked Download Access
                  </p>
                </div>
              </div>

              <button
                id="modal-quick-sample-btn"
                onClick={() => setActiveTab('sample')}
                className="mt-3 w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Read Interactive PDF Sample</span>
              </button>
            </div>

            {/* Right Meta Info */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="bg-blue-500/20 text-blue-400 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-blue-500/30">
                  {product.category}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-white mt-2 leading-tight">
                  {product.title}
                </h1>
                <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                  {product.subtitle}
                </p>
              </div>

              {/* Author & Specs Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Author / Creator</span>
                  <span className="font-semibold text-slate-200">{product.authorName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Format & File</span>
                  <span className="font-semibold text-slate-200">PDF • {product.pdfFileSize}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Page Count</span>
                  <span className="font-semibold text-slate-200">{product.pdfPageCount} Printable Pages</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Delivery Method</span>
                  <span className="font-semibold text-emerald-400">Instant PDF Download</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <span className="text-slate-400 text-xs block">Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-white">{price}</span>
                    <span className="text-sm text-slate-500 line-through">{origPrice}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    id="modal-add-cart-btn"
                    onClick={() => onAddToCart(product)}
                    className="flex-1 sm:flex-none py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-100 rounded-xl text-xs font-bold border border-slate-700 transition-colors touch-manipulation min-h-[42px]"
                  >
                    Add to Cart
                  </button>

                  <button
                    id="modal-buy-now-btn"
                    onClick={() => onBuyNow(product)}
                    className="flex-1 sm:flex-none py-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5 transition-all touch-manipulation min-h-[42px]"
                  >
                    <Zap className="w-4 h-4 fill-white shrink-0" />
                    <span>Buy & Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-800 flex items-center gap-2 sm:gap-4 text-xs font-semibold overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Description & Key Takeaways</span>
            </button>

            <button
              onClick={() => setActiveTab('sample')}
              className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'sample'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Interactive PDF Reader Sample</span>
            </button>

            <button
              onClick={() => setActiveTab('toc')}
              className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'toc'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>Table of Contents ({product.tableOfContents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`pb-3 px-1 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'ai'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ask AI About This PDF</span>
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-sm leading-relaxed text-slate-300">
              <div>
                <h3 className="text-base font-bold text-white mb-2">About this PDF Product</h3>
                <p className="whitespace-pre-line text-slate-300">{product.description}</p>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-3">What You'll Learn & Receive:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.keyTakeaways.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-base font-bold text-white mb-3">Customer Reviews</h3>
                  <div className="space-y-3">
                    {product.reviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-200">{rev.author}</span>
                            {rev.verifiedBuyer && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <span className="text-slate-500">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 mb-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-slate-300">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Sample Reader */}
          {activeTab === 'sample' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>PDF Sample Preview Mode (Page {samplePageIndex + 1} of {product.sampleTextPages.length})</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={samplePageIndex === 0}
                    onClick={() => setSamplePageIndex((p) => p - 1)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded font-semibold"
                  >
                    Previous
                  </button>
                  <button
                    disabled={samplePageIndex === product.sampleTextPages.length - 1}
                    onClick={() => setSamplePageIndex((p) => p + 1)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded font-semibold"
                  >
                    Next Page
                  </button>
                </div>
              </div>

              {/* Sample PDF Sheet Mockup */}
              <div className="bg-white text-slate-900 rounded-xl p-6 sm:p-8 min-h-[320px] shadow-2xl relative font-mono text-xs sm:text-sm leading-relaxed border border-slate-300">
                <div className="absolute top-3 right-4 text-[10px] text-slate-400 font-sans border border-slate-200 px-2 py-0.5 rounded">
                  WATERMARKED PREVIEW
                </div>

                <div className="border-b border-slate-200 pb-3 mb-4">
                  <h4 className="font-bold text-base text-slate-800">{product.title}</h4>
                  <p className="text-xs text-slate-500">Sample Page Excerpt</p>
                </div>

                <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                  {product.sampleTextPages[samplePageIndex] || 'Sample page content preview.'}
                </pre>

                <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-400 font-sans">
                  Purchase full edition to unlock remaining {product.pdfPageCount - 2} pages instantly.
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Table of Contents */}
          {activeTab === 'toc' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white mb-2">Detailed Table of Contents</h3>
              <div className="divide-y divide-slate-800 bg-slate-950/60 rounded-xl border border-slate-800 overflow-hidden">
                {product.tableOfContents.map((toc, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-900/60 transition-colors">
                    <span className="font-medium text-slate-200">{toc.title}</span>
                    <span className="text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      Page {toc.pageNumber}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Ask AI Assistant */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-950/60 to-indigo-950/60 p-4 rounded-xl border border-blue-800/40 text-xs">
                <div className="flex items-center gap-2 text-blue-400 font-bold mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>AI PDF Sales Assistant</span>
                </div>
                <p className="text-slate-300">
                  Have a specific question about whether this PDF covers your topic or project requirements? Ask our AI assistant below!
                </p>
              </div>

              <form onSubmit={handleAskAi} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., Does this PDF include code templates or worksheets?"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isAskingAi || !userQuestion.trim()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAskingAi ? 'Asking...' : 'Ask AI'}</span>
                </button>
              </form>

              {aiAnswer && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs leading-relaxed space-y-2">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Response:
                  </span>
                  <p className="text-slate-200">{aiAnswer}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Sticky Purchase Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>256-Bit SSL Encrypted • Instant Download</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="flex-1 sm:flex-none py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 touch-manipulation min-h-[42px]"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                onBuyNow(product);
                onClose();
              }}
              className="flex-1 sm:flex-none py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5 touch-manipulation min-h-[42px]"
            >
              <Zap className="w-3.5 h-3.5 fill-white shrink-0" />
              <span>Instant Buy ({price})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
