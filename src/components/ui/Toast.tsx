'use client';

import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.css';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ICONS: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

const TYPE_STYLES: Record<ToastType, string> = {
  success: styles.toastSuccess,
  error: styles.toastError,
  warning: styles.toastWarning,
  info: styles.toastInfo,
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const removeToast = useCallback((id: string) => {
    // Trigger exit animation first
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    // Then remove after animation completes
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 250);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    // Auto-dismiss after 4 seconds
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {mounted && createPortal(
        <div className={styles.toastContainer} role="region" aria-label="Thông báo">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`${styles.toast} ${TYPE_STYLES[toast.type]} ${toast.exiting ? styles.exiting : ''}`}
              role="alert"
            >
              <span className={styles.icon}>{ICONS[toast.type]}</span>
              <div className={styles.content}>
                <p className={styles.message}>{toast.message}</p>
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => removeToast(toast.id)}
                aria-label="Đóng thông báo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
