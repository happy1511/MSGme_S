const {
  getUser,
  getRoom,
  getMessages,
  getAllChatRooms,
  getAllMessages,
  getAllUsers,
} = require("../db/access/get");

const router = require("express").Router();

router.get("/dashboard", async (req, res) => {
  try {
    const users = await getAllUsers({});
    const chatRoom = await getAllChatRooms({});
    const messages = await getAllMessages({});

    res.status(200).json({
      users: users ? users.length : 0,
      chatRoom: chatRoom ? chatRoom.length : 0,
      messages: messages ? messages.length : 0,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" || err.message });
  }
});

router.get("/user", async (req, res) => {
  try {
    const user = await getUser({ _id: req.query.userId });
    if (user) {
      res.status(200).json({user});
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" || err.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const activeUsers = await getAllUsers({ status: { $eq: "online" } });
    if (req.query.pageNumber) {
      const users = await getAllUsers({})
        .sort({ createdAt: -1 })
        .skip((req.query.pageNumber - 1) * 10)
        .limit(10);

      res
        .status(200)
        .json({ users, activeUsers: activeUsers ? activeUsers.length : 0 });
    } else {
      const users = await getAllUsers({}).sort({ createdAt: -1 }).limit(10);
      res
        .status(200)
        .json({ users, activeUsers: activeUsers ? activeUsers.length : 0 });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" || err.message });
  }
});
module.exports = router;
