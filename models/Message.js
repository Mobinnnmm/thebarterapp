import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;