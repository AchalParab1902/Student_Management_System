import React, { useEffect } from 'react';

import { X, CheckCircle, AlertCircle, Info, Loader2, HelpCircle } from 'lucide-react';

const Toast = ({ message, type, onClose, onConfirm, onCancel }) => {
  useEffect(() => {
    if (type !== 'loading' && type !== 'confirm') {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    loading: <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />,
    confirm: <HelpCircle className="w-5 h-5 text-amber-500" />
  };

  // Modern white/glass style for all toasts, relying on icons for color
  const baseStyles = "flex items-center p-4 mb-3 rounded-2xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl bg-white/90 min-w-[320px] max-w-md animate-scale-in";

  return (
    <div className={baseStyles}>
      <div className="flex-shrink-0 mr-3">
        {icons[type] || icons.info}
      </div>
      <div className="text-sm font-semibold text-slate-800 flex-1 mr-2 leading-tight">
        {message}
      </div>
      {type !== 'loading' && type !== 'confirm' && (
        <button onClick={onClose} className="ml-auto inline-flex text-slate-400 hover:text-slate-600 focus:outline-none transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Confirmation Buttons */}
      {type === 'confirm' && (
        <div className="flex gap-2 ml-4">
          <button 
            onClick={() => { onConfirm?.(); onClose(); }}
            className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Confirm
          </button>
          <button 
            onClick={() => { onCancel?.(); onClose(); }}
            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 active:scale-95 transition-all"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Toast;
