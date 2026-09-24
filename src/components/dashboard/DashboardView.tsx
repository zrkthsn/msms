import React from 'react';
import { KpiCards } from './KpiCards';
import { QuickActions } from './QuickActions';
import { RecentActivityTable } from './RecentActivityTable';
import { StockDistributionChart } from './StockDistributionChart';
import { LowStockBanner } from './LowStockBanner';
import { MainInventoryTable } from '../inventory/MainInventoryTable';
import { useInventory } from '../../context/InventoryContext';
import { ArrowRight, Layers } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { setActiveTab } = useInventory();

  return (
    <div className="space-y-6">
      {/* Low stock alert ribbon */}
      <LowStockBanner />

      {/* KPI Stats */}
      <KpiCards />

      {/* Quick Action workflows */}
      <QuickActions />

      {/* Analytics & Activity Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivityTable />
        </div>
        <div className="lg:col-span-1">
          <StockDistributionChart />
        </div>
      </div>

      {/* Main Stock Registry Snapshot */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Live Stock Registry & Fleet Management
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('motorcycles')}
            className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-semibold"
          >
            <span>Showroom Fleet View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <MainInventoryTable initialTab="all" />
      </div>
    </div>
  );
};
