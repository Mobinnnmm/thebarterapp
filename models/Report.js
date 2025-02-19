import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
    reportType: {
        type: String, 
        enum: ["user", "listing"],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    reportedByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    targetItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ItemListing",
        required: true,
    },
    targetUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Report || mongoose.model('Report', ReportSchema)