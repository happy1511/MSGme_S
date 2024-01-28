const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

const generateToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET);
  return token;
};

const verifyToken = (token) => {
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded;
};

const generateExpireToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  return token;
};

module.exports = { generateToken, verifyToken, generateExpireToken };
