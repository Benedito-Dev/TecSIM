import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const ProfileHeader = ({ farmaceutico, getIniciais }) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
      {/* Foto de perfil */}
      <div 
        className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`
        }}
      >
        {farmaceutico.foto_perfil ? (
          <img 
            src={farmaceutico.foto_perfil} 
            alt={farmaceutico.nome}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          getIniciais(farmaceutico.nome)
        )}
      </div>

      {/* Dados principais */}
      <div className="flex-1">
        <h2 
          className="text-2xl font-semibold mb-1"
          style={{ color: theme.textPrimary }}
        >
          {farmaceutico.nome}
        </h2>
        <p 
          className="text-lg mb-6"
          style={{ color: theme.textSecondary }}
        >
          {farmaceutico.cargo}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;