import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { LoginResponse } from '../types/global';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../enums/UserRole';
// Assuming you will have an authentication service similar to StudentService
// import { AuthService } from '../api'; // Placeholder import

export default function Login() {
  // State to hold the input values for username/email and password
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State to manage the loading state during the login process
  const [loading, setLoading] = useState(false);
  // State to hold any error messages from the login attempt
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  // Hook to programmatically navigate the user
  const navigate = useNavigate();

  // Function to handle the login form submission
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default browser form submission

    // Basic validation (optional, but good practice)
    if (!username || !password) {
      setError("Por favor, ingrese su usuario/email y contraseña.");
      return;
    }

    setLoading(true); // Start loading
    setError(null); // Clear previous errors

    try {
      // --- Placeholder for actual API login call ---
      // Replace this with your actual authentication service call
      // Example: const success = await AuthService.login(email, password);

      // Simulate an API call delay and a successful login
      const response = await authService.login(username, password);
      const data:LoginResponse = response.data;
      login(data.token, data.id, data.role); // 
      if (response.status === 200 || response.status === 201) {
            if( UserRole.EJECUTIVO === data.role) {
              navigate("/admin/home");
            } else if (UserRole.PROFESOR === data.role) {
              navigate("/teacher/students");
            }
      } else {
        // Simulate incorrect credentials
        setError("Credenciales inválidas. Por favor, intente de nuevo.");
      }

      // --- End of Placeholder ---

    } catch (err) {
      console.error("Login failed:", err);
      // Set a generic error message for unexpected API errors
      setError("Error al iniciar sesión. Por favor, intente más tarde.");
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    // Center the login form vertically and horizontally
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"> {/* Card styling */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleLogin}>
          {/* Email/Username Input */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Usuario 
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading} // Disable input while loading
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading} // Disable input while loading
            />
          </div>

          {/* Error Message Display */}
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : '' // Style for disabled state
              }`}
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Iniciando...' : 'Iniciar Sesión'} {/* Button text changes based on loading state */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}