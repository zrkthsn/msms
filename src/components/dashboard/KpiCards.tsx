import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { DollarSign, Bike, AlertTriangle, ArrowUpRight, ArrowDownRight, PackageCheck } from 'lucide-react';

export const KpiCards: React.FC = () => {
  const { motorcycles, helmets, parts, lowStockItems } = useInventory();

  // Compute Total Stock Valuation
  const totalMotoValuation = motorcycles
    .filter(m => m.status !== 'Sold')
    .reduce((sum, m) => sum + m.sellingPrice, 0);

  const totalHelmetsValuation = helmets
    .reduce((sum, h) => sum + (h.price * h.quantityInStock), 0);

  const totalPartsValuation = parts
    .reduce((sum, p) => sum + (p.unitPrice * p.stockCount), 0);

  const totalStockValue = totalMotoValuation + totalHelmetsValuation + totalPartsValuation;

  // Bikes Available
  const bikesAvailable = motorcycles.filter(m => m.status === 'In Stock').length;
  const bikesReserved = motorcycles.filter(m => m.status === 'Reserved').length;

  // Sold count
  const unitsSold = 19;
  const soldVolume = 68490;

  const kpis = [
    {
      title: 'Total Stock Valuation',
      value: `$${totalStockValue.toLocaleString()}`,
      subtext: 'Across all active bays & depot',
      change: '+12.4% vs last month',
      isPositive: true,
      icon: <DollarSign className="w-5 h-5 text-orange-600" />,
      badge: 'Live'
    },
    {
      title: 'Bikes in Showroom',
      value: bikesAvailable.toString(),
      subtext: `${bikesReserved} unit${bikesReserved === 1 ? '' : 's'} reserved`,
      change: '+4 new arrivals',
      isPositive: true,
      icon: <Bike className="w-5 h-5 text-gray-900" />,
      badge: 'Showroom'
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockItems.length.toString(),
      subtext: `${lowStockItems.filter(i => i.currentStock === 0).length} out-of-stock items`,
      change: lowStockItems.length > 0 ? 'Action required' : 'Optimal',
      isPositive: lowStockItems.length === 0,
      icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
      badge: lowStockItems.length > 0 ? 'Critical' : 'Healthy'
    },
    {
      title: 'Units Sold (This Month)',
      value: unitsSold.toString(),
      subtext: `$${soldVolume.toLocaleString()} revenue`,
      change: '+18.2% vs target',
      isPositive: true,
      icon: <PackageCheck className="w-5 h-5 text-emerald-600" />,
      badge: 'Target Met'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className="relative p-5 rounded-xl bg-white border border-gray-200 shadow-xs hover:border-gray-300 transition-all"
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-mono uppercase text-gray-500 font-bold tracking-wider">
              {kpi.title}
            </span>
            <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
              {kpi.icon}
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-showroom text-3xl font-black italic tracking-tight text-gray-900">
              {kpi.value}
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
              {kpi.badge}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-gray-100">
            <span className="text-gray-500 truncate text-[11px]">{kpi.subtext}</span>
            <div className={`flex items-center gap-1 font-mono text-[11px] font-bold ${kpi.isPositive ? 'text-emerald-600' : 'text-orange-600'}`}>
              {kpi.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{kpi.change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
