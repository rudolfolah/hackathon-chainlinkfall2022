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
          <Button mt={3}>Pay back loan</Button>
        </Box>
      </Flex>
    </Box>
  );
}
