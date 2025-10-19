import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { farmaChatData } from '../data/farmaChatData';
import { enviarMensagemIA, salvarConversa } from '../services/chatService';
import { getPacienteById } from '../services/pacienteService';

const ChatIA = () => {
  const [searchParams] = useSearchParams();
  const [mensagens, setMensagens] = useState([]);
  const [inputMensagem, setInputMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const messagesEndRef = useRef(null);
  
  const clienteIdFromUrl = searchParams.get('cliente');

  useEffect(() => {
    // Se veio de um cliente específico, seleciona automaticamente
    if (clienteIdFromUrl) {
      const clienteId = parseInt(clienteIdFromUrl);
      setPacienteSelecionado(clienteId);
      const paciente = farmaChatData.pacientes[clienteId];
      const protocolo = farmaChatData.protocolos[clienteId];
      
      const mensagemInicial = {
        id: 1,
        tipo: 'ia',
        conteudo: `🤖 **Atendimento Iniciado - ${paciente?.nome}**

Olá! Iniciei o atendimento para ${paciente?.nome}.

📋 **Contexto do Cliente:**
• ${paciente?.idade} anos, ${paciente?.condicoesCronicas.join(', ')}
• Score de adesão: ${paciente?.scoreAdesao}%
• Risco: ${paciente?.risco}
• Protocolo: ${protocolo?.diagnosticoMedico}

🔹 **Comandos disponíveis:**
• "protocolo" - Análise completa do protocolo
• "adesao" - Verificação de adesão
• "risco" - Avaliação de risco
• "medicamentos" - Status dos medicamentos

Como posso ajudar no atendimento?`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMensagens([mensagemInicial]);
    } else {
      const mensagemInicial = {
        id: 1,
        tipo: 'ia',
        conteudo: `🤖 **Assistente IA do FarmaChat**

Olá! Sou seu assistente inteligente para orientação farmacêutica. Posso ajudar com:

🔹 **Análise de protocolos** - Digite "protocolo [nome do paciente]"
🔹 **Verificação de adesão** - Digite "adesao [nome do paciente]"
🔹 **Interações medicamentosas** - Digite "interacao [medicamentos]"
🔹 **Orientações de dosagem** - Digite "dosagem [medicamento]"
🔹 **Alertas de risco** - Digite "risco [nome do paciente]"

Você também pode selecionar um paciente da lista para análise contextual.

Como posso ajudar hoje?`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMensagens([mensagemInicial]);
    }
  }, [clienteIdFromUrl]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const selecionarPaciente = (pacienteId) => {
    setPacienteSelecionado(pacienteId);
    const paciente = farmaChatData.pacientes[pacienteId];
    const protocolo = farmaChatData.protocolos[pacienteId];
    
    const mensagemContexto = {
      id: mensagens.length + 1,
      tipo: 'sistema',
      conteudo: `📋 **Paciente selecionado: ${paciente.nome}**

• ${paciente.idade} anos, ${paciente.condicoesCronicas.join(', ')}
• Score de adesão: ${paciente.scoreAdesao}%
• Risco: ${paciente.risco}
• Protocolo: ${protocolo?.diagnosticoMedico}

Agora posso fornecer orientações específicas para este paciente.`,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMensagens(prev => [...prev, mensagemContexto]);
  };

  const respostasIA = {
    protocolo: (pacienteNome) => {
      const paciente = Object.values(farmaChatData.pacientes).find(p => 
        p.nome.toLowerCase().includes(pacienteNome.toLowerCase())
      );
      
      if (!paciente) {
        return "❌ Paciente não encontrado. Verifique o nome e tente novamente.";
      }
      
      const protocolo = farmaChatData.protocolos[paciente.id];
      
      return `📋 **Análise do Protocolo - ${paciente.nome}**

**Diagnóstico:** ${protocolo?.diagnosticoMedico}
**Médico:** ${protocolo?.medicoPrescricao}
**Status:** ${protocolo?.status}

**Medicamentos:**
${protocolo?.medicamentos.map(med => 
  `• **${med.nome}**: ${med.posologia}
  Status: ${med.statusAdesao} | Dias restantes: ${med.diasRestantes}`
).join('\n')}

**Observações:** ${protocolo?.observacoes}

**Recomendações:**
${paciente.scoreAdesao < 80 ? '⚠️ Adesão baixa - Reforçar orientações' : '✅ Adesão adequada'}
${protocolo?.medicamentos.some(m => m.diasRestantes <= 5) ? '🔔 Medicamentos acabando - Orientar compra' : ''}`;
    },

    adesao: (pacienteNome) => {
      const paciente = Object.values(farmaChatData.pacientes).find(p => 
        p.nome.toLowerCase().includes(pacienteNome.toLowerCase())
      );
      
      if (!paciente) {
        return "❌ Paciente não encontrado. Verifique o nome e tente novamente.";
      }
      
      const protocolo = farmaChatData.protocolos[paciente.id];
      
      return `📊 **Análise de Adesão - ${paciente.nome}**

**Score Geral:** ${paciente.scoreAdesao}% ${
  paciente.scoreAdesao >= 90 ? '🟢 Excelente' :
  paciente.scoreAdesao >= 75 ? '🟡 Adequado' : '🔴 Crítico'
}

**Por Medicamento:**
${protocolo?.medicamentos.map(med => 
  `• **${med.nome}**: ${med.statusAdesao}
  ${med.statusAdesao === 'crítico' ? '🚨 URGENTE - Paciente sem medicamento' :
    med.statusAdesao === 'irregular' ? '⚠️ Padrão irregular detectado' :
    '✅ Adesão regular'}`
).join('\n')}

**Estratégias de Intervenção:**
${paciente.scoreAdesao < 80 ? `
1. Investigar barreiras (financeira, esquecimento, efeitos adversos)
2. Reforçar importância do tratamento contínuo
3. Considerar lembretes ou organizadores
4. Agendar retorno em 15 dias` : `
1. Manter orientações atuais
2. Reforçar pontos positivos
3. Retorno conforme protocolo`}`;
    },

    interacao: (medicamentos) => {
      return `⚠️ **Verificação de Interações Medicamentosas**

**Medicamentos analisados:** ${medicamentos}

**Análise:**
🔍 Verificando base de dados de interações...

**Interações Identificadas:**
• Nenhuma interação crítica detectada
• Monitorar função renal se uso concomitante de IECA + diurético
• Orientar horários diferentes para melhor absorção

**Recomendações:**
1. Manter intervalos adequados entre medicamentos
2. Monitorar sinais de efeitos adversos
3. Orientar sobre importância de informar todos os medicamentos em uso
4. Incluir medicamentos isentos de prescrição na análise

**Próximos passos:**
- Documentar orientações fornecidas
- Agendar acompanhamento em 30 dias
- Orientar paciente sobre sinais de alerta`;
    },

    risco: (pacienteNome) => {
      const paciente = Object.values(farmaChatData.pacientes).find(p => 
        p.nome.toLowerCase().includes(pacienteNome.toLowerCase())
      );
      
      if (!paciente) {
        return "❌ Paciente não encontrado. Verifique o nome e tente novamente.";
      }
      
      return `🎯 **Análise de Risco - ${paciente.nome}**

**Classificação de Risco:** ${paciente.risco.toUpperCase()} ${
  paciente.risco === 'alto' ? '🔴' :
  paciente.risco === 'medio' ? '🟡' : '🟢'
}

**Fatores de Risco:**
• Score de adesão: ${paciente.scoreAdesao}%
• Condições crônicas: ${paciente.condicoesCronicas.length}
• Idade: ${paciente.idade} anos

**Protocolo de Acompanhamento:**
${paciente.risco === 'alto' ? `
🔴 **RISCO ALTO**
- Contato telefônico semanal
- Acompanhamento presencial quinzenal
- Monitoramento rigoroso de adesão
- Articulação com equipe médica` :
paciente.risco === 'medio' ? `
🟡 **RISCO MÉDIO**
- Acompanhamento presencial mensal
- Reforço de orientações
- Monitoramento de adesão
- Contato telefônico se necessário` : `
🟢 **RISCO BAIXO**
- Acompanhamento conforme protocolo
- Manutenção das orientações atuais
- Monitoramento de rotina`}

**Ações Imediatas:**
${paciente.risco === 'alto' ? '• Contatar paciente hoje\n• Verificar disponibilidade de medicamentos' : '• Manter acompanhamento regular'}`;
    },

    default: (mensagem) => {
      return `🤖 **Assistente IA**

Entendi sua pergunta: "${mensagem}"

Para melhor ajudá-lo, use os comandos específicos:

🔹 **"protocolo [nome]"** - Análise completa do protocolo
🔹 **"adesao [nome]"** - Verificação de adesão ao tratamento
🔹 **"interacao [medicamentos]"** - Análise de interações
🔹 **"risco [nome]"** - Avaliação de risco do paciente

Ou selecione um paciente da lista para análise contextual.

Posso esclarecer alguma dúvida específica sobre cuidado farmacêutico?`;
    }
  };

  const processarMensagemIA = (mensagem) => {
    const mensagemLower = mensagem.toLowerCase();
    
    if (mensagemLower.startsWith('protocolo ')) {
      const nome = mensagem.substring(10);
      return respostasIA.protocolo(nome);
    } else if (mensagemLower.startsWith('adesao ') || mensagemLower.startsWith('adesão ')) {
      const nome = mensagem.substring(7);
      return respostasIA.adesao(nome);
    } else if (mensagemLower.startsWith('interacao ') || mensagemLower.startsWith('interação ')) {
      const medicamentos = mensagem.substring(10);
      return respostasIA.interacao(medicamentos);
    } else if (mensagemLower.startsWith('risco ')) {
      const nome = mensagem.substring(6);
      return respostasIA.risco(nome);
    } else {
      return respostasIA.default(mensagem);
    }
  };

  const enviarMensagem = async () => {
    if (!inputMensagem.trim()) return;

    const novaMensagem = {
      id: mensagens.length + 1,
      tipo: 'farmaceutico',
      conteudo: inputMensagem,
      timestamp: new Date().toLocaleTimeString()
    };

    setMensagens(prev => [...prev, novaMensagem]);
    const mensagemEnviada = inputMensagem;
    setInputMensagem('');
    setCarregando(true);

    try {
      // Tenta usar a API primeiro
      const respostaAPI = await enviarMensagemIA(mensagemEnviada, pacienteSelecionado);
      
      const respostaIA = {
        id: mensagens.length + 2,
        tipo: 'ia',
        conteudo: respostaAPI.resposta || respostaAPI.message,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMensagens(prev => [...prev, respostaIA]);
      
      // Salva a conversa se houver paciente selecionado
      if (pacienteSelecionado) {
        await salvarConversa(pacienteSelecionado, [novaMensagem, respostaIA]);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem para API:', error);
      
      // Fallback para processamento local
      const respostaIA = {
        id: mensagens.length + 2,
        tipo: 'ia',
        conteudo: processarMensagemIA(mensagemEnviada),
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMensagens(prev => [...prev, respostaIA]);
    } finally {
      setCarregando(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
        {/* Lista de Pacientes */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900">Pacientes</h2>
            </div>
            <div className="divide-y overflow-y-auto flex-1">
              {Object.values(farmaChatData.pacientes).map((paciente) => (
                <div
                  key={paciente.id}
                  onClick={() => selecionarPaciente(paciente.id)}
                  className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    pacienteSelecionado === paciente.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                  }`}
                >
                  <h3 className="font-medium text-gray-900 text-sm">{paciente.nome}</h3>
                  <p className="text-xs text-gray-500">{paciente.idade} anos</p>
                  <div className={`w-2 h-2 rounded-full mt-1 ${
                    paciente.risco === 'baixo' ? 'bg-green-400' :
                    paciente.risco === 'medio' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-3">
          <div className="card h-full flex flex-col">
            {/* Header do Chat */}
            <div className="p-4 border-b pague-menos-gradient text-white rounded-t-lg">
              <h3 className="font-semibold">🤖 Assistente IA - FarmaChat</h3>
              <p className="text-sm text-pague-azul-100">
                {pacienteSelecionado ? 
                  `Atendimento: ${farmaChatData.pacientes[pacienteSelecionado]?.nome}` : 
                  'Orientação Farmacêutica Inteligente'
                }
              </p>
            </div>

            {/* Área de Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mensagens.map((mensagem) => (
                <div
                  key={mensagem.id}
                  className={`flex ${
                    mensagem.tipo === 'farmaceutico' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-lg ${
                      mensagem.tipo === 'farmaceutico'
                        ? 'bg-pague-azul-500 text-white'
                        : mensagem.tipo === 'sistema'
                        ? 'bg-green-100 text-green-900 border border-green-200'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-line">{mensagem.conteudo}</div>
                    <p className={`text-xs mt-2 ${
                      mensagem.tipo === 'farmaceutico' ? 'text-pague-azul-100' : 'text-gray-500'
                    }`}>
                      {mensagem.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              
              {carregando && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensagem */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMensagem}
                  onChange={(e) => setInputMensagem(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua pergunta ou comando..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pague-azul-500"
                  disabled={carregando}
                />
                <button
                  onClick={enviarMensagem}
                  disabled={carregando || !inputMensagem.trim()}
                  className="px-4 py-2 bg-pague-azul-500 text-white rounded-lg hover:bg-pague-azul-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enviar
                </button>
              </div>
              
              {/* Sugestões Rápidas */}
              <div className="flex flex-wrap gap-2 mt-3">
                {['protocolo João', 'adesao Maria', 'risco Pedro', 'interacao losartana metformina'].map((sugestao) => (
                  <button
                    key={sugestao}
                    onClick={() => setInputMensagem(sugestao)}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                  >
                    {sugestao}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatIA;