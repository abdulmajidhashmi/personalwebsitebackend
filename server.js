const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const dbconnect = require("./config/db.js");
require("dotenv").config();
const PORT = process.env.PORT;
dbconnect();
const mapping = {};

app.use(express.json());
const cors = require("cors");

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
  
  // io.sockets.sockets.forEach(socket => {
  //   socket.disconnect(true);  // Disconnect each socket
  // });
  socket.on("joinRoom", ({selfid,userId}) => {
    mapping[socket.id] = selfid;
    console.log(mapping[socket.id]);
    console.log(userId);
    socket.join(userId);
    console.log(io.sockets.adapter.rooms);
    const status ='online';
    const who =mapping[socket.id];
    const room = io.sockets.adapter.rooms.get(userId);
    if (room && room.size > 1) {
    io.to(userId).emit('status',{who,status});}
   
  });

  

  socket.on("sendMessage", ({ use, msg }) => {

    const message = msg;
    console.log(use, message);
    socket.to(use).emit("recieveMessage", { message });
  });
  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
   console.log(mapping[socket.id]);

   const m = mapping[socket.id];
   const room =String(m);
   const status ="offline";
  //  socket.to(room).emit("status",status);
   const who =mapping[socket.id];
   io.to(room).emit('status',{who,status});
    
    
  });
  socket.on('leaveRoom',({localnumber,status})=>{
console.log('okay');
console.log(localnumber);
localnumber =String(localnumber);
    
    // socket.to(localnumber).emit('status',status);
    const who =mapping[socket.id];
    io.to(localnumber).emit('status',{localnumber,status});
    
  })

});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://personalwebsite-1vr8.onrender.com",
    ], // Allow only this origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"], // Allow all common HTTP methods
    optionsSuccessStatus: 200, // For legacy browsers
  })
);

const userRouter = require("./routes/userRouter.js");

app.use("/user", userRouter);
app.get("/", (req, res) => {
  res.send("hi");
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
