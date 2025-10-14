import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './views/Welcome';
import RegisterPage from './views/Register';
import LoginPage from './views/Login';
import ConfirmCodePage from './views/Code';

import DashboardPage from './views/Dashboard/Dashboard';

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
            </Routes>
          </RegisterProvider> 
          
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}