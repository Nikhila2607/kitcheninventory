import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import ShoppingList from '../components/shopping/ShoppingList';
import { useAuth } from '../context/AuthContext';
import { useKitchen } from '../context/KitchenContext';
import { Navigate } from 'react-router-dom';

const ShoppingListPage: React.FC = () => {
  const { authState } = useAuth();
  const { selectedKitchen } = useKitchen();

  if (!authState.isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (!selectedKitchen) {
    return <Navigate to="/kitchen-select" />;
  }

  return (
    <AppLayout activeTab="shopping">
      <ShoppingList />
    </AppLayout>
  );
};

export default ShoppingListPage;