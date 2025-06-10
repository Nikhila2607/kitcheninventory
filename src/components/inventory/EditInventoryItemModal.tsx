import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { InventoryItem, CATEGORIES, UNITS } from '../../types';
import { X } from 'lucide-react';

interface EditInventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem;
}

const EditInventoryItemModal: React.FC<EditInventoryItemModalProps> = ({ isOpen, onClose, item }) => {
  const { updateInventoryItem } = useInventory();
  
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(
    CATEGORIES.includes(item.category) ? item.category : CATEGORIES[0]
  );
  const [quantity, setQuantity] = useState(item.quantity);
  const [unit, setUnit] = useState(
    UNITS.includes(item.unit) ? item.unit : UNITS[0]
  );
  const [lowThreshold, setLowThreshold] = useState(item.lowThreshold);
  const [customCategory, setCustomCategory] = useState(
    CATEGORIES.includes(item.category) ? '' : item.category
  );
  const [isCustomCategory, setIsCustomCategory] = useState(!CATEGORIES.includes(item.category));
  const [customUnit, setCustomUnit] = useState(
    UNITS.includes(item.unit) ? '' : item.unit
  );
  const [isCustomUnit, setIsCustomUnit] = useState(!UNITS.includes(item.unit));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateInventoryItem(item.id, {
      name: name.trim(),
      category: isCustomCategory ? customCategory.trim() : category,
      quantity,
      unit: isCustomUnit ? customUnit.trim() : unit,
      lowThreshold,
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Inventory Item</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Item Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      {!isCustomCategory ? (
                        <div className="mt-1 flex">
                          <select
                            id="category"
                            name="category"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            onClick={() => setIsCustomCategory(true)}
                          >
                            Custom
                          </button>
                        </div>
                      ) : (
                        <div className="mt-1 flex">
                          <input
                            type="text"
                            name="customCategory"
                            id="customCategory"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            placeholder="Custom category"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            onClick={() => setIsCustomCategory(false)}
                          >
                            Preset
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                          Quantity
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          id="quantity"
                          min="0"
                          step="0.01"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                          value={quantity}
                          onChange={(e) => setQuantity(parseFloat(e.target.value))}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                          Unit
                        </label>
                        {!isCustomUnit ? (
                          <div className="mt-1 flex">
                            <select
                              id="unit"
                              name="unit"
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                              value={unit}
                              onChange={(e) => setUnit(e.target.value)}
                            >
                              {UNITS.map((u) => (
                                <option key={u} value={u}>
                                  {u}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                              onClick={() => setIsCustomUnit(true)}
                            >
                              Custom
                            </button>
                          </div>
                        ) : (
                          <div className="mt-1 flex">
                            <input
                              type="text"
                              name="customUnit"
                              id="customUnit"
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                              placeholder="Custom unit"
                              value={customUnit}
                              onChange={(e) => setCustomUnit(e.target.value)}
                              required
                            />
                            <button
                              type="button"
                              className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                              onClick={() => setIsCustomUnit(false)}
                            >
                              Preset
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="lowThreshold" className="block text-sm font-medium text-gray-700">
                        Low Stock Threshold
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="lowThreshold"
                          id="lowThreshold"
                          min="0"
                          step="0.01"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                          value={lowThreshold}
                          onChange={(e) => setLowThreshold(parseFloat(e.target.value))}
                          required
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        When quantity falls below this value, the item will be marked as low stock and added to shopping list.
                      </p>
                    </div>
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
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditInventoryItemModal;