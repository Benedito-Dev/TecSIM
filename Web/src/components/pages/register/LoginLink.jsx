import React from 'react';

const LoginLink = () => {
  return (
    <div className="text-center mt-6">
      <p className="text-gray-700">
        Já possui uma conta?{' '}
        <a href="/login" className="font-bold text-sky-600 hover:text-sky-800 hover:underline transition-colors">
          Acesse aqui
        </a>
      </p>
    </div>
  );
};

export default LoginLink;