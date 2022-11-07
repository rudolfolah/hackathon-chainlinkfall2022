import { promises as fsPromises } from "fs";
import { ethers, network } from "hardhat";

async function loadExportedContractAbi(contractAbiPath: string) {
  return fsPromises.readFile(contractAbiPath);
}

// @see https://hardhat.org/hardhat-runner/docs/guides/deploying
async function main() {
  const owner = await ethers.getSigner(<string>network.config.from);

  // Deploy the Lender contract
  const Lender = await ethers.getContractFactory("Lender");
  const lender = await Lender.deploy(
    // chainlink token
    // https://docs.chain.link/docs/link-token-contracts/
    "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    // chainlink oracle
    // https://docs.chain.link/docs/any-api/testnet-oracles/
    "0x40193c8518BB267228Fc409a613bDbD8eC5a97b3",
    // truflation oracle id
    "0x6D141Cf6C43f7eABF94E288f5aa3f23357278499",
    // truflation job id
    "d220e5e687884462909a03021385b7ae",
  );
  await lender.deployed();

  // Deploy the ERC20 contract
  const Token = await ethers.getContractFactory("HoneypotPrototypeToken");
  const token = await Token.deploy(lender.address);
  await token.deployed();
  await lender.allowTokens(token.address);

  // Deploy the ERC721 contract
  const Nft = await ethers.getContractFactory("HoneypotNft");
  const nft = await Nft.deploy();
  await nft.deployed();
  await lender.allowNfts(nft.address);

  console.log(`Token deployed to ${token.address}`);
  console.log(`NFT deployed to ${nft.address}`);
  console.log(`Lender deployed to ${lender.address}`);
  console.log("Go to https://faucet.polygon.technology/ and send LINK to the smart contract and your wallet");
  const frontendContractConfigPath = "../frontend/src/contract.ts";
  const frontendContractConfigFileHandle = await fsPromises.open(frontendContractConfigPath, "w");
  // Contract addresses
  await frontendContractConfigFileHandle.write(`export const tokenContractAddress = "${token.address}";\n`);
  await frontendContractConfigFileHandle.write(`export const nftContractAddress = "${nft.address}";\n`);
  await frontendContractConfigFileHandle.write(`export const contractAddress = "${lender.address}";\n`);

  // Contract ABIs
  const tokenContractAbiData = await loadExportedContractAbi("./abi/contracts/HoneypotPrototypeToken.sol/HoneypotPrototypeToken.json");
  await frontendContractConfigFileHandle.write("export const tokenContractAbi = ");
  await frontendContractConfigFileHandle.write(tokenContractAbiData.slice(0, tokenContractAbiData.length - 1));
  await frontendContractConfigFileHandle.write(" as const;\n");

  const nftContractAbiData = await loadExportedContractAbi("./abi/contracts/HoneypotNft.sol/HoneypotNft.json");
  await frontendContractConfigFileHandle.write("export const nftContractAbi = ");
  await frontendContractConfigFileHandle.write(nftContractAbiData.slice(0, nftContractAbiData.length - 1));
  await frontendContractConfigFileHandle.write(" as const;\n");

  const contractAbiData = await loadExportedContractAbi("./abi/contracts/Lender.sol/Lender.json");
  await frontendContractConfigFileHandle.write("export const contractAbi = ");
  await frontendContractConfigFileHandle.write(contractAbiData.slice(0, contractAbiData.length - 1));
  await frontendContractConfigFileHandle.write(" as const;\n");

  await frontendContractConfigFileHandle.close()
  console.log("Copied contract addresses and ABIs to frontend");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
