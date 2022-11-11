import React, {ReactElement} from "react";
import {chain, configureChains, createClient, WagmiConfig} from "wagmi";
import {jsonRpcProvider} from "wagmi/providers/jsonRpc";
import {publicProvider} from "wagmi/providers/public";

import "./App.css";
import {Honeypot} from "./Honeypot";
import {Box, Button, Center, Flex, Heading, Spacer, Text} from "@chakra-ui/react";
import {Icon} from "@chakra-ui/icons";
import {RiAppleFill, RiGooglePlayFill} from "react-icons/ri";

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

function NavButton({ icon, children }: { icon: ReactElement, children: any }): ReactElement {
  return (
    <Button variant="outline" size="sm" leftIcon={icon} m={2}>
      {children}
    </Button>
  );
}

export default function App() {
  // const { address, isConnected } = useAccount();
  // if (!isConnected) {
  //   return (<WagmiConfig client={client}><Login /></WagmiConfig>);
  // }

  return (
    <WagmiConfig client={client}>
      <Flex className={"App--nav"} p={2}>
        <Box>
          HONEYPOT
        </Box>
        <Spacer />
        <Box>
          <NavButton icon={<RiAppleFill />}>Download on iOS</NavButton>
          <NavButton icon={<RiGooglePlayFill />}>Download on Google Play</NavButton>
        </Box>
      </Flex>
      <Center className={"App--container"}>
        <Box className={"App--marketing"}>
          <Heading as={"h1"}>HONEYPOT</Heading>
          <Text>Chainlink Fall 2022 Hackathon Entry</Text>
          <Text>Built on Polygon, Chainlink, Truflation, Bacalhau, IPFS and QuickNode.</Text>
          <Text>Team: Rudolf, Natalja</Text>
        </Box>
        <Box className={"App--phone-container"}>
          <Honeypot />
        </Box>
      </Center>
    </WagmiConfig>
  );
}
