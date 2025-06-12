const service = require('../services/mongoMedicamentosServices')

class MedicamentoController {
    async create(req, res) {
        try {
            const medicamento = await service.create(req.body);
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: err.message});
        }
    }

    async findAll(req, res) {
        try { 
            const medicamentos = await service.findAll();
            res.json(meds);
        } catch (err) {
            console.log(err);
            res.status(500).json({error: err.message})
        }
    }
}