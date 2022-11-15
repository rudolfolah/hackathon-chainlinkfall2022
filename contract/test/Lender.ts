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
      "TestToken"
    );
    const mockChainlinkOracle = await MockChainlinkOracleFactory.connect(
      truflationContractOwner
    ).deploy();

    // Mock Truflation Data Feed
    const MockTruflationDataFeedFactory = await ethers.getContractFactory(
      "TestToken"
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
      await lender.setLoanAmountBounds(0.003 * 10 ** 10, 9_999 * 10 ** 10);
      expect(await lender.loanAmountMin()).to.equal(0.003 * 10 ** 10);
      expect(await lender.loanAmountMax()).to.equal(10_000 * 10 ** 8);
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
  });

  describe("Interest rate calculation", function () {
    it("returns rate with no risk", async function () {
      const { lender, deployer, nft, nftContractOwner, ownerOfNft } =
        await loadFixture(deployLenderFixture);
      expect(await lender.calculateInterest(1_000, 1_01, 0)).to.equal(1_010);
      expect(await lender.calculateInterest(2 * 10 ** 10, 1_01, 0)).to.equal(
        2.02 * 10 ** 10
      );
    });

    it("returns higher rate based on risk score", async function () {
      const { lender, deployer, nft, nftContractOwner, ownerOfNft } =
        await loadFixture(deployLenderFixture);
      expect(await lender.calculateInterest(1_000, 1_01, 1)).to.equal(1_020);
    });
  });

  // describe("Chainlink Oracles Update Loan Configution", function () {
  //   it("makes request to Truflation", async function () {
  //     const { lender, deployer, nft, nftContractOwner, ownerOfNft } =
  //       await loadFixture(deployLenderFixture);
  //     await lender.requestUpdateLoanConfig();
  //   });
  // });
});
