import {Box, Divider, Skeleton, Text, VStack} from "@chakra-ui/react";

import {NftItem} from "../components/NftItem";
import {PageHeader} from "../components/PageHeader";
import {useAccount, useContractRead, useContractReads, useContractWrite} from "wagmi";
import {useEffect, useState} from "react";
import * as contract from "../contract"
import {BigNumber} from "ethers";


const nftIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export function Nfts() {
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

  const [ownedNfts, setOwnedNfts] = useState([]);

  useEffect(() => {
    if (isLoading || !nftOwners) {
      setOwnedNfts([]);
      return;
    }

    if (isError) {
      setOwnedNfts([]);
      console.error("Error");
    }

    const owned = [];
    for (let i = 0; i < nftIds.length; i += 1) {
      if (nftOwners[i] == address as any) {
        owned.push(nftIds[i]);
      }
    }
    setOwnedNfts(owned as any);
  }, [nftOwners, isLoading, isError]);

  return (
    <VStack>
      <PageHeader title={"NFTs"}>
        <Text>Select an NFT and deposit it. After depositing you will receive the loan amount.</Text>
      </PageHeader>
      <VStack divider={<Divider borderColor={"gray.400"}/>} spacing={0} w={"100%"}>
        {isLoading && (<Box w={"100%"}>
          <Skeleton />
        </Box>)}
        {!nftIsApprovedForAllLoading && <Box w={"100%"}>
          <Text>NFT must be approved</Text>
        </Box>}
        {ownedNfts.map(ownedNft => (
          <Box key={`prototype-nft-${ownedNft}`} w={"100%"}>
            <NftItem name={`Prototype NFT #${ownedNft}`} tokenId={ownedNft} />
          </Box>
        ))}
      </VStack>
    </VStack>
  )
}
