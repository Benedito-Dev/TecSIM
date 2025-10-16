jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn(),
    connect: jest.fn()
  };
  return { Pool: jest.fn(() => mockPool) };
});

const { Pool } = require('pg');
const db = require('../../db/db');

describe('Database', () => {
  const mockPool = Pool();

  test('deve exportar métodos corretos', () => {
    expect(typeof db.query).toBe('function');
    expect(typeof db.connect).toBe('function');
    expect(db.pool).toBe(mockPool);
  });

  test('query deve delegar para pool.query', async () => {
    mockPool.query.mockResolvedValue({ rows: [] });
    await db.query('SELECT 1');
    expect(mockPool.query).toHaveBeenCalledWith('SELECT 1', undefined);
  });

  test('connect deve delegar para pool.connect', () => {
    db.connect();
    expect(mockPool.connect).toHaveBeenCalled();
  });
});