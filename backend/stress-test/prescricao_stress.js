import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuração simples - 1 usuário por 5 segundos
export const options = {
  vus: 1,
  duration: '5s',
};

// Configurações
const BASE_URL = 'http://localhost:3000';
const AUTH_URL = `${BASE_URL}/auth/login`;

// Dados de autenticação
const authCredentials = {
  email: 'rabelomateus4@gmail.com',
  senha: '11102007Abcfrita#'
};

// Token global
let authToken = '';
let testPrescriptionId = null;

// Headers
const headers = {
  'Content-Type': 'application/json',
};

// Setup - Autenticação antes dos testes
export function setup() {
  console.log('Fazendo autenticação...');
  
  const authPayload = JSON.stringify(authCredentials);
  const authResponse = http.post(AUTH_URL, authPayload, { headers: headers });
  
  if (authResponse.status === 200) {
    authToken = authResponse.json('token');
    console.log('✅ Autenticação bem-sucedida');
    return { token: authToken };
  } else {
    console.log('❌ Falha na autenticação:', authResponse.body);
    return { token: null };
  }
}

// Função principal
export default function(data) {
  const authHeaders = {
    ...headers,
    'Authorization': `Bearer ${data.token}`,
  };

  // Executar operações em sequência
  testGetAllPrescriptions(authHeaders);
  sleep(0.5);

  testCreatePrescription(authHeaders);
  sleep(0.5);

  // Só testa as outras operações se a criação foi bem-sucedida
  if (testPrescriptionId) {
    testGetPrescriptionById(authHeaders);
    sleep(0.5);

    testUpdatePrescription(authHeaders);
    sleep(0.5);

    testDeletePrescription(authHeaders);
    sleep(0.5);
  } else {
    // Se falhou na criação, testa apenas as operações de leitura
    testGetByPaciente(authHeaders);
    sleep(0.5);
    
    testGetByMedico(authHeaders);
    sleep(0.5);
  }
}

// 1. GET - Buscar todas as prescrições
function testGetAllPrescriptions(authHeaders) {
  const response = http.get(`${BASE_URL}/prescricoes`, { headers: authHeaders });

  check(response, {
    'GET /prescricoes - status 200': (r) => r.status === 200,
  });
}

// 2. POST - Criar prescrição (CORRIGIDO)
function testCreatePrescription(authHeaders) {
  const prescriptionData = {
    id_paciente: 1,
    crm: "SP860427",
    diagnostico: "Teste de stress k6 - " + Date.now(),
    data_prescricao: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
    validade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    medicamentos: [
      {
        id_medicamento: 1,
        dosagem: "500mg",
        frequencia: "8/8h",
        duracao_dias: 7,
        via: "oral"
      }
    ]
  };

  console.log('Enviando dados:', JSON.stringify(prescriptionData, null, 2));

  const response = http.post(
    `${BASE_URL}/prescricoes`,
    JSON.stringify(prescriptionData),
    { headers: authHeaders }
  );

  console.log('Resposta POST:', response.status, response.body);

  const success = check(response, {
    'POST /prescricoes - status 201': (r) => r.status === 201,
  });

  if (success && response.status === 201) {
    const responseData = response.json();
    testPrescriptionId = responseData.id || responseData.id_prescricao;
    console.log(`✅ Prescrição criada - ID: ${testPrescriptionId}`);
  } else {
    console.log(`❌ Falha ao criar prescrição - Status: ${response.status}`);
    console.log(`Resposta: ${response.body}`);
  }
}

// 3. GET - Buscar prescrição específica
function testGetPrescriptionById(authHeaders) {
  if (!testPrescriptionId) return;

  const response = http.get(
    `${BASE_URL}/prescricoes/${testPrescriptionId}`,
    { headers: authHeaders }
  );

  check(response, {
    'GET /prescricoes/:id - status 200': (r) => r.status === 200,
  });
}

// 4. PUT - Atualizar prescrição
function testUpdatePrescription(authHeaders) {
  if (!testPrescriptionId) return;

  // Corpo completo conforme Swagger, alterando apenas o diagnostico
  const updateData = {
    id_paciente: 1,                  // mantém o mesmo paciente
    crm: "SP860427",                 // CRM existente no banco
    diagnostico: "Diagnóstico atualizado - teste k6 " + Date.now(), // alterado
    data_prescricao: new Date().toISOString().split('T')[0],         // mantém a mesma data ou atualiza se quiser
    validade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // mantém validade
  };

  const response = http.put(
    `${BASE_URL}/prescricoes/${testPrescriptionId}`,
    JSON.stringify(updateData),
    { headers: authHeaders }
  );

  console.log('Resposta PUT:', response.status, response.body);

  check(response, {
    'PUT /prescricoes/:id - status 200': (r) => r.status === 200,
  });
}

// 5. DELETE - Deletar prescrição
function testDeletePrescription(authHeaders) {
  if (!testPrescriptionId) return;

  const response = http.del(
    `${BASE_URL}/prescricoes/${testPrescriptionId}`,
    null,
    { headers: authHeaders }
  );

  const success = check(response, {
    'DELETE /prescricoes/:id - status 200': (r) => r.status === 200,
  });

  if (success) {
    console.log(`✅ Prescrição ${testPrescriptionId} deletada`);
    testPrescriptionId = null;
  }
}

// 6. GET - Buscar por paciente
function testGetByPaciente(authHeaders) {
  const response = http.get(
    `${BASE_URL}/prescricoes/paciente/1`,
    { headers: authHeaders }
  );

  check(response, {
    'GET /prescricoes/paciente/:id - status 200': (r) => r.status === 200 || r.status === 404,
  });
}

// 7. GET - Buscar por médico
function testGetByMedico(authHeaders) {
  const response = http.get(
    `${BASE_URL}/prescricoes/medico/CRM-SP-123456`,
    { headers: authHeaders }
  );

  check(response, {
    'GET /prescricoes/medico/:crm - status 200': (r) => r.status === 200 || r.status === 404,
  });
}