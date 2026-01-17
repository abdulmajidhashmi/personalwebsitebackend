const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const dbconnect = require("./config/db.js");
const userRouter = require("./routes/userRouter.js");
const patientRouter = require("./routes/patientRouter.js");
const chatRouter = require("./routes/chatRouter.js");
const cookieParser = require('cookie-parser');
const initChatSocket = require('./sockets/chatSocket.js')

dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
dbconnect();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:4020",
    "https://personalwebsite-1vr8.onrender.com",
    "https://zahidhashmi.centralindia.cloudapp.azure.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:4020",
      "https://personalwebsite-1vr8.onrender.com",
      "https://zahidhashmi.centralindia.cloudapp.azure.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    credentials: true,
  },
});

initChatSocket(io);
app.use("/user", userRouter);
app.use("/patient", patientRouter);
app.use("/chat", chatRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
