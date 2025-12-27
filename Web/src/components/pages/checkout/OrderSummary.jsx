import React from 'react';

const OrderSummary = ({ items, total, onFinalizarPedido }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6" style={{ color: '#111827' }}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Resumo do Pedido</h3>
      
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id_medicamento} className="flex justify-between items-center">
            <div className="flex-1">
              <p className="font-medium text-sm" style={{ color: '#111827' }}>{item.nome}</p>
              <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
            </div>
            <span className="text-sm font-semibold" style={{ color: '#111827' }}>
              {formatPrice(item.preco * item.quantity)}
            </span>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between items-center text-lg font-bold">
          <span style={{ color: '#111827' }}>Total:</span>
          <span style={{ color: '#111827' }}>{formatPrice(total)}</span>
        </div>
      </div>
      
      <button
        onClick={onFinalizarPedido}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
      >
        Finalizar Pedido
      </button>
    </div>
  );
};

export default OrderSummary;