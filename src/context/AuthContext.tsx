import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { UserRole } from '../enums/UserRole';

interface AuthContextType {
  token: string | null;
  userRole: UserRole | null;
  userId: number | null;
  login: (token: string, id: number, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean; // <-- Añade un estado de carga
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true); // <-- Nuevo estado para indicar que estamos cargando/verificando

  useEffect(() => {
    const loadAuthData = () => {
      const storedToken = localStorage.getItem('token');
      const storedRole = localStorage.getItem('userRole') as UserRole | null;
      const storedUserId = localStorage.getItem('userId');

      if (storedToken && storedRole && storedUserId) {
        setToken(storedToken);
        setUserRole(storedRole);
        // Asegúrate de que storedUserId se parsea a número correctamente
        try {
          setUserId(parseInt(storedUserId));
        } catch (e) {
          console.error("Error parsing userId from localStorage:", e);
          // Si hay un error, considera limpiar la sesión o tratarlo como no autenticado
          logout();
        }
      }
      setIsLoading(false); // <-- Una vez que se ha intentado cargar, marcamos como no cargando
    };

    loadAuthData();
  }, []); // El array de dependencias vacío asegura que esto se ejecute solo una vez al montar

  const login = (newToken: string, id: number, role: UserRole) => {
    setToken(newToken);
    setUserId(id);
    setUserRole(role);
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', id.toString()); // Asegúrate de que 'id' es un número aquí
    setIsLoading(false); // Ya no estamos cargando después de un login exitoso
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setIsLoading(false); // Ya no estamos cargando después de un logout
  };

  const isAuthenticated = !!token && !!userRole && !!userId; // Aseguramos que todos los datos estén presentes

  return (
    <AuthContext.Provider value={{ token, userRole, userId, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};