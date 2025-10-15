import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
    Send, Dot, ChevronLeft, Info, Home, User, MessageSquare, LogOut, 
    Menu, X, Pill, FileText, Clock, Settings, AlertTriangle, CheckCircle 
} from 'lucide-react'; 

import Sidebar from '../../components/SideBarr';
import { useAuth } from '../../context/UserContext';
import { ThemeContext } from '../../context/ThemeContext';
import { useElderMode } from '../../context/ElderModeContext';
import { getAIResponse } from '../../services/aiService';
import { useNavigate, useLocation, Link } from 'react-router-dom';

// ==================== UTILS DE TRIAGEM ====================

// Estado inicial da triagem
const iniciarTriagem = () => {
  return {
    etapa: 'inicial',
    sintomaPrincipal: '',
    sintomas: [],
    historicoRespostas: [],
    risco: 'baixo',
    protocoloAtivo: null,
    encaminhamentoRecomendado: null,
    perguntasRealizadas: 0
  };
};

// Protocolos de triagem
const protocolosTriagem = {
  dor_cabeca: {
    nome: "Cefaleia (Dor de Cabeça)",
    sintoma: "dor de cabeça",
    perguntas: [
      {
        id: 1,
        pergunta: "Há quanto tempo você está com essa dor?",
        tipo: "tempo",
        opcoes: ["Menos de 1 hora", "1-24 horas", "1-3 dias", "Mais de 3 dias"]
      },
      {
        id: 2,
        pergunta: "Em uma escala de 0 a 10, quão forte é sua dor?",
        tipo: "intensidade",
        opcoes: ["0-3 (Leve)", "4-6 (Moderada)", "7-8 (Forte)", "9-10 (Muito Forte)"]
      },
      {
        id: 3,
        pergunta: "A dor começou de repente e é a pior da sua vida?",
        tipo: "critico",
        opcoes: ["Sim", "Não"]
      },
      {
        id: 4,
        pergunta: "Está com febre, visão turva ou dificuldade para falar?",
        tipo: "critico",
        opcoes: ["Sim", "Não"]
      }
    ]
  },
  problemas_respiratorios: {
    nome: "Problemas Respiratórios",
    sintoma: "dificuldade para respirar",
    perguntas: [
      {
        id: 1,
        pergunta: "Você está com falta de ar em repouso?",
        tipo: "critico",
        opcoes: ["Sim", "Não"]
      },
      {
        id: 2,
        pergunta: "Seus lábios ou unhas estão azulados?",
        tipo: "critico", 
        opcoes: ["Sim", "Não"]
      },
      {
        id: 3,
        pergunta: "Há quanto tempo está com essa dificuldade?",
        tipo: "tempo",
        opcoes: ["Minutos", "Horas", "Dias"]
      }
    ]
  },
  dor_abdominal: {
    nome: "Dor Abdominal",
    sintoma: "dor na barriga",
    perguntas: [
      {
        id: 1,
        pergunta: "A dor é muito forte e constante?",
        tipo: "critico",
        opcoes: ["Sim", "Não"]
      },
      {
        id: 2,
        pergunta: "Está com vômitos ou febre?",
        tipo: "critico",
        opcoes: ["Sim", "Não"]
      }
    ]
  },
  febre: {
    nome: "Febre",
    sintoma: "febre",
    perguntas: [
      {
        id: 1,
        pergunta: "Qual é sua temperatura?",
        tipo: "intensidade",
        opcoes: ["Até 38°C", "38-39°C", "Acima de 39°C"]
      },
      {
        id: 2,
        pergunta: "Há quanto tempo está com febre?",
        tipo: "tempo",
        opcoes: ["Menos de 24h", "1-3 dias", "Mais de 3 dias"]
      }
    ]
  }
};

