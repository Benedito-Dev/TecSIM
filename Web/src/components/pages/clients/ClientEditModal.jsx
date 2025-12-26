import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const ClientEditModal = ({ cliente, onClose, onSave }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    cpf: cliente.cpf || '',
    endereco: cliente.endereco || '',
    telefone: cliente.telefone || '',
    alergias: cliente.alergias || [],
    medicacoes: cliente.medicamentosContinuos || [],
    condicoes: cliente.condicoesCronicas || []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao atualizar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
        style={{ background: theme.backgroundCard }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="p-6 border-b flex items-center justify-between flex-shrink-0"
          style={{ borderColor: theme.border }}
        >
          <h2 
            className="text-xl font-bold"
            style={{ color: theme.textPrimary }}
          >
            Editar Cliente
          </h2>
          <button
            onClick={onClose}
            className="hover:opacity-60 transition-colors"
            style={{ color: theme.textMuted }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {error && (
              <div 
                className="p-3 rounded-lg text-sm"
                style={{ 
                  background: theme.error + '20',
                  color: theme.error 
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme.textPrimary }}
              >
                Nome
              </label>
              <input
                type="text"
                value={cliente.nome}
                disabled
                className="w-full px-4 py-2 rounded-lg border opacity-60 cursor-not-allowed"
                style={{
                  background: theme.backgroundSecondary,
                  borderColor: theme.border,
                  color: theme.textMuted
                }}
              />
              <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
                Campo não editável
              </p>
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme.textPrimary }}
              >
                CPF
              </label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => handleChange('cpf', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  background: theme.backgroundSecondary,
                  borderColor: theme.border,
                  color: theme.textPrimary
                }}
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme.textPrimary }}
              >
                Telefone
              </label>
              <input
                type="text"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  background: theme.backgroundSecondary,
                  borderColor: theme.border,
                  color: theme.textPrimary
                }}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme.textPrimary }}
              >
                Endereço
              </label>
              <textarea
                value={formData.endereco}
                onChange={(e) => handleChange('endereco', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  background: theme.backgroundSecondary,
                  borderColor: theme.border,
                  color: theme.textPrimary
                }}
                placeholder="Rua, número, bairro, cidade/estado"
              />
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme.textPrimary }}
              >
                Alergias
              </label>
              <textarea
                value={formData.alergias.join(', ')}
                onChange={(e) => handleArrayChange('alergias', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  background: theme.backgroundSecondary,
                  borderColor: theme.border,
                  color: theme.textPrimary
                }}
                placeholder="Penicilina, Dipirona (separar por vírgula)"
              />
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme.textPrimary }}
              >
                Medicações Contínuas
              </label>
              <textarea
                value={formData.medicacoes.join(', ')}
                onChange={(e) => handleArrayChange('medicacoes', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  background: theme.backgroundSecondary,
                  borderColor: theme.border,
                  color: theme.textPrimary
                }}
                placeholder="Losartana 50mg, Metformina 850mg (separar por vírgula)"
              />
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme.textPrimary }}
              >
                Condições Crônicas
              </label>
              <textarea
                value={formData.condicoes.join(', ')}
                onChange={(e) => handleArrayChange('condicoes', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  background: theme.backgroundSecondary,
                  borderColor: theme.border,
                  color: theme.textPrimary
                }}
                placeholder="Hipertensão, Diabetes tipo 2 (separar por vírgula)"
              />
            </div>
          </div>

          <div 
            className="p-6 border-t flex gap-3 flex-shrink-0"
            style={{ borderColor: theme.border }}
          >
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:opacity-80 transition-colors"
              style={{
                borderColor: theme.border,
                color: theme.textPrimary
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center justify-center gap-2"
              style={{
                background: loading ? theme.textMuted : theme.success,
                color: theme.textOnSuccess
              }}
            >
              <Save size={16} />
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
