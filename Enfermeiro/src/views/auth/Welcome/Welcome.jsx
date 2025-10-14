import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../../assets/images/AuthWelcome/Image-Background.png';
import logoImage from '../../../assets/images/logo.png';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen w-[100vw] bg-red-200">
      {/* Imagem de topo */}
      <div className="w-[100vw] bg-[#00acd2] relative">
        <img
          src={backgroundImage}
          alt="Background"
          className="w-[100vw] opacity-50 object-cover h-[45vh]"
        />
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col items-center pt-5 flex-1">
        {/* Logo */}
        <div className="w-40 h-40 mt-[-50] mb-2 bg-white p-2 rounded-2xl z-10 flex items-center justify-center">
          <img src={logoImage} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
        </div>

        {/* Subtítulos */}
        <p className="text-gray-600 text-sm">assistente de saúde</p>
        <p className="text-gray-600 text-sm font-bold mb-5">inteligente</p>

        {/* Botão Login */}
        <button
          onClick={() => navigate('/login')}
          className="bg-[#0097b2] py-3 px-20 rounded-2xl mt-10 text-white font-bold text-lg text-center"
        >
          Login
        </button>

        {/* Botão Criar conta */}
        <button
          onClick={() => navigate('/register')}
          className="border border-[#0097b2] py-2.5 px-14 rounded-2xl mt-2 text-[#0097b2] font-bold text-lg text-center"
        >
          Criar conta
        </button>
      </div>
    </div>
  );
}
