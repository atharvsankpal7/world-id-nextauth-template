import { ethers } from "hardhat";

async function main() {
  const CertificateManager = await ethers.getContractFactory("CertificateManager");
  const certificateManager = await CertificateManager.deploy();
  await certificateManager.waitForDeployment();

  console.log("CertificateManager deployed to:", await certificateManager.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });