import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '@/lib/db';
import Certificate from '@/models/Certificate';
import User from '@/models/User';
import { blockchainService } from '@/lib/blockchain';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user?.role !== 'issuer') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await dbConnect();
    const { candidateId, title, description } = req.body;

    // Verify candidate exists
    const candidate = await User.findOne({ worldId: candidateId, role: 'candidate' });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Create metadata
    const metadata = {
      title,
      description,
      issueDate: new Date().toISOString(),
      issuerId: session.user.id,
    };

    // Issue on blockchain
    const receipt = await blockchainService.issueCertificate(
      candidateId,
      candidate.worldId,
      JSON.stringify(metadata)
    );

    // Store in MongoDB
    const certificate = await Certificate.create({
      issuerId: session.user.id,
      candidateId: candidate._id,
      title,
      description,
      blockchainHash: receipt.hash,
      metadata: metadata,
    });

    res.status(201).json({ certificate });
  } catch (error) {
    console.error('Certificate issuance error:', error);
    res.status(500).json({ message: 'Failed to issue certificate' });
  }
}