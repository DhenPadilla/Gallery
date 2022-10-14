import { ethers } from "hardhat";

async function main() {
  // Get the contract owner
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contract from: ${deployer.address}`);

  // Hardhat helper to get the ethers contractFactory object
  const DheNFT = await ethers.getContractFactory('DheNFT');

  // Deploy the contract
  console.log('Deploying DheNFT...');
  const dheNFTToken = await DheNFT.deploy();
  await dheNFTToken.deployed();
  console.log(`DheNFT deployed to: ${dheNFTToken.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
