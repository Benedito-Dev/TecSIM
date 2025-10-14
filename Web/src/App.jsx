import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './views/Welcome';
import RegisterPage from './views/Register';
import LoginPage from './views/Login';
import ConfirmCodePage from './views/Code';

import DashboardPage from './views/Dashboard/Dashboard';
import Medicines from './views/Medicines/Medicines';
import Profile from './views/Profile/Profile';
import Lembretes from './views/Lembretes/Lembretes';
import Chatbot from './views/Chat/Chat';
import Prescricao from './views/Prescricao/Prescricao';
import Ajustes from './views/Ajustes/Ajustes';

import { ThemeProvider } from './context/ThemeContext';
import { RegisterProvider } from './context/RegisterContext';
import { AuthProvider } from './context/UserContext'

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>

          <RegisterProvider> 
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/verify" element={<ConfirmCodePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/medicamentos" element={<Medicines />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/lembretes" element={<Lembretes />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/prescricoes" element={<Prescricao />} />
              <Route path="ajustes" element={<Ajustes />} />
            </Routes>
          </RegisterProvider> 
          
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}