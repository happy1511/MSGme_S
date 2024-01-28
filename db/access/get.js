const ChatRoom = require("../models/chatRoom");
const Message = require("../models/message");
const User = require("../models/user");

const getUser = (filter) => {
  return User.findOne(filter);
};

const getAllUsers = (filter) => {
  return User.find(filter);
};

const getRoom = (filter) => {
  return ChatRoom.findOne(filter);
};

const getAllChatRooms = (filter) => {
  return ChatRoom.find(filter);
};

const getMessages = (filter) => {
  return Message.find(filter);
};

const getAllMessages = (filter) => {
  return Message.find(filter);
};

module.exports = {
  getUser,
  getRoom,
  getMessages,
  getAllUsers,
  getAllChatRooms,
  getAllMessages,
};
