import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MOCK_USERS } from '../utils/mockData';
import type { User } from '../types';

export type UserRole = 'admin' | 'engineer' | 'inspector';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || JSON.stringify(MOCK_USERS));
      const mockUser = users.find((u: User) => u.email === email);
      
      if (mockUser && mockUser.password === password) {
        const { password: _, ...userWithoutPassword } = mockUser;
        setUser(userWithoutPassword);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    try {
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    loading,
    login,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 