import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema( {
    userID: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    dateSent: {
        type: Date,
        default: Date.now,
    },
    isRead: {
        type: Boolean,
        default: false,
    }
})

const Notification = mongoose.models?.Notification || mongoose.model('Notification', notificationSchema);
// fixed
export default Notification;


