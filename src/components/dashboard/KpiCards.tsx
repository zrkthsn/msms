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
      subtext: 'Across all active bays & warehouse',
      change: '+12.4% vs last month',
      isPositive: true,
      icon: <DollarSign className="w-5 h-5 text-amber-400" />,
      accentBorder: 'border-amber-500/30',
      accentBg: 'from-amber-500/10 via-amber-500/5 to-transparent',
      badge: 'Real-time'
    },
    {
      title: 'Bikes Available',
      value: bikesAvailable.toString(),
      subtext: `${bikesReserved} unit${bikesReserved === 1 ? '' : 's'} currently reserved`,
      change: '+4 new arrivals this week',
      isPositive: true,
      icon: <Bike className="w-5 h-5 text-orange-400" />,
      accentBorder: 'border-orange-500/30',
      accentBg: 'from-orange-500/10 via-orange-500/5 to-transparent',
      badge: 'Showroom'
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockItems.length.toString(),
      subtext: `${lowStockItems.filter(i => i.currentStock === 0).length} out-of-stock items`,
      change: lowStockItems.length > 0 ? 'Requires attention' : 'Optimal levels',
      isPositive: lowStockItems.length === 0,
      icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
      accentBorder: lowStockItems.length > 0 ? 'border-rose-500/30' : 'border-emerald-500/30',
      accentBg: lowStockItems.length > 0 ? 'from-rose-500/10 via-rose-500/5 to-transparent' : 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      badge: lowStockItems.length > 0 ? 'Critical' : 'Healthy'
    },
    {
      title: 'Units Sold (This Month)',
      value: unitsSold.toString(),
      subtext: `$${soldVolume.toLocaleString()} revenue generated`,
      change: '+18.2% vs target',
      isPositive: true,
      icon: <PackageCheck className="w-5 h-5 text-emerald-400" />,
      accentBorder: 'border-emerald-500/30',
      accentBg: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      badge: 'Target Met'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className={`relative p-5 rounded-2xl bg-slate-900 border ${kpi.accentBorder} bg-gradient-to-br ${kpi.accentBg} shadow-lg transition-all hover:scale-[1.01]`}
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              {kpi.title}
            </span>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
              {kpi.icon}
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-tech text-3xl font-extrabold text-white tracking-tight">
              {kpi.value}
            </span>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700">
              {kpi.badge}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
            <span className="text-slate-400 truncate text-[11px]">{kpi.subtext}</span>
            <div className={`flex items-center gap-1 font-mono text-[11px] font-medium ${kpi.isPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
              {kpi.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{kpi.change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
