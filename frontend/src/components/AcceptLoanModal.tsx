import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton, Button,
} from "@chakra-ui/react";

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
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Accept Loan</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Selected NFT: {nft?.name}
          Number of days: {nft?.numDays}
          Loan amount: {nft?.loanAmount}
          Loan interest rate: {nft?.loanRate}
          Terms and Conditions:
          Terms and conditions for the loan go here. There are many policies and terms that should go into this part of the page. This confirms that the borrower will abide by the terms and conditions and that they will pay back the loan including interest within one (1) day of the loan being given. The interest of the loan will not go above 50% and will never be below 1%. The interest on the loan will not be modified during the duration of the loan. As the borrower pays back the loan, there will be no further changes to the interest rate. If the loan is only partially paid back, the NFT and the paid back funds will be retained by the lender.
          I agree to the terms and conditions for this loan.
        </ModalBody>
        <ModalFooter>
          <Button variant={"link"}>Dismiss</Button>
          <Button w={"170px"}
                  bgGradient={"linear(76.71deg, #FEE186 11.01%, #FCD456 31.68%, #FFEAA8 69.1%, #EFC235 97.65%)"}
                  variant={"outline"}
                  borderColor={"#aaa"}
                  onClick={onSubmit}
          >
            Deposit Nft
          </Button>
        </ModalFooter>

      </ModalContent>
    </Modal>
  );
}
