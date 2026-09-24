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
  X,
  Download,
  Plus
} from 'lucide-react';

interface MainInventoryTableProps {
  initialTab?: 'all' | 'motorcycles' | 'helmets' | 'parts';
  title?: string;
  subtitle?: string;
}

export const MainInventoryTable: React.FC<MainInventoryTableProps> = ({ 
  initialTab = 'motorcycles',
  title = 'WEB SHOWROOM',
  subtitle = 'PUBLISHED INVENTORY MANAGER'
}) => {
  const { 
    allItems, 
    motorcycles, 
    helmets, 
    parts, 
    searchQuery, 
    setSearchQuery,
    motorcycleCategoryFilter,
    setMotorcycleCategoryFilter,
    setInspectItem,
    setAdjustStockItem,
    deleteItem,
    openAddModal,
    addToast
  } = useInventory();

  // Tab filter: 'all' | 'motorcycles' | 'helmets' | 'parts'
  const [activeTab, setActiveTab] = useState<'all' | 'motorcycles' | 'helmets' | 'parts'>(initialTab);
  
  // Status sub-tab: 'available' | 'sold' | 'all'
  const [availabilityTab, setAvailabilityTab] = useState<'available' | 'sold' | 'all'>('available');
  
  // View mode: 'grid' (default matching screenshot) | 'table'
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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
      message: `${text} copied to clipboard.`
    });
  };

  const handleExport = () => {
    const headers = ['Type', 'Identifier', 'Brand', 'Model/Name', 'Stock', 'Price', 'Location'];
    const rows = filteredItems.map(item => {
      if (item.type === 'motorcycle') {
        return ['Motorcycle', item.vin, item.brand, `${item.year} ${item.model}`, item.status, item.sellingPrice, item.location];
      } else if (item.type === 'helmet') {
        return ['Gear', item.sku, item.brand, `${item.model} (${item.size})`, item.quantityInStock, item.price, item.location];
      } else {
        return ['Spare Part', item.partNumber, item.brand, item.name, item.stockCount, item.unitPrice, item.location];
      }
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mantash_Showroom_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Export Complete',
      message: 'Exported active inventory catalog (.CSV).'
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

    // Availability filter (Available vs Sold)
    if (availabilityTab === 'available') {
      list = list.filter(item => {
        if (item.type === 'motorcycle') return item.status !== 'Sold';
        if (item.type === 'helmet') return item.quantityInStock > 0;
        if (item.type === 'part') return item.stockCount > 0;
        return true;
      });
    } else if (availabilityTab === 'sold') {
      list = list.filter(item => {
        if (item.type === 'motorcycle') return item.status === 'Sold';
        if (item.type === 'helmet') return item.quantityInStock === 0;
        if (item.type === 'part') return item.stockCount === 0;
        return true;
      });
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => {
        if (item.type === 'motorcycle') {
          return (
            item.brand.toLowerCase().includes(q) ||
            item.model.toLowerCase().includes(q) ||
            item.vin.toLowerCase().includes(q) ||
            item.color.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.taxCategory.toLowerCase().includes(q) ||
            item.condition.toLowerCase().includes(q)
          );
        } else if (item.type === 'helmet') {
          return (
            item.brand.toLowerCase().includes(q) ||
            item.model.toLowerCase().includes(q) ||
            item.sku.toLowerCase().includes(q) ||
            item.gearType.toLowerCase().includes(q)
          );
        } else {
          return (
            item.brand.toLowerCase().includes(q) ||
            item.name.toLowerCase().includes(q) ||
            item.partNumber.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
          );
        }
      });
    }

    // 4 Motorcycle Categories Filter: Tax, Tax-Free, Old / Used, Brand New
    if (activeTab === 'motorcycles' && motorcycleCategoryFilter !== 'All') {
      list = list.filter(item => {
        if (item.type !== 'motorcycle') return true;
        if (motorcycleCategoryFilter === 'Tax') return item.taxCategory === 'Tax';
        if (motorcycleCategoryFilter === 'Tax-Free') return item.taxCategory === 'Tax-Free';
        if (motorcycleCategoryFilter === 'Old / Used') return item.condition === 'Old / Used';
        if (motorcycleCategoryFilter === 'Brand New') return item.condition === 'Brand New';
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
  }, [allItems, motorcycles, helmets, parts, activeTab, availabilityTab, searchQuery, motorcycleCategoryFilter, sortField, sortAsc]);

  const toggleSort = (field: 'price' | 'name' | 'stock') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-4 bg-white">
      {/* Top Banner Header matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-3">
        <div>
          <h1 className="font-showroom text-4xl sm:text-5xl font-black italic tracking-tight text-gray-900 leading-none">
            {title}
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 font-mono mt-1">
            {subtitle}
          </p>
        </div>

        {/* Action Buttons: [EXPORT] and [+ NEW] */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold uppercase text-gray-900 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT</span>
          </button>

          <button
            onClick={() => openAddModal('motorcycle')}
            className="flex items-center gap-1.5 px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-xs font-bold uppercase shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>NEW</span>
          </button>
        </div>
      </div>

      {/* Primary Category Underline Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-100 overflow-x-auto text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('motorcycles')}
          className={`pb-2.5 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'motorcycles'
              ? 'text-gray-900 border-b-2 border-orange-600 font-black'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <span>Motorcycles</span>
          <span className="text-[10px] font-mono font-medium text-gray-400">({motorcycles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('helmets')}
          className={`pb-2.5 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'helmets'
              ? 'text-gray-900 border-b-2 border-orange-600 font-black'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <span>Accessories & Gear</span>
          <span className="text-[10px] font-mono font-medium text-gray-400">({helmets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('parts')}
          className={`pb-2.5 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'parts'
              ? 'text-gray-900 border-b-2 border-orange-600 font-black'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <span>Oils & Spare Parts</span>
          <span className="text-[10px] font-mono font-medium text-gray-400">({parts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2.5 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'all'
              ? 'text-gray-900 border-b-2 border-orange-600 font-black'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <span>All Stock</span>
          <span className="text-[10px] font-mono font-medium text-gray-400">({allItems.length})</span>
        </button>
      </div>

      {/* Motorcycle 4 Categories Pills matching user requirement */}
      {activeTab === 'motorcycles' && (
        <div className="pt-2 pb-1">
          <div className="text-[10px] font-mono uppercase font-bold text-gray-400 tracking-wider mb-1.5">
            Motorcycle Category
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'All', label: 'All Bikes', count: motorcycles.length },
              { id: 'Tax', label: 'Tax', count: motorcycles.filter(m => m.taxCategory === 'Tax').length },
              { id: 'Tax-Free', label: 'Tax-Free', count: motorcycles.filter(m => m.taxCategory === 'Tax-Free').length },
              { id: 'Brand New', label: 'Brand New', count: motorcycles.filter(m => m.condition === 'Brand New').length },
              { id: 'Old / Used', label: 'Old / Used', count: motorcycles.filter(m => m.condition === 'Old / Used').length },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setMotorcycleCategoryFilter(cat.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                  motorcycleCategoryFilter === cat.id
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                  motorcycleCategoryFilter === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tabs: AVAILABLE vs SOLD matching screenshot */}
      <div className="flex items-center gap-6 pt-1">
        <button
          onClick={() => setAvailabilityTab('available')}
          className={`text-xs font-black uppercase tracking-wider pb-1 transition-all ${
            availabilityTab === 'available'
              ? 'text-gray-900 border-b-2 border-orange-600'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          AVAILABLE
        </button>

        <button
          onClick={() => setAvailabilityTab('sold')}
          className={`text-xs font-black uppercase tracking-wider pb-1 transition-all ${
            availabilityTab === 'sold'
              ? 'text-gray-900 border-b-2 border-orange-600'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          SOLD
        </button>

        <button
          onClick={() => setAvailabilityTab('all')}
          className={`text-xs font-black uppercase tracking-wider pb-1 transition-all ${
            availabilityTab === 'all'
              ? 'text-gray-900 border-b-2 border-orange-600'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          ALL STATUSES
        </button>
      </div>

      {/* Search Bar & View Mode Toggle matching screenshot */}
      <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-200">
        {/* Search input with uppercase placeholder */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-0 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="SEARCH INVENTORY..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-8 py-1.5 bg-transparent text-xs text-gray-900 font-medium placeholder-gray-400 uppercase tracking-wider focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side controls: View Mode switcher */}
        <div className="flex items-center gap-3">

          {/* Grid vs List View Icons matching screenshot */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5 bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                  : 'text-gray-400 hover:text-gray-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' 
                  ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                  : 'text-gray-400 hover:text-gray-700'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN VIEW: Grid vs Table */}
      {viewMode === 'grid' && activeTab === 'motorcycles' ? (
        <MotorcycleCardGrid items={filteredItems as MotorcycleItem[]} />
      ) : (
        /* Clean Light Table */
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-mono text-[11px] uppercase tracking-wider select-none">
                  <th className="py-3 px-4 font-bold">Item / Model</th>
                  <th className="py-3 px-4 font-bold">Type</th>
                  <th className="py-3 px-4 font-bold">Identifier</th>
                  <th 
                    onClick={() => toggleSort('stock')}
                    className="py-3 px-4 font-bold cursor-pointer hover:text-gray-900 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Stock Status</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th 
                    onClick={() => toggleSort('price')}
                    className="py-3 px-4 font-bold cursor-pointer hover:text-gray-900 transition-colors text-right"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Price (USD)</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400">
                      <div className="max-w-xs mx-auto">
                        <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                        <p className="font-bold text-gray-900">No Inventory Items Found</p>
                        <p className="text-xs text-gray-500 mt-1">Try clearing filters or search query.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(item => {
                    const isMenuOpen = activeMenuId === item.id;
                    const isMoto = item.type === 'motorcycle';
                    const isGear = item.type === 'helmet';
                    const isPart = item.type === 'part';

                    let primaryTitle = '';
                    let specsSubtitle = '';
                    let identifier = '';
                    let typeBadge = '';
                    let stockQty = 0;
                    let sellingPrice = 0;

                    if (isMoto) {
                      primaryTitle = `${item.year} ${item.brand} ${item.model}`;
                      specsSubtitle = `${item.engineCc}cc • ${item.color} • ${item.mileage === 0 ? 'New' : `${item.mileage.toLocaleString()} mi`}`;
                      identifier = item.vin;
                      typeBadge = 'Motorcycle';
                      stockQty = item.status === 'In Stock' ? 1 : 0;
                      sellingPrice = item.sellingPrice;
                    } else if (isGear) {
                      primaryTitle = `${item.brand} ${item.model}`;
                      specsSubtitle = `Size: ${item.size} • ${item.safetyCert} • ${item.gearType}`;
                      identifier = item.sku;
                      typeBadge = 'Gear';
                      stockQty = item.quantityInStock;
                      sellingPrice = item.price;
                    } else {
                      primaryTitle = `${item.brand} - ${item.name}`;
                      specsSubtitle = `Bin: ${item.shelfBinLocation} • ${item.category}`;
                      identifier = item.partNumber;
                      typeBadge = 'Spare Part';
                      stockQty = item.stockCount;
                      sellingPrice = item.unitPrice;
                    }

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setInspectItem(item)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        {/* Item & Specs */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 text-gray-400 group-hover:border-orange-500 transition-colors">
                              {isMoto && <Bike className="w-4 h-4 text-orange-600" />}
                              {isGear && <HardHat className="w-4 h-4 text-gray-700" />}
                              {isPart && <Wrench className="w-4 h-4 text-gray-700" />}
                            </div>

                            <div>
                              <div className="font-bold text-gray-900 text-xs group-hover:text-orange-600 transition-colors">
                                {primaryTitle}
                              </div>
                              <div className="text-[11px] text-gray-500 mt-0.5">
                                {specsSubtitle}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Classification */}
                        <td className="py-3 px-4">
                          {isMoto ? (
                            <div className="flex flex-col gap-1 items-start">
                              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase border ${
                                item.taxCategory === 'Tax'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              }`}>
                                {item.taxCategory}
                              </span>
                              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase border ${
                                item.condition === 'Brand New'
                                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                                  : 'bg-gray-100 text-gray-700 border-gray-300'
                              }`}>
                                {item.condition}
                              </span>
                            </div>
                          ) : (
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                              isGear 
                                ? 'bg-sky-50 text-sky-700 border-sky-200' 
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {typeBadge}
                            </span>
                          )}
                        </td>

                        {/* Identifier */}
                        <td className="py-3 px-4 font-mono text-[11px]">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-700">
                            <span>{identifier}</span>
                            <button
                              onClick={(e) => copyToClipboard(identifier, e)}
                              className="text-gray-400 hover:text-gray-800 transition-colors"
                              title="Copy ID"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Stock Status */}
                        <td className="py-3 px-4">
                          {isMoto ? (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              item.status === 'In Stock'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : item.status === 'Reserved'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                item.status === 'In Stock' ? 'bg-emerald-500' : item.status === 'Reserved' ? 'bg-amber-500' : 'bg-gray-400'
                              }`} />
                              {item.status}
                            </span>
                          ) : (
                            <span className="font-mono text-xs font-bold text-gray-900">
                              {stockQty} units
                            </span>
                          )}
                        </td>

                        {/* Pricing */}
                        <td className="py-3 px-4 text-right font-mono font-bold text-gray-900 text-xs">
                          ${sellingPrice.toLocaleString()}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setActiveMenuId(isMenuOpen ? null : item.id)}
                              className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-xl p-1 z-30 text-left">
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setInspectItem(item);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                  <Eye className="w-3.5 h-3.5 text-orange-600" />
                                  <span>View Specs</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setAdjustStockItem(item);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                  <PackagePlus className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Adjust Stock</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    if (confirm('Delete this item?')) {
                                      deleteItem(item.id, item.type);
                                    }
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-md"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
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
        </div>
      )}
    </div>
  );
};
