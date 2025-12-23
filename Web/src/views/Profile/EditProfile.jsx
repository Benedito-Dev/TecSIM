import React, { useState, useEffect, useContext } from 'react';
import { User, Save, ArrowLeft, Mail, Phone, Calendar } from 'lucide-react';
import Sidebar from '../../components/SideBarr';
import { ThemeContext } from '../../context/ThemeContext';
import { getCurrentUser } from '../../services/auth/authService';

export default function EditProfile() {
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    coren: '',
    especialidade: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = getCurrentUser();
        
        if (userData && userData.tipo === 'enfermeiro') {
          setFormData({
            nome: userData.nome || '',
            email: userData.email || '',
            telefone: userData.telefone || '',
            cpf: userData.cpf || '',
            dataNascimento: userData.data_nascimento || '',
            coren: userData.registro_coren || '',
            especialidade: userData.especialidade || 'Enfermagem Geral'
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Salvar no localStorage
    const userData = getCurrentUser();
    if (userData) {
      const updatedUser = {
        ...userData,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        data_nascimento: formData.dataNascimento,
        registro_coren: formData.coren,
        especialidade: formData.especialidade
      };
      localStorage.setItem('@Auth:user', JSON.stringify(updatedUser));
    }
    
    console.log('Dados salvos:', formData);
    alert('Perfil atualizado com sucesso!');
  };

  if (loading) {
    return (
      <div className="flex h-screen" style={{ background: theme.background }}>
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
              style={{ borderColor: theme.primary }}
            ></div>
            <p className="mt-4" style={{ color: theme.textSecondary }}>
              Carregando dados...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: theme.background }}>
      <Sidebar />
      
      <div className="flex-1 transition-all duration-300">
        {/* Header */}
        <div className="shadow-sm border-b p-5" style={{ background: theme.primary }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User style={{ color: theme.textOnPrimary }} size={28} />
              <h1 className="text-2xl font-bold" style={{ color: theme.textOnPrimary }}>Editar Perfil</h1>
            </div>
            <button 
              className="px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-colors"
              style={{ background: theme.backgroundCard, color: theme.primary }}
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 ml-20 lg:ml-60">
          <div className="max-w-2xl mx-auto">
            <div 
              className="rounded-lg shadow-sm border p-6"
              style={{ background: theme.backgroundCard, borderColor: theme.border }}
            >
              <h2 
                className="text-lg font-semibold mb-6"
                style={{ color: theme.textPrimary }}
              >
                Informações Pessoais
              </h2>
              
              <form className="space-y-4">
                {/* Nome */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.textSecondary }}
                  >
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ 
                      background: theme.backgroundSecondary,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                      focusRingColor: theme.primary
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline mr-2" size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline mr-2" size={16} />
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled
                  />
                </div>

                {/* Data de Nascimento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline mr-2" size={16} />
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* COREN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    COREN
                  </label>
                  <input
                    type="text"
                    name="coren"
                    value={formData.coren}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Especialidade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especialidade
                  </label>
                  <select
                    name="especialidade"
                    value={formData.especialidade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Enfermagem Geral">Enfermagem Geral</option>
                    <option value="Enfermagem Obstétrica">Enfermagem Obstétrica</option>
                    <option value="Enfermagem Pediátrica">Enfermagem Pediátrica</option>
                    <option value="Enfermagem em UTI">Enfermagem em UTI</option>
                    <option value="Enfermagem Cirúrgica">Enfermagem Cirúrgica</option>
                  </select>
                </div>

                {/* Botão Salvar */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                  >
                    <Save size={20} />
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}