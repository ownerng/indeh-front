import React from 'react';
import type { LayoutProps } from '../types/global';
import Sidebar from '../components/SideBar';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../enums/UserRole';

interface AppLayoutProps extends LayoutProps {
  showSidebar?: boolean;
  userRole?: UserRole;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  showSidebar = true,
  userRole 
}) => {
  // Obtener información del usuario desde el contexto de autenticación
  const { userRole: contextUserRole } = useAuth();
  
  // Usar el rol pasado como prop o el del usuario autenticado
  const currentUserRole = userRole || contextUserRole || UserRole.PROFESOR;

  if (!showSidebar) {
    // Layout simple sin sidebar (para login, etc.)
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Instituto Nacional de Desarrollo Humano</h1>
          </div>
        </header>
        
        <main className="container mx-auto p-4 mt-6">
          {children}
        </main>
      </div>
    );
  }

  // Layout con sidebar
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        userRole={currentUserRole}
      />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Instituto Nacional de Desarrollo Humano</h1>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};