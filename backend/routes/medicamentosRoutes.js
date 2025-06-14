const express = require('express');
const router = express.Router();
const controller = require('../controllers/medicamentoController');

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
 *             type: object
 *             required: [nome, dosagem]
 *             properties:
 *               nome: { type: string }
 *               dosagem: { type: string }
 *               laboratorio: { type: string }
 *               quantidade: { type: integer }
 *     responses:
 *       201: { description: Medicamento criado }
 */
router.post('/', controller.create);

/**
 * @swagger
 * /medicamentos:
 *   get:
 *     summary: Retorna todos os medicamentos
 *     tags: [Medicamentos]
 *     responses:
 *       200: { description: Lista de medicamentos }
 */
router.get('/', controller.findAll);

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
 *       200: { description: Medicamento encontrado }
 *       404: { description: Não encontrado }
 */
router.get('/:id', controller.findById);

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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string }
 *               dosagem: { type: string }
 *               laboratorio: { type: string }
 *               quantidade: { type: integer }
 *     responses:
 *       200: { description: Medicamento atualizado }
 *       404: { description: Não encontrado }
 */
router.put('/:id', controller.update);

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
 *       204: { description: Remoção bem‑sucedida }
 *       404: { description: Não encontrado }
 */
router.delete('/:id', controller.remove);
module.exports = router;
