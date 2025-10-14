import React, { useState } from 'react';
import EmailInput from '../components/Inputs/EmailInput';
import PasswordInput from '../components/Inputs/PasswordInput';
import { lightTheme } from '../constants/temas';

import logoImage from '../assets/images/logo.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const allValid = validEmail && validPassword;

  const handleLogin = () => {
    alert('Login realizado com sucesso!');
    // Aqui você chamaria sua API de autenticação
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">

      {/* Logo */}
      <img
        src={logoImage}
        alt="Logo do Sistema"
        className="w-36 h-36 mb-10 drop-shadow-lg"
      />

      {/* Inputs */}
      <div className="w-full max-w-md space-y-6 bg-white rounded-2xl shadow-lg p-8">
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

      {/* Botão Login */}
      <button
        onClick={handleLogin}
        disabled={!allValid}
        className={`mt-8 w-full max-w-md py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-md
          ${allValid
            ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
            : 'bg-gray-400 cursor-not-allowed'
          }`}
      >
        Entrar
      </button>
    </div>
  );
}
