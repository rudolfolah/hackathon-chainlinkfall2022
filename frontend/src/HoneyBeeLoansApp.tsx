import React, {useMemo} from "react";
import {useAccount} from "wagmi";
import {Icon, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react";
import {RiSettings5Fill} from "react-icons/ri";

import {Nfts} from "./pages/Nfts";
import {Loans} from "./pages/Loans";
import {Settings} from "./pages/Settings";
import {Login} from "./pages/Login";

const styles = {
  selected: {
    bg: "#FFDE59",
  },
  notSelected: {
    bg: "#D9D9D9",
  },
};

export function HoneyBeeLoansApp() {
  const tabStyling = useMemo(() => {
    return {
      _selected: styles.selected,
      bg: styles.notSelected.bg,
      fontFamily: "'Julius Sans One', sans-serif",
      fontSize: 18,
    };
  }, []);

  const { address, isConnected } = useAccount();
  if (!isConnected) {
    return (<Login />);
  }

  return <Tabs isFitted={true} size={"lg"} variant={"enclosed-colored"}>
    <TabList>
      <Tab flex={7} {...tabStyling}>
        <Text as={"b"}>NFT Portfolio</Text>
      </Tab>
      <Tab flex={4} {...tabStyling}>
        <Text as={"b"}>Loans</Text>
      </Tab>
      <Tab {...tabStyling}><Icon as={RiSettings5Fill} /></Tab>
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
