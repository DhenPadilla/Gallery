import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { parseEther } from "ethers/lib/utils";

describe("DheNFTMarketplace", function () {
  before(async function () {
    this.DheNFT = await ethers.getContractFactory('DheNFT');
    this.DheNFTMarketplace = await ethers.getContractFactory('DheNFTMarketplace');
  });

  beforeEach(async function () {
    // deploy the DheNFT Contract
    this.dheNFT = await this.DheNFT.deploy();
    await this.dheNFT.deployed();

    // deploy the DheNFT Contract
    this.dheNFTMarketplace = await this.DheNFTMarketplace.deploy();
    await this.dheNFTMarketplace.deployed();

    // Get the contractOwner and collector address
    const signers = await ethers.getSigners();
    this.contractOwner = signers[0].address;

     // Get the collector contract for signing transaction with collector key
    this.dheNFTNonContractOwner = signers[1];

    // Mint an initial set of NFTs from this collection
    this.initialMintCount = 3;
    this.initialMint = [];
    for (let i = 1; i <= this.initialMintCount; i++) { // tokenId to start at 1
        await this.dheNFT.mintDhenToken();
        this.initialMint.push(i.toString());
        // Approve all minted tokens on Marketplace
        this.dheNFT.approve(this.dheNFTMarketplace.address, i);
    }
  });

  // Test cases
  it('Creating a listing fails if marketplace is not approved', async function () {
    await this.dheNFT.setApprovalForAll(this.dheNFTMarketplace.address, false);
    try {
      await this.dheNFTMarketplace.createListing(this.dheNFT.address, 1, parseEther("100"));
    } catch (error) { 
      expect(error).to.eq("Dhen has not approved this listing of his NFT");
    }
  });  

  it('Can list a token collection with a price', async function () {
    await expect (this.dheNFTMarketplace.createListing(this.dheNFT.address, 1, parseEther("100")))
    .to
    .emit(this.dheNFTMarketplace, "ListingCreated")
    .withArgs(this.dheNFT.address, 1, parseEther("100"), this.contractOwner);
  });

  it('Can update a token price', async function() {
    await this.dheNFTMarketplace.createListing(this.dheNFT.address, 1, parseEther("100"))
    await expect (this.dheNFTMarketplace.updateListing(this.dheNFT.address, 1, parseEther("120")))
    .to
    .emit(this.dheNFTMarketplace, "ListingUpdated")
    .withArgs(this.dheNFT.address, 1, parseEther("120"), this.contractOwner);
  });

  it('Can cancel a listing', async function() {
    await this.dheNFTMarketplace.createListing(this.dheNFT.address, 1, parseEther("100"))
    await expect (this.dheNFTMarketplace.cancelListing(this.dheNFT.address, 1))
    .to
    .emit(this.dheNFTMarketplace, "ListingCancelled")
    .withArgs(this.dheNFT.address, 1, this.contractOwner);
  });

  it('A listing can be bought with correct funds', async function() {
    await this.dheNFTMarketplace.createListing(this.dheNFT.address, 1, parseEther("100"))
    
    await expect(this.dheNFTMarketplace.connect(this.dheNFTNonContractOwner).purchaseListing(
      this.dheNFT.address, 
      1, 
      {
        value: parseEther("100"),
      }
    )).to
    .emit(this.dheNFTMarketplace, "ListingPurchased")
    .withArgs(this.dheNFT.address, 1, this.contractOwner, this.dheNFTNonContractOwner.address);
    
    const newOwner = await this.dheNFT.ownerOf(1);
    expect(newOwner).to.eq(this.dheNFTNonContractOwner.address);
  });

  it('A listing cannot be bought with incorrect funds', async function() {
    await this.dheNFTMarketplace.createListing(this.dheNFT.address, 1, parseEther("100"))
    
    await expect(this.dheNFTMarketplace.connect(this.dheNFTNonContractOwner).purchaseListing(this.dheNFT.address, 1, 
      {
        value: parseEther("80"),
      }
    )).to.be.revertedWith("That is the incorrect funds");
  });
});