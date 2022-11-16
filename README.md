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

For publishing, the frontend can be built by running `npm run-script build`. After building the `frontend/dist` is moved to `./docs` which is hosted on GitHub Pages and can be accessed here: https://hackathon-chainlinkfall2022.github.io/

### 3. Risk Oracle
Run the risk oracle by going into the `riskoracle` directory and running `npm start`. This URL needs a domain name so that it can be accessed by the Chainlink nodes.

For testing purposes you should be able to go to http://localhost:8080/ and see a JSON response that contains a `riskScore` field. You can supply the `?a=some_address_here` as a query parameter to see what the risk score for that wallet address is.

#### Training the Risk Oracle Machine Learning Model
- You will need a QuickNode endpoint to Ethereum or Polygon chains.
- You will need [bacalhau working locally](https://docs.bacalhau.org/getting-started/installation) 

Train the model:

```shell
npm install
# Get the data from the blockchain and process it into a CSV file
npm run-script gather
npm run-script train
````

When running `index.js` through `npm start`, the model will be downloaded from IPFS.

##### Train the model through Bacalhau
```shell
bacalhau version
bacalhau docker run --rm \
  -v ./:/inputs \
  -v ./:/outputs \
  node:16-alpine \
    sh -c "npm install && npm run-script train"
```

The model is trained through Bacalhau and the trained model is saved and uploaded to IPFS.


# Documentation and Marketing

[Architecture and System Design](./Architecture%20and%20System%20Design%20-%20HONEYBEE%20LOANS.pdf)

![App advertisement](./App%20ad%20-%20HONEYBEE%20LOANS.png)

![Google Play Store advertisement](./Play%20store%20-%20NFT%20Loans.png)
