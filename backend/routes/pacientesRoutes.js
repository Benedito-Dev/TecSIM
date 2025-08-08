const express = require('express');
const controller = require('../controllers/pacientesController');
const ValidatePaciente = require('../middleware/validatePaciente');
const upload = require('../config/multer');

class PacientesRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: Pacientes
     *     description: Gestão de pacientes do sistema
     */

    /**
     * @swagger
     * /pacientes:
     *   get:
     *     summary: Lista todos os pacientes (sem informações sensíveis)
     *     tags: [Pacientes]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de pacientes
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Paciente'
     *       401:
     *         description: Não autorizado
     *       500:
     *         description: Erro interno
     */
    this.router.get('/', controller.getAll);

    /**
     * @swagger
     * /pacientes/{id}:
     *   get:
     *     summary: Obtém um paciente pelo ID
     *     tags: [Pacientes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do paciente
     *     responses:
     *       200:
     *         description: Dados do paciente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Paciente'
     *       400:
     *         description: ID inválido. Formato incorreto.
     *       404:
     *         description: Paciente não encontrado
     *       401:
     *         description: Não autorizado
     */
    this.router.get('/:id', controller.getById);

    /**
     * @swagger
     * /pacientes/email/{email}:
     *   get:
     *     summary: Busca paciente por email
     *     tags: [Pacientes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: email
     *         schema:
     *           type: string
     *           format: email
     *         required: true
     *         description: Email do paciente
     *     responses:
     *       200:
     *         description: Dados do paciente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Paciente'
     *       404:
     *         description: Paciente não encontrado
     *       401:
     *         description: Não autorizado
     */
    this.router.get('/email/:email', controller.getByEmail);

    /**
     * @swagger
     * /pacientes:
     *   post:
     *     summary: Cria um novo paciente
     *     tags: [Pacientes]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             allOf:
     *               - $ref: '#/components/schemas/Paciente'
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
     *         description: Paciente criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Paciente'
     *       400:
     *         description: Dados inválidos
     *       409:
     *         description: Email já cadastrado
     */
    this.router.post('/', ValidatePaciente.validateCreate, controller.create);

    /**
     * @swagger
     * /pacientes/{id}/foto:
     *   post:
     *     summary: Atualiza a foto de perfil do paciente
     *     tags: [Pacientes]
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - multipart/form-data
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do paciente
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               image:
     *                 type: string
     *                 format: binary
     *                 description: Arquivo da imagem
     *     responses:
     *       200:
     *         description: Foto atualizada com sucesso
     *       400:
     *         description: Dados inválidos
     *       404:
     *         description: Paciente não encontrado
     *       500:
     *         description: Erro ao atualizar foto
     */
    this.router.post('/:id/foto', upload.single('image'), controller.uploadFoto);

    /**
     * @swagger
     * /pacientes/{id}:
     *   put:
     *     summary: Atualiza todos os dados do paciente
     *     tags: [Pacientes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do paciente
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Paciente'
     *     responses:
     *       200:
     *         description: Paciente atualizado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Paciente'
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Paciente não encontrado
     */
    this.router.put('/:id', ValidatePaciente.validateUpdate, controller.update);

    /**
     * @swagger
     * /pacientes/{id}/password:
     *   patch:
     *     summary: Atualiza a senha do paciente
     *     tags: [Pacientes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do paciente
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
     *         description: Paciente não encontrado
     */
    this.router.patch('/:id/password', ValidatePaciente.validatePassword, controller.updatePassword);

    /**
     * @swagger
     * /pacientes/{id}:
     *   delete:
     *     summary: Remove um paciente
     *     tags: [Pacientes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do paciente
     *     responses:
     *       204:
     *         description: Paciente removido com sucesso
     *       401:
     *         description: Não autorizado
     *       404:
     *         description: Paciente não encontrado
     */
    this.router.delete('/:id', controller.remove);
    
    /**
     * @swagger
     * /pacientes/{id}/inativar:
     *   patch:
     *     summary: Desativa (inativa) um paciente
     *     tags: [Pacientes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do paciente a ser inativado
     *     responses:
     *       200:
     *         description: Paciente inativado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Paciente desativado com sucesso
     *                 data:
     *                   $ref: '#/components/schemas/Paciente'
     *       404:
     *         description: Paciente não encontrado
     *       401:
     *         description: Não autorizado
     *       500:
     *         description: Erro ao desativar paciente
     */
    this.router.patch('/:id/inativar', controller.desativar);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new PacientesRoutes().getRouter();
