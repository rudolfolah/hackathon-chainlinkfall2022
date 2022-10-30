# Risk Oracle

The training process:
1. data gatherer scrapes data from blockchain transactions
2. data gatherer uploads data to IPFS
3. data processor downloads from IPFS
4. data processor trains TensorFlow AI/ML model on the data
5. data processor uploads trained AI/ML model to IPFS

The prediction process:
1. submit job with wallet address, NFT contract address, and NFT token id
2. data processor downloads trained AI/ML model from IPFS
3. data processor runs the model and predicts and sends prediction result to IPFS
4. data provider downloads prediction result from IPFS
5. data provider caches it and serves it to Chainlink consumers
