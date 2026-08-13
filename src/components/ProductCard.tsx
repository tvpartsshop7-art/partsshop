import React from 'react';
import { Product, Currency } from '../types';
import {
  FileText,
  Star,
  Download,
  Eye,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Check,
  Clock
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onSelectProduct: (p: Product) => void;
  onPreviewSample: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onBuyNow: (p: Product) => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onSelectProduct,
  onPreviewSample,
  onAddToCart,
  onBuyNow,
  isInCart = false
}) => {
  const priceINR = Number(product.priceINR) || 0;
  const originalPriceINR = Number(product.originalPriceINR) || (priceINR ? priceINR * 2 : 0);
  const priceUSD = Number(product.priceUSD) || Math.round(priceINR / 83) || 0;
  const originalPriceUSD = Number(product.originalPriceUSD) || (priceUSD ? priceUSD * 2 : 0);

  const price = currency === 'INR' ? `₹${priceINR}` : `$${priceUSD}`;
  const origPrice = currency === 'INR' ? `₹${originalPriceINR}` : `$${originalPriceUSD}`;
  const discountPercent =
    product.discountPercent !== undefined
      ? product.discountPercent
      : Math.round(((originalPriceINR - priceINR) / (originalPriceINR || 1)) * 100);

  const coverImg = product.imageCover || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800';

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-xl sm:rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-xl hover:shadow-blue-500/10"
    >
      {/* Top Cover Image Area */}
      <div
        className="relative aspect-[16/10] sm:aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={coverImg}
          alt={product.title || 'Schematics PDF'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
          {/* PDF Format Tag */}
          <span className="bg-red-600/90 backdrop-blur-md text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow">
            <FileText className="w-2 h-2 sm:w-3 sm:h-3" />
            PDF
          </span>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="bg-amber-500 text-slate-950 text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded shadow">
              {discountPercent}% OFF
            </span>
          )}

          {product.isFeatured && (
            <span className="bg-blue-600 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
              F
            </span>
          )}
        </div>

        {/* Category & Page Specs Badge */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-slate-300 font-medium z-10">
          <span className="hidden sm:inline bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded text-slate-300 border border-slate-700/60 text-[10px] sm:text-[11px] truncate max-w-[120px]">
            {product.category || 'Schematics'}
          </span>
          <span className="bg-slate-900/90 backdrop-blur-md px-1.5 py-0.5 rounded text-blue-400 font-bold border border-slate-700/60 text-[8px] sm:text-[11px]">
            {product.pdfPageCount || 1}p • {product.pdfFileSize || '1.0 MB'}
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          {/* Rating & Sales */}
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <div className="flex items-center gap-0.5 text-amber-400 font-bold text-[9px] sm:text-xs">
              <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.9}</span>
              <span className="text-slate-500 font-normal">({product.reviewCount || 12})</span>
            </div>
            <span className="text-[9px] sm:text-[11px] text-slate-400 font-semibold">
              {(product.salesCount || 0).toLocaleString()}+ Sold
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-xs sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer mb-0.5 leading-snug"
          >
            {product.title || 'Untitled Schematic'}
          </h3>

          {/* Subtitle */}
          <p className="text-[10px] sm:text-xs text-slate-400 line-clamp-2 mb-1.5 leading-relaxed">
            {product.subtitle || 'Technical Circuit Diagram & Service Manual'}
          </p>

          {/* Author */}
          <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium truncate">
            By <span className="text-slate-300">{product.authorName || 'PartsShop Team'}</span>
          </p>
        </div>

        {/* Price & Action Section */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-lg font-black text-white">{price}</span>
              <span className="text-[9px] sm:text-xs text-slate-500 line-through">{origPrice}</span>
            </div>
            <span className="text-[8px] sm:text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1 py-0.5 rounded flex items-center gap-0.5">
              <Zap className="w-2 h-2" />
              <span>{product.expiresIn || 'Instant PDF'}</span>
            </span>
          </div>

          {/* Action Buttons (Touch Friendly) */}
          <div className="grid grid-cols-2 gap-1.5">
            {/* Read Sample PDF Button */}
            <button
              id={`preview-btn-${product.id}`}
              onClick={() => onPreviewSample(product)}
              className="w-full py-2 px-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-slate-200 text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 border border-slate-700 transition-colors min-h-[36px] sm:min-h-[42px] touch-manipulation"
            >
              <Eye className="w-3 h-3 text-blue-400 shrink-0" />
              <span>Sample</span>
            </button>

            {/* Buy Now Button */}
            <button
              id={`buy-now-btn-${product.id}`}
              onClick={() => onBuyNow(product)}
              className="w-full py-2 px-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 shadow-md shadow-blue-600/30 transition-all min-h-[36px] sm:min-h-[42px] touch-manipulation"
            >
              <Zap className="w-3 h-3 fill-white shrink-0" />
              <span>Buy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
