import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DheNFT", function () {
  before(async function () {
    this.DheNFT = await ethers.getContractFactory('DheNFT');
  });

  beforeEach(async function () {
    // deploy the contract
    this.dheNFT = await this.DheNFT.deploy();
    await this.dheNFT.deployed();

    // Get the contractOwner and collector address
    const signers = await ethers.getSigners();
    this.contractOwner = signers[0].address;

     // Get the collector contract for signing transaction with collector key
     this.dheNFTNonContractOwner = this.dheNFT.connect(signers[1]);

    // Mint an initial set of NFTs from this collection
    this.initialMintCount = 3;
    this.initialMint = [];
    for (let i = 1; i <= this.initialMintCount; i++) { // tokenId to start at 1
        await this.dheNFT.mintDhenToken();
        this.initialMint.push(i.toString());
    }
  });

  // Test cases
  it('Creates a token collection with a name', async function () {
    expect(await this.dheNFT.name()).to.exist;
    expect(await this.dheNFT.name()).to.equal('DheNFT');
  });
  
  it('Creates a token collection with a symbol', async function () {
    expect(await this.dheNFT.symbol()).to.exist;
    expect(await this.dheNFT.symbol()).to.equal('dpNFT');
  });

  it('Only allows contractOwner to mint NFTs', async function () {
    await expect (this.dheNFTNonContractOwner.mintDhenToken()).to.be.reverted;
  });

  it('Shows correct baseURI for Token URI', async function () {
    expect(await this.dheNFT.tokenURI(1)).to.equal("https://dhenpadilla-nfts.s3.eu-west-1.amazonaws.com/1.json");
  })
  
});
