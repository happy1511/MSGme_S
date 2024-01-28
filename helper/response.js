class Response {
  constructor(res) {
    this.res = res;
  }

  authSuccess(user, token) {
    this.res.status(200).json({
      responseStatus: 200,
      responseData: {
        user,
        token,
      },
    });
  }

  authFailure(message, statusCode = 401) {
    this.res.status(statusCode).json({
      responseStatus: statusCode,
      responseData: {
        message: message,
      },
    });
  }

  success(data) {
    this.res.status(200).json({
      responseStatus: 200,
      responseData: data,
    });
  }

  error(message = "Internal Server Error.", statusCode = 500) {
    this.res.status(statusCode).json({
      status: "error",
      message: message,
    });
  }
}

module.exports = Response;
