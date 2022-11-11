import * as dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "hardhat-abi-exporter";

if (!process.env.WALLET_PRIVATE_KEY) {
    process.exit(5);
}

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            { version: "0.8.17" },
            { version: "0.7.0" },
        ],
    },
    gasReporter: {
        enabled: true,
        gasPriceApi: "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice",
    },
    abiExporter: {
      runOnCompile: true,
    },
    networks: {
        mumbai: {
            url: "https://rpc-mumbai.maticvigil.com",
            accounts: [process.env.WALLET_PRIVATE_KEY],
        }
    }
};

export default config;
