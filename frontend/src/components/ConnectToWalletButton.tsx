import React from "react";
import {useConnect} from "wagmi";
import {InjectedConnector} from "wagmi/connectors/injected";
import {Button} from "@chakra-ui/react";

export function ConnectToWalletButton() {
  const {connect} = useConnect({
    connector: new InjectedConnector(),
  });
  return (
    <Button colorScheme={"orange"} size={"lg"} onClick={() => connect()}
            border={"1px solid black"}
            boxShadow={"lg"}
            bgGradient={"linear(257.73deg, #FF8F0C 5.06%, #965202 97.4%)"}>
      Connect to Wallet
    </Button>
  );
}
