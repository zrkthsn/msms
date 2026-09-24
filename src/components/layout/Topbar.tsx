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
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Search Bar */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-lg">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
          <input
            id="system-search-input"
            type="text"
            placeholder="Search VIN, Brand, Model, Part # or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full pl-10 pr-20 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium"
          />
          
          <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="pointer-events-auto p-0.5 rounded text-gray-400 hover:text-gray-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-white border border-gray-200 rounded shadow-xs">
              <Command className="w-3 h-3" /> K
            </kbd>
          </div>
        </div>

        {/* Live Search Quick Results Dropdown */}
        {isSearchFocused && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
            <div className="p-2 border-b border-gray-100 flex items-center justify-between text-xs text-gray-400 px-3 bg-gray-50 font-mono text-[10px] uppercase">
              <span>Quick Matches ({liveResults.length})</span>
            </div>
            {liveResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500">
                No items found matching "<span className="text-orange-600 font-bold">{searchQuery}</span>"
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {liveResults.map(item => {
                  let title = '';
                  let subtitle = '';
                  let icon = <Bike className="w-4 h-4 text-orange-600" />;
                  let typeLabel = 'Motorcycle';

                  if (item.type === 'motorcycle') {
                    title = `${item.year} ${item.brand} ${item.model}`;
                    subtitle = `VIN: ${item.vin} • $${item.sellingPrice.toLocaleString()}`;
                    icon = <Bike className="w-4 h-4 text-orange-600" />;
                    typeLabel = 'Motorcycle';
                  } else if (item.type === 'helmet') {
                    title = `${item.brand} ${item.model} (${item.size})`;
                    subtitle = `SKU: ${item.sku} • Stock: ${item.quantityInStock}`;
                    icon = <HardHat className="w-4 h-4 text-sky-600" />;
                    typeLabel = 'Gear';
                  } else {
                    title = `${item.brand} - ${item.name}`;
                    subtitle = `Part: ${item.partNumber} • Bin: ${item.shelfBinLocation}`;
                    icon = <Wrench className="w-4 h-4 text-emerald-600" />;
                    typeLabel = 'Part';
                  }

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setInspectItem(item);
                        setIsSearchFocused(false);
                      }}
                      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                          {icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900">{title}</div>
                          <div className="text-[11px] text-gray-500 font-mono">{subtitle}</div>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
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
            className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-all shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            <span className="font-bold text-gray-900 max-w-[140px] truncate hidden md:inline">
              {selectedLocation.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Location Dropdown Menu */}
          {isLocationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-gray-400 border-b border-gray-100">
                Select Dealership Bay
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
                      className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-all ${
                        isSelected 
                          ? 'bg-orange-50 text-orange-900 border border-orange-200' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isSelected ? 'text-orange-600' : 'text-gray-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-gray-900 truncate">
                          {loc.name}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">{loc.address}</div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />}
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
          className="relative p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 transition-all shadow-xs"
          title="Stock Alerts"
        >
          <Bell className="w-4 h-4" />
          {lowStockItems.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[9px] font-mono font-bold text-white shadow-xs">
              {lowStockItems.length}
            </span>
          )}
        </button>

        {/* Quick Add Button */}
        <button
          onClick={() => openAddModal('motorcycle')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-gray-800 text-white font-bold rounded-lg text-xs uppercase shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span className="hidden sm:inline">Add Unit</span>
        </button>
      </div>
    </header>
  );
};
