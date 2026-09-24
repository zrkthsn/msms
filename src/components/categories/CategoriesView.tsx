import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { 
  Bike, 
  HardHat, 
  Wrench, 
  Layers, 
  ArrowRight 
} from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const { motorcycles, helmets, parts, setActiveTab, setSearchQuery } = useInventory();

  const motoCategories = [
    { name: 'Sport / Superbike', count: motorcycles.filter(m => m.category === 'Sport').length, search: 'Sport' },
    { name: 'Hypernaked', count: motorcycles.filter(m => m.category === 'Naked').length, search: 'Naked' },
    { name: 'Adventure / Enduro', count: motorcycles.filter(m => m.category === 'Adventure').length, search: 'Adventure' },
    { name: 'Cruiser / Custom', count: motorcycles.filter(m => m.category === 'Cruiser').length, search: 'Cruiser' },
  ];

  const gearCategories = [
    { name: 'Full Face Helmets', count: helmets.filter(h => h.gearType === 'Full Face Helmet').length, search: 'Helmet' },
    { name: 'Leather Jackets', count: helmets.filter(h => h.gearType === 'Riding Jacket').length, search: 'Jacket' },
    { name: '1-Piece Pro Race Suits', count: helmets.filter(h => h.gearType === 'Racing Suit').length, search: 'Suit' },
  ];

  const partCategories = [
    { name: 'Exhaust Systems', count: parts.filter(p => p.category === 'Exhaust').length, search: 'Exhaust' },
    { name: 'Brakes & Hydraulics', count: parts.filter(p => p.category === 'Brakes').length, search: 'Brakes' },
    { name: 'Performance Tires', count: parts.filter(p => p.category === 'Tires').length, search: 'Tires' },
    { name: 'Oil & Synthetic Fluids', count: parts.filter(p => p.category === 'Oil & Fluids').length, search: 'Oil' },
    { name: 'Electrical & Batteries', count: parts.filter(p => p.category === 'Electrical').length, search: 'Electrical' },
  ];

  const handleSelectCategory = (tab: 'motorcycles' | 'helmets' | 'parts', searchKeyword: string) => {
    setActiveTab(tab);
    setSearchQuery(searchKeyword);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Category Taxonomies</h2>
          <p className="text-xs text-slate-400 mt-1">Organized warehouse classification and stock distribution</p>
        </div>
        <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
          <Layers className="w-5 h-5" />
        </div>
      </div>

      {/* Grid of Main Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Group 1: Motorcycles */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Motorcycles Fleet</h3>
                <span className="text-xs text-orange-400 font-mono">{motorcycles.length} units listed</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {motoCategories.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectCategory('motorcycles', cat.search)}
                  className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 cursor-pointer flex items-center justify-between group transition-all"
                >
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:text-orange-400 border border-slate-700">
                      {cat.count} bikes
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('motorcycles')}
            className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            Explore All Motorcycles
          </button>
        </div>

        {/* Category Group 2: Helmets & Gear */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Helmets & Rider Gear</h3>
                <span className="text-xs text-sky-400 font-mono">
                  {helmets.reduce((a, b) => a + b.quantityInStock, 0)} units in stock
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {gearCategories.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectCategory('helmets', cat.search)}
                  className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 cursor-pointer flex items-center justify-between group transition-all"
                >
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:text-sky-400 border border-slate-700">
                      {cat.count} models
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('helmets')}
            className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            Explore Helmets & Gear
          </button>
        </div>

        {/* Category Group 3: Spare Parts & Fluids */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Parts & Accessories</h3>
                <span className="text-xs text-emerald-400 font-mono">
                  {parts.reduce((a, b) => a + b.stockCount, 0)} parts in warehouse
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {partCategories.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectCategory('parts', cat.search)}
                  className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 cursor-pointer flex items-center justify-between group transition-all"
                >
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:text-emerald-400 border border-slate-700">
                      {cat.count} items
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('parts')}
            className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            Explore Spare Parts
          </button>
        </div>
      </div>
    </div>
  );
};
