import React from 'react';
import { User, FileText, Phone, Mail, MapPin, AlertTriangle, Pill } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const DadosPaciente = ({ paciente }) => {
  const { theme } = useTheme();

  const InfoCard = ({ title, icon: Icon, color, children }) => (
    <div 
      className="rounded-xl shadow-lg border overflow-hidden"
      style={{
        background: theme.backgroundCard,
        borderColor: theme.border
      }}
    >
      <div 
        className="px-6 py-4"
        style={{ background: color }}
      >
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4" style={{ color: theme.textMuted }} />
      <span className="text-sm" style={{ color: theme.textSecondary }}>
        {label}:
      </span>
      <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Dados Pessoais */}
      <InfoCard title="Dados Pessoais" icon={User} color={theme.primary}>
        <div className="space-y-3">
          <InfoItem icon={User} label="Nome" value={paciente.nome} />
          <InfoItem icon={FileText} label="CPF" value={paciente.cpf} />
          <InfoItem icon={Phone} label="Telefone" value={paciente.telefone} />
          <InfoItem icon={Mail} label="Email" value={paciente.email} />
          <InfoItem icon={MapPin} label="Endereço" value={paciente.endereco} />
        </div>
      </InfoCard>

      {/* Alergias */}
      <InfoCard title="Alergias" icon={AlertTriangle} color={theme.error}>
        {paciente.alergias?.length > 0 ? (
          <div className="space-y-2">
            {paciente.alergias.map((alergia, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-2 rounded-lg"
                style={{ background: theme.error + '20' }}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ background: theme.error }}
                />
                <span 
                  className="text-sm font-medium"
                  style={{ color: theme.error }}
                >
                  {alergia}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" style={{ color: theme.textMuted }} />
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              Nenhuma alergia registrada
            </p>
          </div>
        )}
      </InfoCard>

      {/* Medicamentos */}
      <InfoCard title="Medicamentos" icon={Pill} color={theme.success}>
        {paciente.medicamentosContinuos?.length > 0 ? (
          <div className="space-y-2">
            {paciente.medicamentosContinuos.map((medicamento, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-2 rounded-lg"
                style={{ background: theme.success + '20' }}
              >
                <Pill className="w-4 h-4" style={{ color: theme.success }} />
                <span 
                  className="text-sm font-medium"
                  style={{ color: theme.success }}
                >
                  {medicamento}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Pill className="w-8 h-8 mx-auto mb-2" style={{ color: theme.textMuted }} />
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              Nenhum medicamento contínuo
            </p>
          </div>
        )}
      </InfoCard>
    </div>
  );
};