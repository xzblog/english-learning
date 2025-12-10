import mongoose from 'mongoose';

const StudyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dailyGoal: {
    type: Number,
    required: true,
  },
  targetLevel: {
    type: String,
    enum: ['junior', 'senior', 'all'],
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active',
  },
});

export default mongoose.models.StudyPlan || mongoose.model('StudyPlan', StudyPlanSchema);
