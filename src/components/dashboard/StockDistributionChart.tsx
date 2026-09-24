import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { PieChart, ShieldCheck, Flame, Disc } from 'lucide-react';

export const StockDistributionChart: React.FC = () => {
  const { motorcycles, helmets, parts } = useInventory();

  // Calculate valuations
  const motoValuation = motorcycles
    .filter(m => m.status !== 'Sold')
    .reduce((sum, m) => sum + m.sellingPrice, 0);

  const helmetsValuation = helmets
    .reduce((sum, h) => sum + (h.price * h.quantityInStock), 0);

  const partsValuation = parts
    .reduce((sum, p) => sum + (p.unitPrice * p.stockCount), 0);

  const total = Math.max(1, motoValuation + helmetsValuation + partsValuation);

  const motoPct = Math.round((motoValuation / total) * 100);
  const helmetsPct = Math.round((helmetsValuation / total) * 100);
  const partsPct = 100 - motoPct - helmetsPct;

  const categoriesBreakdown = [
    {
      label: 'Motorcycles Fleet',
      count: motorcycles.filter(m => m.status === 'In Stock').length,
      unit: 'Bikes',
      value: motoValuation,
      percentage: motoPct,
      color: 'bg-orange-500',
      textColor: 'text-orange-400',
      icon: <Flame className="w-4 h-4 text-orange-400" />
    },
    {
      label: 'Helmets & Apparel',
      count: helmets.reduce((acc, h) => acc + h.quantityInStock, 0),
      unit: 'Units',
      value: helmetsValuation,
      percentage: helmetsPct,
      color: 'bg-sky-500',
      textColor: 'text-sky-400',
      icon: <ShieldCheck className="w-4 h-4 text-sky-400" />
    },
    {
      label: 'Parts & Fluids',
      count: parts.reduce((acc, p) => acc + p.stockCount, 0),
      unit: 'Items',
      value: partsValuation,
      percentage: partsPct,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      icon: <Disc className="w-4 h-4 text-emerald-400" />
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Stock Capital Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">Asset allocation by inventory sector</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
            <PieChart className="w-4 h-4 text-orange-400" />
          </div>
        </div>

        {/* Progress Bar Segmented */}
        <div className="mt-5">
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${motoPct}%` }} 
              className="bg-gradient-to-r from-orange-600 to-amber-500 transition-all duration-500" 
              title={`Motorcycles: ${motoPct}%`}
            />
            <div 
              style={{ width: `${helmetsPct}%` }} 
              className="bg-sky-500 transition-all duration-500" 
              title={`Helmets & Gear: ${helmetsPct}%`}
            />
            <div 
              style={{ width: `${partsPct}%` }} 
              className="bg-emerald-500 transition-all duration-500" 
              title={`Spare Parts: ${partsPct}%`}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-2">
            <span>Bikes: {motoPct}%</span>
            <span>Gear: {helmetsPct}%</span>
            <span>Parts: {partsPct}%</span>
          </div>
        </div>

        {/* Breakdown Items List */}
        <div className="mt-5 space-y-3">
          {categoriesBreakdown.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{item.label}</div>
                  <div className="text-[11px] text-slate-400">
                    {item.count} {item.unit} in depot
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-slate-200">
                  ${item.value.toLocaleString()}
                </div>
                <div className={`text-[10px] font-mono font-medium ${item.textColor}`}>
                  {item.percentage}% of stock
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400">Total Live Capital:</span>
        <span className="font-mono font-bold text-orange-400">${total.toLocaleString()}</span>
      </div>
    </div>
  );
};
