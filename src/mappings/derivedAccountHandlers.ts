import { DerivedAccount, DerivedAccountRoyaltyClaimed } from "../types";
import {
  RoyaltyClaimedLog,  
} from "../types/abi-interfaces/DerivedAccountAbi";
import assert from "assert";
import { getNFT, ADDRESS_ZERO, getRoyaltyClaimedId } from "./utils";

export async function handleRoyaltyClaimed(log: RoyaltyClaimedLog) : Promise<void> {
  logger.info(`New Royalty-claimed log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  let account = await DerivedAccount.get(`${log.address.toLowerCase()}`);
  if (!account) {
    logger.error(`Derived account ${log.address} is not found`);
    return;
  }

  let record = await DerivedAccountRoyaltyClaimed.get(getRoyaltyClaimedId(log));
  if (!record) {
    record = DerivedAccountRoyaltyClaimed.create({
      id: getRoyaltyClaimedId(log),
      blockHeight: BigInt(log.blockNumber),
      derivedAccountId: account.id,
      token: log.args.requestToken.toLowerCase(),
      amount: log.args.amount.toBigInt(),
      receiver: log.args.receiver.toLowerCase(),
      txHash: log.transactionHash.toLowerCase(),
    });
    await record.save();
  }
}