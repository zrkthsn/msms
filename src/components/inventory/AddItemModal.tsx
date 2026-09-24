import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import type { HelmetSize, SafetyCert, PartCategory, MotorcycleCondition, MotorcycleStatus } from '../../types/inventory';
import { 
  X, 
  Bike, 
  HardHat, 
  Wrench 
} from 'lucide-react';

export const AddItemModal: React.FC = () => {
  const { 
    isAddModalOpen, 
    setIsAddModalOpen, 
    defaultAddModalTab, 
    addMotorcycle, 
    addHelmet, 
    addPart,
    selectedLocation,
    locations
  } = useInventory();

  const [activeType, setActiveType] = useState<'motorcycle' | 'helmet' | 'part'>(defaultAddModalTab);

  // Sync with defaultAddModalTab when opened
  useEffect(() => {
    setActiveType(defaultAddModalTab);
  }, [defaultAddModalTab, isAddModalOpen]);

  // Motorcycle Form State
  const [motoForm, setMotoForm] = useState({
    vin: '',
    brand: 'Ducati',
    model: '',
    year: 2024,
    condition: 'New' as MotorcycleCondition,
    engineCc: 1000,
    color: 'Rosso Corsa Red',
    mileage: 0,
    costPrice: 20000,
    sellingPrice: 24999,
    status: 'In Stock' as MotorcycleStatus,
    category: 'Sport' as const,
    location: selectedLocation.name
  });

  // Helmet / Gear Form State
  const [gearForm, setGearForm] = useState({
    sku: '',
    brand: 'Shoei',
    model: '',
    size: 'M' as HelmetSize,
    safetyCert: 'DOT & ECE' as SafetyCert,
    gearType: 'Full Face Helmet' as const,
    quantityInStock: 5,
    minAlertThreshold: 2,
    costPrice: 450,
    price: 749.99,
    color: 'Matte Carbon Black',
    location: selectedLocation.name
  });

  // Spare Part Form State
  const [partForm, setPartForm] = useState({
    partNumber: '',
    brand: 'Brembo',
    name: '',
    compatibleModels: 'Universal Fitment',
    category: 'Brakes' as PartCategory,
    shelfBinLocation: 'Bay 2 - Row A - Bin 01',
    stockCount: 10,
    reorderPoint: 3,
    unitCost: 120,
    unitPrice: 199.99,
    location: selectedLocation.name
  });

  if (!isAddModalOpen) return null;

  const handleMotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motoForm.vin || !motoForm.model) return;

    addMotorcycle({
      ...motoForm,
      type: 'motorcycle'
    });
    setIsAddModalOpen(false);
  };

  const handleGearSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gearForm.sku || !gearForm.model) return;

    addHelmet({
      ...gearForm,
      type: 'helmet'
    });
    setIsAddModalOpen(false);
  };

  const handlePartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partForm.partNumber || !partForm.name) return;

    addPart({
      ...partForm,
      type: 'part'
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">Register New Inventory Item</h2>
            <p className="text-xs text-slate-400">Select product classification and fill in domain specifications</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step-based Type Selector Tabs */}
        <div className="px-6 pt-4 bg-slate-900/60 border-b border-slate-800">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveType('motorcycle')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                activeType === 'motorcycle'
                  ? 'bg-orange-500/15 text-orange-400 border-orange-500/40 shadow-sm'
                  : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>1. Motorcycle</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveType('helmet')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                activeType === 'helmet'
                  ? 'bg-sky-500/15 text-sky-400 border-sky-500/40 shadow-sm'
                  : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>2. Helmet & Gear</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveType('part')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                activeType === 'part'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>3. Spare Parts</span>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[68vh] overflow-y-auto">
          {/* TAB 1: MOTORCYCLE FORM */}
          {activeType === 'motorcycle' && (
            <form onSubmit={handleMotoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    VIN / Chassis Number *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. JH2SC59038K102941"
                    value={motoForm.vin}
                    onChange={(e) => setMotoForm({ ...motoForm, vin: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Manufacturer / Brand *
                  </label>
                  <select
                    value={motoForm.brand}
                    onChange={(e) => setMotoForm({ ...motoForm, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Ducati">Ducati</option>
                    <option value="Yamaha">Yamaha</option>
                    <option value="BMW">BMW Motorrad</option>
                    <option value="Kawasaki">Kawasaki</option>
                    <option value="KTM">KTM</option>
                    <option value="Triumph">Triumph</option>
                    <option value="Harley-Davidson">Harley-Davidson</option>
                    <option value="Honda">Honda</option>
                    <option value="Aprilia">Aprilia</option>
                    <option value="MV Agusta">MV Agusta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Model Designation *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Panigale V4 S or YZF-R1M"
                    value={motoForm.model}
                    onChange={(e) => setMotoForm({ ...motoForm, model: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      min="1990"
                      max="2026"
                      value={motoForm.year}
                      onChange={(e) => setMotoForm({ ...motoForm, year: parseInt(e.target.value) || 2024 })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                      Condition
                    </label>
                    <select
                      value={motoForm.condition}
                      onChange={(e) => {
                        const cond = e.target.value as MotorcycleCondition;
                        setMotoForm({ 
                          ...motoForm, 
                          condition: cond,
                          mileage: cond === 'New' ? 0 : (motoForm.mileage || 1500)
                        });
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="New">New (0 mi)</option>
                      <option value="Used">Used / Pre-Owned</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Engine Displacement (CC)
                  </label>
                  <input
                    type="number"
                    value={motoForm.engineCc}
                    onChange={(e) => setMotoForm({ ...motoForm, engineCc: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Color / Livery
                  </label>
                  <input
                    type="text"
                    value={motoForm.color}
                    onChange={(e) => setMotoForm({ ...motoForm, color: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Odometer Mileage (Miles)
                  </label>
                  <input
                    type="number"
                    value={motoForm.mileage}
                    disabled={motoForm.condition === 'New'}
                    onChange={(e) => setMotoForm({ ...motoForm, mileage: parseInt(e.target.value) || 0 })}
                    className={`w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-orange-500 ${
                      motoForm.condition === 'New' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={motoForm.category}
                    onChange={(e) => setMotoForm({ ...motoForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Sport">Sport / Superbike</option>
                    <option value="Naked">Naked / Hypernaked</option>
                    <option value="Adventure">Adventure / Dual Sport</option>
                    <option value="Cruiser">Cruiser / Custom</option>
                    <option value="Touring">Touring</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Cost Price ($ USD)
                  </label>
                  <input
                    type="number"
                    value={motoForm.costPrice}
                    onChange={(e) => setMotoForm({ ...motoForm, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Selling Price ($ USD) *
                  </label>
                  <input
                    required
                    type="number"
                    value={motoForm.sellingPrice}
                    onChange={(e) => setMotoForm({ ...motoForm, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Showroom / Depot Location
                  </label>
                  <select
                    value={motoForm.location}
                    onChange={(e) => setMotoForm({ ...motoForm, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.name}>{loc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={motoForm.status}
                    onChange={(e) => setMotoForm({ ...motoForm, status: e.target.value as MotorcycleStatus })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
              </div>

              {/* Profit summary */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Estimated Gross Margin:</span>
                <span className="font-mono font-bold text-emerald-400">
                  +${(motoForm.sellingPrice - motoForm.costPrice).toLocaleString()} (
                  {Math.round(((motoForm.sellingPrice - motoForm.costPrice) / (motoForm.sellingPrice || 1)) * 100)}%)
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
                >
                  Register Motorcycle
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: HELMET & GEAR FORM */}
          {activeType === 'helmet' && (
            <form onSubmit={handleGearSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Item SKU *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. HLM-SHO-X15-M"
                    value={gearForm.sku}
                    onChange={(e) => setGearForm({ ...gearForm, sku: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Brand *
                  </label>
                  <select
                    value={gearForm.brand}
                    onChange={(e) => setGearForm({ ...gearForm, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Shoei">Shoei</option>
                    <option value="Arai">Arai</option>
                    <option value="AGV">AGV</option>
                    <option value="Alpinestars">Alpinestars</option>
                    <option value="Dainese">Dainese</option>
                    <option value="Bell">Bell</option>
                    <option value="HJC">HJC</option>
                    <option value="Shark">Shark</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Model Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. X-Fifteen or Pista GP RR"
                    value={gearForm.model}
                    onChange={(e) => setGearForm({ ...gearForm, model: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                      Size
                    </label>
                    <select
                      value={gearForm.size}
                      onChange={(e) => setGearForm({ ...gearForm, size: e.target.value as HelmetSize })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                      Safety Cert
                    </label>
                    <select
                      value={gearForm.safetyCert}
                      onChange={(e) => setGearForm({ ...gearForm, safetyCert: e.target.value as SafetyCert })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="DOT">DOT</option>
                      <option value="ECE">ECE</option>
                      <option value="DOT & ECE">DOT & ECE</option>
                      <option value="FIM & ECE">FIM & ECE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Gear Category
                  </label>
                  <select
                    value={gearForm.gearType}
                    onChange={(e) => setGearForm({ ...gearForm, gearType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Full Face Helmet">Full Face Helmet</option>
                    <option value="Modular Helmet">Modular Helmet</option>
                    <option value="Riding Jacket">Riding Jacket</option>
                    <option value="Racing Suit">Racing Suit</option>
                    <option value="Gloves">Gloves</option>
                    <option value="Boots">Boots</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Color / Graphic
                  </label>
                  <input
                    type="text"
                    value={gearForm.color}
                    onChange={(e) => setGearForm({ ...gearForm, color: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Quantity in Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={gearForm.quantityInStock}
                    onChange={(e) => setGearForm({ ...gearForm, quantityInStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Min Alert Threshold *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={gearForm.minAlertThreshold}
                    onChange={(e) => setGearForm({ ...gearForm, minAlertThreshold: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Unit Cost ($ USD)
                  </label>
                  <input
                    type="number"
                    value={gearForm.costPrice}
                    onChange={(e) => setGearForm({ ...gearForm, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Selling Price ($ USD) *
                  </label>
                  <input
                    required
                    type="number"
                    value={gearForm.price}
                    onChange={(e) => setGearForm({ ...gearForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                >
                  Add Helmet & Gear
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SPARE PARTS FORM */}
          {activeType === 'part' && (
            <form onSubmit={handlePartSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Part Number (P/N) *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. BRK-BRM-GP4MS"
                    value={partForm.partNumber}
                    onChange={(e) => setPartForm({ ...partForm, partNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Brand *
                  </label>
                  <select
                    value={partForm.brand}
                    onChange={(e) => setPartForm({ ...partForm, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Brembo">Brembo</option>
                    <option value="Akrapovič">Akrapovič</option>
                    <option value="Pirelli">Pirelli</option>
                    <option value="Motul">Motul</option>
                    <option value="Yuasa">Yuasa</option>
                    <option value="Öhlins">Öhlins</option>
                    <option value="SBS Brakes">SBS Brakes</option>
                    <option value="DID Chains">DID Chains</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Part Name / Description *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. CNC Monobloc Radial Brake Calipers (100mm)"
                    value={partForm.name}
                    onChange={(e) => setPartForm({ ...partForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={partForm.category}
                    onChange={(e) => setPartForm({ ...partForm, category: e.target.value as PartCategory })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Exhaust">Exhaust Systems</option>
                    <option value="Brakes">Brakes & Hydraulics</option>
                    <option value="Tires">Tires & Wheels</option>
                    <option value="Oil & Fluids">Oil & Fluids</option>
                    <option value="Electrical">Electrical & Battery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Warehouse Shelf / Bin Location *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Bay 2 - Row A - Bin 05"
                    value={partForm.shelfBinLocation}
                    onChange={(e) => setPartForm({ ...partForm, shelfBinLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Compatible Bike Models
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ducati Panigale V4, Aprilia RSV4, Yamaha R1"
                    value={partForm.compatibleModels}
                    onChange={(e) => setPartForm({ ...partForm, compatibleModels: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Initial Stock Count *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={partForm.stockCount}
                    onChange={(e) => setPartForm({ ...partForm, stockCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Reorder Threshold Point *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={partForm.reorderPoint}
                    onChange={(e) => setPartForm({ ...partForm, reorderPoint: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Unit Cost ($ USD)
                  </label>
                  <input
                    type="number"
                    value={partForm.unitCost}
                    onChange={(e) => setPartForm({ ...partForm, unitCost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Unit Selling Price ($ USD) *
                  </label>
                  <input
                    required
                    type="number"
                    value={partForm.unitPrice}
                    onChange={(e) => setPartForm({ ...partForm, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
                >
                  Register Spare Part
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
