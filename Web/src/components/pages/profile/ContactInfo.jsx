import React from 'react';
import { Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const ContactInfo = ({ enfermeiro, formatarData }) => {
  const { theme } = useTheme();

  const contactItems = [
    {
      icon: Mail,
      label: 'Email',
      value: enfermeiro.email
    },
    {
      icon: Phone,
      label: 'Telefone',
      value: enfermeiro.telefone || '(11) 95555-1234'
    },
    {
      icon: Calendar,
      label: 'Data de Admissão',
      value: formatarData(enfermeiro.data_admissao)
    },
    {
      icon: MapPin,
      label: 'Unidade',
      value: enfermeiro.unidade
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {contactItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div 
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg"
            style={{
              background: theme.backgroundSecondary,
              color: theme.textPrimary
            }}
          >
            <IconComponent size={20} style={{ color: theme.primary }} />
            <div>
              <p 
                className="text-sm"
                style={{ color: theme.textSecondary }}
              >
                {item.label}
              </p>
              <p className="font-medium">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactInfo;