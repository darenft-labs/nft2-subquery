import { Collection, NFT } from "../types";
import { RoyaltyClaimedLog } from "../types/abi-interfaces/DerivedAccountAbi";
import { Erc721Abi__factory } from "../types/contracts/factories";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const CHAIN_LIST = {
  AVAX: 43114,
  BNB: 56,
  AVAX_TESTNET: 43113,
  BNB_TESTNET: 97,
};

export async function getNFT(
  chainId: number,
  collection: string,
  tokenId: bigint
): Promise<NFT> {
  let nft = await NFT.get(
    `${chainId}-${collection.toLowerCase()}-${tokenId.toString()}`
  );

  if (!nft) {
    const collectionContract = Erc721Abi__factory.connect(collection, api);
    // Query the token uri of an NFT
    const tokenUri = await collectionContract.tokenURI(tokenId);

    nft = NFT.create({
      id: `${chainId}-${collection.toLowerCase()}-${tokenId.toString()}`,
      chainId,
      collection: collection.toLowerCase(),
      tokenId: BigInt(tokenId),
      tokenUri,
    });
    await nft.save();
  }

  return nft;
}

export function getRoyaltyClaimedId(chainId: number, log: RoyaltyClaimedLog) {
  return `${chainId}-${log.transactionHash.toLowerCase()}-${log.logIndex}`;
}
