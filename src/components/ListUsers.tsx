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

  const handleDownloadValoraciones = async () => {
    try {
      setIsDownloading(true);
      const response = await StudentService.getProfessorValoracion();
      
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
    } catch (error) {
      console.error('Error downloading valoraciones:', error);
      alert('Error al descargar las valoraciones');
    } finally {
      setIsDownloading(false);
    }
  };


  return (
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
        >
          {isDownloading ? 'Descargando...' : 'Sacar valoraciones de cada profesor'}
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
  );
}