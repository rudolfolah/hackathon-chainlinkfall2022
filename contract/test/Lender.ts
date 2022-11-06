import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lender", function () {
  async function deployLenderFixture() {
    const [deployer] = await ethers.getSigners();

    // Mock Price Feed Contract
    const DECIMALS = "18";
    const INITIAL_PRICE = "200000000000000000000";

    const MockV3AggregatorFactory = await ethers.getContractFactory(
      "MockV3Aggregator"
    );
    const mockV3Aggregator = await MockV3AggregatorFactory.connect(
      deployer
    ).deploy(DECIMALS, INITIAL_PRICE);

    // Mock NFT Contract
    const [, nftContractOwner, ownerOfNft] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory(
      "TestToken",
      nftContractOwner
    );
    const nft = await ContractFactory.deploy();
    await nft.safeMint(ownerOfNft.address);

    const [, , , truflationContractOwner] = await ethers.getSigners();
    // Mock Chainlink
    const MockChainlinkOracleFactory = await ethers.getContractFactory(
      "MockChainlinkOracle"
    );
    const mockChainlinkOracle = await MockChainlinkOracleFactory.connect(
      truflationContractOwner
    ).deploy();

    // Mock Truflation Data Feed
    const MockTruflationDataFeedFactory = await ethers.getContractFactory(
      "MockTruflationClient"
    );
    const mockTruflationDataFeed = await MockTruflationDataFeedFactory.connect(
      truflationContractOwner
    ).deploy();

    const mockChainlinkToken = await MockTruflationDataFeedFactory.connect(
      truflationContractOwner
    ).deploy();

    // Lender Contract
    const Lender = await ethers.getContractFactory("Lender");
    const lender = await Lender.deploy(
      mockChainlinkToken.address,
      mockChainlinkOracle.address,
      mockTruflationDataFeed.address,
      "0"
    );

    return { lender, deployer, nft, nftContractOwner, ownerOfNft };
  }

  describe("Deployment", function () {
    it("sets the correct owner", async function () {
      const { lender, deployer } = await loadFixture(deployLenderFixture);
      expect(await lender.owner()).to.equal(deployer.address);
    });
  });

  describe("Configuration", function () {
    it("updates minimum and maximum bounds of the loan amount", async function () {
      const { lender, deployer, nft, nftContractOwner, ownerOfNft } =
        await loadFixture(deployLenderFixture);
      await lender.setLoanAmountBounds(3, 400);
      expect(await lender.loanAmountMin()).to.equal(3);
      expect(await lender.loanAmountMax()).to.equal(10000);
    });

    it("updates minimum and maximum bounds of the loan interest rate", async function () {
      const { lender, deployer, nft, nftContractOwner, ownerOfNft } =
        await loadFixture(deployLenderFixture);
      await lender.setLoanAmountBounds(1, 10);
    });
  });

  describe("Loan Calculation", function () {
    it("returns 0 loan amount and interest rate if NFT is not owned by the borrower", async function () {
      const { lender, deployer, nft, nftContractOwner, ownerOfNft } =
        await loadFixture(deployLenderFixture);
      const [amount, rate] = await lender.calculateLoan(
        ownerOfNft.address,
        nft.address,
        1
      );
      expect(amount).to.equal(0);
      expect(rate).to.equal(0);
    });

    it("returns loan amount and interest rate within configured range", async function () {
      const { lender, deployer, nft, nftContractOwner, ownerOfNft } =
        await loadFixture(deployLenderFixture);
      await lender.setLoanAmountBounds(1, 10);
      const [amount, rate] = await lender.calculateLoan(
        ownerOfNft.address,
        nft.address,
        1
      );
      expect(amount).to.equal(1);
    });
  });

  describe("Chainlink Oracles Update Loan Configution", function () {
    it("makes request to Truflation", async function () {
      const { lender, deployer, nft, nftContractOwner, ownerOfNft } =
        await loadFixture(deployLenderFixture);
      await lender.requestUpdateLoanConfig();
    });
  });
});
