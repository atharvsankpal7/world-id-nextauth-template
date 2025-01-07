import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
  issuerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  issueDate: {
    type: Date,
    default: Date.now,
  },
  blockchainHash: {
    type: String,
    required: true,
  },
  metadata: {
    type: Map,
    of: String,
  },
});

export default mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);