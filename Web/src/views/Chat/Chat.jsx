// src/screens/Chat/ChatScreen.js
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useAuth } from '../../context/UserContext';
import { useNavigate } from "react-router-dom";
import { ThemeContext } from '../../context/ThemeContext';
import { useElderMode } from '../../context/ElderModeContext';
import { getAIResponse } from '../../services/aiService';
import QuickActionButtons from '../../components/Chat/QuickActionButtons';
import Sidebar from '../../components/SideBarr';
// Ícones de navegação adicionados
import { Send, Dot, ChevronLeft, Info } from 'lucide-react'; 

// ==================== COMPONENTE DE ANIMAÇÃO DOS PONTOS ====================
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

// ==================== COMPONENTE PRINCIPAL DO CHAT ====================
export default function ChatScreen() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Novo estado para simular a abertura da Sidebar (se necessário)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

    const messagesEndRef = useRef();
    const inputRef = useRef();

    const { fontSize } = useElderMode(); 
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    // Placeholder para a ação de Voltar
    const handleGoBack = () => {
        // Implementar a lógica de navegação (ex: history.push('/dashboard'))
        navigate('/dashboard') 
    };

    // Placeholder para abrir/fechar a Sidebar
    const handleOpenSidebar = () => {
        // Implementar a lógica para mostrar a Sidebar de detalhes do chat
        setIsSidebarOpen(prev => !prev);
    };

    // Retorna hora atual formatada
    const getCurrentTime = () =>
        new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });

    // Mensagem inicial
    useEffect(() => {
        setMessages([
            {
                id: 1,
                text: 'Olá! 👋 Sou o TecSim, seu assistente virtual de saúde.',
                isBot: true,
                time: getCurrentTime(),
            },
        ]);
    }, []);

    // Scroll automático para novas mensagens
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Lógica de envio de mensagem (mantida)
    const handleSendMessage = async () => {
        // ... (lógica de envio de mensagem)
        if (!newMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: newMessage.trim(),
            isBot: false,
            time: getCurrentTime(),
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        setIsLoading(true);

        try {
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
                    text: '⚠️ Ocorreu um erro. Tente novamente mais tarde.',
                    isBot: true,
                    time: getCurrentTime(),
                },
            ]);
            if (err.message.includes('API key')) {
                alert('Erro: Problema com a chave de API. Verifique as configurações.');
            }
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleQuickActionPress = (message) => {
        setNewMessage(message);
        setTimeout(() => handleSendMessage(), 150);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    // Fim da lógica de envio de mensagem

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            
            
            {/* TOPO/HEADER: Botão de Voltar e Botão de Sidebar */}
            <div 
                className="shadow-lg z-20" // Z-index para ficar acima do chat
                style={{ 
                    background: `linear-gradient(135deg, ${theme.primary || '#00c4cd'}, ${theme.secondary || '#0c87c4'})` 
                }}
            >
                <div className="max-w-4xl mx-auto px-4 py-3 text-white">
                    <div className="flex justify-between items-center">

                        {/* 1. BOTÃO DE VOLTAR PARA DASHBOARD */}
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

                        {/* TÍTULO CENTRALIZADO */}
                        <div className="flex flex-col items-center">
                            <h1 
                                className="font-bold text-center"
                                style={{ fontSize: `${fontSize * 1.3}px` }} 
                            >
                                Chat - TecSim
                            </h1>
                            {/* Status Online/Processando */}
                            <div className="flex items-center space-x-1" style={{ fontSize: `${fontSize * 0.85}px` }}>
                                <div 
                                    className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}
                                />
                                <span className="font-medium">
                                    {isLoading ? 'Processando...' : 'Online'}
                                </span>
                            </div>
                        </div>

                        {/* 2. BOTÃO PARA ABRIR SIDEBAR/DETALHES */}
                        <button
                            onClick={handleOpenSidebar}
                            className="p-2 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <Info size={fontSize * 1.5 * 0.9} />
                        </button>
                    </div>
                </div>
            </div>

            {/* CONTEÚDO PRINCIPAL (MENSAGENS) */}
            <div className="flex-1 overflow-y-auto px-4 py-4 w-full"> 
                {/* ... (Mensagens aqui, código anterior mantido) ... */}
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                        >
                            <div
                                className={`max-w-4xl rounded-2xl p-4 shadow-sm ${
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
                                    className={`
                                        ${
                                            msg.isBot 
                                                ? msg.text.startsWith('⚠️') ? 'text-red-700' : 'text-gray-800'
                                                : 'text-white'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                                <div className="text-xs mt-2" style={{ fontSize: `${fontSize * 0.7}px` }} >
                                    {msg.time}
                                </div>
                            </div>
                        </div>
                    ))}
                    
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

            {/* BOTÕES DE AÇÃO RÁPIDA: Mantém max-w-4xl para alinhamento limpo */}
            <div className="px-4 max-w-4xl mx-auto w-full">
                <QuickActionButtons onButtonPress={handleQuickActionPress} isLoading={isLoading} />
            </div>

            {/* INPUT: LARGURA TOTAL */}
            <div className="border-t border-gray-200 bg-white p-4 w-full"> 
                <div className="max-w-4xl mx-auto flex space-x-3"> 
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Digite sua mensagem..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        style={{ fontSize: `${fontSize}px` }} 
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isLoading}
                        className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                        style={{ minWidth: `${fontSize * 2.5}px` }} 
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send size={fontSize * 1.25} />
                        )}
                    </button>
                </div>
            </div>
            
            {/* SIDEBAR PLACEHOLDER (Use este div para renderizar sua sidebar) */}
            {isSidebarOpen && (
                <div className="fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl z-30 transition-transform duration-300">
                    <div className="p-4 border-b flex justify-between items-center bg-gray-100">
                        <h2 className="text-xl font-bold">Detalhes do Chat</h2>
                        <button onClick={handleOpenSidebar} className="p-2 rounded-full hover:bg-gray-300">
                            {/* Ícone para fechar */}
                            <ChevronLeft size={24} /> 
                        </button>
                    </div>
                    <div className="p-4 text-sm text-gray-600">
                        {/* Seu componente <Sidebar /> ou conteúdo de detalhes deve ir aqui */}
                        <p>Conteúdo da Sidebar. Feche para voltar ao chat.</p>
                        <p>Aqui você pode mostrar informações do usuário ou opções de configuração do chat.</p>
                    </div>
                </div>
            )}
        </div>
    );
}