import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../enums/UserRole';

interface PrivateRouteProps {
  allowedRoles?: UserRole[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, userRole, isLoading } = useAuth(); // <-- Obtén isLoading

  // Muestra un loader o un mensaje mientras se carga la información de autenticación
  if (isLoading) {
    return <div>Cargando autenticación...</div>; // O un spinner, Skeleton, etc.
  }

  if (!isAuthenticated) {
    // Si no está autenticado después de cargar, redirigir al login
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Si el rol no está permitido, redirigir
    return <Navigate to="/unauthorized" replace />; // Redirigir a la página de acceso denegado
  }

  return <Outlet />;
};

export default PrivateRoute;