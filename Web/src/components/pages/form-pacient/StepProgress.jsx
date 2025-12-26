import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const StepProgress = ({ currentStep }) => {
  const { theme } = useTheme();
  
  const steps = [
    { number: 1, label: "Dados Pessoais" },
    { number: 2, label: "Dados de Saúde" },
    { number: 3, label: "Termo LGPD" },
    { number: 4, label: "Confirmação" }
  ];

  return (
    <div 
      className="p-6 rounded-2xl border mb-6"
      style={{
        background: theme.backgroundCard,
        borderColor: theme.border
      }}
    >
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div 
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number 
                  ? "text-white" 
                  : "text-gray-500"
              } font-semibold`}
              style={{
                background: currentStep >= step.number ? theme.primary : 'transparent',
                borderColor: currentStep >= step.number ? theme.primary : theme.border
              }}
            >
              {currentStep > step.number ? <CheckCircle size={20} /> : step.number}
            </div>
            <div className="ml-3">
              <div 
                className="text-sm font-medium"
                style={{
                  color: currentStep >= step.number ? theme.primary : theme.textSecondary
                }}
              >
                {step.label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div 
                className="w-12 h-0.5 mx-4"
                style={{
                  background: currentStep > step.number ? theme.primary : theme.border
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgress;