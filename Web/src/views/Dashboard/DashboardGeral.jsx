import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/SideBarr';
import IntegracaoSUS from '../../components/IntegracaoSUS';
import { BarChart3, ArrowRight } from 'lucide-react';

const DashboardGeral = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Header */}
        <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-700 shadow flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <BarChart3 size={28} className="text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">FarmaChat - Dashboard Executivo</h1>
              <p className="text-blue-100 text-sm">Sistema de Continuidade do Cuidado Farmacêutico</p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/clientes')}
            className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            <span>Ver Pacientes</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 ml-20 lg:ml-60 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Integração SUS */}
            <IntegracaoSUS paciente={{nome: "Sistema Integrado"}} />
            
            {/* Call to Action */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl text-center">
              <h2 className="text-2xl font-bold mb-4">
                Transformando o Cuidado Farmacêutico no Brasil
              </h2>
              <p className="text-lg opacity-90 mb-6">
                Cada protocolo completado é uma vida cuidada com continuidade. 
                Cada alerta atendido é uma internação evitada.
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => navigate('/clientes')}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Iniciar Atendimento
                </button>
                <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  Ver Relatório Completo
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGeral;