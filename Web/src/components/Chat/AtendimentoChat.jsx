import React, { useState, useContext } from 'react';
import { Send, Bot } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { useTriagem } from '../../hooks/useTriagem';
import { useChatMessages } from '../../hooks/useChatMessages';
import { usePacienteCondicoes } from '../../hooks/usePacienteCondicoes';
import { getAIResponse } from '../../services/aiService';
import BouncingDots from './BouncingDots';

const AtendimentoChat = ({ paciente, onTriagemComplete, mensagemInicial }) => {
  const { theme } = useContext(ThemeContext);
  const [newMessage, setNewMessage] = useState('');
  const [mensagemInicialEnviada, setMensagemInicialEnviada] = useState(false);
  
  const {
    messages,
    isLoading,
    setIsLoading,
    messagesEndRef,
    addUserMessage,
    addBotMessage,
    addTriageMessage,
    getFormattedHistory
  } = useChatMessages();

  const {
    emTriagem,
    iniciarProcessoTriagem,
    processarResposta,
  } = useTriagem();

  const { condicoes } = usePacienteCondicoes(paciente?.id);

  // Envia mensagem de boas-vindas personalizada quando carregado na tela de atendimento
  React.useEffect(() => {
    if (paciente && !mensagemInicialEnviada) {
      setTimeout(() => {
        const mensagemBoasVindas = `Olá, ${paciente.nome}! 👋\n\nSou seu assistente de IA personalizado para este atendimento. Tenho acesso ao seu histórico médico e posso ajudá-lo com:\n\n• Orientações sobre seus medicamentos\n• Verificação de interações medicamentosas\n• Acompanhamento farmacêutico\n• Esclarecimento de dúvidas sobre saúde\n\nComo posso ajudá-lo hoje?`;
        
        addBotMessage(mensagemBoasVindas);
        setMensagemInicialEnviada(true);
      }, 1000);
    }
    
    // Mantém a funcionalidade original para mensagens iniciais específicas
    if (mensagemInicial && !mensagemInicialEnviada && paciente) {
      setTimeout(() => {
        setNewMessage(mensagemInicial);
        setMensagemInicialEnviada(true);
        setTimeout(() => {
          handleSendMessageAuto(mensagemInicial);
        }, 500);
      }, 1500);
    }
  }, [paciente, mensagemInicial, mensagemInicialEnviada, addBotMessage]);

  const handleSendMessageAuto = async (message) => {
    if (!message.trim() || isLoading) return;

    addUserMessage(message.trim());
    const messageText = message.trim();
    setNewMessage('');
    setIsLoading(true);

    await processarMensagem(messageText);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    addUserMessage(newMessage.trim());
    const messageText = newMessage.trim();
    setNewMessage('');
    setIsLoading(true);

    await processarMensagem(messageText);
  };

  // Função para criar contexto personalizado do paciente para a IA
  const criarContextoPaciente = () => {
    const condicoesTexto = condicoes.map(c => `${c.condicao} (${c.severidade})`).join(', ');
    
    return {
      paciente: {
        nome: paciente.nome,
        cpf: paciente.cpf,
        telefone: paciente.telefone,
        email: paciente.email,
        endereco: paciente.endereco,
        dataNascimento: paciente.dataNascimento,
        idade: paciente.idade || 'Não informado',
        medicamentosContinuos: paciente.medicamentosContinuos || [],
        alergias: paciente.alergias || [],
        condicoesCronicas: paciente.condicoesCronicas || [],
        condicoesAtuais: condicoes || [],
        ultimaCompra: paciente.ultimaCompra || 'Não informado',
        status: paciente.status || 'ativo'
      },
      contextoAtendimento: {
        data: new Date().toLocaleString('pt-BR'),
        tipo: 'Atendimento Farmacêutico Personalizado',
        farmacia: 'TecSim - Sistema Inteligente'
      }
    };
  };

  const processarMensagem = async (messageText) => {
    try {
      // Verifica se deve iniciar triagem
      if (!emTriagem) {
        const resultadoTriagem = iniciarProcessoTriagem(messageText, condicoes);
        if (resultadoTriagem.sucesso) {
          const tipoProtocolo = resultadoTriagem.especializado ? '🎯 **Protocolo Especializado**' : '🔍 **Triagem Padrão**';
          addTriageMessage(
            `${tipoProtocolo}: ${resultadoTriagem.protocolo.nome}\n\n${resultadoTriagem.primeiraPergunta.pergunta}`
          );
          setIsLoading(false);
          return;
        }
      }

      // Se está em triagem
      if (emTriagem) {
        const resultado = await processarResposta(messageText);
        if (resultado.sucesso) {
          if (resultado.finalizada) {
            const { classificacao, response } = resultado.analise;
            
            onTriagemComplete?.({
              classificacao: classificacao.nivel,
              recomendacao: classificacao.recomendacao,
              resumo: response,
              paciente: paciente.nome
            });

            addTriageMessage(
              `📋 **TRIAGEM FINALIZADA**\n\n` +
              `🔸 **Classificação**: ${classificacao.icone} ${classificacao.nivel}\n` +
              `🔸 **Recomendação**: ${classificacao.recomendacao}\n\n` +
              `**Resumo**: ${response || 'Triagem concluída'}\n\n` +
              `⚠️ *Protocolo executado conforme diretrizes da Pague Menos*`
            , true);
          } else {
            addTriageMessage(resultado.proximaPergunta.pergunta);
          }
          setIsLoading(false);
          return;
        }
      }

      // Cria contexto personalizado do paciente
      const contextoPaciente = criarContextoPaciente();
      
      // Prompt personalizado para a IA
      const promptPersonalizado = `Você é um assistente farmacêutico especializado da TecSim, atendendo especificamente o paciente ${paciente.nome}.

DADOS DO PACIENTE:
${JSON.stringify(contextoPaciente, null, 2)}

INSTRUÇÕES:
- Você tem acesso completo ao histórico médico deste paciente
- Seja natural, empático e personalizado nas respostas
- Use o nome do paciente quando apropriado
- Baseie suas respostas nos dados específicos dele
- Sempre priorize a segurança e oriente procurar profissionais quando necessário
- Seja conversacional, não robotizado
- Se não souber algo específico, seja honesto mas ofereça ajuda alternativa

Pergunta do paciente: ${messageText}`;

      // Envia para a IA com contexto personalizado
      const formattedHistory = getFormattedHistory();
      const aiResponse = await getAIResponse(promptPersonalizado, formattedHistory);

      if (aiResponse.success) {
        addBotMessage(aiResponse.response);
      } else {
        throw new Error(aiResponse.error);
      }
      
    } catch (err) {
      console.error('Erro:', err);
      addBotMessage(`Desculpe, ${paciente.nome}, tive um problema técnico. Pode repetir sua pergunta? Estou aqui para ajudá-lo com suas dúvidas sobre medicamentos, alergias e cuidados de saúde.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickButton = (message) => {
    setNewMessage(message);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const quickButtons = [
    { 
      text: "Meus Medicamentos", 
      message: "Quais são os meus medicamentos?",
      icon: "💊",
      color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
    },
    { 
      text: "Minhas Alergias", 
      message: "Quais são as minhas alergias?",
      icon: "⚠️",
      color: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
    },
    { 
      text: "Interações", 
      message: "Há interações entre meus medicamentos?",
      icon: "🔍",
      color: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
    }
  ];

  return (
    <div className="h-96 flex flex-col">

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                msg.isBot
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-white'
              } ${
                msg.isTriage ? 'border-l-4 border-blue-500' : ''
              } ${
                msg.isTriageResult ? 'border-l-4 border-green-500 bg-green-50' : ''
              }`}
              style={{
                background: !msg.isBot ? theme.primary : undefined
              }}
            >
              {msg.isBot && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Bot size={12} />
                  {msg.isTriage ? 'Triagem' : paciente ? `TecSim - ${paciente.nome}` : 'TecSim'}
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className="text-xs opacity-70 mt-1">{msg.time}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <BouncingDots color={theme.primary} />
            </div>
          </div>
        )}

      </div>

      {/* Botões Rápidos */}
      {!emTriagem && messages.length <= 1 && (
        <div className="px-3 py-2 border-t bg-gray-50">
          <div className="text-xs text-gray-600 mb-2 font-medium">💊 Consultas Rápidas:</div>
          <div className="grid grid-cols-3 gap-1">
            {quickButtons.map((button, index) => (
              <button
                key={index}
                onClick={() => handleQuickButton(button.message)}
                disabled={isLoading}
                className={`text-xs px-2 py-2 border rounded-lg transition-colors disabled:opacity-50 text-center flex flex-col items-center gap-1 hover:shadow-sm ${button.color}`}
              >
                <span className="text-sm">{button.icon}</span>
                <span className="leading-tight">{button.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input de Mensagem */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={emTriagem ? "Responda à pergunta..." : "Digite sua mensagem..."}
            disabled={isLoading}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
            style={{ background: theme.primary }}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AtendimentoChat;