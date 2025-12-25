import React from 'react';
import { Users, FileText, Calendar, Phone, Mail, MapPin, Pill, Stethoscope } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const ClientDetailsModal = ({ cliente, onClose, onIniciarAtendimento }) => {
  const { theme } = useTheme();

  const InfoField = ({ icon: Icon, label, value }) => (
    <div 
      className="flex items-center gap-3 p-3 rounded-lg"
      style={{ background: theme.backgroundSecondary }}
    >
      <Icon size={20} style={{ color: theme.primary }} />
      <div>
        <p 
          className="text-sm"
          style={{ color: theme.textSecondary }}
        >
          {label}
        </p>
        <p 
          className="font-medium"
          style={{ color: theme.textPrimary }}
        >
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ background: theme.backgroundCard }}
      >
        <div 
          className="p-6 border-b"
          style={{ borderColor: theme.border }}
        >
          <div className="flex items-center justify-between">
            <h2 
              className="text-xl font-bold"
              style={{ color: theme.textPrimary }}
            >
              Detalhes do Cliente
            </h2>
            <button
              onClick={onClose}
              className="hover:opacity-60 transition-colors"
              style={{ color: theme.textMuted }}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações Pessoais */}
          <div>
            <h3 
              className="font-semibold mb-4 text-lg"
              style={{ color: theme.textPrimary }}
            >
              Informações Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField icon={Users} label="Nome Completo" value={cliente.nome} />
              <InfoField icon={FileText} label="CPF" value={cliente.cpf} />
              <InfoField icon={Calendar} label="Data de Nascimento" value={cliente.dataNascimento} />
              <InfoField icon={Phone} label="Telefone" value={cliente.telefone} />
              <InfoField icon={Mail} label="Email" value={cliente.email} />
              <div className="md:col-span-2">
                <InfoField icon={MapPin} label="Endereço" value={cliente.endereco} />
              </div>
            </div>
          </div>

          {/* Informações Médicas */}
          <div>
            <h3 
              className="font-semibold mb-4 text-lg"
              style={{ color: theme.textPrimary }}
            >
              Informações Médicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className="p-4 rounded-lg border"
                style={{
                  background: theme.info + '20',
                  borderColor: theme.info
                }}
              >
                <h4 
                  className="font-medium mb-2"
                  style={{ color: theme.info }}
                >
                  Patologias
                </h4>
                {cliente.condicoesCronicas?.length > 0 ? (
                  <ul style={{ color: theme.info }}>
                    {cliente.condicoesCronicas.map((condicao, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span>•</span> {condicao}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: theme.info }}>Nenhuma patologia registrada</p>
                )}
              </div>
              
              <div 
                className="p-4 rounded-lg border"
                style={{
                  background: theme.error + '20',
                  borderColor: theme.error
                }}
              >
                <h4 
                  className="font-medium mb-2"
                  style={{ color: theme.error }}
                >
                  Alergias
                </h4>
                {cliente.alergias.length > 0 ? (
                  <ul style={{ color: theme.error }}>
                    {cliente.alergias.map((alergia, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span>•</span> {alergia}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: theme.error }}>Nenhuma alergia registrada</p>
                )}
              </div>

              <div 
                className="p-4 rounded-lg border"
                style={{
                  background: theme.success + '20',
                  borderColor: theme.success
                }}
              >
                <h4 
                  className="font-medium mb-2"
                  style={{ color: theme.success }}
                >
                  Medicamentos Contínuos
                </h4>
                {cliente.medicamentosContinuos.length > 0 ? (
                  <ul style={{ color: theme.success }}>
                    {cliente.medicamentosContinuos.map((medicamento, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Pill size={14} /> {medicamento}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: theme.success }}>Nenhum medicamento contínuo</p>
                )}
              </div>
            </div>
          </div>

          {/* Histórico */}
          <div>
            <h3 
              className="font-semibold mb-4 text-lg"
              style={{ color: theme.textPrimary }}
            >
              Histórico
            </h3>
            <div 
              className="p-4 rounded-lg border"
              style={{
                background: theme.primary + '20',
                borderColor: theme.primary
              }}
            >
              <p style={{ color: theme.primary }}>
                <strong>Última compra:</strong> {cliente.ultimaCompra}
              </p>
              <p 
                className="mt-2"
                style={{ color: theme.primary }}
              >
                <strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium`}
                  style={{
                    background: cliente.status === 'ativo' ? theme.success + '20' : theme.textMuted + '20',
                    color: cliente.status === 'ativo' ? theme.success : theme.textMuted
                  }}
                >
                  {cliente.status === 'ativo' ? 'Cliente Ativo' : 'Cliente Inativo'}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-6 border-t flex justify-between gap-3"
          style={{ borderColor: theme.border }}
        >
          <button
            onClick={() => {
              onIniciarAtendimento(cliente);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
            style={{
              background: theme.success,
              color: theme.textOnSuccess
            }}
          >
            <Stethoscope size={16} />
            Iniciar Atendimento
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:opacity-80 transition-colors"
              style={{
                borderColor: theme.border,
                color: theme.textPrimary
              }}
            >
              Fechar
            </button>
            <button 
              className="px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
              style={{
                background: theme.primary,
                color: theme.textOnPrimary
              }}
            >
              Imprimir Ficha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};