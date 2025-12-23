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

// Constants
import { ROUTES } from './constants/tecsim';

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ElderModeProvider>

            <RegisterProvider> 
              <Routes>
                {/* Authentication Routes */}
                <Route path={ROUTES.HOME} element={<Welcome />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.VERIFY} element={<ConfirmCodePage />} />
                
                {/* Dashboard Routes */}
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                <Route path={ROUTES.DASHBOARD_GERAL} element={<DashboardGeral />} />
                
                {/* Main Feature Routes */}
                <Route path={ROUTES.MEDICAMENTOS} element={<Medicines />} />
                <Route path={ROUTES.PERFIL} element={<Profile />} />
                <Route path={ROUTES.PERFIL_EDITAR} element={<EditProfile />} />
                <Route path={ROUTES.LEMBRETES} element={<Lembretes />} />
                <Route path={ROUTES.PRESCRICOES} element={<Prescricao />} />
                <Route path={ROUTES.AJUSTES} element={<Ajustes />} />
                
                {/* Chat Routes */}
                <Route path="/chat-inicial" element={<ChatScreen />} />
                <Route path={ROUTES.CHAT} element={<ChatScreen />} />
                <Route path={ROUTES.ATENDIMENTO} element={<AtendimentoPaciente />} />
                
                {/* Client Management Routes */}
                <Route path={ROUTES.CLIENTES} element={<Clients />} />
                <Route path={ROUTES.NOVO_CLIENTE} element={<NewClient />} />
                <Route path={ROUTES.FORM_PACIENTE} element={<FormPacient />} />
              </Routes>
            </RegisterProvider> 
            
          </ElderModeProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}