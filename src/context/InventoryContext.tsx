import React, { createContext, useContext, useState, useMemo } from 'react';
import type { 
  MotorcycleItem, 
  HelmetGearItem, 
  SparePartItem, 
  InventoryItem, 
  ActivityLog, 
  StoreLocation, 
  NavigationTab 
} from '../types/inventory';
import { 
  INITIAL_MOTORCYCLES, 
  INITIAL_HELMETS_GEAR, 
  INITIAL_SPARE_PARTS, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_LOCATIONS 
} from '../mockData/initialInventory';

interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface InventoryContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedLocation: StoreLocation;
  setSelectedLocation: (loc: StoreLocation) => void;
  locations: StoreLocation[];
  
  // Inventory Lists
  motorcycles: MotorcycleItem[];
  helmets: HelmetGearItem[];
  parts: SparePartItem[];
  allItems: InventoryItem[];
  activityLogs: ActivityLog[];

  // Actions
  addMotorcycle: (item: Omit<MotorcycleItem, 'id' | 'createdAt'>) => void;
  addHelmet: (item: Omit<HelmetGearItem, 'id' | 'createdAt'>) => void;
  addPart: (item: Omit<SparePartItem, 'id' | 'createdAt'>) => void;
  
  updateMotorcycle: (id: string, updates: Partial<MotorcycleItem>) => void;
  updateHelmet: (id: string, updates: Partial<HelmetGearItem>) => void;
  updatePart: (id: string, updates: Partial<SparePartItem>) => void;

  adjustStock: (itemId: string, itemType: 'motorcycle' | 'helmet' | 'part', quantityChange: number, reason: string) => void;
  deleteItem: (itemId: string, itemType: 'motorcycle' | 'helmet' | 'part') => void;

  // Search & Modals
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  defaultAddModalTab: 'motorcycle' | 'helmet' | 'part';
  openAddModal: (tab?: 'motorcycle' | 'helmet' | 'part') => void;

  // Selected item for details/edit
  inspectItem: InventoryItem | null;
  setInspectItem: (item: InventoryItem | null) => void;
  adjustStockItem: InventoryItem | null;
  setAdjustStockItem: (item: InventoryItem | null) => void;

  // Low stock items
  lowStockItems: { item: InventoryItem; currentStock: number; threshold: number; name: string; code: string }[];

  // Notifications drawer
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Reset to initial
  resetDemoData: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [locations] = useState<StoreLocation[]>(INITIAL_LOCATIONS);
  const [selectedLocation, setSelectedLocation] = useState<StoreLocation>(INITIAL_LOCATIONS[0]);
  
  const [motorcycles, setMotorcycles] = useState<MotorcycleItem[]>(INITIAL_MOTORCYCLES);
  const [helmets, setHelmets] = useState<HelmetGearItem[]>(INITIAL_HELMETS_GEAR);
  const [parts, setParts] = useState<SparePartItem[]>(INITIAL_SPARE_PARTS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [defaultAddModalTab, setDefaultAddModalTab] = useState<'motorcycle' | 'helmet' | 'part'>('motorcycle');
  
  const [inspectItem, setInspectItem] = useState<InventoryItem | null>(null);
  const [adjustStockItem, setAdjustStockItem] = useState<InventoryItem | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openAddModal = (tab: 'motorcycle' | 'helmet' | 'part' = 'motorcycle') => {
    setDefaultAddModalTab(tab);
    setIsAddModalOpen(true);
  };

  const allItems: InventoryItem[] = useMemo(() => {
    return [...motorcycles, ...helmets, ...parts];
  }, [motorcycles, helmets, parts]);

  // Compute low stock items
  const lowStockItems = useMemo(() => {
    const alerts: { item: InventoryItem; currentStock: number; threshold: number; name: string; code: string }[] = [];

    helmets.forEach(h => {
      if (h.quantityInStock <= h.minAlertThreshold) {
        alerts.push({
          item: h,
          currentStock: h.quantityInStock,
          threshold: h.minAlertThreshold,
          name: `${h.brand} ${h.model} (${h.size})`,
          code: h.sku
        });
      }
    });

    parts.forEach(p => {
      if (p.stockCount <= p.reorderPoint) {
        alerts.push({
          item: p,
          currentStock: p.stockCount,
          threshold: p.reorderPoint,
          name: `${p.brand} - ${p.name}`,
          code: p.partNumber
        });
      }
    });

    return alerts;
  }, [helmets, parts]);

  // Add Item implementations
  const addMotorcycle = (item: Omit<MotorcycleItem, 'id' | 'createdAt'>) => {
    const newMoto: MotorcycleItem = {
      ...item,
      id: `moto-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setMotorcycles(prev => [newMoto, ...prev]);

    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      action: 'create',
      title: `Added Motorcycle: ${newMoto.brand} ${newMoto.model}`,
      description: `VIN ${newMoto.vin} registered in inventory at ${newMoto.location}`,
      itemType: 'motorcycle',
      referenceId: newMoto.vin,
      amount: newMoto.sellingPrice,
      timestamp: 'Just now',
      user: 'Current User'
    };
    setActivityLogs(prev => [log, ...prev]);

    addToast({
      type: 'success',
      title: 'Motorcycle Added',
      message: `${newMoto.brand} ${newMoto.model} (VIN: ${newMoto.vin}) added to inventory.`
    });
  };

  const addHelmet = (item: Omit<HelmetGearItem, 'id' | 'createdAt'>) => {
    const newHelmet: HelmetGearItem = {
      ...item,
      id: `gear-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setHelmets(prev => [newHelmet, ...prev]);

    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      action: 'create',
      title: `Added Helmet/Gear: ${newHelmet.brand} ${newHelmet.model}`,
      description: `SKU ${newHelmet.sku}, Size: ${newHelmet.size}, Stock: ${newHelmet.quantityInStock}`,
      itemType: 'helmet',
      referenceId: newHelmet.sku,
      amount: newHelmet.price * newHelmet.quantityInStock,
      timestamp: 'Just now',
      user: 'Current User'
    };
    setActivityLogs(prev => [log, ...prev]);

    addToast({
      type: 'success',
      title: 'Helmet/Gear Added',
      message: `${newHelmet.brand} ${newHelmet.model} added with ${newHelmet.quantityInStock} units.`
    });
  };

  const addPart = (item: Omit<SparePartItem, 'id' | 'createdAt'>) => {
    const newPart: SparePartItem = {
      ...item,
      id: `part-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setParts(prev => [newPart, ...prev]);

    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      action: 'create',
      title: `Added Spare Part: ${newPart.brand} ${newPart.name}`,
      description: `Part #${newPart.partNumber}, Bin: ${newPart.shelfBinLocation}`,
      itemType: 'part',
      referenceId: newPart.partNumber,
      amount: newPart.unitPrice * newPart.stockCount,
      timestamp: 'Just now',
      user: 'Current User'
    };
    setActivityLogs(prev => [log, ...prev]);

    addToast({
      type: 'success',
      title: 'Spare Part Added',
      message: `${newPart.name} (#${newPart.partNumber}) stored in ${newPart.shelfBinLocation}.`
    });
  };

  // Update item
  const updateMotorcycle = (id: string, updates: Partial<MotorcycleItem>) => {
    setMotorcycles(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    addToast({
      type: 'info',
      title: 'Motorcycle Updated',
      message: 'Vehicle specifications updated successfully.'
    });
  };

  const updateHelmet = (id: string, updates: Partial<HelmetGearItem>) => {
    setHelmets(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    addToast({
      type: 'info',
      title: 'Gear Updated',
      message: 'Gear details updated successfully.'
    });
  };

  const updatePart = (id: string, updates: Partial<SparePartItem>) => {
    setParts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    addToast({
      type: 'info',
      title: 'Part Updated',
      message: 'Part details updated successfully.'
    });
  };

  // Adjust stock
  const adjustStock = (itemId: string, itemType: 'motorcycle' | 'helmet' | 'part', quantityChange: number, reason: string) => {
    let itemName = '';
    let itemCode = '';

    if (itemType === 'motorcycle') {
      const moto = motorcycles.find(m => m.id === itemId);
      if (moto) {
        itemName = `${moto.brand} ${moto.model}`;
        itemCode = moto.vin;
        // If motorcycle status changes
        if (quantityChange < 0) {
          updateMotorcycle(itemId, { status: 'Sold' });
        } else {
          updateMotorcycle(itemId, { status: 'In Stock' });
        }
      }
    } else if (itemType === 'helmet') {
      const h = helmets.find(item => item.id === itemId);
      if (h) {
        itemName = `${h.brand} ${h.model}`;
        itemCode = h.sku;
        const newQty = Math.max(0, h.quantityInStock + quantityChange);
        setHelmets(prev => prev.map(item => item.id === itemId ? { ...item, quantityInStock: newQty } : item));
      }
    } else if (itemType === 'part') {
      const p = parts.find(item => item.id === itemId);
      if (p) {
        itemName = `${p.brand} ${p.name}`;
        itemCode = p.partNumber;
        const newQty = Math.max(0, p.stockCount + quantityChange);
        setParts(prev => prev.map(item => item.id === itemId ? { ...item, stockCount: newQty } : item));
      }
    }

    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      action: quantityChange >= 0 ? 'receive' : 'adjustment',
      title: `Stock Adjustment (${quantityChange >= 0 ? '+' : ''}${quantityChange}): ${itemName}`,
      description: `Reason: ${reason}. Code: ${itemCode}`,
      itemType,
      referenceId: itemCode,
      quantityChange,
      timestamp: 'Just now',
      user: 'Current User'
    };
    setActivityLogs(prev => [log, ...prev]);

    addToast({
      type: quantityChange >= 0 ? 'success' : 'warning',
      title: 'Stock Adjusted',
      message: `${itemName} adjusted by ${quantityChange >= 0 ? '+' : ''}${quantityChange} units.`
    });
  };

  // Delete item
  const deleteItem = (itemId: string, itemType: 'motorcycle' | 'helmet' | 'part') => {
    if (itemType === 'motorcycle') {
      setMotorcycles(prev => prev.filter(m => m.id !== itemId));
    } else if (itemType === 'helmet') {
      setHelmets(prev => prev.filter(h => h.id !== itemId));
    } else if (itemType === 'part') {
      setParts(prev => prev.filter(p => p.id !== itemId));
    }

    addToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Item has been deleted from inventory registry.'
    });
  };

  const resetDemoData = () => {
    setMotorcycles(INITIAL_MOTORCYCLES);
    setHelmets(INITIAL_HELMETS_GEAR);
    setParts(INITIAL_SPARE_PARTS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    addToast({
      type: 'info',
      title: 'Data Reset',
      message: 'Inventory restored to original sample dataset.'
    });
  };

  return (
    <InventoryContext.Provider value={{
      activeTab,
      setActiveTab,
      selectedLocation,
      setSelectedLocation,
      locations,
      motorcycles,
      helmets,
      parts,
      allItems,
      activityLogs,
      addMotorcycle,
      addHelmet,
      addPart,
      updateMotorcycle,
      updateHelmet,
      updatePart,
      adjustStock,
      deleteItem,
      searchQuery,
      setSearchQuery,
      isAddModalOpen,
      setIsAddModalOpen,
      defaultAddModalTab,
      openAddModal,
      inspectItem,
      setInspectItem,
      adjustStockItem,
      setAdjustStockItem,
      lowStockItems,
      isNotificationsOpen,
      setIsNotificationsOpen,
      toasts,
      addToast,
      removeToast,
      resetDemoData
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
