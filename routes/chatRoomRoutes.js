// routes/chatRoomRoutes.js
import express from "express";
import mongoose from "mongoose";
import Message from "../models/message.js";
import User from "../models/user.js";

const router = express.Router();

router.get("/:userId/rooms", async (req, res) => {
    console.log("getChatRooms route hit");
  try {
    const { userId } = req.params;
    
    const uniqueRooms = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { roomId: { $regex: userId } }
          ]
        }
      },
      {
        $group: {
          _id: "$roomId",
          lastMessageDate: { $max: "$timestamp" }
        }
      },
      {
        $sort: { lastMessageDate: -1 }
      }
    ]);

    const chatRooms = await Promise.all(
      uniqueRooms.map(async (room) => {
        const roomId = room._id;
        
        const userIds = roomId.split('_');
        const otherUserId = userIds[0] === userId ? userIds[1] : userIds[0];
        
        const otherUser = await User.findOne({ firebaseUid: otherUserId });
   
        const lastMessage = await Message.findOne({ roomId })
          .sort({ timestamp: -1 })
          .limit(1);
        
        return {
          roomId,
          otherUserId,
          otherUserName: otherUser ? otherUser.name : "Unknown User",
          otherUserImage: otherUser ? otherUser.profileImage : "",
          lastMessage: lastMessage ? lastMessage.message : "",
          timestamp: lastMessage ? lastMessage.timestamp : null,
          unreadCount: 0 
        };
      })
    );
    
    res.status(200).json(chatRooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;