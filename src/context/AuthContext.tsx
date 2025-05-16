import { createContext, useContext, useState, useEffect } from 'react';
import type { AuthState, User } from '../types';
import { MOCK_USERS } from '../utils/mockData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  canEditShips: () => boolean;
  canEditUsers: () => boolean;
  canEditMaintenance: () => boolean;
  canViewMaintenance: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        loading: false
      });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const user = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Remove password before storing
    const { password: _, ...userWithoutPassword } = user;
    
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setAuthState({
      user: userWithoutPassword,
      isAuthenticated: true,
      loading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false
    });
  };

  const canEditShips = () => {
    return authState.user?.role === 'admin';
  };

  const canEditUsers = () => {
    return authState.user?.role === 'admin';
  };

  const canEditMaintenance = () => {
    return ['admin', 'engineer'].includes(authState.user?.role || '');
  };

  const canViewMaintenance = () => {
    return ['admin', 'engineer', 'inspector'].includes(authState.user?.role || '');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        ...authState, 
        login, 
        logout,
        canEditShips,
        canEditUsers,
        canEditMaintenance,
        canViewMaintenance
      }}
    >
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