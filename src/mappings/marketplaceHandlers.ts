import {
  TakerBid,
  TakerAsk,
  CancelAllOrders,
  CancelMultipleOrders,
  RoyaltyPayment,
} from "../types";
import {
  TakerBidLog,
  TakerAskLog,
  CancelAllOrdersLog,
  CancelMultipleOrdersLog,
  RoyaltyPaymentLog,
} from "../types/abi-interfaces/MarketplaceAbi";
import assert from "assert";
import { CHAIN_LIST } from "./utils";

export async function handleTakerBidLogAvax(log: TakerBidLog) {
  await handleTakerBidLog(CHAIN_LIST.AVAX, log);
}
export async function handleTakerBidLogBnb(log: TakerBidLog) {
  await handleTakerBidLog(CHAIN_LIST.BNB, log);
}
export async function handleTakerBidLogAvaxTestnet(log: TakerBidLog) {
  await handleTakerBidLog(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleTakerBidLogBnbTestnet(log: TakerBidLog) {
  await handleTakerBidLog(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleTakerBidLog(
  chainId: number,
  log: TakerBidLog
): Promise<void> {
  logger.info(`TakerBid at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const id = `${log.args.orderHash.toLowerCase()}_${log.args.orderNonce.toBigInt()}`;

  const item = TakerBid.create({
    id,
    chainId,
    blockHeight: BigInt(log.blockNumber),
    timestamp: log.block.timestamp,
    taker: log.args.taker.toLowerCase(),
    maker: log.args.maker.toLowerCase(),
    strategy: log.args.strategy.toLowerCase(),
    orderHash: log.args.orderHash.toLowerCase(),
    orderNonce: log.args.orderNonce.toBigInt(),
    currency: log.args.currency.toLowerCase(),
    collection: log.args.collection.toLowerCase(),
    tokenId: log.args.tokenId.toBigInt(),
    amount: log.args.amount.toBigInt(),
    price: log.args.price.toBigInt(),
  });
  await item.save();
}

export async function handleTakerAskLogAvax(log: TakerAskLog) {
  await handleTakerAskLog(CHAIN_LIST.AVAX, log);
}
export async function handleTakerAskLogBnb(log: TakerAskLog) {
  await handleTakerAskLog(CHAIN_LIST.BNB, log);
}
export async function handleTakerAskLogAvaxTestnet(log: TakerAskLog) {
  await handleTakerAskLog(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleTakerAskLogBnbTestnet(log: TakerAskLog) {
  await handleTakerAskLog(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleTakerAskLog(
  chainId: number,
  log: TakerAskLog
): Promise<void> {
  logger.info(`TakerAsk at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const id = `${log.args.orderHash.toLowerCase()}_${log.args.orderNonce.toBigInt()}`;

  const item = TakerAsk.create({
    id,
    chainId,
    blockHeight: BigInt(log.blockNumber),
    timestamp: log.block.timestamp,
    taker: log.args.taker.toLowerCase(),
    maker: log.args.maker.toLowerCase(),
    strategy: log.args.strategy.toLowerCase(),
    orderHash: log.args.orderHash.toLowerCase(),
    orderNonce: log.args.orderNonce.toBigInt(),
    currency: log.args.currency.toLowerCase(),
    collection: log.args.collection.toLowerCase(),
    tokenId: log.args.tokenId.toBigInt(),
    amount: log.args.amount.toBigInt(),
    price: log.args.price.toBigInt(),
  });
  await item.save();
}

export async function handleCancelAllOrdersLogAvax(log: CancelAllOrdersLog) {
  await handleCancelAllOrdersLog(CHAIN_LIST.AVAX, log);
}
export async function handleCancelAllOrdersLogBnb(log: CancelAllOrdersLog) {
  await handleCancelAllOrdersLog(CHAIN_LIST.BNB, log);
}
export async function handleCancelAllOrdersLogAvaxTestnet(
  log: CancelAllOrdersLog
) {
  await handleCancelAllOrdersLog(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleCancelAllOrdersLogBnbTestnet(
  log: CancelAllOrdersLog
) {
  await handleCancelAllOrdersLog(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleCancelAllOrdersLog(
  chainId: number,
  log: CancelAllOrdersLog
): Promise<void> {
  logger.info(`CancelAllOrdersLog at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const id = `${log.args.user.toLowerCase()}_${log.args.newMinNonce.toBigInt()}`;

  const item = CancelAllOrders.create({
    id,
    chainId,
    blockHeight: BigInt(log.blockNumber),
    timestamp: log.block.timestamp,
    user: log.args.user.toLowerCase(),
    newMinNonce: log.args.newMinNonce.toBigInt(),
  });
  await item.save();
}

export async function handleCancelMultipleOrdersLogAvax(
  log: CancelMultipleOrdersLog
) {
  await handleCancelMultipleOrdersLog(CHAIN_LIST.AVAX, log);
}
export async function handleCancelMultipleOrdersLogBnb(
  log: CancelMultipleOrdersLog
) {
  await handleCancelMultipleOrdersLog(CHAIN_LIST.BNB, log);
}
export async function handleCancelMultipleOrdersLogAvaxTestnet(
  log: CancelMultipleOrdersLog
) {
  await handleCancelMultipleOrdersLog(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleCancelMultipleOrdersLogBnbTestnet(
  log: CancelMultipleOrdersLog
) {
  await handleCancelMultipleOrdersLog(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleCancelMultipleOrdersLog(
  chainId: number,
  log: CancelMultipleOrdersLog
): Promise<void> {
  logger.info(`CancelMultipleOrdersLog at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const id = `${log.args.user.toLowerCase()}_${log.transactionHash.toLowerCase()}`;
  let orderNonces = [];
  for (let j = 0; j < log.args.orderNonces.length; j++) {
    orderNonces.push(log.args.orderNonces[j].toBigInt());
  }

  const item = CancelMultipleOrders.create({
    id,
    chainId,
    blockHeight: BigInt(log.blockNumber),
    timestamp: log.block.timestamp,
    user: log.args.user.toLowerCase(),
    orderNonces: orderNonces,
  });
  await item.save();
}

export async function handleRoyaltyPaymentLogAvax(log: RoyaltyPaymentLog) {
  await handleRoyaltyPaymentLog(CHAIN_LIST.AVAX, log);
}
export async function handleRoyaltyPaymentLogBnb(log: RoyaltyPaymentLog) {
  await handleRoyaltyPaymentLog(CHAIN_LIST.BNB, log);
}
export async function handleRoyaltyPaymentLogAvaxTestnet(
  log: RoyaltyPaymentLog
) {
  await handleRoyaltyPaymentLog(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleRoyaltyPaymentLogBnbTestnet(
  log: RoyaltyPaymentLog
) {
  await handleRoyaltyPaymentLog(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleRoyaltyPaymentLog(
  chainId: number,
  log: RoyaltyPaymentLog
): Promise<void> {
  logger.info(`RoyaltyPaymentLog at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const id = `${log.args.collection.toLowerCase()}_${log.args.tokenId.toBigInt()}_${log.transactionHash.toLowerCase()}_${
    log.logIndex
  }`;

  const item = RoyaltyPayment.create({
    id,
    chainId,
    blockHeight: BigInt(log.blockNumber),
    timestamp: log.block.timestamp,
    collection: log.args.collection.toLowerCase(),
    tokenId: log.args.tokenId.toBigInt(),
    royaltyRecipient: log.args.royaltyRecipient.toLowerCase(),
    currency: log.args.currency.toLowerCase(),
    amount: log.args.amount.toBigInt(),
  });
  await item.save();
}
