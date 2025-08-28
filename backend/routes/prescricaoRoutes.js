const express = require('express');
const controller = require('../controllers/prescricaoController.js');
const ValidatePrescricao = require('../middleware/validatePrescricao');
const authMiddleware = require('../middleware/authMiddleware');

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
    this.router.get('/', authMiddleware, controller.findAll);

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
    this.router.get('/:id', authMiddleware, controller.findById);

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
    this.router.get('/paciente/:id_paciente', authMiddleware, controller.findByPacienteId);

    /**
     * @swagger
     * /prescricoes/medico/{crm_medico}:
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
    this.router.get('/medico/:crm_medico', authMiddleware, controller.findByMedicoCrm);

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
     *             type: object
     *             required:
     *               - id_paciente
     *               - id_medico
     *               - crm
     *               - diagnostico
     *               - data_prescricao
     *             properties:
     *               id_paciente:
     *                 type: integer
     *               id_medico:
     *                 type: integer
     *               crm:
     *                 type: string
     *                 example: "CRM-SP-123456"
     *               diagnostico:
     *                 type: string
     *               data_prescricao:
     *                 type: string
     *                 format: date
     *               validade:
     *                 type: string
     *                 format: date
     *     responses:
     *       201:
     *         description: Prescrição criada com sucesso
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autorizado
     */
    this.router.post('/', authMiddleware, ValidatePrescricao.validateCreate, controller.create);

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
     *             type: object
     *             required:
     *               - id_paciente
     *               - id_medico
     *               - crm
     *               - diagnostico
     *               - data_prescricao
     *             properties:
     *               id_paciente:
     *                 type: integer
     *               id_medico:
     *                 type: integer
     *               crm:
     *                 type: string
     *                 example: "CRM-SP-654321"
     *               diagnostico:
     *                 type: string
     *               data_prescricao:
     *                 type: string
     *                 format: date
     *               validade:
     *                 type: string
     *                 format: date
     *     responses:
     *       200:
     *         description: Prescrição atualizada
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Prescrição não encontrada
     */
    this.router.put('/:id', authMiddleware, ValidatePrescricao.validateUpdate, controller.update);

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
     *       204:
     *         description: Prescrição removida com sucesso
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Prescrição não encontrada
     */
    this.router.delete('/:id', authMiddleware, controller.remove);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new PrescricoesRoutes().getRouter();
