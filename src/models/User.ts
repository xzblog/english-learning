import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  image: {
    type: String,
  },
  provider: {
    type: String,
    enum: ['github', 'google', 'credentials'],
    default: 'credentials',
  },
  password: {
    type: String,
    select: false, // Don't return password by default
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if model is already compiled to prevent overwrite during hot reload
export default mongoose.models.User || mongoose.model('User', UserSchema);
