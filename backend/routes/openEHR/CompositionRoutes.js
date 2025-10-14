const express = require('express');
const CompositionController = require('../../controllers/openEHR/compositionController');
const authMiddleware = require('../../middleware/authMiddleware');

class CompositionRoutes {
  constructor() {
    this.router = express.Router();
    this.controller = new CompositionController();
    this.registerRoutes();
  }

  registerRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: EHR-Compositions
     *     description: Gestão de composições openEHR
     */

    /**
     * @swagger
     * /ehr/compositions:
     *   post:
     *     summary: Cria uma nova composição openEHR
     *     tags: [EHR-Compositions]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - paciente_id
     *               - template_id
     *               - composition_data
     *             properties:
     *               paciente_id:
     *                 type: integer
     *                 example: 1
     *               template_id:
     *                 type: string
     *                 enum: [BLOOD_PRESSURE_V1, HEART_RATE_V1, TEMPERATURE_V1, SYMPTOMS_V1, MEDICATION_V1]
     *                 example: "BLOOD_PRESSURE_V1"
     *               composition_data:
     *                 type: object
     *                 example: {
     *                   "systolic": 120,
     *                   "diastolic": 80,
     *                   "heart_rate": 72,
     *                   "position": "sentado"
     *                 }
     *               author:
     *                 type: string
     *                 example: "dr.silva"
     *     responses:
     *       201:
     *         description: Composição criada com sucesso
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autorizado
     */
    this.router.post('/compositions', authMiddleware, this.controller.createComposition);

    /**
     * @swagger
     * /ehr/compositions/patient/{pacienteId}:
     *   get:
     *     summary: Lista composições de um paciente
     *     tags: [EHR-Compositions]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: pacienteId
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do paciente
     *       - in: query
     *         name: templateId
     *         schema:
     *           type: string
     *         description: Filtrar por template específico
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 50
     *         description: Limite de resultados
     *       - in: query
     *         name: offset
     *         schema:
     *           type: integer
     *           default: 0
     *         description: Offset para paginação
     *     responses:
     *       200:
     *         description: Lista de composições do paciente
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Paciente não encontrado
     */
    this.router.get('/compositions/patient/:pacienteId', authMiddleware, this.controller.getPatientCompositions);

    /**
     * @swagger
     * /ehr/compositions/{compositionId}:
     *   get:
     *     summary: Obtém uma composição pelo ID
     *     tags: [EHR-Compositions]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: compositionId
     *         schema:
     *           type: string
     *         required: true
     *         description: ID da composição
     *     responses:
     *       200:
     *         description: Dados da composição
     *       404:
     *         description: Composição não encontrada
     *       401:
     *         description: Não autorizado
     */
    this.router.get('/compositions/:compositionId', authMiddleware, this.controller.getComposition);

    /**
     * @swagger
     * /ehr/compositions/{compositionId}:
     *   put:
     *     summary: Atualiza uma composição (cria nova versão)
     *     tags: [EHR-Compositions]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: compositionId
     *         schema:
     *           type: string
     *         required: true
     *         description: ID da composição
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               composition_data:
     *                 type: object
     *                 example: {
     *                   "systolic": 130,
     *                   "diastolic": 85,
     *                   "heart_rate": 75
     *                 }
     *               author:
     *                 type: string
     *                 example: "dr.silva"
     *     responses:
     *       200:
     *         description: Composição atualizada com sucesso
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Composição não encontrada
     */
    this.router.put('/compositions/:compositionId', authMiddleware, this.controller.updateComposition);

    /**
     * @swagger
     * /ehr/compositions/{compositionId}:
     *   delete:
     *     summary: Remove uma composição (soft delete)
     *     tags: [EHR-Compositions]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: compositionId
     *         schema:
     *           type: string
     *         required: true
     *         description: ID da composição
     *     responses:
     *       200:
     *         description: Composição removida com sucesso
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Composição não encontrada
     */
    this.router.delete('/compositions/:compositionId', authMiddleware, this.controller.deleteComposition);

    /**
     * @swagger
     * /ehr/patient/{pacienteId}/summary:
     *   get:
     *     summary: Obtém resumo clínico do paciente
     *     tags: [EHR-Compositions]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: pacienteId
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do paciente
     *     responses:
     *       200:
     *         description: Resumo clínico do paciente
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Paciente não encontrado
     */
    this.router.get('/patient/:pacienteId/summary', authMiddleware, this.controller.getPatientClinicalSummary);

    /**
     * @swagger
     * /ehr/health:
     *   get:
     *     summary: Health check do serviço openEHR
     *     tags: [EHR-Compositions]
     *     responses:
     *       200:
     *         description: Serviço está funcionando
     *       500:
     *         description: Serviço com problemas
     */
    this.router.get('/health', this.controller.healthCheck);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new CompositionRoutes().getRouter();