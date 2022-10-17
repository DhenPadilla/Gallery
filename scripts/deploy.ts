import { ethers } from "hardhat";

async function main() {
  // Get the contract owner
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contract from: ${deployer.address}`);

  // Hardhat helper to get the ethers contractFactory object
  const DheNFTFactory = await ethers.getContractFactory('DheNFT');

  // Deploy the contract
  console.log('Deploying DheNFT...');
  const dheNFTContract = await DheNFTFactory.deploy();
  await dheNFTContract.deployed();
  console.log(`DheNFT deployed to: ${dheNFTContract.address}`)


  // Load the marketplace
  const DheNFTMarketplaceFactory = await ethers.getContractFactory('DheNFTMarketplace');

  // Deploy the marketplace
  const dheNFTMarketplaceContract = await DheNFTMarketplaceFactory.deploy();
  await dheNFTMarketplaceContract.deployed();

  // Log the address of the new contract
  console.log("NFT Marketplace deployed to:", dheNFTMarketplaceContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
