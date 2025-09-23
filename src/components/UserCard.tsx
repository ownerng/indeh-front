import type { UsersResponse } from "../types/global";
import { PencilIcon, Trash, FileText } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../enums/UserRole";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { StudentService } from "../services/students.service";
import { useState } from "react";

interface UserCardProps {
  user: UsersResponse; // Asegúrate de que UsersResponse tenga la estructura correcta para el usuario individual
  onUserAction: () => Promise<void>; // Callback para cuando una acción en UserCard requiera refrescar la lista
}

export const UserCard = ({ user, onUserAction }: UserCardProps) => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [isDownloadingValoracion, setIsDownloadingValoracion] = useState(false);


  const updateStudent = () => {
    navigate(`/admin/new-user/${user.id}/update`)
  }

  const deleteStudent = async () => {
    try {
      const response  = await authService.deleteUserById(user.id);
      if(response === 200 || response === 201){
        await onUserAction(); 
      }
    } catch (error) {
      console.error('Error al borrar al studiante:', error);
      alert('Hubo un error al borrar al studiante. Inténtalo de nuevo más tarde.');
    }
  }

  const handleDownloadValoracionIndividual = async () => {
    try {
      setIsDownloadingValoracion(true);
      
      // Verificar si hay token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Error: No hay token de autorización. Por favor, inicia sesión nuevamente.');
        return;
      }
      
      console.log('Attempting to download valoracion for professor:', user.id);
      const response = await StudentService.getProfessorValoracionById(user.id);
      console.log('Response received:', response.status);
      
      // Crear un blob URL y descargar el archivo
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `valoracion-profesor-${user.username}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Download completed successfully');
    } catch (error: any) {
      console.error('Error downloading valoracion individual:', error);
      
      let errorMessage = 'Error al descargar la valoración del usuario';
      
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        const isCorsError = error.message.includes('CORS') || 
                           error.message.includes('Access-Control-Allow-Origin') ||
                           (error.request?.readyState === 4 && !error.response);
        
        const errorStack = error.stack || '';
        const isGatewayTimeout = errorStack.includes('504') || 
                               error.request?.status === 504 ||
                               errorStack.includes('Gateway Time-out');
        
        if (isCorsError) {
          errorMessage = 'Error de CORS: El servidor no está permitiendo la conexión. Contacta al administrador.';
        } else if (isGatewayTimeout) {
          errorMessage = 'Error: Tiempo de espera agotado. El reporte puede estar listo, contacta al administrador.';
        } else {
          errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
        }
      } else if (error.response?.status === 403) {
        errorMessage = 'Error: No tienes permisos para acceder a este recurso.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Error: Sesión expirada. Inicia sesión nuevamente.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Error: No se encontraron datos para este usuario.';
      }
      
      alert(errorMessage);
    } finally {
      setIsDownloadingValoracion(false);
    }
  };

  return (
    <>
      {/* Modal de carga para valoración individual */}
      {isDownloadingValoracion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4 text-center">
            <div className="flex justify-center mb-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
            <h3 className="text-md font-semibold text-gray-800 mb-2">
              Generando valoración del usuario
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Procesando datos de {user.username}...
            </p>
            <div className="text-xs text-gray-500">
              Este proceso es más rápido al ser individual
            </div>
          </div>
        </div>
      )}

    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-3 hover:shadow-lg transition-shadow">
      <div className="font-medium text-gray-800 w-1/3">{user.username}</div>
      <div className="text-gray-600 w-1/3 text-center font-medium">{user.role.toString()}</div>
      <div className="flex space-x-2 w-1/3 justify-end">
        {userRole === UserRole.EJECUTIVO && (
          <>
          <button onClick={updateStudent} className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors">
              <PencilIcon size={18} />
            </button>
          <button onClick={deleteStudent} className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors">
              <Trash size={18} />
            </button>
          {/* Botón de valoración individual - disponible para todos los usuarios cuando el usuario actual es EJECUTIVO */}
          <button 
            onClick={handleDownloadValoracionIndividual}
            disabled={isDownloadingValoracion}
            className={`p-2 rounded-md transition-colors ${
              isDownloadingValoracion
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
            title="Descargar valoración individual del usuario"
          >
            <FileText size={18} />
          </button>
          </>
        )}
        
      </div>
    </div>
    </>
  );
};