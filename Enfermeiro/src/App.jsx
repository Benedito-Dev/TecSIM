import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Welcome from './views/auth/Welcome/Welcome'

export default function App() {
  return (
    <Router>

        <Routes>

          <Route path="/" element={<Welcome />} />

        </Routes>
      
    </Router>
  );
}