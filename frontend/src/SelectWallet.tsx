import { useConnect, useAccount } from "wagmi";

interface SelectWalletProps {
  opened: boolean;
  close: () => void;
}

export function SelectWallet({ opened, close }: SelectWalletProps) {
  if (!opened) {
    return null;
  }
  return (
    <div>
    </div>
  );
}

/*
import {
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Image,
} from "@chakra-ui/react";
import { useConnect, useAccount } from "wagmi";

export type SelectWalletModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export default function SelectWalletModal({
  isOpen,
  closeModal,
}: SelectWalletModalProps) {

  const {
    connect,
    connectors,
    error,
    pendingConnector,
    isLoading,
  } = useConnect();
  const { connector: activeConnector } = useAccount()

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent w="300px">
        <ModalHeader>Select Wallet</ModalHeader>
        <ModalCloseButton
          _focus={{
            boxShadow: "none",
          }}
        />
        <ModalBody paddingBottom="1.5rem">
          <VStack>
            {activeConnector && <div>Connected to {activeConnector.name}</div>}
            {connectors.map((connector) => (
              <Button
                variant="outline"
                key={connector.id}
                disabled={!connector.ready}
                onClick={() => {
                  connect({connector});
                  closeModal();
                }}
                w="100%"
              >
                <HStack w="100%" justifyContent="center">
                  <Image
                    width={26}
                    height={26}
                    borderRadius="3px"
                    src={walletIcons(connector.name)}
                    alt={"Wallet"}
                  ></Image>
                  <Text>
                    {connector.name}{" "}
                    {isLoading &&
                      pendingConnector?.id === connector.id &&
                      " (connecting)"}
                  </Text>
                </HStack>
              </Button>
            ))}
            {error && <Text>{error.message}</Text>}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const walletIcons = (walletName: string) =>
  walletName === "MetaMask" ? "mm.png" : "/cbw.png";

 */