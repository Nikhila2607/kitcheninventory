import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User } from '../types';

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Mock authentication for MVP
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check local storage for saved user
    const savedUser = localStorage.getItem('kitchen-inventory-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setAuthState({
          user: parsedUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem('kitchen-inventory-user');
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login for MVP
    setAuthState({ user: null, isAuthenticated: false, isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      const user: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
      };
      
      localStorage.setItem('kitchen-inventory-user', JSON.stringify(user));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const loginWithGoogle = async () => {
    // Mock Google login for MVP
    setAuthState({ user: null, isAuthenticated: false, isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: `google-user-${Date.now()}`,
      name: 'Google User',
      email: 'user@example.com',
      photoURL: 'https://via.placeholder.com/150',
    };
    
    localStorage.setItem('kitchen-inventory-user', JSON.stringify(user));
    
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock registration for MVP
    setAuthState({ user: null, isAuthenticated: false, isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (name && email && password) {
      const user: User = {
        id: `user-${Date.now()}`,
        name,
        email,
      };
      
      localStorage.setItem('kitchen-inventory-user', JSON.stringify(user));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      throw new Error('Invalid registration details');
    }
  };

  const logout = async () => {
    // Mock logout for MVP
    localStorage.removeItem('kitchen-inventory-user');
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ authState, login, loginWithGoogle, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};