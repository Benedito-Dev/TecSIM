import React, { useState } from "react";
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
  Users
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { Logout } = useAuth();

  const navItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Chatbot", icon: <MessageSquare size={20} />, path: "/chatbot" },
    { name: "Medicamentos", icon: <Pill size={20} />, path: "/medicamentos" },
    { name: "Prescrições", icon: <FileText size={20} />, path: "/prescricoes" },
    { name: "Lembretes", icon: <Clock size={20} />, path: "/lembretes" },
    { name: "Clientes", icon: <Users size={20} />, path: "/clientes" }, // ✅ NOVO ITEM ADICIONADO
    { name: "Perfil", icon: <User size={20} />, path: "/perfil" },
    { name: "Ajustes", icon: <Settings size={20} />, path: "/ajustes" },
  ];

  const handleLogout = () => {
    Logout();
    navigate('/login');
  };

  return (
    <div
      className={`fixed top-20 left-0 h-[calc(100vh-5rem)] bg-blue-700 text-white shadow-lg flex flex-col transition-all duration-300 ease-in-out z-50 ${
        isOpen ? "w-60" : "w-20"
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
          {isOpen ? <X size={22} /> : <Menu size={22} />}
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

      {/* Logout - FIXADO NO FINAL */}
      <div className="mt-auto p-4 border-t border-blue-600 bg-blue-700">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-600 transition-all text-red-100 hover:text-white font-medium"
        >
          <LogOut size={20} />
          {isOpen && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
}