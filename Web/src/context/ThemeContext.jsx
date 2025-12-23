// context/ThemeContext.js
import React, { createContext, useState, useMemo } from 'react';

// Temas inline para evitar dependência externa
const lightTheme = {
  primary: '#0284c7',
  background: '#f8fafc',
  backgroundCard: '#ffffff',
  backgroundSecondary: '#f1f5f9',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textOnPrimary: '#ffffff',
  border: '#e2e8f0'
};

const darkTheme = {
  primary: '#0ea5e9',
  background: '#0f172a',
  backgroundCard: '#1e293b',
  backgroundSecondary: '#334155',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textOnPrimary: '#0f172a',
  border: '#475569'
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const toggleTheme = () => {
    setMode(prev => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode);
      return newMode;
    });
  };

  const theme = mode === 'light' ? lightTheme : darkTheme;

  const value = useMemo(() => ({ 
    theme, 
    toggleTheme, 
    mode,
    isDark: mode === 'dark'
  }), [mode, theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};