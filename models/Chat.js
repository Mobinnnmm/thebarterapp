import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    proposer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    proposee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemListing',
        required: true,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    lastMessage: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default Chat;