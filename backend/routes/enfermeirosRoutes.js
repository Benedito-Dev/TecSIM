const express = require('express');
const controller = require('../controllers/enfermeirosController');

class EnfermeirosRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    /**
     * @swagger
     * tags:
     *   name: Enfermeiros
     *   description: Gestão de enfermeiros
     */

    /**
     * @swagger
     * /enfermeiros:
     *   post:
     *     summary: Cria um novo enfermeiro
     *     tags: [Enfermeiros]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Enfermeiro'
     *     responses:
     *       201:
     *         description: Enfermeiro criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Enfermeiro'
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
     * /enfermeiros:
     *   get:
     *     summary: Retorna todos os enfermeiros
     *     tags: [Enfermeiros]
     *     responses:
     *       200:
     *         description: Lista de enfermeiros
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Enfermeiro'
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.get('/', controller.findAll);

    /**
     * @swagger
     * /enfermeiros/search:
     *   get:
     *     summary: Busca enfermeiros por termo (nome, email ou registro)
     *     tags: [Enfermeiros]
     *     parameters:
     *       - in: query
     *         name: q
     *         schema:
     *           type: string
     *         required: true
     *         description: Termo de busca
     *     responses:
     *       200:
     *         description: Lista de enfermeiros filtrados
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Enfermeiro'
     *       400:
     *         description: Parâmetro de busca ausente ou inválido
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.get('/search', controller.search);

    /**
     * @swagger
     * /enfermeiros/{id}:
     *   get:
     *     summary: Obtém um enfermeiro por ID
     *     tags: [Enfermeiros]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do enfermeiro
     *     responses:
     *       200:
     *         description: Enfermeiro encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Enfermeiro'
     *       400:
     *         description: ID inválido
     *       404:
     *         description: Enfermeiro não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.get('/:id', controller.findById);

    /**
     * @swagger
     * /enfermeiros/{id}:
     *   put:
     *     summary: Atualiza um enfermeiro existente
     *     tags: [Enfermeiros]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do enfermeiro
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Enfermeiro'
     *     responses:
     *       200:
     *         description: Enfermeiro atualizado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Enfermeiro'
     *       400:
     *         description: Requisição inválida
     *       404:
     *         description: Enfermeiro não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.put('/:id', controller.update);

    /**
     * @swagger
     * /enfermeiros/{id}:
     *   delete:
     *     summary: Remove um enfermeiro
     *     tags: [Enfermeiros]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID do enfermeiro
     *     responses:
     *       200:
     *         description: Enfermeiro removido com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Enfermeiro'
     *       400:
     *         description: ID inválido
     *       404:
     *         description: Enfermeiro não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    this.router.delete('/:id', controller.remove);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new EnfermeirosRoutes().getRouter();
