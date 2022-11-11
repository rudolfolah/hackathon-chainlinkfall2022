import React from "react";
import {useAccount, useConnect} from "wagmi";
import {Badge, Center, Heading, Icon, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react";
import {RiSettings5Fill} from "react-icons/ri";

import {Nfts} from "./pages/Nfts";
import {Loans} from "./pages/Loans";
import {Settings} from "./pages/Settings";
import {Login} from "./pages/Login";

export function Honeypot() {
  const { address, isConnected } = useAccount();
  if (isConnected) {
    return (<Login />);
  }

  return <Tabs isFitted={true} size={"lg"} variant={"enclosed-colored"}>
    {/*<Center>*/}
    {/*  <Heading>HONEYPOT</Heading>*/}
    {/*</Center>*/}
    <TabList>
      <Tab flex={7}><Text as={"b"}>NFT Portfolio</Text> <Badge colorScheme="green">5+</Badge></Tab>
      <Tab flex={4}><Text as={"b"}>Loans</Text> <Badge colorScheme="red">1</Badge></Tab>
      <Tab><Icon as={RiSettings5Fill} /></Tab>
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
