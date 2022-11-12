import { ethers } from "ethers";

/* TRAINING */
// Scrape data for training
// const address = "example-address";
const provider = new ethers.providers.JsonRpcProvider({
  url: "https://sleek-skilled-meme.discover.quiknode.pro/26054fa08ab0db026d56020bd457dee6233cc6e0/",
  headers: {
    "x-qn-api-version": 1,
  },
});
// const history = new provider.getHistory(address);
async function gatherNftTransfers(collectionContractAddress, collectionTokenId) {
  const data = await provider.send("qn_getTransfersByNFT", {
    collection: collectionContractAddress,
    collectionTokenId,
    page: 1,
    perPage: 10,
  });

  const highRiskAddresses = [
    "0x59591675E0C85258A917E80c572131a3C257A953",
    "0x4d224452801ACEd8B2F0aebE155379bb5D594381"
  ];

  for (let transfer of data["transfers"]) {
    let riskLevel = 1;
    for (let address of highRiskAddresses) {
      const highRiskResponse = await provider.send("qn_getWalletTokenTransactions", {
        "address": transfer["from"] === "0x0000000000000000000000000000000000000000" ? transfer["to"] : transfer["from"],
        "contract": address,
        "page": 1,
        "perPage": 10,
      });
      console.log(highRiskResponse);
      if (highRiskResponse["totalItems"] > 0) {
        riskLevel += 1;
      }
    }

    const row = [
      transfer["from"],
      collectionContractAddress,
      transfer["to"],
      "__transfer",
      riskLevel,
    ];
    console.log(row.join(","));
  }
}


const CSV_HEADER = "wallet_address,contract_address,target_address,contract_method,risk_level";
console.log(CSV_HEADER);
await gatherNftTransfers("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", "1");
await gatherNftTransfers("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", "2");
