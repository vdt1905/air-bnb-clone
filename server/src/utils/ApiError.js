export class ApiError extends Error {
  constructor(message, { status = 500, code = 'INTERNAL_ERROR' } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.isOperational = true;
  }

  static badRequest(message, code = 'BAD_REQUEST') {
    return new ApiError(message, { status: 400, code });
  }

  static notFound(message, code = 'NOT_FOUND') {
    return new ApiError(message, { status: 404, code });
  }
}
