class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name; // ← NOME CORRETO
    this.statusCode = statusCode || 500; // ← VALOR PADRÃO
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// As outras classes permanecem iguais
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message) {
    super(message, 403);
  }
}

class DatabaseError extends AppError {
  constructor(message) {
    super(message, 500);
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  DatabaseError
};