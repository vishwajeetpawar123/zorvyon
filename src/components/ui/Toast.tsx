import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info';
}

// Simple global toast state
let toastListeners: ((msg: ToastMessage) => void)[] = [];

export function showToast(text: string, type: 'success' | 'info' = 'success') {
  const msg: ToastMessage = { id: Date.now().toString(), text, type };
  toastListeners.forEach((fn) => fn(msg));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((msg: ToastMessage) => {
    setToasts((prev) => [...prev, msg]);
  }, []);

  useEffect(() => {
    toastListeners.push(addToast);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== addToast);
    };
  }, [addToast]);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auto-dismiss after 3s
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300"
          style={{
            background: 'var(--glass-bg)',
            borderColor: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-info)',
          }}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-success shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-info shrink-0" />
          )}
          <span className="text-sm font-medium text-text-primary">{toast.text}</span>
          <button
            onClick={() => dismiss(toast.id)}
            className="ml-2 text-text-muted hover:text-text-primary transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
