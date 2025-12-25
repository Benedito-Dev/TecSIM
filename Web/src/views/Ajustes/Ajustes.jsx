import React, { useContext } from "react";
import { Settings } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import { PageContainer } from "../../components/layout/PageContainer";
import { ThemeContext } from "../../context/ThemeContext";
import { useElderMode } from "../../context/ElderModeContext";
import { useAjustesData } from "../../hooks/pages/ajustes/useAjustesData";
import { 
  AppearanceSection,
  NotificationsSection,
  SystemSection,
  SecuritySection,
  QuickActionsSection
} from "../../components/pages/ajustes";

export default function Ajustes() {
  const { theme, toggleTheme, mode } = useContext(ThemeContext);
  const { fontSize, increaseFont, decreaseFont } = useElderMode();
  const { configuracoes, toggleConfig } = useAjustesData();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <PageContainer 
        title="Configurações do Sistema" 
        icon={Settings}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <AppearanceSection 
            mode={mode}
            toggleTheme={toggleTheme}
            fontSize={fontSize}
            increaseFont={increaseFont}
            decreaseFont={decreaseFont}
          />
          
          <NotificationsSection 
            configuracoes={configuracoes}
            toggleConfig={toggleConfig}
          />
          
          <SystemSection 
            configuracoes={configuracoes}
            toggleConfig={toggleConfig}
          />
          
          <SecuritySection />
          
          <QuickActionsSection />
        </div>
      </PageContainer>
    </div>
  );
}