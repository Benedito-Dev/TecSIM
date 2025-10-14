import http from 'k6/http';
import { check, sleep } from 'k6';

// 📊 Configuração do teste de carga
export const options = {
  vus: 5,           // número de usuários virtuais simultâneos
  duration: '10s',  // duração total do teste
};

// 💡 Usuário de teste
const TEST_USER = {
  email: 'rabelomateus4@gmail.com',
  senha: '11102007Abcfrita#',
};

// Função principal executada por cada VU
export default function () {
  const url = 'http://localhost:3000/auth/login';
  const payload = JSON.stringify(TEST_USER);
  const params = { headers: { 'Content-Type': 'application/json' } };

  // 🔥 Envia requisição POST de login
  const res = http.post(url, payload, params);

  // ✅ Verificações
  check(res, {
    'login status é 200': (r) => r.status === 200,
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
