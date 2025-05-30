class ValidateUsuario {
  static validateCreate(req, res, next) {
    const { nome, email, senha, data_nascimento, peso_kg } = req.body;

    // Validação de campos obrigatórios
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato de email inválido.' });
    }

    // Validação de senha
    if (senha.length < 8) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 8 caracteres.' });
    }

    // Validação de data de nascimento (se fornecida)
    if (data_nascimento) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data_nascimento)) {
        return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD.' });
      }
      
      const nascimentoDate = new Date(data_nascimento);
      const hoje = new Date();
      if (nascimentoDate >= hoje) {
        return res.status(400).json({ error: 'Data de nascimento deve ser anterior à data atual.' });
      }
    }

    // Validação de peso (se fornecido)
    if (peso_kg) {
      const pesoNumber = Number(peso_kg);
      if (isNaN(pesoNumber) || pesoNumber <= 0 || pesoNumber > 500) {
        return res.status(400).json({ error: 'Peso deve ser um número entre 0.1 e 500 kg.' });
      }
    }

    next();
  }

  static validateUpdate(req, res, next) {
    const { nome, email, data_nascimento, peso_kg } = req.body;

    // Validação de email (se for fornecido)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido.' });
      }
    }

    // Validação de nome (se for fornecido)
    if (nome && nome.length < 3) {
      return res.status(400).json({ error: 'Nome deve ter no mínimo 3 caracteres.' });
    }

    // Validação de data de nascimento (se fornecida)
    if (data_nascimento) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data_nascimento)) {
        return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD.' });
      }
    }

    // Validação de peso (se fornecido)
    if (peso_kg) {
      const pesoNumber = Number(peso_kg);
      if (isNaN(pesoNumber) || pesoNumber <= 0 || pesoNumber > 500) {
        return res.status(400).json({ error: 'Peso deve ser um número entre 0.1 e 500 kg.' });
      }
    }

    next();
  }

  static validatePassword(req, res, next) {
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias.' });
    }

    if (novaSenha.length < 8) {
      return res.status(400).json({ error: 'Nova senha deve ter no mínimo 8 caracteres.' });
    }

    if (senhaAtual === novaSenha) {
      return res.status(400).json({ error: 'Nova senha deve ser diferente da senha atual.' });
    }

    next();
  }
}

module.exports = ValidateUsuario;