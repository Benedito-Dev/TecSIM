import React, { useState } from 'react';
import { FileText, Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { useTheme } from '../../context/ThemeContext';

export default function Prescricao() {
  const { theme } = useTheme();
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
    <div 
      className="flex min-h-screen"
      style={{ background: theme.background }}
    >
      <Sidebar />
      
      <div className="flex-1 transition-all duration-300">
        {/* Header */}
        <div 
          className="h-20 shadow flex items-center justify-between px-6 sticky top-0 z-10"
          style={{ 
            background: theme.primary,
            color: theme.textOnPrimary
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <FileText size={28} />
              <h1 className="text-2xl font-bold">Prescrições</h1>
            </div>
          </div>

          <button 
            className="flex items-center gap-3 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            style={{ 
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: theme.textOnPrimary
            }}
          >
            <Plus size={18} />
            Nova Prescrição
          </button>
        </div>

        {/* Content */}
        <div 
          className="p-6 ml-20 lg:ml-60"
          style={{ color: theme.textPrimary }}
        >
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar prescrições por paciente ou medicamento..."
                style={{
                  background: theme.backgroundCard,
                  border: `1px solid ${theme.border}`,
                  color: theme.textPrimary
                }}
                className="w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:border-transparent"
              />
            </div>
          </div>

          {/* Prescriptions List */}
          <div 
            className="rounded-lg shadow-sm border"
            style={{
              background: theme.backgroundCard,
              borderColor: theme.border
            }}
          >
            <div 
              className="p-4 border-b"
              style={{ borderColor: theme.border }}
            >
              <h2 
                className="text-lg font-semibold"
                style={{ color: theme.textPrimary }}
              >
                Lista de Prescrições
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead 
                  style={{ background: theme.backgroundSecondary }}
                >
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: theme.textSecondary }}
                    >
                      Paciente
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: theme.textSecondary }}
                    >
                      Medicamento
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: theme.textSecondary }}
                    >
                      Dosagem
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: theme.textSecondary }}
                    >
                      Frequência
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: theme.textSecondary }}
                    >
                      Data
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: theme.textSecondary }}
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody 
                  className="divide-y"
                  style={{
                    background: theme.backgroundCard,
                    borderColor: theme.border
                  }}
                >
                  {prescricoes.map((prescricao) => (
                    <tr 
                      key={prescricao.id} 
                      className="hover:opacity-80"
                      style={{ background: theme.backgroundCard }}
                    >
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                        style={{ color: theme.textPrimary }}
                      >
                        {prescricao.paciente}
                      </td>
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        {prescricao.medicamento}
                      </td>
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        {prescricao.dosagem}
                      </td>
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        {prescricao.frequencia}
                      </td>
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        {prescricao.data}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-1 hover:opacity-80"
                            style={{ color: theme.primary }}
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="p-1 hover:opacity-80"
                            style={{ color: theme.success }}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="p-1 hover:opacity-80"
                            style={{ color: theme.error }}
                          >
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