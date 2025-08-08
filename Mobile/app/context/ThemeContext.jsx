import React, { createContext, useState, useMemo } from 'react';
import { lightTheme, darkTheme } from '../constants/temas';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light'); // "light" ou "dark"

  const toggleTheme = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = mode === 'light' ? lightTheme : darkTheme;

  const value = useMemo(() => ({ theme, toggleTheme, mode }), [mode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
