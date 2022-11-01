import { open } from "node:fs/promises";
import * as IPFS from "ipfs-core";
import tf from "@tensorflow/tfjs-node";
import { ethers } from "ethers";

const ipfs = await IPFS.create();

/* TRAINING */
// Scrape data for training
// const address = "example-address";
// const provider = new ethers.providers.EtherscanProvider();
// const history = new provider.getHistory(address);

// Definition of the machine learning model
const model = tf.sequential();
model.add(tf.layers.dense({ activation: "relu", inputShape: [4], units: 200 }));
model.add(tf.layers.dense({ activation: "relu", units: 130 }));
model.add(tf.layers.dense({ activation: "relu", units: 100 }));
model.add(tf.layers.dense({ activation: "softmax", units: 2 }));
model.compile({
  loss: "sparseCategoricalCrossentropy",
  metrics: ["accuracy"],
  optimizer: tf.train.adam()
});

// Data fields:
// - wallet address: string
// - contract address: string
// - target address: string
// - contract method: string
// - risk level: float, 0.0 to 1.0

// Load data for training the model
function transformCsvData({ xs, ys }) {
  const values = [
    xs.wallet_address,
    xs.contract_address,
    xs.target_address,
    xs.contract_method,
  ];
  return {
    xs: values,
    ys: ys.risk_level,
  };
}
const trainingData = tf.data.csv("file://./example.csv", {
  columnConfigs: {
    risk_level: {
      isLabel: true,
    },
  },
}).map(transformCsvData).batch(10);

// Train the model
model.fitDataset(trainingData, { epochs: 2 });

// Upload trained model to IPFS
model.save("file://./uploaded-trained-model");
for await (const file of ipfs.addAll([
  "./uploaded-trained-model/model.json",
  "./uploaded-trained-model/weights.bin",
], { wrapWithDirectory: true })) {
  console.dir(file);
  console.log(`uploaded ${file.path} (${file.size}) to ${file.cid}`);
}

/* PREDICTION AND ADDITIONAL TRAINING */
// Download trained model from IPFS

// Load the model
// model = tf.loadLayersModel("file://./downloaded-trained-model");

// Run the model through bacalhau

// Upload prediction results to IPFS

// Download prediction results from IPFS
