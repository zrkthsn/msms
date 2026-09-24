import React, { useState, useRef, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { 
  Search, 
  Bell, 
  MapPin, 
  Plus, 
  ChevronDown, 
  Check, 
  X,
  Bike,
  HardHat,
  Wrench,
  Command
} from 'lucide-react';

export const Topbar: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    locations, 
    selectedLocation, 
    setSelectedLocation,
    lowStockItems,
    setIsNotificationsOpen,
    openAddModal,
    allItems,
    setInspectItem
  } = useInventory();

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Cmd+K or Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('system-search-input') as HTMLInputElement;
        input?.focus();
        setIsSearchFocused(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter items matching search for quick popover preview
  const liveResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allItems.filter(item => {
      if (item.type === 'motorcycle') {
        return (
          item.brand.toLowerCase().includes(q) ||
          item.model.toLowerCase().includes(q) ||
          item.vin.toLowerCase().includes(q) ||
          item.color.toLowerCase().includes(q)
        );
      } else if (item.type === 'helmet') {
        return (
          item.brand.toLowerCase().includes(q) ||
          item.model.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q)
        );
      } else {
        return (
          item.name.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.partNumber.toLowerCase().includes(q) ||
          item.shelfBinLocation.toLowerCase().includes(q)
        );
      }
    }).slice(0, 5);
  }, [allItems, searchQuery]);

  return (
    <header className="h-18 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Search Bar */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            id="system-search-input"
            type="text"
            placeholder="Search stock by Brand, Model, VIN, Part #, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full pl-10 pr-24 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
          
          <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="pointer-events-auto p-0.5 rounded text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
              <Command className="w-3 h-3" /> K
            </kbd>
          </div>
        </div>

        {/* Live Search Quick Results Dropdown */}
        {isSearchFocused && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="p-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 px-3">
              <span>Quick Matches ({liveResults.length})</span>
              <span className="font-mono text-[10px]">Press Enter to view all</span>
            </div>
            {liveResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No items found matching "<span className="text-orange-400">{searchQuery}</span>"
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {liveResults.map(item => {
                  let title = '';
                  let subtitle = '';
                  let icon = <Bike className="w-4 h-4 text-orange-400" />;
                  let typeLabel = 'Motorcycle';

                  if (item.type === 'motorcycle') {
                    title = `${item.year} ${item.brand} ${item.model}`;
                    subtitle = `VIN: ${item.vin} • $${item.sellingPrice.toLocaleString()}`;
                    icon = <Bike className="w-4 h-4 text-orange-400" />;
                    typeLabel = 'Motorcycle';
                  } else if (item.type === 'helmet') {
                    title = `${item.brand} ${item.model} (${item.size})`;
                    subtitle = `SKU: ${item.sku} • Stock: ${item.quantityInStock}`;
                    icon = <HardHat className="w-4 h-4 text-sky-400" />;
                    typeLabel = 'Gear';
                  } else {
                    title = `${item.brand} - ${item.name}`;
                    subtitle = `Part: ${item.partNumber} • Bin: ${item.shelfBinLocation}`;
                    icon = <Wrench className="w-4 h-4 text-emerald-400" />;
                    typeLabel = 'Spare Part';
                  }

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setInspectItem(item);
                        setIsSearchFocused(false);
                      }}
                      className="p-3 hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                          {icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-200">{title}</div>
                          <div className="text-xs text-slate-400 font-mono">{subtitle}</div>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {typeLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Active Store Location Selector */}
        <div ref={locationDropdownRef} className="relative">
          <button
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-2 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition-all"
          >
            <div className="p-1 rounded-md bg-orange-500/10 text-orange-400">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-[9px] uppercase font-mono text-slate-400 tracking-wider">Showroom / Depot</div>
              <div className="text-xs font-semibold text-slate-100 max-w-[150px] truncate">
                {selectedLocation.name}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {/* Location Dropdown Menu */}
          {isLocationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Switch Dealership Branch
              </div>
              <div className="mt-1 space-y-1">
                {locations.map(loc => {
                  const isSelected = loc.id === selectedLocation.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setIsLocationDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-all ${
                        isSelected 
                          ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30' 
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-orange-400' : 'text-slate-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white flex items-center justify-between">
                          <span className="truncate">{loc.name}</span>
                          {loc.isPrimary && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300 font-mono">
                              HQ
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">{loc.address}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Low-stock Notifications Badge */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2.5 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-all group"
          title="Stock Alerts"
        >
          <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
          {lowStockItems.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-[10px] font-mono font-bold text-slate-950 shadow-md animate-pulse">
              {lowStockItems.length}
            </span>
          )}
        </button>

        {/* Global Quick Action: Add Item */}
        <button
          onClick={() => openAddModal('motorcycle')}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">Add Item</span>
        </button>
      </div>
    </header>
  );
};
