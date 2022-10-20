enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
};

enum HttpStatus {
  ok = 200,
  created = 201,
  badRequest = 400,
  unauthorized = 401,
  notFound = 404,
  internalServerError = 500
};

const axiosConfig = {
  requests: {
    timeout: 30000,
    retries: 3
  }
};

export {
  HttpMethods,
  HttpStatus,
  axiosConfig,
};