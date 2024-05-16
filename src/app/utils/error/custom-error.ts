export class CustomError extends Error {
  constructor(message: string, public code: string = 'customError') {
    super(message);
    this.code = code;
  }
}
