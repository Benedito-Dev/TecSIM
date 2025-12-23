import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Views - Authentication
import Welcome from './views/Welcome';
import RegisterPage from './views/Register';
import LoginPage from './views/Login';
import ConfirmCodePage from './views/Code';

// Views - Dashboard
import DashboardPage from './views/Dashboard/Dashboard';
import DashboardGeral from './views/Dashboard/DashboardGeral';

// Views - Main Features
import Medicines from './views/Medicines/Medicines';
import Profile from './views/Profile/Profile';
import EditProfile from './views/Profile/EditProfile';
import Lembretes from './views/Lembretes/Lembretes';
import Prescricao from './views/Prescricao/Prescricao';
import Ajustes from './views/Ajustes/Ajustes';

// Views - Chat
import ChatScreen from './views/Chat/Chat-Refatorado';
import AtendimentoPaciente from './views/Chat/Atendimento';

// Views - Clients
import Clients from './views/clients/Clients';
import NewClient from './views/clients/NewClient';
import FormPacient from './views/clients/FormPacient';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { RegisterProvider } from './context/RegisterContext';
import { AuthProvider } from './context/UserContext';
import { ElderModeProvider } from './context/ElderModeContext';

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ElderModeProvider>

            <RegisterProvider> 
              <Routes>
                {/* Authentication Routes */}
                <Route path="/" element={<Welcome />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/verify" element={<ConfirmCodePage />} />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard-geral" element={<DashboardGeral />} />
                
                {/* Main Feature Routes */}
                <Route path="/medicamentos" element={<Medicines />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/perfil/editar" element={<EditProfile />} />
                <Route path="/lembretes" element={<Lembretes />} />
                <Route path="/prescricoes" element={<Prescricao />} />
                <Route path="/ajustes" element={<Ajustes />} />
                
                {/* Chat Routes */}
                <Route path="/chat-inicial" element={<ChatScreen />} />
                <Route path="/chatbot" element={<ChatScreen />} />
                <Route path="/atendimento" element={<AtendimentoPaciente />} />
                
                {/* Client Management Routes */}
                <Route path="/clientes" element={<Clients />} />
                <Route path="/novocliente" element={<NewClient />} />
                <Route path="/formpacient" element={<FormPacient />} />
              </Routes>
            </RegisterProvider> 
            
          </ElderModeProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}