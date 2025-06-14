const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

class AuthRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: Autenticação
     *     description: Operações de autenticação e gestão de tokens
     */

    /**
     * @swagger
     * components:
     *   securitySchemes:
     *     bearerAuth:
     *       type: http
     *       scheme: bearer
     *       bearerFormat: JWT
     *   schemas:
     *     LoginRequest:
     *       type: object
     *       required:
     *         - email
     *         - senha
     *       properties:
     *         email:
     *           type: string
     *           format: email
     *           example: usuario@example.com
     *         senha:
     *           type: string
     *           example: Senha@123
     *     LoginResponse:
     *       type: object
     *       properties:
     *         usuario:
     *           type: object
     *           properties:
     *             id:
     *               type: integer
     *               example: 1
     *             nome:
     *               type: string
     *               example: Usuario
     *             email:
     *               type: string
     *               example: usuario@example.com
     *             genero:
     *                type: string
     *                example: man
     *             idade:
     *                type: integer
     *                example: 17
     *         token:
     *           type: string
     *           description: Token JWT para autenticação
     */

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Autentica um usuário
     *     tags: [Autenticação]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginRequest'
     *     responses:
     *       200:
     *         description: Login realizado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LoginResponse'
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Credenciais inválidas
     *       500:
     *         description: Erro interno no servidor
     */
    this.router.post('/login', authController.login);

    /**
     * @swagger
     * /auth/me:
     *   get:
     *     summary: Obtém informações do usuário autenticado
     *     tags: [Autenticação]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Dados do usuário autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Usuario'
     *       401:
     *         description: Token inválido ou não fornecido
     *       404:
     *         description: Usuário não encontrado
     */
    this.router.get('/me', authMiddleware, authController.me);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new AuthRoutes().getRouter();