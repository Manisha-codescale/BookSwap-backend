import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  roomId: {
    type: String,
  },
  senderId: {
    type: String,
  },
  message: {
    type: String,
  },
  timestamp: {
    type: Date, 
    default: Date.now
  },
});

const message = mongoose.model("message", messageSchema);
export default message;
