import { ethers } from "hardhat";

async function main() {
  // Get the contract owner
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contract from: ${deployer.address}`);

  // Hardhat helper to get the ethers contractFactory object
  const DhenNFT = await ethers.getContractFactory('DhenNFT');

  // Deploy the contract
  console.log('Deploying DhenNFT...');
  const dhenNFTToken = await DhenNFT.deploy();
  await dhenNFTToken.deployed();
  console.log(`DhenNFT deployed to: ${dhenNFTToken.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
