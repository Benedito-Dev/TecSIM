import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './views/Welcome';
import RegisterPage from './views/Register';
import LoginPage from './views/Login';
import ConfirmCodePage from './views/Code';

import DashboardPage from './views/Dashboard/Dashboard';
import DashboardGeral from './views/Dashboard/DashboardGeral';
import Medicines from './views/Medicines/Medicines';
import Profile from './views/Profile/Profile';
import Lembretes from './views/Lembretes/Lembretes';
import ChatScreen from './views/Chat/Chat-Refatorado';
import AtendimentoPaciente from './views/Chat/Atendimento'
import Prescricao from './views/Prescricao/Prescricao';
import Ajustes from './views/Ajustes/Ajustes';
import Clients from './views/clients/Clients';

import { ThemeProvider } from './context/ThemeContext';
import { RegisterProvider } from './context/RegisterContext';
import { AuthProvider } from './context/UserContext'
import { ElderModeProvider } from './context/ElderModeContext'
import NewClient from './views/clients/NewClient';
import FormPacient from './views/clients/FormPacient';
import EditProfile from './views/Profile/EditProfile';

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ElderModeProvider>

            <RegisterProvider> 
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/verify" element={<ConfirmCodePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard-geral" element={<DashboardGeral />} />
                <Route path="/medicamentos" element={<Medicines />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/perfil/editar" element={<EditProfile />} />
                <Route path="/lembretes" element={<Lembretes />} />
                <Route path="/chat-inicial" element={<ChatScreen />} />
                <Route path="/chatbot" element={<ChatScreen />} />
                <Route path="/atendimento" element={<AtendimentoPaciente />} />
                <Route path="/prescricoes" element={<Prescricao />} />
                <Route path="ajustes" element={<Ajustes />} />
                <Route path='/clientes' element={<Clients />} />
                <Route path='/novocliente' element={<NewClient/>}/>
                <Route path='/formpacient' element={<FormPacient/>}/>
              </Routes>
            </RegisterProvider> 
            
          </ElderModeProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}