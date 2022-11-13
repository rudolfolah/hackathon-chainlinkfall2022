# HONEYBEE LOANS

DeFi lending protocol for NFTs using Chainlink Oracles on Polygon. Deposit NFTs as collateral to borrow ERC20 tokens.

Team:
- Natalja
- Rudolf

## Running the Code
Directory structure:
- `contract`: lending protocol smart contract code written in Solidity, works with Truflation NFT Index using Chainlink Data Feeds
- `frontend`: React web app that interacts with the contract
- `riskoracle`: data gathering and processing Chainlink oracle using IPFS, Bacalhau and QuickNode

### 1. Contract Deployment
1. go into the `contract` directory
2. run `npm install`
3. run `npm run-script deploy`

*Note: You may need to update the risk oracle URL in the `deploy.js` file to a publicly accessible URL if you are trying to test a locally running copy.*

This will deploy the test tokens and test NFT, and deploy the lending protocol contract. The contract address will be printed out.

After deploying the contracts to Polygon testnet, you can [get LINK tokens from the testnet faucet](https://faucets.chain.link/).

### 2. Frontend
Run the frontend by going into the `frontend` directory and running `npm start`.

Access it at http://localhost:3000

### 3. Risk Oracle
Run the risk oracle by going into the `riskoracle` directory and running `npm start`. This URL needs a domain name so that it can be accessed by the Chainlink nodes.

For testing purposes you should be able to go to http://localhost:8080/ and see a JSON response that contains a `riskScore` field. You can supply the `?a=some_address_here` as a query parameter to see what the risk score for that wallet address is.

# Documentation and Marketing

[Architecture and System Design](./Architecture%20and%20System%20Design%20-%20HONEYBEE%20LOANS.pdf)

![App advertisement](/Users/rudolfo/Workspace/hackathon-chainlinkfall2022/App ad - HONEYBEE LOANS.png)

![Google Play Store advertisement](/Users/rudolfo/Workspace/hackathon-chainlinkfall2022/Play store - NFT Loans.png)
