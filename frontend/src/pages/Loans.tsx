import {useMemo, useState} from "react";
import { Box, HStack, VStack, Flex, Button, Text, Icon, Heading, Spinner, SkeletonText, Skeleton, Stat, StatNumber, StatLabel} from "@chakra-ui/react";
import {RiAlertFill} from "react-icons/ri";
import {Loan, LoanItem} from "../components/LoanItem";

export function Loans() {
  const [loans, setLoans] = useState<Loan[]>([
    { nftName: "Prototype NFT #102", rate: 5.25, amount: 1.3, unpaidAmount: 0.23, paidAmount: 1.0, numDays: 14, daysRemaining: 5, paymentProgress: 30 },
    { nftName: "Prototype NFT #103", rate: 14.2, amount: 0.5, unpaidAmount: 0.1, paidAmount: 0.4, numDays: 7, daysRemaining: 2, paymentProgress: 70 },
  ]);

  const styles = useMemo(() => ({
    stat: {
      color: "white",
      bgColor: "gray.700",
      borderRadius: 20,
      height: 120,
      px: 2,
      pt: 4,
      textAlign: "center" as const,
    },
    statLabel: {
      fontSize: 20,
    },
  }), []);

  return (
    <VStack>
      <Box>
        <HStack my={2}>
          <Stat {...styles.stat}>
            <StatNumber>1</StatNumber>
            <StatLabel {...styles.statLabel}>Loans Paid</StatLabel>
          </Stat>
          <Stat {...styles.stat} bgColor={"teal"}>
            <StatNumber>{loans.length}</StatNumber>
            <StatLabel {...styles.statLabel}>Loans Unpaid</StatLabel>
          </Stat>
          <Stat {...styles.stat} bgColor={"teal"}>
            <StatNumber>{loans.map(loan => loan.unpaidAmount).reduce((acc, value) => acc + value)}</StatNumber>
            <StatLabel {...styles.statLabel}>ETH Unpaid</StatLabel>
          </Stat>
        </HStack>
        <Text as={"b"} fontSize={"sm"}>
          <Icon as={RiAlertFill} color={"yellow.500"} />
          Warning: loans that are not paid in full will result in a loss of collateral.
        </Text>
      </Box>
      <Box>
        {loans.map((loan, i) => (
          <LoanItem key={i} loan={loan} />
        ))}
      </Box>
    </VStack>
  );
}