// Identificar protocolo baseado no sintoma
const identificarProtocolo = (mensagemUsuario) => {
  const mensagemLower = mensagemUsuario.toLowerCase();
  
  for (const [key, protocolo] of Object.entries(protocolosTriagem)) {
    if (mensagemLower.includes(protocolo.sintoma)) {
      return protocolo;
    }
  }
  
  // Busca por palavras-chave
  if (mensagemLower.includes('cabeça') || mensagemLower.includes('cefaleia') || mensagemLower.includes('enxaqueca')) {
    return protocolosTriagem.dor_cabeca;
  }
  
  if (mensagemLower.includes('respirar') || mensagemLower.includes('falta de ar') || mensagemLower.includes('asfixia')) {
    return protocolosTriagem.problemas_respiratorios;
  }
  
  if (mensagemLower.includes('barriga') || mensagemLower.includes('abdominal') || mensagemLower.includes('estômago')) {
    return protocolosTriagem.dor_abdominal;
  }

  if (mensagemLower.includes('febre') || mensagemLower.includes('temperatura') || mensagemLower.includes('calor')) {
    return protocolosTriagem.febre;
  }
  
  return null;
};

// Processar resposta do usuário
const processarRespostaTriagem = (estadoTriagem, respostaUsuario, perguntaAtual) => {
  const novoEstado = { ...estadoTriagem };
  
  // Adiciona resposta ao histórico
  novoEstado.historicoRespostas.push({
    pergunta: perguntaAtual.pergunta,
    resposta: respostaUsuario,
    timestamp: new Date().toISOString()
  });

  novoEstado.perguntasRealizadas += 1;

  // Avalia risco baseado na resposta
  const riscoResposta = avaliarRiscoResposta(respostaUsuario, perguntaAtual);
  if (riscoResposta > novoEstado.risco) {
    novoEstado.risco = riscoResposta;
  }

  return novoEstado;
};

// Avaliar risco da resposta
const avaliarRiscoResposta = (resposta, pergunta) => {
  const respostaLower = resposta.toLowerCase();
  
  // Respostas críticas
  if (pergunta.tipo === 'critico' && (respostaLower.includes('sim') || respostaLower.includes('sinto'))) {
    return 'alto';
  }
  
  // Intensidade alta
  if (pergunta.tipo === 'intensidade' && (respostaLower.includes('forte') || respostaLower.includes('9') || respostaLower.includes('10') || respostaLower.includes('acima'))) {
    return 'medio';
  }
  
  return 'baixo';
};

// Determinar próxima etapa
const determinarProximaEtapa = (estadoTriagem, respostaUsuario) => {
  const { protocoloAtivo, perguntasRealizadas, historicoRespostas } = estadoTriagem;
  
  if (!protocoloAtivo) return 'finalizada';
  
  // Se todas as perguntas foram respondidas
  if (perguntasRealizadas >= protocoloAtivo.perguntas.length) {
    return 'finalizada';
  }
  
  // Verificar se há critério para parada antecipada
  if (devePararAntecipadamente(historicoRespostas)) {
    return 'emergencia';
  }
  
  return 'continuar';
};

// Critérios para parada antecipada (emergência)
const devePararAntecipadamente = (historicoRespostas) => {
  const respostasCriticas = historicoRespostas.filter(resp => 
    resp.resposta.toLowerCase().includes('sim') && 
    (resp.pergunta.toLowerCase().includes('repente') ||
    resp.pergunta.toLowerCase().includes('pior') ||
    resp.pergunta.toLowerCase().includes('intensa') ||
    resp.pergunta.toLowerCase().includes('azulados'))
  );
  
  return respostasCriticas.length >= 2;
};

