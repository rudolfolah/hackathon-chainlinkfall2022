import { promises as fsPromises } from "fs";
import { ethers, network } from "hardhat";


// @see https://hardhat.org/hardhat-runner/docs/guides/deploying
async function main() {
  const owner = await ethers.getSigner(<string>network.config.from);

  // Deploy the Oracle contract
  const Operator = await ethers.getContractFactory("Operator");
  const operator = await Operator.deploy(
    // chainlink token
    // https://docs.chain.link/docs/link-token-contracts/
    "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    // owner
    "0x8aa6013Ec2BAbE20dabF27149d8A20102B3F8062",
  );
  await operator.deployed();

  console.log(`Oracle deployed to ${operator.address}`);
  console.log("Go to https://faucet.polygon.technology/ and send LINK to the smart contract and your wallet");
  console.log("Go to https://naas.link/ and login to your testnet chainlink node and use the above Oracle address in a new job id")
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
