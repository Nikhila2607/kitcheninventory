import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShoppingItem, ShoppingContextType } from '../types';
import { useAuth } from './AuthContext';
import { useKitchen } from './KitchenContext';

const ShoppingListContext = createContext<ShoppingContextType | undefined>(undefined);

export const ShoppingListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState } = useAuth();
  const { selectedKitchen } = useKitchen();
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);

  // Load shopping items when kitchen changes
  useEffect(() => {
    if (authState.user && selectedKitchen) {
      const savedItems = localStorage.getItem(`shopping-${selectedKitchen.id}`);
      if (savedItems) {
        try {
          setShoppingItems(JSON.parse(savedItems));
        } catch (error) {
          console.error('Error parsing shopping items', error);
          setShoppingItems([]);
        }
      } else {
        setShoppingItems([]);
      }
    } else {
      setShoppingItems([]);
    }
  }, [authState.user, selectedKitchen]);

  const saveShoppingItems = (items: ShoppingItem[]) => {
    if (selectedKitchen) {
      localStorage.setItem(`shopping-${selectedKitchen.id}`, JSON.stringify(items));
    }
  };

  const addShoppingItem = (item: Omit<ShoppingItem, 'id' | 'addedAt' | 'updatedAt' | 'isChecked'>) => {
    if (!selectedKitchen) return;
    
    // Check if the item is already in the shopping list
    const existingItem = shoppingItems.find(
      i => i.name.toLowerCase() === item.name.toLowerCase() && i.unit === item.unit
    );
    
    if (existingItem) {
      // Update the existing item
      const updatedItems = shoppingItems.map(i => 
        i.id === existingItem.id 
          ? { 
              ...i, 
              quantity: i.quantity + item.quantity,
              updatedAt: Date.now(),
              // If manually added, keep it manual; if automatic, keep as automatic
              automatic: i.automatic && item.automatic 
            } 
          : i
      );
      
      setShoppingItems(updatedItems);
      saveShoppingItems(updatedItems);
      return;
    }
    
    // Add new item
    const timestamp = Date.now();
    const newItem: ShoppingItem = {
      ...item,
      id: `shopping-${timestamp}`,
      isChecked: false,
      addedAt: timestamp,
      updatedAt: timestamp,
    };
    
    const updatedItems = [...shoppingItems, newItem];
    setShoppingItems(updatedItems);
    saveShoppingItems(updatedItems);
  };

  const updateShoppingItem = (
    id: string, 
    updates: Partial<Omit<ShoppingItem, 'id' | 'addedAt' | 'updatedAt'>>
  ) => {
    const updatedItems = shoppingItems.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: Date.now() } 
        : item
    );
    
    setShoppingItems(updatedItems);
    saveShoppingItems(updatedItems);
  };

  const removeShoppingItem = (id: string) => {
    const updatedItems = shoppingItems.filter(item => item.id !== id);
    setShoppingItems(updatedItems);
    saveShoppingItems(updatedItems);
  };

  const toggleItemChecked = (id: string) => {
    const updatedItems = shoppingItems.map(item => 
      item.id === id 
        ? { ...item, isChecked: !item.isChecked, updatedAt: Date.now() } 
        : item
    );
    
    setShoppingItems(updatedItems);
    saveShoppingItems(updatedItems);
  };

  const clearCheckedItems = () => {
    const updatedItems = shoppingItems.filter(item => !item.isChecked);
    setShoppingItems(updatedItems);
    saveShoppingItems(updatedItems);
  };

  return (
    <ShoppingListContext.Provider
      value={{
        shoppingItems,
        addShoppingItem,
        updateShoppingItem,
        removeShoppingItem,
        toggleItemChecked,
        clearCheckedItems,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};