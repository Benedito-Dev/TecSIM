import React from 'react';
import { Monitor, Sun, Moon, ZoomIn } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import ConfigItem from './ConfigItem';
import FontSizeControl from './FontSizeControl';

const AppearanceSection = ({ mode, toggleTheme, fontSize, increaseFont, decreaseFont }) => {
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
        <Monitor 
          size={24} 
          style={{ color: theme.primary }}
        />
        Aparência e Acessibilidade
      </h2>
      
      <div className="grid gap-4">
        <ConfigItem
          icon={mode === 'light' ? <Sun size={20} /> : <Moon size={20} />}
          title={mode === 'light' ? "Modo Claro" : "Modo Escuro"}
          description={`Alternar para tema ${mode === 'light' ? 'escuro' : 'claro'}`}
          isToggle={true}
          toggleValue={mode === 'dark'}
          onToggle={toggleTheme}
        />
        
        <ConfigItem
          icon={<ZoomIn size={20} />}
          title="Tamanho da Fonte"
          description={`Tamanho atual: ${fontSize}px - Ajuste para melhor legibilidade`}
          action={() => {}}
          badge="Acessibilidade"
        />
        
        <FontSizeControl 
          fontSize={fontSize}
          increaseFont={increaseFont}
          decreaseFont={decreaseFont}
        />
      </div>
    </div>
  );
};

export default AppearanceSection;