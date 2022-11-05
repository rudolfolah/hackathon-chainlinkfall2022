import React from "react";
import { Box, Button, Divider, Heading, VStack } from "@chakra-ui/react";
import {useAccount, useConnect} from "wagmi";
import {InjectedConnector} from "wagmi/connectors/injected";


export function Login() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  return (
    <VStack divider={<Divider borderColor={"gray.400"} />} spacing={12} m={4}>
      <Box textAlign={"center"}>
        <Box>[Large Logo]</Box>
        <Box>HONEYPOT provides loans using your NFTs as collateral. Buy an NFT from a trusted source and then provide it as collateral for a short-term loan.</Box>
      </Box>
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
      <Box>
        <Heading as="h2" size={"lg"} textAlign={"center"}>Success Stories</Heading>
        <p>This NFT was used as collateral for a 7 day loan. The borrower received 1 ETH with an interest rate of 4%. They fully paid the loan and their NFT was returned to them.</p>
        <p>This NFT was used as collateral for a 7 day loan. The borrower received 1 ETH with an interest rate of 4%. They fully paid the loan and their NFT was returned to them.</p>
      </Box>
    </VStack>
  );
}
