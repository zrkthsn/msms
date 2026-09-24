import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { PlusCircle, PackagePlus, HardHat, Download, Sparkles } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const { openAddModal, addToast, allItems } = useInventory();

  const handleExport = () => {
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
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white border border-gray-200 shadow-xs">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-orange-600" />
        <span className="text-xs font-mono uppercase tracking-wider text-gray-700 font-bold">
          Quick Operations
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => openAddModal('motorcycle')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Motorcycle</span>
        </button>

        <button
          onClick={() => openAddModal('part')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-900 font-bold text-xs uppercase border border-gray-300 shadow-xs transition-all"
        >
          <PackagePlus className="w-4 h-4 text-orange-600" />
          <span>Receive Parts</span>
        </button>

        <button
          onClick={() => openAddModal('helmet')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-900 font-bold text-xs uppercase border border-gray-300 shadow-xs transition-all"
        >
          <HardHat className="w-4 h-4 text-gray-700" />
          <span>Add Accessories</span>
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs uppercase border border-gray-300 transition-all"
          title="Export CSV"
        >
          <Download className="w-4 h-4 text-gray-500" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
};
