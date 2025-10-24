import React from 'react';
import { TrendingUp, Users, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { mockAdesaoData } from '../../data/mockAdesaoData';

const DashboardAdesao = () => {
  const stats = mockAdesaoData.estatisticas;
  
  const calcularPercentual = (valor, total) => {
    return ((valor / total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Dashboard de Adesão ao Tratamento</h2>
        <p className="text-blue-100">Monitoramento em tempo real da continuidade medicamentosa</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Pacientes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPacientes}</p>
            </div>
            <Users className="h-12 w-12 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Monitorados ativamente</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Adesão Regular</p>
              <p className="text-3xl font-bold text-green-600">{stats.pacientesComAdesaoRegular}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <p className="text-xs text-green-600 mt-2">
            {calcularPercentual(stats.pacientesComAdesaoRegular, stats.totalPacientes)}% do total
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Risco Médio</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pacientesRiscoMedio}</p>
            </div>
            <Clock className="h-12 w-12 text-yellow-600" />
          </div>
          <p className="text-xs text-yellow-600 mt-2">
            {calcularPercentual(stats.pacientesRiscoMedio, stats.totalPacientes)}% necessitam atenção
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Risco Alto</p>
              <p className="text-3xl font-bold text-red-600">{stats.pacientesRiscoAlto}</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <p className="text-xs text-red-600 mt-2">
            {calcularPercentual(stats.pacientesRiscoAlto, stats.totalPacientes)}% intervenção urgente
          </p>
        </div>
      </div>

      {/* Gráfico de Adesão */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} />
            Taxa de Sucesso
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Adesão Regular</span>
                <span className="text-sm font-bold text-green-600">
                  {calcularPercentual(stats.pacientesComAdesaoRegular, stats.totalPacientes)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${calcularPercentual(stats.pacientesComAdesaoRegular, stats.totalPacientes)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Risco Médio</span>
                <span className="text-sm font-bold text-yellow-600">
                  {calcularPercentual(stats.pacientesRiscoMedio, stats.totalPacientes)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: `${calcularPercentual(stats.pacientesRiscoMedio, stats.totalPacientes)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Risco Alto</span>
                <span className="text-sm font-bold text-red-600">
                  {calcularPercentual(stats.pacientesRiscoAlto, stats.totalPacientes)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${calcularPercentual(stats.pacientesRiscoAlto, stats.totalPacientes)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="text-green-600" size={20} />
            Impacto Financeiro
          </h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">84.2%</div>
              <div className="text-sm text-green-700">Taxa de Sucesso em Intervenções</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">R$ 125k</div>
                <div className="text-xs text-gray-600">Economia/Mês</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">67</div>
                <div className="text-xs text-gray-600">Intervenções/Mês</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas por Loja */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Alertas por Loja</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(mockAdesaoData.alertasPorLoja || {}).map(([loja, alertas]) => (
            <div key={loja} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-orange-600">{alertas}</div>
              <div className="text-xs text-gray-600">{loja}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdesao;