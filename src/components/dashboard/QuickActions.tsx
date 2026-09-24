import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { PlusCircle, PackagePlus, HardHat, FileSpreadsheet, Sparkles } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const { openAddModal, addToast, allItems } = useInventory();

  const handleExport = () => {
    // Generate simple CSV download for inventory manifest
    const headers = ['Type', 'Identifier', 'Brand', 'Model/Name', 'Stock', 'Price', 'Location'];
    const rows = allItems.map(item => {
      if (item.type === 'motorcycle') {
        return ['Motorcycle', item.vin, item.brand, `${item.year} ${item.model}`, item.status, item.sellingPrice, item.location];
      } else if (item.type === 'helmet') {
        return ['Helmet/Gear', item.sku, item.brand, `${item.model} (${item.size})`, item.quantityInStock, item.price, item.location];
      } else {
        return ['Spare Part', item.partNumber, item.brand, item.name, item.stockCount, item.unitPrice, item.location];
      }
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mantash_Inventory_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Manifest Exported',
      message: 'Exported comprehensive stock spreadsheet (.CSV) successfully.'
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-orange-400" />
        <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
          Quick Workflows
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => openAddModal('motorcycle')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Motorcycle</span>
        </button>

        <button
          onClick={() => openAddModal('part')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 shadow-sm transition-all hover:border-slate-600"
        >
          <PackagePlus className="w-4 h-4 text-emerald-400" />
          <span>Receive Parts</span>
        </button>

        <button
          onClick={() => openAddModal('helmet')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 shadow-sm transition-all hover:border-slate-600"
        >
          <HardHat className="w-4 h-4 text-sky-400" />
          <span>Add Helmet & Gear</span>
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700/60 transition-all"
          title="Export CSV"
        >
          <FileSpreadsheet className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Export Manifest</span>
        </button>
      </div>
    </div>
  );
};
