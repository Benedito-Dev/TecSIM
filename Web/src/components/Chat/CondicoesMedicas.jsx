import React, { useState } from 'react';
import { Plus, X, Heart, Activity, Droplets, Wind } from 'lucide-react';

const CondicoesMedicas = ({ paciente, condicoes = [], onCondicoesUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [novaCondicao, setNovaCondicao] = useState({
    condicao: '',
    severidade: 'leve',
    observacoes: ''
  });

  const condicoesDisponiveis = [
    { value: 'hipertensao', label: 'Hipertensão', icon: <Heart size={16} className="text-red-500" /> },
    { value: 'diabetes', label: 'Diabetes', icon: <Droplets size={16} className="text-blue-500" /> },
    { value: 'cardiaco', label: 'Cardíaco', icon: <Activity size={16} className="text-red-600" /> },
    { value: 'asma', label: 'Asma', icon: <Wind size={16} className="text-green-500" /> },
    { value: 'obesidade', label: 'Obesidade', icon: <Activity size={16} className="text-orange-500" /> },
    { value: 'ansiedade', label: 'Ansiedade', icon: <Activity size={16} className="text-purple-500" /> }
  ];

  const getIconeCondicao = (condicao) => {
    const item = condicoesDisponiveis.find(c => c.value === condicao);
    return item?.icon || <Activity size={16} className="text-gray-500" />;
  };

  const getCorSeveridade = (severidade) => {
    switch (severidade) {
      case 'leve': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'severa': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (novaCondicao.condicao) {
      onCondicoesUpdate?.('adicionar', novaCondicao);
      setNovaCondicao({ condicao: '', severidade: 'leve', observacoes: '' });
      setShowForm(false);
    }
  };

  const handleRemover = (idCondicao) => {
    onCondicoesUpdate?.('remover', idCondicao);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Activity size={20} className="text-blue-600" />
          Condições Médicas
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          <Plus size={16} />
          Adicionar
        </button>
      </div>

      {/* Lista de Condições */}
      <div className="space-y-2 mb-4">
        {condicoes.length > 0 ? (
          condicoes.map((condicao) => (
            <div
              key={condicao.id_condicao}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getIconeCondicao(condicao.condicao)}
                <div>
                  <span className="font-medium capitalize">
                    {condicao.condicao.replace('_', ' ')}
                  </span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs border ${getCorSeveridade(condicao.severidade)}`}>
                    {condicao.severidade}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleRemover(condicao.id_condicao)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Nenhuma condição médica registrada</p>
        )}
      </div>

      {/* Formulário de Nova Condição */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border-t pt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condição Médica
            </label>
            <select
              value={novaCondicao.condicao}
              onChange={(e) => setNovaCondicao(prev => ({ ...prev, condicao: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione uma condição</option>
              {condicoesDisponiveis.map((condicao) => (
                <option key={condicao.value} value={condicao.value}>
                  {condicao.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severidade
            </label>
            <select
              value={novaCondicao.severidade}
              onChange={(e) => setNovaCondicao(prev => ({ ...prev, severidade: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="leve">Leve</option>
              <option value="moderada">Moderada</option>
              <option value="severa">Severa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={novaCondicao.observacoes}
              onChange={(e) => setNovaCondicao(prev => ({ ...prev, observacoes: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Observações adicionais..."
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CondicoesMedicas;