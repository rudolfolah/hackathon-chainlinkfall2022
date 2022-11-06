import {useConnect} from "wagmi";
import {InjectedConnector} from "wagmi/connectors/injected";
import {Button} from "@chakra-ui/react";
import React from "react";

export function ConnectToWalletButton() {
  const {connect} = useConnect({
    connector: new InjectedConnector(),
  });
  return <Button colorScheme={"orange"} size={"lg"} onClick={() => connect()}>
    Connect to Wallet
  </Button>;
}
