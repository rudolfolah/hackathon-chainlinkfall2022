import React, {useState} from "react";
import { Tabs, TabList, TabPanels, TabPanel, Tab } from "@chakra-ui/react";

import "./App.css";

import { Login } from "./pages/Login";
import {Nfts} from "./pages/Nfts";

export default function App() {
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  if (walletConnected) {
    return (<Login />);
  }

  return (
    <Tabs isFitted={true} variant={"enclosed-colored"}>
      <TabList>
        <Tab>NFTs</Tab>
        <Tab>Loans</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Nfts />
        </TabPanel>
        <TabPanel>
          <h1>Loans</h1>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
