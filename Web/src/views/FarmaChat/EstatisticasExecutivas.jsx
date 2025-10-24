import React from 'react';
import { farmaChatData } from '../../data/farmaChatData';

const EstatisticasExecutivas = () => {
  const stats = farmaChatData.estatisticas;

  const metricas = [
    {
      titulo: "Impacto Social",
      dados: [
        { label: "Pacientes em Protocolo", valor: stats.totalPacientesProtocolo.toLocaleString(), cor: "blue" },
        { label: "Taxa de Adesão", valor: `${stats.taxaAdesaoGeral}%`, cor: "green" },
        { label: "Economia Gerada ao SUS", valor: stats.economiaGeradaSUS, cor: "purple" }
      ]
    },
    {
      titulo: "Gestão de Risco",
      dados: [
        { label: "Pacientes Aderentes", valor: stats.pacientesAderentesRegulares.toLocaleString(), cor: "green" },
        { label: "Risco Médio", valor: stats.pacientesRiscoMedio, cor: "yellow" },
        { label: "Risco Alto", valor: stats.pacientesRiscoAlto, cor: "red" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      {/* Header Executivo */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          FarmaChat - Impacto Executivo
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          "O protocolo que pode mudar o cuidado no Brasil" - Transformando cada balcão 
          da Pague Menos em uma extensão inteligente da saúde pública
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {metricas.map((secao, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{secao.titulo}</h2>
            <div className="space-y-6">
              {secao.dados.map((metrica, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{metrica.label}</span>
                  <span className={`text-2xl font-bold ${
                    metrica.cor === 'blue' ? 'text-blue-600' :
                    metrica.cor === 'green' ? 'text-green-600' :
                    metrica.cor === 'yellow' ? 'text-yellow-600' :
                    metrica.cor === 'red' ? 'text-red-600' :
                    'text-purple-600'
                  }`}>
                    {metrica.valor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ranking de Lojas */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🏆 Ranking de Eficácia - Lojas Pague Menos
        </h2>
        <div className="space-y-4">
          {stats.lojasMaisEficazes.map((loja, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  'bg-orange-400'
                }`}>
                  {index + 1}
                </div>
                <span className="font-medium text-gray-900">{loja.nome}</span>
              </div>
              <span className="text-xl font-bold text-blue-600">{loja.score}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visão Estratégica */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6">🎯 Visão Estratégica 2025</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">5.000</div>
            <div className="text-blue-100">Pacientes Meta</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">90%</div>
            <div className="text-blue-100">Taxa de Adesão Meta</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">R$ 10M</div>
            <div className="text-blue-100">Economia SUS Projetada</div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-white/10 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">💡 Proposta de Valor</h3>
          <p className="text-blue-100 leading-relaxed">
            O FarmaChat transforma a Pague Menos no maior parceiro de continuidade de cuidado do Brasil, 
            conectando SUS e setor privado através de protocolos inteligentes que garantem que 
            <strong className="text-white"> nenhum tratamento se perca entre consultas</strong>.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            "O cuidado que continua"
          </h3>
          <p className="text-gray-600 mb-6">
            Cada protocolo seguido é uma vida cuidada com constância. 
            Cada farmacêutico conectado é um elo a mais na corrente do cuidado.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Expandir Rede
            </button>
            <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Ver Relatório Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstatisticasExecutivas;