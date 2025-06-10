import React, { createContext, useContext, useState, useEffect } from 'react';
import { InventoryItem, InventoryContextType } from '../types';
import { useAuth } from './AuthContext';
import { useKitchen } from './KitchenContext';
import { useShoppingList } from './ShoppingListContext';

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState } = useAuth();
  const { selectedKitchen } = useKitchen();
  const { addShoppingItem } = useShoppingList();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  // Load inventory items when kitchen changes
  useEffect(() => {
    if (authState.user && selectedKitchen) {
      const savedItems = localStorage.getItem(`inventory-${selectedKitchen.id}`);
      if (savedItems) {
        try {
          setInventoryItems(JSON.parse(savedItems));
        } catch (error) {
          console.error('Error parsing inventory items', error);
          setInventoryItems([]);
        }
      } else {
        setInventoryItems([]);
      }
    } else {
      setInventoryItems([]);
    }
  }, [authState.user, selectedKitchen]);

  const saveInventoryItems = (items: InventoryItem[]) => {
    if (selectedKitchen) {
      localStorage.setItem(`inventory-${selectedKitchen.id}`, JSON.stringify(items));
    }
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'addedAt' | 'updatedAt'>) => {
    if (!selectedKitchen) return;
    
    const timestamp = Date.now();
    const newItem: InventoryItem = {
      ...item,
      id: `item-${timestamp}`,
      addedAt: timestamp,
      updatedAt: timestamp,
    };
    
    const updatedItems = [...inventoryItems, newItem];
    setInventoryItems(updatedItems);
    saveInventoryItems(updatedItems);
  };

  const updateInventoryItem = (
    id: string, 
    updates: Partial<Omit<InventoryItem, 'id' | 'addedAt' | 'updatedAt'>>
  ) => {
    const updatedItems = inventoryItems.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: Date.now() } 
        : item
    );
    
    setInventoryItems(updatedItems);
    saveInventoryItems(updatedItems);
  };

  const removeInventoryItem = (id: string) => {
    const updatedItems = inventoryItems.filter(item => item.id !== id);
    setInventoryItems(updatedItems);
    saveInventoryItems(updatedItems);
  };

  const decreaseQuantity = (id: string, amount: number) => {
    const item = inventoryItems.find(item => item.id === id);
    
    if (!item || !selectedKitchen) return;
    
    const newQuantity = Math.max(0, item.quantity - amount);
    
    updateInventoryItem(id, { quantity: newQuantity });
    
    // If quantity is below threshold, add to shopping list
    if (newQuantity <= item.lowThreshold) {
      // Add to shopping list
      addShoppingItem({
        name: item.name,
        quantity: item.quantity, // Default quantity for shopping
        unit: item.unit,
        category: item.category,
        kitchenId: selectedKitchen.id,
        automatic: true,
      });
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        inventoryItems,
        addInventoryItem,
        updateInventoryItem,
        removeInventoryItem,
        decreaseQuantity,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};