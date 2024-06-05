import { NFT } from "../types";
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
  tokenId: bigint,
  isTransfer?: boolean
): Promise<NFT> {
  let nft = await NFT.get(
    `${chainId}-${collection.toLowerCase()}-${tokenId.toString()}`
  );

  if (!nft) {
    nft = NFT.create({
      id: `${chainId}-${collection.toLowerCase()}-${tokenId.toString()}`,
      chainId,
      collection: collection.toLowerCase(),
      tokenId: BigInt(tokenId),
      tokenUri: "",
      owner: "",
    });

    try {
      const collectionContract = Erc721Abi__factory.connect(collection, api);
      // Query the token uri of an NFT
      nft.tokenUri = await collectionContract.tokenURI(tokenId);
      nft.owner = isTransfer ? "" : await collectionContract.ownerOf(tokenId);
    } catch (error) {
      logger.warn(
        `getNFT ${chainId}-${collection.toLowerCase()}-${tokenId.toString()} error: ${error}`
      );
    }

    if (!isTransfer) await nft.save();
  }

  return nft;
}
