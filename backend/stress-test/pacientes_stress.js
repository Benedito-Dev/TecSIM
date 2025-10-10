import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuração do teste
export const options = {
  vus: 20,       // 20 usuários virtuais simultâneos
  duration: '45s', // duração total do teste
};

export default function () {
  // 1️⃣ Login para pegar token
  const loginRes = http.post('http://localhost:3000/auth/login', JSON.stringify({
    email: 'rabelomateus4@gmail.com',
    senha: '11102007Abcfrita#',
  }), { headers: { 'Content-Type': 'application/json' } });

  const token = JSON.parse(loginRes.body).token;

  // 2️⃣ Criar paciente (POST) com dados únicos
  const timestamp = Date.now(); // valor único por iteração
  const novoPaciente = {
    cpf: `${Math.floor(10000000000 + Math.random() * 89999999999)}`,
    nome: `Paciente Teste ${timestamp}`,
    email: `teste${timestamp}@teste.com`,
    senha: "Senha123!",
    data_nascimento: "1990-01-01",
    genero: "masculino",
    aceite_termos: true,
  };

  const postRes = http.post('http://localhost:3000/pacientes', JSON.stringify(novoPaciente), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  check(postRes, {
    'POST paciente status 201': (r) => r.status === 201,
  });

  const pacienteCriado = JSON.parse(postRes.body);

  // 3️⃣ Buscar todos os pacientes (GET)
  const getRes = http.get('http://localhost:3000/pacientes', {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(getRes, {
    'GET pacientes status 200': (r) => r.status === 200,
  });

  // 4️⃣ Atualizar paciente (PUT)
  const updateData = { nome: `Paciente Atualizado ${timestamp}` };
  const putRes = http.put(`http://localhost:3000/pacientes/${pacienteCriado.id}`, JSON.stringify(updateData), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  check(putRes, {
    'PUT paciente status 200': (r) => r.status === 200,
  });

  // 5️⃣ Deletar paciente (DELETE)
  const delRes = http.del(`http://localhost:3000/pacientes/${pacienteCriado.id}`, null, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(delRes, {
    'DELETE paciente status 200': (r) => r.status === 200,
  });

  sleep(1); // pausa entre iterações
}
