const express = require('express');
const router = express.Router();
const controller = require('../controllers/medicamentoController');uire('../services/mongoMedicamentosServices');

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
router.get('/', ctrl.findAll);
module.exports = router;
