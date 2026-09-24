import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { 
  Settings, 
  MapPin, 
  BellRing, 
  Database, 
  RotateCcw, 
  Save 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { locations, resetDemoData, addToast } = useInventory();

  const [defaultThreshold, setDefaultThreshold] = useState(3);
  const [currency, setCurrency] = useState('USD ($)');
  const [barcodeScannerActive, setBarcodeScannerActive] = useState(true);
  const [autoReorderAlerts, setAutoReorderAlerts] = useState(true);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Preferences Saved',
      message: 'Dealership inventory settings updated.'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl bg-white">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="font-showroom text-3xl font-black italic tracking-wide text-gray-900">
            SYSTEM & DEALERSHIP SETTINGS
          </h2>
          <p className="text-xs text-gray-500 font-mono">Configure showroom locations, replenishment thresholds, and preferences</p>
        </div>
        <div className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
          <Settings className="w-5 h-5" />
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* Dealership Locations Management */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <MapPin className="w-4 h-4 text-orange-600" />
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-mono">
              Configured Showroom & Depot Branches
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {locations.map(loc => (
              <div key={loc.id} className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                      {loc.code}
                    </span>
                    {loc.isPrimary && (
                      <span className="text-[9px] font-mono font-bold text-emerald-700">
                        PRIMARY HQ
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 mt-2">{loc.name}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{loc.address}</p>
                </div>
                <div className="text-[10px] font-mono text-gray-400 mt-3 pt-2 border-t border-gray-200">
                  Tel: {loc.phone}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Threshold & Alert Policies */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <BellRing className="w-4 h-4 text-orange-600" />
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-mono">
              Alerts & Automation Rules
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-gray-500 font-bold uppercase mb-1">
                Default Safety Threshold (Units)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={defaultThreshold}
                onChange={(e) => setDefaultThreshold(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 font-mono focus:outline-none focus:border-orange-500"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Automatic trigger when inventory falls below this quantity.
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-gray-500 font-bold uppercase mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-orange-500"
              >
                <option value="USD ($)">USD ($) - United States Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
              </select>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <label className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={autoReorderAlerts}
                onChange={(e) => setAutoReorderAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-0"
              />
              <div>
                <div className="text-xs font-bold text-gray-900">Real-time Stock Warning Badges</div>
                <div className="text-[11px] text-gray-500">Highlight bell badge when parts reach reorder threshold</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={barcodeScannerActive}
                onChange={(e) => setBarcodeScannerActive(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-0"
              />
              <div>
                <div className="text-xs font-bold text-gray-900">Barcode / VIN Scanner Listener Mode</div>
                <div className="text-[11px] text-gray-500">Supports handheld Bluetooth and USB barcode input</div>
              </div>
            </label>
          </div>
        </div>

        {/* Database & Mock Data Controls */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Database className="w-4 h-4 text-orange-600" />
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-mono">
              Database & Mock Data
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <div>
              <h4 className="text-xs font-bold text-gray-900">Reset Demo Showroom Catalog</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Restores original sample dataset of Kawasaki, SYM, BMW, and Yamaha bikes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all inventory records to the initial mock dataset?')) {
                  resetDemoData();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold uppercase border border-gray-300 transition-colors shadow-xs shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs uppercase shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
