import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { X, Plus, Minus, PackageCheck } from 'lucide-react';

export const AdjustStockModal: React.FC = () => {
  const { adjustStockItem, setAdjustStockItem, adjustStock } = useInventory();
  const [changeAmount, setChangeAmount] = useState<number>(1);
  const [direction, setDirection] = useState<'add' | 'remove'>('add');
  const [reason, setReason] = useState('Stock Receipt from Supplier');
  const [notes, setNotes] = useState('');

  if (!adjustStockItem) return null;

  let currentStock = 0;
  let code = '';
  let title = '';

  if (adjustStockItem.type === 'motorcycle') {
    currentStock = adjustStockItem.status === 'In Stock' ? 1 : 0;
    code = adjustStockItem.vin;
    title = `${adjustStockItem.year} ${adjustStockItem.brand} ${adjustStockItem.model}`;
  } else if (adjustStockItem.type === 'helmet') {
    currentStock = adjustStockItem.quantityInStock;
    code = adjustStockItem.sku;
    title = `${adjustStockItem.brand} ${adjustStockItem.model} (${adjustStockItem.size})`;
  } else {
    currentStock = adjustStockItem.stockCount;
    code = adjustStockItem.partNumber;
    title = `${adjustStockItem.brand} - ${adjustStockItem.name}`;
  }

  const effectiveChange = direction === 'add' ? changeAmount : -changeAmount;
  const newStock = Math.max(0, currentStock + effectiveChange);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (changeAmount <= 0) return;

    adjustStock(
      adjustStockItem.id,
      adjustStockItem.type,
      effectiveChange,
      `${reason}${notes ? ` - ${notes}` : ''}`
    );
    setAdjustStockItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Adjust Stock Level</h3>
              <p className="text-xs text-slate-400 font-mono">{code}</p>
            </div>
          </div>
          <button
            onClick={() => setAdjustStockItem(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Target Item</div>
              <div className="text-sm font-semibold text-slate-100">{title}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Current Qty</div>
              <div className="font-mono text-base font-bold text-orange-400">{currentStock}</div>
            </div>
          </div>

          {/* Direction toggle */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Adjustment Action
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection('add')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  direction === 'add'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Receive / Add Stock</span>
              </button>
              <button
                type="button"
                onClick={() => setDirection('remove')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  direction === 'remove'
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Minus className="w-4 h-4" />
                <span>Issue / Remove Stock</span>
              </button>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Quantity to {direction === 'add' ? 'Add' : 'Deduct'}
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-800 bg-slate-950 rounded-xl overflow-hidden flex-1">
                <button
                  type="button"
                  onClick={() => setChangeAmount(prev => Math.max(1, prev - 1))}
                  className="p-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={changeAmount}
                  onChange={(e) => setChangeAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center bg-transparent text-white font-mono font-bold text-base focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setChangeAmount(prev => prev + 1)}
                  className="p-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quick increment pill presets */}
              <div className="flex gap-1.5">
                {[5, 10, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setChangeAmount(num)}
                    className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700"
                  >
                    +{num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reason Selector */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Adjustment Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-orange-500/50"
            >
              <option value="Stock Receipt from Supplier">Stock Receipt from Supplier</option>
              <option value="Customer Sale Fulfilled">Customer Sale Fulfilled</option>
              <option value="Physical Count Cycle Audit">Physical Count Cycle Audit</option>
              <option value="Damaged / Scrapped in Bay">Damaged / Scrapped in Bay</option>
              <option value="Inter-Branch Transfer">Inter-Branch Transfer</option>
              <option value="Customer Return">Customer Return</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Internal Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., PO #88910 verified by technician"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500/50"
            />
          </div>

          {/* Summary Preview */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">New Projected Stock:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-500 line-through">{currentStock}</span>
              <span className="text-slate-400 font-mono">→</span>
              <span className="font-mono font-bold text-orange-400 text-sm">{newStock} units</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setAdjustStockItem(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-slate-950 font-bold text-xs shadow-md shadow-orange-600/30 transition-all"
            >
              Confirm Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
