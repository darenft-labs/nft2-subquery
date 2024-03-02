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

export async function handleTakerBidLog(log: TakerBidLog): Promise<void> {
  logger.info(`TakerBid at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const id = `${log.args.orderHash.toLowerCase()}_${log.args.orderNonce.toBigInt()}`;

  const item = TakerBid.create({
    id,
    blockHeight: BigInt(log.blockNumber),
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

export async function handleTakerAskLog(log: TakerAskLog): Promise<void> {
  logger.info(`TakerAsk at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const id = `${log.args.orderHash.toLowerCase()}_${log.args.orderNonce.toBigInt()}`;

  const item = TakerAsk.create({
    id,
    blockHeight: BigInt(log.blockNumber),
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

export async function handleCancelAllOrdersLog(log: CancelAllOrdersLog): Promise<void> {
  logger.info(`CancelAllOrdersLog at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const id = `${log.args.user.toLowerCase()}_${log.args.newMinNonce.toBigInt()}`;

  const item = CancelAllOrders.create({
    id,
    blockHeight: BigInt(log.blockNumber),
    user: log.args.user.toLowerCase(),
    newMinNonce: log.args.newMinNonce.toBigInt(),
  });
  await item.save();
}

export async function handleCancelMultipleOrdersLog(log: CancelMultipleOrdersLog): Promise<void> {
  logger.info(`CancelMultipleOrdersLog at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const id = `${log.args.user.toLowerCase()}_${log.transactionHash.toLowerCase()}`;
  let orderNonces = [];
  for (let j=0;j<log.args.orderNonces.length; j++) {
    orderNonces.push(log.args.orderNonces[j].toBigInt());
  }

  const item = CancelMultipleOrders.create({
    id,
    blockHeight: BigInt(log.blockNumber),
    user: log.args.user.toLowerCase(),
    orderNonces: orderNonces,
  });
  await item.save();
}

export async function handleRoyaltyPaymentLog(log: RoyaltyPaymentLog): Promise<void> {
  logger.info(`RoyaltyPaymentLog at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const id = `${log.args.collection.toLowerCase()}_${log.args.tokenId.toBigInt()}_${log.transactionHash.toLowerCase()}_${log.logIndex}`;

  const item = RoyaltyPayment.create({
    id,
    blockHeight: BigInt(log.blockNumber),
    collection: log.args.collection.toLowerCase(),
    tokenId: log.args.tokenId.toBigInt(),
    royaltyRecipient: log.args.royaltyRecipient.toLowerCase(),
    currency: log.args.currency.toLowerCase(),
    amount: log.args.amount.toBigInt(),
  });
  await item.save();
}
