function contarVogais(str) {
  const vogais = str.match(/[aeiou]/gi);
  return vogais ? vogais.length : 0;
}

module.exports = contarVogais;