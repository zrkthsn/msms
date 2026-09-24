import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import type { NavigationTab } from '../../types/inventory';
import { 
  Globe, 
  Package, 
  Droplet, 
  Tags, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    motorcycles, 
    helmets, 
    parts 
  } = useInventory();

  const [collapsed, setCollapsed] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />
    },
    {
      id: 'motorcycles',
      label: 'Web Showroom',
      icon: <Globe className="w-5 h-5 shrink-0" />,
      badge: motorcycles.length
    },
    {
      id: 'helmets',
      label: 'Accessories & Gear',
      icon: <Package className="w-5 h-5 shrink-0" />,
      badge: helmets.reduce((acc, h) => acc + h.quantityInStock, 0)
    },
    {
      id: 'parts',
      label: 'Oils & Spare Parts',
      icon: <Droplet className="w-5 h-5 shrink-0" />,
      badge: parts.reduce((acc, p) => acc + p.stockCount, 0)
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
      className={`relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-gray-100 justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden cursor-pointer" onClick={() => setActiveTab('motorcycles')}>
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black shadow-sm shrink-0">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          {!collapsed && (
            <div className="flex items-center gap-1">
              <span className="font-showroom text-xl font-black italic tracking-wide text-gray-900">
                MANTASH
              </span>
              <span className="font-showroom text-xl font-black italic tracking-wide text-orange-600">
                OS
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle button matching screenshot with round border */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-orange-600 text-white shadow-sm font-bold'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <div className={`transition-transform duration-200 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-900'}`}>
                {item.icon}
              </div>

              {!collapsed && (
                <>
                  <span className="flex-1 text-left tracking-wide truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile Box matching screenshot */}
      <div className="p-3 border-t border-gray-100">
        <div className={`border border-gray-200 rounded-xl p-3 bg-white flex items-center justify-between ${
          collapsed ? 'justify-center p-2' : ''
        }`}>
          {!collapsed ? (
            <>
              <div className="truncate pr-2">
                <div className="text-xs font-bold text-gray-900 truncate">admin@motors.com</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                  ADMINISTRATOR
                </div>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-700 p-1 rounded-md transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button 
              className="text-gray-400 hover:text-gray-700 p-1"
              title="admin@motors.com"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
