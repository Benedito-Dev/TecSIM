import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 1,
  duration: '10s',
};

export default function () {
  // 1️⃣ Login
  const loginRes = http.post('http://localhost:3000/auth/login', JSON.stringify({
    email: 'rabelomateus4@gmail.com',
    senha: '11102007Abcfrita#',
  }), { headers: { 'Content-Type': 'application/json' } });

  check(loginRes, {
    'login status 200': (r) => r.status === 200,
  });

  if (loginRes.status !== 200) {
    console.error('Falha no login:', loginRes.status, loginRes.body);
    return;
  }

  const token = JSON.parse(loginRes.body).token;

  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  // 2️⃣ Criar médico
  const medicoPayload = {
    nome: `Dr Teste ${Math.floor(Math.random() * 1000)}`,
    crm: `SP${Math.floor(Math.random() * 1000000)}`,
    especialidade: 'Cardiologia',
    email: `teste${Math.floor(Math.random() * 1000)}@email.com`,
    senha: '11102007Abcfrita#',
    telefone: '11999999999',
  };

  const createRes = http.post('http://localhost:3000/medicos', JSON.stringify(medicoPayload), { headers: { 'Content-Type': 'application/json' } });
  check(createRes, { 'POST /medicos status 201': (r) => r.status === 201 });

  const medicoId = JSON.parse(createRes.body).data.id;

  // 3️⃣ Buscar médico pelo ID
  const getRes = http.get(`http://localhost:3000/medicos/${medicoId}`, authHeaders);
  check(getRes, { 'GET /medicos/:id status 200': (r) => r.status === 200 });

  // 4️⃣ Atualizar médico
  const updatePayload = { especialidade: 'Neurologia' };
  const putRes = http.put(`http://localhost:3000/medicos/${medicoId}`, JSON.stringify(updatePayload), authHeaders);
  check(putRes, { 'PUT /medicos/:id status 200': (r) => r.status === 200 });

  // 5️⃣ Deletar médico
  const delRes = http.del(`http://localhost:3000/medicos/${medicoId}`, null, authHeaders);
  check(delRes, { 'DELETE /medicos/:id status 200': (r) => r.status === 200 });

  sleep(1);
}
