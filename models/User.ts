import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  worldId: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['issuer', 'candidate', 'organization'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);