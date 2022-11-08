import {useAccount, useContractRead} from "wagmi";
import {Box, Divider, Heading, SkeletonText, Text, VStack} from "@chakra-ui/react";
import { BarChart, XAxis, YAxis, Bar, Tooltip } from "recharts";
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

  const calculateLoan = (nftIndexValue: number) => {
    let rateMin, rateMax, amountMin, amountMax;
    if (nftIndexValue <= 50) {
      rateMin = 28.00;
      rateMax = 30.00;
      amountMin = 0.01;
      amountMax = 1;
    } else if (nftIndexValue <= 100) {
      rateMin = 20.00;
      rateMax = 25.00;
      amountMin = 0.01;
      amountMax = 1.1;
    } else if (nftIndexValue <= 150) {
      rateMin = 5.00;
      rateMax = 10.00;
      amountMin = 0.02;
      amountMax = 2;
    } else {
      rateMin = 3.50;
      rateMax = 7.50;
      amountMin = 0.05;
      amountMax = 4;
    }
    const paybackAmountMin = amountMin * (1 + rateMin / 100.0);
    const paybackAmountMax = amountMax * (1 + rateMax / 100.0);
    return {
      nftIndexValue,
      rate: [rateMin, rateMax],
      loanedAmount: [amountMin, amountMax],
      paybackAmount: [paybackAmountMin, paybackAmountMax],
    };
  };
  let chartData = [];
  for (let i = 0; i < 201; i += 10) {
    chartData.push(calculateLoan(i));
  }

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
      <Box>
        <Heading>Loan Interest Rate Range based on NFT Index Value</Heading>
        <BarChart width={325} height={300} data={chartData}
                  title={"Loan Interest Rate Range based on NFT Index"}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis dataKey="nftIndexValue" />
          <YAxis label={"%"} />
          <Bar dataKey="rate" fill="#8884d8" />
          <Tooltip />
        </BarChart>
      </Box>
      <Box>
        <Heading>Loan Amount Range based on NFT Index Value</Heading>
        <BarChart width={325} height={300} data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis dataKey="nftIndexValue" />
          <YAxis label={"$"} />
          <Bar dataKey="loanedAmount" fill="#8884d8" />
          <Bar dataKey="paybackAmount" fill="#333555" />
          <Tooltip />
        </BarChart>
      </Box>
    </VStack>
  );
}
