const { Schema, default: mongoose } = require("mongoose");
const ChatRoom = require("./chatRoom");
const moment = require("moment");

const messageSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  message: {
    type: String,
    required: true,
  },
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
  },
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
  msgType: {
    type: String,
    required: true,
    default: "text",
  },
});

const Message = mongoose.model("Message", messageSchema, "Message");

module.exports = Message;

messageSchema.pre("save", async function (next) {
  this.createdOn = moment().format("YYYY-MM-DD HH:mm:ss");
  this.updatedOn = moment().format("YYYY-MM-DD HH:mm:ss");
  next();
});

messageSchema.pre(
  ["deleteOne", "deleteMany", "findByIdAndDelete"],
  async function (next) {
    const message = await this.model.findOne(this.getQuery());
    await ChatRoom.findByIdAndUpdate(
      { _id: message.chatRoom },
      { $pull: { messages: message._id } }
    );
    next();
  }
);

messageSchema.post("save", async function (prop) {
  await ChatRoom.findByIdAndUpdate(
    { _id: prop.chatRoom },
    { $push: { messages: prop._id } }
  );
});
