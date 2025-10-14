import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '10s',
};

const BASE_URL = 'http://localhost:3000/bulas';
const validMedicamentoIds = [1,2,3,4,5,6,7,8,9,10,11,12];

function randomMedicamentoId() {
  return validMedicamentoIds[Math.floor(Math.random() * validMedicamentoIds.length)];
}

export default function () {
  let res = http.get(`${BASE_URL}`);
  check(res, {
    'GET /bulas status 200': (r) => r.status === 200,
  });

  const bulaPayload = JSON.stringify({
    id_medicamento: randomMedicamentoId(),
    dosagem_e_administracao: ['2x ao dia'],
    indicacoes: ['Dor de cabeça'],
    contraindicacoes: ['Hipertensão'],
    advertencias: ['Evitar álcool'],
    interacoes: ['Nenhuma conhecida'],
    armazenamento_e_validade: ['Conservar em local seco, 2 anos']
  });

  const params = { headers: { 'Content-Type': 'application/json' } };
  res = http.post(`${BASE_URL}`, bulaPayload, params);

  check(res, {
    'POST /bulas status 201': (r) => r.status === 201,
    'POST /bulas contém id': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data && body.data.id;
      } catch {
        return false;
      }
    },
  });

  let bulaId = null;
  try { bulaId = JSON.parse(res.body).data.id } catch {}

  if (bulaId) {
    res = http.get(`${BASE_URL}/${bulaId}`);
    check(res, { [`GET /bulas/${bulaId} status 200`]: (r) => r.status === 200 });
  }

  sleep(1);
}
