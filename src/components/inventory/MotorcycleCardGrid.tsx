import React from 'react';
import type { MotorcycleItem } from '../../types/inventory';
import { useInventory } from '../../context/InventoryContext';
import { Bike, MoreVertical, PackagePlus, Eye, Trash2 } from 'lucide-react';

interface MotorcycleCardGridProps {
  items: MotorcycleItem[];
}

export const MotorcycleCardGrid: React.FC<MotorcycleCardGridProps> = ({ items }) => {
  const { setInspectItem, setAdjustStockItem, deleteItem } = useInventory();
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
        <Bike className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <h4 className="text-base font-bold text-gray-900">No Motorcycles Found</h4>
        <p className="text-xs text-gray-500 mt-1">Adjust search parameters or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((moto, idx) => {
        const isMenuOpen = activeMenuId === moto.id;
        
        // Days in stock tag (e.g. 10D, 20D, 48D, 64D, 87D)
        const daysInStock = ((idx * 17 + 10) % 90) + 5;
        const isLongStock = daysInStock > 40;

        return (
          <div
            key={moto.id}
            onClick={() => setInspectItem(moto)}
            className="group relative bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md rounded-xl p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer"
          >
            {/* Clean Placeholder Box (No photos loaded) */}
            <div className="relative h-36 w-full bg-gray-50/80 border border-gray-100 rounded-lg flex flex-col items-center justify-center p-3 overflow-hidden group-hover:border-orange-200 group-hover:bg-orange-50/20 transition-all">
              <Bike className="w-10 h-10 text-gray-300 group-hover:text-orange-500 transition-colors stroke-[1.25]" />
              <span className="text-[9px] font-mono font-bold text-gray-400 mt-1.5 uppercase tracking-widest group-hover:text-orange-600 transition-colors">
                {moto.category}
              </span>

              {/* Status Pill if Sold or Reserved */}
              {moto.status !== 'In Stock' && (
                <div className="absolute top-1.5 left-1.5">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    moto.status === 'Reserved' 
                      ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                      : 'bg-gray-200 text-gray-700 border border-gray-300'
                  }`}>
                    {moto.status}
                  </span>
                </div>
              )}

              {/* Quick 3-dots Menu Button */}
              <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(isMenuOpen ? null : moto.id);
                  }}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-white border border-transparent hover:border-gray-200 shadow-xs"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-xl p-1 z-30 text-left">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                        setInspectItem(moto);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <Eye className="w-3 h-3 text-orange-600" />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                        setAdjustStockItem(moto);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <PackagePlus className="w-3 h-3 text-blue-600" />
                      <span>Status</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                        if (confirm('Delete motorcycle?')) {
                          deleteItem(moto.id, 'motorcycle');
                        }
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Information Block matching user screenshot */}
            <div className="pt-3">
              {/* Brand in italic uppercase */}
              <div className="text-[10px] font-bold italic uppercase tracking-wider text-gray-400 font-mono">
                {moto.brand}
              </div>

              {/* Model in heavy bold italic black */}
              <div className="font-showroom text-xl font-black italic tracking-wide text-gray-900 leading-tight truncate mt-0.5">
                {moto.model}
              </div>

              {/* Year & Days-in-stock tag */}
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 font-mono">
                  {moto.year}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-900 font-mono">
                    ${moto.sellingPrice.toLocaleString()}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                    isLongStock
                      ? 'border-orange-500 text-orange-600 bg-orange-50/50'
                      : 'border-gray-200 text-gray-500 bg-gray-50'
                  }`}>
                    {daysInStock}D
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
