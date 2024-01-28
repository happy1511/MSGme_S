const User = require("../models/user");

const updateUser = (filter, data) => {
  return User.findOneAndUpdate(filter, data);
};

module.exports = { updateUser };
