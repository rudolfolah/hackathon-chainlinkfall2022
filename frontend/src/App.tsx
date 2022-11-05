import React, {useState} from "react";
import {chain, configureChains, createClient, WagmiConfig, useAccount} from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import {Center, Tabs, TabList, TabPanels, TabPanel, Tab, Badge, Text, Heading} from "@chakra-ui/react";

import "./App.css";

import { Login } from "./pages/Login";
import { Nfts } from "./pages/Nfts";
import {Loans} from "./pages/Loans";
import {SettingsIcon} from "@chakra-ui/icons";
import {Settings} from "./pages/Settings";

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
      <Tabs isFitted={true} size={"lg"} variant={"enclosed-colored"}>
        <Center>
          <Heading>HONEYPOT</Heading>
        </Center>
        <TabList>
          <Tab flex={4}><Text as={"b"}>NFTs</Text> <Badge colorScheme="green">5+</Badge></Tab>
          <Tab flex={4}><Text as={"b"}>Loans</Text> <Badge colorScheme="red">1</Badge></Tab>
          <Tab><SettingsIcon /></Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Nfts />
          </TabPanel>
          <TabPanel>
            <Loans />
          </TabPanel>
          <TabPanel>
            <Settings />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </WagmiConfig>
  );
}
