import React from 'react';
import { Users, Activity, TrendingDown, DollarSign } from 'lucide-react';

const DashboardImpacto = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">1.247</div>
            <div className="text-sm opacity-90">Pacientes Acompanhados</div>
            <div className="text-xs opacity-75 mt-1">↑ 23% este mês</div>
          </div>
          <Users className="w-8 h-8 opacity-80" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">892</div>
            <div className="text-sm opacity-90">Protocolos Ativos</div>
            <div className="text-xs opacity-75 mt-1">87% taxa de conclusão</div>
          </div>
          <Activity className="w-8 h-8 opacity-80" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">23%</div>
            <div className="text-sm opacity-90">↓ Reinternações</div>
            <div className="text-xs opacity-75 mt-1">vs. média nacional</div>
          </div>
          <TrendingDown className="w-8 h-8 opacity-80" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">R$ 2.1M</div>
            <div className="text-sm opacity-90">Economia SUS</div>
            <div className="text-xs opacity-75 mt-1">últimos 12 meses</div>
          </div>
          <DollarSign className="w-8 h-8 opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default DashboardImpacto;