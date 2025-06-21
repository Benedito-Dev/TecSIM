const MedicoService = require('../services/medicoService');

class MedicoController {
  // Buscar todos os médicos
  async getAll(req, res) {
    try {
      const medicos = await MedicoService.getAll();
      res.status(200).json(medicos);
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
      res.status(500).json({ error: 'Erro ao buscar médicos.' });
    }
  }

  // Buscar médico por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const medico = await MedicoService.getById(id);

      if (!medico) {
        return res.status(404).json({ error: 'Médico não encontrado.' });
      }

      res.status(200).json(medico);
    } catch (error) {
      console.error('Erro ao buscar médico por ID:', error);
      res.status(500).json({ error: 'Erro ao buscar médico.' });
    }
  }

  // Buscar médico por email
  async getByEmail(req, res) {
    try {
      const { email } = req.params;
      const medico = await MedicoService.getByEmail(email);

      if (!medico) {
        return res.status(404).json({ error: 'Médico não encontrado.' });
      }

      res.status(200).json(medico);
    } catch (error) {
      console.error('Erro ao buscar médico por email:', error);
      res.status(500).json({ error: 'Erro ao buscar médico.' });
    }
  }

  // Buscar médico por CRM
  async getByCrm(req, res) {
    try {
      const { crm } = req.params;
      const medico = await MedicoService.getByCrm(crm);

      if (!medico) {
        return res.status(404).json({ error: 'Médico não encontrado.' });
      }

      res.status(200).json(medico);
    } catch (error) {
      console.error('Erro ao buscar médico por CRM:', error);
      res.status(500).json({ error: 'Erro ao buscar médico.' });
    }
  }

  // Buscar médicos por especialidade
  async getByEspecialidade(req, res) {
    try {
      const { especialidade } = req.params;
      const medicos = await MedicoService.getByEspecialidade(especialidade);

      if (medicos.length === 0) {
        return res.status(404).json({ error: 'Nenhum médico encontrado para esta especialidade.' });
      }

      res.status(200).json(medicos);
    } catch (error) {
      console.error('Erro ao buscar médicos por especialidade:', error);
      res.status(500).json({ error: 'Erro ao buscar médicos.' });
    }
  }

  // Criar novo médico
  async create(req, res) {
    try {
      const dadosMedico = req.body;
      const novoMedico = await MedicoService.create(dadosMedico);
      
      res.status(201).json({ 
        message: 'Médico criado com sucesso', 
        data: novoMedico 
      });
    } catch (error) {
      console.error('Erro ao criar médico:', error);
      
      if (error.message.includes('CRM já cadastrado')) {
        return res.status(400).json({ error: 'CRM já cadastrado.' });
      }
      
      res.status(500).json({ error: 'Erro ao criar médico.' });
    }
  }

  // Atualizar médico
  async update(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;
      
      // Remove campos que não devem ser atualizados
      delete dadosAtualizacao.senha;
      delete dadosAtualizacao.id_medico;
      delete dadosAtualizacao.data_cadastro;

      const medicoAtualizado = await MedicoService.update(id, dadosAtualizacao);

      if (!medicoAtualizado) {
        return res.status(404).json({ error: 'Médico não encontrado para atualizar.' });
      }

      res.status(200).json({ 
        message: 'Médico atualizado com sucesso', 
        data: medicoAtualizado 
      });
    } catch (error) {
      console.error('Erro ao atualizar médico:', error);
      res.status(500).json({ error: 'Erro ao atualizar médico.' });
    }
  }

  // Atualizar senha do médico
  async updatePassword(req, res) {
    try {
      const { id } = req.params;
      const { senhaAtual, novaSenha } = req.body;

      const resultado = await MedicoService.updatePassword(id, senhaAtual, novaSenha);

      if (!resultado) {
        return res.status(400).json({ error: 'Senha atual incorreta ou médico não encontrado.' });
      }

      res.status(200).json({ message: 'Senha atualizada com sucesso.' });
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      res.status(500).json({ error: 'Erro ao atualizar senha.' });
    }
  }

//   // Autenticar médico
//   async login(req, res) {
//     try {
//       const { email, senha } = req.body;
//       const medico = await MedicoService.verifyCredentials(email, senha);
      
//       res.status(200).json({ 
//         message: 'Login realizado com sucesso',
//         data: medico.toAuthJSON() 
//       });
//     } catch (error) {
//       console.error('Erro no login:', error);
//       res.status(401).json({ error: 'Credenciais inválidas.' });
//     }
//   }

   // Remover médico
  async remove(req, res) {
     try {
       const { id } = req.params;
       const resultado = await MedicoService.remove(id);

       if (!resultado) {
         return res.status(404).json({ error: 'Médico não encontrado para remover.' });
       }

       res.status(200).json({ message: 'Médico removido com sucesso.' });
     } catch (error) {
       console.error('Erro ao remover médico:', error);
       res.status(500).json({ error: 'Erro ao remover médico.' });
     }
   }
}

module.exports = new MedicoController();