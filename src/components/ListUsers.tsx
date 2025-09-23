import { useEffect, useState } from "react";
import type { UsersResponse } from "../types/global";
import { UserCard } from "./UserCard";
import { StudentService } from "../services/students.service";

interface ListUsersProps {
  users: UsersResponse[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
}

export const ListUsers = ({ users, loading, error, fetchUsers }: ListUsersProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {

  }, [fetchUsers]);

  // Función para probar la conectividad antes de la descarga
  const testConnection = async () => {
    try {
      const response = await fetch('https://capialti.shop/api/students/', {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  };

  const handleDownloadValoraciones = async () => {
    try {
      setIsDownloading(true);
      
      // Verificar si hay token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Error: No hay token de autorización. Por favor, inicia sesión nuevamente.');
        return;
      }
      
      // Probar la conectividad antes de intentar la descarga
      console.log('Testing connection...');
      const connectionOk = await testConnection();
      if (!connectionOk) {
        alert('Error: No se puede establecer conexión con el servidor. Verifica tu conexión e intenta nuevamente.');
        return;
      }
      
      // Log información de debugging
      console.log('Attempting to download valoraciones...');
      console.log('Token length:', token.length);
      console.log('Current origin:', window.location.origin);
      console.log('Target URL:', 'https://capialti.shop/api/students/professor/valoracion');
      
      const response = await StudentService.getProfessorValoracion();
      console.log('Response received:', response.status);
      
      // Crear un blob URL y descargar el archivo
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `valoraciones-profesores-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Download completed successfully');
    } catch (error: any) {
      console.error('Error downloading valoraciones:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        name: error.name,
        responseStatus: error.response?.status,
        requestStatus: error.request?.status,
        requestReadyState: error.request?.readyState
      });
      
      let errorMessage = 'Error al descargar las valoraciones';
      
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        // Verificar si es un problema de CORS
        const isCorsError = error.message.includes('CORS') || 
                           error.message.includes('Access-Control-Allow-Origin') ||
                           (error.request?.readyState === 4 && !error.response);
        
        // Verificar si es un timeout específico del gateway
        const errorStack = error.stack || '';
        const isGatewayTimeout = errorStack.includes('504') || 
                               error.request?.status === 504 ||
                               errorStack.includes('Gateway Time-out');
        
        if (isCorsError) {
          errorMessage = 'Error de CORS: El servidor no está permitiendo la conexión desde este dominio. Esto puede ser un problema temporal del servidor. Por favor, contacta al administrador o intenta nuevamente más tarde.';
        } else if (isGatewayTimeout) {
          errorMessage = 'Error: El servidor está procesando un reporte muy grande y el gateway se agotó el tiempo de espera. El archivo probablemente se generó correctamente en el servidor. Por favor, contacta al administrador para obtener el archivo o intenta nuevamente más tarde.';
        } else {
          errorMessage = 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.';
        }
      } else if (error.response?.status === 403) {
        errorMessage = 'Error: No tienes permisos para acceder a este recurso. Verifica tu sesión e intenta nuevamente.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Error: Sesión expirada. Por favor, inicia sesión nuevamente.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Error: El recurso solicitado no se encontró en el servidor.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor. Contacta al administrador.';
      } else if (error.response?.status) {
        errorMessage = `Error del servidor (${error.response.status}): ${error.response.statusText || 'Error desconocido'}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };


  return (
    <>
      {/* Overlay de carga que bloquea toda la interfaz */}
      {isDownloading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Generando valoraciones de profesores
            </h3>
            <p className="text-gray-600 mb-4">
              Este proceso puede tardar hasta 15 minutos debido al volumen de información.
              Por favor, no cierre la ventana ni navegue a otra página.
            </p>
            <div className="text-sm text-gray-500">
              Procesando datos...
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Listado de Usuarios</h2>
        <div className="flex space-x-2">

        </div>
      </div>
      
      <div className="mb-4">
        <button
          onClick={handleDownloadValoraciones}
          disabled={isDownloading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isDownloading
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          title="Este proceso puede tardar hasta 15 minutos debido al volumen de información"
        >
          {isDownloading ? 'Descargando... (Esto puede tardar varios minutos)' : 'Sacar valoraciones de cada profesor'}
        </button>
      </div>

      <div className="mt-6">
        {loading && <div className="text-center py-8 text-gray-500">Cargando Usuarios...</div>}
        {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
        {!loading && !error && (
          users.length > 0 ? (
            users.map(user => (
              // Pass the student object (matching StudentView) to StudentCard
              <UserCard key={user.id} user={user} onUserAction={fetchUsers} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No se encontraron usuarios
            </div>
          )
        )}
      </div>
    </div>
    </>
  );
}