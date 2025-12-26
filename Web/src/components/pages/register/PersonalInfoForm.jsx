import React from 'react';

const PersonalInfoForm = ({ formData, updateField, updateValidation }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nome Completo
        </label>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) => updateField('nome', e.target.value)}
          placeholder="Seu nome"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          CPF
        </label>
        <input
          type="text"
          value={formData.cpf}
          onChange={(e) => {
            updateField('cpf', e.target.value);
            updateValidation('validCpf', e.target.value.length >= 11);
          }}
          placeholder="000.000.000-00"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => {
            updateField('email', e.target.value);
            updateValidation('validEmail', e.target.value.includes('@'));
          }}
          placeholder="seu@email.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Senha
        </label>
        <input
          type="password"
          value={formData.senha}
          onChange={(e) => {
            updateField('senha', e.target.value);
            updateValidation('validPassword', e.target.value.length >= 6);
          }}
          placeholder="Mínimo 6 caracteres"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;