import React, { useState } from 'react';
import { useKitchen } from '../context/KitchenContext';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Kitchen } from '../types';
import { ChefHat, Plus, Pencil, Trash2 } from 'lucide-react';

const KitchenSelectPage: React.FC = () => {
  const { authState } = useAuth();
  const { kitchens, addKitchen, selectKitchen, updateKitchen, removeKitchen } = useKitchen();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newKitchenName, setNewKitchenName] = useState('');
  const [editingKitchen, setEditingKitchen] = useState<Kitchen | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedKitchenName, setEditedKitchenName] = useState('');

  if (!authState.isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (kitchens.length === 1) {
    selectKitchen(kitchens[0].id);
    return <Navigate to="/inventory" />;
  }

  const handleAddKitchen = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKitchenName.trim()) {
      addKitchen(newKitchenName.trim());
      setNewKitchenName('');
      setIsAddModalOpen(false);
    }
  };

  const handleEditKitchen = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKitchen && editedKitchenName.trim()) {
      updateKitchen(editingKitchen.id, editedKitchenName.trim());
      setEditingKitchen(null);
      setEditedKitchenName('');
      setIsEditModalOpen(false);
    }
  };

  const openEditModal = (kitchen: Kitchen) => {
    setEditingKitchen(kitchen);
    setEditedKitchenName(kitchen.name);
    setIsEditModalOpen(true);
  };

  const handleDeleteKitchen = (kitchenId: string) => {
    if (window.confirm('Are you sure you want to delete this kitchen? All inventory and shopping lists will be permanently deleted.')) {
      removeKitchen(kitchenId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <ChefHat className="h-8 w-8 text-emerald-600" />
            <h1 className="ml-3 text-3xl font-bold text-gray-900">KitchenKeeper</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Select a Kitchen</h2>
            <p className="mt-2 text-sm text-gray-600">
              Choose a kitchen to manage or create a new one
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {kitchens.map((kitchen) => (
              <div
                key={kitchen.id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-200 relative"
              >
                <button
                  onClick={() => selectKitchen(kitchen.id)}
                  className="w-full text-left px-3 py-3 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <span className="flex items-center">
                    <ChefHat className="h-6 w-6 text-emerald-500 mr-3" />
                    <span className="text-lg font-medium text-gray-900">{kitchen.name}</span>
                  </span>
                </button>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(kitchen);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteKitchen(kitchen.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full flex items-center justify-center px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Kitchen
            </button>
          </div>
        </div>
      </main>

      {/* Add Kitchen Modal */}
      {isAddModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddKitchen}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ChefHat className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Kitchen</h3>
                      <div className="mt-2">
                        <input
                          type="text"
                          className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Kitchen name"
                          value={newKitchenName}
                          onChange={(e) => setNewKitchenName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Kitchen
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Kitchen Modal */}
      {isEditModalOpen && editingKitchen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleEditKitchen}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Pencil className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Kitchen</h3>
                      <div className="mt-2">
                        <input
                          type="text"
                          className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Kitchen name"
                          value={editedKitchenName}
                          onChange={(e) => setEditedKitchenName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenSelectPage;