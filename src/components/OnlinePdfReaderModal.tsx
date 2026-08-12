import React, { useState } from 'react';
import { Product } from '../types';
import { generateAndDownloadPdf } from '../utils/pdfGenerator';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  FileText,
  Bookmark,
  Printer,
  Maximize2
} from 'lucide-react';

interface OnlinePdfReaderModalProps {
  product: Product | null;
  onClose: () => void;
}

export const OnlinePdfReaderModal: React.FC<OnlinePdfReaderModalProps> = ({
  product,
  onClose
}) => {
  if (!product) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  const totalPages = product.pdfPageCount || 10;

  const samplePagesList = product.sampleTextPages || [
    'CHAPTER 1: INTRODUCTION & CORE CONCEPTS\n\nWelcome to the complete digital edition of ' + product.title + '.\n\nThis PDF document is protected and watermarked for personal use.',
  ];

  const currentPageText =
    samplePagesList[(currentPage - 1) % samplePagesList.length] ||
    `CHAPTER ${currentPage}: ADVANCED GUIDELINES & PRACTICAL EXAMPLES\n\nDetailed walkthrough and framework analysis for page ${currentPage} of ${product.title}.\n\nRefer to table of contents for specific topic chapters.`;

  return (
    <div id="online-reader-backdrop" className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div
        id="online-reader-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[92vh] flex flex-col shadow-2xl overflow-hidden relative text-slate-100"
      >
        {/* Top PDF Reader Control Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2 truncate">
            <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <span className="font-bold text-white truncate max-w-xs">{product.title}</span>
            <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700 hidden sm:inline">
              PDF Reader Mode
            </span>
          </div>

          {/* Center Pagination & Zoom Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 hover:bg-slate-800 disabled:opacity-40 text-slate-300 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-[11px]">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 hover:bg-slate-800 disabled:opacity-40 text-slate-300 rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                className="p-1 hover:bg-slate-800 text-slate-300 rounded"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[10px]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                className="p-1 hover:bg-slate-800 text-slate-300 rounded"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => generateAndDownloadPdf(product)}
              className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Document View Canvas */}
        <div className="flex-1 bg-slate-950 overflow-auto p-2 sm:p-8 flex items-center justify-center">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-2xl bg-white text-slate-900 rounded-xl p-5 sm:p-12 shadow-2xl min-h-[480px] sm:min-h-[550px] border border-slate-300 relative transition-transform duration-200 flex flex-col justify-between"
          >
            {/* Page Header */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6 text-xs text-slate-500 font-sans">
                <span className="font-semibold text-slate-800">{product.title}</span>
                <span>PDFSTORE OFFICIAL EDITION</span>
              </div>

              {/* Page Content */}
              <pre className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed text-sm">
                {currentPageText}
              </pre>
            </div>

            {/* Page Footer */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400 font-sans mt-8">
              <span>Licensed PDF Document</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
