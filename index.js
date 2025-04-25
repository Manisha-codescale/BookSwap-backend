import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import mongoose from "mongoose";
import bookRoute from "./routes/bookRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import chatRoomRoutes from "./routes/chatRoomRoutes.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import Message from "./models/message.js";

//import { initializeApp } from 'firebase-admin/app';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
run().catch(console.dir);

app.use("/api/book", bookRoute);
app.use("/api/users", userRoutes);
app.use("/api/chatrooms", chatRoomRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", async (roomId) => {
    socket.join(roomId);
    console.log(`User with ID: ${socket.id} joined room: ${roomId}`);

    const messages = await Message.find({ roomId }).sort({ timestamp: -1 });
    socket.emit("chat_history", messages);
  });

  socket.on("send_message", async ({ roomId, message, senderId }) => {
    console.log("Message Send");
    const newMessage = new Message({ roomId, senderId, message });
    await newMessage.save();
    

    io.to(roomId).emit("receive_message", {
      message,
      senderId,
      timestamp: newMessage.timestamp,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});