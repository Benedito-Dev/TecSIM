const PacienteService = require('../services/pacientesService');
const path = require('path');
const fs = require('fs');

class PacienteController {
  // Buscar todos os usuários (sem senhas)
  async getAll(req, res) {
    try {
      const usuarios = await PacienteService.getAll();
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
  }

  // Buscar usuário por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const usuario = await PacienteService.getById(id);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      res.status(200).json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
  }

  // Buscar usuário por email (útil para login)
  async getByEmail(req, res) {
    try {
      const { email } = req.params;
      const usuario = await PacienteService.getByEmail(email);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      res.status(200).json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
  }

  // Criar novo usuário
  async create(req, res) {
    try {
      const dadosUsuario = req.body;
      const novoUsuario = await PacienteService.create(dadosUsuario);
      
      res.status(201).json({ 
        message: 'Usuário criado com sucesso', 
        data: novoUsuario 
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      
      if (error.code === '23505') { // Violação de unique constraint
        return res.status(400).json({ error: 'Email já cadastrado.' });
      }
      
      res.status(400).json({ error: 'Dados inválidos.', message: error.message });
      res.status(500).json({ error: 'Erro ao criar usuário.' });
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
  };


  // Atualizar usuário
  async update(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;
      
      // Remove campos que não devem ser atualizados
      delete dadosAtualizacao.senha;
      delete dadosAtualizacao.id_usuario;
      delete dadosAtualizacao.data_cadastro;

      const usuarioAtualizado = await PacienteService.update(id, dadosAtualizacao);

      if (!usuarioAtualizado) {
        return res.status(404).json({ error: 'Usuário não encontrado para atualizar.' });
      }

      res.status(200).json({ 
        message: 'Usuário atualizado com sucesso', 
        data: usuarioAtualizado 
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
  }

  // Atualizar senha (endpoint separado)
  async updatePassword(req, res) {
    try {
      const { id } = req.params;
      const { senhaAtual, novaSenha } = req.body;

      const resultado = await PacienteService.updatePassword(id, senhaAtual, novaSenha);

      if (!resultado) {
        return res.status(400).json({ error: 'Senha atual incorreta ou usuário não encontrado.' });
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

  // Remover usuário
  async remove(req, res) {
    try {
      const { id } = req.params;
      const resultado = await PacienteService.remove(id);

      if (!resultado) {
        return res.status(404).json({ error: 'Usuário não encontrado para remover.' });
      }

      res.status(200).json({ message: 'Usuário removido com sucesso.' });
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      res.status(500).json({ error: 'Erro ao remover usuário.' });
    }
  }
}

module.exports = new PacienteController();