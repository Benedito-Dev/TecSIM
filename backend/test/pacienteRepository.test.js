const db = require('../db/db');
const bcrypt = require('bcrypt');
const PacienteRepository = require('../repository/pacientesRepository')
const Paciente = require('../models/pacienteModel');

jest.mock('../db/db');
jest.mock('bcrypt');

const mockPacienteData = {
  id: 1,
  cpf: '12345678900',
  nome: 'Fulano da Silva',
  email: 'fulano@example.com',
  senha: 'senhaHasheada',
  data_nascimento: '1990-01-01',
  peso_kg: 70,
  genero: 'M',
  aceite_termos: true,
  data_cadastro: '2025-01-01T00:00:00.000Z',
  ativo: true,
  foto_perfil: null
};

describe('PacienteRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar todos os pacientes', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockPacienteData] });
      const result = await PacienteRepository.findAll();
      expect(result[0]).toBeInstanceOf(Paciente);
      expect(result[0].nome).toBe('Fulano da Silva');
    });
  });

  describe('findById', () => {
    it('deve retornar paciente pelo id', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockPacienteData] });
      const result = await PacienteRepository.findById(1);
      expect(result).toBeInstanceOf(Paciente);
      expect(result.id).toBe(1);
    });

    it('deve retornar null se não encontrado', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      const result = await PacienteRepository.findById(99);
      expect(result).toBeNull();
    });
  });

  describe('findByCPF e findByEmail', () => {
    it('deve retornar paciente pelo CPF', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockPacienteData] });
      const result = await PacienteRepository.findByCPF('12345678900');
      expect(result).toBeInstanceOf(Paciente);
      expect(result.cpf).toBe('12345678900');
    });

    it('deve retornar paciente pelo email', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockPacienteData] });
      const result = await PacienteRepository.findByEmail('fulano@example.com');
      expect(result).toBeInstanceOf(Paciente);
      expect(result.email).toBe('fulano@example.com');
    });
  });

  describe('create', () => {
    it('deve criar um novo paciente com senha hasheada', async () => {
      bcrypt.hash.mockResolvedValueOnce('hashedSenha');
      db.query.mockResolvedValueOnce({ rows: [mockPacienteData] });

      const result = await PacienteRepository.create({
        cpf: '12345678900',
        nome: 'Fulano da Silva',
        email: 'fulano@example.com',
        senha: '123456',
        data_nascimento: '1990-01-01',
        peso_kg: 70,
        genero: 'M',
        aceite_termos: true
      });

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Paciente);
      expect(result.nome).toBe('Fulano da Silva');
    });
  });

  describe('update', () => {
    it('deve atualizar dados do paciente', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockPacienteData] });
      const result = await PacienteRepository.update(1, {
        nome: 'Novo Nome',
        email: 'novo@example.com',
        data_nascimento: '1992-02-02',
        peso_kg: 75,
        genero: 'F'
      });
      expect(result).toBeInstanceOf(Paciente);
      expect(result.nome).toBe('Fulano da Silva');
    });
  });

  describe('updatePassword', () => {
    it('deve atualizar senha se senha atual for correta', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ senha: 'hashedOld' }] }); // busca atual
      bcrypt.compare.mockResolvedValueOnce(true); // senha bate
      bcrypt.hash.mockResolvedValueOnce('hashedNew');
      db.query.mockResolvedValueOnce({ rows: [mockPacienteData] }); // update

      const result = await PacienteRepository.updatePassword(1, 'oldPass', 'newPass');
      expect(result).toBeInstanceOf(Paciente);
      expect(bcrypt.hash).toHaveBeenCalled();
    });

    it('deve lançar erro se paciente não encontrado', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      await expect(PacienteRepository.updatePassword(99, 'x', 'y'))
        .rejects.toThrow('Paciente não encontrado.');
    });

    it('deve lançar erro se senha atual incorreta', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ senha: 'hashedOld' }] });
      bcrypt.compare.mockResolvedValueOnce(false);
      await expect(PacienteRepository.updatePassword(1, 'wrong', 'newPass'))
        .rejects.toThrow('Senha atual incorreta.');
    });

    it('deve lançar erro se nova senha igual a antiga', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ senha: 'hashedOld' }] });
      bcrypt.compare.mockResolvedValueOnce(true);
      await expect(PacienteRepository.updatePassword(1, 'samePass', 'samePass'))
        .rejects.toThrow('A nova senha deve ser diferente da senha atual.');
    });
  });

  describe('verifyCredentials', () => {
    it('deve autenticar paciente com sucesso', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockPacienteData] });
      bcrypt.compare.mockResolvedValueOnce(true);
      const result = await PacienteRepository.verifyCredentials('fulano@example.com', 'senha');
      expect(result).toBeInstanceOf(Paciente);
      expect(result.email).toBe('fulano@example.com');
    });

    it('deve lançar erro se paciente não existir', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      await expect(PacienteRepository.verifyCredentials('notfound@example.com', 'senha'))
        .rejects.toThrow('Credenciais inválidas');
    });

    it('deve lançar erro se senha incorreta', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockPacienteData] });
      bcrypt.compare.mockResolvedValueOnce(false);
      await expect(PacienteRepository.verifyCredentials('fulano@example.com', 'wrong'))
        .rejects.toThrow('Credenciais inválidas');
    });

    it('deve lançar erro se conta desativada', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ ...mockPacienteData, ativo: false }] });
      bcrypt.compare.mockResolvedValueOnce(true);
      await expect(PacienteRepository.verifyCredentials('fulano@example.com', 'senha'))
        .rejects.toThrow('Conta desativada');
    });
  });

  describe('desativar e reativar', () => {
    it('deve desativar um paciente', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ ...mockPacienteData, ativo: false }] });
      const result = await PacienteRepository.desativar(1);
      expect(result).toBeInstanceOf(Paciente);
      expect(result.ativo).toBe(false);
    });

    it('deve reativar um paciente', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ ...mockPacienteData, ativo: true }] });
      const result = await PacienteRepository.reativar(1);
      expect(result).toBeInstanceOf(Paciente);
      expect(result.ativo).toBe(true);
    });
  });

  describe('remove', () => {
    it('deve remover paciente', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockPacienteData] });
      const result = await PacienteRepository.remove(1);
      expect(result).toBeInstanceOf(Paciente);
      expect(result.id).toBe(1);
    });

    it('deve retornar null se paciente não encontrado', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      const result = await PacienteRepository.remove(99);
      expect(result).toBeNull();
    });
  });
});
