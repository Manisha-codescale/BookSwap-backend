import chat from "./models/chat.js";

socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    const createMessage = new chat({ senderId, receiverId, message });
    await createMessage.save(); 

    io.emit("receiveMessage", { senderId, receiverId, message });
});
