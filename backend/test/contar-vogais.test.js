const contarVogais = require('./contar-vogais');

test('conta vogais em "javascript"', () => {
  expect(contarVogais('javascript')).toBe(3);
});

test('conta vogais em "bbb"', () => {
    expect(contarVogais('bbb')).toBe(0);
});

test('conta vogais em string vazia', () => {
    expect(contarVogais('')).toBe(0);
});