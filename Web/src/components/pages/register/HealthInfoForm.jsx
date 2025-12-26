import React from 'react';

const HealthInfoForm = ({ formData, updateField, updateValidation }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Peso (kg)
        </label>
        <input
          type="number"
          value={formData.peso_kg}
          onChange={(e) => {
            updateField('peso_kg', e.target.value);
            updateValidation('validWeight', e.target.value > 0);
          }}
          placeholder="Ex: 70"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Data de Nascimento
        </label>
        <input
          type="date"
          value={formData.data_nascimento}
          onChange={(e) => {
            updateField('data_nascimento', e.target.value);
            updateValidation('validDate', !!e.target.value);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Gênero
        </label>
        <select
          value={formData.genero}
          onChange={(e) => {
            updateField('genero', e.target.value);
            updateValidation('validGender', !!e.target.value);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione</option>
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
          <option value="outro">Outro</option>
        </select>
      </div>
    </div>
  );
};

export default HealthInfoForm;