import { Collection, NFT } from "../types";
import { RoyaltyClaimedLog } from "../types/abi-interfaces/DerivedAccountAbi";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export async function getNFT(collection: string, tokenId: bigint): Promise<NFT> {
  let nft = await NFT.get(`${collection.toLowerCase()}-${tokenId.toString()}`);

  if (!nft) {
    nft = NFT.create({
      id: `${collection.toLowerCase()}-${tokenId.toString()}`,
      collection: collection.toLowerCase(),
      tokenId: BigInt(tokenId),
    });
    await nft.save();
  }

  return nft;
}

export function getRoyaltyClaimedId(log: RoyaltyClaimedLog){
  return `${log.transactionHash.toLowerCase()}-${log.logIndex}`;
}