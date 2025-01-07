import { ethers } from 'ethers';
import CertificateManager from '../contracts/CertificateManager.json';

export class BlockchainService {
  private contract: ethers.Contract;
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL);
    this.signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY!, this.provider);
    this.contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      CertificateManager.abi,
      this.signer
    );
  }

  async issueCertificate(certificateId: string, candidateId: string, metadata: string) {
    const tx = await this.contract.issueCertificate(
      ethers.id(certificateId),
      ethers.id(candidateId),
      metadata
    );
    return await tx.wait();
  }

  async grantAccess(certificateId: string, organizationAddress: string) {
    const tx = await this.contract.grantAccess(
      ethers.id(certificateId),
      organizationAddress
    );
    return await tx.wait();
  }

  async revokeAccess(certificateId: string, organizationAddress: string) {
    const tx = await this.contract.revokeAccess(
      ethers.id(certificateId),
      organizationAddress
    );
    return await tx.wait();
  }

  async verifyCertificate(certificateId: string) {
    return await this.contract.verifyCertificate(ethers.id(certificateId));
  }
}

export const blockchainService = new BlockchainService();