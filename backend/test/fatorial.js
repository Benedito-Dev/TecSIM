function fatorial(a) {
  if (a < 0) return undefined; // caminho 1
  if (a === 0 || a === 1) return 1; // caminho 2

  let resultado = 1;
  while (a > 1) { // caminho 3 (loop)
    resultado *= a;
    a--;
  }
  return resultado;
}

module.exports = fatorial;
