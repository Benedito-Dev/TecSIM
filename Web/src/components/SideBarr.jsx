import React, { useState, useCallback } from "react";
import { 
  Home, 
  User, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X, 
  Pill, 
  FileText, 
  Clock,
  Settings,
  Users,
  Sun,
  Moon
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";

const ICON_SIZE = 20;
const MENU_ICON_SIZE = 22;
const SIDEBAR_WIDTH_OPEN = "w-60";
const SIDEBAR_WIDTH_CLOSED = "w-20";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { Logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const navItems = [
    { name: "Dashboard", icon: <Home size={ICON_SIZE} />, path: "/dashboard" },
    { name: "Chatbot", icon: <MessageSquare size={ICON_SIZE} />, path: "/chatbot" },
    { name: "Medicamentos", icon: <Pill size={ICON_SIZE} />, path: "/medicamentos" },
    { name: "Prescrições", icon: <FileText size={ICON_SIZE} />, path: "/prescricoes" },
    { name: "Lembretes", icon: <Clock size={ICON_SIZE} />, path: "/lembretes" },
    { name: "Clientes", icon: <Users size={ICON_SIZE} />, path: "/clientes" },
    { name: "Perfil", icon: <User size={ICON_SIZE} />, path: "/perfil" },
    { name: "Ajustes", icon: <Settings size={ICON_SIZE} />, path: "/ajustes" },
  ];

  const handleLogout = useCallback(async () => {
    try {
      if (typeof Logout !== 'function') {
        throw new Error('Logout function not available');
      }
      await Logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback: clear localStorage and redirect anyway
      try {
        localStorage.removeItem('@Auth:token');
        localStorage.removeItem('@Auth:user');
        localStorage.removeItem('@Auth:userType');
      } catch (storageError) {
        console.error('Failed to clear storage:', storageError);
      }
      navigate('/login');
    }
  }, [Logout, navigate]);

  return (
    <div
      className={`fixed top-20 left-0 h-[calc(100vh-5rem)] bg-blue-700 text-white shadow-lg flex flex-col transition-all duration-300 ease-in-out z-50 ${
        isOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED
      }`}
    >
      {/* Topo com botão de menu */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-blue-600">
        {isOpen && (
          <h1 className="text-2xl font-bold tracking-wide">TecSIM</h1>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-blue-800 transition-all"
        >
          {isOpen ? <X size={MENU_ICON_SIZE} /> : <Menu size={MENU_ICON_SIZE} />}
        </button>
      </div>

      {/* Links de navegação */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-900 text-white shadow-md"
                  : "hover:bg-blue-800 text-blue-100"
              }`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              {isOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout e Tema - FIXADO NO FINAL */}
      <div className="mt-auto p-4 border-t border-blue-600 bg-blue-700 space-y-2">
        {/* Botão de troca de tema */}
        <button 
          onClick={toggleTheme}
          className="flex items-center justify-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-blue-800 transition-all text-blue-100 hover:text-white font-medium"
        >
          {isDark ? <Sun size={ICON_SIZE} /> : <Moon size={ICON_SIZE} />}
          {isOpen && <span>{isDark ? 'Tema Claro' : 'Tema Escuro'}</span>}
        </button>
        
        {/* Botão de logout */}
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-600 transition-all text-red-100 hover:text-white font-medium"
        >
          <LogOut size={ICON_SIZE} />
          {isOpen && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
}