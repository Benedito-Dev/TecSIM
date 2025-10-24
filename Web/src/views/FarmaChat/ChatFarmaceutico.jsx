import React, { useState, useRef, useEffect } from 'react';
import { farmaChatData } from '../../data/farmaChatData';

const ChatFarmaceutico = ({ pacienteId }) => {
  const [mensagens, setMensagens] = useState([]);
  const [inputMensagem, setInputMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const messagesEndRef = useRef(null);

  const paciente = farmaChatData.pacientes[pacienteId];
  const protocolo = farmaChatData.protocolos[pacienteId];

  useEffect(() => {
    if (paciente) {
      const mensagemInicial = {
        id: 1,
        tipo: 'ia',
        conteudo: `Olá! Sou o assistente IA do FarmaChat. Estou aqui para ajudar no atendimento de ${paciente.nome}. 

📋 **Contexto do Paciente:**
• ${paciente.idade} anos, ${paciente.condicoesCronicas.join(', ')}
• Protocolo ativo desde ${protocolo?.dataInicio}
• Risco: ${paciente.risco}

Como posso ajudar no atendimento hoje?`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMensagens([mensagemInicial]);
    }
  }, [paciente, protocolo]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const respostasIA = {
    'adesao': `Com base no histórico de ${paciente?.nome}, identifiquei alguns pontos sobre adesão:

🔍 **Análise de Adesão:**
• Última compra há ${protocolo?.medicamentos[0]?.diasRestantes} dias
• Padrão de compras: ${protocolo?.medicamentos[0]?.statusAdesao}

💡 **Sugestões:**
1. Pergunte sobre dificuldades para tomar os medicamentos
2. Verifique se há efeitos colaterais
3. Reforce a importância do uso contínuo
4. Ofereça lembretes ou organizadores de medicamentos`,

    'interacao': `⚠️ **Verificação de Interações:**

Medicamentos atuais de ${paciente?.nome}:
${protocolo?.medicamentos.map(med => `• ${med.nome}`).join('\n')}

🔍 **Pontos de Atenção:**
• Verificar novos medicamentos antes de dispensar
• Atentar para medicamentos isentos de prescrição
• Considerar suplementos e fitoterápicos

💊 **Protocolo de Segurança:**
1. Sempre consultar o histórico completo
2. Usar sistema de verificação de interações
3. Documentar orientações fornecidas`,

    'dosagem': `📊 **Orientações de Dosagem:**

Para ${paciente?.nome} (${paciente?.idade} anos):

${protocolo?.medicamentos.map(med => 
  `• **${med.nome}**: ${med.posologia}\n  Duração: ${med.duracaoTratamento}`
).join('\n\n')}

⚠️ **Alertas Importantes:**
• Não alterar dosagens sem orientação médica
• Manter horários regulares
• Não interromper tratamento abruptamente`,

    'default': `Entendi sua pergunta sobre ${paciente?.nome}. 

Com base no protocolo ativo, posso ajudar com:

🔹 **Adesão ao tratamento** - Digite "adesao"
🔹 **Interações medicamentosas** - Digite "interacao"  
🔹 **Orientações de dosagem** - Digite "dosagem"
🔹 **Efeitos adversos** - Digite "efeitos"
🔹 **Próximos passos** - Digite "proximos"`
  };

  const processarMensagemIA = (mensagem) => {
    const mensagemLower = mensagem.toLowerCase();
    
    if (mensagemLower.includes('adesao') || mensagemLower.includes('adesão')) {
      return respostasIA.adesao;
    } else if (mensagemLower.includes('interacao') || mensagemLower.includes('interação')) {
      return respostasIA.interacao;
    } else if (mensagemLower.includes('dosagem') || mensagemLower.includes('dose')) {
      return respostasIA.dosagem;
    } else {
      return respostasIA.default;
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
    setInputMensagem('');
    setCarregando(true);

    // Simular resposta da IA
    setTimeout(() => {
      const respostaIA = {
        id: mensagens.length + 2,
        tipo: 'ia',
        conteudo: processarMensagemIA(inputMensagem),
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMensagens(prev => [...prev, respostaIA]);
      setCarregando(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  if (!paciente) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Selecione um paciente para iniciar o chat</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm h-96 flex flex-col">
      {/* Header do Chat */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <h3 className="font-semibold">🤖 Assistente IA - {paciente.nome}</h3>
        <p className="text-sm text-blue-100">Orientação Farmacêutica Inteligente</p>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensagens.map((mensagem) => (
          <div
            key={mensagem.id}
            className={`flex ${mensagem.tipo === 'farmaceutico' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                mensagem.tipo === 'farmaceutico'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{mensagem.conteudo}</p>
              <p className={`text-xs mt-1 ${
                mensagem.tipo === 'farmaceutico' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {mensagem.timestamp}
              </p>
            </div>
          </div>
        ))}
        
        {carregando && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
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
            placeholder="Digite sua pergunta sobre o paciente..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={carregando}
          />
          <button
            onClick={enviarMensagem}
            disabled={carregando || !inputMensagem.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
        
        {/* Sugestões Rápidas */}
        <div className="flex flex-wrap gap-2 mt-2">
          {['adesao', 'interacao', 'dosagem'].map((sugestao) => (
            <button
              key={sugestao}
              onClick={() => setInputMensagem(sugestao)}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              {sugestao}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatFarmaceutico;