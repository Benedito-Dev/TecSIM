/**
 * Utilitários de validação para o backend
 */

// Validação de CPF
function isValidCPF(cpf) {
  if (!cpf) return false;
  
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let rev = 11 - (soma % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  rev = 11 - (soma % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

// Validação de email
function isValidEmail(email) {
  console.log(email)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validação de telefone
function isValidPhone(phone) {
  if (!phone) return false;
  const phoneRegex = /^\(?\d{2}\)?[\s-]?[\s9]?\d{4,5}[- ]?\d{4}$/;
  return phoneRegex.test(phone);
}

// Validação de CEP
function isValidCEP(cep) {
  const cepRegex = /^\d{5}-?\d{3}$/;
  return cepRegex.test(cep);
}

// Validação de CRM
function isValidCRM(crm) {
  if (!crm) return false;
  crm = crm.trim();
  return crm.length >= 4 && crm.length <= 20;
}

// Validação de senha
function isValidPassword(password) {
  if (!password) return false;
  return password.length >= 6;
}

// Remove caracteres especiais - VERSÃO CORRIGIDA
function removeSpecialChars(str) {
  if (!str) return '';
  // Mantém letras (incluindo acentuadas), números e espaços
  return str.replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, '');
}

// Formata CPF
function formatCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formata telefone
function formatPhone(phone) {
  phone = phone.replace(/\D/g, '');
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

// Validação de data
function isValidDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return false;
  
  // Regex para formato YYYY-MM-DD
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
  if (!regex.test(dateString)) return false;
  
  const [, year, month, day] = regex.exec(dateString);
  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  
  // Validações básicas
  if (monthNum < 1 || monthNum > 12) return false;
  if (dayNum < 1 || dayNum > 31) return false;
  
  // Validação específica por mês
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Ajuste para ano bissexto
  if (monthNum === 2) {
    const isLeapYear = (yearNum % 4 === 0 && yearNum % 100 !== 0) || (yearNum % 400 === 0);
    if (isLeapYear) {
      if (dayNum > 29) return false;
    } else {
      if (dayNum > 28) return false;
    }
  } else if (dayNum > daysInMonth[monthNum - 1]) {
    return false;
  }
  
  return true;
}

// Validação de idade mínima
function isValidAge(birthDate, minAge = 0) {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= minAge;
  }
  
  return age >= minAge;
}

module.exports = {
  isValidCPF,
  isValidEmail,
  isValidPhone,
  isValidCEP,
  isValidCRM,
  isValidPassword,
  removeSpecialChars,
  formatCPF,
  formatPhone,
  isValidDate,
  isValidAge
};
