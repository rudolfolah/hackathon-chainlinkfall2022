import {useAccount, useConnect} from "wagmi";
import {InjectedConnector} from "wagmi/connectors/injected";
import {Box, Button, Divider, Heading, VStack} from "@chakra-ui/react";
import React from "react";

export function Settings() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  return (
    <VStack divider={<Divider borderColor={"gray.400"} />} spacing={12} m={4}>
      <Box>
        <Box textAlign={"center"}>
          <Button colorScheme={"orange"} size={"lg"} onClick={() => connect()}>
            Connect to Wallet
          </Button>
        </Box>
        <div>
          <p>Secure and verified transactions.</p>
          <p>NFT prices based on Truflation Index.</p>
        </div>
      </Box>
    </VStack>
  );
}
