// context/ThemeContext.js
import React, { createContext, useState, useMemo } from 'react';

// Temas inline para evitar dependência externa
const lightTheme = {
  primary: '#0284c7',
  primaryLight: '#0ea5e9',
  primaryDark: '#0369a1',
  background: '#f8fafc',
  backgroundCard: '#ffffff',
  backgroundSecondary: '#f1f5f9',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  textOnPrimary: '#ffffff',
  textOnSuccess: '#ffffff',
  textOnError: '#ffffff',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  success: '#059669',
  error: '#dc2626',
  warning: '#d97706',
  info: '#0284c7'
};

const darkTheme = {
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryDark: '#2563eb',
  background: '#1e293b',
  backgroundCard: '#334155',
  backgroundSecondary: '#475569',
  textPrimary: '#f8fafc',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  textOnPrimary: '#ffffff',
  textOnSuccess: '#ffffff',
  textOnError: '#ffffff',
  border: '#64748b',
  borderLight: '#475569',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6'
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