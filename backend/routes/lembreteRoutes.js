const express = require('express');
const router = express.Router();
const lembreteController = require('../controllers/lembreteController');

/**
 * @swagger
 * tags:
 *   name: Lembretes
 *   description: Gerenciamento de lembretes de medicamentos
 */

/**
 * @swagger
 * /lembretes:
 *   get:
 *     summary: Lista todos os lembretes
 *     tags: [Lembretes]
 *     responses:
 *       200:
 *         description: Lista de lembretes retornada com sucesso
 */
router.get('/', lembreteController.getAll);

/**
 * @swagger
 * /lembretes/{id}:
 *   get:
 *     summary: Busca um lembrete pelo ID
 *     tags: [Lembretes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lembrete encontrado
 *       404:
 *         description: Lembrete não encontrado
 */
router.get('/:id', lembreteController.getById);

/**
 * @swagger
 * /lembretes:
 *   post:
 *     summary: Cria um novo lembrete
 *     tags: [Lembretes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_paciente: { type: integer }
 *               id_prescricao: { type: integer }
 *               id_medicamento: { type: integer }
 *               horario: { type: string, example: "08:00:00" }
 *               data_inicio: { type: string, example: "2025-10-10" }
 *               data_fim: { type: string, example: "2025-10-20" }
 *               canal_envio: { type: string, example: "email" }
 *               enviado: { type: boolean, example: false }
 *     responses:
 *       201:
 *         description: Lembrete criado com sucesso
 */
router.post('/', lembreteController.create);

/**
 * @swagger
 * /lembretes/{id}:
 *   put:
 *     summary: Atualiza um lembrete existente
 *     tags: [Lembretes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Lembrete atualizado
 */
router.put('/:id', lembreteController.update);

/**
 * @swagger
 * /lembretes/{id}:
 *   delete:
 *     summary: Remove um lembrete
 *     tags: [Lembretes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Lembrete removido
 */
router.delete('/:id', lembreteController.delete);

module.exports = router;
