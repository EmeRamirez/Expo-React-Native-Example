// context/AuthContext.tsx
import { AuthContextType, User } from '@/types/auth';
import {
  clearSessionFromStorage,
  clearTokenFromStorage,
  getSessionFromStorage,
  getTokenFromStorage,
  saveSessionToStorage,
  saveTokenToStorage
} from '@/utils/storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Creamos el contexto con valores por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props para el provider
interface AuthProviderProps {
  children: ReactNode;
}

// Hook personalizado para usar el contexto
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

// Componente Provider
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para verificar si hay un usuario logueado al iniciar la app
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        // Cargar usuario y token desde AsyncStorage
        const [storedUser, storedToken] = await Promise.all([
          getSessionFromStorage(),
          getTokenFromStorage()
        ]);
        
        if (storedUser && storedToken) {
          setUser(storedUser);
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error loading stored auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStoredData();
  }, []);


  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      // Esta función solo será llamada desde el hook useLogin
      return { 
        success: false, 
        message: 'Usa useLogin hook en su lugar' 
      };
    } catch (error) {
      setIsLoading(false);
      return { 
        success: false, 
        message: 'Error en el servidor' 
      };
    }
  };

  // Función para actualizar el estado después de un login exitoso desde el hook
  const updateAuthState = async (userData: User, authToken: string) => {
    try {
      // Guardar en AsyncStorage
      await Promise.all([
        saveSessionToStorage(userData),
        saveTokenToStorage(authToken)
      ]);
      
      // Actualizar estado
      setUser(userData);
      setToken(authToken);
      
      return true;
    } catch (error) {
      console.error('Error updating auth state:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Limpiar AsyncStorage
      await Promise.all([
        clearSessionFromStorage(),
        clearTokenFromStorage()
      ]);
      
      // Limpiar estado
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    updateAuthState, // Nueva función
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}