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
     *       401:
     *         description: Não autorizado
     *       500:
     *         description: Erro interno no servidor
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
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID da prescrição
     *     responses:
     *       200:
     *         description: Dados da prescrição
     *       400:
     *         description: ID inválido
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Prescrição não encontrada
     *       500:
     *         description: Erro interno
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
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do paciente
     *     responses:
     *       200:
     *         description: Lista de prescrições
     *       400:
     *         description: ID inválido
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Nenhuma prescrição encontrada para este paciente
     *       500:
     *         description: Erro interno
     */
    this.router.get('/paciente/:id_paciente', controller.findByPacienteId);

    /**
     * @swagger
     * /prescricoes/medico/{crm}:
     *   get:
     *     summary: Busca prescrições por médico pelo CRM
     *     tags: [Prescricoes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: crm
     *         required: true
     *         schema:
     *           type: string
     *         description: CRM do médico
     *     responses:
     *       200:
     *         description: Lista de prescrições
     *       400:
     *         description: CRM inválido
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Nenhuma prescrição encontrada para este médico
     *       500:
     *         description: Erro interno
     */
    this.router.get('/medico/:crm', controller.findByMedicoId);


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
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autorizado
     *       409:
     *         description: Conflito - prescrição já existe
     *       500:
     *         description: Erro interno
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
     *         required: true
     *         schema:
     *           type: integer
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
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Prescrição não encontrada
     *       500:
     *         description: Erro interno
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
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID da prescrição
     *     responses:
     *       200:
     *         description: Prescrição removida
     *       400:
     *         description: ID inválido
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Prescrição não encontrada
     *       500:
     *         description: Erro interno
     */
    this.router.delete('/:id', controller.remove);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new PrescricoesRoutes().getRouter();
