import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 500,          // número de usuários virtuais
    duration: '40s',  // duração do teste
};

export default function () {
    // Testando o endpoint de listagem de pacientes
    const res = http.get('http://localhost:3000/api-docs/get/medicamentos');

    check(res, {
        'status é 200': (r) => r.status === 200,
        'resposta não vazia': (r) => r.body.length > 0,
    });

    sleep(1); // pausa de 1 segundo entre requisições
}
