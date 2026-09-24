import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import type { HelmetSize, SafetyCert, PartCategory, MotorcycleCondition, MotorcycleTaxCategory, MotorcycleStatus } from '../../types/inventory';
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
    brand: 'KAWASAKI',
    model: '',
    year: 2026,
    condition: 'Brand New' as MotorcycleCondition,
    taxCategory: 'Tax' as MotorcycleTaxCategory,
    engineCc: 500,
    color: 'Metallic Flat Spark Black',
    mileage: 0,
    costPrice: 5000,
    sellingPrice: 6299,
    status: 'In Stock' as MotorcycleStatus,
    category: 'Naked' as const,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="font-showroom text-2xl font-black italic tracking-wide text-gray-900">
              REGISTER NEW INVENTORY ITEM
            </h2>
            <p className="text-xs text-gray-500 font-mono">Fill in domain specs to publish to Web Showroom & Depot</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step-based Type Selector Tabs */}
        <div className="px-6 pt-3 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveType('motorcycle')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                activeType === 'motorcycle'
                  ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:text-gray-900'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>1. Motorcycle</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveType('helmet')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                activeType === 'helmet'
                  ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:text-gray-900'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>2. Accessories</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveType('part')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                activeType === 'part'
                  ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:text-gray-900'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>3. Parts & Oils</span>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[68vh] overflow-y-auto bg-white">
          {/* TAB 1: MOTORCYCLE FORM */}
          {activeType === 'motorcycle' && (
            <form onSubmit={handleMotoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    VIN / Chassis Number *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. JKAZX2500MA089123"
                    value={motoForm.vin}
                    onChange={(e) => setMotoForm({ ...motoForm, vin: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Brand *
                  </label>
                  <select
                    value={motoForm.brand}
                    onChange={(e) => setMotoForm({ ...motoForm, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="KAWASAKI">KAWASAKI</option>
                    <option value="SYM">SYM</option>
                    <option value="BMW">BMW</option>
                    <option value="YAMAHA">YAMAHA</option>
                    <option value="DUCATI">DUCATI</option>
                    <option value="HONDA">HONDA</option>
                    <option value="KTM">KTM</option>
                    <option value="TRIUMPH">TRIUMPH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Model Designation *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Z500 or NINJA 500"
                    value={motoForm.model}
                    onChange={(e) => setMotoForm({ ...motoForm, model: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      min="1990"
                      max="2027"
                      value={motoForm.year}
                      onChange={(e) => setMotoForm({ ...motoForm, year: parseInt(e.target.value) || 2026 })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                      Condition *
                    </label>
                    <select
                      value={motoForm.condition}
                      onChange={(e) => {
                        const cond = e.target.value as MotorcycleCondition;
                        setMotoForm({ 
                          ...motoForm, 
                          condition: cond,
                          mileage: cond === 'Brand New' ? 0 : (motoForm.mileage || 1500)
                        });
                      }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="Brand New">Brand New (0 mi)</option>
                      <option value="Old / Used">Old / Used (Pre-Owned)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Tax Category *
                  </label>
                  <select
                    value={motoForm.taxCategory}
                    onChange={(e) => setMotoForm({ ...motoForm, taxCategory: e.target.value as MotorcycleTaxCategory })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Tax">Tax (Taxable Fleet)</option>
                    <option value="Tax-Free">Tax-Free (Duty-Free / Export)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Displacement (CC)
                  </label>
                  <input
                    type="number"
                    value={motoForm.engineCc}
                    onChange={(e) => setMotoForm({ ...motoForm, engineCc: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Color / Finish
                  </label>
                  <input
                    type="text"
                    value={motoForm.color}
                    onChange={(e) => setMotoForm({ ...motoForm, color: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Cost Price ($ USD)
                  </label>
                  <input
                    type="number"
                    value={motoForm.costPrice}
                    onChange={(e) => setMotoForm({ ...motoForm, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Selling Price ($ USD) *
                  </label>
                  <input
                    required
                    type="number"
                    value={motoForm.sellingPrice}
                    onChange={(e) => setMotoForm({ ...motoForm, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 font-mono font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Showroom / Depot Location
                  </label>
                  <select
                    value={motoForm.location}
                    onChange={(e) => setMotoForm({ ...motoForm, location: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                  >
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.name}>{loc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Status
                  </label>
                  <select
                    value={motoForm.status}
                    onChange={(e) => setMotoForm({ ...motoForm, status: e.target.value as MotorcycleStatus })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="In Stock">In Stock (Available)</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-mono">Gross Margin:</span>
                <span className="font-mono font-bold text-emerald-600">
                  +${(motoForm.sellingPrice - motoForm.costPrice).toLocaleString()} (
                  {Math.round(((motoForm.sellingPrice - motoForm.costPrice) / (motoForm.sellingPrice || 1)) * 100)}%)
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs uppercase shadow-sm transition-all"
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
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    SKU Code *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. HLM-SHO-X15-M"
                    value={gearForm.sku}
                    onChange={(e) => setGearForm({ ...gearForm, sku: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Brand *
                  </label>
                  <select
                    value={gearForm.brand}
                    onChange={(e) => setGearForm({ ...gearForm, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Shoei">Shoei</option>
                    <option value="Arai">Arai</option>
                    <option value="AGV">AGV</option>
                    <option value="Alpinestars">Alpinestars</option>
                    <option value="Dainese">Dainese</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Model Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. X-Fifteen or Pista GP RR"
                    value={gearForm.model}
                    onChange={(e) => setGearForm({ ...gearForm, model: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                      Size
                    </label>
                    <select
                      value={gearForm.size}
                      onChange={(e) => setGearForm({ ...gearForm, size: e.target.value as HelmetSize })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                      Safety Cert
                    </label>
                    <select
                      value={gearForm.safetyCert}
                      onChange={(e) => setGearForm({ ...gearForm, safetyCert: e.target.value as SafetyCert })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="DOT">DOT</option>
                      <option value="ECE">ECE</option>
                      <option value="DOT & ECE">DOT & ECE</option>
                      <option value="FIM & ECE">FIM & ECE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Initial Stock Count *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={gearForm.quantityInStock}
                    onChange={(e) => setGearForm({ ...gearForm, quantityInStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Selling Price ($ USD) *
                  </label>
                  <input
                    required
                    type="number"
                    value={gearForm.price}
                    onChange={(e) => setGearForm({ ...gearForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 font-mono font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs uppercase shadow-sm transition-all"
                >
                  Add Accessories
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SPARE PARTS FORM */}
          {activeType === 'part' && (
            <form onSubmit={handlePartSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Part Number (P/N) *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. BRK-BRM-GP4MS"
                    value={partForm.partNumber}
                    onChange={(e) => setPartForm({ ...partForm, partNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Brand *
                  </label>
                  <select
                    value={partForm.brand}
                    onChange={(e) => setPartForm({ ...partForm, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Brembo">Brembo</option>
                    <option value="Akrapovič">Akrapovič</option>
                    <option value="Pirelli">Pirelli</option>
                    <option value="Motul">Motul</option>
                    <option value="Yuasa">Yuasa</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Part Name / Description *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. CNC Monobloc Radial Brake Calipers (100mm)"
                    value={partForm.name}
                    onChange={(e) => setPartForm({ ...partForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Category *
                  </label>
                  <select
                    value={partForm.category}
                    onChange={(e) => setPartForm({ ...partForm, category: e.target.value as PartCategory })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Exhaust">Exhaust Systems</option>
                    <option value="Brakes">Brakes & Hydraulics</option>
                    <option value="Tires">Tires & Wheels</option>
                    <option value="Oil & Fluids">Oil & Fluids</option>
                    <option value="Electrical">Electrical & Battery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Shelf / Bin Location *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Bay 2 - Row A - Bin 05"
                    value={partForm.shelfBinLocation}
                    onChange={(e) => setPartForm({ ...partForm, shelfBinLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Initial Stock Count *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={partForm.stockCount}
                    onChange={(e) => setPartForm({ ...partForm, stockCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-500 font-bold mb-1">
                    Unit Price ($ USD) *
                  </label>
                  <input
                    required
                    type="number"
                    value={partForm.unitPrice}
                    onChange={(e) => setPartForm({ ...partForm, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 font-mono font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs uppercase shadow-sm transition-all"
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
