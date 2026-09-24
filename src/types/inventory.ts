export type ItemType = 'motorcycle' | 'helmet' | 'part';

export type MotorcycleCondition = 'New' | 'Used';
export type MotorcycleStatus = 'In Stock' | 'Reserved' | 'Sold';

export interface MotorcycleItem {
  id: string;
  type: 'motorcycle';
  vin: string;
  brand: string;
  model: string;
  year: number;
  condition: MotorcycleCondition;
  engineCc: number;
  color: string;
  mileage: number;
  costPrice: number;
  sellingPrice: number;
  status: MotorcycleStatus;
  imageUrl?: string;
  location: string;
  category: 'Sport' | 'Adventure' | 'Cruiser' | 'Naked' | 'Touring';
  createdAt: string;
}

export type HelmetSize = 'XS' | 'S' | 'M' | 'L' | 'XL';
export type SafetyCert = 'DOT' | 'ECE' | 'DOT & ECE' | 'FIM & ECE';

export interface HelmetGearItem {
  id: string;
  type: 'helmet';
  sku: string;
  brand: string;
  model: string;
  size: HelmetSize;
  safetyCert: SafetyCert;
  quantityInStock: number;
  minAlertThreshold: number;
  costPrice: number;
  price: number;
  color: string;
  gearType: 'Full Face Helmet' | 'Modular Helmet' | 'Riding Jacket' | 'Racing Suit' | 'Gloves' | 'Boots';
  imageUrl?: string;
  location: string;
  createdAt: string;
}

export type PartCategory = 'Exhaust' | 'Brakes' | 'Tires' | 'Oil & Fluids' | 'Electrical';

export interface SparePartItem {
  id: string;
  type: 'part';
  partNumber: string;
  brand: string;
  name: string;
  compatibleModels: string;
  category: PartCategory;
  shelfBinLocation: string;
  stockCount: number;
  reorderPoint: number;
  unitCost: number;
  unitPrice: number;
  imageUrl?: string;
  location: string;
  createdAt: string;
}

export type InventoryItem = MotorcycleItem | HelmetGearItem | SparePartItem;

export type NavigationTab = 'dashboard' | 'motorcycles' | 'helmets' | 'parts' | 'categories' | 'settings';

export interface ActivityLog {
  id: string;
  action: 'sale' | 'receive' | 'adjustment' | 'create' | 'reserve';
  title: string;
  description: string;
  itemType: ItemType;
  referenceId: string;
  quantityChange?: number;
  amount?: number;
  timestamp: string;
  user: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  isPrimary?: boolean;
}
