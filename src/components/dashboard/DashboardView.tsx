import React from 'react';
import { KpiCards } from './KpiCards';
import { QuickActions } from './QuickActions';
import { RecentActivityTable } from './RecentActivityTable';
import { StockDistributionChart } from './StockDistributionChart';
import { LowStockBanner } from './LowStockBanner';
import { MainInventoryTable } from '../inventory/MainInventoryTable';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6 bg-white">
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
        <MainInventoryTable 
          initialTab="motorcycles" 
          title="WEB SHOWROOM" 
          subtitle="PUBLISHED INVENTORY MANAGER"
        />
      </div>
    </div>
  );
};
