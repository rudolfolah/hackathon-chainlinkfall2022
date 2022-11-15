import {
  Box,
  Collapse,
  CloseButton,
  Flex,
  VStack,
  IconButton,
  Button,
  Text,
  Heading,
  Spacer,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractAbi, contractAddress, nftContractAddress } from "../contract";
import { BigNumber } from "ethers";
import { RiAppsLine } from "react-icons/ri";

export interface LoanOption {
  numDays: number;
  amount: number;
  rate: number;
}

export interface NftItemProps {
  name: string;
  tokenId: number;
  enabled: boolean;
  onClick: () => void;
}

export function NftItem({ name, tokenId, enabled, onClick }: NftItemProps) {
  const [loanOptions, setLoanOptions] = useState<LoanOption[]>([
    { numDays: 7, amount: 1.25, rate: 5.25 },
    { numDays: 14, amount: 1.1, rate: 7.55 },
    { numDays: 21, amount: 1, rate: 12.25 },
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack
      alignItems={"normal"}
      padding={5}
      bgGradient={
        isOpen ? "linear(102.8deg, #FFFBE8 23.81%, #FFE8E1 90.06%)" : undefined
      }
    >
      <Flex py={1} mb={2}>
        <Box flex={"2"} flexBasis={"50%"} onClick={isOpen ? onClose : onOpen}>
          <Heading as={"h4"} size={"md"} textAlign={"left"}>
            {name}
          </Heading>
          <Image
            boxSize={isOpen ? "100%" : "60%"}
            fit={"contain"}
            src={`${process.env.PUBLIC_URL}/images/nft-example-${tokenId}.png`}
          />
        </Box>
        <Spacer />
        <Box>
          {isOpen ? (
            <CloseButton onClick={onClose} />
          ) : (
            <IconButton
              aria-label={"open"}
              icon={<RiAppsLine />}
              onClick={onOpen}
              variant={"ghost"}
            />
          )}
        </Box>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        {loanOptions.map((option, index) => (
          <Flex
            key={`${option.numDays}-${option.amount}-${option.rate}`}
            my={1}
          >
            <Box flex={"2"} flexBasis={"50%"} textAlign={"right"} pr={3}>
              <Text pt={1.5}>{option.numDays}-day loan</Text>
            </Box>
            <Box flex={"1"}>
              <Button
                w={"170px"}
                bgGradient={
                  index == 0
                    ? "linear(76.71deg, #FEE186 11.01%, #FCD456 31.68%, #FFEAA8 69.1%, #EFC235 97.65%)"
                    : undefined
                }
                variant={"outline"}
                borderColor={"#aaa"}
                disabled={!enabled}
                onClick={onClick}
              >
                {option.amount} HPT @ {option.rate}%
              </Button>
            </Box>
          </Flex>
        ))}
      </Collapse>
    </VStack>
  );
}
