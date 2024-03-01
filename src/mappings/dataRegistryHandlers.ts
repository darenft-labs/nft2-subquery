import { 
  DataRegistry, 
  NFT, 
  DataRegistryNFTData,
  DataRegistryNFTInscription,
} from "../types";

import {
  WriteLog,
  ComposeLog,
  DeriveLog,
  ReclaimLog,
  TransferLog,
  URIUpdatedLog,
} from "../types/abi-interfaces/DataRegistryAbi";

import {
  WriteBatchLog,
} from "../types/abi-interfaces/DataRegistryV2Abi";

import assert, { deepStrictEqual } from "assert";
import { getNFT, ADDRESS_ZERO } from "./utils";
import { EthereumLog } from "@subql/types-ethereum";
import { BigNumber } from "ethers";

export async function handleSafeWrite(log: WriteLog): Promise<void> {
  logger.info(`New Write log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const dataRegistryId = log.address.toLowerCase();
  //const dataRegistry = await getDataRegistry(dataRegistryId);
  
  await createNFTData(dataRegistryId, log.args.nftCollection, log.args.tokenId.toBigInt(), log.args.key, log.args.value, log);
}

export async function handleWriteBatch(log: WriteBatchLog): Promise<void> {
  logger.info(`New WriteBatch log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const dataRegistryId = log.address.toLowerCase();
  //const dataRegistry = await getDataRegistry(dataRegistryId);

  for (let j=log.args.startId.toBigInt(); j<=log.args.endId.toBigInt(); j++) {
    await createNFTData(dataRegistryId, log.args.collection, j, log.args.key, log.args.value, log)
  }
}

async function createNFTData(dataRegistryId: string, collection: string, tokenId: bigint, key: string, value: string, log: EthereumLog): Promise<void> {
  const data = DataRegistryNFTData.create({
    id: `${dataRegistryId}-${collection.toLowerCase()}-${tokenId}-${key.toLowerCase()}`,
    blockHeight: BigInt(log.blockNumber),
    dataRegistryId,
    collection: collection.toLowerCase(),
    tokenId,
    key: key.toLowerCase(),
    value: value.toLowerCase(),
    txHash: log.transactionHash.toLowerCase(),
  });

  return data.save();
}


export async function handleCompose(log: ComposeLog): Promise<void> {
  logger.info(`New Compose log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const dataRegistryId = log.address.toLowerCase();
  const dataRegistry = await getDataRegistry(dataRegistryId);
  const srcCollection = log.args.srcCollection;
  const srcTokenId = log.args.srcTokenId.toBigInt();
  const destCollection = log.args.descCollection;
  const destTokenId = log.args.descTokenId.toBigInt();
  
  for (let j=0;j<log.args.keyNames.length; j++) {
    await composeNFTDataByKey(dataRegistryId, log.args.srcCollection, log.args.srcTokenId.toBigInt(), log.args.descCollection, log.args.descTokenId.toBigInt(), log.args.keyNames[j], log);
  }
}

export async function handleDerive(log: DeriveLog): Promise<void> {
  logger.info(`New Derive log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const underlying = await getNFT(log.args.underlyingCollection, log.args.underlyingTokenId.toBigInt());
  const derived = await getNFT(log.args.derivedCollection, log.args.derivedTokenId.toBigInt());

  derived.isDerived = true;
  derived.underlyingNFTId = underlying.id;
  await derived.save();
}

export async function handleReclaim(log: ReclaimLog): Promise<void> {
  logger.info(`New Reclaim log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const underlying = await getNFT(log.args.underlyingCollection, log.args.underlyingTokenId.toBigInt());
  const derived = await getNFT(log.args.derivedCollection, log.args.derivedTokenId.toBigInt());

  derived.blockHeight = BigInt(log.blockNumber);
  derived.isBurned = true;  
  await derived.save();
}

export async function handleTransferDerived(log: TransferLog): Promise<void> {
  logger.info(`New Transfer-derived log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  logger.info(`NFT ${log.args.tokenId} is transfered on collection ${log.address}`);
  const nft = await getNFT(log.address, log.args.tokenId.toBigInt());
  nft.blockHeight = BigInt(log.blockNumber);
  nft.owner = log.args.to.toLowerCase();

  if (log.args.to == ADDRESS_ZERO) {
    nft.isBurned = true;
  }
  
  await nft.save();
}

async function getDataRegistry(id: string): Promise<DataRegistry | undefined> {
  let dataRegistry = await DataRegistry.get(id.toLowerCase());
  return dataRegistry;
}

async function composeNFTDataByKey(registry: string, srcCollection: string, srcTokenId: bigint, destCollection: string, destTokenId: bigint, key: string, log:ComposeLog): Promise<boolean> {
  const srcId = getDataId(registry, srcCollection, srcTokenId, key);
  const destId = getDataId(registry, destCollection, destTokenId, key);
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
      blockHeight: BigInt(log.blockNumber),
      dataRegistryId,
      collection: destCollection.toLowerCase(),
      tokenId: destTokenId,
      key: key.toLowerCase(),
      txHash: log.transactionHash.toLowerCase(),
    });
  
    await destData.save();
  }

  logger.info(`Compose key ${key} from source ${srcCollection}-${srcTokenId} to dest ${destCollection}-${destTokenId}`);
  destData.value = srcData.value;
  await destData.save();

  srcData.key = "";
  srcData.value = "";
  await srcData.save();
  return true;
}

function getDataId(registry: string, collection: string, tokenId: bigint, key: string): string {
  return `${registry.toLowerCase()}-${collection.toLowerCase()}-${tokenId}-${key.toLowerCase()}`;
}

export async function handleURIUpdated(log: URIUpdatedLog): Promise<void> {
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

