import React from 'react';
import { AlertTriangle, Clock, Phone, MapPin } from 'lucide-react';

const AlertasProtocolo = () => {
  const alertas = [
    { 
      id: 1,
      paciente: "João Silva Santos", 
      dias: 23, 
      risco: "CRÍTICO", 
      protocolo: "Hipertensão + Diabetes",
      ultimaUnidade: "Pague Menos Centro",
      telefone: "(85) 99999-1234"
    },
    { 
      id: 2,
      paciente: "Maria Costa Ferreira", 
      dias: 15, 
      risco: "ALTO", 
      protocolo: "Diabetes Tipo 2",
      ultimaUnidade: "Pague Menos Aldeota",
      telefone: "(85) 98888-5678"
    },
    { 
      id: 3,
      paciente: "Carlos Eduardo Lima", 
      dias: 12, 
      risco: "MÉDIO", 
      protocolo: "Controle Pressão Arterial",
      ultimaUnidade: "Pague Menos Meireles",
      telefone: "(85) 97777-9012"
    }
  ];

  const getRiscoColor = (risco) => {
    switch(risco) {
      case 'CRÍTICO': return 'bg-red-100 border-red-500 text-red-800';
      case 'ALTO': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'MÉDIO': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-white" />
          <h2 className="text-lg font-semibold text-white">Protocolos Interrompidos - Ação Necessária</h2>
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
            {alertas.length} alertas ativos
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {alertas.map((alerta) => (
            <div key={alerta.id} className={`border-l-4 p-4 rounded-lg ${getRiscoColor(alerta.risco)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{alerta.paciente}</h3>
                    <span className="px-2 py-1 bg-white/50 rounded-full text-xs font-medium">
                      {alerta.risco}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span><strong>{alerta.dias} dias</strong> sem retorno ao protocolo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span>Protocolo: {alerta.protocolo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Última unidade: {alerta.ultimaUnidade}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{alerta.telefone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                    Contatar
                  </button>
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors">
                    Reagendar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-800">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">
              Sistema detectou automaticamente {alertas.length} protocolos em risco. 
              Ação imediata recomendada para manter continuidade do cuidado.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertasProtocolo;