import mongoose from 'mongoose';

const ItemListingSchema = new mongoose.Schema({
  ownerID: {
    type: String,  // reference to User._id
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  images: {
    type: [String],
    default: []
  },
  //buxton change
  category: {
    type: String,
    ref: "Category",
    required: false,
  },
  tags: {
    type: [String],
    default: [],
    required: false
  },
  //
  location: {
    type: {
      type: String,
      enum: ['Point'], // 'location.type' must be 'Point'
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  datePosted: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'Available' // "Available", "InTrade", "Traded", "Deleted"
  },
  views: {
    type: Number,
    default: 0
  },
  tradeProposals: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

export default mongoose.models.ItemListing || mongoose.model('ItemListing', ItemListingSchema);
