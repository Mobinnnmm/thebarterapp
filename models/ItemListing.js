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
      enum: ["Point"], 
      default: "Point"
    },
    coordinates: {
      type: [Number], 
      default: [ -79.379, 43.652 ], 
      index: "2dsphere" 
    }
  },
  datePosted: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'Available' // "Aavilable", "InTrade", "Traded", "Deleted"
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

const ItemListing = mongoose.models.ItemListing || mongoose.model('ItemListing', ItemListingSchema);

export default ItemListing;
