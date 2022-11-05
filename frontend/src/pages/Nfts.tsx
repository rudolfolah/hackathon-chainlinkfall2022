import {Box, Divider, Text, VStack} from "@chakra-ui/react";

import {NftItem} from "../components/NftItem";
import {PageHeader} from "../components/PageHeader";
import {useContractRead, useContractWrite} from "wagmi";
import {useEffect} from "react";
import {contractAbi, contractAddress} from "../contract"


export function Nfts() {
  const { data, isLoading, isError } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "loanAmountMin",
  });
  useEffect(() => {
    console.log(isLoading);
    console.log(isError);
    console.log(data);
  }, [data, isLoading, isError]);

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
