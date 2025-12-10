import mongoose from 'mongoose';

const WordProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  wordId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['new', 'learning', 'reviewing', 'mastered'],
    default: 'new',
  },
  correctCount: {
    type: Number,
    default: 0,
  },
  wrongCount: {
    type: Number,
    default: 0,
  },
  lastReviewedAt: {
    type: Date,
    default: Date.now,
  },
  nextReviewAt: {
    type: Date,
  },
  learnedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure a user only has one progress record per word
WordProgressSchema.index({ userId: 1, wordId: 1 }, { unique: true });

export default mongoose.models.WordProgress || mongoose.model('WordProgress', WordProgressSchema);
