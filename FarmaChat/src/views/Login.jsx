import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    
    try {
      await login(formData.email, formData.senha);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      setErro('Email ou senha inválidos');
      // Para demo, permite login mesmo com erro
      navigate('/dashboard');
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">FC</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Acesso ao FarmaChat
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Protocolo de Cuidado Contínuo
          </p>
        </div>

        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu.email@pagumenos.com.br"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite sua senha"
                value={formData.senha}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="lembrar"
                  name="lembrar"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="lembrar" className="ml-2 block text-sm text-gray-900">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            {erro && (
              <div className="text-red-600 text-sm text-center">
                {erro}
              </div>
            )}
            
            <div>
              <button
                type="submit"
                className="w-full btn-primary"
                disabled={carregando}
              >
                {carregando ? 'Entrando...' : 'Entrar no Sistema'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Acesso rápido para demo</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full btn-secondary"
              >
                Entrar como Demo
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Não tem acesso? Entre em contato com o{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              suporte técnico
            </a>
          </p>
        </div>

        {/* Informações do Sistema */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sistema FarmaChat
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>✅ Protocolo de cuidado contínuo</p>
            <p>✅ IA contextual para orientação</p>
            <p>✅ Histórico completo do paciente</p>
            <p>✅ Alertas inteligentes de adesão</p>
            <p>✅ Integração com rede Pague Menos</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Voltar para página inicial
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;