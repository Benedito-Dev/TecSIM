const service = require('../services/mongoMedicamentosServices')

class MedicamentoController {
    async create(req, res) {
        try {
            const medicamento = await service.create(req.body);
            res.status(201).json({ message: 'Medicamento criado com sucesso' });
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: err.message});
        }
    }

    async findAll(req, res) {
        try { 
            const medicamentos = await service.findAll();
            res.json(medicamentos);
        } catch (err) {
            console.log(err);
            res.status(500).json({error: err.message})
        }
    }

     async findById(req, res) {
    try {
      const medicamento = await service.findById(req.params.id);
      res.json(medicamento);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const medicamento = await service.update(req.params.id, req.body);
      res.json(medicamento);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async remove(req, res) {
    try {
      await service.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
}

module.exports = new MedicamentoController();