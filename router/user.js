const { setStatus, getProfile, searchUser } = require("../controller/user");
const { updateUser } = require("../db/access/update");
const Response = require("../helper/response");

const router = require("express").Router();

router.put("/status", setStatus);

router.get("/profile", getProfile);

router.get("/search", searchUser);

module.exports = router;
