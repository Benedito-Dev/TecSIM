const express = require('express');
const controller = require('../controllers/pacientesController');
const ValidatePaciente = require('../middleware/validatePaciente');

class PacientesRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: Usuários
     *     description: Gestão de usuários do sistema
     */

    /**
     * @swagger
     * /usuarios:
     *   get:
     *     summary: Lista todos os usuários (sem informações sensíveis)
     *     tags: [Usuários]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de usuários
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Usuario'
     *       401:
     *         description: Não autorizado
     *       500:
     *         description: Erro interno
     */
    this.router.get('/', controller.getAll);

    /**
     * @swagger
     * /usuarios/{id}:
     *   get:
     *     summary: Obtém um usuário pelo ID
     *     tags: [Usuários]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do usuário
     *     responses:
     *       200:
     *         description: Dados do usuário
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Usuario'
     *       404:
     *         description: Usuário não encontrado
     *       401:
     *         description: Não autorizado
     */
    this.router.get('/:id', controller.getById);

    /**
     * @swagger
     * /usuarios/email/{email}:
     *   get:
     *     summary: Busca usuário por email
     *     tags: [Usuários]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: email
     *         schema:
     *           type: string
     *           format: email
     *         required: true
     *         description: Email do usuário
     *     responses:
     *       200:
     *         description: Dados do usuário
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Usuario'
     *       404:
     *         description: Usuário não encontrado
     *       401:
     *         description: Não autorizado
     */
    this.router.get('/email/:email', controller.getByEmail);

    /**
     * @swagger
     * /usuarios:
     *   post:
     *     summary: Cria um novo usuário
     *     tags: [Usuários]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             allOf:
     *               - $ref: '#/components/schemas/Usuario'
     *               - type: object
     *                 required:
     *                   - senha
     *                   - aceite_termos
     *                 properties:
     *                   senha:
     *                     type: string
     *                     minLength: 8
     *                     example: "Senha@123"
     *                   aceite_termos:
     *                     type: boolean
     *                     example: true
     *     responses:
     *       201:
     *         description: Usuário criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Usuario'
     *       400:
     *         description: Dados inválidos
     *       409:
     *         description: Email já cadastrado
     */
    this.router.post('/', ValidatePaciente.validateCreate, controller.create);

    /**
     * @swagger
     * /usuarios/{id}:
     *   put:
     *     summary: Atualiza todos os dados do usuário
     *     tags: [Usuários]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do usuário
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Usuario'
     *     responses:
     *       200:
     *         description: Usuário atualizado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Usuario'
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Usuário não encontrado
     */
    this.router.put('/:id', ValidatePaciente.validateUpdate, controller.update);

    /**
     * @swagger
     * /usuarios/{id}/password:
     *   patch:
     *     summary: Atualiza a senha do usuário
     *     tags: [Usuários]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do usuário
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
     *         description: Usuário não encontrado
     */
    this.router.patch('/:id/password', ValidatePaciente.validatePassword, controller.updatePassword);

    /**
     * @swagger
     * /usuarios/{id}:
     *   delete:
     *     summary: Remove um usuário
     *     tags: [Usuários]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do usuário
     *     responses:
     *       204:
     *         description: Usuário removido com sucesso
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Usuário não encontrado
     */
    this.router.delete('/:id', controller.remove);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new PacientesRoutes().getRouter();