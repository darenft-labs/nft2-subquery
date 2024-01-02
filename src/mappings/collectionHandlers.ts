import { Collection, NFT } from "../types";
import {
  TransferLog,  
} from "../types/abi-interfaces/Erc721Abi";
import assert from "assert";
import { getNFT, ADDRESS_ZERO } from "./utils";

export async function handleTransfer(log: TransferLog) : Promise<void> {
  logger.info(`New Transfer log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  if (log.args.from == ADDRESS_ZERO) {
    logger.info(`NFT ${log.args.tokenId} is minted on collection ${log.address}`);

    const tokenId = log.args.tokenId.toBigInt();

    const item = NFT.create({
      id: `${log.address}-${log.args.tokenId}`,
      blockHeight: BigInt(log.blockNumber),
      collection: log.address.toLowerCase(),
      tokenId: log.args.tokenId.toBigInt(),
      owner: log.args.to,
    });
    return await item.save();
  } else if (log.args.to == ADDRESS_ZERO) {
    logger.info(`NFT ${log.args.tokenId} is burned from collection ${log.address}`);

    const nft = await getNFT(log.address, log.args.tokenId.toBigInt());
    nft.isBurned = true;
    return await nft.save();
  }

  logger.info(`NFT ${log.args.tokenId} is transfered on collection ${log.address}`);

  const nft = await getNFT(log.address, log.args.tokenId.toBigInt());
  nft.owner = log.args.to;
  await nft.save();
}