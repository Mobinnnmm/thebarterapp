import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  phoneNumber: String,
  profilePicture: String,
  address: String,
  aboutMe: String,
  rating: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  tradeHistory: {
    type: [String],
    default: []
  },
  ongoingTrades: {
    type: [String],
    default: []
  },
  notifications: {
    type: [String],
    default: []
  },
  supportTickets: {
    type: [String],
    default: []
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  // New field: track user’s own items
  listedItems: {
    type: [String], // array of ItemListing IDs
    default: []
  },
  favourites: {
    type: [String],
    default: []
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
