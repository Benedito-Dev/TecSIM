import React from 'react';
import { MapPin } from 'lucide-react';

const DeliveryInfo = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6" style={{ color: '#111827' }}>
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Endereço de Entrega</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
            CEP *
          </label>
          <input
            type="text"
            value={data.cep}
            onChange={(e) => handleChange('cep', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="00000-000"
            required
          />
        </div>
        
        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
            Número *
          </label>
          <input
            type="text"
            value={data.numero}
            onChange={(e) => handleChange('numero', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="123"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
            Endereço *
          </label>
          <input
            type="text"
            value={data.endereco}
            onChange={(e) => handleChange('endereco', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Rua, Avenida, etc."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
            Complemento
          </label>
          <input
            type="text"
            value={data.complemento}
            onChange={(e) => handleChange('complemento', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Apto, Bloco, Casa, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
            Bairro *
          </label>
          <input
            type="text"
            value={data.bairro}
            onChange={(e) => handleChange('bairro', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nome do bairro"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
            Cidade *
          </label>
          <input
            type="text"
            value={data.cidade}
            onChange={(e) => handleChange('cidade', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nome da cidade"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
            Estado *
          </label>
          <select
            value={data.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Selecione</option>
            <option value="SP">São Paulo</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="MG">Minas Gerais</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="PR">Paraná</option>
            <option value="SC">Santa Catarina</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;