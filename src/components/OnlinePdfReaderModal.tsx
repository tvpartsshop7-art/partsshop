import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Lock,
  EyeOff
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
  const [isScreenBlanked, setIsScreenBlanked] = useState(false);
  const [securityNotice, setSecurityNotice] = useState('');

  const totalPages = product.pdfPageCount || 10;

  const samplePagesList = product.sampleTextPages || [
    `SCHEMATIC SECTION 1: POWER CIRCUIT & VOLTAGE RAILS\n\nModel: ${product.title}\nPrimary Input: 100V-240V AC 50/60Hz\nSTBY Voltage: 3.3V / 5.0V Active\nMain Power Bus: 12V (2.5A), 24V (4.0A)\n\nPROTECTED TECHNICAL SCHEMATIC - DO NOT REDISTRIBUTE.`,
  ];

  const currentPageText =
    samplePagesList[(currentPage - 1) % samplePagesList.length] ||
    `SCHEMATIC DIAGRAM PAGE ${currentPage}\n\nTechnical Model: ${product.title}\nSignal Routing: Main Board LVDS to T-Con Interface\nTest Points: TP1(VGH)=28V, TP2(VGL)=-6V, TP3(VDD)=3.3V, TP4(AVDD)=15V\n\nVerified Component Layout & Diagnostic Matrix.`;

  // ==================== ANTI-SCREENSHOT & SCREEN CAPTURE PROTECTION ====================
  useEffect(() => {
    // 1. Trigger Blank Screen on Key Combinations (PrintScreen, Snipping Tool, DevTools, Print, Save)
    const triggerBlankScreen = (reason: string) => {
      setIsScreenBlanked(true);
      setSecurityNotice(reason);

      // Attempt to clear clipboard to prevent pasted screenshot
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('Protected Content - PartsShop Security');
        }
      } catch (_) {}

      // Auto restore after 3.5 seconds if window stays in focus
      setTimeout(() => {
        if (document.hasFocus() && !document.hidden) {
          setIsScreenBlanked(false);
          setSecurityNotice('');
        }
      }, 3500);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen Key
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        triggerBlankScreen('PrintScreen / Screenshot Attempt Detected');
        return false;
      }

      // Windows Snipping Tool (Win + Shift + S) or Mac Screenshot (Meta + Shift + 3/4/5)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 's' || e.key === 'S' || e.key === '3' || e.key === '4' || e.key === '5')) {
        e.preventDefault();
        triggerBlankScreen('Screen Capture Shortcut Blocked');
        return false;
      }

      // Print (Ctrl + P)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        triggerBlankScreen('Print Function Disabled on Protected Schematic');
        return false;
      }

      // Save Webpage (Ctrl + S)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        triggerBlankScreen('Saving Disabled on Protected Schematic');
        return false;
      }

      // Inspect / DevTools (F12, Ctrl + Shift + I)
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.key === 'c' || e.key === 'C'))) {
        e.preventDefault();
        triggerBlankScreen('Developer Tools Restricted');
        return false;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        triggerBlankScreen('Screenshot Capture Detected & Blanked');
      }
    };

    // 2. Window Blur & Visibility Change (Snipping Tool & Screen Recorder overlay triggers window blur)
    const handleWindowBlur = () => {
      setIsScreenBlanked(true);
      setSecurityNotice('Window Out of Focus • Screen Capture Protection Active');
    };

    const handleWindowFocus = () => {
      setIsScreenBlanked(false);
      setSecurityNotice('');
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsScreenBlanked(true);
        setSecurityNotice('Screen Recording / Background App Detected');
      } else {
        setIsScreenBlanked(false);
        setSecurityNotice('');
      }
    };

    // 3. Disable Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <div id="online-reader-backdrop" className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 select-none">
      <div
        id="online-reader-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[92vh] flex flex-col shadow-2xl overflow-hidden relative text-slate-100 select-none"
      >
        {/* ==================== ANTI-SCREENSHOT BLANK SCREEN OVERLAY ==================== */}
        {isScreenBlanked && (
          <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col items-center justify-center p-6 text-center space-y-4 select-none">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 animate-pulse">
              <EyeOff className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                ⚠️ Screen Capture / Screenshot Blocked
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                {securityNotice || 'Screenshots and screen capture are strictly restricted to protect technical schematic copyrights.'}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Click inside this window to resume viewing</span>
            </div>
          </div>
        )}

        {/* Top PDF Reader Control Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs gap-3 select-none">
          <div className="flex items-center gap-2 truncate">
            <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <span className="font-bold text-white truncate max-w-xs">{product.title}</span>
            <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700 hidden sm:inline">
              Protected Reader
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
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">DRM Protected</span>
            </span>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Document View Canvas */}
        <div className="flex-1 bg-slate-950 overflow-auto p-2 sm:p-8 flex items-center justify-center relative">
          <div
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
            className="w-full max-w-2xl bg-white text-slate-900 rounded-xl p-5 sm:p-12 shadow-2xl min-h-[480px] sm:min-h-[550px] border border-slate-300 relative transition-transform duration-200 flex flex-col justify-between overflow-hidden"
          >
            {/* Watermark Diagonal Pattern */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.06] select-none rotate-[-30deg]">
              <span className="text-3xl sm:text-5xl font-black font-mono tracking-widest text-slate-900 whitespace-nowrap">
                PARTS SHOP • PROTECTED SCHEMATIC
              </span>
            </div>

            {/* Page Header */}
            <div>
              <div className="border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-800">
                    {product.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-mono">
                    Online Vector Document • Sheet {currentPage} of {totalPages}
                  </p>
                </div>
                <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono border border-slate-200">
                  CONFIDENTIAL
                </span>
              </div>

              {/* Dynamic Schematic Document Content */}
              <div className="text-slate-800 text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-200">
                {currentPageText}
              </div>
            </div>

            {/* Page Footer */}
            <div className="mt-8 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Licensed Online Viewer</span>
              <span className="text-blue-600 font-bold">PartsShop Secure DRM</span>
              <span>Page {currentPage} / {totalPages}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
