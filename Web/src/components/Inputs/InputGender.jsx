import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

// Ícones simples para dar um toque visual
const getIcon = (value, isSelected) => {
    const colorClass = isSelected ? 'text-sky-600' : 'text-gray-400';
    const baseClass = `w-8 h-8 ${colorClass}`;

    switch (value) {
        case 'man':
            return (
                <svg className={baseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9v1.5m-4.5-1.5v1.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            );
        case 'woman':
            return (
                <svg className={baseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM10.5 8.25V6.75A1.5 1.5 0 0 1 12 5.25v1.5M13.5 8.25v-1.5A1.5 1.5 0 0 0 12 5.25v1.5" />
                </svg>
            );
        case 'neutral':
            return (
                <svg className={baseClass} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a.75.75 0 1 0-1.5 0v.15a.75.75 0 0 0 1.5 0v-.15ZM12 11.25a.75.75 0 1 0 0 1.5h.008a.75.75 0 1 0 0-1.5H12ZM9.75 16.5a.75.75 0 1 0 0 1.5h.008a.75.75 0 1 0 0-1.5H9.75ZM18.75 12a.75.75 0 1 0 0 1.5h.008a.75.75 0 1 0 0-1.5h-.008ZM5.25 12a.75.75 0 1 0 0 1.5h.008a.75.75 0 1 0 0-1.5h-.008Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12 11.25v1.5M10.5 8.25v1.5M13.5 8.25v1.5" />
                </svg>
            );
        default:
            return null;
    }
};


export default function GenderInput({
    value,
    onChange,
    theme: propTheme,
    fontSize = 16, // controla escala
}) {
    const contextTheme = useContext(ThemeContext)?.theme;
    const theme = propTheme || contextTheme || { textPrimary: '#1f2937', primary: '#0284c7' }; // Fallback theme

    const options = [
        { label: 'Homem', value: 'man' },
        { label: 'Mulher', value: 'woman' },
        { label: 'Prefiro não dizer', value: 'neutral' },
    ];

    // Mantendo a função de escala para o texto, se precisar de customização
    const scale = (size) => (size / 16) * fontSize;

    return (
        // Removendo a largura fixa e aplicando classes responsivas
        <div className="w-full mt-3 mb-3"> 


            {/* Layout de Cartões: Grid responsivo de 3 colunas */}
            <div className="grid grid-cols-3 gap-4">
                {options.map((option) => {
                    const selected = value === option.value;
                    const Icon = getIcon(option.value, selected);

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            // Classes do cartão: Foco no feedback visual (borda e cor de fundo)
                            className={`
                                flex flex-col items-center justify-center p-4 h-full
                                border-2 rounded-xl cursor-pointer transition-all duration-200 
                                shadow-md hover:shadow-lg hover:scale-[1.02]
                                ${selected 
                                    ? 'border-sky-600 bg-sky-50 text-sky-800 ring-2 ring-sky-300' 
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-sky-400'
                                }
                            `}
                        >
                            {/* Ícone */}
                            <div className="mb-1">
                                {Icon}
                            </div>
                            
                            {/* Rótulo */}
                            <span
                                className="font-medium text-sm text-center"
                                style={{ fontSize: scale(14) }} // Ligeiramente menor para caber
                            >
                                {option.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}