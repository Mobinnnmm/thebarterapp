import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  proposedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meetingDetails: {
    date: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    instructions: String
  },
  message: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add a pre-save middleware to ensure proposedBy is set
proposalSchema.pre('save', function(next) {
  if (!this.proposedBy) {
    next(new Error('proposedBy is required'));
  }
  next();
});

const tradeSchema = new mongoose.Schema({
  proposerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  proposedItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  targetItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'negotiating', 'completed', 'cancelled'],
    default: 'pending'
  },
  currentProposal: proposalSchema,
  negotiationHistory: [proposalSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps before saving
tradeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Trade || mongoose.model('Trade', tradeSchema); 