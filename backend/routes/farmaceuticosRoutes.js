const express = require('express');
const controller = require('../controllers/farmaceuticosController');

class FarmaceuticosRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    /**
     * @swagger
     * tags:
     *   name: Farmaceuticos
     *   description: Gestão de farmacêuticos
     */

    /**
     * @swagger
     * /farmaceuticos:
     *   post:
     *     summary: Cria um novo farmacêutico
     *     tags: [Farmaceuticos]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Farmaceutico'
     *     responses:
     *       201:
     *         description: Farmacêutico criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Farmaceutico'
     *       400:
     *         description: Requisição inválida
     *       409:
     *         description: Registro já existente
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.post('/', controller.create);

    /**
     * @swagger
     * /farmaceuticos:
     *   get:
     *     summary: Retorna todos os farmacêuticos
     *     tags: [Farmaceuticos]
     *     responses:
     *       200:
     *         description: Lista de farmacêuticos
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Farmaceutico'
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.get('/', controller.findAll);

    /**
     * @swagger
     * /farmaceuticos/search:
     *   get:
     *     summary: Busca farmacêuticos por termo (nome, email ou registro)
     *     tags: [Farmaceuticos]
     *     parameters:
     *       - in: query
     *         name: q
     *         schema:
     *           type: string
     *         required: true
     *         description: Termo de busca
     *     responses:
     *       200:
     *         description: Lista de farmacêuticos filtrados
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Farmaceutico'
     *       400:
     *         description: Parâmetro de busca ausente ou inválido
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.get('/search', controller.search);

    /**
     * @swagger
     * /farmaceuticos/{id}:
     *   get:
     *     summary: Obtém um farmacêutico por ID
     *     tags: [Farmaceuticos]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do farmacêutico
     *     responses:
     *       200:
     *         description: Farmacêutico encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Farmaceutico'
     *       400:
     *         description: ID inválido
     *       404:
     *         description: Farmacêutico não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.get('/:id', controller.findById);

    /**
     * @swagger
     * /farmaceuticos/{id}:
     *   put:
     *     summary: Atualiza um farmacêutico existente
     *     tags: [Farmaceuticos]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do farmacêutico
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Farmaceutico'
     *     responses:
     *       200:
     *         description: Farmacêutico atualizado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Farmaceutico'
     *       400:
     *         description: Requisição inválida
     *       404:
     *         description: Farmacêutico não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.put('/:id', controller.update);

    /**
     * @swagger
     * /farmaceuticos/{id}:
     *   delete:
     *     summary: Remove um farmacêutico
     *     tags: [Farmaceuticos]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do farmacêutico
     *     responses:
     *       200:
     *         description: Farmacêutico removido com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Farmaceutico'
     *       400:
     *         description: ID inválido
     *       404:
     *         description: Farmacêutico não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.delete('/:id', controller.remove);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new FarmaceuticosRoutes().getRouter();
