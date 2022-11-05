import {Box, Divider, Text, VStack} from "@chakra-ui/react";

import {NftItem} from "../components/NftItem";
import {PageHeader} from "../components/PageHeader";


export function Nfts() {
  return (
    <VStack>
      <PageHeader title={"NFTs"}>
        <Text>Select an NFT and deposit it. After depositing you will receive the loan amount.</Text>
      </PageHeader>
      <VStack divider={<Divider borderColor={"gray.400"}/>} spacing={0} w={"100%"}>
        <Box w={"100%"}>
          <NftItem name={"Dreams #271"}/>
        </Box>
        <Box w={"100%"}>
          <NftItem name={"Dreams #300"}/>
        </Box>
        <Box w={"100%"}>
          <NftItem name={"Dreams #400"}/>
        </Box>
        <Box w={"100%"}>
          <NftItem name={"Dreams #420"}/>
        </Box>
      </VStack>
    </VStack>
  )
}
