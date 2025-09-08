const express = require('express');
const controller = require('../controllers/medicamentoController');

class MedicamentoRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    /**
     * @swagger
     * tags:
     *   name: Medicamentos
     *   description: Gestão de medicamentos
     */

    /**
     * @swagger
     * /medicamentos:
     *   post:
     *     summary: Cria um novo medicamento
     *     tags: [Medicamentos]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Medicamento'
     *     responses:
     *       201:
     *         description: Medicamento criado com sucesso
     *       400:
     *         description: |
     *           Requisição inválida. Possíveis causas:
     *           - Campos obrigatórios ausentes
     *           - Formato de dados inválido
     *           - Dados em formato incorreto
     *       409:
     *         description: Medicamento já cadastrado
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.post('/', controller.create);

    /**
     * @swagger
     * /medicamentos:
     *   get:
     *     summary: Retorna todos os medicamentos
     *     tags: [Medicamentos]
     *     responses:
     *       200:
     *         description: Lista de medicamentos
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.get('/', controller.findAll);

    /**
     * @swagger
     * /medicamentos/search:
     *   get:
     *     summary: Busca medicamentos por termo (alternativa à query principal)
     *     tags: [Medicamentos]
     *     parameters:
     *       - in: query
     *         name: q
     *         schema:
     *           type: string
     *         required: true
     *         description: Termo de busca para filtrar medicamentos por nome
     *     responses:
     *       200:
     *         description: Lista de medicamentos filtrados
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Medicamento'
     *       400:
     *         description: Parâmetro de busca ausente ou inválido
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.get('/search', controller.search);

    /**
     * @swagger
     * /medicamentos/{id}:
     *   get:
     *     summary: Obtém um medicamento por ID
     *     tags: [Medicamentos]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do medicamento
     *     responses:
     *       200:
     *         description: Medicamento encontrado
     *       400:
     *         description: ID inválido. Formato incorreto
     *       404:
     *         description: Medicamento não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.get('/:id', controller.findById);

    /**
     * @swagger
     * /medicamentos/{id}:
     *   put:
     *     summary: Atualiza um medicamento existente
     *     tags: [Medicamentos]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do medicamento
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Medicamento'
     *     responses:
     *       200:
     *         description: Medicamento atualizado com sucesso
     *       400:
     *         description: |
     *           Requisição inválida. Possíveis causas:
     *           - ID inválido
     *           - Campos obrigatórios ausentes
     *       404:
     *         description: Medicamento não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.put('/:id', controller.update);

    /**
     * @swagger
     * /medicamentos/{id}:
     *   delete:
     *     summary: Remove um medicamento
     *     tags: [Medicamentos]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do medicamento
     *     responses:
     *       200:
     *         description: Medicamento removido com sucesso
     *       400:
     *         description: ID inválido. Formato incorreto
     *       404:
     *         description: Medicamento não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.delete('/:id', controller.remove);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new MedicamentoRoutes().getRouter();