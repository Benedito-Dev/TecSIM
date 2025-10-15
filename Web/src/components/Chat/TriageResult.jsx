import React from 'react';
import { AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const TriageResult = ({ classificacao, analise, onClose }) => {
  const getIcon = () => {
    switch (classificacao.nivel) {
      case 'EMERGÊNCIA':
        return <AlertTriangle className="text-red-500" size={32} />;
      case 'URGENTE':
        return <Clock className="text-orange-500" size={32} />;
      case 'ROTINA':
        return <CheckCircle className="text-green-500" size={32} />;
      default:
        return <CheckCircle className="text-blue-500" size={32} />;
    }
  };

  const getBorderColor = () => {
    switch (classificacao.nivel) {
      case 'EMERGÊNCIA': return 'border-red-200';
      case 'URGENTE': return 'border-orange-200';
      case 'ROTINA': return 'border-green-200';
      default: return 'border-blue-200';
    }
  };

  const getBackgroundColor = () => {
    switch (classificacao.nivel) {
      case 'EMERGÊNCIA': return 'bg-red-50';
      case 'URGENTE': return 'bg-orange-50';
      case 'ROTINA': return 'bg-green-50';
      default: return 'bg-blue-50';
    }
  };

  return (
    <div className={`border-2 rounded-xl p-4 ${getBorderColor()} ${getBackgroundColor()} my-4`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">{classificacao.icone} {classificacao.nivel}</h3>
          <p className="text-gray-700 mb-3">{classificacao.recomendacao}</p>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Clock size={16} className="mr-1" />
            <span>Tempo recomendado: {classificacao.tempo}</span>
          </div>
          {analise && (
            <div className="bg-white rounded-lg p-3 border">
              <p className="text-gray-800">{analise}</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          ⚠️ Esta triagem é inicial e não substitui avaliação médica profissional.
        </p>
      </div>
    </div>
  );
};

export default TriageResult;