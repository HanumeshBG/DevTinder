const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");


const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash('sha256').update([userId, targetUserId].sort().join("_")).digest('hex');
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: 'http://localhost:5173'
        }
    })

    io.on('connection', (socket) => {
        // handle socket events here
        socket.on("joinChat", ({firstName, userId, targetUserId}) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            console.log(firstName + " joined room: " + roomId)

            socket.join(roomId)
        })
        
        socket.on("sendMessage", async ({firstName, lastName, userId, targetUserId, text}) => {
            try{
                const roomId = getSecretRoomId(userId, targetUserId);
                console.log("Message received: " + text + " in room: " + roomId)

                let chat = await Chat.findOne({ participents: { $all: [userId, targetUserId] } });
                if(!chat){
                    chat = new Chat({
                        participents:[userId, targetUserId],
                        messages: []
                    })
                }

                chat.messages.push({ senderId: userId, text });
                await chat.save();

                io.to(roomId).emit("messageReceived",{firstName, lastName, text})

            } catch(err) {
                console.error("Error on sending message: " + err.message);
            }
        })

        socket.on("disconnect", () => {})
    })
}

module.exports = initializeSocket