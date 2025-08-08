const express = require('express');
const controller = require('../controllers/medicoController');

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
     *       401:
     *         description: Não autorizado
     *       500:
     *         description: Erro interno
     */
    this.router.get('/', controller.getAll);

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
     *       400:
     *         description: ID inválido
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Médico não encontrado
     *       500:
     *         description: Erro interno
     */
    this.router.get('/:id', controller.getById);

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
     *     responses:
     *       200:
     *         description: Dados do médico
     *       400:
     *         description: Email inválido
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Médico não encontrado
     *       500:
     *         description: Erro interno
     */
    this.router.get('/email/:email', controller.getByEmail);

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
     *     responses:
     *       200:
     *         description: Dados do médico
     *       400:
     *         description: CRM inválido
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Médico não encontrado
     *       500:
     *         description: Erro interno
     */
    this.router.get('/crm/:crm', controller.getByCrm);

    /**
     * @swagger
     * /medicos/especialidade/{especialidade}:
     *   get:
     *     summary: Lista médicos por especialidade
     *     tags: [Médicos]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: especialidade
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       200:
     *         description: Lista de médicos
     *       400:
     *         description: Especialidade inválida
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Nenhum médico encontrado
     *       500:
     *         description: Erro interno
     */
    this.router.get('/especialidade/:especialidade', controller.getByEspecialidade);

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
     *             $ref: '#/components/schemas/Medico'
     *     responses:
     *       201:
     *         description: Médico cadastrado
     *       400:
     *         description: Dados inválidos
     *       409:
     *         description: CRM ou email já cadastrados
     *       500:
     *         description: Erro interno
     */
    this.router.post('/', controller.create);

    /**
     * @swagger
     * /medicos/{id}:
     *   put:
     *     summary: Atualiza dados do médico
     *     tags: [Médicos]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *     responses:
     *       200:
     *         description: Médico atualizado
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Médico não encontrado
     *       409:
     *         description: CRM já em uso
     *       500:
     *         description: Erro interno
     */
    this.router.put('/:id', controller.update);

    /**
     * @swagger
     * /medicos/{id}/password:
     *   patch:
     *     summary: Atualiza a senha do médico
     *     tags: [Médicos]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Senha atualizada
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autorizado ou senha incorreta
     *       404:
     *         description: Médico não encontrado
     *       500:
     *         description: Erro interno
     */
    this.router.patch('/:id/password', controller.updatePassword);

    /**
     * @swagger
     * /medicos/{id}:
     *   delete:
     *     summary: Remove um médico
     *     tags: [Médicos]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       204:
     *         description: Médico removido
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Médico não encontrado
     *       500:
     *         description: Erro interno
     */
    this.router.delete('/:id', controller.remove);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new MedicosRoutes().getRouter();
