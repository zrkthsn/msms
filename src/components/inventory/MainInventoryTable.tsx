import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import type { InventoryItem, MotorcycleItem } from '../../types/inventory';
import { MotorcycleCardGrid } from './MotorcycleCardGrid';
import { 
  Search, 
  Bike, 
  HardHat, 
  Wrench, 
  MoreVertical, 
  Eye, 
  PackagePlus, 
  Trash2, 
  Copy, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  AlertTriangle,
  X
} from 'lucide-react';

interface MainInventoryTableProps {
  initialTab?: 'all' | 'motorcycles' | 'helmets' | 'parts';
}

export const MainInventoryTable: React.FC<MainInventoryTableProps> = ({ initialTab = 'all' }) => {
  const { 
    allItems, 
    motorcycles, 
    helmets, 
    parts, 
    searchQuery, 
    setSearchQuery,
    setInspectItem,
    setAdjustStockItem,
    deleteItem,
    addToast
  } = useInventory();

  // Tab filter: 'all' | 'motorcycles' | 'helmets' | 'parts'
  const [activeTab, setActiveTab] = useState<'all' | 'motorcycles' | 'helmets' | 'parts'>(initialTab);
  
  // Dropdown filters
  const [conditionFilter, setConditionFilter] = useState<'All' | 'New' | 'Used'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Reserved' | 'Sold'>('All');
  
  // View mode for motorcycles: 'table' | 'grid'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Sorting
  const [sortField, setSortField] = useState<'price' | 'name' | 'stock'>('price');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Row action menu dropdown state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    addToast({
      type: 'info',
      title: 'Identifier Copied',
      message: `${text} copied.`
    });
  };

  // Filtered dataset
  const filteredItems = useMemo(() => {
    let list: InventoryItem[] = [];

    if (activeTab === 'all') {
      list = allItems;
    } else if (activeTab === 'motorcycles') {
      list = motorcycles;
    } else if (activeTab === 'helmets') {
      list = helmets;
    } else if (activeTab === 'parts') {
      list = parts;
    }

    // Search query filter (Name, VIN, Part #, SKU, Brand)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => {
        if (item.type === 'motorcycle') {
          return (
            item.brand.toLowerCase().includes(q) ||
            item.model.toLowerCase().includes(q) ||
            item.vin.toLowerCase().includes(q) ||
            item.color.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
          );
        } else if (item.type === 'helmet') {
          return (
            item.brand.toLowerCase().includes(q) ||
            item.model.toLowerCase().includes(q) ||
            item.sku.toLowerCase().includes(q) ||
            item.gearType.toLowerCase().includes(q) ||
            item.size.toLowerCase().includes(q)
          );
        } else {
          return (
            item.brand.toLowerCase().includes(q) ||
            item.name.toLowerCase().includes(q) ||
            item.partNumber.toLowerCase().includes(q) ||
            item.shelfBinLocation.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
          );
        }
      });
    }

    // Condition filter (for motorcycles)
    if (conditionFilter !== 'All') {
      list = list.filter(item => {
        if (item.type === 'motorcycle') {
          return item.condition === conditionFilter;
        }
        return true; // parts and helmets pass through unless specifically filtered
      });
    }

    // Status filter
    if (statusFilter !== 'All') {
      list = list.filter(item => {
        if (statusFilter === 'In Stock') {
          if (item.type === 'motorcycle') return item.status === 'In Stock';
          if (item.type === 'helmet') return item.quantityInStock > item.minAlertThreshold;
          if (item.type === 'part') return item.stockCount > item.reorderPoint;
        } else if (statusFilter === 'Low Stock') {
          if (item.type === 'motorcycle') return false;
          if (item.type === 'helmet') return item.quantityInStock <= item.minAlertThreshold && item.quantityInStock > 0;
          if (item.type === 'part') return item.stockCount <= item.reorderPoint && item.stockCount > 0;
        } else if (statusFilter === 'Out of Stock') {
          if (item.type === 'motorcycle') return false;
          if (item.type === 'helmet') return item.quantityInStock === 0;
          if (item.type === 'part') return item.stockCount === 0;
        } else if (statusFilter === 'Reserved') {
          return item.type === 'motorcycle' && item.status === 'Reserved';
        } else if (statusFilter === 'Sold') {
          return item.type === 'motorcycle' && item.status === 'Sold';
        }
        return true;
      });
    }

    // Sorting
    list.sort((a, b) => {
      let valA = 0;
      let valB = 0;

      if (sortField === 'price') {
        valA = a.type === 'motorcycle' ? a.sellingPrice : a.type === 'helmet' ? a.price : a.unitPrice;
        valB = b.type === 'motorcycle' ? b.sellingPrice : b.type === 'helmet' ? b.price : b.unitPrice;
      } else if (sortField === 'stock') {
        valA = a.type === 'motorcycle' ? (a.status === 'In Stock' ? 1 : 0) : a.type === 'helmet' ? a.quantityInStock : a.stockCount;
        valB = b.type === 'motorcycle' ? (b.status === 'In Stock' ? 1 : 0) : b.type === 'helmet' ? b.quantityInStock : b.stockCount;
      } else {
        const nameA = a.type === 'part' ? a.name : a.model;
        const nameB = b.type === 'part' ? b.name : b.model;
        return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      }

      return sortAsc ? valA - valB : valB - valA;
    });

    return list;
  }, [allItems, motorcycles, helmets, parts, activeTab, searchQuery, conditionFilter, statusFilter, sortField, sortAsc]);

  const toggleSort = (field: 'price' | 'name' | 'stock') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Header: Tabs and View Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        {/* Navigation Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Items', count: allItems.length },
            { id: 'motorcycles', label: 'Motorcycles', count: motorcycles.length, icon: <Bike className="w-4 h-4" /> },
            { id: 'helmets', label: 'Helmets & Gear', count: helmets.length, icon: <HardHat className="w-4 h-4" /> },
            { id: 'parts', label: 'Spare Parts', count: parts.length, icon: <Wrench className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id ? 'bg-orange-500/30 text-orange-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* View Toggle (Grid vs Table) when looking at Motorcycles */}
        {activeTab === 'motorcycles' && (
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-end md:self-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Showroom Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Toolbar (Search & Filter Dropdowns) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        {/* Search Input in Table */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Name, Model, VIN, SKU, or Part #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Condition Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Condition:</span>
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value as any)}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Conditions</option>
              <option value="New">New Only</option>
              <option value="Used">Used Only</option>
            </select>
          </div>

          {/* Stock Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock Alert</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          {/* Reset Filters if active */}
          {(conditionFilter !== 'All' || statusFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setConditionFilter('All');
                setStatusFilter('All');
                setSearchQuery('');
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs text-orange-400 hover:bg-orange-500/10 transition-colors font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* RENDER CONTENT: Card Grid vs Table */}
      {activeTab === 'motorcycles' && viewMode === 'grid' ? (
        <MotorcycleCardGrid items={filteredItems as MotorcycleItem[]} />
      ) : (
        /* Unified Industrial Table */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider select-none">
                  <th className="py-3 px-4 font-medium">Item / Specs</th>
                  <th className="py-3 px-4 font-medium">Classification</th>
                  <th className="py-3 px-4 font-medium">Identifier</th>
                  <th 
                    onClick={() => toggleSort('stock')}
                    className="py-3 px-4 font-medium cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Stock Level</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th 
                    onClick={() => toggleSort('price')}
                    className="py-3 px-4 font-medium cursor-pointer hover:text-white transition-colors text-right"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Pricing (USD)</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      <div className="max-w-xs mx-auto">
                        <AlertTriangle className="w-8 h-8 text-amber-500/60 mx-auto mb-2" />
                        <p className="font-semibold text-white">No Inventory Items Found</p>
                        <p className="text-xs text-slate-400 mt-1">Try clearing your filters or changing search keywords.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(item => {
                    const isMenuOpen = activeMenuId === item.id;
                    const isMoto = item.type === 'motorcycle';
                    const isGear = item.type === 'helmet';
                    const isPart = item.type === 'part';

                    // Specifications & badges
                    let primaryTitle = '';
                    let specsSubtitle = '';
                    let identifier = '';
                    let typeBadge = '';
                    let stockQty = 0;
                    let isLow = false;
                    let isOut = false;
                    let sellingPrice = 0;
                    let costPrice = 0;

                    if (isMoto) {
                      primaryTitle = `${item.year} ${item.brand} ${item.model}`;
                      specsSubtitle = `${item.engineCc}cc • ${item.color} • ${item.mileage === 0 ? 'New' : `${item.mileage.toLocaleString()} mi`}`;
                      identifier = item.vin;
                      typeBadge = 'Motorcycle';
                      stockQty = item.status === 'In Stock' ? 1 : 0;
                      sellingPrice = item.sellingPrice;
                      costPrice = item.costPrice;
                    } else if (isGear) {
                      primaryTitle = `${item.brand} ${item.model}`;
                      specsSubtitle = `Size: ${item.size} • ${item.safetyCert} • ${item.gearType}`;
                      identifier = item.sku;
                      typeBadge = 'Helmet/Gear';
                      stockQty = item.quantityInStock;
                      isLow = item.quantityInStock <= item.minAlertThreshold && item.quantityInStock > 0;
                      isOut = item.quantityInStock === 0;
                      sellingPrice = item.price;
                      costPrice = item.costPrice;
                    } else {
                      primaryTitle = `${item.brand} - ${item.name}`;
                      specsSubtitle = `Bin: ${item.shelfBinLocation} • ${item.category}`;
                      identifier = item.partNumber;
                      typeBadge = 'Spare Part';
                      stockQty = item.stockCount;
                      isLow = item.stockCount <= item.reorderPoint && item.stockCount > 0;
                      isOut = item.stockCount === 0;
                      sellingPrice = item.unitPrice;
                      costPrice = item.unitCost;
                    }

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setInspectItem(item)}
                        className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      >
                        {/* Item & Specs */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden text-slate-500 group-hover:border-orange-500/40 transition-colors">
                              {isMoto && (item.imageUrl ? (
                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Bike className="w-5 h-5 text-orange-400" />
                              ))}
                              {isGear && <HardHat className="w-5 h-5 text-sky-400" />}
                              {isPart && <Wrench className="w-5 h-5 text-emerald-400" />}
                            </div>

                            <div>
                              <div className="font-semibold text-white text-xs group-hover:text-orange-400 transition-colors">
                                {primaryTitle}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {specsSubtitle}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Classification */}
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded uppercase border ${
                            isMoto 
                              ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' 
                              : isGear 
                              ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' 
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {typeBadge}
                          </span>
                        </td>

                        {/* Identifier (VIN/SKU/Part#) */}
                        <td className="py-3 px-4 font-mono text-[11px]">
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                            <span>{identifier}</span>
                            <button
                              onClick={(e) => copyToClipboard(identifier, e)}
                              className="text-slate-500 hover:text-white transition-colors"
                              title="Copy ID"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Stock Level with Visual Badge */}
                        <td className="py-3 px-4">
                          {isMoto ? (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                              item.status === 'In Stock'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : item.status === 'Reserved'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                item.status === 'In Stock' ? 'bg-emerald-400' : item.status === 'Reserved' ? 'bg-amber-400' : 'bg-slate-500'
                              }`} />
                              {item.status}
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                                isOut
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : isLow
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  isOut ? 'bg-rose-400' : isLow ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                                }`} />
                                {stockQty} in stock
                              </span>
                              {isLow && (
                                <span className="text-[10px] font-mono text-amber-400 font-semibold">
                                  Low
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Pricing */}
                        <td className="py-3 px-4 text-right">
                          <div className="font-mono font-bold text-white text-xs">
                            ${sellingPrice.toLocaleString()}
                          </div>
                          <div className="font-mono text-[10px] text-emerald-400">
                            +${(sellingPrice - costPrice).toFixed(0)} ({Math.round(((sellingPrice - costPrice) / (sellingPrice || 1)) * 100)}%)
                          </div>
                        </td>

                        {/* Row Action Menu */}
                        <td className="py-3 px-4 text-right">
                          <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setActiveMenuId(isMenuOpen ? null : item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-0 mt-1 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 z-30 animate-in fade-in zoom-in-95 text-left">
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setInspectItem(item);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg"
                                >
                                  <Eye className="w-3.5 h-3.5 text-orange-400" />
                                  <span>View Specs</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setAdjustStockItem(item);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg"
                                >
                                  <PackagePlus className="w-3.5 h-3.5 text-sky-400" />
                                  <span>Adjust Stock</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    if (confirm('Delete this item from stock permanently?')) {
                                      deleteItem(item.id, item.type);
                                    }
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Item</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Summary */}
          <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Showing {filteredItems.length} active inventory units</span>
            <span>Mantash Multi-Bay Depot Synchronized</span>
          </div>
        </div>
      )}
    </div>
  );
};
