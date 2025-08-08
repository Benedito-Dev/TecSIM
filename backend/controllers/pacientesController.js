const PacienteService = require('../services/pacientesService');
const path = require('path');
const fs = require('fs');

class PacienteController {
  // Buscar todos os pacientes (sem senhas)
  async getAll(req, res) {
    try {
      const pacientes = await PacienteService.getAll();
      res.status(200).json(pacientes);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      res.status(500).json({ error: 'Erro ao buscar pacientes.' });
    }
  }

  // Buscar paciente por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido. Formato incorreto.' });
      }
      const paciente = await PacienteService.getById(id);

      if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado.' });
      }

      res.status(200).json(paciente);
    } catch (error) {
      console.error('Erro ao buscar paciente por ID:', error);
      res.status(500).json({ error: 'Erro ao buscar paciente.' });
    }
  }

  // Buscar paciente por email
  async getByEmail(req, res) {
    try {
      const { email } = req.params;
      const paciente = await PacienteService.getByEmail(email);

      if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado.' });
      }

      res.status(200).json(paciente);
    } catch (error) {
      console.error('Erro ao buscar paciente por email:', error);
      res.status(500).json({ error: 'Erro ao buscar paciente.' });
    }
  }

  // Criar novo paciente
  async create(req, res) {
    try {
      const dadosPaciente = req.body;
      const novoPaciente = await PacienteService.create(dadosPaciente);
      
      res.status(201).json({ 
        message: 'Paciente criado com sucesso', 
        data: novoPaciente 
      });
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      
      if (error.code === '23505') { // Violação de unique constraint
        return res.status(400).json({ error: 'Email já cadastrado.' });
      }
      
      res.status(400).json({ error: 'Dados inválidos.', message: error.message });
      res.status(500).json({ error: 'Erro ao criar paciente.' });
    }
  }

  async uploadFoto(req, res) {
    try {
      const { id } = req.params;
      const paciente = await PacienteService.getById(id);

      if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
      }

      // 🧹 Apagar imagem anterior se existir
      if (paciente.foto_perfil) {
        const caminhoAntigo = path.join(__dirname, '..', paciente.foto_perfil);
        if (fs.existsSync(caminhoAntigo)) {
          fs.unlinkSync(caminhoAntigo);
        }
      }

      // 🔄 Atualiza a imagem
      const novoCaminho = `/uploads/${req.file.filename}`;
      await PacienteService.atualizarFoto(id, novoCaminho);

      res.status(200).json({ message: 'Foto atualizada com sucesso', foto: novoCaminho });
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
    }
  }

  // Atualizar paciente
  async update(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;
      
      // Remove campos que não devem ser atualizados
      delete dadosAtualizacao.senha;
      delete dadosAtualizacao.id_paciente;
      delete dadosAtualizacao.data_cadastro;

      const pacienteAtualizado = await PacienteService.update(id, dadosAtualizacao);

      if (!pacienteAtualizado) {
        return res.status(404).json({ error: 'Paciente não encontrado para atualizar.' });
      }

      res.status(200).json({ 
        message: 'Paciente atualizado com sucesso', 
        data: pacienteAtualizado 
      });
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
      res.status(500).json({ error: 'Erro ao atualizar paciente.' });
    }
  }

  // Atualizar senha do paciente
  async updatePassword(req, res) {
    try {
      const { id } = req.params;
      const { senhaAtual, novaSenha } = req.body;

      const resultado = await PacienteService.updatePassword(id, senhaAtual, novaSenha);

      if (!resultado) {
        return res.status(400).json({ error: 'Senha atual incorreta ou paciente não encontrado.' });
      }

      res.status(200).json({ message: 'Senha atualizada com sucesso.' });
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      res.status(500).json({ error: 'Erro ao atualizar senha.' });
    }
  }

  async desativar(req, res) {
    try {
      const { id } = req.params;
      const paciente = await PacienteService.desativar(id);
      if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
      }
      res.status(200).json({ message: 'Paciente desativado com sucesso', data: paciente });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao desativar paciente' });
    }
  }

  // Remover paciente
  async remove(req, res) {
    try {
      const { id } = req.params;
      const resultado = await PacienteService.remove(id);

      if (!resultado) {
        return res.status(404).json({ error: 'Paciente não encontrado para remover.' });
      }

      res.status(200).json({ message: 'Paciente removido com sucesso.' });
    } catch (error) {
      console.error('Erro ao remover paciente:', error);
      res.status(500).json({ error: 'Erro ao remover paciente.' });
    }
  }
}

module.exports = new PacienteController();
