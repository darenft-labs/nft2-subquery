import { Collection, NFT } from "../types";
import {
  TransferLog,  
} from "../types/abi-interfaces/Erc721Abi";
import assert from "assert";
import { getNFT, ADDRESS_ZERO } from "./utils";

export async function handleTransfer(log: TransferLog) : Promise<void> {
  logger.info(`New Transfer log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const nft = await getNFT(log.address, log.args.tokenId.toBigInt());
  nft.owner = log.args.to.toLowerCase();

  if (log.args.from == ADDRESS_ZERO) {
    logger.info(`NFT ${log.args.tokenId} is minted on collection ${log.address}`);
    nft.blockHeight = BigInt(log.blockNumber);    
  } else if (log.args.to == ADDRESS_ZERO) {
    logger.info(`NFT ${log.args.tokenId} is burned from collection ${log.address}`);
    nft.isBurned = true;    
  }

  logger.info(`NFT ${log.args.tokenId} is transfered on collection ${log.address}`);
  return await nft.save();
}