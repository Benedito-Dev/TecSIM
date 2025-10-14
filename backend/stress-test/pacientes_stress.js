import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuração do teste
export const options = {
  vus: 1,       // número de usuários virtuais
  duration: '10s', // duração do teste
};

// Função para gerar CPF válido
function gerarCPFValido() {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const d1 = (n.reduce((acc, v, i) => acc + v * (10 - i), 0) * 10) % 11 % 10;
  const d2 = ((n.reduce((acc, v, i) => acc + v * (11 - i), 0) + d1 * 2) * 10) % 11 % 10;
  return [...n, d1, d2].join('');
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

  // 2️⃣ Criar paciente (POST) com dados únicos
  const timestamp = Date.now(); 
  const cpfValido = gerarCPFValido();
  const novoPaciente = {
    cpf: cpfValido,
    nome: `Paciente Teste ${timestamp}`,
    email: `teste${timestamp}@gmail.com`,
    senha: "Senha123!",
    data_nascimento: "1990-01-01", // data em formato correto YYYY-MM-DD
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

  if (postRes.status !== 201) {
    console.error('Erro no POST:', postRes.status, postRes.body);
    return;
  }

  const pacienteCriado = JSON.parse(postRes.body).data;

  // 3️⃣ Buscar todos os pacientes (GET)
  const getRes = http.get('http://localhost:3000/pacientes', {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(getRes, {
    'GET pacientes status 200': (r) => r.status === 200,
  });

  // 4️⃣ Atualizar paciente (PUT) - envia todos os campos obrigatórios
  if (pacienteCriado && pacienteCriado.id) {
    const updateData = {
      nome: `Paciente Atualizado ${timestamp}`,
      cpf: pacienteCriado.cpf,
      email: pacienteCriado.email,
      data_nascimento: "1990-01-01", // formato correto
      genero: pacienteCriado.genero,
      aceite_termos: pacienteCriado.aceite_termos,
    };

    const putRes = http.put(`http://localhost:3000/pacientes/${pacienteCriado.id}`, JSON.stringify(updateData), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    check(putRes, {
      'PUT paciente status 200': (r) => r.status === 200,
    });

    if (putRes.status !== 200) {
      console.error('Erro no PUT:', putRes.status, putRes.body);
    }

    // 5️⃣ Deletar paciente (DELETE)
    const delRes = http.del(`http://localhost:3000/pacientes/${pacienteCriado.id}`, null, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    check(delRes, {
      'DELETE paciente status 200': (r) => r.status === 200,
    });

    if (delRes.status !== 200) {
      console.error('Erro no DELETE:', delRes.status, delRes.body);
    }
  }

  sleep(1); // pausa entre iterações
}
