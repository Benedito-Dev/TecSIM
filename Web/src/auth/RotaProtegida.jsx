/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

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

        // Faz a requisição ao backend usando JWT no header Authorization
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Token inválido → remove do localStorage e redireciona
          localStorage.removeItem("token");
          throw new Error(`Não autorizado (status ${response.status})`);
        }

        const dados = await response.json();

        // Verifica se o usuário é válido
        if (dados?.id_usuario) {
          setUsuario(dados);
          setAutorizado(true);
        } else {
          throw new Error("Resposta do servidor inválida");
        }

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
