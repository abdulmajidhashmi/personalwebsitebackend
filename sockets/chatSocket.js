const { v4: uuidV4 } = require("uuid");
const verifyUser = require("../middlewares/socketAuth/verifyUser");
const { updateChats, saveChats } = require("../controller/chatController");
const chatRouter = require("../routes/chatRouter");

const initChatSocket = (io) => {

    const chatIO = io.of("/chats");

    chatIO.use(verifyUser);
    const onlineUsers = new Map();

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
        const userId = socket.handshake.query.userId;
        socket.join(customRoom);


        // Store user's socket connection
        onlineUsers.set(userId, socket.id);
        socket.userId = userId; // Store userId on socket for easy access

        console.log(`User ${userId} is now online`);

        // Broadcast to all clients that this user is online
        chatIO.emit('user-status-change', {
            userId: userId,
            status: true
        });

        // Send current online users list to the newly connected user
        const onlineUsersList = Array.from(onlineUsers.keys());
        chatIO.emit('online-users', onlineUsersList);

        socket.on("sendMessage", async ({ use, msg, userType, userDbId, sentAt }) => {
            const roomName = use || customRoom;
            socket.to(roomName).emit("recieveMessage", { text: msg, userType, sentAt });
            console.log(`Message sent to room: ${roomName}`);

            await saveChats({ message: msg, userType, userDbId });
        });

        socket.on("leaveRoom", ({ localnumber, status }) => {
            const roomName = String(localnumber);
            chatIO.to(roomName).emit("status", { localnumber, status });
        });

        socket.on("disconnect", (reason) => {
            console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
            chatIO.emit('user-status-change', {
                userId: userId,
                status: false
            });
            onlineUsers.delete(userId);

        });
    });
}

module.exports = initChatSocket;