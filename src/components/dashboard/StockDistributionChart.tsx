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
      color: 'bg-orange-600',
      textColor: 'text-orange-600',
      icon: <Flame className="w-4 h-4 text-orange-600" />
    },
    {
      label: 'Helmets & Gear',
      count: helmets.reduce((acc, h) => acc + h.quantityInStock, 0),
      unit: 'Units',
      value: helmetsValuation,
      percentage: helmetsPct,
      color: 'bg-gray-800',
      textColor: 'text-gray-900',
      icon: <ShieldCheck className="w-4 h-4 text-gray-700" />
    },
    {
      label: 'Parts & Fluids',
      count: parts.reduce((acc, p) => acc + p.stockCount, 0),
      unit: 'Items',
      value: partsValuation,
      percentage: partsPct,
      color: 'bg-orange-400',
      textColor: 'text-orange-500',
      icon: <Disc className="w-4 h-4 text-orange-500" />
    }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Asset Distribution</h3>
            <p className="text-xs text-gray-500 mt-0.5">Capital allocation across divisions</p>
          </div>
          <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-200">
            <PieChart className="w-4 h-4 text-orange-600" />
          </div>
        </div>

        {/* Progress Bar Segmented */}
        <div className="mt-5">
          <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${motoPct}%` }} 
              className="bg-orange-600 transition-all duration-500" 
              title={`Motorcycles: ${motoPct}%`}
            />
            <div 
              style={{ width: `${helmetsPct}%` }} 
              className="bg-gray-800 transition-all duration-500" 
              title={`Helmets & Gear: ${helmetsPct}%`}
            />
            <div 
              style={{ width: `${partsPct}%` }} 
              className="bg-orange-400 transition-all duration-500" 
              title={`Spare Parts: ${partsPct}%`}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] font-mono text-gray-500 mt-2">
            <span>Bikes: {motoPct}%</span>
            <span>Gear: {helmetsPct}%</span>
            <span>Parts: {partsPct}%</span>
          </div>
        </div>

        {/* Breakdown Items List */}
        <div className="mt-5 space-y-2.5">
          {categoriesBreakdown.map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-white border border-gray-200">
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">{item.label}</div>
                  <div className="text-[11px] text-gray-500">
                    {item.count} {item.unit}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-gray-900">
                  ${item.value.toLocaleString()}
                </div>
                <div className={`text-[10px] font-mono font-bold ${item.textColor}`}>
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
        <span className="text-gray-600 font-medium">Total Live Value:</span>
        <span className="font-mono font-bold text-orange-600">${total.toLocaleString()}</span>
      </div>
    </div>
  );
};
