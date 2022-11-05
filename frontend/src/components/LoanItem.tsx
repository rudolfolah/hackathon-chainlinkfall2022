import { Box, Collapse, CloseButton, Flex, VStack, IconButton, Button, Text, Heading, Spacer, Progress } from "@chakra-ui/react";
import {CheckIcon} from "@chakra-ui/icons";
import {useState} from "react";

export interface Loan {
  nftName: string;
  daysRemaining: number;
  paidAmount: number;
  unpaidAmount: number;
  numDays: number,
  amount: number;
  rate: number;
}

export interface LoanItemProps {
  loan: Loan;
}

export function LoanItem({ loan }: LoanItemProps) {
  return (
    <VStack alignItems={"normal"}
            padding={5}
            bgGradient={"linear(102.8deg, #FFFBE8 23.81%, #FFE8E1 90.06%)"}
    >
      <Flex py={1} mb={2}>
        <Box flex={"2"} flexBasis={"50%"}>
          <Heading as={"h4"} size={"md"} textAlign={"left"}>{loan.nftName}</Heading>
        </Box>
        <Spacer />
        <Flex key={`${loan.numDays}-${loan.amount}-${loan.rate}`} my={1}>
          <Box flex={"2"} flexBasis={"50%"} textAlign={"right"} pr={3}>
            <Text pt={1.5}>
              {loan.numDays}-day loan
            </Text>
          </Box>
          <Box flex={"1"}>
            <Button w={"170px"}
                    bgGradient={"linear(76.71deg, #FEE186 11.01%, #FCD456 31.68%, #FFEAA8 69.1%, #EFC235 97.65%)"}
                    variant={"outline"}
                    borderColor={"#aaa"}
            >
              Pay back loan
              <br/>
              {loan.unpaidAmount} ETH @ {loan.rate}%
            </Button>
          </Box>
        </Flex>
      </Flex>
    </VStack>
  );
}
