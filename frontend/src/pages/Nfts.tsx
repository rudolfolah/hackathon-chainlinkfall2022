import {Box, Divider, Heading, Text, VStack} from "@chakra-ui/react";

import { NftLoanItem } from "../components/NftLoanItem";


export function Nfts() {
  return (
    <VStack>
      <Box>
        <Heading>NFTs</Heading>
        <Text>Select an NFT and deposit it. After depositing you will receive the loan amount.</Text>
      </Box>
      <VStack divider={<Divider borderColor={"gray.400"} />} spacing={0} w={"100%"}>
        <Box w={"100%"}>
          <NftLoanItem name={"Dreams #271"} />
        </Box>
        <Box w={"100%"}>
          <NftLoanItem name={"Dreams #300"} />
        </Box>
        <Box w={"100%"}>
          <NftLoanItem name={"Dreams #400"} />
        </Box>
        <Box w={"100%"}>
          <NftLoanItem name={"Dreams #420"} />
        </Box>
      </VStack>
    </VStack>
  )
}
