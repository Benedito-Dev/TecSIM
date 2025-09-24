const primo = require('./primo');

test('7 é primo', () => {
  expect(primo(7)).toBe(true);
});

test('10 não é primo', () => {
  expect(primo(10)).toBe(false);
});

test('1 não é primo', () => {
  expect(primo(1)).toBe(false);
});