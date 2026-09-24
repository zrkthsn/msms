import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export const LowStockBanner: React.FC = () => {
  const { lowStockItems, setIsNotificationsOpen } = useInventory();

  if (lowStockItems.length === 0) return null;

  const outOfStockCount = lowStockItems.filter(i => i.currentStock === 0).length;

  return (
    <div className="relative overflow-hidden rounded-xl bg-orange-50/70 border border-orange-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-100 text-orange-600 border border-orange-200 shrink-0">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              {lowStockItems.length} Products Below Safety Threshold
            </span>
            {outOfStockCount > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-red-100 text-red-700 border border-red-200">
                {outOfStockCount} OUT OF STOCK
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-0.5">
            Key accessories, oils, or parts have reached minimum reorder points.
          </p>
        </div>
      </div>

      <button
        onClick={() => setIsNotificationsOpen(true)}
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase shadow-xs transition-all self-start sm:self-auto shrink-0"
      >
        <span>Review Alerts</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
