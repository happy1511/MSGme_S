const { Schema, default: mongoose } = require("mongoose");
const User = require("./user");
const Message = require("./message");
const moment = require("moment");

const chatRoomSchema = new Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  createdOn: {
    type: Date,
    required: false,
    default: moment().format("YYYY-MM-DD HH:mm:ss"),
  },
  updatedOn: {
    type: Date,
    required: false,
    default: moment().format("YYYY-MM-DD HH:mm:ss"),
  },
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema, "ChatRoom");

module.exports = ChatRoom;

chatRoomSchema.pre("save", async function (next) {
  this.createdOn = moment().format("YYYY-MM-DD HH:mm:ss");
  this.updatedOn = moment().format("YYYY-MM-DD HH:mm:ss");
  next();
});

chatRoomSchema.pre(
  ["deleteOne", "deleteMany", "findByIdAndDelete"],
  async function (next) {
    const chatRoom = await this.model.findOne(this.getQuery());
    chatRoom.members.forEach(async (member) => {
      await User.findByIdAndUpdate(
        { _id: member },
        { $pull: { chatRooms: chatRoom._id } }
      );
    });

    await Message.deleteMany({ chatRoom: chatRoom._id });
    next();
  }
);

chatRoomSchema.pre(
  ["updateOne", "updateMany", "findByIdAndUpadte"],
  async function () {
    this.update(
      {},
      { $set: { updatedOn: moment().format("YYYY-MM-DD HH:mm:ss") } }
    );
  }
);

chatRoomSchema.pre(["find", "findOne"], async function () {
  this.populate("members");
  this.populate("messages");
});
