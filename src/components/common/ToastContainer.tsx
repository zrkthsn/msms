import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useInventory();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
        let borderClass = 'border-emerald-200 bg-white';

        if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />;
          borderClass = 'border-orange-200 bg-white';
        } else if (toast.type === 'error') {
          icon = <XCircle className="w-5 h-5 text-red-600 shrink-0" />;
          borderClass = 'border-red-200 bg-white';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-gray-700 shrink-0" />;
          borderClass = 'border-gray-200 bg-white';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${borderClass} shadow-xl text-gray-900 transition-all duration-300 animate-in slide-in-from-bottom-3`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-900 tracking-wide uppercase font-mono">{toast.title}</h4>
              <p className="text-xs text-gray-600 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-900 transition-colors p-1 -mr-1 -mt-1 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
