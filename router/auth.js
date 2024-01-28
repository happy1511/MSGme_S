const {
  register,
  login,
  forgetPassword,
  resetPassword,
} = require("../controller/auth");
const { authorizeRequest } = require("../helper/authorize");
const { validateRequiredFields } = require("../helper/validate");
const {
  registerValidationSchema,
  loginValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
} = require("../helper/validationSchema");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Hello! welcome to my MSGme Auth Api");
});

router.post(
  "/register",
  registerValidationSchema,
  validateRequiredFields,
  register
);

router.post("/login", loginValidationSchema, validateRequiredFields, login);

router.post(
  "/forget-password",
  forgetPasswordValidationSchema,
  validateRequiredFields,
  forgetPassword
);

router.post(
  "/reset-password",
  authorizeRequest,
  resetPasswordValidationSchema,
  validateRequiredFields,
  resetPassword
);

module.exports = router;
