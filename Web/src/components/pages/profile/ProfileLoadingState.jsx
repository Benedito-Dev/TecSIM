import React from 'react';
import Sidebar from '../../../components/layout/Sidebar';
import { useTheme } from '../../../context/ThemeContext';

const ProfileLoadingState = () => {
  const { theme } = useTheme();

  return (
    <div 
      className="flex h-screen"
      style={{ background: theme.background }}
    >
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: theme.primary }}
          ></div>
          <p 
            className="mt-4"
            style={{ color: theme.textSecondary }}
          >
            Carregando perfil...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileLoadingState;