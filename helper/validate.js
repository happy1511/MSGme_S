const { validationResult } = require("express-validator");
const Response = require("../helper/response");

const validateRequiredFields = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    new Response(res).authFailure(errors.errors[0].msg, 401);
  } else {
    next();
  }
};

const validateRequiredFieldsSocket = (data, schema, socket, event, next) => {
  const { error, value } = schema.validate(data);
  if (error) {
    socket.emit(event, {
      message: error.details[0].message,
    });
  } else {
    next(value);
  }
};

module.exports = { validateRequiredFields, validateRequiredFieldsSocket };
