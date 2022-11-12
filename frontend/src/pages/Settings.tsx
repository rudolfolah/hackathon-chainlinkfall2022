import {useAccount, useContractRead, useContractWrite, usePrepareContractWrite} from "wagmi";
import {Box, Button, Divider, Heading, SkeletonText, Text, VStack} from "@chakra-ui/react";
import {BarChart, Scatter, XAxis, YAxis, Bar, Tooltip, CartesianGrid} from "recharts";
import React from "react";
import * as contract from "../contract";
import {BigNumber} from "ethers";

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

  const { data: truflationIndexValue, isLoading: truflationIndexValueLoading } = useContractRead({
    address: contract.contractAddress,
    abi: contract.contractAbi,
    functionName: "truflationResult",
  });

  const { data: riskIndexValue, isLoading: riskIndexValueLoading } = useContractRead({
    address: contract.contractAddress,
    abi: contract.contractAbi,
    functionName: "riskResult",
  });

  const { config: configContractWriteRequestUpdateLoanConfig } = usePrepareContractWrite({
    address: contract.contractAddress,
    abi: contract.contractAbi,
    functionName: "requestUpdateLoanConfig",
    overrides: {
      gasLimit: BigNumber.from(500000),
    },
  });
  const {
    write: contractWriteRequestUpdateLoanConfig
  } = useContractWrite(configContractWriteRequestUpdateLoanConfig);

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
    <VStack divider={<Divider borderColor={"gray.400"} />} spacing={2}>
      <Box textAlign={"center"} overflowWrap={"anywhere"} fontSize={13}>
        <Text>Wallet: {address}</Text>
        <Text>
          {nftBalanceLoading ? <SkeletonText /> : `Owns ${nftBalance?.toString()} HONEYBEE LOANS Prototype NFTs`}
        </Text>
        <Text>
          {tokenBalanceLoading ? <SkeletonText /> : `${tokenBalance?.toString()} HPT`}
        </Text>
      </Box>
      <Box fontSize={13}>
        {!truflationIndexValueLoading && truflationIndexValue && truflationIndexValue.length > 0 && <Text>{truflationIndexValue}</Text>}
        <Text>{`Update Loan Configuration Based On Truflation NFT Index and HONEYBEE LOANS Risk Oracle: ${truflationIndexValue} ${riskIndexValue}`}</Text>
        <Button onClick={() => contractWriteRequestUpdateLoanConfig?.()}>Update</Button>
      </Box>
      <Box>
        <Text>Loan Amount and Interest Rate Range based on NFT Index Value</Text>
        <BarChart width={325} height={225} data={chartData}
                  title={"Loan Interest Rate Range based on NFT Index"}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nftIndexValue" />
          <YAxis yAxisId={"dollars"} label={"$"} orientation={"left"} />
          <Bar yAxisId={"dollars"} dataKey="loanedAmount" fill="#8884d8" />
          <Bar yAxisId={"dollars"} dataKey="paybackAmount" fill="#333555" />
          <Tooltip />
        </BarChart>
        <BarChart width={325} height={225} data={chartData}
                  title={"Loan Interest Rate Range based on NFT Index"}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nftIndexValue" />
          <YAxis yAxisId={"percent"} label={"%"} orientation={"left"} />
          <Bar yAxisId={"percent"} dataKey="rate" fill="#8884d8" />=
          <Tooltip />
        </BarChart>
      </Box>
    </VStack>
  );
}
