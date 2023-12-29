import { DataRegistry, createDataRegistryDatasource } from "../types";
import {
  DataRegistryCreatedLog,  
} from "../types/abi-interfaces/FactoryAbi";
import assert from "assert";

export async function handleDataRegistryCreated(log: DataRegistryCreatedLog): Promise<void> {
  logger.info(`New Data-registry-created log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const registryAddr = log.args.registry.toLowerCase();

  const registry = DataRegistry.create({
    id: registryAddr,
    blockHeight: BigInt(log.blockNumber),
    dapp: log.args.dapp,
    address: registryAddr,
    uri: log.args.dappURI,
  });

  await registry.save();

  await createDataRegistryDatasource({
    address: log.args.registry,
  });
}
