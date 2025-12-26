import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validEmail) {
      setMessage('Por favor, insira um e-mail válido');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // TODO: Implementar chamada para API de recuperação
      // await forgotPassword(email);
      
      // Simulação temporária
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage('Se este e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.');
      setIsSuccess(true);
    } catch (error) {
      setMessage('Erro ao processar solicitação. Tente novamente.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login-farmaceutico');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-blue-50 to-blue-100 relative">
      
      {/* Faixa azul escuro no topo */}
      <div className="absolute top-0 left-0 w-full h-40 bg-blue-700 rounded-b-3xl shadow-md z-0"></div>

      {/* Container principal */}
      <div className="flex flex-col items-center w-full max-w-md z-10 mt-16 px-4">

        {/* Logo */}
        <div className="bg-white p-4 rounded-full shadow-lg mb-6 border-2 border-blue-200">
          <div className="w-28 h-28 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-3xl font-bold">TS</span>
          </div>
        </div>

        {/* Card principal */}
        <div className="w-full bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-6 border border-blue-100">
          <h1 className="text-2xl font-extrabold text-gray-900 text-center">
            Recuperar Senha
          </h1>
          <p className="text-gray-600 text-center text-sm">
            Digite seu e-mail profissional para receber instruções de recuperação
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-blue-700 mb-2">
                E-mail Profissional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidEmail(e.target.value.includes('@') && e.target.value.length > 5);
                }}
                placeholder="seu.email@hospital.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!validEmail || loading}
              className={`w-full py-3 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-md
                ${validEmail && !loading
                  ? 'bg-blue-700 hover:bg-blue-800 hover:scale-105'
                  : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
              {loading ? 'Enviando...' : 'Enviar Instruções'}
            </button>
          </form>
        </div>

        {/* Mensagem de feedback */}
        {message && (
          <div className={`mt-4 w-full max-w-md px-4 py-3 rounded relative ${
            isSuccess 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            <span className="block sm:inline text-sm">{message}</span>
          </div>
        )}

        {/* Botão voltar */}
        <button
          onClick={handleBackToLogin}
          className="mt-6 text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm"
        >
          ← Voltar ao Login
        </button>

        {/* Informação de segurança */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 text-center">
            🔒 Por segurança, só enviamos e-mails para farmacêuticos cadastrados
          </p>
        </div>
      </div>
    </div>
  );
}