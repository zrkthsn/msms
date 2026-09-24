import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import type { MotorcycleCategoryFilter } from '../../types/inventory';
import { 
  Bike, 
  HardHat, 
  Wrench, 
  Layers, 
  ArrowRight 
} from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const { 
    motorcycles, 
    helmets, 
    parts, 
    setActiveTab, 
    setSearchQuery,
    setMotorcycleCategoryFilter 
  } = useInventory();

  // The 4 user-requested Motorcycle categories
  const motoCategories: { name: string; filter: MotorcycleCategoryFilter; count: number; badge: string }[] = [
    { 
      name: 'Tax Bikes', 
      filter: 'Tax', 
      count: motorcycles.filter(m => m.taxCategory === 'Tax').length,
      badge: 'Taxable'
    },
    { 
      name: 'Tax-Free Bikes', 
      filter: 'Tax-Free', 
      count: motorcycles.filter(m => m.taxCategory === 'Tax-Free').length,
      badge: 'Tax-Free'
    },
    { 
      name: 'Brand New Bikes', 
      filter: 'Brand New', 
      count: motorcycles.filter(m => m.condition === 'Brand New').length,
      badge: '0 Miles'
    },
    { 
      name: 'Old / Used Bikes', 
      filter: 'Old / Used', 
      count: motorcycles.filter(m => m.condition === 'Old / Used').length,
      badge: 'Pre-Owned'
    },
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

  const handleSelectMotoCategory = (filter: MotorcycleCategoryFilter) => {
    setMotorcycleCategoryFilter(filter);
    setActiveTab('motorcycles');
  };

  const handleSelectGearOrPartCategory = (tab: 'helmets' | 'parts', searchKeyword: string) => {
    setActiveTab(tab);
    setSearchQuery(searchKeyword);
  };

  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="font-showroom text-3xl font-black italic tracking-wide text-gray-900">
            INVENTORY CATEGORIES
          </h2>
          <p className="text-xs text-gray-500 font-mono">Organized showroom fleet (Tax, Tax-Free, Brand New, Old/Used), apparel divisions, and spare parts catalog</p>
        </div>
        <div className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
          <Layers className="w-5 h-5" />
        </div>
      </div>

      {/* Grid of Main Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Group 1: Motorcycles */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase">Motorcycle Categories</h3>
                <span className="text-xs text-orange-600 font-mono font-bold">{motorcycles.length} units listed</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {motoCategories.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectMotoCategory(cat.filter)}
                  className="p-3 rounded-lg bg-gray-50 hover:bg-orange-50/50 border border-gray-200 cursor-pointer flex items-center justify-between group transition-all"
                >
                  <div>
                    <span className="text-xs font-bold text-gray-800 group-hover:text-orange-600">
                      {cat.name}
                    </span>
                    <span className="ml-2 text-[10px] font-mono text-gray-400">
                      ({cat.badge})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white text-gray-700 border border-gray-200">
                      {cat.count} units
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setMotorcycleCategoryFilter('All');
              setActiveTab('motorcycles');
            }}
            className="mt-5 w-full py-2.5 rounded-lg bg-white hover:bg-gray-50 text-xs font-bold uppercase text-gray-900 border border-gray-300 transition-colors shadow-xs"
          >
            Explore All Motorcycles
          </button>
        </div>

        {/* Category Group 2: Helmets & Gear */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase">Accessories & Gear</h3>
                <span className="text-xs text-orange-600 font-mono font-bold">
                  {helmets.reduce((a, b) => a + b.quantityInStock, 0)} units in stock
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {gearCategories.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectGearOrPartCategory('helmets', cat.search)}
                  className="p-3 rounded-lg bg-gray-50 hover:bg-orange-50/50 border border-gray-200 cursor-pointer flex items-center justify-between group transition-all"
                >
                  <span className="text-xs font-bold text-gray-800 group-hover:text-orange-600">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white text-gray-700 border border-gray-200">
                      {cat.count} models
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('helmets')}
            className="mt-5 w-full py-2.5 rounded-lg bg-white hover:bg-gray-50 text-xs font-bold uppercase text-gray-900 border border-gray-300 transition-colors shadow-xs"
          >
            Explore Accessories
          </button>
        </div>

        {/* Category Group 3: Spare Parts & Fluids */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase">Oils & Spare Parts</h3>
                <span className="text-xs text-orange-600 font-mono font-bold">
                  {parts.reduce((a, b) => a + b.stockCount, 0)} items in bins
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {partCategories.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectGearOrPartCategory('parts', cat.search)}
                  className="p-3 rounded-lg bg-gray-50 hover:bg-orange-50/50 border border-gray-200 cursor-pointer flex items-center justify-between group transition-all"
                >
                  <span className="text-xs font-bold text-gray-800 group-hover:text-orange-600">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white text-gray-700 border border-gray-200">
                      {cat.count} items
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('parts')}
            className="mt-5 w-full py-2.5 rounded-lg bg-white hover:bg-gray-50 text-xs font-bold uppercase text-gray-900 border border-gray-300 transition-colors shadow-xs"
          >
            Explore Spare Parts
          </button>
        </div>
      </div>
    </div>
  );
};
