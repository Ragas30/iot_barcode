export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message = "Request tidak valid.") {
    super(message, 422, "VALIDATION_ERROR");
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Autentikasi gagal.") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Akses ditolak.") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Data tidak ditemukan.") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Terjadi konflik data.") {
    super(message, 409, "CONFLICT");
  }
}

export class ExpiredError extends AppError {
  constructor(message = "Token sudah expired.") {
    super(message, 410, "EXPIRED");
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Gagal mengakses database.") {
    super(message, 500, "DATABASE_ERROR");
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Terjadi kesalahan internal.") {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Terlalu banyak request.") {
    super(message, 429, "TOO_MANY_REQUESTS");
  }
}
