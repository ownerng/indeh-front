import { useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import type {  UsersResponse } from '../types/global';
import { UserRole } from '../enums/UserRole';
import Swal from 'sweetalert2';
import { ListUsers } from '../components/ListUsers';
import { useAuth } from '../context/AuthContext';

export default function CreateUser() {
  // State to hold the input values
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PROFESOR); // Default to PROFESOR

  // --- NUEVOS ESTADOS Y FUNCIONES PARA EL LISTADO DE USUARIOS ---
  const [users, setUsers] = useState<UsersResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true); // Renamed for clarity
  const [errorUsers, setErrorUsers] = useState<string | null>(null); 
  const { userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setErrorUsers(null);
      // Condiciona la llamada si userRole es EJECUTIVO (o según tu lógica de negocio)
      if (userRole === UserRole.EJECUTIVO) {
        const usersData = await authService.listAllUsers();
        setUsers(usersData);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setErrorUsers("Error al cargar los usuarios.");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Cargar usuarios la primera vez que el componente se monta
  }, [userRole]); // Dependencia userRole si la lista depende de ella
  // --- FIN NUEVOS ESTADOS Y FUNCIONES ---


  // Function to handle the create user form submission
  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default browser form submission

    // Basic validation
    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor, ingrese el usuario y contraseña.',
      });
      return;
    }

    setLoading(true); // Start loading for creation

    try {
      // API call to create user
      const response = await authService.createUser({
        username,
        password,
        role
      });

      if (response.status === 200 || response.status === 201) {
        // Show success alert
        await Swal.fire({
          icon: 'success',
          title: '¡Usuario creado!',
          text: 'El usuario se ha creado exitosamente.',
        });

        // Clear form
        setUsername('');
        setPassword('');
        setRole(UserRole.PROFESOR);

        // --- EN VEZ DE recargar toda la página, recarga solo la lista de usuarios ---
        await fetchUsers(); // Vuelve a cargar la lista de usuarios
        // --- FIN CAMBIO ---

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al crear el usuario. Por favor, intente de nuevo.',
        });
      }

    } catch (err: any) {
      console.error("Create user failed:", err);

      // Handle specific error messages with SweetAlert2
      let errorMessage = "Error al crear el usuario. Por favor, intente más tarde.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 409) {
        errorMessage = "El usuario ya existe. Por favor, elija otro nombre de usuario.";
      }

      Swal.fire({
        icon: 'error',
        title: 'Error al crear usuario',
        text: errorMessage,
      });
    } finally {
      setLoading(false); // Stop loading for creation
    }
  };

  return (
    // Center the create user form vertically and horizontally
    <div className="flex flex-col min-h-screen bg-white">
      <div className='flex items-center justify-center '>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm mb-5">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Crear Usuario
          </h2>

          <form onSubmit={handleCreateUser}>
            {/* Username Input */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                Usuario *
              </label>
              <input
                type="text"
                id="username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa el nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                minLength={3}
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Contraseña *
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa la contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                minLength={6}
                required
              />
            </div>

            {/* Role Select */}
            <div className="mb-6">
              <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                Rol *
              </label>
              <select
                id="role"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                disabled={loading}
                required
              >
                <option value={UserRole.PROFESOR}>Profesor</option>
                <option value={UserRole.EJECUTIVO}>Ejecutivo</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="mb-4">
              <button
                type="submit"
                className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ListUsers loading={loadingUsers} error={errorUsers} users={users} fetchUsers={fetchUsers}/>

    </div>
  );
}