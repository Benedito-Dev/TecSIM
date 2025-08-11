const PacienteService = require('../services/pacientesService');
const path = require('path');
const fs = require('fs');

class PacienteController {
  async getAll(req, res) {
    try {
      const pacientes = await PacienteService.getAll();
      res.status(200).json(pacientes);
    } catch (error) {
      console.error(error);

       if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({ error: 'Serviço de banco de dados indisponível.' });
      }

      res.status(500).json({ error: 'Erro interno ao buscar pacientes.' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido. Informe um número válido.' });
      }

      const paciente = await PacienteService.getById(id);
      if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado.' });
      }

      res.status(200).json(paciente);
    } catch (error) {
      console.error(error);

       if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({ error: 'Serviço de banco de dados indisponível.' });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Dados inválidos.', details: error.message });
      }

      res.status(500).json({ error: 'Erro interno ao buscar paciente.' });
    }
  }

  async getByEmail(req, res) {
    try {
      const { email } = req.params;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Email inválido.' });
      }

      const paciente = await PacienteService.getByEmail(email);
      if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado.' });
      }

      res.status(200).json(paciente);
    } catch (error) {
      console.error(error);

       if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({ error: 'Serviço de banco de dados indisponível.' });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Dados inválidos.', details: error.message });
      }

      res.status(500).json({ error: 'Erro interno ao buscar paciente.' });
    }
  }

  async create(req, res) {
    try {
      const dadosPaciente = req.body;
      const novoPaciente = await PacienteService.create(dadosPaciente);
      res.status(201).json({ message: 'Paciente criado com sucesso', data: novoPaciente });
    } catch (error) {
      console.error(error);

      // Se o erro tiver statusCode (ex: 409), usa ele
      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Dados inválidos.', details: error.message });
      }

      res.status(500).json({ error: 'Erro interno ao criar paciente.' });
    }
  }


  async uploadFoto(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
      }

      const paciente = await PacienteService.getById(id);
      if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado.' });
      }

      if (paciente.foto_perfil) {
        const caminhoAntigo = path.join(__dirname, '..', paciente.foto_perfil);
        if (fs.existsSync(caminhoAntigo)) {
          fs.unlinkSync(caminhoAntigo);
        }
      }

      const novoCaminho = `/uploads/${req.file.filename}`;
      await PacienteService.atualizarFoto(id, novoCaminho);

      res.status(200).json({ message: 'Foto atualizada com sucesso', foto: novoCaminho });
    } catch (error) {

       if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      console.error(error);
      res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      const dadosAtualizacao = req.body;
      delete dadosAtualizacao.senha;
      delete dadosAtualizacao.id_paciente;
      delete dadosAtualizacao.data_cadastro;

      const pacienteAtualizado = await PacienteService.update(id, dadosAtualizacao);
      if (!pacienteAtualizado) {
        return res.status(404).json({ error: 'Paciente não encontrado para atualizar.' });
      }

      res.status(200).json({ message: 'Paciente atualizado com sucesso', data: pacienteAtualizado });
    } catch (error) {
      console.error(error);

      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      if (error.code === '23505') {
        return res.status(409).json({ error: 'Email já cadastrado.' });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Dados inválidos.', details: error.message });
      }

      res.status(500).json({ error: 'Erro interno ao atualizar paciente.' });
    }
  }

  async updatePassword(req, res) {
    try {
      const { id } = req.params;
      const { senhaAtual, novaSenha } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      const resultado = await PacienteService.updatePassword(id, senhaAtual, novaSenha);
      if (!resultado) {
        return res.status(400).json({ error: 'Senha atual incorreta ou paciente não encontrado.' });
      }

      res.status(200).json({ message: 'Senha atualizada com sucesso.' });
    } catch (error) {
      console.error(error);

      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Dados inválidos.', details: error.message });
      }

      res.status(500).json({ error: 'Erro interno ao atualizar senha.' });
    }
  }

  async desativar(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      const paciente = await PacienteService.desativar(id);
      if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado.' });
      }

      res.status(200).json({ message: 'Paciente desativado com sucesso', data: paciente });
    } catch (error) {
      console.error(error);

     if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Dados inválidos.', details: error.message });
      }

      res.status(500).json({ error: 'Erro interno ao desativar paciente.' });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      const resultado = await PacienteService.remove(id);
      if (!resultado) {
        return res.status(404).json({ error: 'Paciente não encontrado para remover.' });
      }

      res.status(200).json({ message: 'Paciente removido com sucesso.' });
    } catch (error) {
      console.error(error);

      if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Dados inválidos.', details: error.message });
      }

      res.status(500).json({ error: 'Erro interno ao remover paciente.' });
    }
  }
}

module.exports = new PacienteController();
