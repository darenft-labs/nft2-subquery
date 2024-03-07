import {
  DataRegistry,
  Collection,
  DerivedAccount,
  AddonsCollection,
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
  AddonsCreatedLog,
} from "../types/abi-interfaces/FactoryAbi";
import assert from "assert";

export async function handleDataRegistryCreated(log: DataRegistryCreatedLog): Promise<void> {
  logger.info(`DataRegistryCreatedLog at block ${log.blockNumber}`);

  if (log.args != undefined) {
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
  } else {
    console.log(`logs invalid`);
  }
}

export async function handleDataRegistryV2Created(log: DataRegistryV2CreatedLog): Promise<void> {
  logger.info(`DataRegistryV2CreatedLog at block ${log.blockNumber}`);

  if (log.args != undefined) {
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
  } else {
    console.log(`logs invalid`);
  }
}

export async function handleCollectionCreated(log: CollectionCreatedLog): Promise<void> {
  logger.info(`CollectionCreatedLog at block ${log.blockNumber}`);
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
  logger.info(`DerivedAccountCreatedLog at block ${log.blockNumber}`);
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

export async function handleAddonsCreated(log: AddonsCreatedLog): Promise<void> {
  logger.info(`AddonsCreatedLog at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const addr = log.args.addons.toLowerCase();

  const item = AddonsCollection.create({
    id: addr,
    blockHeight: BigInt(log.blockNumber),
    contract: addr,
    collection: log.args.collection.toLowerCase(),
    kind: log.args.kind,
    campaignId: log.args.campaignId,
    data: log.args.data,
  });

  await item.save();
}
