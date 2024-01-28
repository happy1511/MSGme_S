const moment = require("moment");
const { createUser } = require("../db/access/create");
const { getUser } = require("../db/access/get");
const Response = require("../helper/response");
const { uploadToCloudinary } = require("../services/cloudinary");
const { generateToken, generateExpireToken } = require("../helper/jwt");
const { compare, hash } = require("../helper/bcrypt");
const mail = require("../services/mail");
const { updateUser } = require("../db/access/update");

const register = async (req, res) => {
  try {
    const { userName, password, dob, email } = req.body;

    const userExists = await getUser({
      $or: [{ userName: userName }, { email: email }],
    });

    if (userExists) {
      new Response(res).authFailure("User already exists", 401);
    } else {
      var profilePicture = {
        public_id: undefined,
        version: undefined,
        url: undefined,
      };

      if (req.body.profilePicture) {
        const profile = await uploadToCloudinary(req.body.profilePicture);
        profilePicture.public_id = profile.public_id;
        profilePicture.version = profile.version;
        profilePicture.url = profile.url;
      }

      const user = await createUser({
        userName,
        password,
        dob: moment(req.body.dob, "DD/MM/YYYY", true).format("YYYY-MM-DD"),
        email,
        bio: req.body.bio,
        profilePicture: profilePicture,
        status: req.body.status ? req.body.status : "offline",
        displayName: req.body.displayName,
      });

      const token = await generateToken({ _id: user._id });

      new Response(res).authSuccess(user, token);
    }
  } catch (err) {
    console.log(err);
    new Response(res).error();
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUser({ email });

    if (!user) {
      new Response(res).authFailure("User does not exist", 401);
    } else {
      const isMatch = await compare(password, user.password);

      if (!isMatch) {
        new Response(res).authFailure("Invalid credentials", 401);
      } else {
        const token = await generateToken({ _id: user._id });

        new Response(res).authSuccess(user, token);
      }
    }
  } catch (err) {
    console.log(err);
    new Response(res).error();
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await getUser({ email });

    if (!user) {
      new Response(res).authFailure("User does not exist", 401);
    } else {
      const token = await generateExpireToken({ _id: user._id });
      const url = `${process.env.BASE_URL}/reset-password?token=${token}`;
      await mail(email, url);
      new Response(res).success("Message sent successfully");
    }
  } catch (err) {
    new Response(res).error(err.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await getUser({ _id: req.user._id });
    const isMatch = await compare(password, user.password);

    if (isMatch) {
      new Response(res).authFailure("The password must be unused.", 401);
    } else {
      const hashesPassword = await hash(password);
      const updatedUser = await updateUser(
        { _id: req.user._id },
        { password: hashesPassword }
      );
      new Response(res).success("password updated successfully");
    }
  } catch (err) {
    new Response(res).error(err.message);
  }
};

module.exports = { register, login, forgetPassword, resetPassword };
