import { DataRegistry } from "../types";
import {
  DataRegistryCreatedLog,  
} from "../types/abi-interfaces/FactoryAbi";
import assert from "assert";

export async function handleDataRegistryCreated(log: DataRegistryCreatedLog): Promise<void> {
  logger.info(`New Data-registry-created log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const transaction = DataRegistry.create({
    id: log.transactionHash,
    blockHeight: BigInt(log.blockNumber),
    dapp: log.args.dapp,
    address: log.args.registry,
    uri: log.args.dappURI,
  });

  await transaction.save();
}
