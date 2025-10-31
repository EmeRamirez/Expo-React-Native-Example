// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, LoginCredentials } from '@/types/auth';
import { mockUsers, userPasswords } from '@/data/mockUsers';

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
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para verificar si hay un usuario logueado al iniciar la app
  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      // Simulamos una verificación de autenticación almacenada
      // En una app real, aquí verificaríamos un token en AsyncStorage
      setIsLoading(false);
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      // Simulamos una petición de login
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 1. Buscar el usuario por email
      const foundUser = mockUsers.find(user => user.email === email);
      
      if (!foundUser) {
        setIsLoading(false);
        return { 
          success: false, 
          message: 'Usuario no encontrado' 
        };
      }

      // 2. Verificar la contraseña
      const correctPassword = userPasswords[email];
      
      if (password !== correctPassword) {
        setIsLoading(false);
        return { 
          success: false, 
          message: 'Contraseña incorrecta' 
        };
      }

      // 3. Login exitoso
      setUser(foundUser);
      
      // En una app real, aquí guardaríamos el token en AsyncStorage
      // await AsyncStorage.setItem('userToken', 'fake-token');
      
      setIsLoading(false);
      return { 
        success: true, 
        message: 'Login exitoso' 
      };

    } catch (error) {
      setIsLoading(false);
      return { 
        success: false, 
        message: 'Error en el servidor' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    // En una app real, aquí limpiaríamos el token de AsyncStorage
    // await AsyncStorage.removeItem('userToken');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user, // Convierte user a boolean
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}