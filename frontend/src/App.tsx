import React, { ReactElement } from "react";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

import "./App.css";
import { HoneyBeeLoansApp } from "./HoneyBeeLoansApp";
import { Splashscreen } from "./pages/Splashscreen";
import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { RiAppleFill, RiGooglePlayFill } from "react-icons/ri";

// Configure QuickNode with Polygon Mumbai Testnet
const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygonMumbai],
  [
    // jsonRpcProvider({
    //   rpc: (chain) => ({
    //     http: "https://maximum-small-hexagon.matic-testnet.discover.quiknode.pro/6093ef65b60c6a7d7e7635c01534aa7afbec5689/",
    //     webSocket: "wss://maximum-small-hexagon.matic-testnet.discover.quiknode.pro/6093ef65b60c6a7d7e7635c01534aa7afbec5689/",
    //   }),
    // }),
    publicProvider(),
  ]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

function NavButton({
  icon,
  children,
}: {
  icon: ReactElement;
  children: any;
}): ReactElement {
  return (
    <Button
      variant="solid"
      size="md"
      leftIcon={icon}
      m={2}
      colorScheme={"blackAlpha"}
    >
      {children}
    </Button>
  );
}

export default function App() {
  // const { address, isConnected } = useAccount();
  // if (!isConnected) {
  //   return (<WagmiConfig client={client}><Login /></WagmiConfig>);
  // }
  const [showSplashscreen, setShowSplashscreen] = React.useState(true);
  const showApp = () => setShowSplashscreen(false);

  return (
    <WagmiConfig client={client}>
      <Box className={"App--nav"} p={2}>
        <Box mt={1} ml={2}>
          <Image src={"/images/logo-small.png"} width={16} />
          <Text
            fontFamily={"'Julius Sans One', sans-serif"}
            fontSize={18}
            fontWeight={"bold"}
          >
            HONEYBEE LOANS
          </Text>
        </Box>
        <Spacer />
        <Box>
          <NavButton icon={<RiAppleFill />}>Download on iOS</NavButton>
          <NavButton icon={<RiGooglePlayFill />}>Download on Android</NavButton>
        </Box>
      </Box>
      <Center className={"App--container"}>
        <Box className={"App--marketing"}>
          <Heading
            as={"h1"}
            fontFamily={"'Julius Sans One', sans-serif"}
            fontSize={48}
            fontWeight={"bold"}
            mb={5}
          >
            HONEYBEE LOANS
          </Heading>
          <Heading as={"h2"} fontSize={24}>
            It's Your Honey.
          </Heading>
          <Heading as={"h2"} fontSize={24}>
            Instant NFT Liquidity for Quick and Secure Loans.
          </Heading>
          <Text mt={5}>Chainlink Fall 2022 Hackathon Entry</Text>
        </Box>
        <Box className={"App--phone-container"} bgColor={"white"}>
          {showSplashscreen ? (
            <Splashscreen onClick={showApp} />
          ) : (
            <HoneyBeeLoansApp />
          )}
        </Box>
      </Center>
    </WagmiConfig>
  );
}
