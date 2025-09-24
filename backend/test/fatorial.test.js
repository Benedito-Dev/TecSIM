const fatorial = require('./fatorial');

test('fatorial de número negativo deve retornar undefined', () => {
  expect(fatorial(-5)).toBeUndefined(); // cobre a linha do if (a < 0)
});

test('fatorial de 0 deve ser 1', () => {
  expect(fatorial(0)).toBe(1); // cobre o if (a === 0)
});

test('fatorial de 1 deve ser 1', () => {
  expect(fatorial(1)).toBe(1); // cobre o if (a === 1)
});

test('fatorial de 5 deve ser 120', () => {
  expect(fatorial(5)).toBe(120); // cobre o while
});

test('fatorial de 3 deve ser 6', () => {
  expect(fatorial(3)).toBe(6); // cobre o while com menos iterações
});
