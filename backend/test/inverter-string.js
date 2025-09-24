function inverterString(str) {
    if (typeof str !== 'string') {
        throw new Error('O input deve ser uma string');
    }
    if (str.length === 0) {
        throw new Error('A string não pode ser vazia');
    }
    return str.split('').reverse().join('');
}

module.exports = inverterString;