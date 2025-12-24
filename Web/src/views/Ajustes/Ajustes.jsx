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
import Sidebar from "../../components/layout/Sidebar";
import { PageContainer } from "../../components/layout/PageContainer";
import { ThemeContext } from "../../context/ThemeContext";
import { useElderMode } from "../../context/ElderModeContext";

export default function Ajustes() {
  const navigate = useNavigate();
  const { theme, toggleTheme, mode } = useContext(ThemeContext);
  const { fontSize, increaseFont, decreaseFont } = useElderMode();
  
  const [configuracoes, setConfiguracoes] = useState({
    notificacoesEstoque: true,
    alertasVencimento: true,
    somSistema: true,
    autoBackup: true,
    impressaoAutomatica: false,
    modoRapido: true
  });

  const toggleConfig = (key) => {
    setConfiguracoes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const ConfigItem = ({ icon, title, description, action, isToggle = false, toggleValue, onToggle, badge }) => (
    <div 
      className="flex items-center justify-between p-6 rounded-xl border hover:shadow-md transition-all duration-200"
      style={{
        background: theme.backgroundCard,
        borderColor: theme.border,
        color: theme.textPrimary
      }}
    >
      <div className="flex items-center gap-4 flex-1">
        <div 
          className="p-3 rounded-xl"
          style={{
            background: theme.primaryLight,
            color: theme.primary
          }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 
              className="font-semibold text-lg"
              style={{ color: theme.textPrimary }}
            >
              {title}
            </h3>
            {badge && (
              <span 
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  background: theme.success,
                  color: theme.textOnSuccess
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <p 
            className="mt-1"
            style={{ color: theme.textSecondary }}
          >
            {description}
          </p>
        </div>
      </div>
      
      {isToggle ? (
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            toggleValue ? 'bg-blue-600' : 'bg-gray-300'
          }`}
          style={{
            backgroundColor: toggleValue ? theme.primary : theme.borderLight
          }}
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
          className="font-medium px-4 py-2 rounded-lg transition-colors"
          style={{
            background: theme.primary,
            color: theme.textOnPrimary
          }}
        >
          Configurar
        </button>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <PageContainer 
        title="Configurações do Sistema" 
        icon={Settings}
      >
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Seção: Aparência e Acessibilidade */}
            <div 
              className="rounded-2xl p-6 border"
              style={{
                background: theme.backgroundCard,
                borderColor: theme.border
              }}
            >
              <h2 
                className="text-xl font-bold mb-6 flex items-center gap-3"
                style={{ color: theme.textPrimary }}
              >
                <Monitor 
                  size={24} 
                  style={{ color: theme.primary }}
                />
                Aparência e Acessibilidade
              </h2>
              
              <div className="grid gap-4">
                <ConfigItem
                  icon={mode === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                  title={mode === 'light' ? "Modo Claro" : "Modo Escuro"}
                  description={`Alternar para tema ${mode === 'light' ? 'escuro' : 'claro'}`}
                  isToggle={true}
                  toggleValue={mode === 'dark'}
                  onToggle={toggleTheme}
                />
                
                <ConfigItem
                  icon={<ZoomIn size={20} />}
                  title="Tamanho da Fonte"
                  description={`Tamanho atual: ${fontSize}px - Ajuste para melhor legibilidade`}
                  action={() => {}}
                  badge="Acessibilidade"
                />
                
                <div 
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{
                    background: theme.backgroundSecondary
                  }}
                >
                  <span 
                    className="font-medium"
                    style={{ color: theme.textPrimary }}
                  >
                    Tamanho da fonte:
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decreaseFont}
                      disabled={fontSize <= 14}
                      className="p-2 border rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      style={{
                        background: theme.backgroundCard,
                        borderColor: theme.border,
                        color: theme.textPrimary
                      }}
                    >
                      <ZoomOut size={18} />
                    </button>
                    <span 
                      className="font-bold min-w-[40px] text-center"
                      style={{ color: theme.primary }}
                    >
                      {fontSize}px
                    </span>
                    <button
                      onClick={increaseFont}
                      disabled={fontSize >= 24}
                      className="p-2 border rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      style={{
                        background: theme.backgroundCard,
                        borderColor: theme.border,
                        color: theme.textPrimary
                      }}
                    >
                      <ZoomIn size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção: Notificações e Alertas */}
            <div 
              className="rounded-2xl p-6 border"
              style={{
                background: theme.backgroundCard,
                borderColor: theme.border
              }}
            >
              <h2 
                className="text-xl font-bold mb-6 flex items-center gap-3"
                style={{ color: theme.textPrimary }}
              >
                <Bell 
                  size={24} 
                  style={{ color: theme.warning }}
                />
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
            <div 
              className="rounded-2xl p-6 border"
              style={{
                background: theme.backgroundCard,
                borderColor: theme.border
              }}
            >
              <h2 
                className="text-xl font-bold mb-6 flex items-center gap-3"
                style={{ color: theme.textPrimary }}
              >
                <Settings 
                  size={24} 
                  style={{ color: theme.success }}
                />
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
            <div 
              className="rounded-2xl p-6 border"
              style={{
                background: theme.backgroundCard,
                borderColor: theme.border
              }}
            >
              <h2 
                className="text-xl font-bold mb-6 flex items-center gap-3"
                style={{ color: theme.textPrimary }}
              >
                <Shield 
                  size={24} 
                  style={{ color: theme.error }}
                />
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
            <div 
              className="rounded-2xl p-6 border"
              style={{
                background: theme.backgroundCard,
                borderColor: theme.border
              }}
            >
              <h2 
                className="text-xl font-bold mb-6"
                style={{ color: theme.textPrimary }}
              >
                Ações Rápidas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  className="p-4 rounded-xl hover:opacity-80 transition-colors text-left border"
                  style={{
                    background: theme.primaryLight,
                    color: theme.primary,
                    borderColor: theme.primary
                  }}
                >
                  <div className="font-semibold">Exportar Dados</div>
                  <div className="text-sm opacity-80">Backup manual do sistema</div>
                </button>
                
                <button 
                  className="p-4 rounded-xl hover:opacity-80 transition-colors text-left border"
                  style={{
                    background: theme.success + '20',
                    color: theme.success,
                    borderColor: theme.success
                  }}
                >
                  <div className="font-semibold">Limpar Cache</div>
                  <div className="text-sm opacity-80">Otimizar performance</div>
                </button>
                
                <button 
                  className="p-4 rounded-xl hover:opacity-80 transition-colors text-left border"
                  style={{
                    background: theme.warning + '20',
                    color: theme.warning,
                    borderColor: theme.warning
                  }}
                >
                  <div className="font-semibold">Testar Conexão</div>
                  <div className="text-sm opacity-80">Verificar servidores</div>
                </button>
                
                <button 
                  className="p-4 rounded-xl hover:opacity-80 transition-colors text-left border"
                  style={{
                    background: theme.info + '20',
                    color: theme.info,
                    borderColor: theme.info
                  }}
                >
                  <div className="font-semibold">Relatório do Sistema</div>
                  <div className="text-sm opacity-80">Status e métricas</div>
                </button>
              </div>
            </div>
          </div>
      </PageContainer>
    </div>
  );
}