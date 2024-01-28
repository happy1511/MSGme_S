const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const path = require("path");
const { instrument } = require("@socket.io/admin-ui");
const port = process.env.PORT || 8000;
const cors = require("cors");
const authRouter = require("./router/auth");
const userRouter = require("./router/user");

const { authorizeRequest, authorizeSocket } = require("./helper/authorize");
const Emitter = require("./socket/event/Emitter");
const Listener = require("./socket/event/Listener");

dotenv.config();
require("./config/mongo");

const app = express();
const server = http.createServer(app, {
  cors: {
    origin: "*",
    Credentials: true,
  },
});

app.use(
  cors({
    origin: "*",
    Credentials: true,
  })
);
app.use((req, res, next) => {
  const contentLengthInBytes = parseInt(req.get("Content-Length") || 0, 10);
  const contentLengthInMegabytes = contentLengthInBytes / 1024 / 1024;

  console.log(`Request payload size: ${contentLengthInMegabytes} MB`);
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true,limit: "50mb"}));
app.use((req, res, next) => {
  console.log(req.body);
  next();
});
app.use(express.static(path.join(__dirname, "views")));
app.use((req, res, next) => {
  console.log(req.body);
  next();
});
app.get("/", (req, res) => {
  res.send("Hello! welcome to my MSGme");
});

app.get("/reset-password", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "reset-password.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin", "dashboard.html"));
});

app.get("/admin/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin", "dashboard.html"));
});

app.get("/admin/users", (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin", "users.html"));
});

app.get("/admin/users/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin", "addUser.html"));
});

const adminRouter = require("./router/admin");

app.use("/api/admin", adminRouter);

app.use("/api/user", authorizeRequest, userRouter);

require("./config/cloudinary");

app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).send("Page not found");
});

//socket.io
const io = require("socket.io")(server, {
  cors: {
    origin: "*",

    Credentials: true,
  },
});

instrument(io, {
  auth: false,
});

const roomController = require("./controller/room");

io.on("connection", async (socket) => {
  const user = await authorizeSocket(socket);
  roomController(socket, io, user);

  socket.on("join", (room) => {
    socket.join(room);
    console.log(`user joined ${room}`);
  });

  socket.on("send-message", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
