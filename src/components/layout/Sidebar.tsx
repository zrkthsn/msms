import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import type { NavigationTab } from '../../types/inventory';
import { 
  LayoutDashboard, 
  Bike, 
  HardHat, 
  Wrench, 
  Tags, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Warehouse,
  ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    motorcycles, 
    helmets, 
    parts, 
    lowStockItems,
    selectedLocation
  } = useInventory();

  const [collapsed, setCollapsed] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number | string; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />
    },
    {
      id: 'motorcycles',
      label: 'Motorcycles',
      icon: <Bike className="w-5 h-5 shrink-0" />,
      badge: motorcycles.length,
      badgeColor: 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
    },
    {
      id: 'helmets',
      label: 'Helmets & Gear',
      icon: <HardHat className="w-5 h-5 shrink-0" />,
      badge: helmets.reduce((acc, h) => acc + h.quantityInStock, 0),
      badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
    },
    {
      id: 'parts',
      label: 'Spare Parts',
      icon: <Wrench className="w-5 h-5 shrink-0" />,
      badge: parts.reduce((acc, p) => acc + p.stockCount, 0),
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: <Tags className="w-5 h-5 shrink-0" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5 shrink-0" />
    }
  ];

  return (
    <aside 
      className={`relative flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-18 flex items-center px-4 border-b border-slate-800/80 justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-500/20 shrink-0">
            <Flame className="w-6 h-6 text-slate-950 fill-slate-950" />
          </div>
          {!collapsed && (
            <div className="leading-tight truncate">
              <span className="font-tech text-base font-bold tracking-wider text-white flex items-center gap-1.5">
                MANTASH
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono font-medium">
                  MSMS
                </span>
              </span>
              <p className="text-[10px] tracking-widest text-slate-400 uppercase font-mono truncate">
                Stock Engine v2.4
              </p>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Store Location Pill (Desktop) */}
      {!collapsed && (
        <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center gap-2.5">
          <Warehouse className="w-4 h-4 text-orange-400 shrink-0" />
          <div className="truncate">
            <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Active Depot</div>
            <div className="text-xs font-semibold text-slate-200 truncate">{selectedLocation.name}</div>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-400 border border-orange-500/30 shadow-inner'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <div className={`transition-transform duration-200 ${isActive ? 'text-orange-400 scale-105' : 'group-hover:text-slate-200'}`}>
                {item.icon}
              </div>

              {!collapsed && (
                <>
                  <span className="flex-1 text-left tracking-wide truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Alert quick banner inside sidebar if low stock */}
      {!collapsed && lowStockItems.length > 0 && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Low Stock Alert</span>
          </div>
          <p className="text-[11px] text-amber-200/80 mt-1">
            {lowStockItems.length} inventory lines require reordering.
          </p>
        </div>
      )}

      {/* Footer / User Profile */}
      <div className="p-3 border-t border-slate-800/80">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-2'}`}>
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-600 flex items-center justify-center font-bold text-xs text-white">
              AM
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                Alex Mantash
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Head of Operations</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
