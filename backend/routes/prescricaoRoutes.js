const express = require('express');
const controller = require('../controllers/prescricaoController.js');
const ValidatePrescricao = require('../middleware/validatePrescricao');


class PrescricoesRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: Prescricoes
     *     description: Gestão de prescrições médicas
     */

    /**
     * @swagger
     * /prescricoes:
     *   get:
     *     summary: Lista todas as prescrições
     *     tags: [Prescricoes]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de prescrições
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Prescricao'
     *       401:
     *         description: Não autorizado
     *       500:
     *         description: Erro interno
     */
    this.router.get('/', controller.findAll);

    /**
     * @swagger
     * /prescricoes/{id}:
     *   get:
     *     summary: Obtém uma prescrição pelo ID
     *     tags: [Prescricoes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID da prescrição
     *     responses:
     *       200:
     *         description: Dados da prescrição
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Prescricao'
     *       404:
     *         description: Prescrição não encontrada
     *       401:
     *         description: Não autorizado
     */
    this.router.get('/:id', controller.findById);

    /**
     * @swagger
     * /prescricoes/paciente/{id_paciente}:
     *   get:
     *     summary: Busca prescrições por paciente
     *     tags: [Prescricoes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id_paciente
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do paciente
     *     responses:
     *       200:
     *         description: Lista de prescrições do paciente
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Prescricao'
     *       404:
     *         description: Nenhuma prescrição encontrada para este paciente
     *       401:
     *         description: Não autorizado
     */
    this.router.get('/paciente/:id_paciente', controller.findByPacienteId);

    /**
     * @swagger
     * /prescricoes/medico/{id_medico}:
     *   get:
     *     summary: Busca prescrições por médico
     *     tags: [Prescricoes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id_medico
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do médico
     *     responses:
     *       200:
     *         description: Lista de prescrições do médico
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Prescricao'
     *       404:
     *         description: Nenhuma prescrição encontrada para este médico
     *       401:
     *         description: Não autorizado
     */
    this.router.get('/medico/:id_medico', controller.findByMedicoId);

    /**
     * @swagger
     * /prescricoes:
     *   post:
     *     summary: Cria uma nova prescrição
     *     tags: [Prescricoes]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Prescricao'
     *     responses:
     *       201:
     *         description: Prescrição criada com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Prescricao'
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autorizado
     */
    this.router.post('/', ValidatePrescricao.validateCreate, controller.create);

    /**
     * @swagger
     * /prescricoes/{id}:
     *   put:
     *     summary: Atualiza uma prescrição
     *     tags: [Prescricoes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID da prescrição
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Prescricao'
     *     responses:
     *       200:
     *         description: Prescrição atualizada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Prescricao'
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Prescrição não encontrada
     */
    this.router.put('/:id', ValidatePrescricao.validateUpdate, controller.update);

    /**
     * @swagger
     * /prescricoes/{id}:
     *   delete:
     *     summary: Remove uma prescrição
     *     tags: [Prescricoes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID da prescrição
     *     responses:
     *       200:
     *         description: Prescrição removida com sucesso
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Prescrição não encontrada
     */
    this.router.delete('/:id', controller.remove);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new PrescricoesRoutes().getRouter();