import React from 'react';
import type { MotorcycleItem } from '../../types/inventory';
import { useInventory } from '../../context/InventoryContext';
import { Bike, MapPin, Gauge, Copy, MoreVertical, PackagePlus, Eye, Trash2 } from 'lucide-react';

interface MotorcycleCardGridProps {
  items: MotorcycleItem[];
}

export const MotorcycleCardGrid: React.FC<MotorcycleCardGridProps> = ({ items }) => {
  const { setInspectItem, setAdjustStockItem, deleteItem, addToast } = useInventory();
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  const copyVin = (vin: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(vin);
    addToast({
      type: 'info',
      title: 'VIN Copied',
      message: `${vin} copied to clipboard.`
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
        <Bike className="w-12 h-12 mx-auto text-slate-600 mb-3" />
        <h4 className="text-base font-semibold text-white">No Motorcycles Found</h4>
        <p className="text-xs text-slate-400 mt-1">Adjust search parameters or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {items.map(moto => {
        const isMenuOpen = activeMenuId === moto.id;
        const profit = moto.sellingPrice - moto.costPrice;

        return (
          <div
            key={moto.id}
            onClick={() => setInspectItem(moto)}
            className="group relative bg-slate-900 border border-slate-800 hover:border-orange-500/40 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-orange-500/5 cursor-pointer flex flex-col"
          >
            {/* Image Thumbnail Banner */}
            <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
              {moto.imageUrl ? (
                <img
                  src={moto.imageUrl}
                  alt={`${moto.brand} ${moto.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-700">
                  <Bike className="w-16 h-16" />
                </div>
              )}

              {/* Status and Condition Pills Overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md backdrop-blur-md ${
                  moto.condition === 'New'
                    ? 'bg-orange-500/90 text-slate-950'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700'
                }`}>
                  {moto.condition}
                </span>

                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md backdrop-blur-md ${
                  moto.status === 'In Stock'
                    ? 'bg-emerald-500/90 text-slate-950'
                    : moto.status === 'Reserved'
                    ? 'bg-amber-500/90 text-slate-950'
                    : 'bg-rose-500/90 text-slate-950'
                }`}>
                  {moto.status}
                </span>
              </div>

              {/* Category Pill */}
              <div className="absolute top-3 right-3">
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-300 border border-slate-700/80 backdrop-blur-md">
                  {moto.category}
                </span>
              </div>

              {/* Price Banner at bottom of image */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-3 pt-6 flex items-baseline justify-between">
                <span className="text-xl font-tech font-extrabold text-white">
                  ${moto.sellingPrice.toLocaleString()}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  +${profit.toLocaleString()} margin
                </span>
              </div>
            </div>

            {/* Body Info */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                    {moto.year} {moto.brand} {moto.model}
                  </h3>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : moto.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Quick Menu */}
                    {isMenuOpen && (
                      <div className="absolute right-0 mt-1 w-40 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            setInspectItem(moto);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-left"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            setAdjustStockItem(moto);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-left"
                        >
                          <PackagePlus className="w-3.5 h-3.5 text-orange-400" />
                          <span>Change Status</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            if (confirm('Delete this motorcycle?')) {
                              deleteItem(moto.id, 'motorcycle');
                            }
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg text-left"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-[11px] text-slate-400">VIN:</span>
                    <span className="text-slate-300 font-bold">{moto.vin}</span>
                    <button
                      onClick={(e) => copyVin(moto.vin, e)}
                      className="p-1 hover:text-white text-slate-500"
                      title="Copy VIN"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-slate-300">{moto.color}</span>
                </div>
              </div>

              {/* Specs Bar */}
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Gauge className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-mono text-slate-200">
                    {moto.mileage === 0 ? 'Brand New' : `${moto.mileage.toLocaleString()} mi`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 justify-end">
                  <span className="font-mono text-slate-200">{moto.engineCc} cc</span>
                </div>
              </div>

              {/* Location Tag */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                <span className="truncate">{moto.location}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
