import express from 'express';
import chat from '../models/chat.js';  

const chatrouter = express.Router();

chatrouter.post('/sendMessage', async (req, res) => {
    try {
        const { senderID, receiverID, message } = req.body;
        const newChat = new chat({ senderID, receiverID, message });
        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

chatrouter.get('/threads/:userId', async (req, res) => {
    const { userId } = req.params;

    const threads = await chat.aggregate([
        {
            $match: {
                $or: [
                    { senderID: userId },
                    { receiverID: userId }
                ]
            }
        },
        {
            $group: {
                _id: {
                    $cond: [
                        { $eq: ["$senderID", userId] },
                        "$receiverID",
                        "$senderID"
                    ]
                },
                lastMessage: { $last: "$message" },
                lastTime: { $last: "$Timestamp" }
            }
        },
        {
            $sort: { lastTime: -1 }
        }
    ]);

    res.json(threads);
});

chatrouter.get('/getChatHistory/:user1/:user2', async (req, res) => {
    const { user1, user2 } = req.params;

    const chatHistory = await chat.find({
        $or: [
            { senderID: user1, receiverID: user2 },
            { senderID: user2, receiverID: user1 }
        ]
    }).sort({ Timestamp: 1 });

    res.json(chatHistory);
});

export default chatrouter;