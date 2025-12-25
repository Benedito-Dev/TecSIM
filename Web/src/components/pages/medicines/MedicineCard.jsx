import React from 'react';
import { FaPills } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

const MedicineCard = ({ medicine, onAdd, formatPrice }) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        background: theme.backgroundCard,
        border: `1px solid ${theme.border}`,
        color: theme.textPrimary
      }}
      className="p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div 
            className="text-2xl mt-1"
            style={{ color: theme.primary }}
          >
            <FaPills />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 
                className="font-bold text-xl"
                style={{ color: theme.textPrimary }}
              >
                {medicine.nome}
              </h3>
              <span 
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  background: theme.primaryLight,
                  color: theme.primary
                }}
              >
                {medicine.tipo}
              </span>
            </div>
            <p 
              className="mb-3"
              style={{ color: theme.textSecondary }}
            >
              {medicine.descricao}
            </p>
            
            {/* Informações detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div style={{ color: theme.textSecondary }}>
                <span style={{ color: theme.textPrimary }} className="font-medium">Composição:</span> {medicine.composicao}
              </div>
              <div style={{ color: theme.textSecondary }}>
                <span style={{ color: theme.textPrimary }} className="font-medium">Dosagem:</span> {medicine.dosagem_padrao}
              </div>
              <div style={{ color: theme.textSecondary }}>
                <span style={{ color: theme.textPrimary }} className="font-medium">Faixa Etária:</span> {medicine.faixa_etaria_minima} - {medicine.faixa_etaria_maxima} anos
              </div>
              {medicine.contraindicacoes && (
                <div style={{ color: theme.error }}>
                  <span className="font-medium">Cuidado:</span> {medicine.contraindicacoes}
                </div>
              )}
            </div>

            {/* Interações */}
            {medicine.interacoes_comuns && (
              <div className="mt-2">
                <span 
                  className="font-medium text-sm"
                  style={{ color: theme.warning }}
                >
                  Interações:
                </span> 
                <span 
                  className="text-sm ml-1"
                  style={{ color: theme.textSecondary }}
                >
                  {medicine.interacoes_comuns}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 ml-4">
          <span 
            className="font-bold text-xl"
            style={{ color: theme.textPrimary }}
          >
            {formatPrice(medicine)}
          </span>
          <button 
            onClick={() => onAdd(medicine)}
            style={{
              background: theme.primary,
              color: theme.textOnPrimary
            }}
            className="px-4 py-2 rounded-lg hover:opacity-90 transition-colors font-medium flex items-center gap-2"
          >
            <FaPills size={14} />
            Adicionar
          </button>
          {medicine.bula_detalhada && (
            <a 
              href={medicine.bula_detalhada}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: theme.primary }}
              className="hover:opacity-80 text-sm underline transition-colors"
            >
              Ver bula completa
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;