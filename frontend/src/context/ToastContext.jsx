import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', options = {}) => {
    const id = Date.now() + Math.random();
    setToasts(prev => {
        // Remove existing toasts if loading or if we want single toast behavior
        const filtered = prev.filter(t => t.type === 'loading' ? false : true); 
        return [...filtered, { id, message, type, ...options }];
    });
    // Auto remove non-loading and non-confirm toasts
    if (type !== 'loading' && type !== 'confirm') {
        const duration = type === 'error' ? 3000 : 3000;
        setTimeout(() => removeToast(id), duration);
    }
    return id; // Return ID so it can be manually dismissed
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
      setToasts([]);
  }, []);

  // Helper functions matching external library API
  const toast = {
    success: (msg) => { dismissAll(); addToast(msg, 'success'); },
    error: (msg) => { dismissAll(); addToast(msg, 'error'); },
    info: (msg) => { dismissAll(); addToast(msg, 'info'); },
    loading: (msg) => { dismissAll(); return addToast(msg, 'loading'); },
    confirm: (msg, onConfirm, onCancel) => { 
        dismissAll(); 
        return addToast(msg, 'confirm', { onConfirm, onCancel }); 
    },
    dismiss: (id) => removeToast(id)
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-50 gap-4">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <Toast 
              message={t.message} 
              type={t.type} 
              onClose={() => removeToast(t.id)}
              onConfirm={t.onConfirm}
              onCancel={t.onCancel}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
