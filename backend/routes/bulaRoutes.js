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
     */
    this.router.post('/',  controller.create);

    /**
     * @swagger
     * /bulas:
     *   get:
     *     summary: Retorna todas as bulas
     *     tags: [Bulas]
     *     responses:
     *       200:
     *         description: Lista de bulas
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
     *         schema: { type: string }
     *         required: true
     *     responses:
     *       200:
     *         description: Bula encontrada
     *       404:
     *         description: Não encontrada
     */
    this.router.get('/:id',  controller.findById);

    /**
     * @swagger
     * /bulas/medicamento/{id_medicamento}:
     *   get:
     *     summary: Obtém a bula associada a um medicamento
     *     tags: [Bulas]
     *     parameters:
     *       - in: path
     *         name: id_medicamento
     *         schema: { type: string }
     *         required: true
     *     responses:
     *       200:
     *         description: Bula encontrada
     *       404:
     *         description: Não encontrada
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
     *         schema: { type: string }
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
     *       404:
     *         description: Não encontrada
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
     *         schema: { type: string }
     *         required: true
     *     responses:
     *       200:
     *         description: Remoção bem-sucedida
     *       404:
     *         description: Não encontrada
     */
    this.router.delete('/:id', controller.remove);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new BulaRoutes().getRouter();
