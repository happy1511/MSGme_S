class Emitter {
  constructor(socket) {
    this.socket = socket;
  }

  roomCreated(room) {
    this.socket.emit("room-created", room);
  }

  error(message = "Something went wrong.") {
    this.socket.emit("error", message);
  }
}

module.exports = Emitter;
