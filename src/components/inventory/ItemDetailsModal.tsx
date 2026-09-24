import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { 
  X, 
  Bike, 
  HardHat, 
  Wrench, 
  MapPin, 
  Copy, 
  Check, 
  PackagePlus, 
  Trash2 
} from 'lucide-react';

export const ItemDetailsModal: React.FC = () => {
  const { inspectItem, setInspectItem, setAdjustStockItem, deleteItem, addToast } = useInventory();
  const [copied, setCopied] = React.useState(false);

  if (!inspectItem) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      type: 'info',
      title: 'Copied to Clipboard',
      message: `${text} copied.`
    });
  };

  const isMoto = inspectItem.type === 'motorcycle';
  const isGear = inspectItem.type === 'helmet';
  const isPart = inspectItem.type === 'part';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              {isMoto && <Bike className="w-5 h-5" />}
              {isGear && <HardHat className="w-5 h-5" />}
              {isPart && <Wrench className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30">
                  {inspectItem.type.toUpperCase()}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {inspectItem.id}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {isMoto && `${inspectItem.year} ${inspectItem.brand} ${inspectItem.model}`}
                {isGear && `${inspectItem.brand} ${inspectItem.model}`}
                {isPart && `${inspectItem.brand} - ${inspectItem.name}`}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setInspectItem(null)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top Info Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400">
                {isMoto ? 'VIN / Chassis Number' : isGear ? 'SKU Code' : 'Manufacturer Part #'}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-mono font-bold text-slate-100">
                  {isMoto ? inspectItem.vin : isGear ? inspectItem.sku : inspectItem.partNumber}
                </span>
                <button
                  onClick={() => copyToClipboard(isMoto ? inspectItem.vin : isGear ? inspectItem.sku : inspectItem.partNumber)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Copy identifier"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <div className="text-[11px] font-mono uppercase text-slate-400">
                  {isMoto ? 'Status' : 'Current Stock'}
                </div>
                <div className="mt-1">
                  {isMoto ? (
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                      inspectItem.status === 'In Stock'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : inspectItem.status === 'Reserved'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {inspectItem.status}
                    </span>
                  ) : isGear ? (
                    <span className="text-base font-mono font-extrabold text-orange-400">
                      {inspectItem.quantityInStock} Units
                    </span>
                  ) : (
                    <span className="text-base font-mono font-extrabold text-orange-400">
                      {inspectItem.stockCount} Units
                    </span>
                  )}
                </div>
              </div>

              <div className="border-l border-slate-800 pl-4">
                <div className="text-[11px] font-mono uppercase text-slate-400">Retail Price</div>
                <div className="text-base font-mono font-extrabold text-white mt-1">
                  ${isMoto ? inspectItem.sellingPrice.toLocaleString() : isGear ? inspectItem.price.toLocaleString() : inspectItem.unitPrice.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Domain Specific Detail Grid */}
          {isMoto && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Condition</div>
                <div className="text-sm font-semibold text-slate-100 mt-1">{inspectItem.condition}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Engine Displacement</div>
                <div className="text-sm font-semibold text-slate-100 mt-1">{inspectItem.engineCc} cc</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Mileage</div>
                <div className="text-sm font-semibold text-slate-100 mt-1">
                  {inspectItem.mileage === 0 ? '0 mi (Factory New)' : `${inspectItem.mileage.toLocaleString()} mi`}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Color Finish</div>
                <div className="text-sm font-semibold text-slate-100 mt-1">{inspectItem.color}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Cost Price</div>
                <div className="text-sm font-semibold text-slate-300 mt-1 font-mono">
                  ${inspectItem.costPrice.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Profit Margin</div>
                <div className="text-sm font-semibold text-emerald-400 mt-1 font-mono">
                  +${(inspectItem.sellingPrice - inspectItem.costPrice).toLocaleString()} (
                  {Math.round(((inspectItem.sellingPrice - inspectItem.costPrice) / inspectItem.sellingPrice) * 100)}%)
                </div>
              </div>
            </div>
          )}

          {isGear && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Size</div>
                <div className="text-sm font-semibold text-slate-100 mt-1">{inspectItem.size}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Safety Cert</div>
                <div className="text-sm font-semibold text-sky-400 mt-1 font-mono">{inspectItem.safetyCert}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Apparel Type</div>
                <div className="text-sm font-semibold text-slate-100 mt-1">{inspectItem.gearType}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Min Alert Threshold</div>
                <div className="text-sm font-semibold text-amber-400 mt-1 font-mono">{inspectItem.minAlertThreshold} Units</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Unit Cost</div>
                <div className="text-sm font-semibold text-slate-300 mt-1 font-mono">${inspectItem.costPrice}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Margin per Unit</div>
                <div className="text-sm font-semibold text-emerald-400 mt-1 font-mono">
                  +${(inspectItem.price - inspectItem.costPrice).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {isPart && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Category</div>
                <div className="text-sm font-semibold text-slate-100 mt-1">{inspectItem.category}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Warehouse Shelf/Bin</div>
                <div className="text-sm font-semibold text-orange-400 mt-1 font-mono">{inspectItem.shelfBinLocation}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Reorder Point</div>
                <div className="text-sm font-semibold text-amber-400 mt-1 font-mono">{inspectItem.reorderPoint} Units</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 sm:col-span-2">
                <div className="text-[10px] uppercase font-mono text-slate-400">Compatible Bike Models</div>
                <div className="text-xs font-medium text-slate-200 mt-1">{inspectItem.compatibleModels}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400">Unit Cost</div>
                <div className="text-sm font-semibold text-slate-300 mt-1 font-mono">${inspectItem.unitCost}</div>
              </div>
            </div>
          )}

          {/* Location & Log summary */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Assigned Storage: <strong className="text-white">{inspectItem.location}</strong></span>
            </div>
            <span className="text-slate-500 font-mono text-[11px]">
              Created: {new Date(inspectItem.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to permanently delete this item from inventory?')) {
                deleteItem(inspectItem.id, inspectItem.type);
                setInspectItem(null);
              }
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Item</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const item = inspectItem;
                setInspectItem(null);
                setAdjustStockItem(item);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <PackagePlus className="w-4 h-4 text-orange-400" />
              <span>Adjust Stock</span>
            </button>
            <button
              onClick={() => setInspectItem(null)}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
