export class ApiError extends Error {
  public statusCode: number;
  public code: string;

  constructor(code: string, message: string, statusCode = 400) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}
