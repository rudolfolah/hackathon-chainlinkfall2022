import React from "react";
import {Box, Divider, Heading, Image, VStack, Text, Icon} from "@chakra-ui/react";
import {useAccount, useConnect} from "wagmi";
import {InjectedConnector} from "wagmi/connectors/injected";
import {RiShieldCheckLine, RiGooglePlayFill, RiShieldCheckFill} from "react-icons/ri";
import {ConnectToWalletButton} from "../components/ConnectToWalletButton";


export function Login() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  return (
    <VStack divider={<Divider borderColor={"gray.400"}/>} spacing={8} m={4}>
      <Box>
        [Logo]
        <Text>
          It’s Your Honey. HONEYBEE LOANS is a quick and powerful way to evaluate your NFT Portfolio and access secure loans by using your NFTs as collateral. NFTs purchased from a trusted source can be instantly turned into collateral for a short-term loan.
        </Text>
        <Text>
          HONEYBEE LOANS is a one stop NFT Portfolio and Loan App. Access Your Honey.
        </Text>
      </Box>
      <Box>
        <Box textAlign={"center"}>
          <ConnectToWalletButton />
        </Box>
        <Box mt={3} fontSize={14}>
          <Text><Icon color="teal" as={RiShieldCheckLine} /> Secure and verified transactions</Text>
          <Text><Icon color="teal" as={RiGooglePlayFill} /> Access and manage loans confidently</Text>
        </Box>
      </Box>
      <Box>
        <Heading as="h2" size={"lg"} textAlign={"center"}>Success Stories</Heading>
        <Image src={"/images/nft-example-0.png"} boxSize={100} />
        <p>This NFT was used as collateral for a 7 day loan. The borrower received 1 ETH with an interest rate of 4%.
          They fully paid the loan and their NFT was returned to them.</p>
        <p>This NFT was used as collateral for a 7 day loan. The borrower received 1 ETH with an interest rate of 4%.
          They fully paid the loan and their NFT was returned to them.</p>
      </Box>
    </VStack>
  );
}
