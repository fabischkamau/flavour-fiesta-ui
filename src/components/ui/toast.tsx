// ToastContext.tsx
import React, { createContext, useContext, useState } from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

type ToastVariant = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  title: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (title: string, message: string, variant: ToastVariant) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (title: string, message: string, variant: ToastVariant) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, variant }]);
    setTimeout(() => removeToast(id), 5000); // Auto remove after 5 seconds
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const getVariantStyles = (variant: ToastVariant) => {
  switch (variant) {
    case "success":
      return {
        bg: "bg-emerald-900/90",
        icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
        borderColor: "border-l-emerald-500",
      };
    case "error":
      return {
        bg: "bg-red-900/90",
        icon: <XCircle className="w-5 h-5 text-red-400" />,
        borderColor: "border-l-red-500",
      };
    case "warning":
      return {
        bg: "bg-amber-900/90",
        icon: <AlertCircle className="w-5 h-5 text-amber-400" />,
        borderColor: "border-l-amber-500",
      };
    case "info":
      return {
        bg: "bg-blue-900/90",
        icon: <Info className="w-5 h-5 text-blue-400" />,
        borderColor: "border-l-blue-500",
      };
  }
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {toasts.map((toast) => {
        const variantStyles = getVariantStyles(toast.variant);

        return (
          <div
            key={toast.id}
            className={`${variantStyles.bg} border-l-4 ${variantStyles.borderColor} text-white p-4 rounded-r shadow-lg 
                       backdrop-blur-sm min-w-[300px] max-w-[400px] transform transition-all duration-300 ease-in-out
                       hover:translate-x-[-5px]`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">{variantStyles.icon}</div>
              <div className="ml-3 w-full">
                <p className="font-semibold">{toast.title}</p>
                <p className="mt-1 text-sm opacity-90">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-white/80 hover:text-white transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
