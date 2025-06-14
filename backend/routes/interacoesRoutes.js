const express = require('express');
const controller = require('../controllers/interacoesController');
// const ValidateInteracao = require('../middleware/validateInteracao'); // (Opcional)

class InteracoesMedicamentosRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: Interações Medicamentosas
     *     description: Gestão de interações entre medicamentos
     */

    /**
     * @swagger
     * /interacoes:
     *   get:
     *     summary: Lista todas as interações medicamentosas
     *     tags: [Interações Medicamentosas]
     *     responses:
     *       200:
     *         description: Lista de interações
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/InteracoesMedicamentos'
     *       500:
     *         description: Erro interno
     */
    this.router.get('/', controller.getAll);

    /**
     * @swagger
     * /interacoes/{id}:
     *   get:
     *     summary: Busca uma interação por ID
     *     tags: [Interações Medicamentosas]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID da interação
     *     responses:
     *       200:
     *         description: Dados da interação encontrada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/InteracoesMedicamentos'
     *       404:
     *         description: Interação não encontrada
     *       500:
     *         description: Erro ao buscar interação
     */
    this.router.get('/:id', controller.getById);

    /**
     * @swagger
     * /interacoes:
     *   post:
     *     summary: Cria uma nova interação medicamentosa
     *     tags: [Interações Medicamentosas]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/InteracoesMedicamentos'
     *     responses:
     *       201:
     *         description: Interação criada com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/InteracoesMedicamentos'
     *       400:
     *         description: Dados inválidos
     *       500:
     *         description: Erro ao criar interação
     */
    this.router.post('/', /* ValidateInteracao.validateCreate, */ controller.create);

    /**
     * @swagger
     * /interacoes/{id}:
     *   put:
     *     summary: Atualiza uma interação medicamentosa
     *     tags: [Interações Medicamentosas]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID da interação
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/InteracoesMedicamentos'
     *     responses:
     *       200:
     *         description: Interação atualizada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/InteracoesMedicamentos'
     *       400:
     *         description: Dados inválidos
     *       404:
     *         description: Interação não encontrada
     *       500:
     *         description: Erro ao atualizar interação
     */
    this.router.put('/:id', /* ValidateInteracao.validateUpdate, */ controller.update);

    /**
     * @swagger
     * /interacoes/{id}:
     *   delete:
     *     summary: Remove uma interação medicamentosa
     *     tags: [Interações Medicamentosas]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID da interação
     *     responses:
     *       200:
     *         description: Interação removida com sucesso
     *       404:
     *         description: Interação não encontrada
     *       500:
     *         description: Erro ao remover interação
     */
    this.router.delete('/:id', controller.remove);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new InteracoesMedicamentosRoutes().getRouter();
