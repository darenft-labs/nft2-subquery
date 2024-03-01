import {
  DataRegistry,
  Collection,
  DerivedAccount,
  createDataRegistryDatasource,
  createCollectionDatasource,
  createDerivedAccountDatasource,
  createDataRegistryV2Datasource,
} from "../types";
import {
  DataRegistryCreatedLog,
  DataRegistryV2CreatedLog,
  CollectionCreatedLog,
  DerivedAccountCreatedLog,
} from "../types/abi-interfaces/FactoryAbi";
import assert from "assert";

export async function handleDataRegistryCreated(log: DataRegistryCreatedLog): Promise<void> {
  logger.info(`DataRegistryCreatedLog at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const registryAddr = log.args.registry.toLowerCase();

  const item = DataRegistry.create({
    id: registryAddr,
    blockHeight: BigInt(log.blockNumber),
    dapp: log.args.dapp.toLowerCase(),
    address: registryAddr,
    uri: log.args.dappURI,
    version: "v1",
  });

  await item.save();

  await createDataRegistryDatasource({
    address: log.args.registry,
  });
}

export async function handleDataRegistryV2Created(log: DataRegistryV2CreatedLog): Promise<void> {
  logger.info(`DataRegistryV2CreatedLog at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const registryAddr = log.args.registry.toLowerCase();

  const item = DataRegistry.create({
    id: registryAddr,
    blockHeight: BigInt(log.blockNumber),
    dapp: log.args.dapp.toLowerCase(),
    address: registryAddr,
    uri: log.args.dappURI,
    version: "v2",
  });

  await item.save();

  await createDataRegistryV2Datasource({
    address: log.args.registry,
  });
}

export async function handleCollectionCreated(log: CollectionCreatedLog): Promise<void> {
  logger.info(`New Collection-created log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const collectionAddr = log.args.collection.toLowerCase();

  const item = Collection.create({
    id: collectionAddr,
    blockHeight: BigInt(log.blockNumber),
    address: collectionAddr,
    owner: log.args.owner.toLowerCase(),
    kind: log.args.kind,
  });

  await item.save();

  await createCollectionDatasource({
    address: log.args.collection,
  });
}

export async function handleDerivedAccountCreated(log: DerivedAccountCreatedLog): Promise<void> {
  logger.info(`New Derived-account-created log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const addr = log.args.derivedAccount.toLowerCase();

  const item = DerivedAccount.create({
    id: addr,
    blockHeight: BigInt(log.blockNumber),
    address: addr,
    underlyingCollection: log.args.underlyingCollection.toLowerCase(),
    underlyingTokenId: log.args.underlyingTokenId.toBigInt(),
  });

  await item.save();

  await createDerivedAccountDatasource({
    address: log.args.derivedAccount,
  });
}
