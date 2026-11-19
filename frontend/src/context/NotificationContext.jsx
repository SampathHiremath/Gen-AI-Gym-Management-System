import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showSuccess = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const showError = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const showInfo = useCallback((msg) => addToast(msg, 'info'), [addToast]);

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: 420
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              padding: '12px 18px',
              borderRadius: '8px',
              background: toast.type === 'success' ? '#0f291e' : toast.type === 'error' ? '#2e1218' : '#131b2e',
              border: `1px solid ${toast.type === 'success' ? '#22c55e' : toast.type === 'error' ? '#ef4444' : '#38bdf8'}`,
              color: '#fff',
              fontSize: '0.9rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              cursor: 'pointer',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            <span>{toast.message}</span>
            <span style={{ opacity: 0.6, fontSize: '1.1rem' }}>&times;</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
