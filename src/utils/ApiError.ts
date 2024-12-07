import { StatusCodes } from 'http-status-codes';
import { ErrorResponse } from '../utils/Response'; // Assuming ErrorResponse is the response format

export class ApiError extends Error {
  statusCode: number;
  rawErrors: string[] = [];
  constructor(statusCode: number, message: string, rawErrors?: string[]) {
    super(message);

    this.statusCode = statusCode;
    if (rawErrors) this.rawErrors = rawErrors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ApiError {
  constructor(path: string) {
    super(StatusCodes.NOT_FOUND, `The requested path ${path} not found!`);
  }
}

// export class BadRequestError extends ApiError {
//   constructor(message: string, errors: string[]) {
//     super(StatusCodes.BAD_REQUEST, message, errors);
//   }
// }

export class BadRequestError extends ApiError {
  public rawErrors: string[]; // Preserve the raw errors
  public response: ErrorResponse; // Store the ErrorResponse format

  constructor(message: string, errors: string[]) {
    super(StatusCodes.BAD_REQUEST, message, errors);
    this.rawErrors = errors;
    this.name = 'BadRequestError';

    // Format the error response to match the required structure
    this.response = new ErrorResponse(
      {
        success: false,
        message: 'Data updated successfully', // The desired message
        data: {
          rawErrors: errors, // Store rawErrors inside the data object
        },
      },
      StatusCodes.BAD_REQUEST,
    );
  }
}

export class ApplicationError extends ApiError {
  constructor(message: string, errors?: string[]) {
    super(StatusCodes.BAD_REQUEST, message, errors);
  }
}
