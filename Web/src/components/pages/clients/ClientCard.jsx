import React from 'react';
import { Phone, Calendar, Pill, Stethoscope, Eye, Edit, Bell } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const ClientCard = ({ cliente, onIniciarAtendimento, onVerDetalhes, onEditar, onVerLembretes }) => {
  const { theme } = useTheme();

  return (
    <div 
      className="rounded-xl p-6 border hover:shadow-md transition-all duration-200"
      style={{
        background: theme.backgroundCard,
        borderColor: theme.border
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
            style={{
              background: theme.primaryLight + '20',
              color: theme.primary
            }}
          >
            {cliente.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 
                className="font-bold text-lg"
                style={{ color: theme.textPrimary }}
              >
                {cliente.nome}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium`}
                style={{
                  background: cliente.status === 'ativo' ? theme.success + '20' : theme.textMuted + '20',
                  color: cliente.status === 'ativo' ? theme.success : theme.textMuted
                }}
              >
                {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span 
                  className="font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  CPF:
                </span>
                <span style={{ color: theme.textPrimary }}>{cliente.cpf}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} style={{ color: theme.textMuted }} />
                <span style={{ color: theme.textPrimary }}>{cliente.telefone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} style={{ color: theme.textMuted }} />
                <span style={{ color: theme.textPrimary }}>Última compra: {cliente.ultimaCompra}</span>
              </div>
              <div className="flex items-center gap-2">
                <Pill size={14} style={{ color: theme.textMuted }} />
                <span style={{ color: theme.textPrimary }}>{cliente.medicamentosContinuos.length} med. contínuos</span>
              </div>
            </div>

            {cliente.condicoesCronicas?.length > 0 && (
              <div className="mt-2">
                <span 
                  className="text-xs font-medium"
                  style={{ color: theme.info }}
                >
                  🏥 Patologias: 
                </span>
                <span 
                  className="text-xs"
                  style={{ color: theme.info }}
                >
                  {cliente.condicoesCronicas.join(', ')}
                </span>
              </div>
            )}

            {cliente.alergias.length > 0 && (
              <div className="mt-2">
                <span 
                  className="text-xs font-medium"
                  style={{ color: theme.error }}
                >
                  ⚠️ Alergias: 
                </span>
                <span 
                  className="text-xs"
                  style={{ color: theme.error }}
                >
                  {cliente.alergias.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onIniciarAtendimento(cliente)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:opacity-90 transition-colors text-sm"
            style={{
              background: theme.success,
              color: theme.textOnSuccess
            }}
          >
            <Stethoscope size={14} />
            Atendimento
          </button>
          
          <button
            onClick={() => onVerDetalhes(cliente)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:opacity-90 transition-colors text-sm"
            style={{
              background: theme.primary,
              color: theme.textOnPrimary
            }}
          >
            <Eye size={14} />
            Detalhes
          </button>
          
          <button 
            onClick={() => onEditar(cliente)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:opacity-80 transition-colors text-sm"
            style={{
              background: theme.backgroundSecondary,
              color: theme.textPrimary
            }}
          >
            <Edit size={14} />
            Editar
          </button>
          
          <button
            onClick={() => onVerLembretes(cliente)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:opacity-90 transition-colors text-sm"
            style={{
              background: theme.info,
              color: theme.textOnPrimary
            }}
          >
            <Bell size={14} />
            Lembretes
          </button>
        </div>
      </div>
    </div>
  );
};