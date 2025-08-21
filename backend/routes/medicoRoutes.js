const express = require('express');
const controller = require('../controllers/medicoController');
// const ValidateMedico = require('../middleware/validateMedico');
const authMiddleware = require('../middleware/authMiddleware');

class MedicosRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: Médicos
     *     description: Gestão de médicos do sistema
     */

    /**
     * @swagger
     * /medicos:
     *   get:
     *     summary: Lista todos os médicos cadastrados
     *     tags: [Médicos]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de médicos
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Medico'
     *       401:
     *         description: Não autorizado
     *       500:
     *         description: Erro interno
     */
    this.router.get('/', authMiddleware, controller.getAll);

    /**
     * @swagger
     * /medicos/{id}:
     *   get:
     *     summary: Obtém um médico pelo ID
     *     tags: [Médicos]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do médico
     *     responses:
     *       200:
     *         description: Dados do médico
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Medico'
     *       404:
     *         description: Médico não encontrado
     *       401:
     *         description: Não autorizado
     */
    this.router.get('/:id', authMiddleware, controller.getById);

    /**
     * @swagger
     * /medicos/email/{email}:
     *   get:
     *     summary: Busca médico por email
     *     tags: [Médicos]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: email
     *         schema:
     *           type: string
     *           format: email
     *         required: true
     *         description: Email do médico
     *     responses:
     *       200:
     *         description: Dados do médico
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Medico'
     *       404:
     *         description: Médico não encontrado
     *       401:
     *         description: Não autorizado
     */
    this.router.get('/email/:email', authMiddleware, controller.getByEmail);

    /**
     * @swagger
     * /medicos/crm/{crm}:
     *   get:
     *     summary: Busca médico por CRM
     *     tags: [Médicos]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: crm
     *         schema:
     *           type: string
     *         required: true
     *         description: CRM do médico
     *     responses:
     *       200:
     *         description: Dados do médico
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Medico'
     *       404:
     *         description: Médico não encontrado
     *       401:
     *         description: Não autorizado
     */
    this.router.get('/crm/:crm', authMiddleware, controller.getByCrm);

    /**
     * @swagger
     * /medicos:
     *   post:
     *     summary: Cadastra um novo médico
     *     tags: [Médicos]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             allOf:
     *               - $ref: '#/components/schemas/Medico'
     *               - type: object
     *                 required:
     *                   - senha
     *                   - crm
     *                 properties:
     *                   senha:
     *                     type: string
     *                     minLength: 8
     *                     example: "Senha@123"
     *                   crm:
     *                     type: string
     *                     description: Número do CRM
     *                     example: "SP123456"
     *     responses:
     *       201:
     *         description: Médico cadastrado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Medico'
     *       400:
     *         description: Dados inválidos
     *       409:
     *         description: CRM ou email já cadastrado
     */
    this.router.post('/', controller.create); // rota pública, sem auth

    /**
     * @swagger
     * /medicos/{id}:
     *   put:
     *     summary: Atualiza os dados de um médico
     *     tags: [Médicos]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do médico
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Medico'
     *     responses:
     *       200:
     *         description: Médico atualizado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Medico'
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Médico não encontrado
     *       409:
     *         description: CRM já está em uso
     */
    this.router.put('/:id', authMiddleware, controller.update);

    /**
     * @swagger
     * /medicos/{id}/password:
     *   patch:
     *     summary: Atualiza a senha do médico
     *     tags: [Médicos]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do médico
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - senhaAtual
     *               - novaSenha
     *             properties:
     *               senhaAtual:
     *                 type: string
     *                 example: "SenhaAntiga@123"
     *               novaSenha:
     *                 type: string
     *                 minLength: 8
     *                 example: "NovaSenha@123"
     *     responses:
     *       200:
     *         description: Senha atualizada com sucesso
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autorizado/Senha atual incorreta
     *       404:
     *         description: Médico não encontrado
     */
    this.router.patch('/:id/password', authMiddleware, controller.updatePassword);

    /**
     * @swagger
     * /medicos/{id}:
     *   delete:
     *     summary: Remove um médico do sistema
     *     tags: [Médicos]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do médico
     *     responses:
     *       204:
     *         description: Médico removido com sucesso
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Médico não encontrado
     */
    this.router.delete('/:id', authMiddleware, controller.remove);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new MedicosRoutes().getRouter();
