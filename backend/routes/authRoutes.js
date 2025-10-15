const express = require('express');
const authController = require('../controllers/auth/authController');
const otpController = require('../controllers/auth/otpController');
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
     *         - tipo
     *       properties:
     *         email:
     *           type: string
     *           format: email
     *           example: usuario@example.com
     *         senha:
     *           type: string
     *           example: Senha@123
     *         tipo:
     *           type: string
     *           enum: [paciente, enfermeiro]
     *           example: paciente
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
     *             tipo:
     *               type: string
     *               example: paciente
     *             genero:
     *               type: string
     *               example: man
     *             idade:
     *               type: integer
     *               example: 17
     *         token:
     *           type: string
     *           description: Token JWT para autenticação
     */

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Autentica um usuário (paciente ou enfermeiro)
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
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 nome:
     *                   type: string
     *                 email:
     *                   type: string
     *                 tipo:
     *                   type: string
     *                   enum: [paciente, enfermeiro]
     *       401:
     *         description: Token inválido ou não fornecido
     *       404:
     *         description: Usuário não encontrado
     */
    this.router.get('/me', authMiddleware, authController.me);

    // Request OTP
    /**
     * @swagger
     * /auth/request-otp:
     *   post:
     *     summary: Envia o código OTP para o usuário via email
     *     description: Envia um código OTP para o email informado.
     *     tags: [Autenticação]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/OTPRequest'
     *     responses:
     *       200:
     *         description: Código OTP enviado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/OTPResponse'
     *       400:
     *         description: Email inválido ou não fornecido
     *       500:
     *         description: Erro interno no servidor
     */
    this.router.post('/request-otp', otpController.sendOtp);

    // Verify OTP
    /**
     * @swagger
     * /auth/verify-otp:
     *   post:
     *     summary: Verifica o código OTP enviado para o usuário
     *     description: Verifica o código OTP informado para o email.
     *     tags: [Autenticação]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/OTPVerifyRequest'
     *     responses:
     *       200:
     *         description: Código OTP verificado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: OTP verificado com sucesso.
     *       400:
     *         description: OTP inválido ou expirado
     *       500:
     *         description: Erro interno no servidor
     */
    this.router.post('/verify-otp', otpController.verifyOtp);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new AuthRoutes().getRouter();