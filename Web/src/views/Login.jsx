import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getCurrentUser } from '@/services/auth/authService';
import { useAuth } from '../context/UserContext';

export default function LoginFarmaceuticoPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const allValid = validEmail && validPassword;
  const timerRef = useRef(null);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    console.log('✅ LoginFarmaceuticoPage montou');
    
    // Contador regressivo do cooldown
    if (cooldown > 0) {
      timerRef.current = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => {
      console.log('🔄 LoginFarmaceuticoPage desmontou');
      clearTimeout(timerRef.current);
    };
  }, [cooldown]);

  const handleLogin = async (e) => {
    // Previne qualquer comportamento padrão
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('🟡 handleLogin chamado - FARMACEUTICO');

    if (!allValid) {
      console.log('🔴 Campos inválidos');
      setErrorMessage('Erro: preencha todos os campos corretamente');
      return;
    }

    if (cooldown > 0) {
      console.log('⏰ Cooldown ativo');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      console.log('🟡 Fazendo requisição de login como FARMACEUTICO...');
      
      // Login específico para farmaceuticos
      const response = await login(email, password, 'farmaceutico');
      const userData = await getCurrentUser();
      
      // Verifica se o usuário retornado é realmente um farmaceutico
      if (userData.tipo !== 'farmaceutico') {
        throw new Error('Acesso permitido apenas para farmaceuticos');
      }
      
      setUser(userData);

      console.log('✅ Login de farmaceutico bem-sucedido:', response);

      setSuccessMessage('Login realizado com sucesso!');
      
      console.log('🟡 Navegando para dashboard de farmaceutico...');
      setTimeout(() => {
        navigate('/dashboard'); // Rota específica para farmaceuticos
      }, 1000);

    } catch (error) {
      console.log('🔴 Erro no login de farmaceutico:', error);
      let msg = error.message || 'Erro ao realizar login.';
      
      // Tratamento específico para erro de tipo de usuário
      if (msg.includes('farmaceutico') || msg.includes('tipo') || msg.includes('permitido')) {
        msg = 'Acesso permitido apenas para farmaceuticos cadastrados.';
      }
      
      let seconds = error.cooldown || 10;

      setCooldown(seconds);
      msg += ` Aguarde ${seconds} segundo${seconds > 1 ? 's' : ''} antes de tentar novamente.`;
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Função para redirecionar para login de paciente
  const handleRedirectToPaciente = () => {
    navigate('/login'); // Rota padrão de login (pacientes)
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-blue-50 to-blue-100 relative">

      {/* Faixa azul escuro no topo (diferente do paciente) */}
      <div className="absolute top-0 left-0 w-full h-40 bg-blue-700 rounded-b-3xl shadow-md z-0"></div>

      {/* Container principal */}
      <div className="flex flex-col items-center w-full max-w-md z-10 mt-16 px-4">

        {/* Logo */}
        <div className="bg-white p-4 rounded-full shadow-lg mb-6 border-2 border-blue-200">
          <div className="w-28 h-28 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-3xl font-bold">TS</span>
          </div>
        </div>

        {/* Card de Inputs */}
        <div className="w-full bg-white rounded-2xl shadow-lg p-12 flex flex-col items-center space-y-6 border border-blue-100">
          <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-4">
            Área do Farmacêutico
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Entre com seu e-mail e senha para acessar o sistema
          </p>

          <div className="w-full">
            <label className="block text-sm font-medium text-blue-700 mb-2">
              E-mail Profissional
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidEmail(e.target.value.includes('@'));
              }}
              placeholder="seu.email@hospital.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-blue-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValidPassword(e.target.value.length >= 6);
              }}
              placeholder="Sua senha de acesso"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Mensagem de sucesso */}
        {successMessage && (
          <div className="mt-4 w-full max-w-md bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {/* Mensagem de erro */}
        {errorMessage && (
          <div className="mt-4 w-full max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        {/* Mensagem de cooldown */}
        {cooldown > 0 && (
          <p className="text-red-500 mt-4 text-center">
            ⏰ Aguarde {cooldown} segundo{cooldown > 1 ? 's' : ''} antes de tentar novamente
          </p>
        )}

        {/* Botão Login */}
        <button
          onClick={handleLogin}
          disabled={!allValid || cooldown > 0 || loading}
          className={`mt-8 w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-md
            ${allValid && cooldown === 0 && !loading
              ? 'bg-blue-700 hover:bg-blue-800 hover:scale-105'
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          {loading ? 'Entrando...' : 'Entrar como Farmacêutico'}
        </button>

        {/* Link para login de paciente */}
        <p className="mt-6 text-gray-700 text-sm">
          É paciente?{' '}
          <button 
            onClick={handleRedirectToPaciente}
            className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            Faça login como paciente
          </button>
        </p>

        {/* Informação adicional para farmaceuticos */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 text-center">
            💡 Acesso restrito a farmacêuticos cadastrados no sistema
          </p>
        </div>
      </div>
    </div>
  );
}