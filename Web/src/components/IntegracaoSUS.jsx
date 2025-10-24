import React from 'react';
import { Shield, Database, CheckCircle, AlertCircle } from 'lucide-react';

const IntegracaoSUS = ({ paciente }) => {
  const integracaoData = {
    status: 'conectado',
    prontuarioSUS: '#789456123',
    ultimaConsultaPublica: '10/01/2024',
    unidadeSUS: 'UBS Centro - Fortaleza/CE',
    prescricaoAtiva: ['Losartana 50mg', 'Metformina 850mg', 'AAS 100mg'],
    medico: 'Dr. Roberto Silva (CRM 12345)',
    proximaConsulta: '25/02/2024'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-white" />
          <h2 className="text-lg font-semibold text-white">Integração SUS - Parceria Público-Privada</h2>
          <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full">
            <CheckCircle className="w-3 h-3 text-green-200" />
            <span className="text-xs text-green-200 font-medium">Conectado</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados SUS */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              Dados do Sistema Público
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-600">Prontuário SUS:</span>
                <span className="font-medium text-blue-800">{integracaoData.prontuarioSUS}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-600">Última consulta:</span>
                <span className="font-medium text-blue-800">{integracaoData.ultimaConsultaPublica}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-600">Unidade SUS:</span>
                <span className="font-medium text-blue-800">{integracaoData.unidadeSUS}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-600">Médico responsável:</span>
                <span className="font-medium text-blue-800">{integracaoData.medico}</span>
              </div>
            </div>
          </div>
          
          {/* Prescrição Ativa */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Prescrição Médica Ativa
            </h3>
            
            <div className="space-y-2">
              {integracaoData.prescricaoAtiva.map((medicamento, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">{medicamento}</span>
                  <span className="ml-auto text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Ativo
                  </span>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Próxima consulta SUS: {integracaoData.proximaConsulta}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Benefícios da Integração */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-2">Benefícios da Parceria Público-Privada</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-purple-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Continuidade entre consultas SUS</span>
            </div>
            <div className="flex items-center gap-2 text-purple-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Acompanhamento farmacêutico gratuito</span>
            </div>
            <div className="flex items-center gap-2 text-purple-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Redução de reinternações</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegracaoSUS;