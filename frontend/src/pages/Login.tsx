import React from "react";
import {
  Box,
  Divider,
  Heading,
  Image,
  VStack,
  Text,
  Icon,
  Center,
} from "@chakra-ui/react";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import {
  RiShieldCheckLine,
  RiGooglePlayFill,
  RiShieldCheckFill,
} from "react-icons/ri";
import { ConnectToWalletButton } from "../components/ConnectToWalletButton";

export function Login() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  return (
    <VStack divider={<Divider borderColor={"gray.400"} />} spacing={8} m={4}>
      <VStack spacing={2}>
        <Center mt={1} ml={2}>
          <Image src={`${process.env.PUBLIC_URL}/images/logo.png`} width={16} />
          <Text
            fontFamily={"'Julius Sans One', sans-serif"}
            fontSize={28}
            fontWeight={"bold"}
          >
            HONEYBEE LOANS
          </Text>
        </Center>
        <Box>
          <Text>
            It’s Your Honey. HONEYBEE LOANS is a quick and powerful way to
            evaluate your NFT Portfolio and access secure loans by using your
            NFTs as collateral.
          </Text>
        </Box>
        <Box>
          <Text>
            NFTs purchased from a trusted source can be instantly turned into
            collateral for a short-term loan.
          </Text>
        </Box>
        <Box>
          <Text>
            HONEYBEE LOANS is a one stop NFT Portfolio and Loan App. Access Your
            Honey.
          </Text>
        </Box>
      </VStack>
      <Box>
        <Box textAlign={"center"}>
          <ConnectToWalletButton />
        </Box>
        <Box mt={3} fontSize={14}>
          <Text>
            <Icon color="teal" as={RiShieldCheckLine} /> Secure and verified
            transactions
          </Text>
          <Text>
            <Icon color="teal" as={RiGooglePlayFill} /> Access and manage loans
            confidently
          </Text>
        </Box>
      </Box>
      <Box>
        <Heading as="h2" size={"lg"} textAlign={"center"}>
          Success Story
        </Heading>
        <Center>
          <Image
            src={`${process.env.PUBLIC_URL}/images/nft-example-7.png`}
            boxSize={"35%"}
          />
          <Text p={4} fontSize={13}>
            This NFT was used as collateral for a 7-day loan. The borrower
            received 1.00 HPT with an interest rate of 4.12%. They fully paid
            the loan and their NFT was returned to them.
          </Text>
        </Center>
      </Box>
    </VStack>
  );
}
