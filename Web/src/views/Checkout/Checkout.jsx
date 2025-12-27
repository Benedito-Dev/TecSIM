import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft } from 'lucide-react';

import { PageContainer } from '../../components/layout/PageContainer';
import OrderSummary from '../../components/pages/checkout/OrderSummary';
import CustomerInfo from '../../components/pages/checkout/CustomerInfo';
import PaymentMethod from '../../components/pages/checkout/PaymentMethod';
import DeliveryInfo from '../../components/pages/checkout/DeliveryInfo';

import { useCart } from '../../context/CartContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  
  const [customerData, setCustomerData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: ''
  });
  
  const [deliveryData, setDeliveryData] = useState({
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });
  
  const [paymentData, setPaymentData] = useState({
    metodo: 'cartao',
    numeroCartao: '',
    nomeCartao: '',
    validadeCartao: '',
    cvvCartao: ''
  });

  const handleFinalizarPedido = async () => {
    try {
      // Aqui você faria a integração com a API de pagamento
      console.log('Finalizando pedido:', {
        items,
        customer: customerData,
        delivery: deliveryData,
        payment: paymentData,
        total: getTotalPrice()
      });
      
      // Simular processamento
      alert('Pedido realizado com sucesso!');
      clearCart();
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      alert('Erro ao processar pedido. Tente novamente.');
    }
  };

  if (items.length === 0) {
    return (
      <PageContainer title="Checkout" icon={CreditCard}>
        <div className="text-center py-12">
          <p className="text-gray-500">Seu carrinho está vazio</p>
          <button 
            onClick={() => navigate('/medicamentos')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Ver Medicamentos
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer 
      title="Checkout" 
      icon={CreditCard}
      buttonText="Voltar"
      buttonIcon={ArrowLeft}
      onButtonClick={() => navigate('/medicamentos')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulários */}
        <div className="lg:col-span-2 space-y-6">
          <CustomerInfo 
            data={customerData} 
            onChange={setCustomerData} 
          />
          
          <DeliveryInfo 
            data={deliveryData} 
            onChange={setDeliveryData} 
          />
          
          <PaymentMethod 
            data={paymentData} 
            onChange={setPaymentData} 
          />
        </div>

        {/* Resumo do Pedido */}
        <div className="lg:col-span-1">
          <OrderSummary 
            items={items}
            total={getTotalPrice()}
            onFinalizarPedido={handleFinalizarPedido}
          />
        </div>
      </div>
    </PageContainer>
  );
}