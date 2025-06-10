import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { KitchenProvider } from './context/KitchenContext';
import { InventoryProvider } from './context/InventoryContext';
import { ShoppingListProvider } from './context/ShoppingListContext';
import SignInPage from './pages/SignInPage';
import KitchenSelectPage from './pages/KitchenSelectPage';
import InventoryPage from './pages/InventoryPage';
import ShoppingListPage from './pages/ShoppingListPage';

function App() {
  return (
    <AuthProvider>
      <KitchenProvider>
        <ShoppingListProvider>
          <InventoryProvider>
            <Router>
              <Routes>
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/kitchen-select" element={<KitchenSelectPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/shopping" element={<ShoppingListPage />} />
                <Route path="*" element={<Navigate to="/signin\" replace />} />
              </Routes>
            </Router>
          </InventoryProvider>
        </ShoppingListProvider>
      </KitchenProvider>
    </AuthProvider>
  );
}

export default App;