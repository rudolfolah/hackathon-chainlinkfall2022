import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Checkbox, GridItem, Text, SimpleGrid, Box,
} from "@chakra-ui/react";
import {useState} from "react";

export interface AcceptLoanModalProps {
  nft: {
    name: string;
    tokenId: number;
    numDays: number;
    loanAmount: string;
    loanRate: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function AcceptLoanModal({ isOpen = false, onClose, nft, onSubmit }: AcceptLoanModalProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Accept Loan</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={2}>
            <GridItem>
              Selected NFT:
            </GridItem>
            <GridItem>
              <Text as={"b"}>{nft?.name}</Text>
            </GridItem>
            <GridItem>
              Number of days:
            </GridItem>
            <GridItem>
              <Text as={"b"}>{nft?.numDays}</Text>
            </GridItem>
            <GridItem>
              Loan amount:
            </GridItem>
            <GridItem>
              <Text as={"b"}>{nft?.loanAmount}</Text>
            </GridItem>
            <GridItem>
              Loan interest rate:
            </GridItem>
            <GridItem>
              <Text as={"b"}>{nft?.loanRate}</Text>
            </GridItem>
            <GridItem colSpan={2}>
              <Box>
                <Text as={"em"}>Terms and Conditions:</Text>
              </Box>
              <Box maxHeight={"12rem"} overflow={"scroll"} my={2} pl={2} pr={5} py={2} textAlign={"justify"} border={"1px"} borderColor={"gray.300"}>
                Terms and conditions for the loan go here. There are many policies and terms that should go into this part of the page. This confirms that the borrower will abide by the terms and conditions and that they will pay back the loan including interest within one (1) day of the loan being given. The interest of the loan will not go above 50% and will never be below 1%. The interest on the loan will not be modified during the duration of the loan. As the borrower pays back the loan, there will be no further changes to the interest rate. If the loan is only partially paid back, the NFT and the paid back funds will be retained by the lender.
              </Box>
            </GridItem>
            <GridItem colSpan={2}>
              <Text as={"span"} onClick={() => setAgreedToTerms(!agreedToTerms)}>I agree to the terms and conditions for this loan.</Text>
              <Checkbox my={1} mx={3} isChecked={agreedToTerms} onChange={() => setAgreedToTerms(!agreedToTerms)} />
            </GridItem>
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button variant={"link"}
                  mx={10}
                  fontSize={14}
                  color={"#C42222"}
                  onClick={onClose}>
            Dismiss
          </Button>
          <Button w={"170px"}
                  fontSize={18}
                  bgGradient={"linear(76.71deg, #FEE186 11.01%, #FCD456 31.68%, #FFEAA8 69.1%, #EFC235 97.65%)"}
                  variant={"outline"}
                  borderColor={"#aaa"}
                  onClick={onSubmit}
                  disabled={!agreedToTerms}
          >
            Deposit Nft {!agreedToTerms}
          </Button>
        </ModalFooter>

      </ModalContent>
    </Modal>
  );
}
