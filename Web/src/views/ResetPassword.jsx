import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  const [validPassword, setValidPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    // TODO: Validar token com backend
    if (!token) {
      setTokenValid(false);
      setMessage('Token inválido ou expirado');
    }
  }, [token]);

  useEffect(() => {
    setValidPassword(password.length >= 8);
    setPasswordsMatch(password === confirmPassword && password.length > 0);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validPassword) {
      setMessage('A senha deve ter pelo menos 8 caracteres');
      setIsSuccess(false);
      return;
    }

    if (!passwordsMatch) {
      setMessage('As senhas não coincidem');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // TODO: Implementar chamada para API de reset
      // await resetPassword(token, password);
      
      // Simulação temporária
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage('Senha redefinida com sucesso! Redirecionando...');
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/login-farmaceutico');
      }, 2000);
      
    } catch (error) {
      setMessage('Erro ao redefinir senha. Token pode ter expirado.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login-farmaceutico');
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Token Inválido</h1>
            <p className="text-gray-600 mb-6">
              O link de recuperação é inválido ou expirou. Solicite um novo link.
            </p>
            <button
              onClick={handleBackToLogin}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Voltar ao Login
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            Nova Senha
          </h1>
          <p className="text-gray-600 text-center text-sm">
            Digite sua nova senha de acesso
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Nova Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {password.length > 0 && !validPassword && (
                <p className="text-red-500 text-xs mt-1">Mínimo 8 caracteres</p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Digite a senha novamente"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-red-500 text-xs mt-1">Senhas não coincidem</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!validPassword || !passwordsMatch || loading}
              className={`w-full py-3 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-md
                ${validPassword && passwordsMatch && !loading
                  ? 'bg-blue-700 hover:bg-blue-800 hover:scale-105'
                  : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
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

        {/* Dicas de segurança */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 text-center">
            💡 Use uma senha forte com letras, números e símbolos
          </p>
        </div>
      </div>
    </div>
  );
}