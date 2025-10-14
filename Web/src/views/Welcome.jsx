import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/images/logo.png';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#f8fafc] text-gray-800 px-6">
      
      {/* Header com logo */}
      <div className="flex flex-col items-center mb-12">
        <img
          src={logoImage}
          alt="Logo"
          className="w-20 h-20 mb-4 drop-shadow-md"
        />
        <h1 className="text-3xl font-bold text-[#0284c7]">TecSim</h1>
        <p className="text-sm text-gray-500 mt-1 tracking-wide">
          Cuidando da sua saúde com tecnologia
        </p>
      </div>

      {/* Corpo da tela */}
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md text-center transition-transform hover:scale-[1.01] duration-300">
        <h2 className="text-2xl font-semibold mb-4">Bem-vindo 👋</h2>
        <p className="text-gray-500 mb-8">
          Faça login ou crie uma conta para continuar
        </p>

        {/* Botões */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 rounded-xl bg-[#0284c7] text-white font-semibold text-lg shadow-sm hover:bg-[#0369a1] hover:shadow-md transition-all duration-300"
          >
            Entrar
          </button>

          <button
            onClick={() => navigate('/register')}
            className="w-full py-3 rounded-xl border-2 border-[#0284c7] text-[#0284c7] font-semibold text-lg hover:bg-[#e0f2fe] transition-all duration-300"
          >
            Criar conta
          </button>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="mt-12 text-gray-400 text-xs text-center">
        <p>TecSim © 2025 — Todos os direitos reservados</p>
      </footer>
    </div>
  );
}
