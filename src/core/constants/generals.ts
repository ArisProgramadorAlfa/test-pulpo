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

export {
  HttpMethods,
  HttpStatus,
};