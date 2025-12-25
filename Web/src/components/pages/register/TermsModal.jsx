import React from 'react';

const TermsModal = ({ showTerms, onCancel, onAccept }) => {
  if (!showTerms) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 className="text-lg font-bold mb-4">Termos de Uso</h3>
        <p className="text-sm text-gray-600 mb-4">
          Ao criar sua conta, você concorda com nossos termos de uso e política de privacidade.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;