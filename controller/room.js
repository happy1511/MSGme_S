const { default: mongoose } = require("mongoose");
const { createChatRoom, createMessage } = require("../db/access/create");
const { validateRequiredFieldsSocket } = require("../helper/validate");
const { getRoom } = require("../db/access/get");
const { updateUser } = require("../db/access/update");
const {
  chatRoomIdSchema,
  memberIdSchema,
  messageSchema,
} = require("../helper/validationSchema");

module.exports = (socket, io, user) => {
  const createRoom = (data) => {
    validateRequiredFieldsSocket(
      data,
      memberIdSchema,
      socket,
      "room:create:error",
      async ({ memberId }) => {
        try {
          const isExists = await getRoom({
            members: {
              $all: [
                new mongoose.Types.ObjectId(user._id),
                new mongoose.Types.ObjectId(memberId),
              ],
            },
          });

          if (isExists) {
            throw new Error("Room already exists");
          } else {
            const room = await createChatRoom({
              members: [
                new mongoose.Types.ObjectId(user._id),
                new mongoose.Types.ObjectId(memberId),
              ],
            });
            socket.join(room._id);
            socket.emit("room:create:success", room);
          }
        } catch (err) {
          console.log(err);
          socket.emit("room:create:error", {
            message: "Something went wrong" || err.message,
          });
        }
      }
    );
  };

  const getRoomsChat = (data) => {
    validateRequiredFieldsSocket(
      data,
      chatRoomIdSchema,
      socket,
      "room:chat:get:error",
      async ({ chatRoomId }) => {
        try {
          const isExists = await user.chatRooms.includes(chatRoomId);

          if (!isExists) {
            throw new Error("Room not found");
          } else {
            const room = await getRoom({
              _id: new mongoose.Types.ObjectId(chatRoomId),
            });
            await room.populate("messages");
            socket.emit("room:chat:get:success", { room });
          }
        } catch (err) {
          console.log(err);
          socket.emit("room:chat:get:error", {
            message: "Something went wrong" || err.message,
          });
        }
      }
    );
  };

  const deleteRoom = (data) => {
    validateRequiredFieldsSocket(
      data,
      chatRoomIdSchema,
      socket,
      "room:chat:delete:error",
      async ({ chatRoomId }) => {
        try {
          const isExists = await user.chatRooms.includes(chatRoomId);

          if (!isExists) {
            throw new Error("Room not found");
          } else {
            const room = await updateUser(
              { _id: new mongoose.Types.ObjectId(user._id) },
              { $pull: { chatRooms: new mongoose.Types.ObjectId(chatRoomId) } }
            );
            socket.emit("room:chat:delete:success", room);
          }
        } catch (err) {
          console.log(err);
          socket.emit("room:chat:delete:error", {
            message: "Something went wrong" || err.message,
          });
        }
      }
    );
  };

  const sendMessage = (data) => {
    validateRequiredFieldsSocket(
      data,
      messageSchema,
      socket,
      "room:chat:send:error",
      async ({ chatRoomId, message }) => {
        try {
          const sender = await user._id;
          await createMessage({ chatRoomId, message, sender });

          socket.to(chatRoomId.toString()).emit("room:chat:receive", {
            chatRoomId,
            message,
            sender: user._id,
          });

          socket.emit("room:chat:send:success", {
            chatRoomId,
            message,
            sender: user._id,
          });
        } catch (err) {
          console.log(err);
          socket.emit("room:chat:send:error", {
            message: "Something went wrong" || err.message,
          });
        }
      }
    );
  };

  socket.on("room:create", createRoom);
  socket.on("room:get:chat", getRoomsChat);
  socket.on("room:chat:send", sendMessage);
  socket.on("room:chat:delete", deleteRoom);
};
