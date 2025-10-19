import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserPlus, Search, ArrowRight } from 'lucide-react';

export default function TriagemInicial() {
  const navigate = useNavigate();
  const [cpfBusca, setCpfBusca] = useState('');
  const [buscandoCliente, setBuscandoCliente] = useState(false);

  const buscarClientePagueMenos = async () => {
    if (!cpfBusca.trim()) return;
    
    setBuscandoCliente(true);
    
    try {
      // Simula busca no banco da Pague Menos
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock: 70% chance de encontrar cliente cadastrado
      const clienteEncontrado = Math.random() > 0.3;
      
      if (clienteEncontrado) {
        // Cliente encontrado - vai para atendimento especializado
        const clienteMock = {
          id: Date.now(),
          nome: 'João Silva Santos',
          cpf: cpfBusca,
          telefone: '(11) 99999-9999',
          email: 'joao.silva@email.com',
          endereco: 'Rua das Flores, 123 - São Paulo/SP',
          alergias: ['Dipirona', 'Penicilina'],
          medicamentosContinuos: ['Losartana 50mg', 'Metformina 850mg'],
          condicoesCronicas: ['Hipertensão', 'Diabetes Tipo 2'],
          clientePagueMenos: true
        };
        
        navigate('/atendimento', { 
          state: { 
            paciente: clienteMock,
            origem: 'pague-menos'
          } 
        });
      } else {
        // Cliente não encontrado - vai para chat generalizado
        navigate('/chat-inicial', { 
          state: { 
            cpfTentativa: cpfBusca,
            novoUsuario: true 
          } 
        });
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setBuscandoCliente(false);
    }
  };

  const iniciarComoNovoUsuario = () => {
    navigate('/chat-inicial', { 
      state: { 
        novoUsuario: true,
        primeiroContato: true 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo ao TecSim
          </h1>
          <p className="text-gray-600">
            Identifique-se para receber o melhor atendimento
          </p>
        </div>

        <div className="space-y-6">
          {/* Busca por CPF - Clientes Pague Menos */}
          <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Cliente Pague Menos</h3>
                <p className="text-sm text-blue-700">Já tenho cadastro</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Digite seu CPF"
                value={cpfBusca}
                onChange={(e) => setCpfBusca(e.target.value.replace(/\D/g, '').slice(0, 11))}
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={11}
              />
              
              <button
                onClick={buscarClientePagueMenos}
                disabled={!cpfBusca.trim() || buscandoCliente}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {buscandoCliente ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    Buscar Cadastro
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Divisor */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Novo Usuário */}
          <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Primeiro Acesso</h3>
                <p className="text-sm text-green-700">Não tenho cadastro</p>
              </div>
            </div>
            
            <button
              onClick={iniciarComoNovoUsuario}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
            >
              Iniciar Atendimento
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            ⚠️ Este sistema não substitui consulta médica profissional
          </p>
        </div>
      </div>
    </div>
  );
}