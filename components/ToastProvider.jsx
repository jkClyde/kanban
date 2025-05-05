'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  
  // Function to add a toast
  const showToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    
    // Auto-remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };
  
  // Function to remove a toast
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // Listen for custom toast events (for use in server actions or other places)
  useEffect(() => {
    const handleShowToast = (event) => {
      const { message, type, duration } = event.detail;
      showToast(message, type, duration);
    };
    
    window.addEventListener('show-toast', handleShowToast);
    return () => window.removeEventListener('show-toast', handleShowToast);
  }, []);
  
  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast 
            key={toast.id} 
            toast={toast} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Toast component
function Toast({ toast, onClose }) {
  const { id, message, type } = toast;
  
  // Define styles based on toast type
  const styles = {
    success: 'bg-green-100 border-green-500 text-green-800',
    error: 'bg-red-100 border-red-500 text-red-800',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    info: 'bg-blue-100 border-blue-500 text-blue-800',
  };
  
  const toastStyle = styles[type] || styles.info;
  
  return (
    <div 
      className={`p-3 px-4 rounded-md border-l-4 shadow-md flex items-center min-w-64 max-w-md animate-fadeIn ${toastStyle}`}
      role="alert"
    >
      <div className="flex-grow">{message}</div>
      <button 
        onClick={onClose}
        className="ml-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}