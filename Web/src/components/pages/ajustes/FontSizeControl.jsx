import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const FontSizeControl = ({ fontSize, increaseFont, decreaseFont }) => {
  const { theme } = useTheme();

  return (
    <div 
      className="flex items-center justify-between p-4 rounded-lg"
      style={{
        background: theme.backgroundSecondary
      }}
    >
      <span 
        className="font-medium"
        style={{ color: theme.textPrimary }}
      >
        Tamanho da fonte:
      </span>
      <div className="flex items-center gap-3">
        <button
          onClick={decreaseFont}
          disabled={fontSize <= 14}
          className="p-2 border rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{
            background: theme.backgroundCard,
            borderColor: theme.border,
            color: theme.textPrimary
          }}
        >
          <ZoomOut size={18} />
        </button>
        <span 
          className="font-bold min-w-[40px] text-center"
          style={{ color: theme.primary }}
        >
          {fontSize}px
        </span>
        <button
          onClick={increaseFont}
          disabled={fontSize >= 24}
          className="p-2 border rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{
            background: theme.backgroundCard,
            borderColor: theme.border,
            color: theme.textPrimary
          }}
        >
          <ZoomIn size={18} />
        </button>
      </div>
    </div>
  );
};

export default FontSizeControl;