import React, { useState } from 'react';
import { useShoppingList } from '../../context/ShoppingListContext';
import { useKitchen } from '../../context/KitchenContext';
import { ShoppingItem, CATEGORIES } from '../../types';
import { 
  Plus, 
  Search, 
  FilterX, 
  ShoppingBag, 
  Trash2,
  Edit,
  CheckCircle,
  Circle,
  Trash,
  ShoppingCart
} from 'lucide-react';
import AddShoppingItemModal from './AddShoppingItemModal';
import EditShoppingItemModal from './EditShoppingItemModal';

const ShoppingList: React.FC = () => {
  const { shoppingItems, toggleItemChecked, removeShoppingItem, clearCheckedItems } = useShoppingList();
  const { selectedKitchen } = useKitchen();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showAutomatic, setShowAutomatic] = useState<boolean | null>(null);
  const [selectedItem, setSelectedItem] = useState<ShoppingItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!selectedKitchen) {
    return (
      <div className="text-center py-10">
        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No kitchen selected</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please select or create a kitchen to manage your shopping list.
        </p>
      </div>
    );
  }

  const filteredItems = shoppingItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
      const matchesAutomatic = showAutomatic !== null ? item.automatic === showAutomatic : true;
      return matchesSearch && matchesCategory && matchesAutomatic;
    })
    .sort((a, b) => {
      // First by checked status
      if (a.isChecked !== b.isChecked) {
        return a.isChecked ? 1 : -1; // Unchecked items first
      }
      
      // Then by category
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      
      // Then by name
      return a.name.localeCompare(b.name);
    });
    
  const handleEditClick = (item: ShoppingItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const itemsByCategory: Record<string, ShoppingItem[]> = {};
  CATEGORIES.forEach(category => {
    const items = filteredItems.filter(item => item.category === category);
    if (items.length > 0) {
      itemsByCategory[category] = items;
    }
  });

  // Handle uncategorized items
  const uncategorizedItems = filteredItems.filter(
    item => !CATEGORIES.includes(item.category)
  );
  if (uncategorizedItems.length > 0) {
    itemsByCategory['Other'] = uncategorizedItems;
  }
  
  const totalItems = shoppingItems.length;
  const checkedItems = shoppingItems.filter(item => item.isChecked).length;

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Shopping List</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {totalItems} items in {selectedKitchen.name}
            {totalItems > 0 && ` (${checkedItems} checked)`}
          </p>
        </div>
        <div className="flex space-x-2">
          {checkedItems > 0 && (
            <button
              type="button"
              onClick={clearCheckedItems}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash className="-ml-1 mr-2 h-5 w-5" />
              Clear Checked
            </button>
          )}
          
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Item
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search shopping list..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <div className="relative inline-block text-left">
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                value={categoryFilter || ''}
                onChange={(e) => setCategoryFilter(e.target.value || null)}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="button"
              className={`inline-flex items-center px-3 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                showAutomatic === true
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setShowAutomatic(showAutomatic === true ? null : true)}
            >
              <ShoppingCart className={`-ml-0.5 mr-2 h-4 w-4 ${showAutomatic === true ? 'text-blue-600' : 'text-gray-400'}`} />
              Auto-added
            </button>
            
            {(searchQuery || categoryFilter !== null || showAutomatic !== null) && (
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter(null);
                  setShowAutomatic(null);
                }}
              >
                <FilterX className="-ml-0.5 mr-2 h-4 w-4 text-gray-400" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Shopping list */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 border-t border-gray-200">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {shoppingItems.length === 0
              ? 'Get started by adding some items to your shopping list.'
              : 'Try adjusting your search or filters to find what you\'re looking for.'}
          </p>
          {shoppingItems.length === 0 && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Add your first item
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="border-t border-gray-200 divide-y divide-gray-200">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category} className="bg-white">
              <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                {category}
              </div>
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className={`px-4 py-4 sm:px-6 flex items-center ${
                    item.isChecked ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => toggleItemChecked(item.id)}
                        className="mr-3 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        {item.isChecked ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>
                      <div className={`text-sm font-medium ${
                        item.isChecked ? 'text-gray-400 line-through' : 'text-gray-900'
                      }`}>
                        {item.name}
                        {item.automatic && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Auto
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 text-sm text-right">
                      <span className={item.isChecked ? 'text-gray-400' : 'text-gray-900'}>
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(item)}
                      className="bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      disabled={item.isChecked}
                    >
                      <span className="sr-only">Edit</span>
                      <Edit className={`h-5 w-5 ${item.isChecked ? 'opacity-50' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeShoppingItem(item.id)}
                      className="bg-white rounded-full p-1 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <span className="sr-only">Remove</span>
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <AddShoppingItemModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      )}

      {/* Edit Item Modal */}
      {isEditModalOpen && selectedItem && (
        <EditShoppingItemModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default ShoppingList;