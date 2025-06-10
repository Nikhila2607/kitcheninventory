import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useKitchen } from '../../context/KitchenContext';
import VoiceControl from '../VoiceControl';
import { 
  ChefHat, 
  ShoppingBag, 
  PackageOpen, 
  LogOut, 
  Settings, 
  ChevronDown, 
  PlusCircle,
  Menu,
  X
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: 'inventory' | 'shopping';
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, activeTab }) => {
  const { authState, logout } = useAuth();
  const { kitchens, selectedKitchen, selectKitchen, addKitchen } = useKitchen();
  const [isKitchenDropdownOpen, setIsKitchenDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAddKitchenModalOpen, setIsAddKitchenModalOpen] = useState(false);
  const [newKitchenName, setNewKitchenName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAddKitchen = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKitchenName.trim()) {
      addKitchen(newKitchenName.trim());
      setNewKitchenName('');
      setIsAddKitchenModalOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <ChefHat className="h-8 w-8 text-emerald-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">KitchenKeeper</span>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              {selectedKitchen && (
                <div className="relative">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    onClick={() => setIsKitchenDropdownOpen(!isKitchenDropdownOpen)}
                  >
                    {selectedKitchen.name}
                    <ChevronDown className="ml-2 -mr-0.5 h-4 w-4" />
                  </button>

                  {isKitchenDropdownOpen && (
                    <div 
                      className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      onBlur={() => setIsKitchenDropdownOpen(false)}
                    >
                      <div className="py-1">
                        {kitchens.map((kitchen) => (
                          <button
                            key={kitchen.id}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              kitchen.id === selectedKitchen.id
                                ? 'bg-gray-100 text-gray-900 font-medium'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              selectKitchen(kitchen.id);
                              setIsKitchenDropdownOpen(false);
                            }}
                          >
                            {kitchen.name}
                          </button>
                        ))}
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-gray-100 font-medium"
                          onClick={() => {
                            setIsAddKitchenModalOpen(true);
                            setIsKitchenDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add New Kitchen
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <nav className="flex space-x-4">
                <a
                  href="/inventory"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'inventory'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <PackageOpen className="h-5 w-5 mr-1" />
                    <span>Inventory</span>
                  </div>
                </a>
                <a
                  href="/shopping"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'shopping'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-1" />
                    <span>Shopping List</span>
                  </div>
                </a>
              </nav>

              {authState.user && (
                <div className="relative ml-3">
                  <button
                    type="button"
                    className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    {authState.user.photoURL ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={authState.user.photoURL}
                        alt="User avatar"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-medium">
                        {authState.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {isUserDropdownOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      onBlur={() => setIsUserDropdownOpen(false)}
                    >
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                          <p className="font-medium">{authState.user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{authState.user.email}</p>
                        </div>
                        <a
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <div className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </div>
                        </a>
                        <button
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={handleLogout}
                        >
                          <div className="flex items-center">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign out
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {selectedKitchen && (
              <div className="px-3 py-2 font-medium text-gray-800">
                <span className="block text-sm font-medium text-gray-500">Current Kitchen</span>
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium">{selectedKitchen.name}</span>
                  <button
                    onClick={() => setIsAddKitchenModalOpen(true)}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add New
                  </button>
                </div>
              </div>
            )}
            
            {kitchens.length > 1 && (
              <div className="px-3 py-2">
                <span className="block text-sm font-medium text-gray-500">Switch Kitchen</span>
                <div className="mt-1 space-y-1">
                  {kitchens
                    .filter(k => k.id !== selectedKitchen?.id)
                    .map(kitchen => (
                      <button
                        key={kitchen.id}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => {
                          selectKitchen(kitchen.id);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {kitchen.name}
                      </button>
                    ))}
                </div>
              </div>
            )}
            
            <a
              href="/inventory"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                activeTab === 'inventory'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center">
                <PackageOpen className="h-5 w-5 mr-2" />
                Inventory
              </div>
            </a>
            
            <a
              href="/shopping"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                activeTab === 'shopping'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Shopping List
              </div>
            </a>
            
            {authState.user && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3">
                  {authState.user.photoURL ? (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={authState.user.photoURL}
                      alt="User avatar"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-medium">
                      {authState.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{authState.user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{authState.user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <a
                    href="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  >
                    <div className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Settings
                    </div>
                  </a>
                  <button
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 w-full text-left"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center">
                      <LogOut className="h-5 w-5 mr-2" />
                      Sign out
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Add Kitchen Modal */}
      {isAddKitchenModalOpen && (
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
                      <div className="mt-4">
                        <label htmlFor="kitchenName" className="block text-sm font-medium text-gray-700">
                          Kitchen Name
                        </label>
                        <input
                          type="text"
                          name="kitchenName"
                          id="kitchenName"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                          placeholder="e.g., Home Kitchen, Beach House, Office"
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
                    onClick={() => setIsAddKitchenModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <VoiceControl />
    </div>
  );
};

export default AppLayout;