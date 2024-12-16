const express = require("express");
const app = express();
const {Server} = require('socket.io');
const userSocketMap = {};
const http = require('http');
const server  = http.createServer(app);

const dbconnect = require("./config/db.js");
require("dotenv").config();
const PORT = process.env.PORT;
dbconnect();

app.use(express.json());
const cors = require("cors");

const io = new Server(server,{

  cors:{
    origin:['http://localhost:3000',"https://personalwebsite-omega-two.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  }
});



io.on('connection',(socket)=>{
  

  socket.on('joinRoom',(userId)=>{
   
    console.log(userId);
    socket.join(userId);
     userSocketMap[userId] = socket.id; 
    
    
  })

  socket.on('sendMessage',({touserId,message})=>{
    // console.log(io.sockets.adapter.rooms);

 
      
      const recipientSocketId = userSocketMap[touserId];

    console.log(touserId,message);
    
    

    io.to(recipientSocketId).emit('recieveMessage',{message});

  })

})

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://personalwebsite-omega-two.vercel.app",
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
