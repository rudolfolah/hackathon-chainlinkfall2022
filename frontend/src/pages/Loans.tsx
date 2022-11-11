import {useState} from "react";
import { Box, HStack, VStack, Flex, Button, Text, Icon, Heading, Spinner, SkeletonText, Skeleton, Stat, StatNumber, StatLabel} from "@chakra-ui/react";
import {RiAlertFill} from "react-icons/ri";
import {PageHeader} from "../components/PageHeader";
import {Loan, LoanItem} from "../components/LoanItem";


export function Loans() {
  const [loans, setLoans] = useState<Loan[]>([
    {nftName: "Amazing 1", rate: 5.25, amount: 1.23, unpaidAmount: 0.23, paidAmount: 1.0, numDays: 7, daysRemaining: 3 },
    ]);

  return (
    <VStack>
      <PageHeader title={"Loans"}>
        <Text>When you fully pay back a loan, we match a portion of the gas fees and donate it to one of our three charity partner streams. These charities represent three key areas of growth and collaboration; an organization such as women who code, climate change action, animal welfare organizations including Toronto Humane Society.</Text>
        <HStack>
          <Stat>
            <StatNumber>1</StatNumber>
            <StatLabel>Loans Paid</StatLabel>
          </Stat>
          <Stat>
            <StatNumber>3</StatNumber>
            <StatLabel>Loans Unpaid</StatLabel>
          </Stat>
          <Stat>
            <StatNumber>3.63</StatNumber>
            <StatLabel>ETH Unpaid</StatLabel>
          </Stat>
        </HStack>
        <Text as={"b"} fontSize={"sm"}><Icon as={RiAlertFill} color={"yellow.500"} />Warning: loans that are not paid in full will result in a loss of collateral.</Text>
      </PageHeader>
      <Box>
        <LoanItem loan={loans[0]} />
      </Box>
    </VStack>
  );
}
