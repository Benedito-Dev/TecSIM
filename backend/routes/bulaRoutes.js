const express = require('express');
const controller = require('../controllers/bulaController');

class BulaRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    /**
     * @swagger
     * tags:
     *   name: Bulas
     *   description: Gestão de bulas de medicamentos
     */

    /**
     * @swagger
     * /bulas:
     *   post:
     *     summary: Cria uma nova bula
     *     tags: [Bulas]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Bula'
     *     responses:
     *       201:
     *         description: Bula criada com sucesso
     *       400:
     *         description: |
     *           Requisição inválida. Possíveis causas:
     *           - Campos obrigatórios ausentes
     *           - Formato de dados inválido
     *           - Dados em formato incorreto (ex: string onde deveria ser número)
     *           - Valores fora do intervalo permitido
     *       401:
     *         description: Não autorizado (token inválido ou ausente)
     *       403:
     *         description: Proibido (usuário não tem permissão)
     *       409:
     *         description: Conflito (bula já existe para este medicamento)
     *       413:
     *         description: Payload muito grande
     *       415:
     *         description: Tipo de mídia não suportado
     *       422:
     *         description: Entidade não processável (semântica inválida)
     *       429:
     *         description: Muitas requisições (rate limiting)
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.post('/', controller.create);

    /**
     * @swagger
     * /bulas:
     *   get:
     *     summary: Retorna todas as bulas
     *     tags: [Bulas]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: Número da página
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 100
     *         description: Limite de itens por página
     *     responses:
     *       200:
     *         description: Lista de bulas
     *       400:
     *         description: |
     *           Requisição inválida. Possíveis causas:
     *           - Parâmetros de paginação inválidos
     *           - Valores fora dos limites (ex: limit > 100)
     *       401:
     *         description: Não autorizado
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.get('/', controller.findAll);

    /**
     * @swagger
     * /bulas/{id}:
     *   get:
     *     summary: Obtém uma bula por ID
     *     tags: [Bulas]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema: 
     *           type: string
     *           pattern: '^[a-f\d]{24}$'
     *         required: true
     *         description: ID da bula no formato ObjectId
     *     responses:
     *       200:
     *         description: Bula encontrada
     *       400:
     *         description: |
     *           ID inválido. Motivos:
     *           - Formato incorreto (não é ObjectId válido)
     *           - Tamanho inválido
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Bula não encontrada
     *       410:
     *         description: Bula removida permanentemente
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.get('/:id', controller.findById);

    /**
     * @swagger
     * /bulas/medicamento/{id_medicamento}:
     *   get:
     *     summary: Obtém a bula associada a um medicamento
     *     tags: [Bulas]
     *     parameters:
     *       - in: path
     *         name: id_medicamento
     *         schema: 
     *           type: string
     *           pattern: '^[a-f\d]{24}$'
     *         required: true
     *         description: ID do medicamento no formato ObjectId
     *     responses:
     *       200:
     *         description: Bula encontrada
     *       400:
     *         description: |
     *           ID do medicamento inválido. Motivos:
     *           - Formato incorreto
     *           - Tamanho inválido
     *       404:
     *         description: |
     *           Não encontrada. Possíveis causas:
     *           - Medicamento não existe
     *           - Medicamento existe mas não tem bula associada
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.get('/medicamento/:id_medicamento', controller.findByMedicamentoId);

    /**
     * @swagger
     * /bulas/{id}:
     *   put:
     *     summary: Atualiza uma bula existente
     *     tags: [Bulas]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema: 
     *           type: string
     *           pattern: '^[a-f\d]{24}$'
     *         required: true
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Bula'
     *     responses:
     *       200:
     *         description: Bula atualizada
     *       400:
     *         description: |
     *           Requisição inválida. Possíveis causas:
     *           - ID inválido
     *           - Campos obrigatórios ausentes
     *           - Validação de dados falhou
     *           - Tentativa de modificar campos imutáveis
     *       401:
     *         description: Não autorizado
     *       403:
     *         description: Proibido (não é dono da bula)
     *       404:
     *         description: Bula não encontrada
     *       412:
     *         description: Pré-condição falhou (versionamento)
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.put('/:id', controller.update);

    /**
     * @swagger
     * /bulas/{id}:
     *   delete:
     *     summary: Remove uma bula
     *     tags: [Bulas]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema: 
     *           type: string
     *           pattern: '^[a-f\d]{24}$'
     *         required: true
     *     responses:
     *       200:
     *         description: Remoção bem-sucedida
     *       400:
     *         description: |
     *           ID inválido. Motivos:
     *           - Formato incorreto
     *           - Já está removido
     *       401:
     *         description: Não autorizado
     *       403:
     *         description: Proibido (não é dono ou admin)
     *       404:
     *         description: Bula não encontrada
     *       423:
     *         description: Bloqueado (bula em processo de remoção)
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.delete('/:id', controller.remove);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new BulaRoutes().getRouter();
