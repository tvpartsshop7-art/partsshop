import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../../types';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  FileText,
  DollarSign,
  Tag,
  Clock,
  CheckCircle2,
  Shield,
  Layers,
  HelpCircle,
  Upload,
  Paperclip,
  FileUp,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

interface AdminProductModalProps {
  isOpen: boolean;
  productToEdit: Product | null;
  onClose: () => void;
  onSaveProduct: (product: Product) => void;
}

const PRESET_COVERS = [
  {
    label: 'Code / Development',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Electronics / Circuit',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Design & UI/UX',
    url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Finance & Trading',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Hardware Schematics',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Cybersecurity',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop'
  }
];

const CATEGORIES = [
  'eBook',
  'Guide',
  'Cheat Sheet',
  'Template',
  'Workbook',
  'Finance',
  'Schematics & Hardware',
  'Software & Dev'
];

const EXPIRY_PRESETS = [
  'Lifetime Access',
  '30 Days Validity',
  '90 Days Access',
  '1 Year Access',
  'Flash Sale (24 Hours)',
  'Limited Edition (Valid till Dec 2026)'
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

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('eBook');
  const [customCategory, setCustomCategory] = useState('');
  const [priceINR, setPriceINR] = useState(499);
  const [originalPriceINR, setOriginalPriceINR] = useState(1499);
  const [priceUSD, setPriceUSD] = useState(9.99);
  const [originalPriceUSD, setOriginalPriceUSD] = useState(29.99);
  const [discountPercent, setDiscountPercent] = useState(66);
  const [expiresIn, setExpiresIn] = useState('Lifetime Access');
  const [authorName, setAuthorName] = useState('PartsShop Technical Team');
  const [publishedYear, setPublishedYear] = useState('2026');
  const [pdfPageCount, setPdfPageCount] = useState(120);
  const [pdfFileSize, setPdfFileSize] = useState('8.5 MB');
  const [pdfFileName, setPdfFileName] = useState('');
  const [localPdfDataUrl, setLocalPdfDataUrl] = useState('');
  const [imageCover, setImageCover] = useState(PRESET_COVERS[0].url);
  const [description, setDescription] = useState('');
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>([
    'Step-by-step master blueprints with verified diagrams',
    'Includes copy-paste formulas and ready templates',
    'Print-ready high resolution vector PDF layout',
    'Instant secure download token right after checkout'
  ]);
  const [newTakeaway, setNewTakeaway] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);

  // Initialize or populate form on open
  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title || '');
      setSubtitle(productToEdit.subtitle || '');
      if (CATEGORIES.includes(productToEdit.category)) {
        setCategory(productToEdit.category);
        setCustomCategory('');
      } else {
        setCategory('Custom');
        setCustomCategory(productToEdit.category || '');
      }
      setPriceINR(productToEdit.priceINR || 0);
      setOriginalPriceINR(productToEdit.originalPriceINR || 0);
      setPriceUSD(productToEdit.priceUSD || 0);
      setOriginalPriceUSD(productToEdit.originalPriceUSD || 0);
      setDiscountPercent(
        productToEdit.discountPercent !== undefined
          ? productToEdit.discountPercent
          : Math.round(
              ((productToEdit.originalPriceINR - productToEdit.priceINR) /
                (productToEdit.originalPriceINR || 1)) *
                100
            )
      );
      setExpiresIn(productToEdit.expiresIn || 'Lifetime Access');
      setAuthorName(productToEdit.authorName || 'PartsShop Technical Team');
      setPublishedYear(productToEdit.publishedYear || '2026');
      setPdfPageCount(productToEdit.pdfPageCount || 80);
      setPdfFileSize(productToEdit.pdfFileSize || '5.0 MB');
      setPdfFileName(productToEdit.pdfFileName || '');
      setLocalPdfDataUrl(productToEdit.localPdfDataUrl || '');
      setImageCover(productToEdit.imageCover || PRESET_COVERS[0].url);
      setDescription(productToEdit.description || '');
      setKeyTakeaways(
        productToEdit.keyTakeaways && productToEdit.keyTakeaways.length > 0
          ? productToEdit.keyTakeaways
          : ['Comprehensive verified schematics & guide', 'Instant lifetime download access']
      );
      setIsActive(productToEdit.isActive !== false);
      setIsFeatured(productToEdit.isFeatured === true);
    } else {
      // New product default
      setTitle('');
      setSubtitle('');
      setCategory('eBook');
      setCustomCategory('');
      setPriceINR(499);
      setOriginalPriceINR(1499);
      setPriceUSD(9.99);
      setOriginalPriceUSD(29.99);
      setDiscountPercent(66);
      setExpiresIn('Lifetime Access');
      setAuthorName('PartsShop Technical Team');
      setPublishedYear('2026');
      setPdfPageCount(120);
      setPdfFileSize('8.5 MB');
      setPdfFileName('');
      setLocalPdfDataUrl('');
      setImageCover(PRESET_COVERS[0].url);
      setDescription(
        'Comprehensive professional digital PDF guide. Features verified step-by-step schematics, architectural patterns, and troubleshooting frameworks. Delivered instantly upon purchase.'
      );
      setKeyTakeaways([
        'Step-by-step master blueprints with verified diagrams',
        'Includes copy-paste formulas and ready templates',
        'Print-ready high resolution vector PDF layout',
        'Instant secure download token right after checkout'
      ]);
      setIsActive(true);
      setIsFeatured(false);
    }
  }, [productToEdit, isOpen]);

  // Handle Local PDF File Selection
  const processPdfFile = (file: File) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file (.pdf format only).');
      return;
    }

    // Calculate file size
    const sizeInMB = file.size / (1024 * 1024);
    const formattedSize =
      sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;

    setPdfFileSize(formattedSize);
    setPdfFileName(file.name);

    // If title is currently empty, suggest title from filename
    if (!title.trim()) {
      const cleanName = file.name
        .replace(/\.pdf$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      setTitle(cleanName);
    }

    // Read file as Data URL / Preview
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

  // Handle Drag and Drop for PDF
  const handlePdfDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPdf(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processPdfFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Local Cover Image File Selection
  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageCover(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Recalculate discount percentage when price or original price changes
  const handlePriceINRChange = (val: number) => {
    setPriceINR(val);
    setPriceUSD(Number((val / 83).toFixed(2)));
    if (originalPriceINR > val) {
      setDiscountPercent(Math.round(((originalPriceINR - val) / originalPriceINR) * 100));
    }
  };

  const handleOriginalPriceINRChange = (val: number) => {
    setOriginalPriceINR(val);
    setOriginalPriceUSD(Number((val / 83).toFixed(2)));
    if (val > priceINR) {
      setDiscountPercent(Math.round(((val - priceINR) / val) * 100));
    }
  };

  // Add Key Takeaway
  const handleAddTakeaway = () => {
    if (!newTakeaway.trim()) return;
    setKeyTakeaways([...keyTakeaways, newTakeaway.trim()]);
    setNewTakeaway('');
  };

  // Remove Key Takeaway
  const handleRemoveTakeaway = (index: number) => {
    setKeyTakeaways(keyTakeaways.filter((_, i) => i !== index));
  };

  // AI Description Generator
  const handleGenerateAIDescription = async () => {
    if (!title) {
      alert('Please enter a product title first so AI can generate accurate details.');
      return;
    }
    setIsGeneratingAI(true);
    try {
      const selectedCat = category === 'Custom' ? customCategory : category;
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category: selectedCat,
          keywords: 'schematics, troubleshooting, full guide, premium instant download'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.description) setDescription(data.description);
        if (data.keyTakeaways && Array.isArray(data.keyTakeaways)) {
          setKeyTakeaways(data.keyTakeaways);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Save / Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Product title is required.');
      return;
    }

    const finalCategory = category === 'Custom' ? (customCategory.trim() || 'eBook') : category;

    const updatedProduct: Product = {
      id: productToEdit ? productToEdit.id : `pdf-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || `${finalCategory} - Complete Technical Resource`,
      category: finalCategory,
      priceINR: Number(priceINR) || 0,
      originalPriceINR: Number(originalPriceINR) || Number(priceINR) || 0,
      priceUSD: Number(priceUSD) || 0,
      originalPriceUSD: Number(originalPriceUSD) || Number(priceUSD) || 0,
      discountPercent: discountPercent,
      expiresIn: expiresIn.trim() || 'Lifetime Access',
      rating: productToEdit ? productToEdit.rating : 4.9,
      reviewCount: productToEdit ? productToEdit.reviewCount : 12,
      salesCount: productToEdit ? productToEdit.salesCount : 0,
      imageCover: imageCover.trim() || PRESET_COVERS[0].url,
      pdfPageCount: Number(pdfPageCount) || 50,
      pdfFileSize: pdfFileSize.trim() || '4.5 MB',
      pdfFileName: pdfFileName.trim() || `${title.replace(/\s+/g, '_')}.pdf`,
      localPdfDataUrl: localPdfDataUrl || undefined,
      description: description.trim(),
      keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways : ['Instant Digital PDF Download'],
      tableOfContents: productToEdit?.tableOfContents || [
        { pageNumber: 1, title: 'Chapter 1: Overview and Foundations' },
        { pageNumber: 20, title: 'Chapter 2: Schematics & Technical Architecture' },
        { pageNumber: 50, title: 'Chapter 3: Diagnostics & Practical Walkthrough' }
      ],
      sampleTextPages: productToEdit?.sampleTextPages || [
        `PREVIEW SAMPLE FOR: ${title.toUpperCase()}\n\nWelcome to this verified digital edition published by PartsShop.\nThis resource delivers practical technical breakdowns, high-resolution schematics, and proven diagnostic procedures.\n\nIncluded Features:\n- Verified Component Pinouts\n- Board Repair & Testing Workflows\n- Instant Offline Printable Format`
      ],
      authorName: authorName.trim() || 'PartsShop Team',
      publishedYear: publishedYear.trim() || '2026',
      isActive: isActive,
      isFeatured: isFeatured,
      createdAt: productToEdit?.createdAt || new Date().toISOString()
    };

    onSaveProduct(updatedProduct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
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

      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {productToEdit ? 'Edit Product & Pricing' : 'Upload & Publish New PDF Product'}
              </h2>
              <p className="text-xs text-slate-400">
                Attach local PDF files, set Title, Description, Amount, Discount, and Expiry validity.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* SECTION 1: LOCAL PDF FILE UPLOAD DROPZONE */}
          <div className="p-5 bg-gradient-to-br from-blue-950/40 via-slate-950 to-slate-950 rounded-2xl border-2 border-dashed border-blue-600/40 hover:border-blue-500 transition-all">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <FileUp className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-white text-sm">Upload Local PDF Document</span>
              </div>
              <span className="text-[10px] text-blue-400 bg-blue-950 border border-blue-800/60 px-2 py-0.5 rounded-full font-bold">
                .PDF File Supported
              </span>
            </div>

            {/* If a PDF is attached */}
            {pdfFileName ? (
              <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center font-black text-xs shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs truncate max-w-xs sm:max-w-md">
                        {pdfFileName}
                      </span>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Attached
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      File Size: <strong className="text-slate-200">{pdfFileSize}</strong> • Pages:{' '}
                      <strong className="text-slate-200">{pdfPageCount}p</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span>Change File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPdfFileName('');
                      setLocalPdfDataUrl('');
                      setPdfFileSize('4.5 MB');
                    }}
                    className="px-3 py-1.5 bg-red-950/40 hover:bg-red-950/80 text-red-300 rounded-xl text-xs font-bold border border-red-800/60 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              /* If no PDF attached yet - Show Upload Drag Area */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingPdf(true);
                }}
                onDragLeave={() => setIsDraggingPdf(false)}
                onDrop={handlePdfDrop}
                onClick={() => pdfInputRef.current?.click()}
                className={`cursor-pointer text-center py-6 px-4 rounded-xl border transition-all ${
                  isDraggingPdf
                    ? 'bg-blue-600/20 border-blue-500'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 animate-bounce" />
                </div>
                <h4 className="font-bold text-white text-sm">
                  Click to select Local PDF or Drag & Drop here
                </h4>
                <p className="text-slate-400 text-xs mt-1">
                  Upload complete manual, schematic diagram, or eBook from your computer (.pdf)
                </p>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all">
                    <FolderOpen className="w-4 h-4" />
                    <span>Browse PDF File from PC</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: TITLE & SUBTITLE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-slate-300 font-bold mb-1.5">
                Product Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Smart LED TV Main Board Schematic & Repair Manual 2026"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 font-bold mb-1.5">
                Subtitle / Punchline
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Complete Circuit Diagrams, Pinout Voltages & Troubleshooting Guide"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* SECTION 3: PRICING, DISCOUNT & EXPIRY */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-sm border-b border-slate-800/60 pb-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Pricing, Discount & Expiry Controls</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Sale Price (₹ INR) <span className="text-emerald-400 font-bold">*</span>
                </label>
                <input
                  type="number"
                  value={priceINR}
                  onChange={(e) => handlePriceINRChange(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-emerald-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  MRP / Orig. Price (₹)
                </label>
                <input
                  type="number"
                  value={originalPriceINR}
                  onChange={(e) => handleOriginalPriceINRChange(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 outline-none focus:border-slate-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Price ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={priceUSD}
                  onChange={(e) => setPriceUSD(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-emerald-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Calculated Discount %
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-extrabold outline-none"
                    min="0"
                    max="100"
                  />
                  <span className="font-bold text-amber-400 text-sm">%</span>
                </div>
              </div>
            </div>

            {/* Expiry / Validity Option */}
            <div className="pt-2 border-t border-slate-800/60">
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Product Validity / Expiry Setting</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(e.target.value)}
                  placeholder="e.g. Lifetime Access or 30 Days Validity"
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                />
                <div className="flex flex-wrap gap-1.5 items-center">
                  {EXPIRY_PRESETS.slice(0, 4).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setExpiresIn(preset)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                        expiresIn === preset
                          ? 'bg-blue-600/30 text-blue-300 border-blue-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: CATEGORY, AUTHOR & PDF SPECS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Custom">+ Custom Category</option>
              </select>
              {category === 'Custom' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter category name"
                  className="mt-2 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              )}
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Author / Publisher</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author Name"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">PDF Specifications</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="number"
                    value={pdfPageCount}
                    onChange={(e) => setPdfPageCount(Number(e.target.value))}
                    placeholder="Pages"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-blue-500"
                    min="1"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Total Pages</span>
                </div>
                <div>
                  <input
                    type="text"
                    value={pdfFileSize}
                    onChange={(e) => setPdfFileSize(e.target.value)}
                    placeholder="e.g. 8.4 MB"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">File Size</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: COVER IMAGE (LOCAL UPLOAD + PRESETS + URL) */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <span>Product Cover Image</span>
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

            <div className="flex gap-3">
              <input
                type="url"
                value={imageCover}
                onChange={(e) => setImageCover(e.target.value)}
                placeholder="Paste Image URL or click Upload Image above..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white outline-none focus:border-blue-500"
              />
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0 shadow">
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

            {/* Presets buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] text-slate-500 self-center mr-1">Quick Presets:</span>
              {PRESET_COVERS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageCover(preset.url)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                    imageCover === preset.url
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 6: DESCRIPTION & AI GENERATOR */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-bold flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Product Description</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateAIDescription}
                disabled={isGeneratingAI}
                className="bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isGeneratingAI ? 'AI Generating...' : 'Auto-Generate with AI'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed sales and technical description of the PDF product..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-3 text-white leading-relaxed outline-none"
            />
          </div>

          {/* SECTION 7: KEY TAKEAWAYS */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Key Highlights / Takeaways</label>
            <div className="space-y-2 mb-2">
              {keyTakeaways.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-slate-300">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTakeaway(index)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTakeaway}
                onChange={(e) => setNewTakeaway(e.target.value)}
                placeholder="Add another highlight bullet..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTakeaway();
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddTakeaway}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* SECTION 8: STORE VISIBILITY */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 bg-slate-900"
                />
                <div>
                  <span className="font-bold text-white block">Active on Storefront</span>
                  <span className="text-[10px] text-slate-400">
                    Buyers can view, read samples, and buy
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900 bg-slate-900"
                />
                <div>
                  <span className="font-bold text-white block">Featured Badge</span>
                  <span className="text-[10px] text-slate-400">Highlighted in banner/top list</span>
                </div>
              </label>
            </div>

            <div className="text-right text-[11px] text-slate-500">
              Live syncs to Store immediately
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-slate-900 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{productToEdit ? 'Save Changes' : 'Publish Product to Store'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
