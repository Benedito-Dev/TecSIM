import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
    Send, Dot, ChevronLeft, Info, Home, User, MessageSquare, LogOut, 
    Menu, X, Pill, FileText, Clock, Settings, 
} from 'lucide-react'; 

import Sidebar from '../../components/SideBarr';
import { useAuth } from '../../context/UserContext';
import { ThemeContext } from '../../context/ThemeContext';
import { useElderMode } from '../../context/ElderModeContext';
import { getAIResponse } from '../../services/aiService';
import { useNavigate, useLocation, Link } from 'react-router-dom';

// ==================== COMPONENTES REUTILIZÁVEIS ====================

// Componente de Animação dos Pontos
const BouncingDots = ({ color = '#00c4cd' }) => {
    const [dots, setDots] = useState([0, 0, 0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.map((dot, index) => 
                Math.sin(Date.now() / 300 + index * 0.5) > 0 ? -6 : 0
            ));
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center py-2">
            {dots.map((translateY, i) => (
                <div
                    key={i}
                    className="mx-1 transition-transform duration-300"
                    style={{
                        transform: `translateY(${translateY}px)`,
                        color: color
                    }}
                >
                    <Dot size={24} />
                </div>
            ))}
        </div>
    );
};

// Componente QuickActionButtons
const QuickActionButtons = ({ onButtonPress, isLoading }) => {
    const { fontSize } = useElderMode();
    const { theme } = useContext(ThemeContext);
    
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

    const handlePress = (message) => {
        if (!isLoading) {
            onButtonPress(message);
        }
    };

    return (
        <div className="w-full px-4 max-w-4xl mx-auto">
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                {quickActions.map((action) => (
                    <button
                        key={action.id}
                        onClick={() => handlePress(action.message)}
                        disabled={isLoading}
                        className={`
                            flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 whitespace-nowrap flex-shrink-0
                            ${isLoading 
                                ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                                : `bg-white border-${theme.primary} text-${theme.primary} hover:bg-${theme.primary} hover:text-white cursor-pointer`
                            }
                        `}
                        style={{
                            borderColor: isLoading ? '#d1d5db' : theme.primary,
                            color: isLoading ? '#9ca3af' : theme.primary,
                            backgroundColor: isLoading ? '#f3f4f6' : '#ffffff'
                        }}
                    >
                        <div 
                            style={{ 
                                color: isLoading ? '#9ca3af' : theme.primary 
                            }}
                            className="transition-colors duration-200"
                        >
                            {action.icon}
                        </div>
                        <span className="text-sm font-medium transition-colors duration-200">
                            {action.title}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// ==================== COMPONENTE PRINCIPAL ====================
export default function ChatScreen() {
    const { user, Logout } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const messagesEndRef = useRef();
    const inputRef = useRef();

    const { fontSize } = useElderMode(); 
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Retorna hora atual formatada
    const getCurrentTime = () =>
        new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });

    // Mensagem inicial
    useEffect(() => {
        setMessages([
            {
                id: 1,
                text: 'Olá! 👋 Sou o TecSim, seu assistente virtual de saúde. Como posso ajudar hoje?',
                isBot: true,
                time: getCurrentTime(),
            },
        ]);
    }, []);

    // Scroll automático para novas mensagens
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Lógica de envio de mensagem
    const handleSendMessage = async (messageText = newMessage) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: messageText.trim(),
            isBot: false,
            time: getCurrentTime(),
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        setIsLoading(true);

        try {
            // Prepara o histórico, ignorando a mensagem inicial (ID 1)
            const formattedHistory = messages
                .filter(msg => msg.id !== 1)
                .map(msg => ({ isBot: msg.isBot, text: msg.text }));

            const aiResponse = await getAIResponse(userMessage.text, formattedHistory);

            if (aiResponse.success) {
                const botMessage = {
                    id: Date.now() + 1,
                    text: aiResponse.response,
                    isBot: true,
                    time: getCurrentTime(),
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                throw new Error(aiResponse.error);
            }
        } catch (err) {
            console.error('Erro:', err);
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 2,
                    text: '⚠️ Ocorreu um erro ao conectar com o assistente. Tente novamente.',
                    isBot: true,
                    time: getCurrentTime(),
                },
            ]);
            
            // Mostra alerta específico para erro de API
            if (err.message.includes('API key') || err.message.includes('chave')) {
                alert('Erro: Problema com a chave de API. Verifique as configurações.');
            }
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleQuickActionPress = (message) => {
        setNewMessage(message);
        // Pequeno atraso para o usuário ver o texto digitado antes de enviar
        setTimeout(() => handleSendMessage(message), 150);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleGoBack = () => navigate('/dashboard');

    return (
        <div className="flex flex-col h-screen bg-gray-50 font-sans">
            
            {/* SIDEBAR DE NAVEGAÇÃO */}
            <Sidebar />
            
            {/* CONTEÚDO PRINCIPAL */}
            <div className={`flex flex-col flex-1 h-screen transition-all duration-300`}>

                {/* HEADER */}
                <div 
                    className="shadow-lg z-10 w-full h-20 flex-shrink-0"
                    style={{ 
                        background: `linear-gradient(135deg, ${theme.primary || '#0048cdff'}, ${theme.secondary || '#0c87c4'})` 
                    }}
                >
                    <div className="py-4 text-white">
                        <div className="flex w-[100vw] justify-between items-center">

                            {/* BOTÃO VOLTAR */}
                            <button 
                                onClick={handleGoBack}
                                className="flex items-center space-x-1 p-1 -ml-1 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <ChevronLeft size={fontSize * 1.5 * 0.9} />
                                <span 
                                    className="font-semibold hidden sm:inline"
                                    style={{ fontSize: `${fontSize * 1.1}px` }}
                                >
                                    Dashboard
                                </span>
                            </button>

                            {/* TÍTULO E STATUS */}
                            <div className="flex flex-col items-center">
                                <h1 
                                    className="font-bold text-center"
                                    style={{ fontSize: `${fontSize * 1.3}px` }} 
                                >
                                    Chat - TecSim
                                </h1>
                                <div className="flex items-center space-x-1" style={{ fontSize: `${fontSize * 0.85}px` }}>
                                    <div 
                                        className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}
                                    />
                                    <span className="font-medium">
                                        {isLoading ? 'Processando...' : 'Online'}
                                    </span>
                                </div>
                            </div>

                            {/* ESPAÇO PARA ALINHAMENTO */}
                            <div className='w-[44px]' /> 
                        </div>
                    </div>
                </div>

                {/* ÁREA DE MENSAGENS */}
                <div className="flex-1 overflow-y-auto px-4 py-4 w-full h-[calc(100vh-14rem)]">
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[80%] md:max-w-xl rounded-2xl p-4 shadow-md ${
                                        msg.isBot 
                                            ? 'bg-white border border-gray-200' 
                                            : 'bg-blue-500 text-white'
                                        } ${
                                            msg.text.startsWith('⚠️') && 'bg-red-50 border border-red-200'
                                        }`}
                                >
                                    {msg.isBot && (
                                        <div className="text-xs font-semibold text-gray-500 mb-1" style={{ fontSize: `${fontSize * 0.75}px` }}>
                                            TecSim
                                        </div>
                                    )}
                                    <div 
                                        style={{ fontSize: `${fontSize}px` }}
                                        className={`whitespace-pre-wrap ${
                                            msg.isBot 
                                                ? msg.text.startsWith('⚠️') ? 'text-red-700' : 'text-gray-800'
                                                : 'text-white'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                    <div className={`text-xs mt-2 ${msg.isBot ? 'text-gray-400' : 'text-blue-200'}`} style={{ fontSize: `${fontSize * 0.7}px` }} >
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* INDICADOR DE DIGITAÇÃO */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                                    <BouncingDots color={theme.primary} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* RODAPÉ (Ações + Input) */}
                <div className="flex-shrink-0 w-full bg-white border-t border-gray-200">
                    
                    {/* BOTÕES DE AÇÃO RÁPIDA */}
                    <QuickActionButtons onButtonPress={handleQuickActionPress} isLoading={isLoading} />

                    {/* INPUT DE MENSAGEM */}
                    <div className="p-4 w-full"> 
                        <div className="max-w-4xl mx-auto flex space-x-3"> 
                            <textarea
                                ref={inputRef}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Digite sua mensagem..."
                                disabled={isLoading}
                                rows={1}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                                style={{ fontSize: `${fontSize}px`, minHeight: '48px', maxHeight: '100px' }} 
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={!newMessage.trim() || isLoading}
                                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center h-full"
                                style={{ minWidth: '48px', height: '48px' }} 
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Send size={fontSize * 1.25} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}