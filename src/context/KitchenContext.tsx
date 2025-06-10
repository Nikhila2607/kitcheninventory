import React, { createContext, useContext, useState, useEffect } from 'react';
import { Kitchen, KitchenContextType } from '../types';
import { useAuth } from './AuthContext';

const KitchenContext = createContext<KitchenContextType | undefined>(undefined);

export const KitchenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState } = useAuth();
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [selectedKitchen, setSelectedKitchen] = useState<Kitchen | null>(null);

  useEffect(() => {
    // Load kitchens from localStorage when user logs in
    if (authState.isAuthenticated && authState.user) {
      const savedKitchens = localStorage.getItem(`kitchens-${authState.user.id}`);
      if (savedKitchens) {
        try {
          const parsedKitchens = JSON.parse(savedKitchens);
          setKitchens(parsedKitchens);
          
          // Select the first kitchen by default
          if (parsedKitchens.length > 0) {
            const savedSelectedKitchenId = localStorage.getItem(`selected-kitchen-${authState.user.id}`);
            if (savedSelectedKitchenId) {
              const kitchen = parsedKitchens.find((k: Kitchen) => k.id === savedSelectedKitchenId);
              setSelectedKitchen(kitchen || parsedKitchens[0]);
            } else {
              setSelectedKitchen(parsedKitchens[0]);
            }
          } else {
            setSelectedKitchen(null);
          }
        } catch (error) {
          console.error('Error parsing kitchens from localStorage', error);
          setKitchens([]);
          setSelectedKitchen(null);
        }
      } else {
        // Create a default kitchen for new users
        const defaultKitchen: Kitchen = {
          id: `kitchen-${Date.now()}`,
          name: 'My Kitchen',
          ownerId: authState.user.id,
        };
        setKitchens([defaultKitchen]);
        setSelectedKitchen(defaultKitchen);
        localStorage.setItem(`kitchens-${authState.user.id}`, JSON.stringify([defaultKitchen]));
        localStorage.setItem(`selected-kitchen-${authState.user.id}`, defaultKitchen.id);
      }
    } else {
      setKitchens([]);
      setSelectedKitchen(null);
    }
  }, [authState.isAuthenticated, authState.user]);

  const saveKitchens = (updatedKitchens: Kitchen[]) => {
    if (authState.user) {
      localStorage.setItem(`kitchens-${authState.user.id}`, JSON.stringify(updatedKitchens));
    }
  };

  const addKitchen = (name: string) => {
    if (!authState.user) return;
    
    const newKitchen: Kitchen = {
      id: `kitchen-${Date.now()}`,
      name,
      ownerId: authState.user.id,
    };
    
    const updatedKitchens = [...kitchens, newKitchen];
    setKitchens(updatedKitchens);
    saveKitchens(updatedKitchens);
    
    // Select the new kitchen
    setSelectedKitchen(newKitchen);
    if (authState.user) {
      localStorage.setItem(`selected-kitchen-${authState.user.id}`, newKitchen.id);
    }
  };

  const selectKitchen = (id: string) => {
    const kitchen = kitchens.find(k => k.id === id);
    if (kitchen) {
      setSelectedKitchen(kitchen);
      if (authState.user) {
        localStorage.setItem(`selected-kitchen-${authState.user.id}`, id);
      }
    }
  };

  const updateKitchen = (id: string, name: string) => {
    const updatedKitchens = kitchens.map(kitchen => 
      kitchen.id === id ? { ...kitchen, name } : kitchen
    );
    
    setKitchens(updatedKitchens);
    saveKitchens(updatedKitchens);
    
    if (selectedKitchen && selectedKitchen.id === id) {
      setSelectedKitchen({ ...selectedKitchen, name });
    }
  };

  const removeKitchen = (id: string) => {
    const updatedKitchens = kitchens.filter(kitchen => kitchen.id !== id);
    setKitchens(updatedKitchens);
    saveKitchens(updatedKitchens);
    
    // If the deleted kitchen was selected, select another one
    if (selectedKitchen && selectedKitchen.id === id) {
      if (updatedKitchens.length > 0) {
        setSelectedKitchen(updatedKitchens[0]);
        if (authState.user) {
          localStorage.setItem(`selected-kitchen-${authState.user.id}`, updatedKitchens[0].id);
        }
      } else {
        setSelectedKitchen(null);
        if (authState.user) {
          localStorage.removeItem(`selected-kitchen-${authState.user.id}`);
        }
      }
    }
  };

  return (
    <KitchenContext.Provider 
      value={{ 
        kitchens, 
        selectedKitchen, 
        addKitchen, 
        selectKitchen, 
        updateKitchen, 
        removeKitchen 
      }}
    >
      {children}
    </KitchenContext.Provider>
  );
};

export const useKitchen = () => {
  const context = useContext(KitchenContext);
  if (context === undefined) {
    throw new Error('useKitchen must be used within a KitchenProvider');
  }
  return context;
};