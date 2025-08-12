const { AppError } = require('../utils/errors');

function errorHandler(err, req, res, next) {
  // Log para depuração no console (em produção você pode substituir por um logger)
  console.error(err);

  // Se for uma das nossas classes AppError (NotFoundError, ConflictError, etc.)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  // Erro não previsto
  res.status(500).json({ message: 'Erro interno do servidor' });
}

module.exports = errorHandler;
