const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const dbconnect = require("./config/db.js");
require("dotenv").config();
const PORT = process.env.PORT;
dbconnect();


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

 
    console.log(userId);
    

    const rooms = Array.from(socket.rooms);
    if (!rooms.includes(userId)) {
      socket.join(userId);
    }

    console.log(io.sockets.adapter.rooms);
    const status ='online';
    const who = socket.id;
    
    io.to(userId).emit('status',{who,status});



    
   
  });

  

  socket.on("sendMessage", ({ use, msg }) => {
console.log(use);
    const message = msg;
    console.log(use, message);
    // socket.to(use).emit("recieveMessage", { message });

  use=String(use);
      


  if (!io.sockets.sockets.has(use)) {
    console.log(`Sending message to custom room: ${use}`);
    socket.to(use).emit("recieveMessage", { message:msg });
  } else {
    console.log("The provided room name is a default room or invalid.");
  }
     


    
  });
  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
   
   
  
  
   const status ="offline";
  //  socket.to(room).emit("status",status);
   const who =socket.id;
  //  io.to(room).emit('status',{who,status});
    
    
  });
  socket.on('leaveRoom',({localnumber,status})=>{
console.log('okay');
console.log(localnumber);
localnumber =String(localnumber);
    
    // socket.to(localnumber).emit('status',status);
    
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
