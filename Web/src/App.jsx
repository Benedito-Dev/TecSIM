import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Welcome from './views/Welcome';
import RegisterPage from './views/Register'
import LoginPage from './views/Login';

import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <Router>

        <ThemeProvider>

          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>

        </ThemeProvider>
        
    </Router>
  );
}