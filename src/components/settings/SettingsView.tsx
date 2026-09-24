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
      title: 'Settings Saved',
      message: 'Dealership inventory parameters updated successfully.'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">System & Dealership Settings</h2>
          <p className="text-xs text-slate-400 mt-1">Configure multi-bay branches, threshold policies, and inventory engine</p>
        </div>
        <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
          <Settings className="w-5 h-5" />
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* Dealership Locations Management */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <MapPin className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Configured Dealership Locations & Bays
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {locations.map(loc => (
              <div key={loc.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/15 text-orange-400 border border-orange-500/30">
                      {loc.code}
                    </span>
                    {loc.isPrimary && (
                      <span className="text-[9px] font-mono font-bold text-emerald-400">
                        PRIMARY HQ
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-white mt-2">{loc.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{loc.address}</p>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-3 pt-2 border-t border-slate-800/80">
                  Phone: {loc.phone}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Threshold & Alert Policies */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <BellRing className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Threshold & Alert Automation
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                Default Safety Threshold (Units)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={defaultThreshold}
                onChange={(e) => setDefaultThreshold(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-orange-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Automatic trigger when inventory quantity falls below this limit.
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                Operating Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="USD ($)">USD ($) - United States Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
                <option value="AUD ($)">AUD ($) - Australian Dollar</option>
              </select>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={autoReorderAlerts}
                onChange={(e) => setAutoReorderAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 focus:ring-0 bg-slate-900 border-slate-700"
              />
              <div>
                <div className="text-xs font-semibold text-slate-200">Real-time Stock Warning Popups</div>
                <div className="text-[11px] text-slate-400">Trigger topbar alert badge when parts or helmets fall below reorder points</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={barcodeScannerActive}
                onChange={(e) => setBarcodeScannerActive(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 focus:ring-0 bg-slate-900 border-slate-700"
              />
              <div>
                <div className="text-xs font-semibold text-slate-200">Hardware Barcode & VIN Scanner Listening Mode</div>
                <div className="text-[11px] text-slate-400">Allows USB / Bluetooth barcode scanners to quickly search and select parts</div>
              </div>
            </label>
          </div>
        </div>

        {/* Database & Mock Data Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Database className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Data Persistence & Demonstration
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div>
              <h4 className="text-xs font-semibold text-white">Reset Mock Inventory Data</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Restores the standard sample catalog of high-performance motorcycles, helmets, and spare parts.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all inventory records to the initial mock dataset?')) {
                  resetDemoData();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
