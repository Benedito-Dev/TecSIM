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
     *           application/json:
     *             schema:
     *                 $ref: '#/components/schemas/Medicamento'
     *     responses:
     *       201:
     *         description: Medicamento Criado
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
     *         description: Dados dos Medicamentos
     */
    this.router.get('/', controller.findAll);

    /**
     * @swagger
     * /medicamentos/{id}:
     *   get:
     *     summary: Obtém um medicamento por ID
     *     tags: [Medicamentos]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema: { type: string }
     *         required: true
     *     responses:
     *       200:
     *         description: Medicamento encontrado
     *       404:
     *         description: Não encontrado
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
     *         schema: { type: string }
     *         required: true
     *     requestBody:
     *       required: true
     *       content:
     *           application/json:
     *             schema:
     *                 $ref: '#/components/schemas/Medicamento'
     *     responses:
     *       200: 
     *         description: Medicamento Atualizado
     *       404:
     *         description: Não encontrado
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
     *         schema: { type: string }
     *         required: true
     *     responses:
     *       204: 
     *         description: Remoção Bem Sucessida
     *       404:
     *         description: Não encontrado
     */
    this.router.delete('/:id', controller.remove);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new MedicamentoRoutes().getRouter();