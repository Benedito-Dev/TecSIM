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
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AtendimentoPaciente() {
  const location = useLocation();
  const navigate = useNavigate();
  const { paciente } = location.state || {};

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

      {/* Formulário de Atendimento */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Registro do Atendimento</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Queixa Principal
            </label>
            <textarea 
              className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descreva a queixa principal do paciente..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea 
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Anotações sobre o atendimento..."
            />
          </div>
        </form>
      </div>
    </div>
  );
}