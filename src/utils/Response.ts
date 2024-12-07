export class SuccessResponse {
  statusCode: number;
  data: any;

  constructor(data: any, statusCode = 200) {
    this.statusCode = statusCode;
    this.data = {
      success: true,
      message: data.message,
      data: data.data,
    }; // Explicitly define the property order
  }
}

export class ErrorResponse {
  statusCode: number;
  data: any;

  constructor(data: any, statusCode = 400) {
    this.statusCode = statusCode;
    this.data = {
      success: false,
      message: data.message,
      data: data.data,
    }; // Explicitly define the property order
  }
}
