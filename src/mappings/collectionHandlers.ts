import { TransferLog } from "../types/abi-interfaces/Erc721Abi";
import assert from "assert";
import { getNFT, ADDRESS_ZERO, CHAIN_LIST } from "./utils";

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

  const nft = await getNFT(chainId, log.address, log.args.tokenId.toBigInt());
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
