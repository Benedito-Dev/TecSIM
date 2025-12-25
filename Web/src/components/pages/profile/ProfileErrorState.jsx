import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/layout/Sidebar';
import { useTheme } from '../../../context/ThemeContext';

const ProfileErrorState = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div 
      className="flex h-screen"
      style={{ background: theme.background }}
    >
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p style={{ color: theme.textSecondary }}>Erro ao carregar perfil</p>
          <button 
            onClick={() => navigate('/dashboard-enfermeiro')}
            className="mt-4 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
            style={{ background: theme.primary }}
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileErrorState;