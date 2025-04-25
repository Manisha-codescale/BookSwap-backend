import express from 'express';
const messageRoute = express.Router();
import messageSchema from '../models/message.js'
import authenticateFirebase from '../middleware/authMiddleware.js';

// messageRoute.get('/getRoom/useris:', authenticateFirebase, async (req, res) => {
//     try {
//         const { senderID, receiverID } = req.params;
//         const messages = await messageSchema.find({
//             $or: [
//                 { senderID: senderID, receiverID: receiverID },
//                 { senderID: receiverID, receiverID: senderID }
//             ]
//         }).sort({ Timestamp: 1 });
//         res.status(200).json(messages);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// })

// messageRoute.get('/getRooms/:uid', authenticateFirebase, async (req, res) => {
//   try {
//     const { uid } = req.params;

//     const filter = {
//       roomId: { $regex: uid, $options: 'i' } 
//     };

//     const filteredRooms = await messageSchema.find(filter);

//     if (!filteredRooms.length) {
//       return res.status(404).send("No chats found.");
//     }

//     res.status(200).json(filteredRooms);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

messageRoute.get('/getRooms/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const rooms = await messageSchema.aggregate([
      {
        $match: {
          roomId: { $regex: uid }
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: "$roomId",
          lastMessage: { $first: "$message" },
          senderId: { $first: "$senderId" },
          timestamp: { $first: "$timestamp" },
          roomId: { $first: "$roomId" }
        }
      },
      {
        $sort: { timestamp: -1 } 
      }
    ]);

    if (!rooms.length) {
      return res.status(404).send("No chats found.");
    }

    res.status(200).json(rooms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



  export default messageRoute;