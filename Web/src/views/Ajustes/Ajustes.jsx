import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Settings, 
  Sun, 
  Moon, 
  ZoomIn, 
  ZoomOut, 
  Bell, 
  Shield, 
  User,
  Monitor,
  Database,
  Clock,
  FileText,
  Printer
} from "lucide-react";
import Sidebar from "../../components/SideBarr";
import { ThemeContext } from "../../context/ThemeContext";
import { useElderMode } from "../../context/ElderModeContext";

export default function Ajustes() {
  const navigate = useNavigate();
  const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
  const { fontSize, increaseFont, decreaseFont } = useElderMode();
  
  const [configuracoes, setConfiguracoes] = useState({
    notificacoesEstoque: true,
    alertasVencimento: true,
    somSistema: true,
    autoBackup: true,
    impressaoAutomatica: false,
    modoRapido: true
  });

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const toggleConfig = (key) => {
    setConfiguracoes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const ConfigItem = ({ icon, title, description, action, isToggle = false, toggleValue, onToggle, badge }) => (
    <div className="flex items-center justify-between p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-4 flex-1">
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
            {badge && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
      </div>
      
      {isToggle ? (
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            toggleValue ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              toggleValue ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      ) : (
        <button
          onClick={action}
          className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Configurar
        </button>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        
        {/* Navbar */}
        <div className="h-20 bg-white shadow flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Settings size={28} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Configurações do Sistema</h1>
            </div>
          </div>
        </div>

        {/* Conteúdo dos Ajustes */}
        <div className="flex-1 overflow-y-auto ml-20 lg:ml-60 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Seção: Aparência e Acessibilidade */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Monitor className="text-blue-600" size={24} />
                Aparência e Acessibilidade
              </h2>
              
              <div className="grid gap-4">
                <ConfigItem
                  icon={<Sun size={20} />}
                  title="Modo Escuro"
                  description="Alternar entre tema claro e escuro"
                  isToggle={true}
                  toggleValue={isDarkMode}
                  onToggle={toggleTheme}
                />
                
                <ConfigItem
                  icon={<ZoomIn size={20} />}
                  title="Tamanho da Fonte"
                  description={`Tamanho atual: ${fontSize}px - Ajuste para melhor legibilidade`}
                  action={() => {}}
                  badge="Acessibilidade"
                />
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Tamanho da fonte:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decreaseFont}
                      disabled={fontSize <= 14}
                      className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ZoomOut size={18} />
                    </button>
                    <span className="font-bold text-blue-600 min-w-[40px] text-center">{fontSize}px</span>
                    <button
                      onClick={increaseFont}
                      disabled={fontSize >= 24}
                      className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ZoomIn size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção: Notificações e Alertas */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Bell className="text-orange-600" size={24} />
                Notificações e Alertas
              </h2>
              
              <div className="grid gap-4">
                <ConfigItem
                  icon={<Database size={20} />}
                  title="Alertas de Estoque Baixo"
                  description="Notificar quando medicamentos estiverem com estoque crítico"
                  isToggle={true}
                  toggleValue={configuracoes.notificacoesEstoque}
                  onToggle={() => toggleConfig('notificacoesEstoque')}
                  badge="Crítico"
                />
                
                <ConfigItem
                  icon={<Clock size={20} />}
                  title="Alertas de Vencimento"
                  description="Avisar sobre medicamentos próximos do vencimento"
                  isToggle={true}
                  toggleValue={configuracoes.alertasVencimento}
                  onToggle={() => toggleConfig('alertasVencimento')}
                  badge="Importante"
                />
              </div>
            </div>

            {/* Seção: Sistema e Performance */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Settings className="text-green-600" size={24} />
                Sistema e Performance
              </h2>
              
              <div className="grid gap-4">
                <ConfigItem
                  icon={<Database size={20} />}
                  title="Backup Automático"
                  description="Realizar backup automático dos dados a cada 24h"
                  isToggle={true}
                  toggleValue={configuracoes.autoBackup}
                  onToggle={() => toggleConfig('autoBackup')}
                />
                
                <ConfigItem
                  icon={<Printer size={20} />}
                  title="Impressão Automática"
                  description="Imprimir automaticamente receitas e relatórios"
                  isToggle={true}
                  toggleValue={configuracoes.impressaoAutomatica}
                  onToggle={() => toggleConfig('impressaoAutomatica')}
                />
                
                <ConfigItem
                  icon={<Monitor size={20} />}
                  title="Modo Rápido"
                  description="Otimizar interface para atendimento rápido"
                  isToggle={true}
                  toggleValue={configuracoes.modoRapido}
                  onToggle={() => toggleConfig('modoRapido')}
                  badge="Recomendado"
                />
              </div>
            </div>

            {/* Seção: Segurança e Privacidade */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Shield className="text-red-600" size={24} />
                Segurança e Privacidade
              </h2>
              
              <div className="grid gap-4">
                <ConfigItem
                  icon={<User size={20} />}
                  title="Controle de Acesso"
                  description="Gerenciar permissões de usuários e funções"
                  action={() => navigate('/ajustes/permissoes')}
                />
                
                <ConfigItem
                  icon={<FileText size={20} />}
                  title="Registro de Auditoria"
                  description="Visualizar logs do sistema e atividades"
                  action={() => navigate('/ajustes/auditoria')}
                />
                
                <ConfigItem
                  icon={<Shield size={20} />}
                  title="Política de Segurança"
                  description="Configurar políticas de segurança do sistema"
                  action={() => navigate('/ajustes/seguranca')}
                />
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Ações Rápidas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-left border border-blue-200">
                  <div className="font-semibold">Exportar Dados</div>
                  <div className="text-sm text-blue-600">Backup manual do sistema</div>
                </button>
                
                <button className="p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors text-left border border-green-200">
                  <div className="font-semibold">Limpar Cache</div>
                  <div className="text-sm text-green-600">Otimizar performance</div>
                </button>
                
                <button className="p-4 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors text-left border border-orange-200">
                  <div className="font-semibold">Testar Conexão</div>
                  <div className="text-sm text-orange-600">Verificar servidores</div>
                </button>
                
                <button className="p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors text-left border border-purple-200">
                  <div className="font-semibold">Relatório do Sistema</div>
                  <div className="text-sm text-purple-600">Status e métricas</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}