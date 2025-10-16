const EnfermeirosRepository = require('../../repository/enfermeirosRepository');
const db = require('../../db/db');
const bcrypt = require('bcrypt');
const Enfermeiro = require('../../models/enfermeiroModel');

// Mock das dependências
jest.mock('../../db/db');
jest.mock('bcrypt');
jest.mock('../../models/enfermeiroModel');

describe('EnfermeirosRepository', () => {
  let mockQuery;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery = jest.fn();
    db.query = mockQuery;
    
    // Mock padrão para Enfermeiro
    Enfermeiro.mockImplementation((data) => ({
      ...data,
      id: data.id || 1
    }));
  });

  // Definição das queries exatamente como estão no código original
  const QUERIES = {
    FIND_BY_ID: `
      SELECT * FROM enfermeiros WHERE id = $1
    `,
    FIND_BY_EMAIL: `
      SELECT * FROM enfermeiros WHERE email = $1
    `,
    FIND_BY_COREN: `
      SELECT * FROM enfermeiros WHERE registro_coren = $1
    `,
    UPDATE_PASSWORD: `
      UPDATE enfermeiros SET senha = $1, data_atualizacao = NOW()
      WHERE id = $2 RETURNING *
    `,
    VERIFY_CREDENTIALS: `
        SELECT * FROM enfermeiros WHERE email = $1
      `,
    REMOVE: `
      DELETE FROM enfermeiros WHERE id = $1 RETURNING *
    `
  };

  describe('findAll', () => {
    it('deve retornar todos os enfermeiros', async () => {
      const mockRows = [
        { id: 1, nome: 'Enfermeiro 1', email: 'test1@test.com' },
        { id: 2, nome: 'Enfermeiro 2', email: 'test2@test.com' }
      ];
      
      mockQuery.mockResolvedValue({ rows: mockRows });

      const result = await EnfermeirosRepository.findAll();

      expect(mockQuery).toHaveBeenCalledWith(`
      SELECT id, nome, email, telefone, registro_coren, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status, foto_perfil, data_cadastro, ativo
      FROM enfermeiros
    `);
      expect(Enfermeiro).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
    });

    it('deve retornar array vazio quando não houver enfermeiros', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await EnfermeirosRepository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('deve retornar enfermeiro quando encontrado', async () => {
      const mockEnfermeiro = { id: 1, nome: 'Teste', email: 'test@test.com' };
      mockQuery.mockResolvedValue({ rows: [mockEnfermeiro] });

      const result = await EnfermeirosRepository.findById(1);

      expect(mockQuery).toHaveBeenCalledWith(QUERIES.FIND_BY_ID, [1]);
      expect(Enfermeiro).toHaveBeenCalledWith(mockEnfermeiro);
      expect(result).toEqual(expect.objectContaining(mockEnfermeiro));
    });

    it('deve retornar null quando enfermeiro não for encontrado', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await EnfermeirosRepository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('deve retornar enfermeiro quando email for encontrado', async () => {
      const mockEnfermeiro = { id: 1, email: 'test@test.com' };
      mockQuery.mockResolvedValue({ rows: [mockEnfermeiro] });

      const result = await EnfermeirosRepository.findByEmail('test@test.com');

      expect(mockQuery).toHaveBeenCalledWith(QUERIES.FIND_BY_EMAIL, ['test@test.com']);
      expect(result).toEqual(expect.objectContaining(mockEnfermeiro));
    });

    it('deve retornar null quando email não for encontrado', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await EnfermeirosRepository.findByEmail('naoexiste@test.com');

      expect(result).toBeNull();
    });
  });

  describe('findByCOREN', () => {
    it('deve retornar enfermeiro quando COREN for encontrado', async () => {
      const mockEnfermeiro = { id: 1, registro_coren: 'COREN123' };
      mockQuery.mockResolvedValue({ rows: [mockEnfermeiro] });

      const result = await EnfermeirosRepository.findByCOREN('COREN123');

      expect(mockQuery).toHaveBeenCalledWith(QUERIES.FIND_BY_COREN, ['COREN123']);
      expect(result).toEqual(expect.objectContaining(mockEnfermeiro));
    });

    it('deve retornar null quando COREN não for encontrado', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await EnfermeirosRepository.findByCOREN('COREN999');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('deve criar um novo enfermeiro com senha criptografada', async () => {
      const enfermeiroData = {
        nome: 'Novo Enfermeiro',
        email: 'novo@test.com',
        senha: 'senha123',
        telefone: '123456789',
        registro_coren: 'COREN456',
        cargo: 'Enfermeiro',
        unidade: 'UTI',
        turno: 'Noturno',
        data_admissao: '2023-01-01',
        especialidade: 'UTI',
        anos_experiencia: 5,
        status: 'Ativo'
      };

      const senhaHash = 'hashedPassword123';
      const mockEnfermeiroCriado = { id: 1, ...enfermeiroData, senha: senhaHash };

      bcrypt.hash.mockResolvedValue(senhaHash);
      mockQuery.mockResolvedValue({ rows: [mockEnfermeiroCriado] });

      const result = await EnfermeirosRepository.create(enfermeiroData);

      expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
      expect(mockQuery).toHaveBeenCalledWith(`
      INSERT INTO enfermeiros 
      (nome, email, senha, telefone, registro_coren, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `, [
        'Novo Enfermeiro', 'novo@test.com', 'hashedPassword123', '123456789',
        'COREN456', 'Enfermeiro', 'UTI', 'Noturno', '2023-01-01',
        'UTI', 5, 'Ativo'
      ]);
      expect(result).toEqual(expect.objectContaining(mockEnfermeiroCriado));
    });
  });

  describe('update', () => {
    it('deve atualizar enfermeiro existente', async () => {
      const updateData = {
        nome: 'Enfermeiro Atualizado',
        email: 'atualizado@test.com',
        telefone: '987654321',
        cargo: 'Enfermeiro Chefe',
        unidade: 'Emergência',
        turno: 'Diurno',
        data_admissao: '2023-02-01',
        especialidade: 'Emergência',
        anos_experiencia: 6,
        status: 'Ativo'
      };

      const mockEnfermeiroAtualizado = { id: 1, ...updateData };
      mockQuery.mockResolvedValue({ rows: [mockEnfermeiroAtualizado] });

      const result = await EnfermeirosRepository.update(1, updateData);

      expect(mockQuery).toHaveBeenCalledWith(`
      UPDATE enfermeiros
      SET nome=$1, email=$2, telefone=$3, cargo=$4, unidade=$5, turno=$6, data_admissao=$7, especialidade=$8, anos_experiencia=$9, status=$10, data_atualizacao=NOW()
      WHERE id=$11
      RETURNING *
    `, [
        'Enfermeiro Atualizado', 'atualizado@test.com', '987654321',
        'Enfermeiro Chefe', 'Emergência', 'Diurno', '2023-02-01',
        'Emergência', 6, 'Ativo', 1
      ]);
      expect(result).toEqual(expect.objectContaining(mockEnfermeiroAtualizado));
    });

    it('deve retornar null quando enfermeiro não for encontrado para update', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await EnfermeirosRepository.update(999, { nome: 'Teste' });

      expect(result).toBeNull();
    });
  });

  describe('atualizarFoto', () => {
    it('deve atualizar a foto do enfermeiro', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await EnfermeirosRepository.atualizarFoto(1, '/caminho/foto.jpg');

      expect(mockQuery).toHaveBeenCalledWith(
        'UPDATE enfermeiros SET foto_perfil = $1 WHERE id = $2',
        ['/caminho/foto.jpg', 1]
      );
    });
  });

  describe('updatePassword', () => {
    it('deve atualizar a senha quando senha atual estiver correta', async () => {
      const senhaAtualHash = 'hashSenhaAtual';
      const novaSenhaHash = 'hashNovaSenha';
      
      mockQuery
        .mockResolvedValueOnce({ rows: [{ senha: senhaAtualHash }] }) // Primeira chamada - SELECT
        .mockResolvedValueOnce({ rows: [{ id: 1, nome: 'Teste' }] }); // Segunda chamada - UPDATE

      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue(novaSenhaHash);

      const result = await EnfermeirosRepository.updatePassword(1, 'senhaAtual', 'novaSenha');

      expect(mockQuery).toHaveBeenNthCalledWith(
        1,
        'SELECT senha FROM enfermeiros WHERE id = $1',
        [1]
      );
      expect(bcrypt.compare).toHaveBeenCalledWith('senhaAtual', senhaAtualHash);
      expect(bcrypt.hash).toHaveBeenCalledWith('novaSenha', 10);
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        QUERIES.UPDATE_PASSWORD,
        [novaSenhaHash, 1]
      );
      expect(result).toEqual(expect.objectContaining({ id: 1, nome: 'Teste' }));
    });

    it('deve lançar erro quando enfermeiro não for encontrado', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await expect(
        EnfermeirosRepository.updatePassword(999, 'senhaAtual', 'novaSenha')
      ).rejects.toThrow('Enfermeiro não encontrado.');
    });

    it('deve lançar erro quando senha atual estiver incorreta', async () => {
      mockQuery.mockResolvedValue({ rows: [{ senha: 'hashSenhaAtual' }] });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        EnfermeirosRepository.updatePassword(1, 'senhaErrada', 'novaSenha')
      ).rejects.toThrow('Senha atual incorreta.');
    });

    it('deve lançar erro quando nova senha for igual à atual', async () => {
      mockQuery.mockResolvedValue({ rows: [{ senha: 'hashSenhaAtual' }] });
      bcrypt.compare.mockResolvedValue(true);

      await expect(
        EnfermeirosRepository.updatePassword(1, 'mesmaSenha', 'mesmaSenha')
      ).rejects.toThrow('A nova senha deve ser diferente da atual.');
    });
  });

  describe('verifyCredentials', () => {
    it('deve retornar enfermeiro quando credenciais estiverem corretas', async () => {
        const mockEnfermeiro = {
        id: 1,
        email: 'test@test.com',
        senha: 'hashedPassword',
        ativo: true,
        nome: 'Teste'
        };

        // Mock para retornar os dados brutos do banco
        mockQuery.mockResolvedValue({ rows: [mockEnfermeiro] });
        bcrypt.compare.mockResolvedValue(true);

        // Configurar o mock para retornar um objeto que parece uma instância
        const mockInstance = { id: 1, nome: 'Teste', email: 'test@test.com' };
        Enfermeiro.mockImplementation(() => mockInstance);

        const result = await EnfermeirosRepository.verifyCredentials('test@test.com', 'senhaCorreta');

        expect(mockQuery).toHaveBeenCalledWith(QUERIES.VERIFY_CREDENTIALS, ['test@test.com']);
        expect(bcrypt.compare).toHaveBeenCalledWith('senhaCorreta', 'hashedPassword');
        expect(result).toBe(mockInstance);
    });

    it('deve lançar erro quando email não for encontrado', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await expect(
        EnfermeirosRepository.verifyCredentials('naoexiste@test.com', 'senha')
      ).rejects.toThrow('Credenciais inválidas');
    });

    it('deve lançar erro quando senha estiver incorreta', async () => {
      const mockEnfermeiro = {
        id: 1,
        email: 'test@test.com',
        senha: 'hashedPassword',
        ativo: true
      };

      mockQuery.mockResolvedValue({ rows: [mockEnfermeiro] });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        EnfermeirosRepository.verifyCredentials('test@test.com', 'senhaErrada')
      ).rejects.toThrow('Credenciais inválidas');
    });

    it('deve lançar erro quando conta estiver desativada', async () => {
      const mockEnfermeiro = {
        id: 1,
        email: 'test@test.com',
        senha: 'hashedPassword',
        ativo: false
      };

      mockQuery.mockResolvedValue({ rows: [mockEnfermeiro] });
      bcrypt.compare.mockResolvedValue(true);

      await expect(
        EnfermeirosRepository.verifyCredentials('test@test.com', 'senhaCorreta')
      ).rejects.toThrow('Conta desativada');
    });
  });

  describe('debugSenha', () => {
    it('deve retornar a senha para debug', async () => {
      const mockSenha = { senha: 'hashedPassword' };
      mockQuery.mockResolvedValue({ rows: [mockSenha] });

      const result = await EnfermeirosRepository.debugSenha('test@test.com');

      expect(mockQuery).toHaveBeenCalledWith('SELECT senha FROM enfermeiros WHERE email = $1', ['test@test.com']);
      expect(result).toEqual(mockSenha);
    });
  });

  describe('desativar', () => {
    it('deve desativar um enfermeiro', async () => {
      const mockEnfermeiroDesativado = { id: 1, ativo: false, status: 'Inativo' };
      mockQuery.mockResolvedValue({ rows: [mockEnfermeiroDesativado] });

      const result = await EnfermeirosRepository.desativar(1);

      expect(mockQuery).toHaveBeenCalledWith(`
      UPDATE enfermeiros SET ativo = FALSE, status = 'Inativo', data_atualizacao = NOW()
      WHERE id = $1 RETURNING *
    `, [1]);
      expect(result).toEqual(expect.objectContaining(mockEnfermeiroDesativado));
    });

    it('deve retornar null quando enfermeiro não for encontrado para desativar', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await EnfermeirosRepository.desativar(999);

      expect(result).toBeNull();
    });
  });

  describe('reativar', () => {
    it('deve reativar um enfermeiro', async () => {
      const mockEnfermeiroReativado = { id: 1, ativo: true, status: 'Ativo' };
      mockQuery.mockResolvedValue({ rows: [mockEnfermeiroReativado] });

      const result = await EnfermeirosRepository.reativar(1);

      expect(mockQuery).toHaveBeenCalledWith(`
      UPDATE enfermeiros SET ativo = TRUE, status = 'Ativo', data_atualizacao = NOW()
      WHERE id = $1 RETURNING *
    `, [1]);
      expect(result).toEqual(expect.objectContaining(mockEnfermeiroReativado));
    });

    it('deve retornar null quando enfermeiro não for encontrado para reativar', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await EnfermeirosRepository.reativar(999);

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('deve remover um enfermeiro', async () => {
      const mockEnfermeiroRemovido = { id: 1, nome: 'Removido' };
      mockQuery.mockResolvedValue({ rows: [mockEnfermeiroRemovido] });

      const result = await EnfermeirosRepository.remove(1);

      expect(mockQuery).toHaveBeenCalledWith(QUERIES.REMOVE, [1]);
      expect(result).toEqual(expect.objectContaining(mockEnfermeiroRemovido));
    });

    it('deve retornar null quando enfermeiro não for encontrado para remover', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await EnfermeirosRepository.remove(999);

      expect(result).toBeNull();
    });
  });

  describe('search', () => {
    it('deve buscar enfermeiros por termo', async () => {
      const mockRows = [
        { id: 1, nome: 'João Silva', email: 'joao@test.com' },
        { id: 2, nome: 'Maria Santos', email: 'maria@test.com' }
      ];
      
      mockQuery.mockResolvedValue({ rows: mockRows });

      const result = await EnfermeirosRepository.search('joão');

      expect(mockQuery).toHaveBeenCalledWith(`
      SELECT id, nome, email, telefone, registro_coren, cargo, unidade, turno, data_admissao, especialidade, anos_experiencia, status, foto_perfil, data_cadastro, ativo
      FROM enfermeiros 
      WHERE nome ILIKE $1 
         OR email ILIKE $1 
         OR registro_coren ILIKE $1 
         OR cargo ILIKE $1 
         OR especialidade ILIKE $1
    `, ['%joão%']);
      expect(result).toHaveLength(2);
      expect(Enfermeiro).toHaveBeenCalledTimes(2);
    });

    it('deve retornar array vazio quando nenhum resultado for encontrado', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await EnfermeirosRepository.search('termoInexistente');

      expect(result).toEqual([]);
    });
  });
});