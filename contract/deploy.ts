import { ethers } from "hardhat";

// @see https://hardhat.org/hardhat-runner/docs/guides/deploying
async function main() {
  const Lender = await ethers.getContractFactory("Lender");
  const lender = await Lender.deploy(
    "0x17dED59fCd940F0a40462D52AAcD11493C6D8073",
    "0x17dED59fCd940F0a40462D52AAcD11493C6D8073",
  );
  await lender.deployed();
  console.log(`Lender deployed to ${lender.address}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
