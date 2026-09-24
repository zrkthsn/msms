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
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar Navigation & Search */}
        <Topbar />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'motorcycles' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">Motorcycle Fleet & Showroom</h2>
                  <p className="text-xs text-slate-400 mt-1">Superbikes, hypernakeds, cruisers, and adventure tourers</p>
                </div>
              </div>
              <MainInventoryTable initialTab="motorcycles" />
            </div>
          )}
          {activeTab === 'helmets' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">Helmets & Rider Apparel</h2>
                  <p className="text-xs text-slate-400 mt-1">DOT, ECE, and FIM certified safety gear, leathers, and accessories</p>
                </div>
              </div>
              <MainInventoryTable initialTab="helmets" />
            </div>
          )}
          {activeTab === 'parts' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">Spare Parts & Warehouse Bins</h2>
                  <p className="text-xs text-slate-400 mt-1">OEM & racing components, brake systems, exhausts, and synthetic fluids</p>
                </div>
              </div>
              <MainInventoryTable initialTab="parts" />
            </div>
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
