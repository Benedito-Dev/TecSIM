// middlewares/validatePaciente.js
class ValidatePaciente {
  // ====== FUNÇÕES AUXILIARES ======
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validDomains = [
      'gmail.com',
      'yahoo.com',
      'outlook.com',
      'hotmail.com',
      'icloud.com',
      'live.com'
    ];

    if (!emailRegex.test(email)) return false;

    const domain = email.split('@')[1]?.toLowerCase();
    return validDomains.includes(domain);
  }

  static isValidCpf(cpf) {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleanCpf)) return false;

    let sum = 0;
    for (let i = 1; i <= 9; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
    let rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cleanCpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cleanCpf.substring(10, 11))) return false;

    return true;
  }

  static isValidDate(dateString) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  static isValidPeso(peso) {
    const pesoNumber = Number(peso);
    return !isNaN(pesoNumber) && pesoNumber > 0 && pesoNumber <= 500;
  }

  // ====== FUNÇÕES JÁ EXISTENTES (adaptadas para usar as auxiliares) ======
  static validateCreate(req, res, next) {
    const { nome, email, senha, data_nascimento, peso_kg, aceite_termos, cpf } = req.body;

    if (!nome || !email || !senha || !cpf) {
      return res.status(400).json({ message: 'Nome, email, CPF e senha são obrigatórios.' });
    }

    if (!ValidatePaciente.isValidEmail(email)) {
      return res.status(400).json({ message: 'Formato de email inválido ou domínio não permitido.' });
    }

    if (!ValidatePaciente.isValidCpf(cpf)) {
      return res.status(400).json({ message: 'CPF inválido.' });
    }

    if (senha.length < 8) {
      return res.status(400).json({ message: 'Senha deve ter no mínimo 8 caracteres.' });
    }

    if (data_nascimento) {
      if (!ValidatePaciente.isValidDate(data_nascimento)) {
        return res.status(400).json({ message: 'Formato de data inválido. Use YYYY-MM-DD.' });
      }
      const nascimentoDate = new Date(data_nascimento);
      if (nascimentoDate >= new Date()) {
        return res.status(400).json({ message: 'Data de nascimento deve ser anterior à data atual.' });
      }
    }

    if (peso_kg && !ValidatePaciente.isValidPeso(peso_kg)) {
      return res.status(400).json({ message: 'Peso deve ser um número entre 0.1 e 500 kg.' });
    }

    if (typeof aceite_termos !== 'boolean' || !aceite_termos) {
      return res.status(400).json({ message: 'É necessário aceitar os termos de uso.' });
    }

    next();
  }

  static validateUpdate(req, res, next) {
    const { nome, email, data_nascimento, peso_kg, cpf } = req.body;

    if (email && !ValidatePaciente.isValidEmail(email)) {
      return res.status(400).json({ message: 'Formato de email inválido ou domínio não permitido.' });
    }

    if (cpf && !ValidatePaciente.isValidCpf(cpf)) {
      return res.status(400).json({ message: 'CPF inválido.' });
    }

    if (nome && nome.length < 3) {
      return res.status(400).json({ message: 'Nome deve ter no mínimo 3 caracteres.' });
    }

    if (data_nascimento && !ValidatePaciente.isValidDate(data_nascimento)) {
      return res.status(400).json({ message: 'Formato de data inválido. Use YYYY-MM-DD.' });
    }

    if (peso_kg && !ValidatePaciente.isValidPeso(peso_kg)) {
      return res.status(400).json({ message: 'Peso deve ser um número entre 0.1 e 500 kg.' });
    }

    next();
  }

  static validatePassword(req, res, next) {
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias.' });
    }

    if (novaSenha.length < 8) {
      return res.status(400).json({ message: 'Nova senha deve ter no mínimo 8 caracteres.' });
    }

    if (senhaAtual === novaSenha) {
      return res.status(400).json({ message: 'Nova senha deve ser diferente da senha atual.' });
    }

    next();
  }
}

module.exports = ValidatePaciente;
