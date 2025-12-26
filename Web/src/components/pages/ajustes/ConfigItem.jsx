import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const ConfigItem = ({ 
  icon, 
  title, 
  description, 
  action, 
  isToggle = false, 
  toggleValue, 
  onToggle, 
  badge 
}) => {
  const { theme } = useTheme();

  return (
    <div 
      className="flex items-center justify-between p-6 rounded-xl border hover:shadow-md transition-all duration-200"
      style={{
        background: theme.backgroundCard,
        borderColor: theme.border,
        color: theme.textPrimary
      }}
    >
      <div className="flex items-center gap-4 flex-1">
        <div 
          className="p-3 rounded-xl"
          style={{
            background: theme.primaryLight,
            color: theme.primary
          }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 
              className="font-semibold text-lg"
              style={{ color: theme.textPrimary }}
            >
              {title}
            </h3>
            {badge && (
              <span 
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  background: theme.success,
                  color: theme.textOnSuccess
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <p 
            className="mt-1"
            style={{ color: theme.textSecondary }}
          >
            {description}
          </p>
        </div>
      </div>
      
      {isToggle ? (
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
          style={{
            backgroundColor: toggleValue ? theme.primary : theme.borderLight
          }}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              toggleValue ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      ) : (
        <button
          onClick={action}
          className="font-medium px-4 py-2 rounded-lg transition-colors"
          style={{
            background: theme.primary,
            color: theme.textOnPrimary
          }}
        >
          Configurar
        </button>
      )}
    </div>
  );
};

export default ConfigItem;