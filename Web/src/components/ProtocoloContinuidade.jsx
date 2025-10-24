import React from 'react';
import { AlertTriangle, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const ProtocoloContinuidade = ({ paciente, tipoGrafico, ultimoAtendimento }) => {
  // Gerar dados dinâmicos baseados no paciente
  const gerarProtocoloDinamico = () => {
    const condicoes = paciente?.condicoesCronicas || [];
    const temAlergias = paciente?.alergias?.length > 0;
    const temMedicamentos = paciente?.medicamentosContinuos?.length > 0;
    
    // Dias sem retorno baseado no perfil
    const diasBase = {
      'ambos': Math.floor(Math.random() * 15) + 10, // 10-25 dias
      'diabetes': Math.floor(Math.random() * 20) + 5, // 5-25 dias  
      'hipertensao': Math.floor(Math.random() * 25) + 8, // 8-33 dias
      'geral': Math.floor(Math.random() * 30) + 15 // 15-45 dias
    };
    
    const diasSemRetorno = diasBase[tipoGrafico] || diasBase.geral;
    
    // Protocolos específicos por condição
    const protocolos = {
      'ambos': {
        nome: 'Síndrome Metabólica (DM2 + HAS)',
        etapaAtual: Math.floor(Math.random() * 3) + 3,
        totalEtapas: 6,
        proximaAcao: temAlergias ? 'Revisar medicações por alergias' : 'Monitorar PA e glicemia',
        complexidade: 'ALTA'
      },
      'diabetes': {
        nome: 'Controle Diabetes Tipo 2',
        etapaAtual: Math.floor(Math.random() * 2) + 2,
        totalEtapas: 4,
        proximaAcao: temMedicamentos ? 'Verificar adesão à metformina' : 'Orientar mudanças dietéticas',
        complexidade: 'MÉDIA'
      },
      'hipertensao': {
        nome: 'Controle Pressão Arterial',
        etapaAtual: Math.floor(Math.random() * 2) + 1,
        totalEtapas: 4,
        proximaAcao: temMedicamentos ? 'Monitorar efeitos do losartana' : 'Orientar redução de sódio',
        complexidade: 'MÉDIA'
      },
      'geral': {
        nome: 'Acompanhamento Preventivo',
        etapaAtual: Math.floor(Math.random() * 2) + 1,
        totalEtapas: 3,
        proximaAcao: 'Check-up de rotina e orientações gerais',
        complexidade: 'BAIXA'
      }
    };
    
    const protocolo = protocolos[tipoGrafico] || protocolos.geral;
    
    return {
      ...protocolo,
      diasSemRetorno,
      risco: diasSemRetorno > 20 ? 'CRÍTICO' : diasSemRetorno > 12 ? 'ALTO' : 'BAIXO'
    };
  };
  
  const protocoloAtivo = gerarProtocoloDinamico();

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-orange-600" />
        <h3 className="font-semibold text-orange-800">Protocolo em Andamento</h3>
        {protocoloAtivo.risco !== 'BAIXO' && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            protocoloAtivo.risco === 'CRÍTICO' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {protocoloAtivo.risco}: {protocoloAtivo.diasSemRetorno} dias sem retorno
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{protocoloAtivo.nome}</span>
          <span className="text-xs text-gray-500">
            Etapa {protocoloAtivo.etapaAtual}/{protocoloAtivo.totalEtapas}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full" 
            style={{width: `${(protocoloAtivo.etapaAtual / protocoloAtivo.totalEtapas) * 100}%`}}
          ></div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-orange-700">
          <ArrowRight className="w-4 h-4" />
          <span>Próxima ação: {protocoloAtivo.proximaAcao}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Clock className="w-3 h-3" />
          <span>Último atendimento: {ultimoAtendimento?.data || '15/01/2024'} - {ultimoAtendimento?.farmaceutico || 'Dr. Silva'} (Pague Menos {['Centro', 'Aldeota', 'Meireles'][Math.floor(Math.random() * 3)]})</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-purple-600 mt-1">
          <span className="font-medium">Complexidade:</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            protocoloAtivo.complexidade === 'ALTA' ? 'bg-red-100 text-red-700' :
            protocoloAtivo.complexidade === 'MÉDIA' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {protocoloAtivo.complexidade}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProtocoloContinuidade;