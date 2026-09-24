import React from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { NotificationsDrawer } from './components/layout/NotificationsDrawer';
import { DashboardView } from './components/dashboard/DashboardView';
import { MainInventoryTable } from './components/inventory/MainInventoryTable';
import { CategoriesView } from './components/categories/CategoriesView';
import { SettingsView } from './components/settings/SettingsView';
import { AddItemModal } from './components/inventory/AddItemModal';
import { AdjustStockModal } from './components/inventory/AdjustStockModal';
import { ItemDetailsModal } from './components/inventory/ItemDetailsModal';
import { ToastContainer } from './components/common/ToastContainer';

const AppContent: React.FC = () => {
  const { activeTab } = useInventory();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-gray-900">
      {/* Sidebar Navigation matching screenshot */}
      <Sidebar />

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Topbar Navigation & Search */}
        <Topbar />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto px-6 py-4 sm:px-8 sm:py-6 space-y-6 bg-white">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'motorcycles' && (
            <MainInventoryTable 
              initialTab="motorcycles" 
              title="WEB SHOWROOM" 
              subtitle="PUBLISHED INVENTORY MANAGER" 
            />
          )}
          {activeTab === 'helmets' && (
            <MainInventoryTable 
              initialTab="helmets" 
              title="ACCESSORIES & GEAR" 
              subtitle="PUBLISHED INVENTORY MANAGER" 
            />
          )}
          {activeTab === 'parts' && (
            <MainInventoryTable 
              initialTab="parts" 
              title="OILS & LUBRICANTS" 
              subtitle="PARTS & FLUIDS WAREHOUSE" 
            />
          )}
          {activeTab === 'categories' && <CategoriesView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Overlays & Interactive Modals */}
      <NotificationsDrawer />
      <AddItemModal />
      <AdjustStockModal />
      <ItemDetailsModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  );
}

export default App;
