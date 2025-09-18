// ElderModeContext.js
import React, { createContext, useContext, useState, useMemo } from "react";
import { lightTheme, darkTheme, elderTheme } from "../constants/temas";

const ElderModeContext = createContext();

export const ElderModeProvider = ({ children }) => {
  const [elderMode, setElderMode] = useState(false);
  const toggleElderMode = () => setElderMode((prev) => !prev);

  // Define qual tema aplicar
  const theme = elderMode ? elderTheme : lightTheme; // ou combine com dark se quiser

  const value = useMemo(
    () => ({ theme, elderMode, toggleElderMode }),
    [elderMode]
  );

  return (
    <ElderModeContext.Provider value={value}>
      {children}
    </ElderModeContext.Provider>
  );
};

export const useElderMode = () => useContext(ElderModeContext);
