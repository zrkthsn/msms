import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Bell, AlertTriangle, X, ArrowRight, PackagePlus, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const { 
    isNotificationsOpen, 
    setIsNotificationsOpen, 
    lowStockItems, 
    setAdjustStockItem, 
    setInspectItem,
    adjustStock 
  } = useInventory();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsNotificationsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Bell className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">Stock Threshold Alerts</h2>
                <p className="text-xs text-slate-400">
                  {lowStockItems.length} {lowStockItems.length === 1 ? 'item requires' : 'items require'} immediate reordering
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alert Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-white">All Stock Levels Healthy</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  No parts or gear are currently below their minimum replenishment threshold.
                </p>
              </div>
            ) : (
              lowStockItems.map((alert, idx) => {
                const isOutOfStock = alert.currentStock === 0;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      isOutOfStock 
                        ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/60' 
                        : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                          isOutOfStock ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {isOutOfStock ? <ShieldAlert className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              isOutOfStock ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {isOutOfStock ? 'Out of Stock' : 'Low Stock Alert'}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">{alert.code}</span>
                          </div>
                          <h4 className="text-sm font-semibold text-slate-100 mt-1 leading-snug">
                            {alert.name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400">Current: </span>
                        <span className={`font-mono font-bold ${isOutOfStock ? 'text-rose-400' : 'text-amber-400'}`}>
                          {alert.currentStock} units
                        </span>
                        <span className="text-slate-500 mx-1.5">|</span>
                        <span className="text-slate-400">Min Alert: </span>
                        <span className="font-mono text-slate-300">{alert.threshold} units</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => {
                          adjustStock(alert.item.id, alert.item.type, 10, 'Quick Reorder from Low Stock Alert');
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md transition-colors"
                      >
                        <PackagePlus className="w-3.5 h-3.5" />
                        Quick Restock +10
                      </button>
                      <button
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          setAdjustStockItem(alert.item);
                        }}
                        className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                      >
                        Custom Qty
                      </button>
                      <button
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          setInspectItem(alert.item);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                        title="View Details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/90 text-center">
            <p className="text-[11px] text-slate-400">
              Thresholds configure automatically based on supplier lead times and sales velocity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
