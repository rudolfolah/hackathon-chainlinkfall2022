import React from "react";
import {chain, configureChains, createClient, WagmiConfig} from "wagmi";
import {jsonRpcProvider} from "wagmi/providers/jsonRpc";
import {publicProvider} from "wagmi/providers/public";

import "./App.css";
import {Honeypot} from "./Honeypot";

// Configure QuickNode with Polygon Mumbai Testnet
const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygonMumbai],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: "https://maximum-small-hexagon.matic-testnet.discover.quiknode.pro/6093ef65b60c6a7d7e7635c01534aa7afbec5689/",
        webSocket: "wss://maximum-small-hexagon.matic-testnet.discover.quiknode.pro/6093ef65b60c6a7d7e7635c01534aa7afbec5689/",
      }),
    }),
    publicProvider(),
  ],
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

export default function App() {
  // const { address, isConnected } = useAccount();
  // if (!isConnected) {
  //   return (<WagmiConfig client={client}><Login /></WagmiConfig>);
  // }

  return (
    <WagmiConfig client={client}>
      <Honeypot/>
    </WagmiConfig>
  );
}
