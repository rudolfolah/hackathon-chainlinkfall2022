import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "hardhat-gas-reporter";

const config: HardhatUserConfig = {
    solidity: "0.8.17",
    gasReporter: {
        enabled: true,
        gasPriceApi: "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice",
    },
};

export default config;
