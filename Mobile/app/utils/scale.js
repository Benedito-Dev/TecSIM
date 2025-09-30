// utils/scale.js
import { useElderMode } from "../context/ElderModeContext";

export const useScale = () => {
  const { fontSize } = useElderMode();

  const scaleIcon = (baseSize) => (baseSize / 16) * fontSize;
  const scaleFont = (size) => (size / 16) * fontSize;
  const scaleSpacing = (value) => (value / 16) * fontSize;

  return { scaleIcon, scaleFont, scaleSpacing };
};
