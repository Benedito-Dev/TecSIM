import React from 'react';

const SubmitButton = ({ allValid, onCreateAccount }) => {
  return (
    <button
      onClick={onCreateAccount}
      disabled={!allValid}
      className={`
        mt-10 w-full py-4 rounded-lg font-bold text-white text-xl 
        border-2 border-gray-800 
        transition-all duration-200 transform
        focus:outline-none focus:ring-4 focus:ring-sky-300
        ${allValid
          ? 'bg-sky-600 hover:bg-sky-700 shadow-custom-button hover:translate-x-0.5 hover:translate-y-0.5'
          : 'bg-gray-400 cursor-not-allowed border-gray-500'
        }
      `}
    >
      CRIAR MINHA CONTA
    </button>
  );
};

export default SubmitButton;