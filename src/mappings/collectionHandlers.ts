import { TransferLog } from "../types/abi-interfaces/Erc721Abi";
import assert from "assert";
import { getNFT, ADDRESS_ZERO, CHAIN_LIST } from "./utils";
import { Transfer } from "../types";

export async function handleTransferAvax(log: TransferLog) {
  await handleTransfer(CHAIN_LIST.AVAX, log);
}
export async function handleTransferBnb(log: TransferLog) {
  await handleTransfer(CHAIN_LIST.BNB, log);
}
export async function handleTransferAvaxTestnet(log: TransferLog) {
  await handleTransfer(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleTransferBnbTestnet(log: TransferLog) {
  await handleTransfer(CHAIN_LIST.BNB_TESTNET, log);
}

export async function handleTransfer(
  chainId: number,
  log: TransferLog
): Promise<void> {
  logger.info(`New Transfer log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const event = Transfer.create({
    id: `${chainId}-${log.address.toLowerCase()}-${log.args.tokenId.toString()}-${
      log.blockNumber
    }`,
    chainId,
    blockHeight: BigInt(log.blockNumber),
    timestamp: log.block.timestamp,
    collection: log.address.toLowerCase(),
    tokenId: log.args.tokenId.toBigInt(),
    from: log.args.from.toLowerCase(),
    to: log.args.to.toLowerCase(),
  });
  await event.save();

  const nft = await getNFT(
    chainId,
    log.address,
    log.args.tokenId.toBigInt(),
    true
  );
  nft.owner = log.args.to.toLowerCase();

  if (log.args.from == ADDRESS_ZERO) {
    logger.info(
      `NFT ${log.args.tokenId} is minted on collection ${log.address}`
    );
    nft.blockHeight = BigInt(log.blockNumber);
    nft.timestamp = log.block.timestamp;
  } else if (log.args.to == ADDRESS_ZERO) {
    logger.info(
      `NFT ${log.args.tokenId} is burned from collection ${log.address}`
    );
    nft.isBurned = true;
  }

  logger.info(
    `NFT ${log.args.tokenId} is transfered on collection ${log.address}`
  );
  return await nft.save();
}
