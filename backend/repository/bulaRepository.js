const db = require('../db/db');
const Bula = require('../models/bulaModel');

class bulaRepository {
    async findAll() {
        const result = await db.query('SELECT * FROM bulas');
        return result.rows.map(row => new Bula(row));
    }

    async findById(id) {
        const result = await db.query('SELECT * FROM bulas WHERE id = $1', [id]);
        return result.rows[0] ? new Bula(result.rows[0]) : null;
    }

    async findByMedicamentoId(id_medicamento) {
        const result = await db.query('SELECT * FROM bulas WHERE id_medicamento = $1', [id_medicamento]);
        return result.rows[0] ? new Bula(result.rows[0]) : null;
    }

    async create({
        id_medicamento,
        dosagem_e_administracao,
        indicacoes,
        contraindicacoes,
        advertencias,
        interacoes,
        armazenamento_e_validade
    }) {
        const result = await db.query(`
            INSERT INTO bulas (
                id_medicamento,
                "dosagem_e_administracao",
                indicacoes,
                contraindicacoes,
                advertencias,
                interacoes_medicamentosas,
                "armazenamento_e_validade"
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `, [
            id_medicamento,
            dosagem_e_administracao,
            indicacoes,
            contraindicacoes,
            advertencias,
            interacoes,
            armazenamento_e_validade,
        ]);
        return new Bula(result.rows[0]);
    }

    async update(id, {
        id_medicamento,
        dosagem_e_administracao,
        indicacoes,
        contraindicacoes,
        advertencias,
        interacoes,
        armazenamento_e_validade
    }) {
        const result = await db.query(`
            UPDATE bulas SET
                id_medicamento = $1,
                "dosagem_e_administracao" = $2,
                indicacoes = $3,
                contraindicacoes = $4,
                advertencias = $5,
                interacoes_medicamentosas = $6,
                "armazenamento_e_validade" = $7
            WHERE id = $8
            RETURNING *;
        `, [
            id_medicamento,
            dosagem_e_administracao,
            indicacoes,
            contraindicacoes,
            advertencias,
            interacoes,
            armazenamento_e_validade,
            id
        ]);
        return result.rows[0] ? new Bula(result.rows[0]) : null;
    }

    async remove(id) {
        const result = await db.query('DELETE FROM bulas WHERE id = $1 RETURNING *;', [id]);
        return result.rows[0] ? new Bula(result.rows[0]) : null;
    }
}

module.exports = new bulaRepository();