import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './views/LandingPage';
import Dashboard from './views/Dashboard';
import PacienteDetalhes from './views/PacienteDetalhes';
import ChatIA from './views/ChatIA';
import Estatisticas from './views/Estatisticas';
import Login from './views/Login';
import Protocolos from './views/Protocolos';
import Alertas from './views/Alertas';
import Clientes from './views/Clientes';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/paciente/:id" element={<PacienteDetalhes />} />
          <Route path="/chat" element={<ChatIA />} />
          <Route path="/protocolos" element={<Protocolos />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/estatisticas" element={<Estatisticas />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}