import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import dbConnect from '@/lib/db';
import CertificateRequest from '@/models/CertificateRequest';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const requests = await CertificateRequest.find({
        candidateId: session.user.id,
        status: 'pending',
      })
        .populate('organizationId', 'name')
        .populate('certificateId', 'title');

      res.status(200).json({ requests });
    } catch (error) {
      console.error('Request fetch error:', error);
      res.status(500).json({ message: 'Failed to fetch requests' });
    }
  } else if (req.method === 'POST') {
    try {
      const { candidateId, certificateId } = req.body;
      
      const request = await CertificateRequest.create({
        organizationId: session.user.id,
        candidateId,
        certificateId,
      });

      res.status(201).json({ request });
    } catch (error) {
      console.error('Request creation error:', error);
      res.status(500).json({ message: 'Failed to create request' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}