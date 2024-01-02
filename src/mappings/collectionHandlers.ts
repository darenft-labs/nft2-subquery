import { Collection, NFT } from "../types";
import {
  TransferLog,  
} from "../types/abi-interfaces/Erc721Abi";
import assert from "assert";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
async function getNFT(collection: string, tokenId: bigint): Promise<NFT> {
  let nft = await NFT.get(`${collection}-${tokenId.toString()}`);

  if (!nft) {
    nft = NFT.create({
      id: `${collection}-${tokenId.toString()}`,
      collection: collection,
      tokenId: BigInt(tokenId),
    });
    await nft.save();
  }

  return nft;
}

export async function handleTransfer(log: TransferLog) : Promise<void> {
  logger.info(`New Transfer log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  if (log.args.from == ADDRESS_ZERO) {
    logger.info(`NFT ${log.args.tokenId} is minted on collection ${log.address}`);

    const item = NFT.create({
      id: `${log.address}-${log.args.tokenId}`,
      blockHeight: BigInt(log.blockNumber),
      collection: log.address.toLowerCase(),
      tokenId: log.args.tokenId.toBigInt(),
      owner: log.args.to,
    });
    await item.save();
  } else if (log.args.to == ADDRESS_ZERO) {
    logger.info(`NFT ${log.args.tokenId} is burned from collection ${log.address}`);

    const nft = await getNFT(log.address, log.args.tokenId.toBigInt());
    nft.isBurned = true;
    await nft.save();
  } else {
    logger.info(`NFT ${log.args.tokenId} is transfered on collection ${log.address}`);

    const nft = await getNFT(log.address, log.args.tokenId.toBigInt());
    nft.owner = log.args.to;
    await nft.save();
  }
}