// src/pages/AtendimentoPaciente.jsx
import { 
  MessageSquare, 
  Users, 
  Search, 
  Plus, 
  FileText, 
  Pill,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Edit,
  Download,
  Eye,
  Stethoscope // ← Adicionei este ícone
} from "lucide-react";
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AtendimentoChat from '../../components/chat/AtendimentoChat';
import CondicoesMedicas from '../../components/chat/CondicoesMedicas';
import { usePacienteCondicoes } from '../../hooks/usePacienteCondicoes';

export default function AtendimentoPaciente() {
  const location = useLocation();
  const navigate = useNavigate();
  const { paciente } = location.state || {};
  
  const [queixaPrincipal, setQueixaPrincipal] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [resultadoTriagem, setResultadoTriagem] = useState(null);

  const { condicoes, adicionarCondicao, removerCondicao } = usePacienteCondicoes(paciente?.id);

  const handleTriagemComplete = (resultado) => {
    setResultadoTriagem(resultado);
    if (!queixaPrincipal) {
      setQueixaPrincipal(`Triagem realizada: ${resultado.classificacao}`);
    }
  };

  const handleCondicoesUpdate = async (acao, dados) => {
    try {
      if (acao === 'adicionar') {
        await adicionarCondicao({ ...dados, id_paciente: paciente.id });
      } else if (acao === 'remover') {
        await removerCondicao(dados);
      }
    } catch (error) {
      console.error('Erro ao atualizar condições:', error);
    }
  };

  // Fallback caso acessem a página diretamente sem dados
  if (!paciente) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p>Nenhum paciente selecionado para atendimento.</p>
          <button 
            onClick={() => navigate('/clientes')}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Voltar para Clientes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Atendimento - {paciente.nome}
            </h1>
            <p className="text-gray-600">CPF: {paciente.cpf} | Telefone: {paciente.telefone}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/clientes')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Voltar
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Salvar Atendimento
            </button>
          </div>
        </div>
      </div>

      {/* Informações do Paciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Dados Pessoais */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-blue-600">Dados Pessoais</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Nome:</strong> {paciente.nome}</p>
            <p><strong>CPF:</strong> {paciente.cpf}</p>
            <p><strong>Data Nasc.:</strong> {paciente.dataNascimento}</p>
            <p><strong>Telefone:</strong> {paciente.telefone}</p>
            <p><strong>Email:</strong> {paciente.email}</p>
            <p><strong>Endereço:</strong> {paciente.endereco}</p>
          </div>
        </div>

        {/* Alergias */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-red-600">Alergias</h2>
          {paciente.alergias.length > 0 ? (
            <ul className="space-y-1">
              {paciente.alergias.map((alergia, index) => (
                <li key={index} className="flex items-center gap-2 text-red-700">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {alergia}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhuma alergia registrada</p>
          )}
        </div>

        {/* Medicamentos Contínuos */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-green-600">Medicamentos</h2>
          {paciente.medicamentosContinuos.length > 0 ? (
            <ul className="space-y-1">
              {paciente.medicamentosContinuos.map((medicamento, index) => (
                <li key={index} className="flex items-center gap-2 text-green-700">
                  <Pill size={14} />
                  {medicamento}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhum medicamento contínuo</p>
          )}
        </div>
      </div>

      {/* Condições Médicas */}
      <CondicoesMedicas 
        paciente={paciente}
        condicoes={condicoes}
        onCondicoesUpdate={handleCondicoesUpdate}
      />

      {/* Grid com Chat e Formulário */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Chat de Atendimento */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare size={20} className="text-blue-600" />
            Chat de Atendimento
          </h2>
          <AtendimentoChat 
            paciente={paciente} 
            onTriagemComplete={handleTriagemComplete}
          />
        </div>

        {/* Formulário de Atendimento */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText size={20} className="text-green-600" />
            Registro do Atendimento
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Queixa Principal
                </label>
                <textarea 
                  value={queixaPrincipal}
                  onChange={(e) => setQueixaPrincipal(e.target.value)}
                  className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva a queixa principal do paciente..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea 
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Anotações sobre o atendimento..."
                />
              </div>

              {/* Resultado da Triagem */}
              {resultadoTriagem && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Resultado da Triagem:</h3>
                  <p className="text-sm text-blue-700">
                    <strong>Classificação:</strong> {resultadoTriagem.classificacao}
                  </p>
                  <p className="text-sm text-blue-700">
                    <strong>Recomendação:</strong> {resultadoTriagem.recomendacao}
                  </p>
                  {resultadoTriagem.resumo && (
                    <p className="text-sm text-blue-700 mt-2">
                      <strong>Resumo:</strong> {resultadoTriagem.resumo}
                    </p>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}