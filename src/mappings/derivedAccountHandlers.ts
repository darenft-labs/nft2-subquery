import { DerivedAccount, DerivedAccountRoyaltyClaimed } from "../types";
import { RoyaltyClaimedLog } from "../types/abi-interfaces/DerivedAccountAbi";
import assert from "assert";
import { CHAIN_LIST } from "./utils";

export async function handleRoyaltyClaimedAvax(log: RoyaltyClaimedLog) {
  await handleRoyaltyClaimed(CHAIN_LIST.AVAX, log);
}
export async function handleRoyaltyClaimedBnb(log: RoyaltyClaimedLog) {
  await handleRoyaltyClaimed(CHAIN_LIST.BNB, log);
}
export async function handleRoyaltyClaimedAvaxTestnet(log: RoyaltyClaimedLog) {
  await handleRoyaltyClaimed(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleRoyaltyClaimedBnbTestnet(log: RoyaltyClaimedLog) {
  await handleRoyaltyClaimed(CHAIN_LIST.BNB_TESTNET, log);
}

export async function handleRoyaltyClaimed(
  chainId: number,
  log: RoyaltyClaimedLog
): Promise<void> {
  logger.info(`New Royalty-claimed log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  let account = await DerivedAccount.get(`${log.address.toLowerCase()}`);
  if (!account) {
    logger.error(`Derived account ${log.address} is not found`);
    return;
  }

  let record = await DerivedAccountRoyaltyClaimed.get(
    getRoyaltyClaimedId(chainId, log)
  );
  if (!record) {
    record = DerivedAccountRoyaltyClaimed.create({
      id: getRoyaltyClaimedId(chainId, log),
      chainId,
      blockHeight: BigInt(log.blockNumber),
      timestamp: log.block.timestamp,
      derivedAccountId: account.id,
      token: log.args.requestToken.toLowerCase(),
      amount: log.args.amount.toBigInt(),
      receiver: log.args.receiver.toLowerCase(),
      txHash: log.transactionHash.toLowerCase(),
    });
    await record.save();
  }
}

function getRoyaltyClaimedId(chainId: number, log: RoyaltyClaimedLog) {
  return `${chainId}-${log.transactionHash.toLowerCase()}-${log.logIndex}`;
}
