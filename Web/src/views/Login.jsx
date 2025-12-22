import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailInput from '../components/Inputs/EmailInput';
import PasswordInput from '../components/Inputs/PasswordInput';
import { lightTheme } from '../constants/temas';
import { useAuth } from '../hooks/useAuth';

import logoImage from '../assets/images/logo.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('paciente');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const allValid = validEmail && validPassword;
  const timerRef = useRef(null);

  const navigate = useNavigate();
  const { login: secureLogin } = useAuth();

  useEffect(() => {
    console.log('✅ LoginPage montou');
    
    // Contador regressivo do cooldown
    if (cooldown > 0) {
      timerRef.current = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => {
      console.log('🔄 LoginPage desmontou');
      clearTimeout(timerRef.current);
    };
  }, [cooldown]);

  const handleLogin = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log(`🟡 handleLogin chamado - ${userType.toUpperCase()}`);

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
      console.log(`🟡 Fazendo login seguro como ${userType.toUpperCase()}...`);
      
      // Login com funcionalidade "lembrar-me"
      const response = await secureLogin(email, password, userType, rememberMe);
      
      console.log(`✅ Login de ${userType} realizado com sucesso`);

      setSuccessMessage('Login realizado com sucesso!');
      
      console.log('🟡 Navegando para dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      console.log(`🔴 Erro no login de ${userType}:`, error);
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
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-blue-50 to-blue-100 relative">

      {/* Faixa colorida no topo */}
      <div className={`absolute top-0 left-0 w-full h-40 rounded-b-3xl shadow-md z-0 ${
        userType === 'enfermeiro' ? 'bg-blue-700' : 'bg-green-600'
      }`}></div>

      {/* Container principal */}
      <div className="flex flex-col items-center w-full max-w-md z-10 mt-16 px-4">

        {/* Logo */}
        <div className={`bg-white p-4 rounded-full shadow-lg mb-6 border-2 ${
          userType === 'enfermeiro' ? 'border-blue-200' : 'border-green-200'
        }`}>
          <img
            src={logoImage}
            alt="Logo do Sistema"
            className="w-28 h-28"
          />
        </div>

        {/* Card de Inputs */}
        <div className={`w-full bg-white rounded-2xl shadow-lg p-12 flex flex-col items-center space-y-6 border ${
          userType === 'enfermeiro' ? 'border-blue-100' : 'border-green-100'
        }`}>
          <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-4">
            {userType === 'enfermeiro' ? 'Área do Enfermeiro' : 'Área do Paciente'}
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Entre com seu e-mail e senha para acessar o sistema
          </p>

          {/* Seletor de tipo de usuário */}
          <div className="w-full">
            <label className={`block text-sm font-medium mb-2 ${
              userType === 'enfermeiro' ? 'text-blue-700' : 'text-green-700'
            }`}>
              Tipo de Usuário
            </label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                userType === 'enfermeiro' 
                  ? 'border-blue-200 focus:border-blue-500 focus:ring-blue-200' 
                  : 'border-green-200 focus:border-green-500 focus:ring-green-200'
              }`}
            >
              <option value="paciente">Paciente</option>
              <option value="enfermeiro">Enfermeiro</option>
            </select>
          </div>

          <div className="w-full">
            <label className={`block text-sm font-medium mb-2 ${
              userType === 'enfermeiro' ? 'text-blue-700' : 'text-green-700'
            }`}>
              {userType === 'enfermeiro' ? 'E-mail Profissional' : 'E-mail'}
            </label>
            <EmailInput
              value={email}
              onChangeText={setEmail}
              onValidityChange={setValidEmail}
              theme={lightTheme}
              placeholder={userType === 'enfermeiro' ? 'seu.email@hospital.com' : 'seu@email.com'}
            />
          </div>

          <div className="w-full">
            <label className={`block text-sm font-medium mb-2 ${
              userType === 'enfermeiro' ? 'text-blue-700' : 'text-green-700'
            }`}>
              Senha
            </label>
            <PasswordInput
              onChangeText={setPassword}
              onValidityChange={setValidPassword}
              theme={lightTheme}
              placeholder="Sua senha de acesso"
            />
          </div>

          {/* Checkbox Lembrar-me */}
          <div className="w-full">
            <div className={`flex items-center p-4 rounded-lg border ${
              userType === 'enfermeiro' 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={`w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-2 ${
                  userType === 'enfermeiro' 
                    ? 'text-blue-600 focus:ring-blue-500' 
                    : 'text-green-600 focus:ring-green-500'
                }`}
              />
              <label htmlFor="rememberMe" className="ml-3 flex-1">
                <span className={`text-sm font-medium ${
                  userType === 'enfermeiro' ? 'text-blue-700' : 'text-green-700'
                }`}>
                  Lembrar-me por 30 dias
                </span>
                <p className={`text-xs mt-1 ${
                  userType === 'enfermeiro' ? 'text-blue-600' : 'text-green-600'
                }`}>
                  ⚠️ Use apenas em dispositivos pessoais e seguros
                </p>
              </label>
            </div>
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
              ? (userType === 'enfermeiro' 
                  ? 'bg-blue-700 hover:bg-blue-800 hover:scale-105' 
                  : 'bg-green-600 hover:bg-green-700 hover:scale-105')
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          {loading ? 'Entrando...' : `Entrar como ${userType === 'enfermeiro' ? 'Enfermeiro' : 'Paciente'}`}
        </button>


      </div>
    </div>
  );
}