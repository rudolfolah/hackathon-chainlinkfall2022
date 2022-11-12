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
const walletTokenBalances = {};
const walletHighRiskNftHoldings = {};
/*
Based on an examination of some wallet owners of BAYC NFTs, we found some contracts for ERC721 and ERC20 that could be
seen as high risk. We will use this list to increase the risk level of any wallet that owns one of these tokens.

Sources:
- https://etherscan.io/address/0xc883a79e8e4594c4f89434edb754a10da2311139
- https://etherscan.io/address/0x6b92686c40747c85809a6772d0eda8e22a77c60c
 */
const highRiskTokens = [
  "0x59591675E0C85258A917E80c572131a3C257A953",
  "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
  "0xa2690792b61CA1bc5b27Daaab2b750e499EC91e7",
];

const highRiskNfts = [
  "0xDA60730E1feAa7D8321f62fFb069eDd869E57D02",
];

// const history = new provider.getHistory(address);
async function gatherNftTransfers(collectionContractAddress, collectionTokenId) {
  const data = await provider.send("qn_getTransfersByNFT", {
    collection: collectionContractAddress,
    collectionTokenId,
    page: 1,
    perPage: 10,
  });

  for (let transfer of data["transfers"]) {
    let riskLevel = 1;
    const wallet = transfer["from"] === "0x0000000000000000000000000000000000000000" ? transfer["to"] : transfer["from"];
    const walletTokenBalanceResponse = Object.hasOwn(walletTokenBalances, wallet) ? walletTokenBalances[wallet] : await provider.send("qn_getWalletTokenBalance", { wallet });
    // console.log(walletTokenBalanceResponse);
    walletTokenBalances[wallet] = walletTokenBalanceResponse;
    for (let asset of walletTokenBalanceResponse["assets"]) {
      if (highRiskTokens.includes(asset["address"])) {
        riskLevel += 1;
      }
    }

    if (walletHighRiskNftHoldings[wallet] === undefined) {
      const highRiskNftHoldingsResponse = await provider.send("qn_fetchNFTs", {
        wallet,
        contracts: highRiskNfts,
        omitFields: ["provenance", "traits"],
        page: 1,
        perPage: 1,
      });
      // console.log(highRiskNftHoldingsResponse);
      riskLevel += highRiskNftHoldingsResponse["totalItems"];
      walletHighRiskNftHoldings[wallet] = highRiskNftHoldingsResponse;
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
for (let i = 1; i <= 10; i += 1) {
  // BAYC
  await gatherNftTransfers("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", i.toString());
  // Quirklings
  await gatherNftTransfers("0xda60730e1feaa7d8321f62ffb069edd869e57d02", i.toString());
}
