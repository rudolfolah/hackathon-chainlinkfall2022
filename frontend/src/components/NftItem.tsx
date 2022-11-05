import { Box, Collapse, CloseButton, Flex, VStack, IconButton, Button, Text, Heading, Spacer } from "@chakra-ui/react";
import {PlusSquareIcon} from "@chakra-ui/icons";
import {useEffect, useState} from "react";
import {useContractWrite, usePrepareContractWrite} from "wagmi";
import {contractAbi, contractAddress} from "../contract";
import {BigNumber} from "ethers";

export interface LoanOption {
  numDays: number,
  amount: number;
  rate: number;
}

export interface NftItemProps {
  name: string;
}

export function NftItem({ name }: NftItemProps) {
  const [loanOptions, setLoanOptions] = useState<LoanOption[]>([
    { numDays: 7, amount: 1.25, rate: 5.25 },
    { numDays: 14, amount: 1.1, rate: 7.55 },
    { numDays: 21, amount: 1, rate: 12.25 },
  ]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  const { config: configContractWriteSetLoanAmountBounds } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractAbi,
    functionName: "setLoanAmountBounds",
    args: [BigNumber.from(4), BigNumber.from(10)],
  });
  const {
    data: setLoanAmountBoundsData,
    isSuccess: setLoanAmountBoundsIsSuccess,
    isLoading: setLoanAmountBoundsIsLoading,
    write: contractWriteSetLoanAmountBounds
  } = useContractWrite(configContractWriteSetLoanAmountBounds);

  return (
    <VStack alignItems={"normal"}
            padding={5}
            bgGradient={isOpen ? "linear(102.8deg, #FFFBE8 23.81%, #FFE8E1 90.06%)" : undefined}
    >
      <Flex py={1} mb={2}>
        <Box flex={"2"} flexBasis={"50%"} onClick={isOpen ? close : open}>
          <Heading as={"h4"} size={"md"} textAlign={"left"}>{name}</Heading>
        </Box>
        <Spacer />
        <Box>
          {isOpen ? <CloseButton onClick={close} /> : <IconButton aria-label={"open"} icon={<PlusSquareIcon onClick={open} />} variant={"ghost"} />}
        </Box>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        {loanOptions.map((option, index) => (
          <Flex key={`${option.numDays}-${option.amount}-${option.rate}`} my={1}>
            <Box flex={"2"} flexBasis={"50%"} textAlign={"right"} pr={3}>
              <Text pt={1.5}>
                {option.numDays}-day loan
              </Text>
            </Box>
            <Box flex={"1"}>
              <Button w={"170px"}
                      bgGradient={index == 0 ? "linear(76.71deg, #FEE186 11.01%, #FCD456 31.68%, #FFEAA8 69.1%, #EFC235 97.65%)" : undefined}
                      variant={"outline"}
                      borderColor={"#aaa"}
                      onClick={() => { contractWriteSetLoanAmountBounds?.(); }}
              >
                {option.amount} ETH @ {option.rate}%
              </Button>
              {setLoanAmountBoundsIsSuccess}
              {setLoanAmountBoundsIsLoading}
            </Box>
          </Flex>
        ))}
      </Collapse>
    </VStack>
  );
}
