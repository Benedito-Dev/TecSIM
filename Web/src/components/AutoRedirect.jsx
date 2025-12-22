import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AutoRedirect = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Se usuário está logado, redireciona para dashboard
      console.log('✅ Usuário autenticado detectado, redirecionando...');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, user, navigate]);

  // Se está carregando, mostra loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Verificando autenticação...</p>
      </div>
    );
  }

  // Se não está autenticado, mostra o conteúdo (página de login/welcome)
  if (!isAuthenticated) {
    return children;
  }

  // Se está autenticado, não renderiza nada (vai redirecionar)
  return null;
};

export default AutoRedirect;