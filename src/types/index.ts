export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

export interface Kitchen {
  id: string;
  name: string;
  ownerId: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  lowThreshold: number;
  kitchenId: string;
  addedAt: number;
  updatedAt: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  kitchenId: string;
  isChecked: boolean;
  addedAt: number;
  updatedAt: number;
  automatic: boolean; // Was it automatically added due to low inventory
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type InventoryContextType = {
  inventoryItems: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'addedAt' | 'updatedAt'>) => void;
  updateInventoryItem: (id: string, updates: Partial<Omit<InventoryItem, 'id' | 'addedAt' | 'updatedAt'>>) => void;
  removeInventoryItem: (id: string) => void;
  decreaseQuantity: (id: string, amount: number) => void;
};

export type ShoppingContextType = {
  shoppingItems: ShoppingItem[];
  addShoppingItem: (item: Omit<ShoppingItem, 'id' | 'addedAt' | 'updatedAt' | 'isChecked'>) => void;
  updateShoppingItem: (id: string, updates: Partial<Omit<ShoppingItem, 'id' | 'addedAt' | 'updatedAt'>>) => void;
  removeShoppingItem: (id: string) => void;
  toggleItemChecked: (id: string) => void;
  clearCheckedItems: () => void;
};

export type KitchenContextType = {
  kitchens: Kitchen[];
  selectedKitchen: Kitchen | null;
  addKitchen: (name: string) => void;
  selectKitchen: (id: string) => void;
  updateKitchen: (id: string, name: string) => void;
  removeKitchen: (id: string) => void;
};

export const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Dairy',
  'Meat',
  'Seafood',
  'Spices',
  'Condiments',
  'Baking',
  'Canned',
  'Frozen',
  'Beverages',
  'Snacks',
  'Other'
];

export const UNITS = [
  'g', 'kg', 'ml', 'l', 'pcs', 'bunch', 'cup', 'tbsp', 'tsp', 'oz', 'lb', 'bottle', 'can', 'packet', 'box'
];