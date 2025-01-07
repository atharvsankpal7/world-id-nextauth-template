import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import dbConnect from '@/lib/db';
import CertificateRequest from '@/models/CertificateRequest';
import { ethers } from 'ethers';
import CertificateManager from '@/contracts/CertificateManager.json';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      await dbConnect();
      const request = await CertificateRequest.findById(id)
        .populate('certificateId');

      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      if (request.status !== 'pending') {
        return res.status(400).json({ message: 'Request already processed' });
      }

      const { status } = req.body;
      request.status = status;
      await request.save();

      if (status === 'approved') {
        // Update blockchain
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL);
        const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY!, provider);
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
          CertificateManager.abi,
          wallet
        );

        await contract.grantAccess(
          request.certificateId.blockchainHash,
          request.organizationId
        );
      }

      res.status(200).json({ request });
    } catch (error) {
      console.error('Request update error:', error);
      res.status(500).json({ message: 'Failed to update request' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}