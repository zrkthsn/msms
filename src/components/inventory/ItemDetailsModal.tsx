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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header Bar */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
              {isMoto && <Bike className="w-5 h-5" />}
              {isGear && <HardHat className="w-5 h-5" />}
              {isPart && <Wrench className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-orange-100 text-orange-700 font-bold border border-orange-200">
                  {inspectItem.type.toUpperCase()}
                </span>
                <span className="text-xs text-gray-400 font-mono">ID: {inspectItem.id}</span>
              </div>
              <h2 className="font-showroom text-2xl font-black italic tracking-wide text-gray-900 mt-0.5">
                {isMoto && `${inspectItem.year} ${inspectItem.brand} ${inspectItem.model}`}
                {isGear && `${inspectItem.brand} ${inspectItem.model}`}
                {isPart && `${inspectItem.brand} - ${inspectItem.name}`}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setInspectItem(null)}
            className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto bg-white">
          {/* Top Identifier Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div>
              <span className="text-[10px] font-mono uppercase text-gray-400 font-bold">
                {isMoto ? 'VIN / Chassis Number' : isGear ? 'SKU Code' : 'Manufacturer Part #'}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-mono font-bold text-gray-900">
                  {isMoto ? inspectItem.vin : isGear ? inspectItem.sku : inspectItem.partNumber}
                </span>
                <button
                  onClick={() => copyToClipboard(isMoto ? inspectItem.vin : isGear ? inspectItem.sku : inspectItem.partNumber)}
                  className="p-1 rounded bg-white hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
                  title="Copy identifier"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <div className="text-[10px] font-mono uppercase text-gray-400 font-bold">
                  {isMoto ? 'Status' : 'Current Stock'}
                </div>
                <div className="mt-1">
                  {isMoto ? (
                    <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      inspectItem.status === 'In Stock'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : inspectItem.status === 'Reserved'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {inspectItem.status}
                    </span>
                  ) : (
                    <span className="text-lg font-mono font-extrabold text-orange-600">
                      {isGear ? inspectItem.quantityInStock : inspectItem.stockCount} Units
                    </span>
                  )}
                </div>
              </div>

              <div className="border-l border-gray-200 pl-4">
                <div className="text-[10px] font-mono uppercase text-gray-400 font-bold">Retail Price</div>
                <div className="text-lg font-mono font-extrabold text-gray-900 mt-0.5">
                  ${isMoto ? inspectItem.sellingPrice.toLocaleString() : isGear ? inspectItem.price.toLocaleString() : inspectItem.unitPrice.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Domain Specific Detail Grid */}
          {isMoto && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Tax Category</div>
                <div className="text-xs font-bold text-gray-900 mt-1">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                    inspectItem.taxCategory === 'Tax'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  }`}>
                    {inspectItem.taxCategory}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Condition</div>
                <div className="text-xs font-bold text-gray-900 mt-1">{inspectItem.condition}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Displacement</div>
                <div className="text-xs font-bold text-gray-900 mt-1">{inspectItem.engineCc} cc</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Mileage</div>
                <div className="text-xs font-bold text-gray-900 mt-1">
                  {inspectItem.mileage === 0 ? '0 mi (Factory New)' : `${inspectItem.mileage.toLocaleString()} mi`}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Color</div>
                <div className="text-xs font-bold text-gray-900 mt-1">{inspectItem.color}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Cost Price</div>
                <div className="text-xs font-bold text-gray-900 mt-1 font-mono">
                  ${inspectItem.costPrice.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Profit Margin</div>
                <div className="text-xs font-bold text-emerald-600 mt-1 font-mono">
                  +${(inspectItem.sellingPrice - inspectItem.costPrice).toLocaleString()} (
                  {Math.round(((inspectItem.sellingPrice - inspectItem.costPrice) / inspectItem.sellingPrice) * 100)}%)
                </div>
              </div>
            </div>
          )}

          {isGear && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Size</div>
                <div className="text-xs font-bold text-gray-900 mt-1">{inspectItem.size}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Safety Cert</div>
                <div className="text-xs font-bold text-blue-600 mt-1 font-mono">{inspectItem.safetyCert}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Apparel Type</div>
                <div className="text-xs font-bold text-gray-900 mt-1">{inspectItem.gearType}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Min Alert Threshold</div>
                <div className="text-xs font-bold text-orange-600 mt-1 font-mono">{inspectItem.minAlertThreshold} Units</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Unit Cost</div>
                <div className="text-xs font-bold text-gray-900 mt-1 font-mono">${inspectItem.costPrice}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Margin per Unit</div>
                <div className="text-xs font-bold text-emerald-600 mt-1 font-mono">
                  +${(inspectItem.price - inspectItem.costPrice).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {isPart && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Category</div>
                <div className="text-xs font-bold text-gray-900 mt-1">{inspectItem.category}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Shelf/Bin Location</div>
                <div className="text-xs font-bold text-orange-600 mt-1 font-mono">{inspectItem.shelfBinLocation}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Reorder Point</div>
                <div className="text-xs font-bold text-orange-600 mt-1 font-mono">{inspectItem.reorderPoint} Units</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 sm:col-span-2">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Compatible Models</div>
                <div className="text-xs font-medium text-gray-800 mt-1">{inspectItem.compatibleModels}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-[10px] uppercase font-mono text-gray-400 font-bold">Unit Cost</div>
                <div className="text-xs font-bold text-gray-900 mt-1 font-mono">${inspectItem.unitCost}</div>
              </div>
            </div>
          )}

          {/* Location & Log summary */}
          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Location: <strong className="text-gray-900">{inspectItem.location}</strong></span>
            </div>
            <span className="text-gray-400 font-mono text-[11px]">
              Created: {new Date(inspectItem.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Delete this item from inventory?')) {
                deleteItem(inspectItem.id, inspectItem.type);
                setInspectItem(null);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold uppercase transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                const item = inspectItem;
                setInspectItem(null);
                setAdjustStockItem(item);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-900 text-xs font-bold uppercase border border-gray-300 transition-colors"
            >
              <PackagePlus className="w-4 h-4 text-orange-600" />
              <span>Adjust Stock</span>
            </button>
            <button
              onClick={() => setInspectItem(null)}
              className="px-5 py-2 rounded-lg bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase shadow-sm transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
