import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lender", function () {
  async function deployLenderFixture() {
    const [owner] = await ethers.getSigners();
    const Lender = await ethers.getContractFactory("Lender");
    const lender = await Lender.deploy();
    return { lender, owner };
  }

  async function deployERC721Fixture() {
    // const nftContractOwner = await ethers.Wallet.createRandom();
    // nftContractOwner.connect(ethers.provider);
    // const ContractFactory = await ethers.getContractFactory("TestToken");
    // const signer = ethers.provider.getSigner(nftContractOwner.address);
    // const nft = await ContractFactory.connect(signer).deploy();

    const mockV3AggregatorFactory = await ethers.getContractFactory(
      "MockV3Aggregator"
    );
    const mockV3Aggregator = await mockV3AggregatorFactory
      .connect(deployer)
      .deploy(DECIMALS, INITIAL_PRICE);

    // Mock NFT Contract
    const [_, nftContractOwner, ownerOfNft] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("TestToken", nftContractOwner);
    const nft = await ContractFactory.deploy();
    await nft.safeMint(ownerOfNft.address);
    return { nft, nftContractOwner, ownerOfNft };
  }

  describe("Deployment", function () {
    it("sets the correct owner", async function () {
      const { lender, owner } = await loadFixture(deployLenderFixture);
      expect(await lender.owner()).to.equal(owner.address);
    });
  });

  describe("Loan Calculation", function () {
    it("returns 0 loan amount and interest rate if NFT is not owned by the borrower", async function () {
      const { nft, nftContractOwner, ownerOfNft } = await loadFixture(deployERC721Fixture);
      const { lender, owner } = await loadFixture(deployLenderFixture);
      await lender.calculateLoan(ownerOfNft.address, nft.address, 1);
    });
  });
});
