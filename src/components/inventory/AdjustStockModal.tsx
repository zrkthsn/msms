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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-showroom text-xl font-black italic tracking-wide text-gray-900">
                ADJUST STOCK LEVEL
              </h3>
              <p className="text-[11px] text-gray-500 font-mono font-bold">{code}</p>
            </div>
          </div>
          <button
            onClick={() => setAdjustStockItem(null)}
            className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 bg-white">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Target Product</div>
              <div className="text-xs font-bold text-gray-900">{title}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Current Stock</div>
              <div className="font-mono text-base font-bold text-orange-600">{currentStock}</div>
            </div>
          </div>

          {/* Direction toggle */}
          <div>
            <label className="block text-[11px] font-mono text-gray-500 uppercase tracking-wider font-bold mb-1.5">
              Action
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection('add')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-bold uppercase transition-all ${
                  direction === 'add'
                    ? 'bg-orange-600 border-orange-600 text-white shadow-xs'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Receive / Add</span>
              </button>
              <button
                type="button"
                onClick={() => setDirection('remove')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-bold uppercase transition-all ${
                  direction === 'remove'
                    ? 'bg-black border-black text-white shadow-xs'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Issue / Remove</span>
              </button>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-[11px] font-mono text-gray-500 uppercase tracking-wider font-bold mb-1.5">
              Quantity to {direction === 'add' ? 'Add' : 'Deduct'}
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-200 bg-gray-50 rounded-lg overflow-hidden flex-1">
                <button
                  type="button"
                  onClick={() => setChangeAmount(prev => Math.max(1, prev - 1))}
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={changeAmount}
                  onChange={(e) => setChangeAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center bg-transparent text-gray-900 font-mono font-bold text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setChangeAmount(prev => prev + 1)}
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quick increment presets */}
              <div className="flex gap-1">
                {[5, 10, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setChangeAmount(num)}
                    className="px-2.5 py-2 rounded-lg bg-white hover:bg-gray-50 text-xs font-mono font-bold text-gray-700 border border-gray-300"
                  >
                    +{num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reason Selector */}
          <div>
            <label className="block text-[11px] font-mono text-gray-500 uppercase tracking-wider font-bold mb-1.5">
              Adjustment Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-orange-500"
            >
              <option value="Stock Receipt from Supplier">Stock Receipt from Supplier</option>
              <option value="Customer Sale Fulfilled">Customer Sale Fulfilled</option>
              <option value="Physical Count Cycle Audit">Physical Count Cycle Audit</option>
              <option value="Damaged / Scrapped in Bay">Damaged / Scrapped in Bay</option>
              <option value="Customer Return">Customer Return</option>
            </select>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-[11px] font-mono text-gray-500 uppercase tracking-wider font-bold mb-1.5">
              Internal Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Packing slip verified by technician"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Summary Preview */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-mono">Projected New Stock:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-gray-400 line-through">{currentStock}</span>
              <span className="text-gray-400 font-mono">→</span>
              <span className="font-mono font-bold text-orange-600 text-sm">{newStock} units</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setAdjustStockItem(null)}
              className="px-4 py-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase shadow-sm transition-all"
            >
              Confirm Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
