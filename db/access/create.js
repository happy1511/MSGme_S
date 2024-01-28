const { default: mongoose } = require("mongoose");
const { hash } = require("../../helper/bcrypt");
const ChatRoom = require("../models/chatRoom");
const Message = require("../models/message");
const User = require("../models/user");
const { updateUser } = require("./update");

const createUser = async (data) => {
  const hashedPass = await hash(data.password);

  return User.create({
    userName: data.userName,
    password: hashedPass,
    dob: data.dob,
    email: data.email,
    bio: data.bio,
    profilePicture: {
      public_id: data.profilePicture.public_id,
      version: data.profilePicture.version,
      url: data.profilePicture.url,
    },
    status: data.status,
    displayName: data.displayName,
  });
};

const createChatRoom = async (data) => {
  const room = await ChatRoom.create({
    members: data.members,
  });

  room.save();

  await Promise.all(
    data.members.map(async (member) => {
      await updateUser({ _id: member }, { $push: { chatRooms: room._id } });
    })
  );

  return room;
};

const createMessage = async ({ chatRoomId, message, sender }) => {
  const msg = await Message.create({
    chatRoom: new mongoose.Types.ObjectId(chatRoomId),
    message: message,
    sender: new mongoose.Types.ObjectId(sender),
  });

  const chatRoom = await ChatRoom.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(chatRoomId),
    },
    {
      $push: { messages: msg._id },
    }
  );

  if (!chatRoom) {
    await msg.deleteOne();
    throw new Error("Room not found");
  }

  return msg;
};

module.exports = { createUser, createChatRoom, createMessage };
