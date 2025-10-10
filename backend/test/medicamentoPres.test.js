const MedicamentoPrescritoRepository = require('../repository/medicamentosPrescritosRepository')
const db = require('../db/db');
const { NotFoundError, DatabaseError } = require('../utils/errors');

jest.mock('../db/db');

describe('MedicamentoPrescritoRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- findAll ---
  test('findAll retorna lista de medicamentos prescritos', async () => {
    const fakeRows = [{ id: 1, id_prescricao: 10, id_medicamento: 5, dosagem: '500mg', nome: 'Dipirona' }];
    db.query.mockResolvedValue({ rows: fakeRows });

    const result = await MedicamentoPrescritoRepository.findAll();

    expect(result).toEqual(fakeRows);
    expect(db.query).toHaveBeenCalled();
  });

  test('findAll lança DatabaseError quando DB falha', async () => {
    db.query.mockRejectedValue(new Error('DB fail'));
    await expect(MedicamentoPrescritoRepository.findAll()).rejects.toThrow(DatabaseError);
  });

  // --- findById ---
  test('findById retorna medicamento por ID', async () => {
    const fakeRow = { id: 1, id_prescricao: 10, id_medicamento: 5, dosagem: '500mg', nome: 'Dipirona' };
    db.query.mockResolvedValue({ rows: [fakeRow] });

    const result = await MedicamentoPrescritoRepository.findById(1);

    expect(result).toEqual(fakeRow);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE mp.id_medicamento_prescrito = $1'), [1]);
  });

  test('findById lança NotFoundError se não encontrar', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await expect(MedicamentoPrescritoRepository.findById(99)).rejects.toThrow(NotFoundError);
  });

  test('findById lança DatabaseError se DB falhar', async () => {
    db.query.mockRejectedValue(new Error('DB fail'));
    await expect(MedicamentoPrescritoRepository.findById(1)).rejects.toThrow(DatabaseError);
  });

  // --- findByPrescricaoId ---
  test('findByPrescricaoId retorna array de medicamentos', async () => {
    const fakeRows = [
      { id: 1, id_prescricao: 10, id_medicamento: 5, dosagem: '500mg', nome: 'Dipirona' }
    ];
    db.query.mockResolvedValue({ rows: fakeRows });

    const result = await MedicamentoPrescritoRepository.findByPrescricaoId(10);

    expect(result).toEqual(fakeRows);
  });

  test('findByPrescricaoId retorna array vazio se não houver resultados', async () => {
    db.query.mockResolvedValue({ rows: [] });
    const result = await MedicamentoPrescritoRepository.findByPrescricaoId(99);
    expect(result).toEqual([]);
  });

  test('findByPrescricaoId lança DatabaseError se DB falhar', async () => {
    db.query.mockRejectedValue(new Error('DB fail'));
    await expect(MedicamentoPrescritoRepository.findByPrescricaoId(1)).rejects.toThrow(DatabaseError);
  });

  // --- create ---
  test('create insere e retorna medicamento prescrito', async () => {
    const data = { id_prescricao: 10, id_medicamento: 5, dosagem: '500mg', frequencia: '2x/dia', duracao_dias: 5, horarios: ['08:00'], via: 'oral' };
    const inserted = { id_medicamento_prescrito: 1, ...data };
    const returned = { ...inserted, nome: 'Dipirona' };

    db.query
      .mockResolvedValueOnce({ rows: [inserted] }) // insert
      .mockResolvedValueOnce({ rows: [returned] }); // findById

    const result = await MedicamentoPrescritoRepository.create(data);

    expect(result).toEqual(returned);
  });

  test('create lança DatabaseError quando DB falha', async () => {
    db.query.mockRejectedValue(new Error('DB fail'));
    await expect(MedicamentoPrescritoRepository.create({})).rejects.toThrow(DatabaseError);
  });

  // --- createMany ---
  test('createMany insere múltiplos medicamentos prescritos', async () => {
    const meds = [
      { id_prescricao: 10, id_medicamento: 5, dosagem: '500mg', frequencia: '2x/dia', duracao_dias: 5, horarios: ['08:00'], via: 'oral' },
      { id_prescricao: 10, id_medicamento: 6, dosagem: '250mg', frequencia: '1x/dia', duracao_dias: 3, horarios: ['08:00'], via: 'oral' }
    ];

    db.query
      .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // insert 1
      .mockResolvedValueOnce({ rows: [{ id: 1, nome: 'Dipirona' }] }) // findById 1
      .mockResolvedValueOnce({ rows: [{ id: 2 }] }) // insert 2
      .mockResolvedValueOnce({ rows: [{ id: 2, nome: 'Paracetamol' }] }); // findById 2

    const result = await MedicamentoPrescritoRepository.createMany(meds);

    expect(result).toEqual([
      { id: 1, nome: 'Dipirona' },
      { id: 2, nome: 'Paracetamol' }
    ]);
  });

  test('createMany lança DatabaseError quando DB falha', async () => {
    db.query.mockRejectedValue(new Error('DB fail'));
    await expect(MedicamentoPrescritoRepository.createMany([{ id_prescricao: 1 }])).rejects.toThrow(DatabaseError);
  });

  // --- update ---
  test('update atualiza e retorna medicamento prescrito', async () => {
    const data = { dosagem: '750mg' };
    db.query
      .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // update
      .mockResolvedValueOnce({ rows: [{ id: 1, dosagem: '750mg', nome: 'Dipirona' }] }); // findById

    const result = await MedicamentoPrescritoRepository.update(1, data);

    expect(result).toEqual({ id: 1, dosagem: '750mg', nome: 'Dipirona' });
  });

  test('update lança NotFoundError se não encontrar', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await expect(MedicamentoPrescritoRepository.update(99, {})).rejects.toThrow(NotFoundError);
  });

  test('update lança DatabaseError se DB falhar', async () => {
    db.query.mockRejectedValue(new Error('DB fail'));
    await expect(MedicamentoPrescritoRepository.update(1, {})).rejects.toThrow(DatabaseError);
  });

  // --- remove ---
  test('remove exclui e retorna medicamento prescrito', async () => {
    const fakeRow = { id: 1, id_prescricao: 10, id_medicamento: 5 };
    db.query.mockResolvedValue({ rows: [fakeRow] });

    const result = await MedicamentoPrescritoRepository.remove(1);

    expect(result).toEqual(fakeRow);
  });

  test('remove lança NotFoundError se não encontrar', async () => {
    db.query.mockResolvedValue({ rows: [] });
    await expect(MedicamentoPrescritoRepository.remove(99)).rejects.toThrow(NotFoundError);
  });

  test('remove lança DatabaseError se DB falhar', async () => {
    db.query.mockRejectedValue(new Error('DB fail'));
    await expect(MedicamentoPrescritoRepository.remove(1)).rejects.toThrow(DatabaseError);
  });
});
