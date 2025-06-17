import { useEffect } from "react";
import type { UsersResponse } from "../types/global";
import { UserCard } from "./UserCard";
interface ListUsersProps {
  users: UsersResponse[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
}
export const ListUsers = ({ users, loading, error, fetchUsers }: ListUsersProps) => {

  useEffect(() => {

  }, [fetchUsers]);


  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Listado de Usuarios</h2>
        <div className="flex space-x-2">

        </div>
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