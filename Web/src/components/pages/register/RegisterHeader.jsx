import React from 'react';

const RegisterHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo Estilizada (Círculo Azul) */}
      <div className="mx-auto w-20 h-20 mb-3 flex items-center justify-center bg-blue-500 rounded-full">
        <span className="text-white text-2xl font-bold">TS</span>
      </div>
      
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
        Crie Sua Conta de Saúde
      </h1>
      <p className="text-gray-600 mt-1 text-lg">
        Insira seus dados para começar a usar a plataforma.
      </p>
    </div>
  );
};

export default RegisterHeader;