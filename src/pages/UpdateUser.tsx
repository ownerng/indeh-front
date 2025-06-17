import { useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import { UserRole } from '../enums/UserRole';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateUser() {
    const { id } = useParams();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.PROFESOR); // Default to PROFESOR
    const navigate = useNavigate();
    // State to manage the loading state during the creation process
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const res = await authService.getUserById(Number(id));
                setUsername(res.username);
                setRole(res.role);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStudentData();
    }, [id]);
    // Function to handle the create user form submission
    const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default browser form submission

        // Basic validation
        if (!username) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos requeridos',
                text: 'Por favor, ingrese el usuario y contraseña.',
            });
            return;
        }


        setLoading(true); // Start loading

        try {
            // API call to create user
            const response = await authService.updateUserById(Number(id), {
                username,
                role,
                password
            });
            if (response === 200 || response === 201) {
                // Show success alert
                await Swal.fire({
                    icon: 'success',
                    title: '¡Usuario actualizado!',
                    text: 'El usuario se ha actualizado exitosamente.',
                });
                // Clear form
                setUsername('');
                setRole(UserRole.PROFESOR);
                navigate('/admin/new-user');
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al actualizar el usuario. Por favor, intente de nuevo.',
                });
            }

        } catch (err: any) {
            console.error("update user failed:", err);

            // Handle specific error messages with SweetAlert2
            let errorMessage = "Error al actualizar el usuario. Por favor, intente más tarde.";

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.status === 409) {
                errorMessage = "El usuario ya existe. Por favor, elija otro nombre de usuario.";
            }

            await Swal.fire({
                icon: 'error',
                title: 'Error al actualizar usuario',
                text: errorMessage,
            });
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    return (
        // Center the create user form vertically and horizontally
        <div className="flex flex-col min-h-screen bg-white">
            <div className='flex items-center justify-center '>
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm mb-5">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Actualizar Usuario
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

                         <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                                Contraseña *
                            </label>
                            <input
                                type="text"
                                id="password"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa el nombre de usuario"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                minLength={3}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="mb-4">
                            <button
                                type="submit"
                                className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                disabled={loading}
                            >
                                {loading ? 'Actualizando...' : 'Actualizar Usuario'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}