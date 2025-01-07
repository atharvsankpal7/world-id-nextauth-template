import mongoose from 'mongoose';

const CertificateRequestSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.CertificateRequest || mongoose.model('CertificateRequest', CertificateRequestSchema);