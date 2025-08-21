const express = require('express');
const controller = require('../controllers/bulaController');
const authMiddleware = require('../middleware/authMiddleware');

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
     *         description: Requisição inválida (campos ausentes ou formato incorreto)
     *       401:
     *         description: Não autorizado
     *       403:
     *         description: Proibido (sem permissão)
     *       409:
     *         description: Conflito (bula já cadastrada)
     *       415:
     *         description: Tipo de mídia não suportado
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.post('/',  controller.create);

    /**
     * @swagger
     * /bulas:
     *   get:
     *     summary: Lista todas as bulas
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
     *         description: Limite de registros por página
     *     responses:
     *       200:
     *         description: Lista de bulas retornada com sucesso
     *       400:
     *         description: Parâmetros de paginação inválidos
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.get('/', controller.findAll);

    /**
     * @swagger
     * /bulas/{id}:
     *   get:
     *     summary: Busca uma bula pelo ID
     *     tags: [Bulas]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           pattern: '^[a-fA-F0-9]{24}$'
     *         required: true
     *         description: ID da bula (ObjectId)
     *     responses:
     *       200:
     *         description: Bula encontrada
     *       400:
     *         description: ID inválido
     *       404:
     *         description: Bula não encontrada
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.get('/:id',  controller.findById);

    /**
     * @swagger
     * /bulas/medicamento/{id_medicamento}:
     *   get:
     *     summary: Busca a bula pelo ID do medicamento
     *     tags: [Bulas]
     *     parameters:
     *       - in: path
     *         name: id_medicamento
     *         schema:
     *           type: string
     *           pattern: '^[a-fA-F0-9]{24}$'
     *         required: true
     *         description: ID do medicamento
     *     responses:
     *       200:
     *         description: Bula encontrada
     *       400:
     *         description: ID do medicamento inválido
     *       404:
     *         description: Nenhuma bula associada ao medicamento
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.get('/medicamento/:id_medicamento',  controller.findByMedicamentoId);

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
     *           pattern: '^[a-fA-F0-9]{24}$'
     *         required: true
     *         description: ID da bula
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Bula'
     *     responses:
     *       200:
     *         description: Bula atualizada com sucesso
     *       400:
     *         description: Dados inválidos ou ID incorreto
     *       404:
     *         description: Bula não encontrada
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
     *           pattern: '^[a-fA-F0-9]{24}$'
     *         required: true
     *         description: ID da bula
     *     responses:
     *       200:
     *         description: Bula removida com sucesso
     *       400:
     *         description: ID inválido
     *       404:
     *         description: Bula não encontrada
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
