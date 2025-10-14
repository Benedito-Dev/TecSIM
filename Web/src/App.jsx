import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './views/Welcome';
import RegisterPage from './views/Register';
import LoginPage from './views/Login';
import ConfirmCodePage from './views/Code';

import { ThemeProvider } from './context/ThemeContext';
import { RegisterProvider } from './context/RegisterContext';

export default function App() {
  return (
    <Router>
      <ThemeProvider>

        <RegisterProvider> 
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify" element={<ConfirmCodePage />} />
          </Routes>
        </RegisterProvider> 
        
      </ThemeProvider>
    </Router>
  );
}