import React, { useState } from 'react';
import { Product } from '../types';
import {
  X,
  PlusCircle,
  Sparkles,
  FileText,
  Upload,
  CheckCircle2,
  DollarSign,
  Layers,
  BookOpen
} from 'lucide-react';

interface SellerStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export const SellerStudioModal: React.FC<SellerStudioModalProps> = ({
  isOpen,
  onClose,
  onAddProduct
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<'eBook' | 'Guide' | 'Cheat Sheet' | 'Template' | 'Workbook' | 'Finance'>('eBook');
  const [priceINR, setPriceINR] = useState(299);
  const [priceUSD, setPriceUSD] = useState(5.99);
  const [pdfPageCount, setPdfPageCount] = useState(65);
  const [pdfFileSize, setPdfFileSize] = useState('4.2 MB');
  const [authorName, setAuthorName] = useState('Digital Creator');
  const [description, setDescription] = useState('');
  const [keyTakeawaysText, setKeyTakeawaysText] = useState(
    'Step-by-step master guidance\nCustomizable PDF templates\nPrint-ready high quality layout\nInstant download access'
  );
  const [imageCover, setImageCover] = useState(
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop'
  );

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Call Express AI endpoint to auto-generate description & takeaways
  const handleGenerateAiCopy = async () => {
    if (!title.trim()) {
      alert('Please enter a product title first!');
      return;
    }

    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          keywords: subtitle
        })
      });
      const data = await res.json();
      if (data.description) {
        setDescription(data.description);
      }
      if (data.keyTakeaways) {
        setKeyTakeawaysText(data.keyTakeaways.join('\n'));
      }
    } catch (e) {
      console.error(e);
      setDescription(
        `A comprehensive digital PDF guide on ${title}. Packed with practical step-by-step instructions, templates, and actionable strategies to help you succeed.`
      );
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill in title and description.');
      return;
    }

    const takeaways = keyTakeawaysText
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newProduct: Product = {
      id: `custom-pdf-${Date.now()}`,
      title,
      subtitle: subtitle || `A premium digital ${category} for modern professionals`,
      priceINR: Number(priceINR),
      priceUSD: Number(priceUSD),
      originalPriceINR: Math.round(Number(priceINR) * 2.5),
      originalPriceUSD: Number((Number(priceUSD) * 2.5).toFixed(2)),
      category,
      rating: 5.0,
      reviewCount: 1,
      imageCover: imageCover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
      pdfPageCount: Number(pdfPageCount),
      pdfFileSize,
      description,
      keyTakeaways: takeaways.length > 0 ? takeaways : ['Instant digital download', 'High quality printable layout'],
      tableOfContents: [
        { pageNumber: 1, title: 'Chapter 1: Overview & Setup' },
        { pageNumber: 15, title: 'Chapter 2: Deep Dive Implementation' },
        { pageNumber: 35, title: 'Chapter 3: Actionable Frameworks & Worksheets' }
      ],
      sampleTextPages: [
        `CHAPTER 1: INTRODUCTION TO ${title.toUpperCase()}\n\nThank you for choosing this digital PDF edition. Inside, you will find comprehensive guidelines, frameworks, and actionable templates designed for immediate implementation.`,
      ],
      authorName,
      publishedYear: '2026',
      salesCount: 12
    };

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div id="seller-studio-backdrop" className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        id="seller-studio-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative text-slate-100 my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Seller Studio: List New PDF Product</h2>
              <p className="text-xs text-slate-400">
                Sell your eBook, Guide, Template or Cheat Sheet with instant digital delivery
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
          {/* Title & Subtitle */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              PDF Product Title <span className="text-blue-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Master React 19 & Next.js Architecture Guide"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs"
              >
                <option value="eBook">eBook</option>
                <option value="Guide">Guide</option>
                <option value="Cheat Sheet">Cheat Sheet</option>
                <option value="Template">Template</option>
                <option value="Workbook">Workbook</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Author / Creator Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs"
              />
            </div>
          </div>

          {/* Pricing & File specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Price (₹ INR)
              </label>
              <input
                type="number"
                value={priceINR}
                onChange={(e) => setPriceINR(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Price ($ USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={priceUSD}
                onChange={(e) => setPriceUSD(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Page Count
              </label>
              <input
                type="number"
                value={pdfPageCount}
                onChange={(e) => setPdfPageCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                File Size (e.g. 5.4 MB)
              </label>
              <input
                type="text"
                value={pdfFileSize}
                onChange={(e) => setPdfFileSize(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs"
              />
            </div>
          </div>

          {/* AI Generator Helper Button Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2">
            <span className="font-semibold text-slate-300">Product Sales Description</span>
            <button
              type="button"
              onClick={handleGenerateAiCopy}
              disabled={isGeneratingAi}
              className="py-1.5 px-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow touch-manipulation"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingAi ? 'AI Writing Copy...' : 'Auto-Generate Sales Copy with AI'}</span>
            </button>
          </div>

          <div>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed explanation of what buyers get inside this PDF file..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs leading-relaxed focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Key Bullet Points (1 per line)
            </label>
            <textarea
              rows={3}
              value={keyTakeawaysText}
              onChange={(e) => setKeyTakeawaysText(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Cover Image URL
            </label>
            <input
              type="text"
              value={imageCover}
              onChange={(e) => setImageCover(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs"
            />
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-emerald-300 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Once published, your product will immediately support instant PDF generation & secure checkout downloads!</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20"
          >
            Publish Digital PDF Product
          </button>
        </form>
      </div>
    </div>
  );
};
