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
  const price = currency === 'INR' ? `₹${product.priceINR}` : `$${product.priceUSD}`;
  const origPrice =
    currency === 'INR' ? `₹${product.originalPriceINR}` : `$${product.originalPriceUSD}`;
  const discountPercent =
    product.discountPercent !== undefined
      ? product.discountPercent
      : Math.round(
          ((product.originalPriceINR - product.priceINR) / (product.originalPriceINR || 1)) * 100
        );

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-xl hover:shadow-blue-500/10"
    >
      {/* Top Cover Image Area */}
      <div
        className="relative aspect-[16/10] sm:aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.imageCover}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 z-10">
          {/* PDF Format Tag */}
          <span className="bg-red-600/90 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
            <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            PDF
          </span>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="bg-amber-500 text-slate-950 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-md shadow">
              {discountPercent}% OFF
            </span>
          )}

          {product.isFeatured && (
            <span className="bg-blue-600 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
              FEATURED
            </span>
          )}
        </div>

        {/* Category & Page Specs Badge */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-slate-300 font-medium z-10">
          <span className="bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded-md text-slate-300 border border-slate-700/60 text-[10px] sm:text-[11px] truncate max-w-[120px]">
            {product.category}
          </span>
          <span className="bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded-md text-blue-400 font-bold border border-slate-700/60 text-[10px] sm:text-[11px]">
            {product.pdfPageCount}p • {product.pdfFileSize}
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating & Sales */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px] sm:text-xs">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-500 font-normal">({product.reviewCount})</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold">
              {product.salesCount.toLocaleString()}+ Sold
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer mb-1 leading-snug"
          >
            {product.title}
          </h3>

          {/* Subtitle */}
          <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 mb-2 leading-relaxed">
            {product.subtitle}
          </p>

          {/* Author */}
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
            By <span className="text-slate-300">{product.authorName}</span>
          </p>
        </div>

        {/* Price & Action Section */}
        <div className="pt-2.5 border-t border-slate-800/80">
          <div className="flex items-baseline justify-between mb-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-white">{price}</span>
              <span className="text-[11px] sm:text-xs text-slate-500 line-through">{origPrice}</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 sm:px-2 py-0.5 rounded flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" />
              <span>{product.expiresIn || 'Instant PDF'}</span>
            </span>
          </div>

          {/* Action Buttons (Touch Friendly) */}
          <div className="grid grid-cols-2 gap-2">
            {/* Read Sample PDF Button */}
            <button
              id={`preview-btn-${product.id}`}
              onClick={() => onPreviewSample(product)}
              className="w-full py-2.5 px-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 text-slate-200 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 border border-slate-700 transition-colors min-h-[42px] touch-manipulation"
            >
              <Eye className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Sample</span>
            </button>

            {/* Buy Now Button */}
            <button
              id={`buy-now-btn-${product.id}`}
              onClick={() => onBuyNow(product)}
              className="w-full py-2.5 px-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white text-[11px] sm:text-xs font-black flex items-center justify-center gap-1 shadow-md shadow-blue-600/30 transition-all min-h-[42px] touch-manipulation"
            >
              <Zap className="w-3.5 h-3.5 fill-white shrink-0" />
              <span>Buy PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
