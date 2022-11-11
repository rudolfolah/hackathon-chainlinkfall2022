import React from "react";
import {useConnect} from "wagmi";
import {InjectedConnector} from "wagmi/connectors/injected";
import {Button} from "@chakra-ui/react";
import {RiWallet3Line} from "react-icons/ri";

export function ConnectToWalletButton() {
  const {connect} = useConnect({
    connector: new InjectedConnector(),
  });
  return (
    <Button colorScheme={"orange"} size={"lg"} onClick={() => connect()} leftIcon={<RiWallet3Line />}>
      Connect to Wallet
    </Button>
  );
}
