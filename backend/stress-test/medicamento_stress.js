import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuração do teste
export const options = {
  vus: 1,
  duration: '10s',
};

// Função para gerar CPF aleatório apenas para referência (não obrigatório para medicamentos)
function gerarNomeUnico() {
  return `Medicamento Teste ${Date.now()}`;
}

export default function () {
  // 1️⃣ Login para pegar token
  const loginRes = http.post('http://localhost:3000/auth/login', JSON.stringify({
    email: 'rabelomateus4@gmail.com',
    senha: '11102007Abcfrita#',
  }), { headers: { 'Content-Type': 'application/json' } });

  if (loginRes.status !== 200) {
    console.error('Falha no login:', loginRes.status, loginRes.body);
    return;
  }

  const token = JSON.parse(loginRes.body).token;

  // 2️⃣ Criar medicamento (POST)
  const timestamp = Date.now();
  const novoMedicamento = {
    nome: gerarNomeUnico(),
    tipo: "Comprimido",
    descricao: "Medicamento de teste",
    faixa_etaria_minima: 12,
    faixa_etaria_maxima: 65,
    contraindicacoes: "Nenhuma",
    interacoes_comuns: "Nenhuma",
    composicao: "Composição teste",
    dosagem_padrao: "1x ao dia",
    bula_detalhada: "Bula teste"
  };

  const postRes = http.post('http://localhost:3000/medicamentos', JSON.stringify(novoMedicamento), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  check(postRes, {
    'POST status 201': (r) => r.status === 201,
  });

  if (postRes.status !== 201) {
    console.error('Erro no POST:', postRes.status, postRes.body);
    return;
  }

  const medicamentoCriado = JSON.parse(postRes.body).data;

  // 3️⃣ Buscar todos os medicamentos (GET)
  const getRes = http.get('http://localhost:3000/medicamentos', {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(getRes, {
    'GET status 200': (r) => r.status === 200,
  });

  // 4️⃣ Atualizar medicamento (PUT)
  const updateData = {
    nome: `${medicamentoCriado.nome} Atualizado`,
    tipo: medicamentoCriado.tipo,
    descricao: "Medicamento atualizado via teste",
    faixa_etaria_minima: medicamentoCriado.faixa_etaria_minima,
    faixa_etaria_maxima: medicamentoCriado.faixa_etaria_maxima,
    contraindicacoes: medicamentoCriado.contraindicacoes,
    interacoes_comuns: medicamentoCriado.interacoes_comuns,
    composicao: medicamentoCriado.composicao,
    dosagem_padrao: medicamentoCriado.dosagem_padrao,
    bula_detalhada: medicamentoCriado.bula_detalhada
  };

  const putRes = http.put(`http://localhost:3000/medicamentos/${medicamentoCriado.id_medicamento}`, JSON.stringify(updateData), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  check(putRes, {
    'PUT status 200': (r) => r.status === 200,
  });

  if (putRes.status !== 200) {
    console.error('Erro no PUT:', putRes.status, putRes.body);
  }

  // 5️⃣ Deletar medicamento (DELETE)
  const delRes = http.del(`http://localhost:3000/medicamentos/${medicamentoCriado.id_medicamento}`, null, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(delRes, {
    'DELETE status 200': (r) => r.status === 200,
  });

  if (delRes.status !== 200) {
    console.error('Erro no DELETE:', delRes.status, delRes.body);
  }

  sleep(1); // pausa entre iterações
}