// Classificação final baseada nas respostas
const classificarTriagemFinal = (estadoTriagem) => {
  const { risco, historicoRespostas, protocoloAtivo } = estadoTriagem;
  
  if (risco === 'alto' || estadoTriagem.etapa === 'emergencia') {
    return {
      nivel: 'EMERGÊNCIA',
      cor: 'red',
      recomendacao: 'Encaminhamento IMEDIATO para serviço de emergência',
      tempo: 'Imediato',
      icone: '🚨'
    };
  }
  
  if (risco === 'medio' || historicoRespostas.length >= 3) {
    return {
      nivel: 'URGENTE',
      cor: 'orange',
      recomendacao: 'Consulta médica em 24-48 horas',
      tempo: '24-48 horas',
      icone: '⚠️'
    };
  }
  
  return {
    nivel: 'ROTINA',
    cor: 'green',
    recomendacao: 'Orientação farmacêutica e acompanhamento',
    tempo: '5-7 dias',
    icone: '✅'
  };
};

// Função para análise final da triagem
const getTriageAnalysis = async (triagemState) => {
  const classificacao = classificarTriagemFinal(triagemState);
  
  const analysisPrompt = `
Com base na triagem realizada, forneça um resumo profissional:

PROTOCOLO: ${triagemState.protocoloAtivo.nome}
RESPOSTAS COLETADAS: ${JSON.stringify(triagemState.historicoRespostas)}
CLASSIFICAÇÃO: ${classificacao.nivel}

Forneça um resumo conciso para o farmacêutico com:
1. Principais achados
2. Sinais de alerta identificados
3. Recomendação de encaminhamento

Mantenha o texto objetivo e profissional.
  `;

  const result = await getAIResponse(analysisPrompt, [], {
    temperature: 0.3,
    maxOutputTokens: 500
  });

  return {
    ...result,
    classificacao
  };
};

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
const QuickActionButtons = ({ onButtonPress, isLoading, theme }) => {
    const { fontSize } = useElderMode();
    
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

    const handlePress = (message) => {
        if (!isLoading) {
            onButtonPress(message);
        }
    };

    return (
        <div className="w-full px-4 max-w-4xl mx-auto">
            {/* Sintomas Comuns */}
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2" style={{ fontSize: `${fontSize * 0.9}px` }}>
                    Sintomas Comuns:
                </h3>
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                    {quickSymptoms.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => handlePress(action.message)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-3 bg-white border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-200 whitespace-nowrap flex-shrink-0 disabled:opacity-50"
                        >
                            <span className="text-lg">{action.icon}</span>
                            <span className="text-sm font-medium">{action.title}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Ações rápidas originais */}
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

// Componente de Resultado da Triagem
const TriageResult = ({ classificacao, analise }) => {
    const getIcon = () => {
        switch (classificacao.nivel) {
            case 'EMERGÊNCIA':
                return <AlertTriangle className="text-red-500" size={32} />;
            case 'URGENTE':
                return <Clock className="text-orange-500" size={32} />;
            case 'ROTINA':
                return <CheckCircle className="text-green-500" size={32} />;
            default:
                return <CheckCircle className="text-blue-500" size={32} />;
        }
    };

    const getBorderColor = () => {
        switch (classificacao.nivel) {
            case 'EMERGÊNCIA': return 'border-red-200';
            case 'URGENTE': return 'border-orange-200';
            case 'ROTINA': return 'border-green-200';
            default: return 'border-blue-200';
        }
    };

    const getBackgroundColor = () => {
        switch (classificacao.nivel) {
            case 'EMERGÊNCIA': return 'bg-red-50';
            case 'URGENTE': return 'bg-orange-50';
            case 'ROTINA': return 'bg-green-50';
            default: return 'bg-blue-50';
        }
    };

    return (
        <div className={`border-2 rounded-xl p-4 ${getBorderColor()} ${getBackgroundColor()} my-4`}>
            <div className="flex items-start gap-3">
                {getIcon()}
                <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{classificacao.icone} {classificacao.nivel}</h3>
                    <p className="text-gray-700 mb-3">{classificacao.recomendacao}</p>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Clock size={16} className="mr-1" />
                        <span>Tempo recomendado: {classificacao.tempo}</span>
                    </div>
                    {analise && (
                        <div className="bg-white rounded-lg p-3 border">
                            <p className="text-gray-800">{analise}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                    ⚠️ Esta triagem é inicial e não substitui avaliação médica profissional.
                </p>
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
    const [triagemState, setTriagemState] = useState(null);
    const [emTriagem, setEmTriagem] = useState(false);
    
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
                text: 'Olá! 👋 Sou o TecSim, seu assistente virtual de saúde. Como posso ajudar hoje?\n\nPosso ajudar com uma triagem inicial dos seus sintomas? Descreva brevemente o que está sentindo.',
                isBot: true,
                time: getCurrentTime(),
            },
        ]);
    }, []);

    // Scroll automático para novas mensagens
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Função para iniciar triagem
    const iniciarProcessoTriagem = (mensagemUsuario) => {
        const protocolo = identificarProtocolo(mensagemUsuario);
        
        if (protocolo) {
            const novaTriagem = iniciarTriagem();
            novaTriagem.protocoloAtivo = protocolo;
            novaTriagem.sintomaPrincipal = mensagemUsuario;
            novaTriagem.etapa = 'triagem_ativa';
            
            setTriagemState(novaTriagem);
            setEmTriagem(true);
            
            // Envia primeira pergunta do protocolo
            const primeiraPergunta = protocolo.perguntas[0];
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    text: `🔍 **Iniciando Triagem: ${protocolo.nome}**\n\n${primeiraPergunta.pergunta}`,
                    isBot: true,
                    time: getCurrentTime(),
                    isTriage: true
                }
            ]);
            
            return true;
        }
        
        return false;
    };

    // Função para processar resposta da triagem
    const processarRespostaTriagemChat = async (respostaUsuario) => {
        if (!triagemState || !emTriagem) return false;

        const perguntaAtual = triagemState.protocoloAtivo.perguntas[triagemState.perguntasRealizadas];
        const novaTriagem = processarRespostaTriagem(triagemState, respostaUsuario, perguntaAtual);

        const proximaEtapa = determinarProximaEtapa(novaTriagem, respostaUsuario);
        
        if (proximaEtapa === 'finalizada' || proximaEtapa === 'emergencia') {
            // Finaliza triagem e gera relatório
            await finalizarTriagem(novaTriagem);
            return true;
        } else {
            // Continua com próxima pergunta
            setTriagemState(novaTriagem);
            const proximaPergunta = novaTriagem.protocoloAtivo.perguntas[novaTriagem.perguntasRealizadas];
            
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    text: proximaPergunta.pergunta,
                    isBot: true,
                    time: getCurrentTime(),
                    isTriage: true
                }
            ]);
            return true;
        }
    };

    // Função para finalizar triagem
    const finalizarTriagem = async (estadoTriagem) => {
        const analise = await getTriageAnalysis(estadoTriagem);
        
        let mensagemFinal = '';
        
        if (analise.success) {
            mensagemFinal = `📋 **RELATÓRIO DE TRIAGEM**\n\n` +
                `🔸 **Classificação**: ${analise.classificacao.icone} ${analise.classificacao.nivel}\n` +
                `🔸 **Recomendação**: ${analise.classificacao.recomendacao}\n` +
                `🔸 **Tempo**: ${analise.classificacao.tempo}\n\n` +
                `**Resumo**: ${analise.response}\n\n` +
                `⚠️ *Este é um sistema de triagem inicial e não substitui avaliação médica profissional.*`;
        } else {
            mensagemFinal = `📋 **TRIAGEM FINALIZADA**\n\n` +
                `Classificação: ${analise.classificacao.icone} ${analise.classificacao.nivel}\n` +
                `Recomendação: ${analise.classificacao.recomendacao}\n\n` +
                `⚠️ *Procure um profissional de saúde para avaliação detalhada.*`;
        }
        
        setMessages(prev => [
            ...prev,
            {
                id: Date.now(),
                text: mensagemFinal,
                isBot: true,
                time: getCurrentTime(),
                isTriageResult: true
            }
        ]);
        
        // Reseta estado da triagem
        setTriagemState(null);
        setEmTriagem(false);
    };

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
            // Verifica se deve iniciar triagem
            if (!emTriagem && !triagemState) {
                const triagemIniciada = iniciarProcessoTriagem(userMessage.text);
                if (triagemIniciada) {
                    setIsLoading(false);
                    return;
                }
            }

            // Se está em triagem, processa como resposta da triagem
            if (emTriagem && triagemState) {
                const processada = await processarRespostaTriagemChat(userMessage.text);
                if (processada) {
                    setIsLoading(false);
                    return;
                }
            }

            // Se não é triagem, usa o fluxo normal do AI
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
                    text: '⚠️ Ocorreu um erro ao processar sua mensagem. Tente novamente.',
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

    // Renderizar mensagem
    const renderMessage = (msg) => {
        const isTriage = msg.isTriage || msg.isTriageResult;
        
        return (
            <div
                key={msg.id}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
            >
                <div
                    className={`max-w-[80%] md:max-w-xl rounded-2xl p-4 shadow-md ${
                        msg.isBot 
                            ? isTriage 
                                ? msg.isTriageResult
                                    ? 'bg-green-50 border-2 border-green-200'
                                    : 'bg-blue-50 border-2 border-blue-200'
                                : 'bg-white border border-gray-200'
                            : 'bg-blue-500 text-white'
                    } ${
                        msg.text.startsWith('⚠️') && 'bg-red-50 border border-red-200'
                    }`}
                >
                    {msg.isBot && (
                        <div className="text-xs font-semibold mb-1 flex items-center gap-2" 
                             style={{ fontSize: `${fontSize * 0.75}px` }}>
                            {isTriage ? '🔍 TecSim - Triagem' : 'TecSim'}
                            {isTriage && !msg.isTriageResult && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Triagem</span>
                            )}
                        </div>
                    )}
                    <div 
                        style={{ fontSize: `${fontSize}px` }}
                        className={`whitespace-pre-wrap ${
                            msg.isBot 
                                ? msg.text.startsWith('⚠️') 
                                    ? 'text-red-700' 
                                    : isTriage
                                        ? msg.isTriageResult
                                            ? 'text-green-800'
                                            : 'text-blue-800'
                                        : 'text-gray-800'
                                : 'text-white'
                        }`}
                    >
                        {msg.text}
                    </div>
                    <div className={`text-xs mt-2 ${
                        msg.isBot 
                            ? isTriage 
                                ? msg.isTriageResult ? 'text-green-500' : 'text-blue-500'
                                : 'text-gray-400'
                            : 'text-blue-200'
                    }`} 
                         style={{ fontSize: `${fontSize * 0.7}px` }} >
                        {msg.time}
                    </div>
                </div>
            </div>
        );
    };

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
                                    Chat - TecSim {emTriagem && '🔍'}
                                </h1>
                                <div className="flex items-center space-x-1" style={{ fontSize: `${fontSize * 0.85}px` }}>
                                    <div 
                                        className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}
                                    />
                                    <span className="font-medium">
                                        {isLoading ? 'Processando...' : emTriagem ? 'Em Triagem' : 'Online'}
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
                        {messages.map(renderMessage)}
                        
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
                    <QuickActionButtons 
                        onButtonPress={handleQuickActionPress} 
                        isLoading={isLoading} 
                        theme={theme}
                    />

                    {/* INPUT DE MENSAGEM */}
                    <div className="p-4 w-full"> 
                        <div className="max-w-4xl mx-auto flex space-x-3"> 
                            <textarea
                                ref={inputRef}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={emTriagem ? "Responda à pergunta de triagem..." : "Digite sua mensagem..."}
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