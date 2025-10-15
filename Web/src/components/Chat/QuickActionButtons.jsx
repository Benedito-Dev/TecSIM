// components/QuickActionButtons.jsx
import React, { useContext } from 'react';
import { Clock, FileText, User, Pill } from 'lucide-react';
import { useElderMode } from '../../context/ElderModeContext';
import { ThemeContext } from '../../context/ThemeContext';

const QuickActionButtons = ({ onButtonPress, isLoading }) => {
    const { fontSize } = useElderMode();
    const { theme } = useContext(ThemeContext);
    
    const quickSymptoms = [
        {
            id: 1,
            title: 'Dor de Cabeça',
            icon: '🤕',
            message: 'Estou com dor de cabeça'
        },
        {
            id: 2,
            title: 'Problemas Respiratórios',
            icon: '😮‍💨',
            message: 'Estou com dificuldade para respirar'
        },
        {
            id: 3,
            title: 'Dor Abdominal',
            icon: '🤢',
            message: 'Estou com dor na barriga'
        },
        {
            id: 4,
            title: 'Febre',
            icon: '🌡️',
            message: 'Estou com febre'
        }
    ];

    const quickActions = [
        {
            id: 1,
            title: 'Ver histórico',
            icon: <Clock size={16} />,
            message: 'Gostaria de ver meu histórico médico'
        },
        {
            id: 2,
            title: 'Nova prescrição',
            icon: <FileText size={16} />,
            message: 'Como solicitar uma nova prescrição médica?'
        },
        {
            id: 3,
            title: 'Alterar dados',
            icon: <User size={16} />,
            message: 'Preciso alterar meus dados pessoais'
        },
        {
            id: 4,
            title: 'Dúvidas medicamentos',
            icon: <Pill size={16} />,
            message: 'Tenho dúvidas sobre meus medicamentos'
        }
    ];

    return (
        <div className="w-full">
            {/* Sintomas Rápidos */}
            <div className="ml-80 px-4 pt-4">
                <h3 
                    className="font-semibold mb-3"
                    style={{ 
                        fontSize: `${fontSize * 0.9}px`,
                        color: theme.textPrimary 
                    }}
                >
                    Sintomas Comuns
                </h3>
                <div className="flex space-x-3 overflow-x-auto pb-3 scrollbar-hide">
                    {quickSymptoms.map((symptom) => (
                        <button
                            key={symptom.id}
                            onClick={() => onButtonPress(symptom.message)}
                            disabled={isLoading}
                            className="flex-shrink-0 px-4 py-3 rounded-xl border transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: theme.backgroundCard,
                                borderColor: theme.border,
                                color: theme.textPrimary,
                                minWidth: '140px'
                            }}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-2xl">{symptom.icon}</span>
                                <span 
                                    className="font-medium text-center"
                                    style={{ fontSize: `${fontSize * 0.85}px` }}
                                >
                                    {symptom.title}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Ações Rápidas */}
            <div className="ml-80 pt-2 pb-4">
                <h3 
                    className="font-semibold mb-3"
                    style={{ 
                        fontSize: `${fontSize * 0.9}px`,
                        color: theme.textPrimary 
                    }}
                >
                    Ações Rápidas
                </h3>
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                    {quickActions.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => onButtonPress(action.message)}
                            disabled={isLoading}
                            className="flex-shrink-0 px-4 py-3 rounded-xl border transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: theme.backgroundCard,
                                borderColor: theme.border,
                                color: theme.textPrimary,
                                minWidth: '140px'
                            }}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <div style={{ color: theme.primary }}>
                                    {action.icon}
                                </div>
                                <span 
                                    className="font-medium text-center"
                                    style={{ fontSize: `${fontSize * 0.85}px` }}
                                >
                                    {action.title}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuickActionButtons;