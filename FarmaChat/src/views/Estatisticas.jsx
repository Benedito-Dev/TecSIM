import React from 'react';
import Layout from '../components/Layout';
import { farmaChatData } from '../data/farmaChatData';

const Estatisticas = () => {
  const stats = farmaChatData.estatisticas;

  const metricas = [
    {
      titulo: "Impacto Social",
      dados: [
        { label: "Pacientes em Protocolo", valor: stats.totalPacientesProtocolo.toLocaleString(), cor: "blue", icone: "👥" },
        { label: "Taxa de Adesão Geral", valor: `${stats.taxaAdesaoGeral}%`, cor: "green", icone: "📈" },
        { label: "Economia Gerada ao SUS", valor: stats.economiaGeradaSUS, cor: "purple", icone: "💰" }
      ]
    },
    {
      titulo: "Gestão de Risco",
      dados: [
        { label: "Pacientes Aderentes", valor: stats.pacientesAderentesRegulares.toLocaleString(), cor: "green", icone: "✅" },
        { label: "Risco Médio", valor: stats.pacientesRiscoMedio, cor: "yellow", icone: "⚠️" },
        { label: "Risco Alto", valor: stats.pacientesRiscoAlto, cor: "red", icone: "🚨" }
      ]
    },
    {
      titulo: "Operacional",
      dados: [
        { label: "Intervenções/Mês", valor: stats.intervencoesMes.toLocaleString(), cor: "blue", icone: "🎯" },
        { label: "Taxa de Sucesso", valor: `${stats.sucessoIntervencoes}%`, cor: "green", icone: "🏆" },
        { label: "Lojas Ativas", valor: stats.lojasMaisEficazes.length, cor: "purple", icone: "🏪" }
      ]
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Executivo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            FarmaChat - Impacto Executivo
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            "O protocolo que pode mudar o cuidado no Brasil" - Transformando cada balcão 
            da Pague Menos em uma extensão inteligente da saúde pública
          </p>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {metricas.map((secao, index) => (
            <div key={index} className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{secao.titulo}</h2>
              <div className="space-y-6">
                {secao.dados.map((metrica, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-3xl mb-2">{metrica.icone}</div>
                    <div className={`text-3xl font-bold mb-2 ${
                      metrica.cor === 'blue' ? 'text-blue-600' :
                      metrica.cor === 'green' ? 'text-green-600' :
                      metrica.cor === 'yellow' ? 'text-yellow-600' :
                      metrica.cor === 'red' ? 'text-red-600' :
                      'text-purple-600'
                    }`}>
                      {metrica.valor}
                    </div>
                    <div className="text-gray-700 font-medium">{metrica.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Gráfico de Tendências */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📊 Evolução Mensal - 2024
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pacientes Ativos</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Out</span>
                  <span className="text-sm font-medium">2.156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nov</span>
                  <span className="text-sm font-medium">2.534</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Dez</span>
                  <span className="text-sm font-medium text-green-600">2.847</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Taxa de Adesão</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Out</span>
                  <span className="text-sm font-medium">81.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nov</span>
                  <span className="text-sm font-medium">82.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Dez</span>
                  <span className="text-sm font-medium text-green-600">84.2%</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Economia SUS</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Out</span>
                  <span className="text-sm font-medium">R$ 3.2M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nov</span>
                  <span className="text-sm font-medium">R$ 4.1M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Dez</span>
                  <span className="text-sm font-medium text-green-600">R$ 4.7M</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ranking Detalhado de Lojas */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🏆 Ranking Detalhado - Lojas Pague Menos
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Posição</th>
                  <th className="text-left py-3 px-4">Loja</th>
                  <th className="text-center py-3 px-4">Pacientes</th>
                  <th className="text-center py-3 px-4">Score</th>
                  <th className="text-center py-3 px-4">Tendência</th>
                </tr>
              </thead>
              <tbody>
                {stats.lojasMaisEficazes.map((loja, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-400' : 'bg-blue-400'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{loja.nome}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-medium">{loja.pacientes}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-xl font-bold text-blue-600">{loja.score}%</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-green-600">↗️ +2.1%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visão Estratégica 2025 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">🎯 Visão Estratégica 2025</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-3">8.000</div>
              <div className="text-blue-100 text-lg">Pacientes Meta</div>
              <div className="text-sm text-blue-200 mt-2">+180% crescimento</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-3">90%</div>
              <div className="text-blue-100 text-lg">Taxa de Adesão Meta</div>
              <div className="text-sm text-blue-200 mt-2">+5.8% melhoria</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-3">R$ 15M</div>
              <div className="text-blue-100 text-lg">Economia SUS Projetada</div>
              <div className="text-sm text-blue-200 mt-2">+220% impacto</div>
            </div>
          </div>
          
          <div className="mt-10 p-6 bg-white/10 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">💡 Proposta de Valor Expandida</h3>
            <p className="text-blue-100 leading-relaxed text-lg">
              O FarmaChat se consolida como o <strong className="text-white">maior ecossistema de continuidade 
              de cuidado do Brasil</strong>, conectando SUS e setor privado através de protocolos inteligentes 
              que garantem que <strong className="text-white">nenhum tratamento se perca entre consultas</strong>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-semibold text-white mb-2">🌐 Expansão Nacional</h4>
                <p className="text-blue-100 text-sm">Presença em todas as capitais brasileiras</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">🤝 Parcerias PPP</h4>
                <p className="text-blue-100 text-sm">Integração direta com sistemas municipais de saúde</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="card p-8 max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              "O cuidado que continua"
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Cada protocolo seguido é uma vida cuidada com constância. 
              Cada farmacêutico conectado é um elo a mais na corrente do cuidado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg">
                Expandir para Nova Região
              </button>
              <button className="btn-secondary text-lg">
                Relatório Executivo Completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Estatisticas;