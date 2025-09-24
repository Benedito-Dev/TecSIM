const inverterString = require('./inverter-string');

test('inverte "casa" para "asac"', () => {
    expect(inverterString('casa')).toStrictEqual('asac');
});

test('inverte "12345" para "54321"', () => {
    expect(inverterString('12345')).toBe('54321');
});

test('lança erro se o input não for string', () => {
    expect(() => inverterString(12345)).toThrow('O input deve ser uma string');
});

test('lança erro se a string for vazia', () => {
    expect(() => inverterString('')).toThrow('A string não pode ser vazia');
});

// Atividades