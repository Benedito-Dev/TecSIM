import React from 'react';
import { Settings, Database, Printer, Monitor } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import ConfigItem from './ConfigItem';

const SystemSection = ({ configuracoes, toggleConfig }) => {
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
        <Settings 
          size={24} 
          style={{ color: theme.success }}
        />
        Sistema e Performance
      </h2>
      
      <div className="grid gap-4">
        <ConfigItem
          icon={<Database size={20} />}
          title="Backup Automático"
          description="Realizar backup automático dos dados a cada 24h"
          isToggle={true}
          toggleValue={configuracoes.autoBackup}
          onToggle={() => toggleConfig('autoBackup')}
        />
        
        <ConfigItem
          icon={<Printer size={20} />}
          title="Impressão Automática"
          description="Imprimir automaticamente receitas e relatórios"
          isToggle={true}
          toggleValue={configuracoes.impressaoAutomatica}
          onToggle={() => toggleConfig('impressaoAutomatica')}
        />
        
        <ConfigItem
          icon={<Monitor size={20} />}
          title="Modo Rápido"
          description="Otimizar interface para atendimento rápido"
          isToggle={true}
          toggleValue={configuracoes.modoRapido}
          onToggle={() => toggleConfig('modoRapido')}
          badge="Recomendado"
        />
      </div>
    </div>
  );
};

export default SystemSection;