import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 1,
  duration: '10s',
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // 1️⃣ Login para pegar o token JWT
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      email: 'rabelomateus4@gmail.com',
      senha: '11102007Abcfrita#',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(loginRes, { 'login status 200': (r) => r.status === 200 });

  const token = JSON.parse(loginRes.body).token;
  check(token, { 'JWT retornado': (t) => t !== undefined && t.length > 0 });

  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  // 2️⃣ Criar prescrição
  const prescricaoData = {
    id_paciente: 1,
    crm: 'SP366859',
    diagnostico: 'Teste de estresse',
    data_prescricao: '2025-10-13',
    validade: '2025-11-13',
    medicamentos: [
      { nome: 'Medicamento A', dosagem: '10mg', duracao: '5 dias' },
      { nome: 'Medicamento B', dosagem: '20mg', duracao: '3 dias' },
    ],
  };

  const createRes = http.post(
    `${BASE_URL}/prescricoes`,
    JSON.stringify(prescricaoData),
    authHeaders
  );

  check(createRes, { 'POST /prescricoes status 201': (r) => r.status === 201 });

  // Captura o id_prescricao corretamente
  const prescricaoBody = JSON.parse(createRes.body);
  const prescricaoId = prescricaoBody.id_prescricao;
  check(prescricaoId, { 'POST /prescricoes contém id': (id) => id !== undefined });

  // 3️⃣ GET prescrição pelo ID
  const getRes = http.get(`${BASE_URL}/prescricoes/${prescricaoId}`, authHeaders);
  check(getRes, { 'GET /prescricoes/:id status 200': (r) => r.status === 200 });

  // 4️⃣ Atualizar prescrição
  const updateData = {
    diagnostico: 'Atualização teste',
    validade: '2025-12-31',
  };

  const putRes = http.put(
    `${BASE_URL}/prescricoes/${prescricaoId}`,
    JSON.stringify(updateData),
    authHeaders
  );
  check(putRes, { 'PUT /prescricoes/:id status 200': (r) => r.status === 200 });

  // 5️⃣ Deletar prescrição
  const delRes = http.del(`${BASE_URL}/prescricoes/${prescricaoId}`, null, authHeaders);
  check(delRes, { 'DELETE /prescricoes/:id status 200': (r) => r.status === 200 });

  sleep(1);
}
