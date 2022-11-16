import {
  Box,
  Collapse,
  CloseButton,
  Flex,
  VStack,
  IconButton,
  Progress,
  Button,
  Text,
  Heading,
  Spacer,
} from "@chakra-ui/react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import * as contract from "../contract";

export interface Loan {
  nftName: string;
  daysRemaining: number;
  paidAmount: number;
  unpaidAmount: number;
  numDays: number;
  amount: number;
  rate: number;
  paymentProgress: number;
}

export interface LoanItemProps {
  loan: Loan;
}

export function LoanItem({ loan }: LoanItemProps) {
  const { config: configContractPayback } = usePrepareContractWrite({
    address: contract.contractAddress,
    abi: contract.contractAbi,
    functionName: "payback",
    // overrides: {
    //   gasLimit: BigNumber.from(200000),
    // },
  });
  const { write: contractWritePayback } = useContractWrite(
    configContractPayback
  );
  const payback = () => {
    contractWritePayback?.();
  };
  return (
    <Box my={"50px"}>
      <Box my={2}>
        <Progress
          colorScheme={loan.paymentProgress < 50 ? "red" : "orange"}
          size="sm"
          value={loan.paymentProgress}
        />
        <Text as={"b"}>{loan.nftName}</Text>
      </Box>
      <Flex flexDirection={"row"}>
        <Box width={150}>
          <Text>{loan.numDays}-day loan</Text>
          <Text>
            {loan.amount} HPT @ {loan.rate}%
          </Text>
          <Text>{loan.daysRemaining} days left</Text>
        </Box>
        <Box width={150} textAlign={"right"}>
          <Text>Paid: {loan.paidAmount} HPT</Text>
          <Text>Remaining: {loan.unpaidAmount} HPT</Text>
          <Button
            mt={3}
            colorScheme="yellow"
            bgGradient={
              "linear(76.71deg, #FEE186 11.01%, #FCD456 31.68%, #FFEAA8 69.1%, #EFC235 97.65%)"
            }
            onClick={payback}
          >
            Pay back loan
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
