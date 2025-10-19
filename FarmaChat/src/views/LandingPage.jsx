import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 pague-menos-gradient rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-4xl">P</span>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold text-pague-azul-700 mb-2">
              Pague Menos
            </h1>
            <h2 className="text-4xl font-semibold text-pague-vermelho-600 mb-6">
              FarmaChat
            </h2>
            <p className="text-3xl text-gray-600 mb-4 font-semibold">
              O protocolo que pode mudar o cuidado no Brasil
            </p>
            <p className="text-xl text-gray-500 max-w-4xl mx-auto mb-12 leading-relaxed">
              Transformando cada balcão da Pague Menos em uma extensão inteligente 
              da saúde pública, onde <strong>o cuidado nunca se perde entre consultas</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="btn-primary text-lg px-8 py-4"
              >
                Acessar Sistema
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-secondary text-lg px-8 py-4"
              >
                Ver Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* O Problema */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              O Problema Real
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Hoje, no Brasil, mais de <strong className="text-red-600">150 milhões de pessoas</strong> dependem do SUS.
              </p>
              <p>
                Quantas dessas pessoas são acompanhadas de verdade?
              </p>
              <p>
                A cada nova consulta, <strong>o paciente começa do zero</strong>. 
                Ele volta a contar sua história, sua dor, suas doenças, os remédios que toma...
              </p>
              <p className="text-red-600 font-bold text-xl">
                E a cada vez, um pedacinho da sua saúde se perde no caminho.
              </p>
              <p className="text-gray-800 font-semibold">
                Isso não é só ineficiência. <strong>Isso é falha de cuidado.</strong>
              </p>
            </div>
          </div>
          
          <div className="card p-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              📊 A Realidade dos Números
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-lg">Pacientes SUS</span>
                <span className="font-bold text-blue-600 text-2xl">150M+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-lg">Sem continuidade de cuidado</span>
                <span className="font-bold text-red-600 text-2xl">70%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-lg">Perda de informação</span>
                <span className="font-bold text-yellow-600 text-2xl">ALTA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-lg">Retrabalho médico</span>
                <span className="font-bold text-orange-600 text-2xl">CRÍTICO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* A Solução */}
      <div className="pague-menos-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">A Solução: FarmaChat</h2>
            <p className="text-2xl text-blue-100 max-w-4xl mx-auto">
              Um sistema que garante que o cuidado <strong>não se perca entre unidades, profissionais ou cidades</strong>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔗</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Protocolo Contínuo</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Histórico completo do paciente acessível em <strong>qualquer loja da rede</strong>, 
                garantindo continuidade do tratamento
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">IA Contextual</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Assistente que <strong>traduz dados em ações humanas</strong>, 
                oferecendo cuidado personalizado e orientações precisas
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏥</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Ponte SUS-Privado</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Parceria público-privada que <strong>democratiza o acesso</strong> 
                ao cuidado contínuo e qualificado
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Impacto Nacional */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            O Impacto Nacional
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transformando a Pague Menos no <strong>maior parceiro de continuidade de cuidado do Brasil</strong>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="card p-8 text-center">
            <div className="text-4xl font-bold text-pague-azul-600 mb-3">2.847</div>
            <div className="text-gray-600 text-lg">Pacientes em Protocolo</div>
          </div>
          <div className="card p-8 text-center">
            <div className="text-4xl font-bold text-green-600 mb-3">84.2%</div>
            <div className="text-gray-600 text-lg">Taxa de Adesão</div>
          </div>
          <div className="card p-8 text-center">
            <div className="text-4xl font-bold text-pague-vermelho-600 mb-3">R$ 4.7M</div>
            <div className="text-gray-600 text-lg">Economia ao SUS</div>
          </div>
          <div className="card p-8 text-center">
            <div className="text-4xl font-bold text-yellow-600 mb-3">89.3%</div>
            <div className="text-gray-600 text-lg">Sucesso em Intervenções</div>
          </div>
        </div>
      </div>

      {/* Depoimento */}
      <div className="bg-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <blockquote className="text-2xl text-gray-700 italic mb-8 leading-relaxed">
            "O FarmaChat não é só tecnologia. É a ideia de que <strong>ninguém deveria recomeçar 
            seu tratamento toda vez que muda de endereço</strong>. É a certeza de que um protocolo 
            bem seguido salva vidas silenciosamente."
          </blockquote>
          <div className="text-gray-600">
            <p className="font-semibold">Ana Silva</p>
            <p>Farmacêutica Responsável - Pague Menos Fortaleza Centro</p>
          </div>
        </div>
      </div>

      {/* Call to Action Final */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">
            "O cuidado que continua"
          </h2>
          <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
            Porque no fim das contas, o que o paciente quer não é só o preço mais baixo... 
            <strong className="text-white">é o cuidado que continua.</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="btn-primary text-xl px-10 py-5"
            >
              Começar Agora
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-10 py-5 border-2 border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 transition-all text-xl"
            >
              Ver Demonstração
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;