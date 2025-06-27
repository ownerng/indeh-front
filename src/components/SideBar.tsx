import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../enums/UserRole";
import { useAuth } from "../context/AuthContext";

// Tipo para los elementos del menú
interface MenuItem {
  label: string;
  icon: string;
  path?: string;
  action?: () => void;
}

interface SidebarProps {
  userRole: UserRole;
}

export default function Sidebar({ userRole}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  // Función para manejar logout
  const handleLogout = () => {
    logout(); 
    navigate("/");
  };

  // Configuración de menús según el rol
  const getMenuItems = (): MenuItem[] => {
    switch (userRole) {
      case UserRole.EJECUTIVO:
        return [
          {
            label: "Crear usuario",
            icon: "👨‍🏫",
            path: "/admin/new-user"
          },
          {
            label: "Asignaturas",
            icon: "📚",
            path: "/admin/new-subject"
          },
          {
            label: "Crear Estudiante",
            icon: "👨‍🎓",
            path: "/admin/new-student"
          },
          {
            label: "Boletín del Estudiante",
            icon: "📄",
            path: "/admin/home"
          },
          {
            label: "Cerrar Sesión",
            icon: "🚪",
            action: handleLogout
          }
        ];
      
      case UserRole.PROFESOR:
        return [
          {
            label: "Listar Estudiantes",
            icon: "👥",
            path: "/teacher/students"
          },
          {
            label: "Nota Corte 1",
            icon: "📝",
            path: "/teacher/student/corte/1"
          },
          {
            label: "Nota Corte 2",
            icon: "📝",
            path: "/teacher/student/corte/2"
          },
          {
            label: "Nota Corte 3",
            icon: "📝",
            path: "/teacher/student/corte/3"
          },
          {
            label: "Cerrar Sesión",
            icon: "🚪",
            action: handleLogout
          }
        ];
      
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleMenuClick = (item: MenuItem) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className={`bg-gray-800 text-white min-h-screen transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col`}>
      
      {/* Header del sidebar */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold">INDEH</h2>
              <p className="text-sm text-gray-300 capitalize">{userRole.toLowerCase()}</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      </div>


      {/* Menú de navegación */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center space-x-3 p-3 rounded-md hover:bg-gray-700 transition-colors text-left ${
                  item.label === "Cerrar Sesión" ? 'mt-auto border-t border-gray-700 pt-4' : ''
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer del sidebar */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            © 2025 INDEH
          </p>
        </div>
      )}
    </div>
  );
}