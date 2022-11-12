import {useMemo, useState} from "react";
import { Box, HStack, VStack, Flex, Button, Text, Icon, Heading, Spinner, SkeletonText, Skeleton, Stat, StatNumber, StatLabel} from "@chakra-ui/react";
import {RiAlertFill} from "react-icons/ri";
import {Loan, LoanItem} from "../components/LoanItem";

export function Loans() {
  const [loans, setLoans] = useState<Loan[]>([
    {nftName: "Amazing 1", rate: 5.25, amount: 1.23, unpaidAmount: 0.23, paidAmount: 1.0, numDays: 7, daysRemaining: 3 },
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
            <StatNumber>3</StatNumber>
            <StatLabel {...styles.statLabel}>Loans Unpaid</StatLabel>
          </Stat>
          <Stat {...styles.stat} bgColor={"teal"}>
            <StatNumber>3.63</StatNumber>
            <StatLabel {...styles.statLabel}>ETH Unpaid</StatLabel>
          </Stat>
        </HStack>
        <Text as={"b"} fontSize={"sm"}>
          <Icon as={RiAlertFill} color={"yellow.500"} />
          Warning: loans that are not paid in full will result in a loss of collateral.
        </Text>
      </Box>
      <Box>
        <LoanItem loan={loans[0]} />
      </Box>
    </VStack>
  );
}
