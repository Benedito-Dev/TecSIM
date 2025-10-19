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
  const [etapaProtocolo, setEtapaProtocolo] = useState(0);
  const [dadosCliente, setDadosCliente] = useState({});
  
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

  // Inicialização automática do protocolo farmacêutico
  useEffect(() => {
    // Sempre inicia como farmacêutico
    setUsuarioInfo({ tipo: 'farmaceutico' });
    
    // Inicia protocolo automaticamente
    setTimeout(() => {
      setEtapaProtocolo(1);
      addBotMessage(
        `💊 **TecSim - Protocolo Farmacêutico**\n\n` +
        `**ETAPA 1: IDENTIFICAÇÃO DO CLIENTE**\n\n` +
        `🔍 **Pergunte ao cliente:**\n\n` +
        `📋 **"Qual seu CPF?"** (para buscar no sistema)\n` +
        `👤 **"Qual seu nome completo?"**\n` +
        `🎂 **"Qual sua idade?"**\n` +
        `⚠️ **"Tem alguma alergia conhecida?"**\n` +
        `💊 **"Toma algum medicamento controlado?"**\n` +
        `🏥 **"Tem alguma doença crônica?"**\n\n` +
        `**Digite as informações coletadas ou 'próximo' para continuar**`
      );
    }, 1000);
  }, []);

  // Processamento das etapas do protocolo farmacêutico
  const processarEtapaProtocolo = async (mensagem) => {
    const msg = mensagem.toLowerCase();
    
    switch (etapaProtocolo) {
      case 1: // IDENTIFICAÇÃO
        if (msg.includes('próximo') || msg.includes('proximo')) {
          setEtapaProtocolo(2);
          addBotMessage(
            `**ETAPA 2: AVALIAÇÃO DOS SINTOMAS**\n\n` +
            `🤒 **Pergunte ao cliente:**\n\n` +
            `🔴 **"O que você está sentindo?"** (sintoma principal)\n` +
            `⏰ **"Há quanto tempo começou?"**\n` +
            `🌡️ **"Tem febre?"** (medir se possível)\n` +
            `📊 **"De 1 a 10, qual a intensidade?"**\n` +
            `💊 **"Já tomou algo para isso?"**\n` +
            `🔄 **"Já teve isso antes?"**\n` +
            `➕ **"Tem outros sintomas junto?"**\n\n` +
            `**Digite os sintomas relatados pelo cliente:**`
          );
        } else {
          setDadosCliente(prev => ({ ...prev, identificacao: mensagem }));
          addBotMessage(
            `✅ **Dados do cliente registrados!**\n\n` +
            `📝 **Informações coletadas:**\n${mensagem}\n\n` +
            `Digite 'próximo' para continuar para avaliação dos sintomas.`
          );
        }
        return true;
        
      case 2: // AVALIAÇÃO DOS SINTOMAS
        setDadosCliente(prev => ({ ...prev, sintomas: mensagem }));
        setEtapaProtocolo(3);
        
        const contextoAnalise = `
PROTOCOLO FARMACÊUTICO - ANÁLISE:
Dados do cliente: ${dadosCliente.identificacao}
Sintomas relatados: ${mensagem}

Como farmacêutico experiente, forneça:

1. **ELIMINAÇÃO DIFERENCIAL:**
   - 3 possíveis causas mais prováveis
   - Causas que devem ser descartadas

2. **PERGUNTAS ADICIONAIS:**
   - Que perguntas fazer para confirmar/descartar causas
   - Sinais específicos para observar

3. **SINAIS DE ALERTA:**
   - Quando encaminhar IMEDIATAMENTE ao médico
   - Red flags para este sintoma

4. **SUGESTÕES TERAPÊUTICAS:**
   - Medicamentos de venda livre apropriados
   - Dosagens seguras
   - Contraindicações importantes

5. **ORIENTAÇÕES NÃO FARMACOLÓGICAS:**
   - Medidas caseiras seguras
   - Quando retornar

Formato: Resposta prática para farmacêutico`;
        
        const formattedHistory = getFormattedHistory();
        const aiResponse = await getAIResponse(contextoAnalise, formattedHistory);
        
        if (aiResponse.success) {
          addBotMessage(
            `**ETAPA 3: ANÁLISE E ORIENTAÇÃO**\n\n` +
            `${aiResponse.response}\n\n` +
            `💊 **Apresente as opções ao cliente conforme orientação acima**\n` +
            `**Digite 'próximo' quando terminar a apresentação**`
          );
        }
        return true;
        
      case 3: // APRESENTAÇÃO DE SOLUÇÕES
        setEtapaProtocolo(4);
        addBotMessage(
          `**ETAPA 4: RESOLUÇÃO DE DÚVIDAS**\n\n` +
          `🤔 **Esclareça todas as dúvidas do cliente:**\n\n` +
          `• Como usar o medicamento?\n` +
          `• Efeitos colaterais possíveis?\n` +
          `• Interações medicamentosas?\n` +
          `• Quando retornar se não melhorar?\n\n` +
          `**Digite as dúvidas do cliente ou 'próximo':**`
        );
        return true;
        
      case 4: // RESOLUÇÃO DE DÚVIDAS
        if (!msg.includes('próximo') && !msg.includes('proximo')) {
          const contextoDuvidas = `
DÚVIDAS DO CLIENTE:
${mensagem}

Sintomas originais: ${dadosCliente.sintomas}
Dados do cliente: ${dadosCliente.identificacao}

Forneça respostas claras e seguras para as dúvidas, sempre priorizando a segurança do paciente.`;
          
          const formattedHistory = getFormattedHistory();
          const aiResponse = await getAIResponse(contextoDuvidas, formattedHistory);
          
          if (aiResponse.success) {
            addBotMessage(
              `💬 **Respostas para o cliente:**\n\n${aiResponse.response}\n\n` +
              `Digite 'próximo' para finalizar o atendimento.`
            );
          }
        } else {
          setEtapaProtocolo(5);
          addBotMessage(
            `**ETAPA 5: AÇÃO E ENCERRAMENTO**\n\n` +
            `🎯 **Próximos passos para o cliente:**\n\n` +
            `• Finalize a venda se houver\n` +
            `• Oriente sobre uso correto\n` +
            `• Informe quando retornar\n` +
            `• Entregue orientações por escrito\n\n` +
            `**Digite 'finalizar' para gerar o protocolo:**`
          );
        }
        return true;
        
      case 5: // AÇÃO E ENCERRAMENTO
        setEtapaProtocolo(6);
        const numeroProtocolo = `TEC${Date.now().toString().slice(-6)}`;
        
        addBotMessage(
          `**ETAPA 6: REGISTRO E ACOMPANHAMENTO**\n\n` +
          `✅ **ATENDIMENTO FINALIZADO**\n\n` +
          `📝 **PROTOCOLO: ${numeroProtocolo}**\n\n` +
          `**RESUMO DO ATENDIMENTO:**\n` +
          `• Cliente: ${dadosCliente.identificacao || 'Não informado'}\n` +
          `• Sintomas: ${dadosCliente.sintomas || 'Não informados'}\n` +
          `• Data: ${new Date().toLocaleDateString('pt-BR')}\n` +
          `• Horário: ${new Date().toLocaleTimeString('pt-BR')}\n\n` +
          `📞 **Informe ao cliente:**\n` +
          `"Seu protocolo é ${numeroProtocolo}. Guarde este número para acompanhamento."\n\n` +
          `🔄 **Digite 'novo' para iniciar novo atendimento**`
        );
        return true;
        
      case 6: // REINICIAR
        if (msg.includes('novo')) {
          setEtapaProtocolo(1);
          setDadosCliente({});
          addBotMessage(
            `🆕 **NOVO ATENDIMENTO INICIADO**\n\n` +
            `**ETAPA 1: IDENTIFICAÇÃO DO CLIENTE**\n\n` +
            `🔍 **Pergunte ao cliente:**\n\n` +
            `📋 **"Qual seu CPF?"** (para buscar no sistema)\n` +
            `👤 **"Qual seu nome completo?"**\n` +
            `🎂 **"Qual sua idade?"**\n` +
            `⚠️ **"Tem alguma alergia conhecida?"**\n` +
            `💊 **"Toma algum medicamento controlado?"**\n` +
            `🏥 **"Tem alguma doença crônica?"**\n\n` +
            `**Digite as informações coletadas ou 'próximo' para continuar**`
          );
        }
        return true;
        
      default:
        return false;
    }
  };

  // Lógica de envio de mensagem
  const handleSendMessage = async (messageText = newMessage) => {
    if (!messageText.trim() || isLoading) return;

    addUserMessage(messageText.trim());
    setNewMessage('');
    setIsLoading(true);

    try {
      // Protocolo estruturado para farmacêuticos
      if (usuarioInfo?.tipo === 'farmaceutico' && etapaProtocolo > 0 && !emTriagem) {
        const proximaEtapa = await processarEtapaProtocolo(messageText.trim());
        if (proximaEtapa) {
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
              
              // Para farmacêuticos, adiciona opções de encaminhamento
              if (usuarioInfo?.tipo === 'farmaceutico') {
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

      // Fluxo normal da IA (fora do protocolo)
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
        {usuarioInfo?.tipo === 'farmaceutico' ? (
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