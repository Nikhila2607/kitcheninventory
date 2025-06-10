import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useKitchen } from '../../context/KitchenContext';
import { InventoryItem, CATEGORIES } from '../../types';
import { 
  Plus, 
  Search, 
  FilterX, 
  PackageOpen, 
  AlertTriangle,
  Trash2,
  Edit,
  ChevronDown,
  LayoutGrid
} from 'lucide-react';
import AddInventoryItemModal from './AddInventoryItemModal';
import EditInventoryItemModal from './EditInventoryItemModal';

// Food image mapping
const FOOD_IMAGES: Record<string, string> = {
  // Vegetables
  'tomato': 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
  'potato': 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg',
  'onion': 'https://images.pexels.com/photos/4197447/pexels-photo-4197447.jpeg',
  'carrot': 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
  'pepper': 'https://images.pexels.com/photos/128536/pexels-photo-128536.jpeg',
  'bell pepper': 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg',
  'chili': 'https://images.pexels.com/photos/1435896/pexels-photo-1435896.jpeg',
  
  // Fruits
  'apple': 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
  'banana': 'https://images.pexels.com/photos/47305/bananas-banana-shrub-fruits-yellow-47305.jpeg',
  'orange': 'https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg',
  'avocado': 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg',
  'kiwi': 'https://images.pexels.com/photos/51312/kiwi-fruit-vitamins-healthy-eating-51312.jpeg',
  'pear': 'https://images.pexels.com/photos/568471/pexels-photo-568471.jpeg',
  'peach': 'https://images.pexels.com/photos/1268122/pexels-photo-1268122.jpeg',
  
  // Default images by category
  'Vegetables': 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg',
  'Fruits': 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
  'Dairy': 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg',
  'Meat': 'https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg',
  'Seafood': 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg',
  'Grains': 'https://images.pexels.com/photos/1537169/pexels-photo-1537169.jpeg',
  'Spices': 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg',
  'Condiments': 'https://images.pexels.com/photos/1435896/pexels-photo-1435896.jpeg',
  'Baking': 'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg',
  'Canned': 'https://images.pexels.com/photos/4033096/pexels-photo-4033096.jpeg',
  'Beverages': 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg',
  'default': 'https://images.pexels.com/photos/616484/pexels-photo-616484.jpeg'
};

const getItemImage = (item: InventoryItem): string => {
  const nameLower = item.name.toLowerCase();
  return FOOD_IMAGES[nameLower] || FOOD_IMAGES[item.category] || FOOD_IMAGES.default;
};

const InventoryList: React.FC = () => {
  const { inventoryItems, removeInventoryItem, decreaseQuantity } = useInventory();
  const { selectedKitchen } = useKitchen();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showLowStock, setShowLowStock] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState(3);

  if (!selectedKitchen) {
    return (
      <div className="text-center py-10">
        <PackageOpen className="h-12 w-12 text-culinary-400 mx-auto" />
        <h3 className="mt-2 text-sm font-medium text-culinary-900">No kitchen selected</h3>
        <p className="mt-1 text-sm text-culinary-500">
          Please select or create a kitchen to manage your inventory.
        </p>
      </div>
    );
  }

  const filteredItems = inventoryItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
      const matchesLowStock = showLowStock ? item.quantity <= item.lowThreshold : true;
      return matchesSearch && matchesCategory && matchesLowStock;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDecrease = (item: InventoryItem) => {
    decreaseQuantity(item.id, 1);
  };

  return (
    <div className="relative">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 bg-culinary-pattern bg-cover bg-center bg-no-repeat -z-10">
        <div className="absolute inset-0 bg-herb-900/80 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-herb-50">Kitchen Inventory</h1>
            <p className="mt-1 text-lg text-herb-200">
              {inventoryItems.length} items in {selectedKitchen.name}
            </p>
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <button
                onClick={() => setGridColumns(Math.max(1, gridColumns - 1))}
                className="p-2 text-herb-200 hover:text-herb-50 transition-colors"
              >
                -
              </button>
              <LayoutGrid className="h-5 w-5 text-herb-200" />
              <span className="text-herb-200">{gridColumns}</span>
              <button
                onClick={() => setGridColumns(Math.min(6, gridColumns + 1))}
                className="p-2 text-herb-200 hover:text-herb-50 transition-colors"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Add Item
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-herb-200" />
              </div>
              <input
                type="text"
                className="bg-white/10 text-herb-50 placeholder-herb-200 input-field pl-10"
                placeholder="Search ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <select
                className="bg-white/10 text-herb-50 input-field"
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
              
              <button
                type="button"
                className={`btn-secondary flex items-center ${
                  showLowStock ? 'bg-spice-100 text-spice-800' : ''
                }`}
                onClick={() => setShowLowStock(!showLowStock)}
              >
                <AlertTriangle className={`h-5 w-5 ${showLowStock ? 'text-spice-600' : 'text-culinary-400'}`} />
              </button>
              
              {(searchQuery || categoryFilter || showLowStock) && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter(null);
                    setShowLowStock(false);
                  }}
                >
                  <FilterX className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-xl">
            <PackageOpen className="mx-auto h-12 w-12 text-herb-200" />
            <h3 className="mt-2 text-lg font-medium text-herb-50">No items found</h3>
            <p className="mt-1 text-herb-200">
              {inventoryItems.length === 0
                ? 'Get started by adding some ingredients to your inventory.'
                : 'Try adjusting your search or filters to find what you\'re looking for.'}
            </p>
            {inventoryItems.length === 0 && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn-primary"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Add your first item
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${gridColumns} gap-6`}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`card group ${
                  item.quantity <= item.lowThreshold ? 'ring-2 ring-spice-500' : ''
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getItemImage(item)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white">{item.name}</h3>
                    <p className="text-culinary-100">{item.category}</p>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={`text-2xl font-bold ${
                        item.quantity <= item.lowThreshold ? 'text-spice-600' : 'text-culinary-700'
                      }`}>
                        {item.quantity} {item.unit}
                      </p>
                      <p className="text-sm text-culinary-500">
                        Low stock alert at {item.lowThreshold} {item.unit}
                      </p>
                    </div>
                    {item.quantity <= item.lowThreshold && (
                      <AlertTriangle className="h-6 w-6 text-spice-500" />
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDecrease(item)}
                      className="btn-secondary flex-1"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-2 text-culinary-400 hover:text-culinary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-herb-500"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => removeInventoryItem(item.id)}
                      className="p-2 text-culinary-400 hover:text-spice-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spice-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <AddInventoryItemModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      )}

      {/* Edit Item Modal */}
      {isEditModalOpen && selectedItem && (
        <EditInventoryItemModal
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

export default InventoryList;