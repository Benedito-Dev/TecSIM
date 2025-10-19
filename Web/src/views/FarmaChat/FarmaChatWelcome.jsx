import React from 'react';
import { useNavigate } from 'react-router-dom';

const FarmaChatWelcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">FC</span>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              FarmaChat
            </h1>
            <p className="text-2xl text-gray-600 mb-4">
              O protocolo que pode mudar o cuidado no Brasil
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-12">
              Transformando cada balcão da Pague Menos em uma extensão inteligente 
              da saúde pública, onde o cuidado nunca se perde entre consultas
            </p>
            
            <button
              onClick={() => navigate('/farmachat')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Acessar FarmaChat
            </button>
          </div>
        </div>
      </div>

      {/* Problema e Solução */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              O Problema Real
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Hoje, no Brasil, mais de <strong>150 milhões de pessoas</strong> dependem do SUS.
              </p>
              <p>
                A cada nova consulta, <strong>o paciente começa do zero</strong>. 
                Ele volta a contar sua história, sua dor, suas doenças, os remédios que toma...
              </p>
              <p>
                E a cada vez, um pedacinho da sua saúde se perde no caminho.
              </p>
              <p className="text-red-600 font-semibold">
                Isso não é só ineficiência. Isso é falha de cuidado.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              📊 Estatísticas Alarmantes
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Pacientes SUS</span>
                <span className="font-bold text-blue-600">150M+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sem continuidade</span>
                <span className="font-bold text-red-600">70%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Perda de informação</span>
                <span className="font-bold text-yellow-600">Alta</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* A Solução */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">A Solução: FarmaChat</h2>
            <p className="text-xl text-blue-100">
              Um sistema que garante que o cuidado não se perca entre unidades, profissionais ou cidades
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Protocolo Contínuo</h3>
              <p className="text-blue-100">
                Histórico completo do paciente acessível em qualquer loja da rede
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">IA Contextual</h3>
              <p className="text-blue-100">
                Assistente que traduz dados em ações humanas e cuidado personalizado
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ponte SUS-Privado</h3>
              <p className="text-blue-100">
                Parceria público-privada que democratiza o acesso ao cuidado contínuo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Impacto */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            O Impacto Nacional
          </h2>
          <p className="text-lg text-gray-600">
            Transformando a Pague Menos no maior parceiro de continuidade de cuidado do Brasil
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">1.247</div>
            <div className="text-gray-600">Pacientes Ativos</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">84.8%</div>
            <div className="text-gray-600">Taxa de Adesão</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">R$ 2.4M</div>
            <div className="text-gray-600">Economia SUS</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">24/7</div>
            <div className="text-gray-600">Cuidado Contínuo</div>
          </div>
        </div>
      </div>

      {/* Call to Action Final */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            "O cuidado que continua"
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Porque no fim das contas, o que o paciente quer não é só o preço mais baixo... 
            é o cuidado que continua.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/farmachat')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Começar Agora
            </button>
            <button
              onClick={() => navigate('/farmachat')}
              className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 transition-all"
            >
              Ver Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmaChatWelcome;