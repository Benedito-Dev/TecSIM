import React from 'react';
import { User } from 'lucide-react';

const CustomerInfo = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6" style={{ color: '#111827' }}>
      <div className="flex items-center gap-3 mb-4">
        <User className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Dados Pessoais</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
            Nome Completo *
          </label>
          <input
            type="text"
            value={data.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite seu nome completo"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
            CPF *
          </label>
          <input
            type="text"
            value={data.cpf}
            onChange={(e) => handleChange('cpf', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="000.000.000-00"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
            E-mail *
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="exemplo@email.com"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
            Telefone *
          </label>
          <input
            type="tel"
            value={data.telefone}
            onChange={(e) => handleChange('telefone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="(00) 00000-0000"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;