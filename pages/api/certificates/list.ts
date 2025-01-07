import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '@/lib/db';
import Certificate from '@/models/Certificate';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await dbConnect();
    const certificates = await Certificate.find({
      candidateId: session.user.id,
    }).populate('issuerId', 'name');

    res.status(200).json({ certificates });
  } catch (error) {
    console.error('Certificate fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch certificates' });
  }
}