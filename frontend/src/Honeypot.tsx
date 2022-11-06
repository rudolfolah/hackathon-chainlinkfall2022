import {useAccount, useConnect} from "wagmi";
import {Badge, Center, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react";
import {SettingsIcon} from "@chakra-ui/icons";
import {Nfts} from "./pages/Nfts";
import {Loans} from "./pages/Loans";
import {Settings} from "./pages/Settings";
import React from "react";
import {Login} from "./pages/Login";

export function Honeypot() {
  const { address, isConnected } = useAccount();
  if (!isConnected) {
    return (<Login />);
  }

  return <Tabs isFitted={true} size={"lg"} variant={"enclosed-colored"}>
    <Center>
      <Heading>HONEYPOT</Heading>
    </Center>
    <TabList>
      <Tab flex={4}><Text as={"b"}>NFTs</Text> <Badge colorScheme="green">5+</Badge></Tab>
      <Tab flex={4}><Text as={"b"}>Loans</Text> <Badge colorScheme="red">1</Badge></Tab>
      <Tab><SettingsIcon/></Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <Nfts/>
      </TabPanel>
      <TabPanel>
        <Loans/>
      </TabPanel>
      <TabPanel>
        <Settings/>
      </TabPanel>
    </TabPanels>
  </Tabs>;
}
