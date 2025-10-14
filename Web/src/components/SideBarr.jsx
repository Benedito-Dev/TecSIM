import React, { useState } from "react";
import { Home, User, MessageSquare, LogOut, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Chatbot", icon: <MessageSquare size={20} />, path: "/chatbot" },
    { name: "Perfil", icon: <User size={20} />, path: "/perfil" },
  ];

  return (
    <div
      className={`fixed top-20 left-0 h-full bg-blue-700 text-white shadow-lg flex flex-col transition-all duration-300 ease-in-out ${
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

      {/* Links */}
      <nav className="flex-1 p-3 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-900 text-white"
                  : "hover:bg-blue-800 text-blue-100"
              }`}
            >
              {item.icon}
              {isOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-600">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-blue-800 transition-all">
          <LogOut size={20} />
          {isOpen && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
}
