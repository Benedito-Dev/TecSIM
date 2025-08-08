const MedicoService = require('../services/medicoService');

class MedicoController {
  // Buscar todos os médicos
  async getAll(req, res) {
    try {
      const medicos = await MedicoService.getAll();
      return res.status(200).json(medicos);
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
      return res.status(500).json({ message: 'Erro interno ao buscar médicos.' });
    }
  }

  // Buscar médico por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido.' });
      }

      const medico = await MedicoService.getById(id);
      if (!medico) {
        return res.status(404).json({ message: 'Médico não encontrado.' });
      }

      return res.status(200).json(medico);
    } catch (error) {
      console.error('Erro ao buscar médico por ID:', error);
      return res.status(500).json({ message: 'Erro interno ao buscar médico.' });
    }
  }

  // Buscar médico por email
  async getByEmail(req, res) {
    try {
      const { email } = req.params;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'E-mail inválido.' });
      }

      const medico = await MedicoService.getByEmail(email);
      if (!medico) {
        return res.status(404).json({ message: 'Médico não encontrado.' });
      }

      return res.status(200).json(medico);
    } catch (error) {
      console.error('Erro ao buscar médico por email:', error);
      return res.status(500).json({ message: 'Erro interno ao buscar médico.' });
    }
  }

  // Buscar médico por CRM
  async getByCrm(req, res) {
    try {
      const { crm } = req.params;
      if (!crm) {
        return res.status(400).json({ message: 'CRM é obrigatório.' });
      }

      const medico = await MedicoService.getByCrm(crm);
      if (!medico) {
        return res.status(404).json({ message: 'Médico não encontrado.' });
      }

      return res.status(200).json(medico);
    } catch (error) {
      console.error('Erro ao buscar médico por CRM:', error);
      return res.status(500).json({ message: 'Erro interno ao buscar médico.' });
    }
  }

  // Buscar médicos por especialidade
  async getByEspecialidade(req, res) {
    try {
      const { especialidade } = req.params;
      if (!especialidade) {
        return res.status(400).json({ message: 'Especialidade é obrigatória.' });
      }

      const medicos = await MedicoService.getByEspecialidade(especialidade);
      if (!medicos || medicos.length === 0) {
        return res.status(404).json({ message: 'Nenhum médico encontrado para esta especialidade.' });
      }

      return res.status(200).json(medicos);
    } catch (error) {
      console.error('Erro ao buscar médicos por especialidade:', error);
      return res.status(500).json({ message: 'Erro interno ao buscar médicos.' });
    }
  }

  // Criar novo médico
  async create(req, res) {
    try {
      const { nome, email, crm, especialidade, senha } = req.body;
      if (!nome || !email || !crm || !especialidade || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
      }

      const novoMedico = await MedicoService.create(req.body);
      return res.status(201).json({
        message: 'Médico criado com sucesso.',
        data: novoMedico
      });
    } catch (error) {
      console.error('Erro ao criar médico:', error);

      if (error.message.includes('CRM já cadastrado')) {
        return res.status(409).json({ message: 'CRM já cadastrado.' });
      }
      if (error.message.includes('Email já cadastrado')) {
        return res.status(409).json({ message: 'E-mail já cadastrado.' });
      }

      return res.status(500).json({ message: 'Erro interno ao criar médico.' });
    }
  }

  // Atualizar médico
  async update(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido.' });
      }

      const dadosAtualizacao = { ...req.body };
      delete dadosAtualizacao.senha;
      delete dadosAtualizacao.id_medico;
      delete dadosAtualizacao.data_cadastro;

      const medicoAtualizado = await MedicoService.update(id, dadosAtualizacao);
      if (!medicoAtualizado) {
        return res.status(404).json({ message: 'Médico não encontrado para atualização.' });
      }

      return res.status(200).json({
        message: 'Médico atualizado com sucesso.',
        data: medicoAtualizado
      });
    } catch (error) {
      console.error('Erro ao atualizar médico:', error);
      return res.status(500).json({ message: 'Erro interno ao atualizar médico.' });
    }
  }

  // Atualizar senha do médico
  async updatePassword(req, res) {
    try {
      const { id } = req.params;
      const { senhaAtual, novaSenha } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido.' });
      }
      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias.' });
      }

      const resultado = await MedicoService.updatePassword(id, senhaAtual, novaSenha);
      if (!resultado) {
        return res.status(400).json({ message: 'Senha atual incorreta ou médico não encontrado.' });
      }

      return res.status(200).json({ message: 'Senha atualizada com sucesso.' });
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      return res.status(500).json({ message: 'Erro interno ao atualizar senha.' });
    }
  }

  // Remover médico
  async remove(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido.' });
      }

      const resultado = await MedicoService.remove(id);
      if (!resultado) {
        return res.status(404).json({ message: 'Médico não encontrado para remoção.' });
      }

      return res.status(200).json({ message: 'Médico removido com sucesso.' });
    } catch (error) {
      console.error('Erro ao remover médico:', error);
      return res.status(500).json({ message: 'Erro interno ao remover médico.' });
    }
  }
}

module.exports = new MedicoController();
