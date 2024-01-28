const { setStatus, getProfile } = require("../controller/user");
const { updateUser } = require("../db/access/update");
const Response = require("../helper/response");

const router = require("express").Router();

router.put("/status", setStatus);

router.get("/profile", getProfile);

module.exports = router;
