import { DataRegistry, DataRegistryNFTData, Transfer } from "../types";

import {
  WriteLog,
  ComposeLog,
  DeriveLog,
  ReclaimLog,
  TransferLog,
  URIUpdatedLog,
} from "../types/abi-interfaces/DataRegistryAbi";

import { WriteBatchLog } from "../types/abi-interfaces/DataRegistryV2Abi";

import assert, { deepStrictEqual } from "assert";
import { getNFT, ADDRESS_ZERO, CHAIN_LIST } from "./utils";
import { EthereumLog } from "@subql/types-ethereum";

export async function handleSafeWriteAvax(log: WriteLog) {
  await handleSafeWrite(CHAIN_LIST.AVAX, log);
}
export async function handleSafeWriteBnb(log: WriteLog) {
  await handleSafeWrite(CHAIN_LIST.BNB, log);
}
export async function handleSafeWriteAvaxTestnet(log: WriteLog) {
  await handleSafeWrite(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleSafeWriteBnbTestnet(log: WriteLog) {
  await handleSafeWrite(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleSafeWrite(
  chainId: number,
  log: WriteLog
): Promise<void> {
  logger.info(`New Write log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const dataRegistryId = log.address.toLowerCase();

  const data = createNFTData(
    chainId,
    dataRegistryId,
    log.args.nftCollection,
    log.args.tokenId.toBigInt(),
    log.args.key,
    log.args.value,
    log
  );
  await data.save();
}

export async function handleWriteBatchAvax(log: WriteBatchLog) {
  await handleWriteBatch(CHAIN_LIST.AVAX, log);
}
export async function handleWriteBatchBnb(log: WriteBatchLog) {
  await handleWriteBatch(CHAIN_LIST.BNB, log);
}
export async function handleWriteBatchAvaxTestnet(log: WriteBatchLog) {
  await handleWriteBatch(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleWriteBatchBnbTestnet(log: WriteBatchLog) {
  await handleWriteBatch(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleWriteBatch(
  chainId: number,
  log: WriteBatchLog
): Promise<void> {
  logger.info(`New WriteBatch log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const dataRegistryId = log.address.toLowerCase();

  let datas: DataRegistryNFTData[] = [];
  for (
    let j = log.args.startId.toBigInt();
    j <= log.args.endId.toBigInt();
    j++
  ) {
    datas.push(
      createNFTData(
        chainId,
        dataRegistryId,
        log.args.collection,
        j,
        log.args.key,
        log.args.value,
        log
      )
    );
  }

  await store.bulkCreate("DataRegistryNFTData", datas);
}

function createNFTData(
  chainId: number,
  dataRegistryId: string,
  collection: string,
  tokenId: bigint,
  key: string,
  value: string,
  log: EthereumLog
) {
  return DataRegistryNFTData.create({
    id: `${chainId}-${dataRegistryId}-${collection.toLowerCase()}-${tokenId}-${key.toLowerCase()}`,
    chainId,
    blockHeight: BigInt(log.blockNumber),
    timestamp: log.block.timestamp,
    dataRegistryId,
    collection: collection.toLowerCase(),
    tokenId,
    key: key.toLowerCase(),
    value: value.toLowerCase(),
    txHash: log.transactionHash.toLowerCase(),
  });
}

export async function handleComposeAvax(log: ComposeLog) {
  await handleCompose(CHAIN_LIST.AVAX, log);
}
export async function handleComposeBnb(log: ComposeLog) {
  await handleCompose(CHAIN_LIST.BNB, log);
}
export async function handleComposeAvaxTestnet(log: ComposeLog) {
  await handleCompose(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleComposeBnbTestnet(log: ComposeLog) {
  await handleCompose(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleCompose(
  chainId: number,
  log: ComposeLog
): Promise<void> {
  logger.info(`New Compose log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const dataRegistryId = log.address.toLowerCase();

  for (let j = 0; j < log.args.keyNames.length; j++) {
    await composeNFTDataByKey(
      chainId,
      dataRegistryId,
      log.args.srcCollection,
      log.args.srcTokenId.toBigInt(),
      log.args.descCollection,
      log.args.descTokenId.toBigInt(),
      log.args.keyNames[j],
      log
    );
  }
}

async function composeNFTDataByKey(
  chainId: number,
  registry: string,
  srcCollection: string,
  srcTokenId: bigint,
  destCollection: string,
  destTokenId: bigint,
  key: string,
  log: ComposeLog
): Promise<boolean> {
  const srcId = getDataId(chainId, registry, srcCollection, srcTokenId, key);
  const destId = getDataId(chainId, registry, destCollection, destTokenId, key);
  const dataRegistryId = registry.toLowerCase();

  let srcData = await DataRegistryNFTData.get(srcId);
  let destData = await DataRegistryNFTData.get(destId);

  if (!srcData) {
    logger.error(`Source data ${srcId} is not found`);
    return false;
  }

  if (!destData) {
    logger.info(`Create destination data ${destId}`);
    destData = DataRegistryNFTData.create({
      id: destId,
      chainId: chainId,
      blockHeight: BigInt(log.blockNumber),
      timestamp: log.block.timestamp,
      dataRegistryId,
      collection: destCollection.toLowerCase(),
      tokenId: destTokenId,
      key: key.toLowerCase(),
      txHash: log.transactionHash.toLowerCase(),
    });

    await destData.save();
  }

  logger.info(
    `Compose key ${key} from source ${srcCollection}-${srcTokenId} to dest ${destCollection}-${destTokenId}`
  );
  destData.value = srcData.value;
  await destData.save();

  srcData.key = "";
  srcData.value = "";
  await srcData.save();
  return true;
}

function getDataId(
  chainId: number,
  registry: string,
  collection: string,
  tokenId: bigint,
  key: string
): string {
  return `${chainId}-${registry.toLowerCase()}-${collection.toLowerCase()}-${tokenId}-${key.toLowerCase()}`;
}

export async function handleDeriveAvax(log: DeriveLog) {
  await handleDerive(CHAIN_LIST.AVAX, log);
}
export async function handleDeriveBnb(log: DeriveLog) {
  await handleDerive(CHAIN_LIST.BNB, log);
}
export async function handleDeriveAvaxTestnet(log: DeriveLog) {
  await handleDerive(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleDeriveBnbTestnet(log: DeriveLog) {
  await handleDerive(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleDerive(
  chainId: number,
  log: DeriveLog
): Promise<void> {
  logger.info(`New Derive log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const underlying = await getNFT(
    chainId,
    log.args.underlyingCollection,
    log.args.underlyingTokenId.toBigInt()
  );
  const derived = await getNFT(
    chainId,
    log.args.derivedCollection,
    log.args.derivedTokenId.toBigInt()
  );

  derived.blockHeight = BigInt(log.blockNumber);
  derived.timestamp = log.block.timestamp;
  derived.isDerived = true;
  derived.underlyingNFTId = underlying.id;
  await derived.save();
}

export async function handleReclaimAvax(log: ReclaimLog) {
  await handleReclaim(CHAIN_LIST.AVAX, log);
}
export async function handleReclaimBnb(log: ReclaimLog) {
  await handleReclaim(CHAIN_LIST.BNB, log);
}
export async function handleReclaimAvaxTestnet(log: ReclaimLog) {
  await handleReclaim(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleReclaimBnbTestnet(log: ReclaimLog) {
  await handleReclaim(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleReclaim(
  chainId: number,
  log: ReclaimLog
): Promise<void> {
  logger.info(`New Reclaim log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const derived = await getNFT(
    chainId,
    log.args.derivedCollection,
    log.args.derivedTokenId.toBigInt()
  );

  derived.blockHeight = BigInt(log.blockNumber);
  derived.timestamp = log.block.timestamp;
  derived.isBurned = true;
  await derived.save();
}

export async function handleTransferDerivedAvax(log: TransferLog) {
  await handleTransferDerived(CHAIN_LIST.AVAX, log);
}
export async function handleTransferDerivedBnb(log: TransferLog) {
  await handleTransferDerived(CHAIN_LIST.BNB, log);
}
export async function handleTransferDerivedAvaxTestnet(log: TransferLog) {
  await handleTransferDerived(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleTransferDerivedBnbTestnet(log: TransferLog) {
  await handleTransferDerived(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleTransferDerived(
  chainId: number,
  log: TransferLog
): Promise<void> {
  logger.info(`New Transfer-derived log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const event = Transfer.create({
    id: `${chainId}-${log.address.toLowerCase()}-${log.args.tokenId.toString()}-${
      log.blockNumber
    }`,
    chainId,
    blockHeight: BigInt(log.blockNumber),
    timestamp: log.block.timestamp,
    collection: log.address.toLowerCase(),
    tokenId: log.args.tokenId.toBigInt(),
    from: log.args.from.toLowerCase(),
    to: log.args.to.toLowerCase(),
  });
  await event.save();

  logger.info(
    `NFT ${log.args.tokenId} is transfered on collection ${log.address}`
  );
  const nft = await getNFT(
    chainId,
    log.address,
    log.args.tokenId.toBigInt(),
    true
  );
  nft.blockHeight = BigInt(log.blockNumber);
  nft.timestamp = log.block.timestamp;
  nft.owner = log.args.to.toLowerCase();

  if (log.args.to == ADDRESS_ZERO) {
    nft.isBurned = true;
  }

  await nft.save();
}

export async function handleURIUpdatedAvax(log: URIUpdatedLog) {
  await handleURIUpdated(CHAIN_LIST.AVAX, log);
}
export async function handleURIUpdatedBnb(log: URIUpdatedLog) {
  await handleURIUpdated(CHAIN_LIST.BNB, log);
}
export async function handleURIUpdatedAvaxTestnet(log: URIUpdatedLog) {
  await handleURIUpdated(CHAIN_LIST.AVAX_TESTNET, log);
}
export async function handleURIUpdatedBnbTestnet(log: URIUpdatedLog) {
  await handleURIUpdated(CHAIN_LIST.BNB_TESTNET, log);
}
export async function handleURIUpdated(
  chainId: number,
  log: URIUpdatedLog
): Promise<void> {
  logger.info(`New URI-Updated log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const dataRegistryId = log.address.toLowerCase();
  const dataRegistry = await getDataRegistry(dataRegistryId);
  if (dataRegistry == undefined) {
    logger.error(`DataRegistry ${dataRegistryId} not found`);
    return;
  }

  dataRegistry.uri = log.args.uri;
  await dataRegistry.save();
}

async function getDataRegistry(id: string): Promise<DataRegistry | undefined> {
  let dataRegistry = await DataRegistry.get(id.toLowerCase());
  return dataRegistry;
}
