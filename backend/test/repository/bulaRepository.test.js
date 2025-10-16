const BulaRepository = require('../../repository/bulaRepository.js');
const db = require('../../db/db.js');
const Bula = require('../../models/bulaModel.js');

jest.mock('../../db/db'); // Mock do db

describe('BulaRepository', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- findAll ---
  test('findAll retorna lista de bulas', async () => {
    const fakeRows = [
      { id: 1, id_medicamento: 10, dosagem_e_administracao: '2x/dia' },
      { id: 2, id_medicamento: 11, dosagem_e_administracao: '1x/dia' }
    ];
    db.query.mockResolvedValue({ rows: fakeRows });

    const bulas = await BulaRepository.findAll();

    expect(bulas.length).toBe(2);
    expect(bulas[0]).toBeInstanceOf(Bula);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM bulas');
  });

  // --- findById ---
  test('findById retorna bula quando encontrada', async () => {
    const fakeRow = { id: 1, id_medicamento: 10, dosagem_e_administracao: '2x/dia' };
    db.query.mockResolvedValue({ rows: [fakeRow] });

    const bula = await BulaRepository.findById(1);

    expect(bula).toBeInstanceOf(Bula);
    expect(bula.id).toBe(1);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM bulas WHERE id = $1', [1]);
  });

  test('findById retorna null quando não encontrada', async () => {
    db.query.mockResolvedValue({ rows: [] });
    const bula = await BulaRepository.findById(99);
    expect(bula).toBeNull();
  });

  // --- findByMedicamentoId ---
  test('findByMedicamentoId retorna bula quando encontrada', async () => {
    const fakeRow = { id: 1, id_medicamento: 10, dosagem_e_administracao: '2x/dia' };
    db.query.mockResolvedValue({ rows: [fakeRow] });

    const bula = await BulaRepository.findByMedicamentoId(10);

    expect(bula).toBeInstanceOf(Bula);
    expect(bula.id_medicamento).toBe(10);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM bulas WHERE id_medicamento = $1', [10]);
  });

  test('findByMedicamentoId retorna null quando não encontra bula', async () => {
    db.query.mockResolvedValue({ rows: [] });

    const bula = await BulaRepository.findByMedicamentoId(999);

    expect(bula).toBeNull(); // ou undefined, dependendo da sua implementação
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM bulas WHERE id_medicamento = $1', [999]);
  });

  test('findByMedicamentoId retorna null quando não encontrada', async () => {
    db.query.mockResolvedValue({ rows: [] });
    const bula = await BulaRepository.findByMedicamentoId(99);
    expect(bula).toBeNull();
  });

  // --- create ---
  test('create insere e retorna bula', async () => {
    const data = {
      id_medicamento: 10,
      dosagem_e_administracao: '2x/dia',
      indicacoes: 'Dor de cabeça',
      contraindicacoes: 'Gravidez',
      advertencias: 'Não dirigir',
      interacoes: 'Nenhuma',
      armazenamento_e_validade: '2 anos'
    };
    const fakeRow = { id: 1, ...data };
    db.query.mockResolvedValue({ rows: [fakeRow] });

    const bula = await BulaRepository.create(data);

    expect(bula).toBeInstanceOf(Bula);
    expect(bula.id).toBe(1);
    expect(db.query).toHaveBeenCalled();
  });

  test('create lança erro quando DB falha', async () => {
    db.query.mockRejectedValue(new Error('DB error during create'));
    const data = {
      id_medicamento: 10,
      dosagem_e_administracao: '2x/dia'
    };
    await expect(BulaRepository.create(data)).rejects.toThrow('DB error during create');
  });

  // --- update ---
  test('update atualiza e retorna bula', async () => {
    const data = {
      id_medicamento: 10,
      dosagem_e_administracao: '3x/dia',
      indicacoes: 'Dor leve',
      contraindicacoes: 'Nenhuma',
      advertencias: 'Evitar álcool',
      interacoes: 'Nenhuma',
      armazenamento_e_validade: '3 anos'
    };
    const fakeRow = { id: 1, ...data };
    db.query.mockResolvedValue({ rows: [fakeRow] });

    const bula = await BulaRepository.update(1, data);

    expect(bula).toBeInstanceOf(Bula);
    expect(bula.dosagem_e_administracao).toBe('3x/dia');
    expect(db.query).toHaveBeenCalled();
  });

  test('update lança erro quando DB falha', async () => {
    db.query.mockRejectedValue(new Error('Falha no banco'));

  await expect(
    BulaRepository.update(1, { dosagem_e_administracao: '3x/dia' })
  ).rejects.toThrow('Falha no banco');
  });

  test('update retorna null quando nenhuma bula é encontrada', async () => {
  const data = {
    id_medicamento: 10,
    dosagem_e_administracao: '3x/dia'
  };

  // Simula que o banco não encontrou nada para atualizar
    db.query.mockResolvedValue({ rows: [] });

    const bula = await BulaRepository.update(999, data);

    expect(bula).toBeNull();
    expect(db.query).toHaveBeenCalled();
  });

  // --- remove ---
  test('remove deleta e retorna bula', async () => {
    const fakeRow = { id: 1, id_medicamento: 10 };
    db.query.mockResolvedValue({ rows: [fakeRow] });

    const bula = await BulaRepository.remove(1);

    expect(bula).toBeInstanceOf(Bula);
    expect(db.query).toHaveBeenCalledWith('DELETE FROM bulas WHERE id = $1 RETURNING *;', [1]);
  });

  test('remove retorna null quando bula não existe', async () => {
    db.query.mockResolvedValue({ rows: [] });
    const bula = await BulaRepository.remove(99);
    expect(bula).toBeNull();
  });

  test('remove lança erro quando DB falha', async () => {
    db.query.mockRejectedValue(new Error('DB error during delete'));
    await expect(BulaRepository.remove(1)).rejects.toThrow('Erro ao remover bula: DB error during delete');
  });

});
