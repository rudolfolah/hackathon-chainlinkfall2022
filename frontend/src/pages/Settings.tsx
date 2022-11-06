import {useAccount, useContractRead} from "wagmi";
import {Box, Divider, Heading, SkeletonText, Spinner, Text, VStack} from "@chakra-ui/react";
import React from "react";
import * as contract from "../contract";

export function Settings() {
  const { address } = useAccount();

  const owner = "0x8aa6013Ec2BAbE20dabF27149d8A20102B3F8062";
  const { data: tokenBalance, isLoading: tokenBalanceLoading } = useContractRead({
    address: contract.tokenContractAddress,
    abi: contract.tokenContractAbi,
    functionName: "balanceOf",
    args: [owner],
  });

  const { data: nftBalance, isLoading: nftBalanceLoading } = useContractRead({
    address: contract.nftContractAddress,
    abi: contract.nftContractAbi,
    functionName: "balanceOf",
    args: [owner],
  });

  return (
    <VStack divider={<Divider borderColor={"gray.400"} />} spacing={12} m={4}>
      <Box textAlign={"center"} overflowWrap={"anywhere"}>
        <Text>Wallet: {address}</Text>
      </Box>
      <Box>
        <Heading>Honeypot Prototype Token</Heading>
        <Text>
          {tokenBalanceLoading ? <SkeletonText /> : `${tokenBalance?.toString()} HPT`}
        </Text>
      </Box>
      <Box>
        <Heading>Honeypot Nft</Heading>
        <Text>
          {nftBalanceLoading ? <SkeletonText /> : `Owns ${nftBalance?.toString()} Honeypot Prototype NFTs`}
        </Text>
      </Box>
    </VStack>
  );
}
