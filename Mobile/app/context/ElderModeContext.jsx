// ElderModeContext.js
import React, { createContext, useContext, useState } from "react";

const ElderModeContext = createContext();

export const ElderModeProvider = ({ children }) => {
  const [elderMode, setElderMode] = useState(false);

  const toggleElderMode = () => setElderMode(!elderMode);

  return (
    <ElderModeContext.Provider value={{ elderMode, toggleElderMode }}>
      {children}
    </ElderModeContext.Provider>
  );
};

export const useElderMode = () => useContext(ElderModeContext);
