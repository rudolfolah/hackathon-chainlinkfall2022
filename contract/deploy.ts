import { promises as fsPromises } from "fs";
import { ethers } from "hardhat";

// @see https://hardhat.org/hardhat-runner/docs/guides/deploying
async function main() {
  const Lender = await ethers.getContractFactory("Lender");
  const lender = await Lender.deploy(
    // chainlink token
    // https://docs.chain.link/docs/link-token-contracts/
    "0x40193c8518BB267228Fc409a613bDbD8eC5a97b3",
    // chainlink oracle
    // https://docs.chain.link/docs/any-api/testnet-oracles/
    "0x40193c8518BB267228Fc409a613bDbD8eC5a97b3",
    // truflation oracle id
    "0x6D141Cf6C43f7eABF94E288f5aa3f23357278499",
    // truflation job id
    "d220e5e687884462909a03021385b7ae",
  );
  await lender.deployed();
  console.log(`Lender deployed to ${lender.address}`);
  console.log("Go to https://faucet.polygon.technology/ and send LINK and MATIC to the smart contract");
  const frontendContractConfigPath = "../frontend/src/contract.ts";
  const frontendContractConfigFileHandle = await fsPromises.open(frontendContractConfigPath, "w");
  await frontendContractConfigFileHandle.write(`export const contractAddress = "${lender.address}";\n`);
  const contractAbiPath = "./abi/contracts/Lender.sol/Lender.json";
  const contractAbiData = await fsPromises.readFile(contractAbiPath);
  await frontendContractConfigFileHandle.write("export const contractAbi = ");
  await frontendContractConfigFileHandle.write(contractAbiData);
  await frontendContractConfigFileHandle.write(";\n");
  await frontendContractConfigFileHandle.close()
  console.log("Copied contract address and ABI to frontend");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
