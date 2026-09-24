import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export const LowStockBanner: React.FC = () => {
  const { lowStockItems, setIsNotificationsOpen } = useInventory();

  if (lowStockItems.length === 0) return null;

  const outOfStockCount = lowStockItems.filter(i => i.currentStock === 0).length;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/40 via-orange-950/20 to-slate-900 border border-amber-500/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-3.5">
        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
          <AlertTriangle className="w-5 h-5 animate-bounce" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-wide">
              {lowStockItems.length} Items Require Replenishment
            </span>
            {outOfStockCount > 0 && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {outOfStockCount} OUT OF STOCK
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Key parts and helmet sizes are at or below minimum threshold points.
          </p>
        </div>
      </div>

      <button
        onClick={() => setIsNotificationsOpen(true)}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto shrink-0"
      >
        <span>Review Alerts</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
