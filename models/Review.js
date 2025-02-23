import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reviewedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    notes: {
        type: String,
        default: "User did not provide any notes",
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.review || mongoose.model('review', ReviewSchema)