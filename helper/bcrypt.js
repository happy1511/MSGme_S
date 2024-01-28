const bcrypt = require("bcrypt");

const hash = (content) => {
  const hash = bcrypt.hash(content, Number(process.env.BCRYPT_SALT_ROUNDS));
  return hash;
};

const compare = (content, hashedContent) => {
  const isMatch = bcrypt.compare(content, hashedContent);
  return isMatch;
};

module.exports = { hash, compare };
