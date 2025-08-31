import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@shared/types';
import api from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { email?: string; currentPassword?: string; newPassword?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = api.getAuthToken();
        if (token) {
          const userProfile = await api.getProfile();
          setUser(userProfile);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        api.removeAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user, token } = await api.login({ email, password });
      setUser(user);
      api.setAuthToken(token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user, token } = await api.register({ email, password });
      setUser(user);
      api.setAuthToken(token);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const updateProfile = async (data: { email?: string; currentPassword?: string; newPassword?: string }) => {
    try {
      setIsLoading(true);
      const updatedUser = await api.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}