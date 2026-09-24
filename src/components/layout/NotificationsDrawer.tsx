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
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsNotificationsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-orange-50 border border-orange-200 text-orange-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">Stock Threshold Alerts</h2>
                <p className="text-xs text-gray-500">
                  {lowStockItems.length} {lowStockItems.length === 1 ? 'item requires' : 'items require'} immediate reordering
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alert Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50/50">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">All Stock Levels Optimal</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  No accessories or parts are currently below replenishment thresholds.
                </p>
              </div>
            ) : (
              lowStockItems.map((alert, idx) => {
                const isOutOfStock = alert.currentStock === 0;

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 p-1.5 rounded-md shrink-0 ${
                          isOutOfStock ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {isOutOfStock ? <ShieldAlert className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider font-mono ${
                              isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {isOutOfStock ? 'Out of Stock' : 'Low Stock'}
                            </span>
                            <span className="text-[11px] font-mono text-gray-400 font-bold">{alert.code}</span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-900 mt-1 leading-snug">
                            {alert.name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-gray-400 font-mono text-[11px]">Current: </span>
                        <span className={`font-mono font-bold ${isOutOfStock ? 'text-red-600' : 'text-orange-600'}`}>
                          {alert.currentStock} units
                        </span>
                        <span className="text-gray-300 mx-1.5">|</span>
                        <span className="text-gray-400 font-mono text-[11px]">Min Alert: </span>
                        <span className="font-mono text-gray-700 font-bold">{alert.threshold} units</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => {
                          adjustStock(alert.item.id, alert.item.type, 10, 'Quick Restock from Alert');
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase shadow-xs transition-colors"
                      >
                        <PackagePlus className="w-3.5 h-3.5" />
                        Restock +10
                      </button>
                      <button
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          setAdjustStockItem(alert.item);
                        }}
                        className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase border border-gray-300 transition-colors"
                      >
                        Adjust
                      </button>
                      <button
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          setInspectItem(alert.item);
                        }}
                        className="p-1.5 rounded-lg bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 border border-gray-300 transition-colors"
                        title="View Details"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
