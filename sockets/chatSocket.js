const { v4: uuidV4 } = require("uuid");
const verifyUser = require("../middlewares/socketAuth/verifyUser");
const { updateChats, saveChats } = require("../controller/chatController");
const chatRouter = require("../routes/chatRouter");

const initChatSocket = (io) => {

    const chatIO = io.of("/chats");

    chatIO.use(verifyUser);

    chatIO.on("connection", (socket) => {
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

        socket.on("sendMessage", async({ use, msg, userType ,userDbId}) => {
            const roomName = use || customRoom;
            socket.to(roomName).emit("recieveMessage", { message: msg });
            console.log(`Message sent to room: ${roomName}`);
           
            await saveChats({ message: msg, userType ,userDbId});

        });

        socket.on("leaveRoom", ({ localnumber, status }) => {
            const roomName = String(localnumber);
            chatIO.to(roomName).emit("status", { localnumber, status });
        });

        socket.on("disconnect", (reason) => {
            console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
            chatIO.to(customRoom).emit("status", { user: socket.id, status: "offline" });
        });
    });
}

module.exports = initChatSocket;