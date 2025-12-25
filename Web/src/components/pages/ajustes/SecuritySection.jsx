import React from 'react';
import { Shield, User, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import ConfigItem from './ConfigItem';

const SecuritySection = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div 
      className="rounded-2xl p-6 border"
      style={{
        background: theme.backgroundCard,
        borderColor: theme.border
      }}
    >
      <h2 
        className="text-xl font-bold mb-6 flex items-center gap-3"
        style={{ color: theme.textPrimary }}
      >
        <Shield 
          size={24} 
          style={{ color: theme.error }}
        />
        Segurança e Privacidade
      </h2>
      
      <div className="grid gap-4">
        <ConfigItem
          icon={<User size={20} />}
          title="Controle de Acesso"
          description="Gerenciar permissões de usuários e funções"
          action={() => navigate('/ajustes/permissoes')}
        />
        
        <ConfigItem
          icon={<FileText size={20} />}
          title="Registro de Auditoria"
          description="Visualizar logs do sistema e atividades"
          action={() => navigate('/ajustes/auditoria')}
        />
        
        <ConfigItem
          icon={<Shield size={20} />}
          title="Política de Segurança"
          description="Configurar políticas de segurança do sistema"
          action={() => navigate('/ajustes/seguranca')}
        />
      </div>
    </div>
  );
};

export default SecuritySection;