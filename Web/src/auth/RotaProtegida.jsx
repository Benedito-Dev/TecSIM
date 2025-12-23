/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function RotaProtegida() {
  const [autorizado, setAutorizado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAutenticacao = async () => {
      setCarregando(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Sem token → redireciona
          setAutorizado(false);
          navigate("/login");
          return;
        }

        // Simula verificação de autenticação
        if (!token) {
          setAutorizado(false);
          navigate("/login");
          return;
        }

        // Simula usuário válido
        const mockUser = { id_usuario: 1, nome: 'Usuário Teste' };
        setUsuario(mockUser);
        setAutorizado(true);

      } catch (error) {
        console.error("Erro de autenticação:", error.message);
        localStorage.removeItem("token");
        setAutorizado(false);
        navigate("/login");
      } finally {
        setCarregando(false);
      }
    };

    verificarAutenticacao();
  }, [navigate]);

  if (carregando) {
    return (
      <div role="status" aria-live="polite">
        Carregando...
      </div>
    );
  }

  if (!autorizado) {
    return null;
  }

  return <Outlet context={{ usuario }} />;
}

export default RotaProtegida;
