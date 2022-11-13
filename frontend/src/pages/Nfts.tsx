import {useEffect, useReducer} from "react";
import {Box, Button, Divider, Skeleton, Text, VStack} from "@chakra-ui/react";
import {BigNumber} from "ethers";
import {useAccount, useContractRead, useContractReads, useContractWrite, usePrepareContractWrite} from "wagmi";

import {NftItem} from "../components/NftItem";
import * as contract from "../contract"
import {AcceptLoanModal} from "../components/AcceptLoanModal";

const nftIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

interface NftsState {
  modalOpen: boolean;
  modalNft: null | Object;
  ownedNfts: Object[];
}

const initialState: NftsState = {
  modalOpen: false,
  modalNft: null,
  ownedNfts: [],
};

enum Action {
  OpenModal,
  CloseModal,
  UpdateOwnedNfts,
};

function reducer(state: NftsState, action: { type: Action, payload?: any }) {
  switch (action.type) {
    case Action.UpdateOwnedNfts:
      return { ...state, ownedNfts: [...action.payload]};
    case Action.OpenModal:
      return { ...state, modalOpen: true, modalNft: action.payload };
    case Action.CloseModal:
      return { ...state, modalOpen: false, modalNft: null };
    default:
      return state;
  }
}

export function Nfts() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { address } = useAccount();
  const { data: nftIsApprovedForAll, isLoading: nftIsApprovedForAllLoading } = useContractRead({
    address: contract.nftContractAddress,
    abi: contract.nftContractAbi,
    functionName: "isApprovedForAll",
    args: [
      address as any, // owner
      contract.contractAddress, // operator
    ]
  });
  const { data: nftOwners, isLoading, isError } = useContractReads({
    contracts: nftIds.map((nftTokenId) => ({
      address: contract.nftContractAddress,
      abi: contract.nftContractAbi,
      functionName: "ownerOf",
      args: [BigNumber.from(nftTokenId)],
    })),
  });

  const { config: configContractWriteSetApprovalForAll } = usePrepareContractWrite({
    address: contract.nftContractAddress,
    abi: contract.nftContractAbi,
    functionName: "setApprovalForAll",
    args: [contract.contractAddress, true],
    // overrides: {
    //   gasLimit: BigNumber.from(200000),
    // },
  });
  const {
    data: setApprovalForAll,
    isSuccess: setApprovalForAllIsSuccess,
    isLoading: setApprovalForAllIsLoading,
    write: contractWriteSetApprovalForAll
  } = useContractWrite(configContractWriteSetApprovalForAll);

  const { config: configContractWriteSetLoanAmountBounds } = usePrepareContractWrite({
    address: contract.contractAddress,
    abi: contract.contractAbi,
    functionName: "depositNft721",
    args: [contract.nftContractAddress, BigNumber.from((state.modalNft?.tokenId ?? "-1").toString())],
    // functionName: "requestUpdateLoanConfig",
    // args: [BigNumber.from(4), BigNumber.from(10)],
    overrides: {
      gasLimit: BigNumber.from(200000),
    },
  });
  const {
    data: setLoanAmountBoundsData,
    isSuccess: setLoanAmountBoundsIsSuccess,
    isLoading: setLoanAmountBoundsIsLoading,
    write: contractWriteSetLoanAmountBounds
  } = useContractWrite(configContractWriteSetLoanAmountBounds);

  useEffect(() => {
    if (isLoading || !nftOwners) {
      dispatch({ type: Action.UpdateOwnedNfts, payload: [] });
      return;
    }

    if (isError) {
      dispatch({ type: Action.UpdateOwnedNfts, payload: [] });
      console.error("Error");
    }

    const owned = [];
    for (let i = 0; i < nftIds.length; i += 1) {
      if (nftOwners[i] === address as any) {
        owned.push(nftIds[i]);
      }
    }
    dispatch({ type: Action.UpdateOwnedNfts, payload: owned });
  }, [nftOwners, isLoading, isError]);

  const closeModal = () => { dispatch({ type: Action.CloseModal }); };
  const openModal = (ownedNft: any) => {
    return () => {
      dispatch({
        type: Action.OpenModal,
        payload: {
          name: `Prototype NFT #${ownedNft}`,
          tokenId: ownedNft,
          numDays: 7,
          loanAmount: "1 HPT",
          loanRate: "5.25%",
        },
      });
    };
  };
  const approveForAll = () => { contractWriteSetApprovalForAll?.(); };
  const depositNft = () => { contractWriteSetLoanAmountBounds?.(); };
  const acceptLoan = () => { depositNft(); closeModal(); };

  return (
    <>
      <AcceptLoanModal
        nft={state.modalNft}
        isOpen={state.modalOpen}
        onClose={closeModal}
        onSubmit={acceptLoan}
      />
      <VStack>
        <Box>
          <Text>Select an NFT and deposit it. After depositing you will receive the loan amount in HPT ERC20 tokens.</Text>
        </Box>
        <VStack divider={<Divider borderColor={"gray.400"}/>} spacing={0} w={"100%"}>
          {isLoading && (<Box w={"100%"}>
            <Skeleton />
          </Box>)}
          {!nftIsApprovedForAll && <Box w={"100%"}>
            <Button onClick={approveForAll} colorScheme="yellow" bgGradient={"linear(76.71deg, #FEE186 11.01%, #FCD456 31.68%, #FFEAA8 69.1%, #EFC235 97.65%)"}>Approve All NFTs for Loans</Button>
          </Box>}
          {state.ownedNfts.map(ownedNft => (
            <Box key={`prototype-nft-${ownedNft}`} w={"100%"}>
              <NftItem
                name={`Prototype NFT #${ownedNft}`}
                tokenId={ownedNft}
                enabled={nftIsApprovedForAll || setApprovalForAllIsSuccess}
                onClick={openModal(ownedNft)}
              />
            </Box>
          ))}
        </VStack>
      </VStack>
    </>
  );
}
