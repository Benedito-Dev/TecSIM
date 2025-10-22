import React, { useState } from 'react';
import { FileText, Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import Sidebar from '../../components/SideBarr';

export default function Prescricao() {
  const [prescricoes] = useState([
    {
      id: 1,
      paciente: 'João Silva Santos',
      medicamento: 'Paracetamol 500mg',
      dosagem: '1 comprimido',
      frequencia: '8 em 8 horas',
      data: '21/10/2024'
    },
    {
      id: 2,
      paciente: 'Maria Oliveira',
      medicamento: 'Dipirona 500mg',
      dosagem: '30 gotas',
      frequencia: '6 em 6 horas',
      data: '20/10/2024'
    },
    {
      id: 3,
      paciente: 'Pedro Costa',
      medicamento: 'Ibuprofeno 600mg',
      dosagem: '1 comprimido',
      frequencia: '12 em 12 horas',
      data: '19/10/2024'
    }
  ]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 transition-all duration-300">
        {/* Header */}
        <div className="bg-sky-600 shadow-sm border-b p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="text-white" size={28} />
              <h1 className="text-2xl font-bold text-white">Prescrições</h1>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <Plus size={20} />
              Nova Prescrição
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 ml-20 lg:ml-60">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar prescrições por paciente ou medicamento..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Prescriptions List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Lista de Prescrições</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosagem</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequência</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prescricoes.map((prescricao) => (
                    <tr key={prescricao.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {prescricao.paciente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prescricao.medicamento}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prescricao.dosagem}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prescricao.frequencia}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prescricao.data}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <Eye size={16} />
                          </button>
                          <button className="text-green-600 hover:text-green-800 p-1">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-800 p-1">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}