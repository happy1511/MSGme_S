const { default: mongoose } = require("mongoose");
const createRoom = require("../../controller/room");

class Listener {
  constructor(socket, emitter) {
    this.socket = socket;
    this.user = null;
    this.emitter = emitter;
  }

  setUser(user) {
    this.user = user;
  }

  startListening() {
    this.socket.on("create-room", ({ memberId }) => {
      console.log(this, "sdk");
      createRoom(
        new mongoose.Types.ObjectId(this.user._id),
        new mongoose.Types.ObjectId(memberId),
        this.socket
      );
    });
  }
}

module.exports = Listener;
