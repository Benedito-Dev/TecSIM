import React, { useState } from 'react';
import { lightTheme } from '../constants/temas';
import { useRegister } from '../context/RegisterContext';
import { useNavigate } from 'react-router-dom';

import logoImage from '../assets/images/logo.png';

import { requestOtp, verifyOtp } from '../services/auth/otpService';
import { createPaciente } from '../services/pacienteService';

export default function ConfirmCodePage() {
  const [code, setCode] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false)

  const { setRegisterData, registerData } = useRegister();
  const navigate = useNavigate();

  console.log(registerData)

  const handleChange = (e) => {
    const numeric = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(numeric);
    setIsValid(numeric.length === 6);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const verified = await verifyOtp(registerData.email, code)
      if (!verified) throw new Error('Codigo invalido');

      const result = await createPaciente(registerData)

      if (result?.data.id) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigate.replace('Login');
      } else {
        throw new Error('Erro inesperado ao criar paciente. Tente novamente.');
      }
    } catch (error) {
      alert('Erro', error.message || 'Ocorreu um erro. Tente novamente.');
      setCode('')
    } finally {
      setLoading(false)
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    const response = await requestOtp(registerData.email)
    alert('Novo código enviado para o seu e-mail!');
    // Aqui você chamaria sua API para reenviar o código
  };

  // Contagem regressiva
  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4">

      {/* Logo */}
      <img
        src={logoImage}
        alt="Logo do Sistema"
        className="w-32 h-32 mb-10 drop-shadow-md"
      />

      {/* Card Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-6">

        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Confirmação de Conta
        </h1>
        <p className="text-gray-600 text-center text-sm">
          Digite o código de 6 dígitos enviado para o seu e-mail
        </p>

        {/* Campo de Código */}
        <input
          type="text"
          value={code}
          onChange={handleChange}
          placeholder="Ex: 123456"
          className={`w-40 text-center text-2xl tracking-widest font-semibold py-3 border-2 rounded-lg transition-all outline-none
            ${isValid ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 focus:border-blue-500'}
          `}
        />

        {/* Botão Confirmar */}
        <button
          onClick={handleConfirm}
          disabled={!isValid}
          className={`w-full py-3 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-md
            ${isValid
              ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
              : 'bg-gray-400 cursor-not-allowed'}
          `}
        >
          Confirmar
        </button>

        {/* Link Reenviar */}
        <button
          onClick={handleResend}
          disabled={resendTimer > 0}
          className={`text-sm font-medium transition ${
            resendTimer > 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-600 hover:underline'
          }`}
        >
          {resendTimer > 0
            ? `Reenviar código em ${resendTimer}s`
            : 'Reenviar código'}
        </button>
      </div>
    </div>
  );
}
