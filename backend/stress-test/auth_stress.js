import http from 'k6/http';
import { check, sleep } from 'k6';

// 📊 Configuração geral
export const options = {
  vus: 50,             // 20 usuários simultâneos
  duration: '10s',     // duração total do teste
};

// 🚀 Função executada por cada usuário virtual
export default function () {
  const url = 'http://localhost:3000/auth/login'; // ajuste conforme sua rota real

  // 💡 Payload de teste — use um usuário real de teste
  const payload = JSON.stringify({
    email: 'rabelomateus4@gmail.com',
    senha: '11102007Abcfrita#',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // 🔥 Envia requisição POST de login
  const res = http.post(url, payload, params);

  // ✅ Verificações
  check(res, {
    'status é 200': (r) => r.status === 200,
    'resposta contém token JWT': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.token && body.token.length > 10;
      } catch {
        return false;
      }
    },
  });

  sleep(1); // pausa de 1 segundo entre execuções
}
