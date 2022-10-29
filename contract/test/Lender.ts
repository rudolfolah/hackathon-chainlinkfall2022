import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lender", function() {
  async function deployLenderFixture() {
    const [owner] = await ethers.getSigners();
    const Lender = await ethers.getContractFactory("Lender");
    const lender = await Lender.deploy();
    return { lender, owner };
  }

  describe("Deployment", function() {
    it("sets the correct owner", async function() {
      const { lender, owner } = await loadFixture(deployLenderFixture);
      expect(await lender.owner()).to.equal(owner.address);
    });
  });
});
