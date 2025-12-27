import React from 'react';
import { CreditCard, Smartphone } from 'lucide-react';

const PaymentMethod = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6" style={{ color: '#111827' }}>
      <div className="flex items-center gap-3 mb-4">
        <CreditCard className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Método de Pagamento</h3>
      </div>
      
      {/* Seleção do Método */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="metodo"
            value="cartao"
            checked={data.metodo === 'cartao'}
            onChange={(e) => handleChange('metodo', e.target.value)}
            className="mr-3"
          />
          <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
          <span>Cartão de Crédito</span>
        </label>
        
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="metodo"
            value="pix"
            checked={data.metodo === 'pix'}
            onChange={(e) => handleChange('metodo', e.target.value)}
            className="mr-3"
          />
          <Smartphone className="w-5 h-5 mr-2 text-green-600" />
          <span>PIX</span>
        </label>
      </div>
      
      {/* Dados do Cartão */}
      {data.metodo === 'cartao' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
              Número do Cartão *
            </label>
            <input
              type="text"
              value={data.numeroCartao}
              onChange={(e) => handleChange('numeroCartao', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0000 0000 0000 0000"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
              Nome no Cartão *
            </label>
            <input
              type="text"
              value={data.nomeCartao}
              onChange={(e) => handleChange('nomeCartao', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nome como impresso no cartão"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
              Validade *
            </label>
            <input
              type="text"
              value={data.validadeCartao}
              onChange={(e) => handleChange('validadeCartao', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="MM/AA"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#111827' }}>
              CVV *
            </label>
            <input
              type="text"
              value={data.cvvCartao}
              onChange={(e) => handleChange('cvvCartao', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="000"
              maxLength="3"
              required
            />
          </div>
        </div>
      )}
      
      {/* Informações do PIX */}
      {data.metodo === 'pix' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            Após finalizar o pedido, você receberá o código PIX para pagamento.
            O pedido será processado após a confirmação do pagamento.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;