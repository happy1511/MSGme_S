const { getUser, getAllUsers } = require("../db/access/get");
const { updateUser } = require("../db/access/update");
const Response = require("../helper/response");

const setStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await updateUser({ _id: req.user._id }, { status });
    new Response(res).success(user);
  } catch (err) {
    console.log(err);
    new Response(res).error();
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await getUser({ _id: req.user._id });
    new Response(res).success(user);
  } catch (err) {
    console.log(err);
    new Response(res).error(err.message);
  }
};

const searchUser = async (req, res) => {
  try {
    console.log("re");
    const search = req.query.search ? req.query.search : "";
    const users = await getAllUsers({
      $or: [
        { username: { $regex: search, $options: "i" } }, // Case-insensitive search for username
        { displayName: { $regex: search, $options: "i" } }, // Case-insensitive search for displayName
      ],
    });

    new Response(res).success({ users });
  } catch (err) {
    console.log(err);
    new Response(res).error(err.message);
  }
};

module.exports = { setStatus, getProfile, searchUser };
