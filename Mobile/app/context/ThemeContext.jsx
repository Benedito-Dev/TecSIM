// ThemeContext.js
import React, { createContext, useState, useMemo } from "react";
import { lightTheme, darkTheme, elderTheme } from "../constants/temas";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light"); // light | dark | elder

  const toggleTheme = () => setMode(prev => (prev === "light" ? "dark" : "light"));

  const setElderMode = (enable) => setMode(enable ? "elder" : "light");

  const elderMode = mode === "elder";

  const theme =
    mode === "elder" ? elderTheme :
    mode === "light" ? lightTheme :
    darkTheme;

  const value = useMemo(
    () => ({ theme, mode, toggleTheme, setElderMode, elderMode }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

