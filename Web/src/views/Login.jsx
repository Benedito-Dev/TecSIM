import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailInput from '../components/Inputs/EmailInput';
import PasswordInput from '../components/Inputs/PasswordInput';
import { lightTheme } from '../constants/temas';

import logoImage from '../assets/images/logo.png';
import { login } from '../services/auth/authService';

export default function LoginPage() {
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

  useEffect(() => {
    // Contador regressivo do cooldown
    if (cooldown > 0) {
      timerRef.current = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [cooldown]);

  // Limpar mensagens após alguns segundos
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  const handleLogin = async () => {
    if (!allValid) {
      setErrorMessage('Erro: preencha todos os campos corretamente');
      return;
    }

    if (cooldown > 0) return;

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await login(email, password);
      console.log(response);

      // Se chegou aqui, login foi bem-sucedido
      setSuccessMessage('Login realizado com sucesso!');
      
      // Navega após um breve delay para mostrar a mensagem
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      let msg = error.message || 'Erro ao realizar login.';
      let seconds = error.cooldown || 10;

      setCooldown(seconds);

      msg += ` Aguarde ${seconds} segundo${seconds > 1 ? 's' : ''} antes de tentar novamente.`;
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-gray-50 to-gray-100 relative">

      {/* Faixa azul no topo */}
      <div className="absolute top-0 left-0 w-full h-40 bg-sky-600 rounded-b-3xl shadow-md z-0"></div>

      {/* Container principal */}
      <div className="flex flex-col items-center w-full max-w-md z-10 mt-16 px-4">

        {/* Logo */}
        <div className="bg-white p-4 rounded-full shadow-lg mb-6">
          <img
            src={logoImage}
            alt="Logo do Sistema"
            className="w-28 h-28"
          />
        </div>

        {/* Card de Inputs */}
        <div className="w-full bg-white rounded-2xl shadow-lg p-12 flex flex-col items-center space-y-6">
          <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-4">
            Bem-vindo de volta
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Entre com seu e-mail e senha para continuar
          </p>

          <EmailInput
            value={email}
            onChangeText={setEmail}
            onValidityChange={setValidEmail}
            theme={lightTheme}
          />

          <PasswordInput
            onChangeText={setPassword}
            onValidityChange={setValidPassword}
            theme={lightTheme}
          />
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
              ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        {/* Link para Registro */}
        <p className="mt-6 text-gray-700 text-sm">
          Não tem conta?{' '}
          <button 
            onClick={() => navigate('/register')}
            className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            Cadastre-se aqui
          </button>
        </p>
      </div>
    </div>
  );
}