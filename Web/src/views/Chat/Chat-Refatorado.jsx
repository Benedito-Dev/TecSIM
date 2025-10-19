import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Sidebar from '../../components/SideBarr';
import ChatHeader from '../../components/chat/ChatHeader';
import ChatHeaderNovosUsuarios from '../../components/chat/ChatHeaderNovosUsuarios';
import MessageList from '../../components/chat/MessageList';
import QuickActions from '../../components/chat/QuickActions';
import ChatInput from '../../components/chat/ChatInput';

import { useAuth } from '../../context/UserContext';
import { ThemeContext } from '../../context/ThemeContext';
import { useTriagem } from '../../hooks/useTriagem';
import { useChatMessages } from '../../hooks/useChatMessages';
import { getAIResponse } from '../../services/aiService';
import { protocolosGeneralizados } from '../../utils/protocolosGeneralizados';

export default function ChatScreen() {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [newMessage, setNewMessage] = useState('');
  const [usuarioInfo, setUsuarioInfo] = useState(null);
  const [protocoloAtivo, setProtocoloAtivo] = useState(null);
  
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

  // Inicialização para novos usuários
  useEffect(() => {
    const { novoUsuario, primeiroContato, cpfTentativa } = location.state || {};
    
    if (novoUsuario) {
      setUsuarioInfo({ 
        tipo: 'novo', 
        primeiroContato,
        cpfTentativa 
      });
      
      // Mensagem de boas-vindas para novos usuários
      setTimeout(() => {
        addBotMessage(
          `👋 **Olá! Bem-vindo ao TecSim**\n\n` +
          `Sou seu assistente de saúde e vou te ajudar com orientações básicas sobre medicamentos e cuidados.\n\n` +
          `🔍 **Como funciona:**\n` +
          `• Descreva seus sintomas ou dúvidas\n` +
          `• Farei perguntas para entender melhor\n` +
          `• Te orientarei sobre cuidados básicos\n` +
          `• Se necessário, te encaminharei para um especialista\n\n` +
          `⚠️ *Lembre-se: não substituo consulta médica profissional*\n\n` +
          `**O que você gostaria de saber hoje?**`
        );
      }, 1000);
    }
  }, [location.state]);

  // Análise de protocolo generalizado para novos usuários
  const analisarProtocoloGeneralizado = (mensagem) => {
    const protocoloDetectado = protocolosGeneralizados.detectarProtocolo(mensagem);
    
    if (protocoloDetectado) {
      setProtocoloAtivo(protocoloDetectado);
      return {
        sucesso: true,
        protocolo: protocoloDetectado,
        mensagemInicial: protocoloDetectado.mensagemInicial
      };
    }
    
    return { sucesso: false };
  };

  // Lógica de envio de mensagem
  const handleSendMessage = async (messageText = newMessage) => {
    if (!messageText.trim() || isLoading) return;

    addUserMessage(messageText.trim());
    setNewMessage('');
    setIsLoading(true);

    try {
      // Para novos usuários: protocolo generalizado primeiro
      if (usuarioInfo?.tipo === 'novo' && !emTriagem && !protocoloAtivo) {
        const resultadoProtocolo = analisarProtocoloGeneralizado(messageText.trim());
        
        if (resultadoProtocolo.sucesso) {
          addBotMessage(
            `🎯 **${resultadoProtocolo.protocolo.nome}**\n\n` +
            `${resultadoProtocolo.mensagemInicial}\n\n` +
            `${resultadoProtocolo.protocolo.perguntasIniciais[0]}`
          );
          setIsLoading(false);
          return;
        }
      }

      // Verifica se deve iniciar triagem
      if (!emTriagem) {
        const resultadoTriagem = iniciarProcessoTriagem(messageText.trim());
        if (resultadoTriagem.sucesso) {
          addTriageMessage(
            `🔍 **Iniciando Triagem: ${resultadoTriagem.protocolo.nome}**\n\n${resultadoTriagem.primeiraPergunta.pergunta}`
          );
          setIsLoading(false);
          return;
        }
      }

      // Se está em triagem, processa como resposta da triagem
      if (emTriagem) {
        const resultado = await processarResposta(messageText.trim());
        if (resultado.sucesso) {
          if (resultado.finalizada) {
            // Triagem finalizada
            const { classificacao, response } = resultado.analise;
            let mensagemFinal = '';
            
            if (resultado.analise.success) {
              mensagemFinal = `📋 **RELATÓRIO DE TRIAGEM**\n\n` +
                `🔸 **Classificação**: ${classificacao.icone} ${classificacao.nivel}\n` +
                `🔸 **Recomendação**: ${classificacao.recomendacao}\n` +
                `🔸 **Tempo**: ${classificacao.tempo}\n\n` +
                `**Resumo**: ${response}\n\n`;
              
              // Para novos usuários, adiciona opções de encaminhamento
              if (usuarioInfo?.tipo === 'novo') {
                mensagemFinal += `\n🏥 **ENCAMINHAMENTOS SUGERIDOS:**\n`;
                
                if (classificacao.nivel.includes('URGENTE') || classificacao.nivel.includes('EMERGÊNCIA')) {
                  mensagemFinal += `• 🚨 **Pronto Socorro** - Procure imediatamente\n`;
                } else if (classificacao.nivel.includes('MÉDICO')) {
                  mensagemFinal += `• 👨‍⚕️ **Clínico Geral** - Consulta em até 24h\n`;
                }
                
                // Sugestões de especialistas baseadas nos sintomas
                const especialistas = protocolosGeneralizados.sugerirEspecialistas(messageText);
                especialistas.forEach(esp => {
                  mensagemFinal += `• ${esp.icone} **${esp.nome}** - ${esp.motivo}\n`;
                });
              }
              
              mensagemFinal += `\n⚠️ *Este é um sistema de triagem inicial e não substitui avaliação médica profissional.*`;
            } else {
              mensagemFinal = `📋 **TRIAGEM FINALIZADA**\n\n` +
                `Classificação: ${classificacao.icone} ${classificacao.nivel}\n` +
                `Recomendação: ${classificacao.recomendacao}\n\n` +
                `⚠️ *Procure um profissional de saúde para avaliação detalhada.*`;
            }
            
            addTriageMessage(mensagemFinal, true);
          } else {
            // Continua triagem
            addTriageMessage(resultado.proximaPergunta.pergunta);
          }
          setIsLoading(false);
          return;
        }
      }

      // Fluxo normal do AI
      const formattedHistory = getFormattedHistory();
      const aiResponse = await getAIResponse(messageText.trim(), formattedHistory);

      if (aiResponse.success) {
        addBotMessage(aiResponse.response);
      } else {
        throw new Error(aiResponse.error);
      }
    } catch (err) {
      console.error('Erro:', err);
      addBotMessage('⚠️ Ocorreu um erro ao processar sua mensagem. Tente novamente.');
      
      if (err.message.includes('API key') || err.message.includes('chave')) {
        alert('Erro: Problema com a chave de API. Verifique as configurações.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickActionPress = (message) => {
    setNewMessage(message);
    setTimeout(() => handleSendMessage(message), 150);
  };

  const handleGoBack = () => navigate('/dashboard');

  return (
    <div 
      className="flex flex-col h-screen font-sans"
      style={{ background: theme.background }}
    >
      <Sidebar />
      
      <div className="flex flex-col flex-1 h-screen transition-all duration-300">
        {usuarioInfo?.tipo === 'novo' ? (
          <ChatHeaderNovosUsuarios 
            onGoBack={handleGoBack}
            isLoading={isLoading}
            emTriagem={emTriagem}
            protocoloAtivo={protocoloAtivo}
          />
        ) : (
          <ChatHeader 
            onGoBack={handleGoBack}
            isLoading={isLoading}
            emTriagem={emTriagem}
          />
        )}

        <MessageList 
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />

        <div 
          className="flex-shrink-0 w-full border-t"
          style={{
            background: theme.backgroundCard,
            borderColor: theme.border
          }}
        >
          <QuickActions 
            onButtonPress={handleQuickActionPress} 
            isLoading={isLoading} 
          />

          <ChatInput 
            message={newMessage}
            setMessage={setNewMessage}
            onSend={handleSendMessage}
            isLoading={isLoading}
            emTriagem={emTriagem}
          />
        </div>
      </div>
    </div>
  );
}