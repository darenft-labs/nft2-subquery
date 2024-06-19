import {
  DataRegistry,
  Collection,
  DerivedAccount,
  AddonsCollection,
  createDataRegistryDatasource,
  createCollectionDatasource,
  createDerivedAccountDatasource,
  createDataRegistryV2Datasource,
  ERC6551Account,
} from "../types";
import {
  DataRegistryCreatedLog,
  DataRegistryV2CreatedLog,
  CollectionCreatedLog,
  DerivedAccountCreatedLog,
  AddonsCreatedLog,
  ERC6551AccountCreatedLog,
} from "../types/abi-interfaces/FactoryAbi";
import assert from "assert";
import { CHAIN_LIST, getNFT } from "./utils";

export async function handleDataRegistryCreatedAvax(
  log: DataRegistryCreatedLog
) {
  await handleDataRegistryCreated(CHAIN_LIST.AVAX, log);
}
export async function handleDataRegistryCreatedBnb(
  log: DataRegistryCreatedLog
) {
  await handleDataRegistryCreated(CHAIN_LIST.BNB, log);
}
export async function handleDataRegistryCreatedAvaxTestnet(
  log: DataRegistryCreatedLog
) {
  await handleDataRegistryCreated(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleDataRegistryCreatedBnbTestnet(
  log: DataRegistryCreatedLog
) {
  await handleDataRegistryCreated(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleDataRegistryCreated(
  chainId: number,
  log: DataRegistryCreatedLog
): Promise<void> {
  logger.info(`DataRegistryCreatedLog at block ${log.blockNumber}`);

  if (log.args != undefined) {
    const registryAddr = log.args.registry.toLowerCase();

    const item = DataRegistry.create({
      id: registryAddr,
      chainId,
      blockHeight: BigInt(log.blockNumber),
      timestamp: log.block.timestamp,
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

export async function handleDataRegistryV2CreatedAvax(
  log: DataRegistryV2CreatedLog
) {
  await handleDataRegistryV2Created(CHAIN_LIST.AVAX, log);
}
export async function handleDataRegistryV2CreatedBnb(
  log: DataRegistryV2CreatedLog
) {
  await handleDataRegistryV2Created(CHAIN_LIST.BNB, log);
}
export async function handleDataRegistryV2CreatedAvaxTestnet(
  log: DataRegistryV2CreatedLog
) {
  await handleDataRegistryV2Created(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleDataRegistryV2CreatedBnbTestnet(
  log: DataRegistryV2CreatedLog
) {
  await handleDataRegistryV2Created(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleDataRegistryV2Created(
  chainId: number,
  log: DataRegistryV2CreatedLog
): Promise<void> {
  logger.info(`DataRegistryV2CreatedLog at block ${log.blockNumber}`);

  if (log.args != undefined) {
    const registryAddr = log.args.registry.toLowerCase();

    const item = DataRegistry.create({
      id: registryAddr,
      chainId,
      blockHeight: BigInt(log.blockNumber),
      timestamp: log.block.timestamp,
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

export async function handleCollectionCreatedAvax(log: CollectionCreatedLog) {
  await handleCollectionCreated(CHAIN_LIST.AVAX, log);
}
export async function handleCollectionCreatedBnb(log: CollectionCreatedLog) {
  await handleCollectionCreated(CHAIN_LIST.BNB, log);
}
export async function handleCollectionCreatedAvaxTestnet(
  log: CollectionCreatedLog
) {
  await handleCollectionCreated(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleCollectionCreatedBnbTestnet(
  log: CollectionCreatedLog
) {
  await handleCollectionCreated(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleCollectionCreated(
  chainId: number,
  log: CollectionCreatedLog
): Promise<void> {
  logger.info(`CollectionCreatedLog at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const collectionAddr = log.args.collection.toLowerCase();

  const item = Collection.create({
    id: collectionAddr,
    chainId,
    blockHeight: BigInt(log.blockNumber),
    timestamp: log.block.timestamp,
    address: collectionAddr,
    owner: log.args.owner.toLowerCase(),
    kind: log.args.kind,
  });

  await item.save();

  await createCollectionDatasource({
    address: log.args.collection,
  });
}

export async function handleDerivedAccountCreatedAvax(
  log: DerivedAccountCreatedLog
) {
  await handleDerivedAccountCreated(CHAIN_LIST.AVAX, log);
}
export async function handleDerivedAccountCreatedBnb(
  log: DerivedAccountCreatedLog
) {
  await handleDerivedAccountCreated(CHAIN_LIST.BNB, log);
}
export async function handleDerivedAccountCreatedAvaxTestnet(
  log: DerivedAccountCreatedLog
) {
  await handleDerivedAccountCreated(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleDerivedAccountCreatedBnbTestnet(
  log: DerivedAccountCreatedLog
) {
  await handleDerivedAccountCreated(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleDerivedAccountCreated(
  chainId: number,
  log: DerivedAccountCreatedLog
): Promise<void> {
  logger.info(`DerivedAccountCreatedLog at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const addr = log.args.derivedAccount.toLowerCase();
  const underlyingNFT = await getNFT(
    chainId,
    log.args.underlyingCollection,
    log.args.underlyingTokenId.toBigInt()
  );

  const item = DerivedAccount.create({
    id: addr,
    chainId,
    blockHeight: BigInt(log.blockNumber),
    timestamp: log.block.timestamp,
    address: addr,
    underlyingNFTId: underlyingNFT.id,
  });

  await item.save();

  await createDerivedAccountDatasource({
    address: log.args.derivedAccount,
  });
}

export async function handleAddonsCreatedAvax(log: AddonsCreatedLog) {
  await handleAddonsCreated(CHAIN_LIST.AVAX, log);
}
export async function handleAddonsCreatedBnb(log: AddonsCreatedLog) {
  await handleAddonsCreated(CHAIN_LIST.BNB, log);
}
export async function handleAddonsCreatedAvaxTestnet(log: AddonsCreatedLog) {
  await handleAddonsCreated(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleAddonsCreatedBnbTestnet(log: AddonsCreatedLog) {
  await handleAddonsCreated(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleAddonsCreated(
  chainId: number,
  log: AddonsCreatedLog
): Promise<void> {
  logger.info(`AddonsCreatedLog at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const addr = log.args.addons.toLowerCase();

  const item = AddonsCollection.create({
    id: addr,
    chainId,
    blockHeight: BigInt(log.blockNumber),
    timestamp: log.block.timestamp,
    contract: addr,
    collection: log.args.collection.toLowerCase(),
    kind: log.args.kind,
    campaignId: log.args.campaignId,
    data: log.args.data,
  });

  await item.save();
}

export async function handleERC6551AccountCreatedAvax(
  log: ERC6551AccountCreatedLog
) {
  await handleERC6551AccountCreated(CHAIN_LIST.AVAX, log);
}
export async function handleERC6551AccountCreatedBnb(
  log: ERC6551AccountCreatedLog
) {
  await handleERC6551AccountCreated(CHAIN_LIST.BNB, log);
}
export async function handleERC6551AccountCreatedAvaxTestnet(
  log: ERC6551AccountCreatedLog
) {
  await handleERC6551AccountCreated(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleERC6551AccountCreatedBnbTestnet(
  log: ERC6551AccountCreatedLog
) {
  await handleERC6551AccountCreated(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleERC6551AccountCreated(
  chainId: number,
  log: ERC6551AccountCreatedLog
): Promise<void> {
  logger.info(`ERC6551AccountCreatedLog at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const addr = log.args.account.toLowerCase();
  const underlyingNFT = await getNFT(
    chainId,
    log.args.tokenContract,
    log.args.tokenId.toBigInt()
  );

  const item = ERC6551Account.create({
    id: addr,
    chainId,
    blockHeight: BigInt(log.blockNumber),
    timestamp: log.block.timestamp,
    account: addr,
    implementation: log.args.implementation,
    salt: log.args.salt,
    underlyingNFTId: underlyingNFT.id,
  });

  await item.save();
}
