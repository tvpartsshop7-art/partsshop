import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw, ArrowLeft } from 'lucide-react';

interface AdminErrorBoundaryProps {
  children: React.ReactNode;
  onBackToStore?: () => void;
}

export const AdminErrorBoundary: React.FC<AdminErrorBoundaryProps> = ({
  children,
  onBackToStore
}) => {
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Admin Panel caught runtime error:', event.error || event.message);
      if (window.location.hash.includes('admin') || window.location.pathname.includes('admin')) {
        setHasError(true);
        setErrorMsg(event.message || 'An unexpected error occurred in the Admin Panel.');
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">Admin Panel Recovery</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              An unexpected interface issue occurred. The system has secured your admin session.
            </p>
            {errorMsg && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-red-300 text-left overflow-x-auto max-h-24">
                {errorMsg}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setHasError(false);
                setErrorMsg('');
                window.location.reload();
              }}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Admin Console</span>
            </button>

            {onBackToStore && (
              <button
                onClick={onBackToStore}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-blue-400" />
                <span>Back to Store</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
