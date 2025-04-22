//import { Timestamp } from "firebase-admin/firestore";
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    senderID: {
        type: String,
        required: true
    },
    receiverID: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    Timestamp: {
        type: Date,
        default: Date.now
    },
});

const chat = mongoose.model("chat", chatSchema);
export default chat;
