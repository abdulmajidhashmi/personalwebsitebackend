const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const dbconnect = require("./config/db.js");
const userRouter = require("./routes/userRouter.js");

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

dbconnect();

app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://personalwebsite-1vr8.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  optionsSuccessStatus: 200,
}));

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://personalwebsite-1vr8.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  },
});

io.on("connection", (socket) => {
  const customRoom = socket.handshake.query.roomName;
  socket.join(customRoom);

  

  socket.on("sendMessage", ({ use, msg }) => {
    const roomName = String(use);
    socket.to(roomName).emit("recieveMessage", { message: msg });

    if (!io.sockets.sockets.has(roomName)) {
      console.log(`Message sent to custom room: ${roomName}`);
    } else {
      console.log("The provided room name is a default room or invalid.");
    }
  });

  socket.on("leaveRoom", ({ localnumber, status }) => {
    const roomName = String(localnumber);
    io.to(roomName).emit("status", { localnumber, status });
  });

  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
    const status = "offline";
    io.to(customRoom).emit("status", { user: socket.id, status });
  });
});

app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
