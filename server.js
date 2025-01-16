const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const dbconnect = require("./config/db.js");
const userRouter = require("./routes/userRouter.js");
const patientRouter = require("./routes/patientRouter.js");

dotenv.config();

const app = express();
const server = http.createServer(app);
const { v4: uuidV4 } = require("uuid");
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
      "https://personalwebsite-1vr8.onrender.com/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  },
});

io.on("connection", (socket) => {
  console.log(`New user connected: ${socket.id}`);

  // Handle joining the room
  socket.on("join-room", ({ roomId, userId }) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });

  // Handle custom room for chat
  const customRoom = socket.handshake.query.roomName || uuidV4(); // Use UUID if no roomName provided
  socket.join(customRoom);

  socket.on("sendMessage", ({ use, msg }) => {
    const roomName = use || customRoom;
    socket.to(roomName).emit("recieveMessage", { message: msg });
    console.log(`Message sent to room: ${roomName}`);
  });

  socket.on("leaveRoom", ({ localnumber, status }) => {
    const roomName = String(localnumber);
    io.to(roomName).emit("status", { localnumber, status });
  });

  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
    io.to(customRoom).emit("status", { user: socket.id, status: "offline" });
  });
});

app.use("/user", userRouter);
app.use("/patient", patientRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
