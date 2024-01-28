const { getUser } = require("../db/access/get");
const { verifyToken } = require("./jwt");
const Response = require("./response");

const authorizeRequest = async (req, res, next) => {
  try {
    const tokenBearer = req.headers["authorization"];
    console.log(req.body);
    if (!tokenBearer) {
      new Response(res).authFailure("Token not Found.", 401);
    } else {
      const token = await tokenBearer.split(" ")[1];
      const decoded = await verifyToken(token);
      const user = await getUser({ _id: decoded._id });

      if (!user) {
        new Response(res).authFailure("Token is Invalid", 401);
      } else {
        req.user = user;
        next();
      }
    }
  } catch (err) {
    console.log(err);
    new Response(res).error(err.message);
  }
};

const authorizeSocket = async (socket) => {
  try {
    const tokenBearer = socket.handshake.headers.auth;

    if (!tokenBearer) {
      socket.disconnect();
    } else {
      const decoded = await verifyToken(tokenBearer);
      const user = await getUser({ _id: decoded._id });

      if (!user) {
        socket.disconnect();
      } else {
        user.chatRooms.map((room) => {
          socket.join(room._id.toString());
          socket.to(room._id.toString()).emit("room:user:joined", {
            room: room._id,
            user: user._id,
          });
        });
        socket.join("global");
        socket.to("global").emit("room:user:joined", {
          room: "global",
          user: user._id,
        });
        socket.emit("user:authorize:success", { user: user });
        return user;
      }
    }
  } catch (err) {
    console.log(err);
    socket.disconnect();
  }
};

module.exports = { authorizeRequest, authorizeSocket };
