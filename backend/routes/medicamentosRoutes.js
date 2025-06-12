const express = require('express');
const router = express.Router();
const medicamentoService = require('../services/mongoMedicamentosServices');

router.post('/', async (req, res) => {
  try {
    const resultado = await medicamentoService.inserirMedicamento(req.body);
    res.status(201).json({ id: resultado.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao inserir medicamento.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const medicamentos = await medicamentoService.listarMedicamentos();
    res.status(200).json(medicamentos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar medicamentos.' });
  }
});

module.exports = router;
