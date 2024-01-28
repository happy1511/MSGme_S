const { Schema, default: mongoose } = require("mongoose");
const ChatRoom = require("./chatRoom");
const moment = require("moment");

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: false,
    default: "Anonymous",
  },
  dob: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    value: {
      type: Number,
      required: false,
      default: null,
    },
    createdOn: {
      type: Date,
      required: false,
      default: null,
    },
  },
  profilePicture: {
    public_id: {
      type: String,
      required: false,
      default: "1705398225",
    },
    version: {
      type: String,
      required: false,
      default: "MSGme/istockphoto-1495088043-612x612-removebg-preview_isizgz",
    },
    url: {
      type: String,
      required: false,
      default:
        "https://res.cloudinary.com/dszbuhdfz/image/upload/v1705398225/MSGme/istockphoto-1495088043-612x612-removebg-preview_isizgz.png",
    },
  },
  bio: {
    type: String,
    required: false,
    default: "This user has no bio",
  },
  updatedOn: {
    type: Date,
    required: false,
    default: moment().format("YYYY-MM-DD HH:mm:ss"),
  },
  createdOn: {
    type: Date,
    required: false,
    default: moment().format("YYYY-MM-DD HH:mm:ss"),
  },
  chatRooms: [
    {
      chatRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRoom",
      },
      unreadMessages: {
        type: Number,
        default: 0,
      },
    },
  ],

  status: {
    type: String,
    required: false,
    default: "offline",
  },
});

const User = mongoose.model("User", userSchema, "User");

module.exports = User;

userSchema.pre("save", async function (next) {
  this.createdOn = moment().format("YYYY-MM-DD HH:mm:ss");
  this.updatedOn = moment().format("YYYY-MM-DD HH:mm:ss");
  next();
});

userSchema.pre(
  ["deleteOne", "deleteMany", "findByIdAndDelete"],
  async function (next) {
    const user = await this.model.findOne(this.getQuery());
    user.chatRooms.forEach(async (chatRoom) => {
      await ChatRoom.findByIdAndDelete(chatRoom);
    });
    next();
  }
);

userSchema.pre(
  ["updateOne", "updateMany", "findByIdAndUpdate"],
  async function (next) {
    this.updatedOn = moment().format("YYYY-MM-DD HH:mm:ss");
    next();
  }
);

userSchema.pre(["find", "findOne", "findById"], async function (next) {
  this.populate("chatRooms");
  next();
});
