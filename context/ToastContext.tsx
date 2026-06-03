'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Icon configuration based on type
  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-violet-400 shrink-0" />;
    }
  };

  // Border and accent styling based on type
  const getStyleClass = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/20 bg-black/60 shadow-[0_8px_32px_0_rgba(16,185,129,0.08)]';
      case 'error':
        return 'border-rose-500/20 bg-black/60 shadow-[0_8px_32px_0_rgba(244,63,94,0.08)]';
      case 'warning':
        return 'border-amber-500/20 bg-black/60 shadow-[0_8px_32px_0_rgba(245,158,11,0.08)]';
      case 'info':
      default:
        return 'border-[#B473FF]/20 bg-black/60 shadow-[0_8px_32px_0_rgba(180,115,255,0.08)]';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none md:right-6">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${getStyleClass(toast.type)}`}
            >
              <div className="flex items-center gap-3">
                {getIcon(toast.type)}
                <span className="text-sm font-medium text-white tracking-wide">
                  {toast.message}
                </span>
              </div>
              
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 p-1 text-gray-400 hover:text-white rounded-lg transition-colors focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
