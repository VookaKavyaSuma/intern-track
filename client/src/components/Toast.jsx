import { useState, useEffect, useCallback } from 'react';

let toastIdCounter = 0;

const Toast = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '1rem',
        left: 'auto',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        pointerEvents: 'none',
        maxWidth: 'calc(100vw - 2rem)',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-up"
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            fontSize: '0.88rem',
            fontWeight: 500,
            minWidth: '240px',
            maxWidth: '100%',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            ...(toast.type === 'success'
              ? {
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: '#34d399',
                }
              : toast.type === 'error'
              ? {
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#f87171',
                }
              : {
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.35)',
                  color: '#a5b4fc',
                }),
          }}
          onClick={() => removeToast(toast.id)}
        >
          <span style={{ fontSize: '1.15rem', flexShrink: 0 }}>
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <span style={{ flex: 1 }}>{toast.message}</span>
          <span
            style={{
              opacity: 0.5,
              fontSize: '1.1rem',
              lineHeight: 1,
              flexShrink: 0,
              marginLeft: '0.5rem',
            }}
          >
            ×
          </span>
        </div>
      ))}
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'success', duration = 3500) => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  return { toasts, addToast, removeToast };
};

export default Toast;
