import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../../types';
import {
  X,
  Plus,
  Sparkles,
  Image as ImageIcon,
  FileText,
  DollarSign,
  Clock,
  CheckCircle2,
  Upload,
  Paperclip,
  RefreshCw,
  Lock,
  Calendar
} from 'lucide-react';

interface AdminProductModalProps {
  isOpen: boolean;
  productToEdit: Product | null;
  onClose: () => void;
  onSaveProduct: (product: Product) => void | Promise<any>;
}

const PRESET_COVERS = [
  {
    label: 'Electronics / Circuit',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Hardware Board',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Code / Technical',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Modern TV / Display',
    url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=800&auto=format&fit=crop'
  }
];

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  productToEdit,
  onClose,
  onSaveProduct
}) => {
  if (!isOpen) return null;

  // File Input references
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Form States (Streamlined to user specifications: Name, Description, PDF, Cover, Auto 30-Day, Price)
  const [title, setTitle] = useState('');
  const [priceINR, setPriceINR] = useState(299);
  const [originalPriceINR, setOriginalPriceINR] = useState(899);
  const [discountPercent, setDiscountPercent] = useState(66);
  const [description, setDescription] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFileSize, setPdfFileSize] = useState('1.5 MB');
  const [localPdfDataUrl, setLocalPdfDataUrl] = useState('');
  const [imageCover, setImageCover] = useState(PRESET_COVERS[0].url);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form on open or edit
  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title || '');
      setPriceINR(productToEdit.priceINR || 299);
      setOriginalPriceINR(productToEdit.originalPriceINR || (productToEdit.priceINR ? productToEdit.priceINR * 2 : 899));
      setDiscountPercent(
        productToEdit.discountPercent !== undefined
          ? productToEdit.discountPercent
          : Math.round(
              ((productToEdit.originalPriceINR - productToEdit.priceINR) /
                (productToEdit.originalPriceINR || 1)) *
                100
            )
      );
      setDescription(productToEdit.description || '');
      setPdfFileName(productToEdit.pdfFileName || `${productToEdit.title}.pdf`);
      setPdfFileSize(productToEdit.pdfFileSize || '1.5 MB');
      setLocalPdfDataUrl(productToEdit.localPdfDataUrl || '');
      setImageCover(productToEdit.imageCover || PRESET_COVERS[0].url);
      setIsActive(productToEdit.isActive !== false);
      setIsFeatured(productToEdit.isFeatured === true);
    } else {
      setTitle('');
      setPriceINR(299);
      setOriginalPriceINR(899);
      setDiscountPercent(66);
      setDescription('');
      setPdfFileName('');
      setPdfFileSize('1.5 MB');
      setLocalPdfDataUrl('');
      setImageCover(PRESET_COVERS[0].url);
      setIsActive(true);
      setIsFeatured(false);
    }
  }, [productToEdit, isOpen]);

  // Handle PDF Selection & Drag-Drop
  const processPdfFile = (file: File) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file (.pdf format only).');
      return;
    }

    const sizeInMB = file.size / (1024 * 1024);
    const formattedSize =
      sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;

    setPdfFileSize(formattedSize);
    setPdfFileName(file.name);

    if (!title.trim()) {
      const cleanName = file.name
        .replace(/\.pdf$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      setTitle(cleanName);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setLocalPdfDataUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePdfInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processPdfFile(e.target.files[0]);
    }
  };

  const handlePdfDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPdf(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processPdfFile(e.dataTransfer.files[0]);
    }
  };

  // Compress & optimize image file to prevent corruption
  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = () => resolve(event.target?.result as string);
        img.src = event.target?.result as string;
      };
      reader.onerror = () => resolve(PRESET_COVERS[0].url);
      reader.readAsDataURL(file);
    });
  };

  const handleImageInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const optimizedUrl = await compressImageFile(file);
      setImageCover(optimizedUrl);
    }
  };

  // Price calculations
  const handlePriceINRChange = (val: number) => {
    setPriceINR(val);
    if (originalPriceINR > val) {
      setDiscountPercent(Math.round(((originalPriceINR - val) / originalPriceINR) * 100));
    }
  };

  const handleOriginalPriceINRChange = (val: number) => {
    setOriginalPriceINR(val);
    if (val > priceINR) {
      setDiscountPercent(Math.round(((val - priceINR) / val) * 100));
    }
  };

  // AI Description Generator Helper
  const handleGenerateAIDescription = async () => {
    if (!title.trim()) {
      alert('Please enter a Product Name first so AI can generate accurate technical details.');
      return;
    }
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category: 'Schematics & Hardware',
          keywords: 'circuit schematic, voltage test points, pinout diagram, technical troubleshooting'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.description) setDescription(data.description);
      } else {
        setDescription(
          `Verified High-Resolution Technical Circuit Diagram & Service Manual for ${title}. Features point-to-point wiring schematics, primary/secondary voltage test points, component pinouts, and diagnostic fault-finding tables.`
        );
      }
    } catch (_) {
      setDescription(
        `Verified High-Resolution Technical Circuit Diagram & Service Manual for ${title}. Features point-to-point wiring schematics, primary/secondary voltage test points, component pinouts, and diagnostic fault-finding tables.`
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Form Submit Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Product Name is required.');
      return;
    }

    setIsSaving(true);
    try {
      const cleanDescription =
        description.trim() ||
        `Verified Technical Circuit Diagram & Service Manual for ${title.trim()}. Includes point-to-point circuit board schematics and voltage test points.`;

      const updatedProduct: Product = {
        id: productToEdit ? productToEdit.id : `pdf-${Date.now()}`,
        title: title.trim(),
        subtitle: `${title.trim()} - Technical Circuit Schematic`,
        category: 'Schematics & Hardware', // Automatically set without user category picker
        priceINR: Number(priceINR) || 0,
        originalPriceINR: Number(originalPriceINR) || Number(priceINR) * 2 || 0,
        priceUSD: Number((priceINR / 83).toFixed(2)) || 4,
        originalPriceUSD: Number((originalPriceINR / 83).toFixed(2)) || 10,
        discountPercent: discountPercent,
        expiresIn: '30 Days Access', // Auto 30-Day Expire Date as requested
        rating: productToEdit ? productToEdit.rating : 4.9,
        reviewCount: productToEdit ? productToEdit.reviewCount : 18,
        salesCount: productToEdit ? productToEdit.salesCount : 0,
        imageCover: imageCover.trim() || PRESET_COVERS[0].url,
        pdfPageCount: productToEdit?.pdfPageCount || 10,
        pdfFileSize: pdfFileSize.trim() || '1.5 MB',
        pdfFileName: pdfFileName.trim() || `${title.replace(/\s+/g, '_')}.pdf`,
        localPdfDataUrl: localPdfDataUrl || undefined,
        description: cleanDescription,
        keyTakeaways: [
          'Pin voltages and point-to-point circuit board schematics',
          'Power supply & mainboard troubleshooting guide',
          'Component fault finding & diagnostic test points'
        ],
        tableOfContents: [
          { pageNumber: 1, title: 'Circuit Schematic Overview' },
          { pageNumber: 3, title: 'Voltage Rail Diagnostics' },
          { pageNumber: 6, title: 'Component Pinout & Layout' }
        ],
        sampleTextPages: [
          `TECHNICAL SCHEMATIC: ${title.toUpperCase()}\n\nVerified Circuit Diagram & Voltage Test Matrix.\n\nIncluded Features:\n- Point-to-Point Circuit Paths\n- Diagnostic Test Points (STBY 3.3V, Main 12V/24V)\n- Protected Online DRM Access (30 Days Validity)`
        ],
        authorName: 'PartsShop Engineering Team',
        publishedYear: '2026',
        isActive: isActive,
        isFeatured: isFeatured,
        createdAt: productToEdit?.createdAt || new Date().toISOString()
      };

      await onSaveProduct(updatedProduct);
    } catch (err: any) {
      console.error('Save product error:', err);
      alert('Error saving product: ' + (err?.message || 'Please try again'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={pdfInputRef}
        onChange={handlePdfInputChange}
        accept=".pdf,application/pdf"
        className="hidden"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageInputChange}
        accept="image/*"
        className="hidden"
      />

      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-auto text-slate-100 animate-fade-in">
        {/* Modal Header */}
        <div className="bg-slate-950 px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {productToEdit ? 'Edit Product' : 'Upload Technical Product'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Direct Supabase sync with automatic 30-day validity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
          {/* FIELD 1: PRODUCT NAME */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-bold">
              Product Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Samsung 55 LED TV Power Supply Schematic Board BN44-00807A"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-medium outline-none focus:border-blue-500 transition-colors shadow-inner"
            />
          </div>

          {/* FIELD 2: PRICING (INR & MRP) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Selling Price (₹ INR) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={priceINR}
                  onChange={(e) => handlePriceINRChange(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-7 pr-3 py-2 text-white font-bold outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                <span>MRP Original Price (₹)</span>
                {discountPercent > 0 && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-black">
                    {discountPercent}% OFF
                  </span>
                )}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={originalPriceINR}
                  onChange={(e) => handleOriginalPriceINRChange(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-7 pr-3 py-2 text-slate-300 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* FIELD 3: PRODUCT DESCRIPTION */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-bold">Product Description</label>
              <button
                type="button"
                onClick={handleGenerateAIDescription}
                disabled={isGeneratingAI}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin text-amber-400' : ''}`} />
                <span>{isGeneratingAI ? 'Generating...' : 'Auto Generate Description'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter technical details, circuit board part numbers, pinouts, voltage specs, etc."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 leading-relaxed resize-none"
            />
          </div>

          {/* FIELD 4: UPLOAD PDF FILE */}
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-bold flex items-center justify-between">
              <span>Upload PDF Schematic File</span>
              {pdfFileName && (
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  ✓ {pdfFileName} ({pdfFileSize})
                </span>
              )}
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingPdf(true);
              }}
              onDragLeave={() => setIsDraggingPdf(false)}
              onDrop={handlePdfDrop}
              onClick={() => pdfInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                isDraggingPdf
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="font-bold text-white text-xs">
                {pdfFileName ? 'Click to Change PDF File' : 'Click to Upload or Drag & Drop PDF File'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Supports technical PDF schematics and service manuals</p>
            </div>
          </div>

          {/* FIELD 5: COVER PHOTO */}
          <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <span>Cover Photo</span>
              </label>

              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Image from PC</span>
              </button>
            </div>

            <div className="flex gap-3 items-center">
              <input
                type="url"
                value={imageCover}
                onChange={(e) => setImageCover(e.target.value)}
                placeholder="Image URL or click Upload Image above..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 text-xs"
              />
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0 shadow">
                <img
                  src={imageCover}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PRESET_COVERS[0].url;
                  }}
                />
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500 self-center mr-1">Presets:</span>
              {PRESET_COVERS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageCover(preset.url)}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-medium border transition-colors ${
                    imageCover === preset.url
                      ? 'bg-blue-600 text-white border-blue-500 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* FIELD 6: AUTO 30-DAY EXPIRE DATE BADGE (AUTOMATED & LOCKED) */}
          <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block text-xs">Auto 30-Day Expire Validity</span>
                <span className="text-[10px] text-blue-300">
                  Customers get automatic 30 days protected online schematic access
                </span>
              </div>
            </div>
            <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
              30 Days
            </span>
          </div>

          {/* STORE VISIBILITY TOGGLES */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900"
              />
              <span className="font-bold text-slate-300 text-xs">Active on Storefront</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900"
              />
              <span className="font-bold text-slate-300 text-xs">Featured Badge</span>
            </label>
          </div>

          {/* MODAL ACTIONS */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-900 pb-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 text-white font-bold transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Saving to Supabase...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{productToEdit ? 'Save Changes' : 'Publish Product to Store'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
