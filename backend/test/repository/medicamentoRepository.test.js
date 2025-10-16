const MedicamentoRepository = require('../../repository/medicamentoRepository');
const db = require('../../db/db');

jest.mock('../../db/db');

// Mock do console para evitar "vazamento" de logs nos testes
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

// Ou para cada teste individualmente:
beforeEach(() => {
  jest.clearAllMocks();
});

describe('MedicamentoRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- create ---
  test('create insere um medicamento e retorna o registro', async () => {
    const fakeData = {
      nome: 'Paracetamol',
      tipo: 'Analgésico',
      descricao: 'Usado para dor e febre',
      faixa_etaria_minima: 6,
      faixa_etaria_maxima: 65,
      contraindicacoes: 'Doença hepática',
      interacoes_comuns: 'Álcool',
      composicao: 'Paracetamol 500mg',
      dosagem_padrao: '2x/dia',
      bula_detalhada: 'Tomar após as refeições'
    };

    const fakeResult = { rows: [{ id_medicamento: 1, ...fakeData }] };
    db.query.mockResolvedValue(fakeResult);

    const result = await MedicamentoRepository.create(fakeData);
    expect(result).toEqual(expect.objectContaining({ id_medicamento: 1, nome: 'Paracetamol' }));
    expect(db.query).toHaveBeenCalled();

    // Cobrir branch do JSON string
    const resultString = await MedicamentoRepository.create(JSON.stringify(fakeData));
    expect(resultString).toEqual(expect.objectContaining({ id_medicamento: 1 }));
  });

  test('create lança erro quando DB falha', async () => {
    db.query.mockRejectedValue(new Error('DB error'));
    await expect(MedicamentoRepository.create({ nome: 'Teste' })).rejects.toThrow('DB error');
  });

  // --- findAll ---
  test('findAll retorna lista de medicamentos', async () => {
    const fakeRows = [
      { id_medicamento: 1, nome: 'Ibuprofeno', tipo: 'Anti-inflamatório' },
      { id_medicamento: 2, nome: 'Amoxicilina', tipo: 'Antibiótico' }
    ];
    db.query.mockResolvedValue({ rows: fakeRows });

    const result = await MedicamentoRepository.findAll();
    expect(result.length).toBe(2);
    expect(result[0].nome).toBe('Ibuprofeno');
    expect(db.query).toHaveBeenCalled();
  });

  // --- findById ---
  test('findById retorna um medicamento pelo ID', async () => {
    const fakeRow = { id_medicamento: 1, nome: 'Dipirona', tipo: 'Analgésico' };
    db.query.mockResolvedValue({ rows: [fakeRow] });

    const result = await MedicamentoRepository.findById(1);
    expect(result).toEqual(fakeRow);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id_medicamento = $1'), [1]);
  });

  test('findById lança erro quando DB falha', async () => {
    db.query.mockRejectedValue(new Error('DB fail'));
    await expect(MedicamentoRepository.findById(1)).rejects.toThrow('DB fail');
  });

  // --- update ---
  test('update atualiza um medicamento e retorna o registro atualizado', async () => {
    const fakeUpdate = { nome: 'Paracetamol 750mg', tipo: 'Analgésico', descricao: 'Atualizado' };
    const fakeResult = { rows: [{ id_medicamento: 1, ...fakeUpdate }] };
    db.query.mockResolvedValue(fakeResult);

    const result = await MedicamentoRepository.update(1, fakeUpdate);
    expect(result).toEqual(expect.objectContaining({ nome: 'Paracetamol 750mg' }));

    // Cobrir branch do JSON string
    const resultString = await MedicamentoRepository.update(1, JSON.stringify(fakeUpdate));
    expect(resultString).toEqual(expect.objectContaining({ nome: 'Paracetamol 750mg' }));
  });

  test('update lança erro quando DB falha', async () => {
    db.query.mockRejectedValue(new Error('Erro no update'));
    await expect(MedicamentoRepository.update(1, { nome: 'Teste' }))
      .rejects.toThrow('Erro ao atualizar medicamento');
  });

  // --- remove ---
  test('remove exclui um medicamento e retorna seu ID', async () => {
    db.query.mockResolvedValue({ rows: [{ id_medicamento: 1 }] });
    const result = await MedicamentoRepository.remove(1);
    expect(result).toEqual({ id: 1 });

    // Cobrir branch do ?. quando rows[0] undefined
    db.query.mockResolvedValue({ rows: [] });
    const resultEmpty = await MedicamentoRepository.remove(1);
    expect(resultEmpty).toEqual({ id: undefined });
  });

  // --- findByNome ---
  test('findByNome retorna medicamentos pelo nome', async () => {
    const fakeRows = [{ id_medicamento: 1, nome: 'Dipirona', tipo: 'Analgésico' }];
    db.query.mockResolvedValue({ rows: fakeRows });

    const result = await MedicamentoRepository.findByNome('Dipirona');
    expect(result[0].nome).toBe('Dipirona');
  });

  test('findByNome lança erro quando DB falha', async () => {
    db.query.mockRejectedValue(new Error('DB fail'));
    await expect(MedicamentoRepository.findByNome('Dipirona')).rejects.toThrow('DB fail');
  });

  // --- findByTipo ---
  test('findByTipo retorna medicamentos pelo tipo', async () => {
    const fakeRows = [{ id_medicamento: 1, nome: 'Ibuprofeno', tipo: 'Anti-inflamatório' }];
    db.query.mockResolvedValue({ rows: fakeRows });

    const result = await MedicamentoRepository.findByTipo('Anti-inflamatório');
    expect(result[0].tipo).toBe('Anti-inflamatório');
  });

  test('findByTipo lança erro quando DB falha', async () => {
    db.query.mockRejectedValue(new Error('DB fail'));
    await expect(MedicamentoRepository.findByTipo('Anti-inflamatório')).rejects.toThrow('DB fail');
  });

  // --- findByFaixaEtaria ---
  test('findByFaixaEtaria retorna medicamentos compatíveis com idade', async () => {
    const fakeRows = [{ id_medicamento: 1, nome: 'Amoxicilina', faixa_etaria_minima: 5, faixa_etaria_maxima: 60 }];
    db.query.mockResolvedValue({ rows: fakeRows });

    const result = await MedicamentoRepository.findByFaixaEtaria(10);
    expect(result[0].nome).toBe('Amoxicilina');
  });

  test('findByFaixaEtaria lança erro quando DB falha', async () => {
    db.query.mockRejectedValue(new Error('DB fail'));
    await expect(MedicamentoRepository.findByFaixaEtaria(10)).rejects.toThrow('DB fail');
  });

  // --- searchByComposicao ---
  test('searchByComposicao busca por composição', async () => {
    const fakeRows = [{ id_medicamento: 1, nome: 'Dipirona', composicao: 'Dipirona 500mg' }];
    db.query.mockResolvedValue({ rows: fakeRows });

    const result = await MedicamentoRepository.searchByComposicao('Dipirona');
    expect(result[0].composicao).toContain('Dipirona');
  });

  test('searchByComposicao lança erro quando DB falha', async () => {
    db.query.mockRejectedValue(new Error('DB fail'));
    await expect(MedicamentoRepository.searchByComposicao('Dipirona')).rejects.toThrow('DB fail');
  });

  // --- search ---
  test('search retorna lista de medicamentos quando encontra resultados', async () => {
    const fakeRows = [
      { id_medicamento: 1, nome: 'Dipirona', tipo: 'Analgésico' },
      { id_medicamento: 2, nome: 'Paracetamol', tipo: 'Analgésico' }
    ];
    db.query.mockResolvedValue({ rows: fakeRows });

    const result = await MedicamentoRepository.search('par');
    expect(result).toEqual(fakeRows);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE nome ILIKE $1'), ['%par%']);
  });

  test('search lança erro quando DB falha', async () => {
    db.query.mockRejectedValue(new Error('DB error in search'));
    await expect(MedicamentoRepository.search('dip')).rejects.toThrow('DB error in search');
  });
});
