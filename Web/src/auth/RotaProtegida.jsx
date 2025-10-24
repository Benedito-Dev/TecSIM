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

        // Faz a requisição ao backend usando JWT no header Authorization
        const response = await fetch("http://localhost:3000/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Token inválido → remove do localStorage e redireciona
          localStorage.removeItem("token");
          throw new Error(`Não autorizado (status ${response.status})`);
        }

        const dados = await response.json();
        

        // Espera-se que o backend retorne o usuário diretamente
        if (dados && dados.id_usuario) {
          setUsuario(dados);
          setAutorizado(true);
        } else {
          throw new Error("Resposta do servidor inválida");
        }

      } catch (error) {
        console.error("Erro de autenticação:", error.message || error);
        setAutorizado(false);
        navigate("/login");
      } finally {
        setCarregando(false);
      }
    };

    verificarAutenticacao();
  }, [navigate]);

  if (carregando) {
    return <div>Carregando...</div>;
  }

  return autorizado ? <Outlet context={{ usuario }} /> : null;
}

export default RotaProtegida;
