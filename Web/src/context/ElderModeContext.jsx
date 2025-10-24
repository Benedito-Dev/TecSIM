import React, { createContext, useState, useMemo, useContext } from "react";

const ElderModeContext = createContext();

export const ElderModeProvider = ({ children }) => {
  // Lista de tamanhos pré-definidos
  const fontSizes = [12, 16, 20, 24, 32];
  const [fontIndex, setFontIndex] = useState(1); // começa em 16 (index 1)

  const increaseFont = () => setFontIndex(prev => Math.min(prev + 1, fontSizes.length - 1));
  const decreaseFont = () => setFontIndex(prev => Math.max(prev - 1, 0));

  const value = useMemo(() => ({
    fontSize: fontSizes[fontIndex],
    fontIndex,
    increaseFont,
    decreaseFont,
  }), [fontIndex]);

  return (
    <ElderModeContext.Provider value={value}>
      {children}
    </ElderModeContext.Provider>
  );
};

// Hook para consumir
export const useElderMode = () => useContext(ElderModeContext);
