const { body } = require("express-validator");
const Joi = require("joi");
const moment = require("moment");

const registerValidationSchema = [
  body("userName").notEmpty().withMessage("Username cannot be empty"),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .withMessage(
      "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number"
    ),
  body("dob")
    .notEmpty()
    .withMessage("Date of Birth cannot be empty")
    .custom((value) => {
      const currentDate = moment();
      const dateOfBirth = moment(value, "DD/MM/YYYY", true);
      if (!dateOfBirth.isValid()) {
        throw new Error(`Invalid Date of Birth ${dateOfBirth}`);
      }

      if (dateOfBirth.isAfter(currentDate)) {
        throw new Error("Date of Birth must be on or before today's date ");
      }

      return true;
    }),

  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Invalid Email Address"),
];

const loginValidationSchema = [
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Invalid Email Address"),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .withMessage(
      "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number"
    ),
];

const forgetPasswordValidationSchema = [
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Invalid Email Address"),
];

const resetPasswordValidationSchema = [
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .withMessage(
      "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number"
    ),
];

const memberIdSchema = Joi.object({
  memberId: Joi.string().required(),
});

const chatRoomIdSchema = Joi.object({
  chatRoomId: Joi.string().required(),
});

const messageSchema = Joi.object({
  chatRoomId: Joi.string().required(),
  message: Joi.string().required().min(1),
});

module.exports = {
  registerValidationSchema,
  loginValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
  memberIdSchema,
  chatRoomIdSchema,
  messageSchema,
};
