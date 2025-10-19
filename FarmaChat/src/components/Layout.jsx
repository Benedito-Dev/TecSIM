import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/clientes', label: 'Clientes', icon: '👥' },
    { path: '/protocolos', label: 'Protocolos', icon: '📋' },
    { path: '/alertas', label: 'Alertas', icon: '🚨' },
    { path: '/chat', label: 'Chat IA', icon: '🤖' },
    { path: '/estatisticas', label: 'Estatísticas', icon: '📈' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 pague-menos-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-pague-azul-700">Pague Menos</h1>
                  <p className="text-xs text-pague-vermelho-600 font-medium">FarmaChat</p>
                </div>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-600">Pague Menos • Protocolo de Cuidado Contínuo</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Farmacêutico:</span>
              <span className="text-sm font-medium text-gray-900">Ana Silva</span>
              <div className="w-8 h-8 pague-menos-gradient rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AS</span>
              </div>
            </div>
          </div>
          
          {/* Navegação */}
          <nav className="flex space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  location.pathname === item.path
                    ? 'border-pague-azul-500 text-pague-azul-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                FarmaChat © 2024 - Transformando o cuidado farmacêutico no Brasil
              </p>
              <p className="text-xs text-gray-500 mt-1">
                "O protocolo que pode mudar o cuidado no Brasil"
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-xs text-gray-500">Versão 1.0</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">Suporte 24/7</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;