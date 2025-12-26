import React from 'react';
import { Bell, Database, Clock } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import ConfigItem from './ConfigItem';

const NotificationsSection = ({ configuracoes, toggleConfig }) => {
  const { theme } = useTheme();

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
        <Bell 
          size={24} 
          style={{ color: theme.warning }}
        />
        Notificações e Alertas
      </h2>
      
      <div className="grid gap-4">
        <ConfigItem
          icon={<Database size={20} />}
          title="Alertas de Estoque Baixo"
          description="Notificar quando medicamentos estiverem com estoque crítico"
          isToggle={true}
          toggleValue={configuracoes.notificacoesEstoque}
          onToggle={() => toggleConfig('notificacoesEstoque')}
          badge="Crítico"
        />
        
        <ConfigItem
          icon={<Clock size={20} />}
          title="Alertas de Vencimento"
          description="Avisar sobre medicamentos próximos do vencimento"
          isToggle={true}
          toggleValue={configuracoes.alertasVencimento}
          onToggle={() => toggleConfig('alertasVencimento')}
          badge="Importante"
        />
      </div>
    </div>
  );
};

export default NotificationsSection;