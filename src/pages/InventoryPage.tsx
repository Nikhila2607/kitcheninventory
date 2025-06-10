import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import InventoryList from '../components/inventory/InventoryList';
import { useAuth } from '../context/AuthContext';
import { useKitchen } from '../context/KitchenContext';
import { Navigate } from 'react-router-dom';

const InventoryPage: React.FC = () => {
  const { authState } = useAuth();
  const { selectedKitchen } = useKitchen();

  if (!authState.isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (!selectedKitchen) {
    return <Navigate to="/kitchen-select" />;
  }

  return (
    <AppLayout activeTab="inventory">
      <InventoryList />
    </AppLayout>
  );
};

export default InventoryPage;