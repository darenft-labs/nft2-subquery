import { Collection, NFT } from "../types";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export async function getNFT(collection: string, tokenId: bigint): Promise<NFT> {
  let nft = await NFT.get(`${collection.toLowerCase()}-${tokenId.toString()}`);

  if (!nft) {
    nft = NFT.create({
      id: `${collection.toLowerCase()}-${tokenId.toString()}`,
      collection: collection,
      tokenId: BigInt(tokenId),
    });
    await nft.save();
  }

  return nft;
}